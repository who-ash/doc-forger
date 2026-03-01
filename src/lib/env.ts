import { z } from "zod";

const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  FIRST_ADMIN_STRATEGY: z
    .enum(["single_admin_default"])
    .default("single_admin_default"),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_DATABASE_ID: z.string().min(1),
  CLOUDFLARE_D1_TOKEN: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
});

export const env = envSchema.parse({
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  FIRST_ADMIN_STRATEGY: process.env.FIRST_ADMIN_STRATEGY,
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_DATABASE_ID: process.env.CLOUDFLARE_DATABASE_ID,
  CLOUDFLARE_D1_TOKEN: process.env.CLOUDFLARE_D1_TOKEN,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
});
