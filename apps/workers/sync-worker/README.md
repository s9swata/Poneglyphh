# sync-worker

This worker syncs datasets from external sources and writes them into the database.

## Runtime modes

- Local test: run `cargo run` and hit `POST /sync`, or `GET /health`
- Cloud Run: use the same HTTP server path; Cloud Run sets `PORT`
- AWS Lambda + CloudWatch/EventBridge: keep the Lambda path in `src/main.rs` and build with `Dockerfile.lambda`

## What to keep or delete later

- If you settle on Cloud Run only, you can delete the Lambda handler branch in `src/main.rs` and `Dockerfile.lambda`
- If you settle on Lambda only, you can delete the local/Cloud Run TCP server branch in `src/main.rs` and `Dockerfile.cloudrun`

I'm keeping both paths for now so local testing stays easy while deployment is still undecided.
