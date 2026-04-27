use anyhow::{Context, Result};
use bytes::Bytes;
use calamine::{open_workbook_from_rs, Reader, Xlsx};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::io::Cursor;
use uuid::Uuid;

use crate::{config, db, embed};

#[derive(Debug, Deserialize, Serialize)]
pub struct UploadMessage {
    pub upload_id: String,
    pub user_id: String,
    pub title: String,
    pub description: String,
    pub summary: Option<String>,
    pub publisher: Option<String>,
    pub tags: Vec<String>,
    pub attachments: Vec<AttachmentInfo>,
    pub thumbnail_s3_key: Option<String>,
    pub callback_url: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AttachmentInfo {
    pub s3_key: String,
    pub presigned_url: String,
    pub mime_type: String,
    pub file_type: String,
}

#[derive(Debug, Serialize)]
struct CallbackPayload {
    upload_id: String,
    dataset_id: Option<String>,
    status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

pub async fn process_upload(pool: &PgPool, msg: UploadMessage) -> Result<Uuid> {
    let cfg = &*config::CONFIG;
    let upload_external_id = format!("upload:{}", msg.upload_id);

    let user_id: Option<&str> = if msg.user_id == "anonymous" || msg.user_id.is_empty() {
        None
    } else {
        Some(msg.user_id.as_str())
    };

    let source_id = db::insert_source_for_upload(pool, user_id, &msg.title)
        .await
        .context("Failed to insert source")?;

    let s3_keys: Vec<String> = msg.attachments.iter().map(|a| a.s3_key.clone()).collect();
    let file_types: Vec<String> = msg.attachments.iter().map(|a| a.file_type.clone()).collect();

    let dataset_id = db::insert_upload_dataset(
        pool,
        &upload_external_id,
        source_id,
        &msg.title,
        &msg.description,
        msg.summary.as_deref(),
        msg.publisher.as_deref(),
        &s3_keys,
        &file_types,
        msg.thumbnail_s3_key.as_deref(),
    )
    .await
    .context("Failed to insert upload dataset")?;

    let text = build_text_for_embedding(&msg);
    let text_vec = embed::embed_text_with_retry(&text, &cfg.gemini_api_key)
        .await
        .context("Failed to embed text")?;

    let mut all_vectors: Vec<Vec<f32>> = vec![text_vec];

    for attachment in &msg.attachments {
        match embed_attachment(attachment, &cfg.gemini_api_key).await {
            Ok(Some(vec)) => all_vectors.push(vec),
            Ok(None) => {
                tracing::info!(
                    "Skipped embedding for {} (unsupported type: {})",
                    attachment.s3_key,
                    attachment.mime_type
                );
            }
            Err(e) => {
                tracing::warn!("Failed to embed attachment {}: {:?}", attachment.s3_key, e);
            }
        }
    }

    let final_vector = average_vectors(all_vectors);

    db::update_embedding(pool, dataset_id, &final_vector)
        .await
        .context("Failed to update embedding")?;

    for tag_name in &msg.tags {
        match db::upsert_tag(pool, tag_name).await {
            Ok(tag_id) => {
                if let Err(e) = db::link_dataset_tag(pool, dataset_id, tag_id).await {
                    tracing::warn!("Failed to link tag '{}': {:?}", tag_name, e);
                }
            }
            Err(e) => tracing::warn!("Failed to upsert tag '{}': {:?}", tag_name, e),
        }
    }

    let callback_url = if msg.callback_url.is_empty() {
        cfg.server_callback_url.clone()
    } else {
        msg.callback_url.clone()
    };

    notify_server(&callback_url, &msg.upload_id, dataset_id, None).await;

    tracing::info!(
        "Upload complete: upload_id={} dataset_id={}",
        msg.upload_id,
        dataset_id
    );

    Ok(dataset_id)
}

fn build_text_for_embedding(msg: &UploadMessage) -> String {
    let mut parts = vec![msg.title.as_str(), msg.description.as_str()];
    if let Some(s) = msg.summary.as_deref() {
        parts.push(s);
    }
    if let Some(p) = msg.publisher.as_deref() {
        parts.push(p);
    }
    let joined = parts.join("\n");
    joined.chars().take(6000).collect()
}

async fn embed_attachment(attachment: &AttachmentInfo, api_key: &str) -> Result<Option<Vec<f32>>> {
    match attachment.mime_type.as_str() {
        "application/pdf" => {
            let bytes = download_file(&attachment.presigned_url).await?;
            let file_uri = upload_to_gemini_file_api(&bytes, "application/pdf", api_key).await?;
            let vec = embed::embed_file_with_retry(&file_uri, "application/pdf", api_key).await?;
            Ok(Some(vec))
        }
        "text/csv" | "application/json" | "text/plain" => {
            let bytes = download_file(&attachment.presigned_url).await?;
            let text: String = String::from_utf8_lossy(&bytes).chars().take(6000).collect();
            if text.trim().is_empty() {
                return Ok(None);
            }
            let vec = embed::embed_text_with_retry(&text, api_key).await?;
            Ok(Some(vec))
        }
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        | "application/vnd.ms-excel" => {
            let bytes = download_file(&attachment.presigned_url).await?;
            match extract_excel_text(&bytes) {
                Ok(text) if !text.trim().is_empty() => {
                    let truncated: String = text.chars().take(6000).collect();
                    let vec = embed::embed_text_with_retry(&truncated, api_key).await?;
                    Ok(Some(vec))
                }
                Ok(_) => Ok(None),
                Err(e) => {
                    tracing::warn!("Excel text extraction failed: {:?}", e);
                    Ok(None)
                }
            }
        }
        _ => Ok(None),
    }
}

async fn download_file(presigned_url: &str) -> Result<Bytes> {
    lazy_static::lazy_static! {
        static ref HTTP: reqwest::Client = reqwest::Client::new();
    }
    let resp = HTTP
        .get(presigned_url)
        .send()
        .await
        .context("Failed to download file from R2")?;

    if !resp.status().is_success() {
        anyhow::bail!("R2 download returned HTTP {}", resp.status());
    }

    resp.bytes().await.context("Failed to read file bytes")
}

async fn upload_to_gemini_file_api(data: &Bytes, mime_type: &str, api_key: &str) -> Result<String> {
    const UPLOAD_BASE: &str = "https://generativelanguage.googleapis.com/upload/v1beta/files";
    const API_BASE: &str = "https://generativelanguage.googleapis.com/v1beta/files";

    lazy_static::lazy_static! {
        static ref HTTP: reqwest::Client = reqwest::Client::new();
    }

    let size = data.len();

    let start_resp = HTTP
        .post(UPLOAD_BASE)
        .header("x-goog-api-key", api_key)
        .header("X-Goog-Upload-Protocol", "resumable")
        .header("X-Goog-Upload-Command", "start")
        .header("X-Goog-Upload-Header-Content-Length", size.to_string())
        .header("X-Goog-Upload-Header-Content-Type", mime_type)
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "file": { "display_name": "upload" }
        }))
        .send()
        .await
        .context("Gemini File API: failed to initiate resumable upload")?;

    let start_status = start_resp.status();
    if !start_status.is_success() {
        let body = start_resp.text().await.unwrap_or_default();
        anyhow::bail!("Gemini File API start returned {}: {}", start_status, body);
    }

    let upload_url = start_resp
        .headers()
        .get("x-goog-upload-url")
        .and_then(|v| v.to_str().ok())
        .context("Gemini File API: no X-Goog-Upload-URL in response headers")?;

    let put_resp = HTTP
        .put(upload_url)
        .header("Content-Length", size.to_string())
        .header("X-Goog-Upload-Offset", "0")
        .header("X-Goog-Upload-Command", "upload, finalize")
        .body(data.clone())
        .send()
        .await
        .context("Gemini File API: failed to PUT bytes")?;

    let put_status = put_resp.status();
    if !put_status.is_success() {
        let body = put_resp.text().await.unwrap_or_default();
        anyhow::bail!("Gemini File API PUT returned {}: {}", put_status, body);
    }

    // The finalize response nests the useful metadata inside `file`, while the poll response does not.
    // Keeping this note here saves a lot of time when the API shape looks inconsistent during debugging.
    #[derive(Deserialize)]
    struct FileInfo {
        file: FileData,
    }

    #[derive(Deserialize)]
    struct FileData {
        name: String,
        uri: String,
        #[serde(default)]
        state: String,
    }

    let file_info: FileInfo = put_resp
        .json()
        .await
        .context("Gemini File API: failed to parse file info response")?;

    if file_info.file.state == "ACTIVE" {
        return Ok(file_info.file.uri);
    }

    poll_file_until_active(&HTTP, API_BASE, api_key, &file_info.file.name).await
}

