# Cloud Run Deployment

This Terraform stack deploys `apps/server` and `apps/workers/upload-worker` to Google Cloud Run in project `agasta`.

## Deployed Services

| Service                   | Description                          | URL                               |
| ------------------------- | ------------------------------------ | --------------------------------- |
| `poneglyph-server`        | Main API server (Hono)               | `https://poneglyph-api.vyse.site` |
| `poneglyph-upload-worker` | Upload processing worker (Rust/AXum) | Internal (Pub/Sub triggered)      |

## Resources Created

### Server

- Cloud Run service
- S3 bucket for uploads
- Pub/Sub topic for upload notifications

### Workers

- Cloud Run service (internal-only ingress)
- Pub/Sub topic + push subscription
- Service account for Pub/Sub push invocation

## App URLs

- Backend auth URL: Internal
- Frontend origin: `https://poneglyph.vyse.site`
- Upload worker: Internal (invoked via Pub/Sub push)
