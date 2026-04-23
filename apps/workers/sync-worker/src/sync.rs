use anyhow::{Context, Result};
use sqlx::PgPool;

use crate::db;
use crate::resource_embed;
use crate::sources::types::{SourceDataset, SyncRequest, SyncResponse};
use crate::sources::{self, ckan};

pub async fn run_sync(pool: &PgPool, req: &SyncRequest) -> Result<SyncResponse> {
    let source_id = match req.source_id {
        Some(id) => id,
        None => db::get_source_id_by_name(pool, &req.source)
            .await?
            .context(format!("Source '{}' not found in database", req.source))?,
    };

    tracing::info!(
        "Starting sync for source '{}' (id={}), query={:?}",
        req.source,
        source_id,
        req.query
    );

    let query = req.query.as_deref().unwrap_or("Survey Data");
    let datasets = sources::fetch_all(&req.source, query).await?;

    let total_found = datasets.len() as i32;
    tracing::info!("Fetched {} datasets from source", total_found);

    let all_external_ids: Vec<String> = datasets.iter().map(|d| d.external_id.clone()).collect();
    let existing_external_ids =
        db::get_existing_external_ids(pool, source_id, &all_external_ids).await?;

    let mut new_datasets: Vec<&SourceDataset> = Vec::with_capacity(datasets.len());
    for ds in &datasets {
        if !existing_external_ids.contains(&ds.external_id) {
            new_datasets.push(ds);
        }
    }

    tracing::info!(
        "Source datasets: total={}, existing={}, new={}",
        datasets.len(),
        existing_external_ids.len(),
        new_datasets.len()
    );

    let sync_log_id = db::create_sync_log(pool, source_id, total_found).await?;

    let mut errors: Vec<String> = Vec::new();
    let mut added: usize = 0;
    let updated: usize = 0;

    let live_ids = all_external_ids;
    let api_key = &crate::config::CONFIG.gemini_api_key;
    let mut embedded: usize = 0;

    for ds in new_datasets {
        match db::upsert_dataset(pool, ds, source_id).await {
            Ok((dataset_id, is_new)) => {
                if is_new {
                    added += 1;
                }

                for tag_name in &ds.tags {
                    match db::upsert_tag(pool, tag_name).await {
                        Ok(tag_id) => {
                            if let Err(e) = db::link_dataset_tag(pool, dataset_id, tag_id).await {
                                errors.push(format!("Tag link error for '{}': {}", ds.title, e));
                            }
                        }
                        Err(e) => {
                            errors.push(format!("Tag upsert error '{}': {}", tag_name, e));
                        }
                    }
                }

                let metadata_text = ckan::build_embedding_text(ds);
                if !metadata_text.is_empty() {
                    match resource_embed::build_dataset_embedding(ds, &metadata_text, api_key).await
                    {
                        Ok(vector) => match db::update_embedding(pool, dataset_id, &vector).await {
                            Ok(()) => embedded += 1,
                            Err(error) => errors.push(format!(
                                "DB update embedding error for {}: {}",
                                dataset_id, error
                            )),
                        },
                        Err(error) => {
                            errors.push(format!("Embedding error for '{}': {}", ds.title, error));
                        }
                    }
                }
            }
            Err(e) => {
                errors.push(format!("Upsert error for '{}': {}", ds.title, e));
            }
        }
    }

    let archived_count = match db::archive_missing_datasets(pool, source_id, &live_ids).await {
        Ok(count) => count as usize,
        Err(e) => {
            errors.push(format!("Archive error: {}", e));
            0
        }
    };

    let error_count = errors.len() as i32;

    let sync_result = if error_count > 0 && (added + updated) == 0 {
        db::fail_sync_log(
            pool,
            sync_log_id,
            &format!(
                "Sync failed with {} errors: {}",
                error_count,
                errors.join("; ")
            ),
        )
        .await
        .map_err(|e| anyhow::anyhow!("Failed to update sync log: {}", e))
    } else {
        db::update_sync_log(
            pool,
            sync_log_id,
            added as i32,
            updated as i32,
            archived_count as i32,
            error_count,
            &errors,
        )
        .await
    };

    if let Err(e) = sync_result {
        tracing::error!("Failed to finalize sync log: {}", e);
    }

    tracing::info!(
        "Sync complete: synced={}, added={}, updated={}, archived={}, embedded={}, errors={}",
        added + updated,
        added,
        updated,
        archived_count,
        embedded,
        errors.len()
    );

    Ok(SyncResponse {
        sync_log_id,
        synced: added + updated,
        added,
        updated,
        archived: archived_count,
        errors,
    })
}
