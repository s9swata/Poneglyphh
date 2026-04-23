import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, sql } from "@Poneglyph/db";
import { DatasetListQuerySchema } from "@Poneglyph/schemas/dataset";
import { logger } from "@/lib/logger";
import {
  getDatasetAttachmentUrl,
  inferFileType,
  isExternalUrl,
  normalizePgTextArray,
} from "@/lib/helpers/routehelprs";
import { getPresignedUrl } from "../../lib/s3";
import { requireAuth } from "../../middleware/auth";

const log = logger.getChild("datasets");

export const datasetsRouter = new Hono();

async function fetchTagsByDatasetIds(
  datasetIds: string[],
): Promise<Map<string, { id: string; name: string; slug: string }[]>> {
  if (datasetIds.length === 0) return new Map();

  const rows = await db.execute<{
    dataset_id: string;
    tag_id: string;
    name: string;
    slug: string;
  }>(sql`
    SELECT dt.dataset_id, t.id AS tag_id, t.name, t.slug
    FROM dataset_tags dt
    INNER JOIN tags t ON dt.tag_id = t.id
    WHERE dt.dataset_id IN (${sql.join(
      datasetIds.map((id) => sql`${id}`),
      sql`, `,
    )})
  `);

  const map = new Map<string, { id: string; name: string; slug: string }[]>();
  for (const r of rows.rows) {
    const existing = map.get(r.dataset_id);
    const tag = { id: r.tag_id, name: r.name, slug: r.slug };
    if (existing) existing.push(tag);
    else map.set(r.dataset_id, [tag]);
  }
  return map;
}

/**
 * GET /api/datasets
 * Paginated dataset listing with full-text search and filters.
 *   - q              (optional) full-text search query (Recomended)
 *   - status         (optional) pending, approved, rejected, archived
 *   - fileType       (optional) pdf, csv, xlsx, xls, json, docx, other
 *   - language      (optional) language code (en, es, fr, ar...)
 *   - tags          (optional) tag slugs, single or array
 *   - sortBy        (optional) createdAt, viewCount, downloadCount
 *   - sortOrder     (optional) asc, desc
 *   - page         (optional) page number, default 1
 *   - limit        (optional) items per page, default 20
 *
 * Search uses PostgreSQL full-text search via the stored tsvector column.
 * Results include pagination metadata and batch-fetched tags.
 *
 * curl -X GET "http://localhost:3000/api/datasets?q=survey&status=approved&page=1&limit=10"
 */
