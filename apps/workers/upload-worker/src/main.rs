mod config;
mod db;
mod embed;
mod upload;

use anyhow::Result;

fn init_tracing() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .init();
}

#[tokio::main]
async fn main() -> Result<()> {
    init_tracing();
    let _ = dotenvy::dotenv();
    let _ = &config::CONFIG;

    let pool = db::create_pool(&config::CONFIG.database_url)
        .await
        .expect("Failed to connect to database");

    tracing::info!("upload-worker initialized, database connected");
    upload::run_consumer(pool).await
}
