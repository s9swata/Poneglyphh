import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@Poneglyph/env/server";

const s3 = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

/**
 * Upload a file buffer to R2.
 * Returns the S3 key (not a URL).
 */
export async function uploadFile(
  key: string,
  body: ArrayBuffer,
  contentType: string,
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      Body: new Uint8Array(body),
      ContentType: contentType,
    }),
  );
  return key;
}

/**
 * Generate a presigned GET URL valid for 1 hour.
 * Pass forceDownload=true to set Content-Disposition: attachment so the browser
 * prompts a file save instead of opening inline.
 */
export async function getPresignedUrl(key: string, forceDownload = false): Promise<string> {
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      ...(forceDownload ? { ResponseContentDisposition: "attachment" } : {}),
    }),
    { expiresIn: 3600 },
  );
}
