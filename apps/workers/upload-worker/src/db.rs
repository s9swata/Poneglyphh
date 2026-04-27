use anyhow::{Context, Result};
use sqlx::postgres::PgConnectOptions;
use sqlx::postgres::PgPoolOptions;
use sqlx::{PgPool, Row};
use std::str::FromStr;
use uuid::Uuid;

pub async fn create_pool(database_url: &str) -> Result<PgPool> {
    let connect_options = PgConnectOptions::from_str(database_url)
        .context("Invalid DATABASE_URL")?
        .statement_cache_capacity(0);

    PgPoolOptions::new()
        .max_connections(5)
        .connect_with(connect_options)
        .await
        .context("Failed to create database pool")
}

const EXPECTED_VECTOR_DIMENSIONS: usize = 768;

pub async fn update_embedding(pool: &PgPool, dataset_id: Uuid, vector: &[f32]) -> Result<()> {
    if vector.len() != EXPECTED_VECTOR_DIMENSIONS {
        return Err(anyhow::anyhow!(
            "Invalid vector dimensions: expected {}, got {}",
            EXPECTED_VECTOR_DIMENSIONS,
            vector.len()
        ));
    }

    let vec_str = format!(
        "[{}]",
        vector
            .iter()
            .map(|v| v.to_string())
            .collect::<Vec<_>>()
            .join(",")
    );

    sqlx::query(
        r#"
        UPDATE datasets
        SET embedding = $1::vector, dataset_status = 'approved', updated_at = NOW()
        WHERE id = $2
        "#,
    )
    .persistent(false)
    .bind(&vec_str)
    .bind(dataset_id)
    .execute(pool)
    .await
    .context("Failed to update embedding")?;

    Ok(())
}

pub async fn upsert_tag(pool: &PgPool, tag_name: &str) -> Result<Uuid> {
    let slug = tag_name.to_lowercase().replace(' ', "-");

    let inserted = sqlx::query(
        r#"
        INSERT INTO tags (name, slug)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING id
        "#,
    )
    .persistent(false)
    .bind(tag_name)
    .bind(&slug)
    .fetch_optional(pool)
    .await
    .context("Failed to upsert tag")?;

    if let Some(row) = inserted {
        return Ok(row.get("id"));
    }

    let row = sqlx::query("SELECT id FROM tags WHERE name = $1")
        .persistent(false)
        .bind(tag_name)
        .fetch_one(pool)
        .await
        .context("Failed to fetch existing tag id")?;

    Ok(row.get("id"))
}

pub async fn link_dataset_tag(pool: &PgPool, dataset_id: Uuid, tag_id: Uuid) -> Result<()> {
    sqlx::query(
        r#"
        INSERT INTO dataset_tags (dataset_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        "#,
    )
    .persistent(false)
    .bind(dataset_id)
    .bind(tag_id)
    .execute(pool)
    .await
    .context("Failed to link dataset tag")?;

    Ok(())
}

pub async fn insert_source_for_upload(
    pool: &PgPool,
    user_id: Option<&str>,
    name: &str,
) -> Result<Uuid> {
    let row = sqlx::query(
        r#"
        INSERT INTO sources (user_id, name, url, source_type, is_verified)
        VALUES ($1, $2, '', 'upload', false)
        RETURNING id
        "#,
    )
    .persistent(false)
    .bind(user_id)
    .bind(name)
    .fetch_one(pool)
    .await
    .context("Failed to insert upload source")?;

    Ok(row.get("id"))
}

pub async fn insert_upload_dataset(
    pool: &PgPool,
    external_id: &str,
    source_id: Uuid,
    title: &str,
    description: &str,
    summary: Option<&str>,
    publisher: Option<&str>,
    s3_keys: &[String],
    file_types: &[String],
    thumbnail_s3_key: Option<&str>,
) -> Result<Uuid> {
    let row = sqlx::query(
        r#"
        INSERT INTO datasets
            (external_id, source_id, title, description, summary, publisher,
             s3_keys, file_types, thumbnail_s3_key, dataset_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8::file_type[], $9, 'pending')
        ON CONFLICT (external_id) DO NOTHING
        RETURNING id
        "#,
    )
    .persistent(false)
    .bind(external_id)
    .bind(source_id)
    .bind(title)
    .bind(description)
    .bind(summary)
    .bind(publisher)
    .bind(s3_keys)
    .bind(file_types)
    .bind(thumbnail_s3_key)
    .fetch_optional(pool)
    .await
    .context("Failed to insert upload dataset")?;

    if let Some(row) = row {
        return Ok(row.get("id"));
    }

    let row = sqlx::query("SELECT id FROM datasets WHERE external_id = $1")
        .persistent(false)
        .bind(external_id)
        .fetch_one(pool)
        .await
        .context("Failed to fetch existing upload dataset")?;

    Ok(row.get("id"))
}
