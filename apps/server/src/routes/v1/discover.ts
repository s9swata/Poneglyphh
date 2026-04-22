import { db, sql } from "@Poneglyph/db";
import { volunteer } from "@Poneglyph/db/schema/users";
import { VolunteerListQuerySchema, VolunteerParamSchema } from "@Poneglyph/schemas/volunteer";
import { zValidator } from "@hono/zod-validator";
import { count, and, inArray, eq, desc, type SQL } from "drizzle-orm";
import { Hono } from "hono";
import { requireAuth } from "../../middleware/auth";

export const discoverRouter = new Hono();

/**
 * GET /api/discover/volunteers
 * Paginated volunteer listing with filters.
 *   - page        (default: 1)
 *   - limit       (default: 20, max: 100)
 *   - city        (optional) filter by city
 *   - tags        (optional) filter by tag slugs (comma-separated)
 */
discoverRouter.get(
  "/volunteers",
  requireAuth,
  zValidator("query", VolunteerListQuerySchema),
  async (c) => {
    const { page, limit, city, tags } = c.req.valid("query");
    const offset = (page - 1) * limit;
    const filters: string[] = [];

    const tagSlugs = tags
      ? [
          ...new Set(
            tags
              .split(",")
              .map((tag) => tag.trim().toLowerCase())
              .filter(Boolean),
          ),
        ]
      : [];

    if (tagSlugs.length > 0) {
      const matchedVolunteerResult = await db.execute<{ volunteer_id: string }>(sql`
      SELECT vt.volunteer_id
      FROM volunteer_tags vt
      INNER JOIN tags t ON vt.tag_id = t.id
      WHERE t.slug IN (${sql.join(
        tagSlugs.map((slug) => sql`${slug}`),
        sql`, `,
      )})
      GROUP BY vt.volunteer_id
      HAVING COUNT(DISTINCT t.slug) = ${tagSlugs.length}
    `);

      const matchedVolunteerIDs = matchedVolunteerResult.rows.map((row) => row.volunteer_id);

      if (matchedVolunteerIDs.length === 0) {
        return c.json({ data: [], total: 0, page, limit, totalPages: 0 }, 200);
      }

      filters.push(...matchedVolunteerIDs);
    }

    const conditions: SQL[] = [];
    const normalizedCity = city?.trim().toLowerCase();

    if (normalizedCity) conditions.push(eq(sql`lower(${volunteer.city})`, normalizedCity));
    if (filters.length > 0) conditions.push(inArray(volunteer.userId, filters));

    const condition =
      conditions.length === 0
        ? undefined
        : conditions.length === 1
          ? conditions[0]
          : and(...conditions);

    const [rows, totalRows] = await Promise.all([
      db.query.volunteer.findMany({
        where: condition,
        limit,
        offset,
        orderBy: (fields) => [desc(fields.createdAt)],
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
          volunteerTags: {
            with: {
              tag: {
                columns: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        columns: {
          description: true,
          city: true,
          pastWorks: true,
        },
      }),
      db.select({ total: count() }).from(volunteer).where(condition),
    ]);

    const total = totalRows[0]?.total ?? 0;

    return c.json(
      {
        data: rows.map((record) => ({
          userId: record.user?.id,
          name: record.user?.name,
          image: record.user?.image,
          description: record.description,
          city: record.city,
          pastWorks: record.pastWorks,
          tags: record.volunteerTags.map((item) => item.tag),
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      200,
    );
  },
);

/**
 * GET /api/discover/volunteers/:targetUserId
 * Volunteer detail by user ID.
 * Returns full volunteer profile with tags.
 */
discoverRouter.get(
  "/volunteers/:targetUserId",
  requireAuth,
  zValidator("param", VolunteerParamSchema),
  async (c) => {
    const { targetUserId } = c.req.valid("param");

    const volunteerRecord = await db.query.volunteer.findFirst({
      where: (fields, { eq }) => eq(fields.userId, targetUserId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        volunteerTags: {
          with: {
            tag: {
              columns: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      columns: {
        description: true,
        city: true,
        pastWorks: true,
      },
    });

    if (!volunteerRecord || !volunteerRecord.user) {
      return c.json({ error: "Target volunteer not found" }, 404);
    }

    return c.json({
      volunteer: {
        userId: volunteerRecord.user.id,
        name: volunteerRecord.user.name,
        image: volunteerRecord.user.image,
        description: volunteerRecord.description,
        city: volunteerRecord.city,
        pastWorks: volunteerRecord.pastWorks,
        tags: volunteerRecord.volunteerTags.map((item) => item.tag),
      },
    });
  },
);
