use anyhow::{Context, Result};
use lazy_static::lazy_static;
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};

lazy_static! {
    static ref CLIENT: reqwest::Client = reqwest::Client::new();
}

const MAX_RETRIES: usize = 3;
const GEMINI_EMBED_URL: &str =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2-preview:embedContent";

#[derive(Debug, Serialize)]
struct EmbedContentRequest {
    content: Content,
    #[serde(rename = "output_dimensionality")]
    output_dimensionality: u32,
}

#[derive(Debug, Serialize)]
#[serde(untagged)]
enum Content {
    Text { parts: Vec<TextPart> },
    File { parts: Vec<FilePart> },
}

#[derive(Debug, Serialize)]
struct TextPart {
    text: String,
}

#[derive(Debug, Serialize)]
struct FilePart {
    #[serde(rename = "fileData")]
    file_data: FileData,
}

#[derive(Debug, Serialize)]
struct FileData {
    #[serde(rename = "mimeType")]
    mime_type: String,
    #[serde(rename = "fileUri")]
    file_uri: String,
}

#[derive(Debug, Deserialize)]
struct EmbedContentResponse {
    embedding: Embedding,
}

#[derive(Debug, Deserialize)]
struct Embedding {
    values: Vec<f32>,
}

pub async fn embed_text(text: &str, api_key: &str) -> Result<Vec<f32>> {
    let client = &*CLIENT;

    let req_body = EmbedContentRequest {
        content: Content::Text {
            parts: vec![TextPart {
                text: text.to_string(),
            }],
        },
        output_dimensionality: 768,
    };

    let response = client
        .post(GEMINI_EMBED_URL)
        .header("x-goog-api-key", api_key)
        .header("Content-Type", "application/json")
        .json(&req_body)
        .send()
        .await
        .context("Gemini embed_text request failed")?;

    let status = response.status();
    if !status.is_success() {
        let text = response.text().await.unwrap_or_default();
        return Err(anyhow::anyhow!(
            "Gemini API returned error status {}: {}",
            status,
            text
        ));
    }

    let resp: EmbedContentResponse = response
        .json()
        .await
        .context("Failed to parse Gemini embed response")?;

    Ok(resp.embedding.values)
}

pub async fn embed_file(file_uri: &str, mime_type: &str, api_key: &str) -> Result<Vec<f32>> {
    let client = &*CLIENT;

    let req_body = EmbedContentRequest {
        content: Content::File {
            parts: vec![FilePart {
                file_data: FileData {
                    mime_type: mime_type.to_string(),
                    file_uri: file_uri.to_string(),
                },
            }],
        },
        output_dimensionality: 768,
    };

    let response = client
        .post(GEMINI_EMBED_URL)
        .header("x-goog-api-key", api_key)
        .header("Content-Type", "application/json")
        .json(&req_body)
        .send()
        .await
        .context("Gemini embed_file request failed")?;

    let status = response.status();
    if !status.is_success() {
        let text = response.text().await.unwrap_or_default();
        return Err(anyhow::anyhow!(
            "Gemini API returned error status {}: {}",
            status,
            text
        ));
    }

    let resp: EmbedContentResponse = response
        .json()
        .await
        .context("Failed to parse Gemini embed response")?;

    Ok(resp.embedding.values)
}

async fn embed_with_retry_text(text: &str, api_key: &str) -> Result<Vec<f32>> {
    for attempt in 0..MAX_RETRIES {
        match embed_text(text, api_key).await {
            Ok(vector) => return Ok(vector),
            Err(e) => {
                let is_rate_limit = e
                    .downcast_ref::<reqwest::Error>()
                    .map(|e| e.status() == Some(StatusCode::TOO_MANY_REQUESTS))
                    .unwrap_or_else(|| {
                        let msg = e.to_string().to_lowercase();
                        msg.contains("429") || msg.contains("too many requests")
                    });

                if is_rate_limit && attempt < MAX_RETRIES - 1 {
                    let delay = std::time::Duration::from_secs(1 << attempt);
                    tracing::warn!(
                        "Rate limited, retrying in {:?} (attempt {}/{})",
                        delay,
                        attempt + 1,
                        MAX_RETRIES
                    );
                    tokio::time::sleep(delay).await;
                } else {
                    return Err(e);
                }
            }
        }
    }

    unreachable!()
}

async fn embed_with_retry_file(file_uri: &str, mime_type: &str, api_key: &str) -> Result<Vec<f32>> {
    for attempt in 0..MAX_RETRIES {
        match embed_file(file_uri, mime_type, api_key).await {
            Ok(vector) => return Ok(vector),
            Err(e) => {
                let is_rate_limit = e
                    .downcast_ref::<reqwest::Error>()
                    .map(|e| e.status() == Some(StatusCode::TOO_MANY_REQUESTS))
                    .unwrap_or_else(|| {
                        let msg = e.to_string().to_lowercase();
                        msg.contains("429") || msg.contains("too many requests")
                    });

                if is_rate_limit && attempt < MAX_RETRIES - 1 {
                    let delay = std::time::Duration::from_secs(1 << attempt);
                    tracing::warn!(
                        "Rate limited on file embed, retrying in {:?} (attempt {}/{})",
                        delay,
                        attempt + 1,
                        MAX_RETRIES
                    );
                    tokio::time::sleep(delay).await;
                } else {
                    return Err(e);
                }
            }
        }
    }

    unreachable!()
}

pub async fn embed_text_with_retry(text: &str, api_key: &str) -> Result<Vec<f32>> {
    embed_with_retry_text(text, api_key).await
}

pub async fn embed_file_with_retry(
    file_uri: &str,
    mime_type: &str,
    api_key: &str,
) -> Result<Vec<f32>> {
    embed_with_retry_file(file_uri, mime_type, api_key).await
}
