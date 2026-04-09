-- =====================================================================
-- ARCANEA PUBLISHING HOUSE — LOCAL SQLite ENGINE
-- =====================================================================
-- Version: 1.0.0
-- Date: 2026-04-09
-- Purpose: Local-first SQLite schema for the free tier of the Arcanea
--          Publishing House. Mirrors the Supabase asset_metadata and
--          publish_pipeline tables, plus publishing-specific tables
--          for quality scoring and editorial board.
-- =====================================================================


-- =====================================================================
-- TABLE 1: asset_metadata
-- Single source of truth for ALL media in the local publishing engine
-- =====================================================================

CREATE TABLE IF NOT EXISTS asset_metadata (
  id              TEXT PRIMARY KEY,
  file_path       TEXT,
  file_hash       TEXT,
  file_size       INTEGER,
  mime_type       TEXT,

  -- Arcanea canonical classification
  guardian        TEXT,
  element         TEXT CHECK (element IS NULL OR element IN ('Fire', 'Water', 'Earth', 'Wind', 'Void')),
  gate            TEXT CHECK (gate IS NULL OR gate IN (
                    'Foundation', 'Flow', 'Fire', 'Heart', 'Voice',
                    'Sight', 'Crown', 'Starweave', 'Unity', 'Source'
                  )),
  content_type    TEXT CHECK (content_type IS NULL OR content_type IN (
                    'hero', 'gallery', 'thumbnail', 'social',
                    'video', 'audio', 'raw'
                  )),

  -- Quality (TASTE scoring)
  taste_score     REAL DEFAULT 0 CHECK (taste_score >= 0 AND taste_score <= 100),

  -- Lifecycle
  status          TEXT DEFAULT 'new' CHECK (status IN (
                    'new', 'classified', 'processed', 'scored',
                    'approved', 'rejected', 'published'
                  )),

  -- Timestamps (ISO 8601 TEXT for SQLite)
  classified_at   TEXT,
  processed_at    TEXT,
  uploaded_at     TEXT,
  approved        INTEGER DEFAULT 0,
  synced_to_cloud INTEGER DEFAULT 0,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);


-- =====================================================================
-- TABLE 2: publish_log
-- Track every distribution action per asset
-- =====================================================================

CREATE TABLE IF NOT EXISTS publish_log (
  id              TEXT PRIMARY KEY,
  asset_id        TEXT NOT NULL REFERENCES asset_metadata(id) ON DELETE CASCADE,
  platform        TEXT NOT NULL,
  status          TEXT DEFAULT 'pending' CHECK (status IN (
                    'pending', 'in_progress', 'completed', 'failed', 'rolled_back'
                  )),
  url             TEXT,
  revenue         REAL DEFAULT 0,
  published_at    TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);


-- =====================================================================
-- TABLE 3: quality_scores
-- TASTE 5D scoring breakdown per asset
-- =====================================================================

CREATE TABLE IF NOT EXISTS quality_scores (
  id                TEXT PRIMARY KEY,
  asset_id          TEXT NOT NULL REFERENCES asset_metadata(id) ON DELETE CASCADE,
  canon_alignment   REAL DEFAULT 0 CHECK (canon_alignment >= 0 AND canon_alignment <= 100),
  design_compliance REAL DEFAULT 0 CHECK (design_compliance >= 0 AND design_compliance <= 100),
  emotional_impact  REAL DEFAULT 0 CHECK (emotional_impact >= 0 AND emotional_impact <= 100),
  technical_fit     REAL DEFAULT 0 CHECK (technical_fit >= 0 AND technical_fit <= 100),
  uniqueness        REAL DEFAULT 0 CHECK (uniqueness >= 0 AND uniqueness <= 100),
  total_score       REAL DEFAULT 0 CHECK (total_score >= 0 AND total_score <= 100),
  scored_at         TEXT DEFAULT (datetime('now'))
);


-- =====================================================================
-- TABLE 4: editorial_board
-- Content pipeline tracking for written works
-- =====================================================================

CREATE TABLE IF NOT EXISTS editorial_board (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  status          TEXT DEFAULT 'draft' CHECK (status IN (
                    'draft', 'review', 'revision', 'approved',
                    'published', 'archived'
                  )),
  collection      TEXT,
  author          TEXT,
  word_count      INTEGER DEFAULT 0,
  quality_score   REAL DEFAULT 0,
  language        TEXT DEFAULT 'en',
  source_path     TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);


-- =====================================================================
-- INDEXES
-- =====================================================================

-- asset_metadata
CREATE INDEX IF NOT EXISTS idx_asset_metadata_status       ON asset_metadata(status);
CREATE INDEX IF NOT EXISTS idx_asset_metadata_guardian      ON asset_metadata(guardian);
CREATE INDEX IF NOT EXISTS idx_asset_metadata_content_type  ON asset_metadata(content_type);
CREATE INDEX IF NOT EXISTS idx_asset_metadata_taste_score   ON asset_metadata(taste_score);
CREATE INDEX IF NOT EXISTS idx_asset_metadata_file_hash     ON asset_metadata(file_hash);
CREATE INDEX IF NOT EXISTS idx_asset_metadata_synced        ON asset_metadata(synced_to_cloud);

-- publish_log
CREATE INDEX IF NOT EXISTS idx_publish_log_asset_id        ON publish_log(asset_id);
CREATE INDEX IF NOT EXISTS idx_publish_log_platform        ON publish_log(platform);
CREATE INDEX IF NOT EXISTS idx_publish_log_status          ON publish_log(status);

-- quality_scores
CREATE INDEX IF NOT EXISTS idx_quality_scores_asset_id     ON quality_scores(asset_id);
CREATE INDEX IF NOT EXISTS idx_quality_scores_total        ON quality_scores(total_score);

-- editorial_board
CREATE INDEX IF NOT EXISTS idx_editorial_board_status      ON editorial_board(status);
CREATE INDEX IF NOT EXISTS idx_editorial_board_collection  ON editorial_board(collection);


-- =====================================================================
-- DONE
-- =====================================================================
-- Tables: asset_metadata, publish_log, quality_scores, editorial_board
-- Indexes: 12 total on commonly queried fields
-- All types SQLite-native: TEXT, INTEGER, REAL
-- Timestamps stored as ISO 8601 TEXT via datetime('now')
-- =====================================================================
