import { db } from "@Poneglyph/db";
import { datasets, datasetTags, tags } from "@Poneglyph/db/schema/data";
import { DatasetQuerySchema } from "@Poneglyph/validators";
import { zValidator } from "@hono/zod-validator";
import {
  and,
  count,
  desc,
  eq,
  asc,
  ilike,
  or,
  arrayContains,
  inArray,
} from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono();

export const datasetsRoute = app.get(
  "/",
  zValidator("query", DatasetQuerySchema),
  async (c) => {
    const query = c.req.valid("query");

    const page = query.page;
    const limit = query.limit;
    const offset = (page - 1) * limit;

    const conditions = [];

    // Free-text search across title and description
    if (query.q) {
      conditions.push(
        or(
          ilike(datasets.title, `%${query.q}%`),
          ilike(datasets.description, `%${query.q}%`),
        ),
      );
    }

    if (query.status) {
      conditions.push(eq(datasets.status, query.status));
    }

    if (query.language) {
      conditions.push(eq(datasets.language, query.language));
    }

    // Filter by file type using Drizzle's arrayContains:
    // the dataset's fileTypes array must contain the requested type.
    if (query.fileType) {
      conditions.push(arrayContains(datasets.fileTypes, [query.fileType]));
    }

    // Filter by tags: find all dataset IDs that have ALL requested tag slugs.
    // The query uses a HAVING clause to ensure every tag is present.
    if (query.tags && query.tags.length > 0) {
      const matchingTagRows = await db
        .select({ datasetId: datasetTags.datasetId })
        .from(datasetTags)
        .innerJoin(tags, eq(datasetTags.tagId, tags.id))
        .where(inArray(tags.slug, query.tags));

      const tagCounts = new Map<string, number>();
      for (const row of matchingTagRows) {
        tagCounts.set(row.datasetId, (tagCounts.get(row.datasetId) || 0) + 1);
      }

      const datasetIds = [...new Set(matchingTagRows.map((r) => r.datasetId))].filter(
        (id) => (tagCounts.get(id) || 0) >= (query.tags?.length ?? 0)
      );

      if (datasetIds.length === 0) {
        return c.json({ data: [], total: 0, page, limit, totalPages: 0 }, 200);
      }

      conditions.push(inArray(datasets.id, datasetIds));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = datasets[query.sortBy];
    const orderBy =
      query.sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn);

    // Run data fetch and total count concurrently in a single Promise.all so
    // both queries execute against the same DB snapshot and we avoid the
    // extra latency of two sequential round-trips.
    const [data, totalResult] = await Promise.all([
      db.query.datasets.findMany({
        where,
        limit,
        offset,
        orderBy: [orderBy],
        with: {
          datasetTags: {
            with: {
              tag: true,
            },
          },
        },
      }),
      db.select({ value: count() }).from(datasets).where(where),
    ]);

    const formattedData = data.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      thumbnailS3Key: d.thumbnailS3Key,
      publisher: d.publisher,
      language: d.language,
      fileTypes: d.fileTypes,
      status: d.status,
      viewCount: d.viewCount,
      downloadCount: d.downloadCount,
      // createdAt is notNull() in the schema — no fallback needed
      createdAt: d.createdAt.toISOString(),
      tags: d.datasetTags.map((dt) => dt.tag),
    }));

    // Use ?? instead of || so a legitimate count of 0 is not replaced
    const total = totalResult[0]?.value ?? 0;

    return c.json(
      {
        data: formattedData,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      200,
    );
  },
);
