import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;
let schemaReady: Promise<void> | null = null;

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");
  if (!client) client = neon(url);
  return client;
}

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getDatabase();
      await sql`
        CREATE TABLE IF NOT EXISTS site_content (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS admin_users (
          id BIGSERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          session_version INTEGER NOT NULL DEFAULT 1,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS admin_login_attempts (
          attempt_key TEXT PRIMARY KEY,
          attempts INTEGER NOT NULL DEFAULT 0,
          window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          locked_until TIMESTAMPTZ
        )
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}
