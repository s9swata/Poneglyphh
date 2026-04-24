# Cloud Run Deployment

This Terraform stack deploys `apps/server` to Google Cloud Run in project `agasta`.

It creates:

- a public Cloud Run service for poneglyph's server

## App URLs

- Backend auth URL: `https://poneglyph-api.vyse.site`
- Frontend origin: `https://poneglyph.vyse.site`
