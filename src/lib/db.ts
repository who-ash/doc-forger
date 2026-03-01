import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "@/lib/db/schema";
import { env } from "@/lib/env";

type D1Response = {
  success: boolean;
  result?: Array<{ success: boolean; results?: Record<string, unknown>[] }>;
  errors?: Array<{ message?: string }>;
  messages?: Array<{ message?: string }>;
};

const queryUrl = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${env.CLOUDFLARE_DATABASE_ID}/query`;

async function queryD1(sql: string, params: unknown[]) {
  const response = await fetch(queryUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.CLOUDFLARE_D1_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
    cache: "no-store",
  });

  const rawBody = await response.text();
  let data: D1Response | null = null;

  try {
    data = JSON.parse(rawBody) as D1Response;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const reason =
      data?.errors?.[0]?.message ||
      data?.messages?.[0]?.message ||
      rawBody ||
      response.statusText;
    throw new Error(`D1 request failed: ${response.status} (${reason})`);
  }

  if (!data) {
    throw new Error("D1 response was not valid JSON");
  }

  if (!data.success || data.errors?.length) {
    const reason = data.errors?.[0]?.message ?? "Unknown D1 error";
    throw new Error(reason);
  }

  return data.result?.[0]?.results ?? [];
}

export const db = drizzle(
  async (sql, params, method) => {
    const rows = await queryD1(sql, params ?? []);
    const serializedRows = rows.map((row) => Object.values(row));

    if (method === "get") {
      return { rows: serializedRows[0] ?? [] };
    }
    return { rows: serializedRows };
  },
  { schema },
);
