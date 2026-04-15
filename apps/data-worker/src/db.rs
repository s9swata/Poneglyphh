use anyhow::{Context, Result};
use sqlx::postgres::PgPoolOptions;
use sqlx::{Executor, Postgres, PgPool, Row};
use uuid::Uuid;

use crate::sources::types::SourceDataset;

pub async fn create_pool(database_url: &str) -> Result<PgPool> {
    PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await
        .context("Failed to create database pool")
}

/// Look up source id by name.
pub async fn get_source_id_by_name(pool: &PgPool, name: &str) -> Result<Option<Uuid>> {
    let row = sqlx::query("SELECT id FROM sources WHERE name = $1")
        .bind(name)
        .fetch_optional(pool)
        .await
        .context("Failed to query source by name")?;

    Ok(row.map(|r| r.get("id")))
}

/// Upsert a dataset by external_id. Returns (dataset_id, was_insert).
pub async fn upsert_dataset<'e, E>(
    executor: E,
    ds: &SourceDataset,
    source_id: Uuid,
) -> Result<(Uuid, bool)>
where
    E: Executor<'e, Database = Postgres>,
{
    let row = sqlx::query(
        r#"
        INSERT INTO datasets (external_id, source_id, title, description, publisher, publication_date, source_url, s3_keys, file_types, dataset_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::file_type[], 'pending')
        ON CONFLICT (external_id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        publisher = EXCLUDED.publisher,
        publication_date = EXCLUDED.publication_date,
        source_url = EXCLUDED.source_url,
        s3_keys = EXCLUDED.s3_keys,
        file_types = EXCLUDED.file_types,
        updated_at = NOW()
        RETURNING id, (xmax = 0) AS inserted
        "#,
    )
    .bind(&ds.external_id)
    .bind(source_id)
    .bind(&ds.title)
    .bind(&ds.description)
    .bind(&ds.publisher)
    .bind(ds.publication_date)
    .bind(&ds.source_url)
    .bind(&ds.resource_urls)
    .bind(&ds.resource_formats)
    .fetch_one(executor)
    .await
    .context("Failed to upsert dataset")?;

    Ok((row.get("id"), row.get("inserted")))
}

/// Upsert a tag by name. Returns tag_id.
pub async fn upsert_tag<'e, E>(executor: E, tag_name: &str) -> Result<Uuid>
where
    E: Executor<'e, Database = Postgres>,
{
    let slug = tag_name.to_lowercase().replace(' ', "-");

    let row = sqlx::query(
        r#"
        INSERT INTO tags (name, slug)
        VALUES ($1, $2)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
        "#,
    )
    .bind(tag_name)
    .bind(&slug)
    .fetch_one(executor)
    .await
    .context("Failed to upsert tag")?;

    Ok(row.get("id"))
}

/// Link a dataset to a tag (ignore if already linked).
pub async fn link_dataset_tag<'e, E>(executor: E, dataset_id: Uuid, tag_id: Uuid) -> Result<()>
where
    E: Executor<'e, Database = Postgres>,
{
    sqlx::query(
        r#"
        INSERT INTO dataset_tags (dataset_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        "#,
    )
    .bind(dataset_id)
    .bind(tag_id)
    .execute(executor)
    .await
    .context("Failed to link dataset tag")?;

    Ok(())
}

const EXPECTED_VECTOR_DIMENSIONS: usize = 768;

/// Update the embedding vector for a dataset and set status to 'approved'.
pub async fn update_embedding(
    pool: &PgPool,
    dataset_id: Uuid,
    vector: &[f32],
) -> Result<()> {
    // Validate vector dimensions
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
    .bind(&vec_str)
    .bind(dataset_id)
    .execute(pool)
    .await
    .context("Failed to update embedding")?;

    Ok(())
}

/// Archive datasets from a source that are no longer present in the live set.
pub async fn archive_missing_datasets(
    pool: &PgPool,
    source_id: Uuid,
    live_external_ids: &[String],
) -> Result<u64> {
    let result = sqlx::query(
        r#"
        UPDATE datasets
        SET dataset_status = 'archived', updated_at = NOW()
        WHERE source_id = $1
        AND external_id IS NOT NULL
        AND external_id != ALL($2)
        AND dataset_status != 'archived'
        "#,
    )
    .bind(source_id)
    .bind(live_external_ids)
    .execute(pool)
    .await
    .context("Failed to archive missing datasets")?;

    Ok(result.rows_affected())
}

/// Create a sync_log entry. Returns the log id.
pub async fn create_sync_log(pool: &PgPool, source_id: Uuid, total_found: i32) -> Result<Uuid> {
    let row = sqlx::query(
        r#"
        INSERT INTO sync_logs (source_id, total_found, sync_status)
        VALUES ($1, $2, 'running')
        RETURNING id
        "#,
    )
    .bind(source_id)
    .bind(total_found)
    .fetch_one(pool)
    .await
    .context("Failed to create sync log")?;

    Ok(row.get("id"))
}

/// Update a sync_log entry with final results.
pub async fn update_sync_log(
    pool: &PgPool,
    log_id: Uuid,
    added: i32,
    updated: i32,
    archived: i32,
    error_count: i32,
    errors: &[String],
) -> Result<()> {
    let error_text = if errors.is_empty() {
        None
    } else {
        Some(errors.join("\n"))
    };

    sqlx::query(
        r#"
        UPDATE sync_logs
        SET sync_status = 'completed',
        added = $2,
        updated = $3,
        archived = $4,
        error_count = $5,
        completed_at = NOW(),
        error = $6
        WHERE id = $1
        "#,
    )
    .bind(log_id)
    .bind(added)
    .bind(updated)
    .bind(archived)
    .bind(error_count)
    .bind(error_text)
    .execute(pool)
    .await
    .context("Failed to update sync log")?;

    Ok(())
}

/// Mark a sync_log as failed.
pub async fn fail_sync_log(pool: &PgPool, log_id: Uuid, error: &str) -> Result<()> {
    sqlx::query(
        r#"
        UPDATE sync_logs
        SET sync_status = 'failed', completed_at = NOW(), error = $2
        WHERE id = $1
        "#,
    )
    .bind(log_id)
    .bind(error)
    .execute(pool)
    .await
    .context("Failed to mark sync log as failed")?;

    Ok(())
}
