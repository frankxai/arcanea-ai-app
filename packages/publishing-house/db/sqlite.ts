/**
 * Arcanea Publishing House — SQLite Local Engine
 *
 * Typed wrapper around better-sqlite3 for the free tier.
 * Creates/opens a local database, runs schema migrations,
 * and provides typed CRUD operations for the publishing pipeline.
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

import type {
  AssetInput,
  AssetRecord,
  TasteScores,
  PublishLogInput,
  PublishLogRecord,
  EditorialRecord,
  EditorialInput,
  QualityScoreRecord,
} from './types.js';

// ---------------------------------------------------------------------------
// Database creation
// ---------------------------------------------------------------------------

/**
 * Creates or opens a SQLite database at the given path and applies
 * the publishing house schema if the tables do not yet exist.
 */
export function createDatabase(dbPath: string): Database.Database {
  const db = new Database(dbPath);

  // Performance pragmas for local-first usage
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');

  // Apply schema
  const schemaPath = join(__dirname, 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');
  db.exec(schema);

  return db;
}

// ---------------------------------------------------------------------------
// Asset Metadata
// ---------------------------------------------------------------------------

/**
 * Insert a new asset into asset_metadata. Returns the full record.
 */
export function insertAsset(
  db: Database.Database,
  asset: AssetInput,
): AssetRecord {
  const id = asset.id ?? randomUUID();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO asset_metadata (
      id, file_path, file_hash, file_size, mime_type,
      guardian, element, gate, content_type,
      taste_score, status, created_at, updated_at
    ) VALUES (
      @id, @file_path, @file_hash, @file_size, @mime_type,
      @guardian, @element, @gate, @content_type,
      @taste_score, @status, @created_at, @updated_at
    )
  `);

  stmt.run({
    id,
    file_path: asset.file_path,
    file_hash: asset.file_hash ?? null,
    file_size: asset.file_size ?? null,
    mime_type: asset.mime_type ?? null,
    guardian: asset.guardian ?? null,
    element: asset.element ?? null,
    gate: asset.gate ?? null,
    content_type: asset.content_type ?? null,
    taste_score: asset.taste_score ?? 0,
    status: asset.status ?? 'new',
    created_at: now,
    updated_at: now,
  });

  return getAssetById(db, id)!;
}

/**
 * Get a single asset by ID.
 */
export function getAssetById(
  db: Database.Database,
  id: string,
): AssetRecord | undefined {
  const stmt = db.prepare('SELECT * FROM asset_metadata WHERE id = ?');
  return stmt.get(id) as AssetRecord | undefined;
}

/**
 * Get all assets matching a given status.
 */
export function getAssetsByStatus(
  db: Database.Database,
  status: string,
): AssetRecord[] {
  const stmt = db.prepare('SELECT * FROM asset_metadata WHERE status = ? ORDER BY created_at DESC');
  return stmt.all(status) as AssetRecord[];
}

/**
 * Update the TASTE score on an asset and insert a quality_scores record.
 * Also updates the asset status to 'scored' and sets classified_at.
 */
export function updateTasteScore(
  db: Database.Database,
  id: string,
  scores: TasteScores,
): void {
  const totalScore =
    (scores.canon_alignment +
      scores.design_compliance +
      scores.emotional_impact +
      scores.technical_fit +
      scores.uniqueness) /
    5;

  const now = new Date().toISOString();

  const updateAsset = db.prepare(`
    UPDATE asset_metadata
    SET taste_score = @taste_score,
        status = 'scored',
        classified_at = @now,
        updated_at = @now
    WHERE id = @id
  `);

  const insertScore = db.prepare(`
    INSERT INTO quality_scores (
      id, asset_id, canon_alignment, design_compliance,
      emotional_impact, technical_fit, uniqueness,
      total_score, scored_at
    ) VALUES (
      @qid, @asset_id, @canon_alignment, @design_compliance,
      @emotional_impact, @technical_fit, @uniqueness,
      @total_score, @scored_at
    )
  `);

  const transaction = db.transaction(() => {
    updateAsset.run({
      taste_score: totalScore,
      now,
      id,
    });
    insertScore.run({
      qid: randomUUID(),
      asset_id: id,
      canon_alignment: scores.canon_alignment,
      design_compliance: scores.design_compliance,
      emotional_impact: scores.emotional_impact,
      technical_fit: scores.technical_fit,
      uniqueness: scores.uniqueness,
      total_score: totalScore,
      scored_at: now,
    });
  });

  transaction();
}

/**
 * Get hero assets — those with taste_score >= minScore (default 80).
 * Returns assets ordered by score descending.
 */
export function getHeroes(
  db: Database.Database,
  minScore = 80,
): AssetRecord[] {
  const stmt = db.prepare(
    'SELECT * FROM asset_metadata WHERE taste_score >= ? ORDER BY taste_score DESC',
  );
  return stmt.all(minScore) as AssetRecord[];
}

/**
 * Get hero assets that have not been synced to the cloud yet.
 */
export function getUnsyncedHeroes(
  db: Database.Database,
  minScore = 80,
): AssetRecord[] {
  const stmt = db.prepare(
    'SELECT * FROM asset_metadata WHERE taste_score >= ? AND synced_to_cloud = 0 ORDER BY taste_score DESC',
  );
  return stmt.all(minScore) as AssetRecord[];
}

/**
 * Mark an asset as synced to the cloud.
 */
export function markSynced(
  db: Database.Database,
  id: string,
): void {
  const stmt = db.prepare(
    'UPDATE asset_metadata SET synced_to_cloud = 1, updated_at = ? WHERE id = ?',
  );
  stmt.run(new Date().toISOString(), id);
}

// ---------------------------------------------------------------------------
// Publish Log
// ---------------------------------------------------------------------------

/**
 * Insert a publish log entry for an asset distribution event.
 */
export function insertPublishLog(
  db: Database.Database,
  log: PublishLogInput,
): void {
  const id = log.id ?? randomUUID();

  const stmt = db.prepare(`
    INSERT INTO publish_log (
      id, asset_id, platform, status, url, revenue, published_at, created_at
    ) VALUES (
      @id, @asset_id, @platform, @status, @url, @revenue, @published_at, @created_at
    )
  `);

  stmt.run({
    id,
    asset_id: log.asset_id,
    platform: log.platform,
    status: log.status ?? 'pending',
    url: log.url ?? null,
    revenue: log.revenue ?? 0,
    published_at: log.published_at ?? null,
    created_at: new Date().toISOString(),
  });
}

/**
 * Get publish log entries for a specific asset.
 */
export function getPublishLogByAsset(
  db: Database.Database,
  assetId: string,
): PublishLogRecord[] {
  const stmt = db.prepare(
    'SELECT * FROM publish_log WHERE asset_id = ? ORDER BY created_at DESC',
  );
  return stmt.all(assetId) as PublishLogRecord[];
}

// ---------------------------------------------------------------------------
// Quality Scores
// ---------------------------------------------------------------------------

/**
 * Get all quality score records for an asset.
 */
export function getQualityScores(
  db: Database.Database,
  assetId: string,
): QualityScoreRecord[] {
  const stmt = db.prepare(
    'SELECT * FROM quality_scores WHERE asset_id = ? ORDER BY scored_at DESC',
  );
  return stmt.all(assetId) as QualityScoreRecord[];
}

// ---------------------------------------------------------------------------
// Editorial Board
// ---------------------------------------------------------------------------

/**
 * Insert a new editorial board entry.
 */
export function insertEditorial(
  db: Database.Database,
  entry: EditorialInput,
): EditorialRecord {
  const id = entry.id ?? randomUUID();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO editorial_board (
      id, title, status, collection, author,
      word_count, quality_score, language, source_path,
      created_at, updated_at
    ) VALUES (
      @id, @title, @status, @collection, @author,
      @word_count, @quality_score, @language, @source_path,
      @created_at, @updated_at
    )
  `);

  stmt.run({
    id,
    title: entry.title,
    status: entry.status ?? 'draft',
    collection: entry.collection ?? null,
    author: entry.author ?? null,
    word_count: entry.word_count ?? 0,
    quality_score: entry.quality_score ?? 0,
    language: entry.language ?? 'en',
    source_path: entry.source_path ?? null,
    created_at: now,
    updated_at: now,
  });

  const get = db.prepare('SELECT * FROM editorial_board WHERE id = ?');
  return get.get(id) as EditorialRecord;
}

/**
 * Get editorial board entries, optionally filtered by status.
 */
export function getEditorialBoard(
  db: Database.Database,
  status?: string,
): EditorialRecord[] {
  if (status) {
    const stmt = db.prepare(
      'SELECT * FROM editorial_board WHERE status = ? ORDER BY updated_at DESC',
    );
    return stmt.all(status) as EditorialRecord[];
  }
  const stmt = db.prepare(
    'SELECT * FROM editorial_board ORDER BY updated_at DESC',
  );
  return stmt.all() as EditorialRecord[];
}
