import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ChatRequestSchema } from "@Poneglyph/schemas/chat";
import { createAgentUIStreamResponse } from "ai";
import { logger } from "@/lib/logger";
import { createOrchestratorAgent } from "../../agents/orchestrator";
import { requireAuth } from "../../middleware/auth";

import { type AuthContext } from "../../middleware/auth";

const log = logger.getChild("agent");

export const chatRouter = new Hono<{ Variables: AuthContext }>();

/**
 * POST /api/chat
 * Multi-agent research endpoint.
 * Requires a valid better-auth session (cookie-based).
 * Accepts { messages: UIMessage[] } and streams the agent response.
 *
 *
 * curl -X POST http://localhost:3000/api/chat \
 *   -H "Content-Type: application/json" \
 *   -H "Cookie: ..." \
 *   -d '{
 *     "messages": [
 *       {
 *         "id": "msg-1",
 *         "role": "user",
 *         "parts": [
 *           {
 *             "type": "text",
 *             "text": "Tell me about....."
 *           }
 *         ]
 *       }
 *     ]
 *   }' \
 *   --no-buffer
 */

chatRouter.post("/", requireAuth, zValidator("json", ChatRequestSchema), async (c) => {
  const user = c.get("user")!;
  const { messages } = c.req.valid("json");
  const startTime = Date.now();

  log.info("Chat request received from user={userId}: {messageCount} message(s)", {
    userId: user.id,
    messageCount: messages.length,
  });

  const agent = createOrchestratorAgent();

  const response = createAgentUIStreamResponse({
    agent: agent as any,
    uiMessages: messages,
  });

  log.info("Chat stream initiated in {duration}ms", {
    duration: Date.now() - startTime,
  });

  return response;
});
