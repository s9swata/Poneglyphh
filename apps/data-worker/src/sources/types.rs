use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SourceDataset {
    pub external_id: String,
    pub title: String,
    pub description: Option<String>,
    pub publisher: Option<String>,
    pub publication_date: Option<chrono::NaiveDateTime>,
    pub source_url: Option<String>,
    pub tags: Vec<String>,
    pub resource_urls: Vec<String>,
    pub resource_formats: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SyncRequest {
    pub source: String,
    pub query: Option<String>,
    pub source_id: Option<uuid::Uuid>,
    pub force: Option<bool>,
}

#[derive(Debug, Serialize)]
pub struct SyncResponse {
    pub sync_log_id: uuid::Uuid,
    pub synced: usize,
    pub added: usize,
    pub updated: usize,
    pub archived: usize,
    pub errors: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmbedBatchItem {
    pub id: uuid::Uuid,
    pub file_uri: Option<String>,
    pub mime_type: Option<String>,
    pub text: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmbedBatchRequest {
    pub datasets: Vec<EmbedBatchItem>,
}

#[derive(Debug, Serialize)]
pub struct EmbedBatchResponse {
    pub processed: usize,
    pub errors: Vec<String>,
}
