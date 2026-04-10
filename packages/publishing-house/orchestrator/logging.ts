/**
 * Orchestrator Logging — structured console + optional SQLite persistence.
 *
 * Free tier path: if ARCANEA_DB_PATH is set, publish events persist to
 * the local publish_log table. Pro tier sync to Supabase runs separately
 * via db/sync.ts.
 */

import type { PublishLogEntry } from "./types.js";

/**
 * Log a publish event. Writes to structured console output AND, if a
 * SQLite database handle is provided via ARCANEA_DB_PATH, persists to
 * the local publish_log table for the free tier.
 */
export async function logPublish(entry: PublishLogEntry): Promise<void> {
  const summary = [
    `[publish-log] ${entry.status.toUpperCase()}`,
    `  title: ${entry.title}`,
    `  author: ${entry.author}`,
    `  score: ${entry.qualityScore} (${entry.qualityTier})`,
    `  platforms: ${entry.platforms}`,
    `  at: ${entry.publishedAt}`,
  ].join("\n");

  console.log(summary);

  // Persist to local SQLite if configured (free tier path)
  const dbPath = process.env.ARCANEA_DB_PATH;
  if (!dbPath) return;

  try {
    const { createDatabase, insertPublishLog } = await import("../db/sqlite.js");
    const db = createDatabase(dbPath);
    const assetId = entry.assetId ?? entry.id;
    const status =
      entry.status === "success" || entry.status === "published"
        ? "completed"
        : entry.status === "partial"
          ? "in_progress"
          : entry.status === "dry-run"
            ? "pending"
            : "failed";
    for (const platform of entry.platforms.split(",").map(p => p.trim()).filter(Boolean)) {
      insertPublishLog(db, {
        asset_id: assetId,
        platform,
        status,
        url: entry.url,
        published_at: entry.publishedAt,
      });
    }
  } catch (err) {
    // Non-fatal — logging must never break the publish pipeline
    console.warn("[publish-log] sqlite persist failed:", (err as Error).message);
  }
}
