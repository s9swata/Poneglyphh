use anyhow::{Context, Result};
use sqlx::PgPool;

use crate::db;
use crate::embed;
use crate::sources::{self, ckan, types::*};

pub async fn run_sync(pool: &PgPool, req: &SyncRequest) -> Result<SyncResponse> {
    // Resolve source_id: from request body or by name lookup
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

    // 1. Fetch all datasets from source
    let query = req.query.as_deref().unwrap_or("Survey Data");
    let datasets = sources::fetch_all(&req.source, query).await?;

    let total_found = datasets.len() as i32;
    tracing::info!("Fetched {} datasets from source", total_found);

    // 2. Create sync log
    let sync_log_id = db::create_sync_log(pool, source_id, total_found).await?;

    let mut errors: Vec<String> = Vec::new();
    let mut added: usize = 0;
    let mut updated: usize = 0;

    // 3. Upsert each dataset
    let mut embed_queue: Vec<(uuid::Uuid, String)> = Vec::new();
    let live_ids: Vec<String> = datasets.iter().map(|d| d.external_id.clone()).collect();

    for ds in &datasets {
        // Use a transaction for each dataset to ensure consistency
        let result: Result<(uuid::Uuid, bool)> = async {
            let mut tx = pool.begin().await.context("Failed to begin transaction")?;
            
            let (dataset_id, is_new) = db::upsert_dataset(&mut *tx, ds, source_id).await?;
            
            // Upsert tags and link within the same transaction
            for tag_name in &ds.tags {
                match db::upsert_tag(&mut *tx, tag_name).await {
                    Ok(tag_id) => {
                        if let Err(e) = db::link_dataset_tag(&mut *tx, dataset_id, tag_id).await {
                            tracing::warn!("Tag link error for '{}': {}", ds.title, e);
                        }
                    }
                    Err(e) => {
                        tracing::warn!("Tag upsert error '{}': {}", tag_name, e);
                    }
                }
            }
            
            tx.commit().await.context("Failed to commit transaction")?;
            Ok((dataset_id, is_new))
        }.await;

        match result {
            Ok((dataset_id, is_new)) => {
                if is_new {
                    added += 1;
                } else {
                    updated += 1;
                }

                // Build embedding text and queue
                let text = ckan::build_embedding_text(ds);
                if !text.is_empty() {
                    embed_queue.push((dataset_id, text));
                }
            }
            Err(e) => {
                errors.push(format!("Upsert error for '{}': {}", ds.title, e));
            }
        }
    }

    // 4. Archive datasets no longer in source
    let archived_count = match db::archive_missing_datasets(pool, source_id, &live_ids).await {
        Ok(count) => count as usize,
        Err(e) => {
            errors.push(format!("Archive error: {}", e));
            0
        }
    };

    // 5. Embed all new/updated datasets in parallel
    let api_key = &crate::config::CONFIG.gemini_api_key;
    let embed_results = embed::embed_batch(embed_queue, api_key).await;

    let mut embedded: usize = 0;
    for (dataset_id, vector) in &embed_results {
        match db::update_embedding(pool, *dataset_id, vector).await {
            Ok(()) => embedded += 1,
            Err(e) => {
                errors.push(format!("DB update embedding error for {}: {}", dataset_id, e));
            }
        }
    }

    let error_count = errors.len() as i32;

    // 6. Update sync log - mark as failed if there were critical errors
    let sync_result = if error_count > 0 && (added + updated) == 0 {
        // All failed - mark sync as failed
        db::fail_sync_log(
            pool,
            sync_log_id,
            &format!("Sync failed with {} errors: {}", error_count, errors.join("; ")),
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

pub async fn run_embed_batch(
    pool: &PgPool,
    req: &EmbedBatchRequest,
) -> Result<EmbedBatchResponse> {
    let api_key = &crate::config::CONFIG.gemini_api_key;
    let mut errors: Vec<String> = Vec::new();
    let mut processed: usize = 0;

    // Separate items by type: text vs file
    let mut text_items: Vec<(uuid::Uuid, String)> = Vec::new();
    let mut file_items: Vec<(uuid::Uuid, String, String)> = Vec::new();

    for item in &req.datasets {
        if let (Some(file_uri), Some(mime_type)) = (&item.file_uri, &item.mime_type) {
            file_items.push((item.id, file_uri.clone(), mime_type.clone()));
        } else if let Some(text) = &item.text {
            text_items.push((item.id, text.clone()));
        } else {
            errors.push(format!(
                "Dataset {} has neither file_uri+mimeType nor text",
                item.id
            ));
        }
    }

    // Embed text-based items
    if !text_items.is_empty() {
        let results = embed::embed_batch(text_items, api_key).await;
        for (id, vector) in &results {
            match db::update_embedding(pool, *id, vector).await {
                Ok(()) => processed += 1,
                Err(e) => errors.push(format!("DB error for {}: {}", id, e)),
            }
        }
    }

    // Embed file-based items (PDF)
    if !file_items.is_empty() {
        let results = embed::embed_file_batch(file_items, api_key).await;
        for (id, vector) in &results {
            match db::update_embedding(pool, *id, vector).await {
                Ok(()) => processed += 1,
                Err(e) => errors.push(format!("DB error for file {}: {}", id, e)),
            }
        }
    }

    Ok(EmbedBatchResponse { processed, errors })
}
