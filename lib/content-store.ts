import "server-only";

import { defaultSiteContent, normalizeSiteContent, type SiteContent } from "@/lib/site-content";
import { databaseConfigured, ensureSchema, getDatabase } from "@/lib/database";

export async function getSiteContent(): Promise<SiteContent> {
  if (!databaseConfigured()) return defaultSiteContent;

  try {
    await ensureSchema();
    const sql = getDatabase();
    const rows = await sql`SELECT data FROM site_content WHERE id = 'main' LIMIT 1`;
    if (rows.length === 0) {
      await sql`
        INSERT INTO site_content (id, data)
        VALUES ('main', ${JSON.stringify(defaultSiteContent)}::jsonb)
        ON CONFLICT (id) DO NOTHING
      `;
      return defaultSiteContent;
    }
    return normalizeSiteContent(rows[0].data);
  } catch (error) {
    console.error("Unable to load managed site content; using bundled content.", error);
    return defaultSiteContent;
  }
}

export async function saveSiteContent(input: unknown): Promise<SiteContent> {
  if (!databaseConfigured()) {
    throw new Error("The content database has not been connected yet.");
  }
  const content = normalizeSiteContent(input);
  await ensureSchema();
  const sql = getDatabase();
  await sql`
    INSERT INTO site_content (id, data, updated_at)
    VALUES ('main', ${JSON.stringify(content)}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
  `;
  return content;
}
