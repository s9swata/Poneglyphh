pub mod ckan;
pub mod types;

use anyhow::{bail, Result};
use types::SourceDataset;

pub async fn fetch_all(source: &str, query: &str) -> Result<Vec<SourceDataset>> {
    match source {
        "opencity" => ckan::fetch_all(query).await,
        _ => bail!("Unknown source: {}", source),
    }
}
