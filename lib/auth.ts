import { betterAuth } from "better-auth";
import { Pool } from "pg";

const DEV_ALLOWED_HOSTS = [
  "localhost:3000",
  "127.0.0.1:3000",
  "192.168.*.*:3000",
  "10.*.*.*:3000",
  "172.16.*.*:3000",
  "172.17.*.*:3000",
  "172.18.*.*:3000",
  "172.19.*.*:3000",
  "172.2?.*.*:3000",
  "172.30.*.*:3000",
  "172.31.*.*:3000",
];

function getProductionBaseURL() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.V0_RUNTIME_URL) return process.env.V0_RUNTIME_URL;
  return "http://localhost:3000";
}

function getBaseURLConfig() {
  if (process.env.NODE_ENV === "production") {
    return getProductionBaseURL();
  }

  return {
    protocol: "http" as const,
    fallback: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    allowedHosts: DEV_ALLOWED_HOSTS,
  };
}

const trustedOrigins = [
  process.env.V0_RUNTIME_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined,
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.DEV_ORIGIN,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean) as string[];

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  baseURL: getBaseURLConfig(),
  trustedOrigins:
    process.env.NODE_ENV === "production" ? trustedOrigins : undefined,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
    },
  },
});
