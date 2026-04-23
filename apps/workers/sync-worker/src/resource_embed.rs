use anyhow::{Context, Result};
use bytes::Bytes;
use calamine::{open_workbook_from_rs, Reader, Xlsx};
use futures::stream::{self, StreamExt};
use serde::Deserialize;
use std::io::Cursor;
use std::time::Duration;

use crate::config;
use crate::embed;
use crate::sources::types::SourceDataset;

#[derive(Clone)]
struct ResourceCandidate {
    url: String,
    format: String,
}

pub async fn build_dataset_embedding(
    ds: &SourceDataset,
    metadata_text: &str,
    api_key: &str,
) -> Result<Vec<f32>> {
    let metadata_vector = embed::embed_text(metadata_text, api_key)
        .await
        .context("Failed to embed dataset metadata")?;

    let resources = supported_resources(ds);
    if resources.is_empty() {
        return Ok(metadata_vector);
    }

    let limit = config::CONFIG.resource_fetch_max_concurrent;
    let file_vectors = stream::iter(resources)
        .map(|resource| async move { embed_resource(&resource, api_key).await })
        .buffer_unordered(limit)
        .collect::<Vec<_>>()
        .await;

    let mut all_vectors = vec![metadata_vector];
    for result in file_vectors {
        match result {
            Ok(Some(vector)) => all_vectors.push(vector),
            Ok(None) => {}
            Err(error) => tracing::warn!("Resource embedding skipped: {}", error),
        }
    }

    Ok(average_vectors(all_vectors))
}

fn supported_resources(ds: &SourceDataset) -> Vec<ResourceCandidate> {
    ds.resource_urls
        .iter()
        .zip(ds.resource_formats.iter())
        .filter_map(|(url, format)| {
            let normalized = format.to_lowercase();
            match normalized.as_str() {
                "pdf" | "csv" | "json" | "xlsx" | "xls" => Some(ResourceCandidate {
                    url: url.clone(),
                    format: normalized,
                }),
                _ => None,
            }
        })
        .take(config::CONFIG.max_resources_per_dataset)
        .collect()
}

async fn embed_resource(resource: &ResourceCandidate, api_key: &str) -> Result<Option<Vec<f32>>> {
    match resource.format.as_str() {
        "pdf" => {
            let bytes = download_file(&resource.url).await?;
            let file_uri = upload_to_gemini_file_api(&bytes, "application/pdf", api_key).await?;
            let vec = embed::embed_file_with_retry(&file_uri, "application/pdf", api_key).await?;
            Ok(Some(vec))
        }
        "csv" => embed_plain_text_resource(resource, api_key, "text/csv").await,
        "json" => embed_plain_text_resource(resource, api_key, "application/json").await,
        "xlsx" | "xls" => {
            let bytes = download_file(&resource.url).await?;
            match extract_excel_text(&bytes) {
                Ok(text) if !text.trim().is_empty() => {
                    let truncated = truncate_text(&text);
                    let vec = embed::embed_text(&truncated, api_key).await?;
                    Ok(Some(vec))
                }
                Ok(_) => Ok(None),
                Err(error) => {
                    tracing::warn!(
                        "Excel text extraction failed for {}: {}",
                        resource.url,
                        error
                    );
                    Ok(None)
                }
            }
        }
        _ => Ok(None),
    }
}

async fn embed_plain_text_resource(
    resource: &ResourceCandidate,
    api_key: &str,
    _mime_type: &str,
) -> Result<Option<Vec<f32>>> {
    let bytes = download_file(&resource.url).await?;
    let text = truncate_text(&String::from_utf8_lossy(&bytes));
    if text.trim().is_empty() {
        return Ok(None);
    }

    let vec = embed::embed_text(&text, api_key).await?;
    Ok(Some(vec))
}

async fn download_file(url: &str) -> Result<Bytes> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(config::CONFIG.download_timeout_secs))
        .connect_timeout(Duration::from_secs(10))
        .build()
        .context("Failed to create HTTP client")?;

    let resp = client
        .get(url)
        .send()
        .await
        .with_context(|| format!("Failed to download resource from {url}"))?;

    if !resp.status().is_success() {
        anyhow::bail!(
            "Resource download returned HTTP {} for {}",
            resp.status(),
            url
        );
    }

    if let Some(content_length) = resp.content_length() {
        if content_length as usize > config::CONFIG.max_download_bytes {
            anyhow::bail!(
                "Resource is too large ({} bytes > {}) for {}",
                content_length,
                config::CONFIG.max_download_bytes,
                url
            );
        }
    }

    let bytes = resp
        .bytes()
        .await
        .context("Failed to read resource bytes")?;
    if bytes.len() > config::CONFIG.max_download_bytes {
        anyhow::bail!(
            "Resource is too large after download ({} bytes > {}) for {}",
            bytes.len(),
            config::CONFIG.max_download_bytes,
            url
        );
    }

    Ok(bytes)
}

async fn upload_to_gemini_file_api(data: &Bytes, mime_type: &str, api_key: &str) -> Result<String> {
    const UPLOAD_BASE: &str = "https://generativelanguage.googleapis.com/upload/v1beta/files";
    const API_BASE: &str = "https://generativelanguage.googleapis.com/v1beta/files";

    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(config::CONFIG.download_timeout_secs))
        .connect_timeout(Duration::from_secs(10))
        .build()
        .context("Failed to create Gemini HTTP client")?;

    let size = data.len();

    let start_resp = client
        .post(UPLOAD_BASE)
        .header("x-goog-api-key", api_key)
        .header("X-Goog-Upload-Protocol", "resumable")
        .header("X-Goog-Upload-Command", "start")
        .header("X-Goog-Upload-Header-Content-Length", size.to_string())
        .header("X-Goog-Upload-Header-Content-Type", mime_type)
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "file": { "display_name": "sync-resource" }
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
        .and_then(|value| value.to_str().ok())
        .context("Gemini File API: no X-Goog-Upload-URL in response headers")?;

    let put_resp = client
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

    poll_file_until_active(&client, API_BASE, api_key, &file_info.file.name).await
}

async fn poll_file_until_active(
    client: &reqwest::Client,
    api_base: &str,
    api_key: &str,
    file_name: &str,
) -> Result<String> {
    const MAX_ATTEMPTS: usize = 20;
    const POLL_INTERVAL_MS: u64 = 1500;

    for attempt in 0..MAX_ATTEMPTS {
        let resp = client
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
            tokio::time::sleep(Duration::from_millis(POLL_INTERVAL_MS)).await;
        }
    }

    anyhow::bail!(
        "Gemini File API: file did not become ACTIVE within {} attempts",
        MAX_ATTEMPTS
    )
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
                        let value = cell.to_string();
                        if value.is_empty() {
                            None
                        } else {
                            Some(value)
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

fn truncate_text(text: &str) -> String {
    text.chars().take(config::CONFIG.max_text_chars).collect()
}

fn average_vectors(vectors: Vec<Vec<f32>>) -> Vec<f32> {
    assert!(!vectors.is_empty(), "Cannot average an empty vector list");
    let dimensions = vectors[0].len();
    let count = vectors.len() as f32;
    let mut result = vec![0.0; dimensions];

    for vector in &vectors {
        for (index, value) in vector.iter().enumerate() {
            result[index] += value;
        }
    }

    result.iter_mut().for_each(|value| *value /= count);
    result
}
