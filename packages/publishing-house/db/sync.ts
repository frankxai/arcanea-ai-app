/**
 * Arcanea Publishing House — Supabase Sync
 *
 * Syncs hero assets (TASTE >= 80) from the local SQLite database
 * to Supabase via the REST API. Only syncs assets that have not
 * been synced yet (synced_to_cloud = 0).
 */

import type Database from 'better-sqlite3';
import { getUnsyncedHeroes, markSynced } from './sqlite.js';
import type { AssetRecord, SyncResult, SyncError } from './types.js';

/**
 * Maps a local SQLite asset record to the Supabase asset_metadata
 * column format (which uses different column names / types).
 */
function toSupabasePayload(asset: AssetRecord): Record<string, unknown> {
  return {
    id: asset.id,
    file_name: asset.file_path?.split('/').pop() ?? 'unknown',
    file_path: asset.file_path,
    file_hash: asset.file_hash,
    file_size: asset.file_size,
    mime_type: asset.mime_type,
    guardian: asset.guardian,
    element: asset.element,
    gate: asset.gate,
    content_type: asset.content_type,
    quality_score: asset.taste_score,
    quality_tier: asset.taste_score >= 80 ? 'hero' : 'gallery',
    status: asset.status,
    created_at: asset.created_at,
    updated_at: asset.updated_at,
  };
}

/**
 * Sync hero assets from local SQLite to Supabase.
 *
 * Only syncs assets where:
 *  - taste_score >= 80
 *  - synced_to_cloud = 0 (not yet synced)
 *
 * Uses the Supabase REST API (PostgREST) with upsert to handle
 * both new inserts and re-syncs gracefully.
 *
 * @param db - The local SQLite database instance
 * @param supabaseUrl - Supabase project URL (e.g. https://xyz.supabase.co)
 * @param supabaseKey - Supabase anon or service_role key
 * @returns Counts of synced, failed, and skipped assets
 */
export async function syncHeroesToSupabase(
  db: Database.Database,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<SyncResult> {
  const heroes = getUnsyncedHeroes(db);

  const result: SyncResult = {
    synced: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  if (heroes.length === 0) {
    return result;
  }

  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/asset_metadata`;

  // Process in batches of 50 to avoid oversized payloads
  const BATCH_SIZE = 50;

  for (let i = 0; i < heroes.length; i += BATCH_SIZE) {
    const batch = heroes.slice(i, i + BATCH_SIZE);
    const payloads = batch.map(toSupabasePayload);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(payloads),
      });

      if (response.ok) {
        // Mark each asset in the batch as synced
        for (const asset of batch) {
          markSynced(db, asset.id);
          result.synced++;
        }
      } else {
        const errorText = await response.text();
        for (const asset of batch) {
          result.failed++;
          result.errors.push({
            asset_id: asset.id,
            message: `HTTP ${response.status}: ${errorText}`,
          });
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      for (const asset of batch) {
        result.failed++;
        result.errors.push({
          asset_id: asset.id,
          message: `Network error: ${message}`,
        });
      }
    }
  }

  return result;
}