async fn poll_file_until_active(
    http: &reqwest::Client,
    api_base: &str,
    api_key: &str,
    file_name: &str,
) -> Result<String> {
    const MAX_ATTEMPTS: usize = 20;
    const POLL_INTERVAL_MS: u64 = 1500;

    for attempt in 0..MAX_ATTEMPTS {
        let resp = http
            .get(format!("{}/{}", api_base, file_name))
            .header("x-goog-api-key", api_key)
            .send()
            .await
            .context("Gemini File API: poll request failed")?;

        #[derive(Deserialize)]
        struct FileStatus {
            uri: String,
            state: String,
        }

        let status: FileStatus = resp.json().await?;

        if status.state == "ACTIVE" {
            return Ok(status.uri);
        }

        tracing::debug!(
            "Gemini File API: file state={} (attempt {}/{})",
            status.state,
            attempt + 1,
            MAX_ATTEMPTS
        );

        if attempt < MAX_ATTEMPTS - 1 {
            tokio::time::sleep(std::time::Duration::from_millis(POLL_INTERVAL_MS)).await;
        }
    }

    anyhow::bail!(
        "Gemini File API: file did not become ACTIVE within {} attempts",
        MAX_ATTEMPTS
    );
}

fn extract_excel_text(data: &[u8]) -> Result<String> {
    let cursor = Cursor::new(data);
    let mut workbook: Xlsx<_> =
        open_workbook_from_rs(cursor).context("Failed to open Excel workbook")?;

    let mut parts: Vec<String> = Vec::new();

    for sheet_name in workbook.sheet_names().to_vec() {
        if let Ok(range) = workbook.worksheet_range(&sheet_name) {
            for row in range.rows() {
                let cells: Vec<String> = row
                    .iter()
                    .filter_map(|cell| {
                        let s = cell.to_string();
                        if s.is_empty() {
                            None
                        } else {
                            Some(s)
                        }
                    })
                    .collect();
                if !cells.is_empty() {
                    parts.push(cells.join(" "));
                }
            }
        }
    }

    Ok(parts.join("\n"))
}

