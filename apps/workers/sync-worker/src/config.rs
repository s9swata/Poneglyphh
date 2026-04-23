use std::sync::LazyLock;

pub struct Config {
    pub database_url: String,
    pub gemini_api_key: String,
    pub ckan_base_url: String,
    pub port: u16,
    pub resource_fetch_max_concurrent: usize,
    pub max_resources_per_dataset: usize,
    pub max_text_chars: usize,
    pub download_timeout_secs: u64,
    pub max_download_bytes: usize,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| Config {
    database_url: std::env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
    gemini_api_key: std::env::var("GEMINI_API_KEY").expect("GEMINI_API_KEY must be set"),
    ckan_base_url: std::env::var("CKAN_BASE_URL").expect("CKAN_BASE_URL must be set"),
    port: std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .unwrap_or(8080),
    resource_fetch_max_concurrent: std::env::var("RESOURCE_FETCH_MAX_CONCURRENT")
        .unwrap_or_else(|_| "3".to_string())
        .parse()
        .unwrap_or(3),
    max_resources_per_dataset: std::env::var("MAX_RESOURCES_PER_DATASET")
        .unwrap_or_else(|_| "3".to_string())
        .parse()
        .unwrap_or(3),
    max_text_chars: std::env::var("MAX_TEXT_CHARS")
        .unwrap_or_else(|_| "6000".to_string())
        .parse()
        .unwrap_or(6000),
    download_timeout_secs: std::env::var("DOWNLOAD_TIMEOUT_SECS")
        .unwrap_or_else(|_| "30".to_string())
        .parse()
        .unwrap_or(30),
    max_download_bytes: std::env::var("MAX_DOWNLOAD_BYTES")
        .unwrap_or_else(|_| "20000000".to_string())
        .parse()
        .unwrap_or(20_000_000),
});
