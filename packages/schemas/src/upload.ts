import { z } from "zod";

export const UploadCallbackSchema = z.object({
  upload_id: z.uuid(),
  dataset_id: z.uuid(),
  status: z.enum(["completed", "failed"]),
  error: z.string().optional(),
});
export type UploadCallback = z.infer<typeof UploadCallbackSchema>;

export const UploadResponseSchema = z.object({
  upload_id: z.string(),
  status: z.literal("queued"),
});
export type UploadResponse = z.infer<typeof UploadResponseSchema>;
