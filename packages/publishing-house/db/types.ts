/**
 * Arcanea Publishing House — Database Types
 *
 * All types for the local SQLite engine. Mirrors the Supabase schema
 * but uses SQLite-compatible representations.
 */

// ---------------------------------------------------------------------------
// Enums as union types
// ---------------------------------------------------------------------------

export type Element = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void';

export type Gate =
  | 'Foundation' | 'Flow' | 'Fire' | 'Heart' | 'Voice'
  | 'Sight' | 'Crown' | 'Starweave' | 'Unity' | 'Source';

export type ContentType =
  | 'hero' | 'gallery' | 'thumbnail' | 'social'
  | 'video' | 'audio' | 'raw';

export type AssetStatus =
  | 'new' | 'classified' | 'processed' | 'scored'
  | 'approved' | 'rejected' | 'published';

export type PublishStatus =
  | 'pending' | 'in_progress' | 'completed' | 'failed' | 'rolled_back';

export type EditorialStatus =
  | 'draft' | 'review' | 'revision' | 'approved'
  | 'published' | 'archived';

// ---------------------------------------------------------------------------
// Asset Metadata
// ---------------------------------------------------------------------------

export interface AssetRecord {
  id: string;
  file_path: string | null;
  file_hash: string | null;
  file_size: number | null;
  mime_type: string | null;
  guardian: string | null;
  element: Element | null;
  gate: Gate | null;
  content_type: ContentType | null;
  taste_score: number;
  status: AssetStatus;
  classified_at: string | null;
  processed_at: string | null;
  uploaded_at: string | null;
  approved: number;
  synced_to_cloud: number;
  created_at: string;
  updated_at: string;
}

export interface AssetInput {
  id?: string;
  file_path: string;
  file_hash?: string;
  file_size?: number;
  mime_type?: string;
  guardian?: string;
  element?: Element;
  gate?: Gate;
  content_type?: ContentType;
  taste_score?: number;
  status?: AssetStatus;
}

// ---------------------------------------------------------------------------
// TASTE 5D Scoring
// ---------------------------------------------------------------------------

export interface TasteScores {
  canon_alignment: number;
  design_compliance: number;
  emotional_impact: number;
  technical_fit: number;
  uniqueness: number;
}

export interface QualityScoreRecord {
  id: string;
  asset_id: string;
  canon_alignment: number;
  design_compliance: number;
  emotional_impact: number;
  technical_fit: number;
  uniqueness: number;
  total_score: number;
  scored_at: string;
}

// ---------------------------------------------------------------------------
// Publish Log
// ---------------------------------------------------------------------------

export interface PublishLogRecord {
  id: string;
  asset_id: string;
  platform: string;
  status: PublishStatus;
  url: string | null;
  revenue: number;
  published_at: string | null;
  created_at: string;
}

export interface PublishLogInput {
  id?: string;
  asset_id: string;
  platform: string;
  status?: PublishStatus;
  url?: string;
  revenue?: number;
  published_at?: string;
}

// ---------------------------------------------------------------------------
// Editorial Board
// ---------------------------------------------------------------------------

export interface EditorialRecord {
  id: string;
  title: string;
  status: EditorialStatus;
  collection: string | null;
  author: string | null;
  word_count: number;
  quality_score: number;
  language: string;
  source_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface EditorialInput {
  id?: string;
  title: string;
  status?: EditorialStatus;
  collection?: string;
  author?: string;
  word_count?: number;
  quality_score?: number;
  language?: string;
  source_path?: string;
}

// ---------------------------------------------------------------------------
// Sync
// ---------------------------------------------------------------------------

export interface SyncResult {
  synced: number;
  failed: number;
  skipped: number;
  errors: SyncError[];
}

export interface SyncError {
  asset_id: string;
  message: string;
}
