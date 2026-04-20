import { z } from "zod";

// NOTE: messages is z.any() — the ai SDK's UIMessage shape includes tool-call,
// reasoning, image parts and other types not enumerated here. Vercel's UIMessage
// is trusted at runtime. I will tighten this once the message format is finalized.
export const ChatRequestSchema = z.object({
  messages: z.array(z.any()).min(1, "At least one message is required"),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
