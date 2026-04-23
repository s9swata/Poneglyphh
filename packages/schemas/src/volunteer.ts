import { z } from "zod";

export const VolunteerListQuerySchema = z.object({
  city: z.string().optional(),
  tags: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const VolunteerParamSchema = z.object({
  targetUserId: z.string().trim().min(1),
});
