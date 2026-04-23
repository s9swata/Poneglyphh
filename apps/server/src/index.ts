import { logger, honoLogger } from "@/lib/logger";
import { auth } from "@Poneglyph/auth";
import { env } from "@Poneglyph/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { authMiddleware } from "./middleware/auth";
import { apiRouter } from "./routes/router";

const app = new Hono();

// Middlewares
app.use(
  honoLogger({
    category: ["poneglyph", "http"],
    skip: (c) => c.req.path === "/health",
  }),
);

app.use(
  "/api/auth/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use(
  "/api/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Direct routes
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  c.header("Content-Type", "text/plain");
  return c.text("OK from Agasta");
});

app.get("/health", (c) =>
  c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  }),
);

// API sub-app
// URLs: /api/chat/...
const api = new Hono().basePath("/api");
api.use("/*", authMiddleware);
api.route("/", apiRouter);
app.route("/", api);

// Fallback handlers
app.onError((err, c) => {
  logger.error("Unhandled error: {error}", { error: err.message });
  return c.json({ error: "Internal Server Error" }, 500);
});

app.notFound((c) => c.json({ error: "Not Found" }, 404));

export default app;

export type AppType = typeof app;
