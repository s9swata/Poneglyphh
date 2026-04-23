import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { redis } from "../../lib/redis";
import { hashQuery } from "../../lib/hash";

const log = logger.getChild("cache");
const agentLog = logger.getChild("agent");
const externalLog = logger.getChild("external");

const WEB_CACHE_TTL = 60 * 30; // 30 minutes
const WEB_CACHE_VERSION = "v1";

export interface CachedWebResult {
  summary: string;
  sources: any;
}

/**
 * Isolated generateText call using Gemini's native Google Search grounding.
 *
 * Must be kept in its own call — Gemini does not allow mixing provider-defined
 * tools (google.tools.googleSearch) with custom tools in the same request.
 * Wrapping it here as a plain tool() lets the orchestrator treat it like any
 * other custom tool with no restrictions.
 *
 * Ref: https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai#google-search-grounding
 */
async function runGoogleGroundedSearch(query: string): Promise<CachedWebResult> {
  const hash = hashQuery(query);
  const cacheKey = `tool:web:${WEB_CACHE_VERSION}:${hash}`;

  let cached: CachedWebResult | null = null;
  try {
    cached = await redis.get<CachedWebResult>(cacheKey);
  } catch {
    // Redis down -> fall back to API
  }
  if (cached) {
    log.debug("Web search cache hit", { key: `tool:web:${WEB_CACHE_VERSION}:<hash>` });
    return cached;
  }

  log.debug("Web search cache miss", { key: `tool:web:${WEB_CACHE_VERSION}:<hash>` });
  externalLog.debug("Gemini Google Search API call started");

  const start = Date.now();
  const { text, sources } = await generateText({
    model: google("gemini-2.5-flash"),
    tools: { google_search: google.tools.googleSearch({}) },
    prompt: query,
  });

  externalLog.debug("Gemini Google Search API call completed in {duration}ms", {
    duration: Date.now() - start,
  });

  const result: CachedWebResult = { summary: text, sources };
  redis.set(cacheKey, result, { ex: WEB_CACHE_TTL }).catch((err) => {
    log.warn("Failed to cache web search result: {error}", { error: String(err) });
  });

  return result;
}

export const webSearchTool = tool({
  description:
    "Fast real-time web search using Google Search grounding via Gemini. " +
    "Use for current events, breaking crises, recent news, live policy updates, and any query requiring up-to-date information. " +
    "Returns a grounded summary and a list of source citations.",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
  }),
  execute: async ({ query }) => {
    agentLog.info("Tool invoked: webSearch");
    return runGoogleGroundedSearch(query);
  },
});
