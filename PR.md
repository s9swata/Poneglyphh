# PR: Add Datasets API and Frontend Integration

## Summary

This PR adds the datasets API endpoint and integrates it into the frontend, allowing users to browse and view datasets from the article page.

## Changes

### Backend - Datasets API
- Added new `/api/v1/datasets` endpoint with support for:
  - Pagination (page, limit)
  - Free-text search across title and description
  - Filtering by status, language, file type, and tags
  - Sorting by createdAt, viewCount, downloadCount, publicationDate

### Frontend - Datasets Page
- Added new `/datasets` page with:
  - Search bar for free-text search
  - Sidebar filters for status, file type, language, and tags
  - Paginated dataset grid with cards
  - Loading skeletons

### Frontend - Article Page Integration
- Added datasets sidebar to `/dashboard/[id]` page
- Fetches datasets from API and displays up to 5 links
- Clickable links navigate to the datasets page

### Shared
- Added `@Poneglyph/validators` package with Zod schemas for:
  - `DatasetSchema` / `DatasetListItemSchema` - dataset validation
  - `PaginationQuerySchema` / `PaginatedResponseSchema` - pagination
  - `AuthSchema` - better auth integration
  - `SourceSchema`, `TagSchema`, `ChatSchema`, `SyncLogSchema` - other entities
- Added API client (`@/lib/api-client`) for typed RPC calls to the server

## Testing

- API tested via curl: `curl http://localhost:3000/api/v1/datasets`
- Frontend tested in browser at `http://localhost:3001/dashboard/1`
- Datasets successfully load in the sidebar

## Screenshots

N/A - Text-based changes only

## Related Issues

N/A