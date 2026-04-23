# sync-worker

This worker syncs datasets from external sources and writes them into the database.

## Runtime modes

- Local test: run `cargo run` and hit `POST /sync`, or `GET /health`
- Cloud Run: use the same HTTP server path; Cloud Run sets `PORT`
- AWS Lambda + CloudWatch/EventBridge: keep the Lambda path in `src/main.rs` and build with `Dockerfile.lambda`

## Embedding behavior

- Metadata is always embedded for newly inserted datasets
- Supported source resources are also embedded when possible: PDF, CSV, JSON, plain text, XLSX, XLS
- Resource embedding is best-effort and bounded so a large sync does not fan out into unbounded Gemini or download traffic

## NOTE:

- If I settle on Cloud Run only, i will delete the Lambda handler branch in `src/main.rs` and `Dockerfile.lambda`
- If I settle on Lambda only, i can delete the local/Cloud Run TCP server branch in `src/main.rs` and `Dockerfile.cloudrun`

I'm keeping both paths for now so local testing stays easy while deployment is still undecided.