fn average_vectors(vectors: Vec<Vec<f32>>) -> Vec<f32> {
    assert!(!vectors.is_empty(), "Cannot average an empty vector list");
    let dim = vectors[0].len();
    let n = vectors.len() as f32;
    let mut result = vec![0f32; dim];
    for v in &vectors {
        for (i, val) in v.iter().enumerate() {
            result[i] += val;
        }
    }
    result.iter_mut().for_each(|x| *x /= n);
    result
}

async fn notify_server(callback_url: &str, upload_id: &str, dataset_id: Uuid, error: Option<&str>) {
    lazy_static::lazy_static! {
        static ref HTTP: reqwest::Client = reqwest::Client::new();
    }

    let payload = CallbackPayload {
        upload_id: upload_id.to_string(),
        dataset_id: Some(dataset_id.to_string()),
        status: if error.is_none() {
            "completed".to_string()
        } else {
            "failed".to_string()
        },
        error: error.map(str::to_string),
    };

    let secret = std::env::var("UPLOAD_CALLBACK_SECRET")
        .ok()
        .filter(|s| !s.is_empty())
        .expect("UPLOAD_CALLBACK_SECRET must be set and non-empty");

    let req = HTTP
        .post(callback_url)
        .json(&payload)
        .header("x-upload-callback-secret", secret);

    match req.send().await {
        Ok(resp) if resp.status().is_success() => {
            tracing::info!("Server notified successfully");
        }
        Ok(resp) => {
            tracing::warn!("Server callback returned HTTP {}", resp.status());
        }
        Err(e) => {
            tracing::warn!("Server callback failed (non-fatal): {:?}", e);
        }
    }
}