datasetsRouter.get("/", zValidator("query", DatasetListQuerySchema), async (c) => {
  // This route powers the dataset grid in the web app. Search uses the stored
  // `datasets.fts` tsvector column, while filters stay optional so we can later
  // tighten the default visibility to approved-only without changing the query shape.
  const { q, status, fileType, language, tags, sortBy, sortOrder, page, limit } =
    c.req.valid("query");

  const offset = (page - 1) * limit;

  const orderClause = q
    ? sql`ts_rank(d.fts, websearch_to_tsquery('english', ${q})) DESC`
    : sortBy === "viewCount"
      ? sortOrder === "asc"
        ? sql`d.view_count ASC`
        : sql`d.view_count DESC`
      : sortBy === "downloadCount"
        ? sortOrder === "asc"
          ? sql`d.download_count ASC`
          : sql`d.download_count DESC`
        : sortOrder === "asc"
          ? sql`d.created_at ASC`
          : sql`d.created_at DESC`;

  log.info("Dataset list: q={q} status={status} fileType={fileType} page={page} limit={limit}", {
    q: q ?? null,
    status: status ?? null,
    fileType: fileType ?? null,
    page,
    limit,
  });

  type ListRow = {
    id: string;
    title: string;
    description: string | null;
    thumbnail_s3_key: string | null;
    publisher: string | null;
    language: string;
    file_types: string[] | string | null;
    dataset_status: string;
    view_count: number;
    download_count: number;
    created_at: string;
    total_count: string;
  };

  const tagFilter =
    tags && tags.length > 0
      ? sql`
          AND (
            SELECT COUNT(DISTINCT t2.slug)
            FROM dataset_tags dt2
            INNER JOIN tags t2 ON dt2.tag_id = t2.id
            WHERE dt2.dataset_id = d.id
              AND t2.slug IN (${sql.join(
                tags.map((t) => sql`${t}`),
                sql`, `,
              )})
          ) = ${tags.length}
        `
      : sql``;

  const statusFilter = status ? sql`AND d.dataset_status = ${status}` : sql``;
  const fileTypeFilter = fileType ? sql`AND ${fileType} = ANY(d.file_types)` : sql``;
  const languageFilter = language ? sql`AND d.language = ${language}` : sql``;
  const searchFilter = q ? sql`AND d.fts @@ websearch_to_tsquery('english', ${q})` : sql``;

  const rows = await db.execute<ListRow>(sql`
      SELECT
        d.id,
        d.title,
        d.description,
        d.thumbnail_s3_key,
        d.publisher,
        d.language,
        d.file_types,
        d.dataset_status,
        d.view_count,
        d.download_count,
        d.created_at,
        COUNT(*) OVER() AS total_count
      FROM datasets d
      WHERE 1 = 1
        ${statusFilter}
        ${searchFilter}
        ${fileTypeFilter}
        ${languageFilter}
        ${tagFilter}
      ORDER BY ${orderClause}
      LIMIT ${limit} OFFSET ${offset}
    `);

  const results = rows.rows;
  const total = results.length > 0 ? Number(results[0]!.total_count) : 0;

  log.debug("Dataset list query returned {count} rows (total={total})", {
    count: results.length,
    total,
  });

  const datasetIds = results.map((r) => r.id);
  const tagsByDataset = await fetchTagsByDatasetIds(datasetIds);

  const data = await Promise.all(
    results.map(async (r) => {
      let thumbnailUrl: string | null = null;
      if (r.thumbnail_s3_key && !isExternalUrl(r.thumbnail_s3_key)) {
        thumbnailUrl = await getPresignedUrl(r.thumbnail_s3_key);
      }

      return {
        id: r.id,
        title: r.title,
        description: r.description,
        thumbnailUrl,
        publisher: r.publisher,
        language: r.language,
        fileTypes: normalizePgTextArray(r.file_types),
        status: r.dataset_status,
        viewCount: r.view_count,
        downloadCount: r.download_count,
        createdAt: new Date(r.created_at).toISOString(),
        tags: tagsByDataset.get(r.id) ?? [],
      };
    }),
  );

  return c.json({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

/**
 * GET /api/datasets/:id
 * Full dataset detail including source info and attachment metadata.
 * Returns all fields needed for the dataset detail page.
 * View count is incremented on each request.
 *
 * curl -X GET "http://localhost:3000/api/datasets/062ce6bc-05d6-40fe-b7e0-abfe1d669f04"
 */
datasetsRouter.get("/:id", zValidator("param", z.object({ id: z.uuid() })), async (c) => {
  // The detail route returns everything the frontend needs for a dataset page,
  // including attachment metadata. File contents themselves stay behind the
  // dedicated proxy route so external URLs and R2 objects look the same to callers.
  // cuz Agasta felt too lazy sperating them in db :(
  const { id } = c.req.valid("param");

  log.info("Dataset detail: id={id}", { id });

  type DetailRow = {
    id: string;
    title: string;
    description: string | null;
    thumbnail_s3_key: string | null;
    summary: string | null;
    publisher: string | null;
    publication_date: string | null;
    language: string;
    file_types: string[] | string | null;
    s3_keys: string[] | null;
    dataset_status: string;
    view_count: number;
    download_count: number;
    created_at: string;
    source_name: string;
    source_type: string;
    is_verified: boolean;
  };

  const rows = await db.execute<DetailRow>(sql`
      SELECT
        d.id,
        d.title,
        d.description,
        d.thumbnail_s3_key,
        d.summary,
        d.publisher,
        d.publication_date,
        d.language,
        d.file_types,
        d.s3_keys,
        d.dataset_status,
        d.view_count,
        d.download_count,
        d.created_at,
        s.name  AS source_name,
        s.source_type,
        s.is_verified
      FROM datasets d
      INNER JOIN sources s ON d.source_id = s.id
      WHERE d.id = ${id}
      LIMIT 1
    `);

  if (rows.rows.length === 0) {
    log.warn("Dataset not found: id={id}", { id });
    return c.json({ error: "Dataset not found" }, 404);
  }

  const r = rows.rows[0]!;

  db.execute(sql`UPDATE datasets SET view_count = view_count + 1 WHERE id = ${id}`).catch((err) =>
    log.warn("Failed to increment view_count for {id}: {error}", {
      id,
      error: String(err),
    }),
  );

  const [tagsByDataset, thumbnailUrl, attachments] = await Promise.all([
    fetchTagsByDatasetIds([id]),

    r.thumbnail_s3_key && !isExternalUrl(r.thumbnail_s3_key)
      ? getPresignedUrl(r.thumbnail_s3_key)
      : Promise.resolve(null),

    Promise.all(
      (r.s3_keys ?? []).map((key, index) => ({
        index,
        url: getDatasetAttachmentUrl(id, index),
        fileType: inferFileType(key),
        isExternal: isExternalUrl(key),
      })),
    ),
  ]);

  return c.json({
    id: r.id,
    title: r.title,
    description: r.description,
    thumbnailUrl,
    summary: r.summary,
    publisher: r.publisher,
    publicationDate: r.publication_date ? new Date(r.publication_date).toISOString() : null,
    language: r.language,
    fileTypes: normalizePgTextArray(r.file_types),
    status: r.dataset_status,
    viewCount: r.view_count,
    downloadCount: r.download_count,
    createdAt: new Date(r.created_at).toISOString(),
    sourceName: r.source_name,
    sourceType: r.source_type,
    isVerified: r.is_verified,
    tags: tagsByDataset.get(id) ?? [],
    attachments,
  });
});

/**
 * GET /api/datasets/:id/files/:index
 * File download/preview proxy.
 *   - :id          (required) dataset UUID
 *   - :index      (required) file index within the dataset's s3_keys array
 *   - download    (optional) true to force Content-Disposition: attachment
 *
 * Handles both external URLs and R2 object keys transparently.
 * External URLs redirect directly. R2 keys redirect to a presigned URL.
 *
 * Preview/open the file inline (browser tries to display it) =>
 * curl -X GET "http://localhost:3000/api/datasets/062ce6bc-05d6-40fe-b7e0-abfe1d669f04/files/0"
 *
 * Force download (browser prompts to save) =>
 * curl -X GET "http://localhost:3000/api/datasets/062ce6bc-05d6-40fe-b7e0-abfe1d669f04/files/0?download=true"
 */
datasetsRouter.get(
  "/:id/files/:index",
  requireAuth,
  zValidator("param", z.object({ id: z.uuid(), index: z.coerce.number().int().min(0) })),
  zValidator("query", z.object({ download: z.enum(["true", "false"]).optional() })),
  async (c) => {
    // Attachments are stored as a mixed list of external URLs and R2 object keys.
    // This route hides that storage detail by always returning a redirect target.
    const { id, index } = c.req.valid("param");
    const { download } = c.req.valid("query");
    const forceDownload = download === "true";

    log.info("File proxy: dataset={id} index={index} download={download}", {
      id,
      index,
      download: forceDownload,
    });

    const rows = await db.execute<{ s3_keys: string[] | null }>(sql`
      SELECT s3_keys FROM datasets WHERE id = ${id} LIMIT 1
    `);

    if (rows.rows.length === 0) {
      return c.json({ error: "Dataset not found" }, 404);
    }

    const s3Keys = rows.rows[0]!.s3_keys ?? [];

    if (index >= s3Keys.length) {
      return c.json({ error: "File index out of range" }, 404);
    }

    const key = s3Keys[index]!;

    // Increment download_count when serving file redirects
    db.execute(sql`UPDATE datasets SET download_count = download_count + 1 WHERE id = ${id}`).catch(
      (err) =>
        log.warn("Failed to increment download_count for {id}: {error}", {
          id,
          error: String(err),
        }),
    );

    if (isExternalUrl(key)) {
      log.debug("Redirecting to external URL for dataset={id} index={index}", {
        id,
        index,
      });
      return c.redirect(key, 302);
    }

    const presignedUrl = await getPresignedUrl(key, forceDownload);

    log.debug("Redirecting to presigned R2 URL for dataset={id} index={index}", { id, index });
    return c.redirect(presignedUrl, 302);
  },
);
