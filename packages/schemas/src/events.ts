import { z } from "zod";

export const applicationStatusEnum = z.enum(["applied", "shortlisted", "rejected", "withdrawn"]);

// ---------------------------------------------------------------------------
// Event creation (org-only)
// ---------------------------------------------------------------------------

export const CreateEventSchema = z.object({
  title: z.string().trim().min(3).max(255),
  description: z.string().trim().min(10),
  pay: z.coerce.number().nonnegative(),
  location: z.string().trim().max(255).optional(),
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;

// ---------------------------------------------------------------------------
// Event listing / query
// ---------------------------------------------------------------------------

export const EventListQuerySchema = z.object({
  /** Free-text search against title and description */
  q: z.string().optional(),
  /** Filter by location (partial match) */
  location: z.string().optional(),
  /** Filter by org */
  orgId: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type EventListQuery = z.infer<typeof EventListQuerySchema>;

// ---------------------------------------------------------------------------
// Event param
// ---------------------------------------------------------------------------

export const EventParamSchema = z.object({
  eventId: z.uuid(),
});

export const ApplicationListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
