use std::sync::LazyLock;

pub struct Config {
    pub database_url: String,
    pub gemini_api_key: String,
    pub ckan_base_url: String,
    pub port: u16,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| Config {
    database_url: std::env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
    gemini_api_key: std::env::var("GEMINI_API_KEY").expect("GEMINI_API_KEY must be set"),
    ckan_base_url: std::env::var("CKAN_BASE_URL").expect("CKAN_BASE_URL must be set"),
    port: std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .unwrap_or(8080),
});
