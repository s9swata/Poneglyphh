import { createDb } from "@Poneglyph/db";
import * as authSchema from "@Poneglyph/db/schema/auth";
import { user } from "@Poneglyph/db/schema/users";
import { env } from "@Poneglyph/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sendVerificationEmail } from "./mail";
import { openAPI } from "better-auth/plugins";

const schema = {
  ...authSchema,
  user,
};

export function createAuth() {
  const db = createDb();

  return betterAuth({
    appName: "Poneglyph",
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),
    trustedOrigins: [env.CORS_ORIGIN],
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      autoSignIn: false,
    },
    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: true,
      expiresIn: 86400,
      async sendVerificationEmail({ user, url }) {
        await sendVerificationEmail({
          email: user.email,
          name: user.name,
          url,
        });
      },
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        secure: env.NODE_ENV === "production",
        httpOnly: true,
      },
      crossSubDomainCookies: {
        enabled: true,
        domain: env.NODE_ENV === "production" ? ".vyse.site" : undefined,
      },
    },
    plugins: [openAPI()],
  });
}

export const auth = createAuth();
