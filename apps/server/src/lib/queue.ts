import { PubSub } from "@google-cloud/pubsub";
import { env } from "@Poneglyph/env/server";

export interface AttachmentInfo {
  s3_key: string;
  presigned_url: string;
  mime_type: string;
  file_type: string;
}

export interface UploadMessage {
  upload_id: string;
  user_id: string;
  title: string;
  description: string;
  summary?: string;
  publisher?: string;
  tags: string[];
  attachments: AttachmentInfo[];
  thumbnail_s3_key?: string;
  callback_url: string;
}

const pubsub = new PubSub({
  projectId: env.PUBSUB_PROJECT_ID,
});

export async function publishUploadMessage(msg: UploadMessage): Promise<void> {
  await pubsub
    .topic(env.PUBSUB_UPLOAD_TOPIC)
    .publishMessage({
      json: msg,
      attributes: {
        upload_id: msg.upload_id,
      },
    });
}
