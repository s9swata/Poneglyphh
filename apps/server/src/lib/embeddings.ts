import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { logger } from "@/lib/logger";
import { redis } from "./redis";
import { hashQuery } from "./hash";

const log = logger.getChild("cache");
const externalLog = logger.getChild("external");

const EMBEDDING_MODEL = google.textEmbeddingModel("gemini-embedding-2-preview");
const CACHE_TTL = 60 * 60 * 24; // 24 hours

/**
 * Embeds a query using Google's model. Results are cached in Redis for 24h
 * since the same user queries (or repeated ones) are common in chat UX.
 * Cache miss -> call API -> cache result.
 */
export async function embedQuery(query: string): Promise<number[]> {
  const normalized = query.trim().toLowerCase();
  const hash = hashQuery(normalized);
  const cacheKey = `emb:${hash}`;

  let cached: number[] | null = null;
  try {
    cached = await redis.get<number[]>(cacheKey);
  } catch {
    // Redis down -> fall back to API
  }
  if (cached) {
    log.debug("Embedding cache hit", { key: `emb:<hash>` });
    return cached;
  }

  log.debug("Embedding cache miss", { key: `emb:<hash>` });
  externalLog.debug("Gemini embedding API call started");

  const start = Date.now();
  const { embedding } = await embed({
    model: EMBEDDING_MODEL,
    value: normalized,
    providerOptions: {
      google: {
        outputDimensionality: 768,
      },
    },
  });

  externalLog.debug("Gemini embedding API call completed in {duration}ms", {
    duration: Date.now() - start,
  });

  redis.set(cacheKey, embedding, { ex: CACHE_TTL }).catch((err) => {
    log.warn("Failed to cache embedding: {error}", { error: String(err) });
  });

  return embedding;
}
