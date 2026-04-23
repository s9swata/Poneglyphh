import { z } from "zod";

export const DatasetListQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected", "archived"]).optional(),
  fileType: z.enum(["pdf", "csv", "xlsx", "xls", "json", "docx", "other"]).optional(),
  language: z.string().optional(),
  tags: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : [val];
    }),
  sortBy: z.enum(["createdAt", "viewCount", "downloadCount"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
