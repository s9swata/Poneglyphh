import { z } from "zod";

const ACCEPTED_DOCUMENT_MIME = [
  "application/pdf",
  "text/csv",
  "application/json",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

const ACCEPTED_IMAGE_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const documentFile = z
  .file()
  .max(MAX_FILE_SIZE, "File exceeds the 50MB limit")
  .mime(
    [...ACCEPTED_DOCUMENT_MIME],
    "Unsupported format. Allowed: PDF, CSV, JSON, XLSX, XLS, DOCX",
  );

const imageFile = z
  .file()
  .max(MAX_FILE_SIZE, "Thumbnail exceeds the 50MB limit")
  .mime([...ACCEPTED_IMAGE_MIME], "Thumbnail must be an image (jpg, jpeg, png, or webp)");

export const UploadRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  summary: z.string().optional(),
  publisher: z.string().optional(),
  tags: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    ),
  files: z.preprocess(
    (val) => (Array.isArray(val) ? val : [val]),
    z.array(documentFile).min(1, "At least one file is required"),
  ),
  thumbnail: imageFile.optional(),
});

export type UploadRequest = z.infer<typeof UploadRequestSchema>;

export const UploadCallbackSchema = z.object({
  upload_id: z.uuid(),
  dataset_id: z.uuid(),
  status: z.enum(["completed", "failed"]),
  error: z.string().optional(),
});
export type UploadCallback = z.infer<typeof UploadCallbackSchema>;

export const UploadResponseSchema = z.object({
  upload_id: z.uuid(),
  status: z.literal("queued"),
});
export type UploadResponse = z.infer<typeof UploadResponseSchema>;
