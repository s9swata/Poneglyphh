import { createMiddleware } from "hono/factory";
import { auth } from "@Poneglyph/auth";

export type AuthContext = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

/**
 * Resolve Better Auth session and attach user + session to Hono context.
 * Does NOT block — subsequent middleware/routes decide whether auth is required.
 */
export const authMiddleware = createMiddleware<{
  Variables: AuthContext;
}>(async (c, next) => {
  if (c.get("user") === undefined) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    c.set("user", session?.user ?? null);
    c.set("session", session?.session ?? null);
  }
  await next();
});

/**
 * Require a valid session. Self-contained — resolves session inline if not already set,
 * so it's safe to use on any router regardless of global middleware.
 */
export const requireAuth = createMiddleware<{
  Variables: AuthContext;
}>(async (c, next) => {
  if (c.get("user") === undefined) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    c.set("user", session?.user ?? null);
    c.set("session", session?.session ?? null);
  }

  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Authentication required" }, 401);
  }
  await next();
});
