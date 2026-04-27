import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { UploadCallbackSchema, UploadRequestSchema } from "@Poneglyph/schemas/upload";
import { env } from "@Poneglyph/env/server";
import { logger } from "@/lib/logger";
import { uploadFile, getPresignedUrl } from "../../lib/s3";
import { publishUploadMessage } from "../../lib/queue";
import { requireAuth } from "../../middleware/auth";

import { type AuthContext } from "../../middleware/auth";

const log = logger.getChild("upload");

export const uploadRouter = new Hono<{ Variables: AuthContext }>();

// File type -> extension mapping for S3 keys and DB file_type enum
const MIME_TO_EXT: Record<string, string> = {
  "application/pdf": "pdf",
  "text/csv": "csv",
  "application/json": "json",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * POST /api/upload
 * Accepts multipart/form-data with:
 *   - title        (required)
 *   - description  (required)
 *   - summary      (optional)
 *   - publisher    (optional)
 *   - tags         (optional, comma-separated)
 *   - files        (one or more attachments)
 *   - thumbnail    (optional, image file)
 *
 * Uploads files to R2 in parallel, enqueues processing job, returns upload_id.
 * Requires authentication.
 */
uploadRouter.post("/", requireAuth, zValidator("form", UploadRequestSchema), async (c) => {
  const user = c.get("user")!;
  const userId = user.id;

  const { title, description, summary, publisher, tags, files, thumbnail } = c.req.valid("form");

  const uploadId = crypto.randomUUID();

  log.info("Upload received: {fileCount} file(s), upload_id={uploadId}", {
    fileCount: files.length,
    uploadId,
  });

  const attachmentPromises = files.map(async (file) => {
    const ext = MIME_TO_EXT[file.type] ?? "other";
    const key = `uploads/${uploadId}/${crypto.randomUUID()}.${ext}`;
    const buffer = await file.arrayBuffer();

    await uploadFile(key, buffer, file.type);

    const presignedUrl = await getPresignedUrl(key);

    return {
      s3_key: key,
      presigned_url: presignedUrl,
      mime_type: file.type,
      file_type: ext,
    };
  });

  const thumbnailPromise = thumbnail
    ? (async () => {
        const ext = MIME_TO_EXT[thumbnail.type];
        const thumbKey = `uploads/${uploadId}/thumbnail.${ext}`;
        const thumbBuffer = await thumbnail.arrayBuffer();

        await uploadFile(thumbKey, thumbBuffer, thumbnail.type);

        return thumbKey;
      })()
    : Promise.resolve(undefined);

  // TODO: Replace with presigned URLs - client uploads directly to R2 (Zero Wait)
  // Issue: https://github.com/Itz-Agasta/Poneglyph/issues/8
  const [attachments, thumbnailS3Key] = await Promise.all([
    Promise.all(attachmentPromises),
    thumbnailPromise,
  ]);

  await publishUploadMessage({
    upload_id: uploadId,
    user_id: userId,
    title,
    description,
    summary,
    publisher,
    tags,
    attachments,
    thumbnail_s3_key: thumbnailS3Key,
    callback_url: new URL("/api/upload/callback", env.BETTER_AUTH_URL).toString(),
  });

  log.info("Upload queued: upload_id={uploadId}", { uploadId });

  return c.json({ upload_id: uploadId, status: "queued" }, 202);
});

/**
 * POST /api/upload/callback
 * Called by the Rust worker when processing is done.
 * Protected by an internal secret header (not user auth).
 */
uploadRouter.post("/callback", zValidator("json", UploadCallbackSchema), async (c) => {
  const secret = c.req.header("x-upload-callback-secret");
  if (secret !== env.UPLOAD_CALLBACK_SECRET) {
    log.warn("Upload callback rejected: invalid secret");
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = c.req.valid("json");

  if (body.status === "completed") {
    log.info("Upload completed: upload_id={uploadId}, dataset_id={datasetId}", {
      uploadId: body.upload_id,
      datasetId: body.dataset_id,
    });
  } else {
    log.warn("Upload failed: upload_id={uploadId}, error={error}", {
      uploadId: body.upload_id,
      error: body.error,
    });
  }
  // TODO: push real-time notification to frontend (WebSocket/SSE)
  return c.json({ ok: true });
});
