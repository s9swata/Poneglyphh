mod config;
mod db;
mod embed;
mod upload;

use anyhow::Result;
use axum::{body::Bytes, extract::State, http::StatusCode, response::IntoResponse, routing::{get, post}, Json, Router};
use serde_json::json;
use sqlx::PgPool;
use std::sync::Arc;

#[derive(Clone)]
struct AppState {
    pool: PgPool,
}

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
    let cfg = &config::CONFIG;

    let pool = db::create_pool(&cfg.database_url)
        .await
        .expect("Failed to connect to database");

    let app = Router::new()
        .route("/health", get(health).post(health))
        .route("/pubsub/upload", post(handle_upload))
        .with_state(Arc::new(AppState { pool }));

    let addr = format!("0.0.0.0:{}", cfg.port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("upload-worker listening on http://{}", addr);
    axum::serve(listener, app).await?;

    Ok(())
}

async fn health() -> impl IntoResponse {
    Json(json!({ "status": "healthy" }))
}

async fn handle_upload(
    State(state): State<Arc<AppState>>,
    body: Bytes,
) -> impl IntoResponse {
    let msg: upload::UploadMessage = match serde_json::from_slice(&body) {
        Ok(msg) => msg,
        Err(error) => {
            tracing::warn!(?error, "Invalid Pub/Sub upload payload - acknowledging to skip retries");
            return (
                StatusCode::OK,
                Json(json!({ "error": "invalid upload payload acknowledged" })),
            );
        }
    };

    match upload::process_upload(&state.pool, msg).await {
        Ok(dataset_id) => (
            StatusCode::OK,
            Json(json!({ "ok": true, "dataset_id": dataset_id.to_string() })),
        ),
        Err(error) => {
            tracing::error!(?error, "Upload processing failed");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": error.to_string() })),
            )
        }
    }
}
