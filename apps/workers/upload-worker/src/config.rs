use std::sync::LazyLock;

pub struct Config {
    pub database_url: String,
    pub gemini_api_key: String,
    pub port: u16,
    pub server_callback_url: String,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| Config {
    database_url: std::env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
    gemini_api_key: std::env::var("GEMINI_API_KEY").expect("GEMINI_API_KEY must be set"),
    port: std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .unwrap_or(8080),
    server_callback_url: std::env::var("SERVER_CALLBACK_URL")
        .expect("SERVER_CALLBACK_URL must be set"),
});
