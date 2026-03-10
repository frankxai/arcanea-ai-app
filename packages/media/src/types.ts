/**
 * @arcanea/media — Core Types
 * Guardian: Elara (Starweave Gate, 852 Hz) — Transformation, Perspective
 */

// ── File Types ──────────────────────────────────────────────────────────────

export type MediaType    = 'image' | 'video';
export type MediaStatus  = 'review' | 'approved' | 'archived';
export type QualityTier  = 1 | 2 | 3;  // 1=hero, 2=gallery, 3=archive
export type MediaSource  = 'midjourney' | 'grok-image' | 'grok-video' | 'manual' | 'generated';

export type GuardianName =
  | 'Lyssandria' | 'Leyla'   | 'Draconia' | 'Maylinn' | 'Alera'
  | 'Lyria'      | 'Aiyami'  | 'Elara'    | 'Ino'     | 'Shinkami';

// ── Media Entry ─────────────────────────────────────────────────────────────

export interface MediaEntry {
  id:             string;   // SHA256 content hash prefix (16 chars)
  original_path:  string;
  original_name:  string;
  suggested_name: string;   // guardian-scene-slug-NNN.webp
  type:           MediaType;
  extension:      string;
  size_bytes:     number;
  size_mb:        number;
  folder:         string;   // first-level folder name from root

  // Guardian canon
  guardian:       GuardianName | null;
  gate:           string | null;
  element:        string | null;
  frequency_hz:   number | null;
  godbeast:       string | null;

  // Content metadata
  source:         MediaSource;
  scene:          string;   // human-readable description
  tags:           string[];

  // Curation state
  status:         MediaStatus;
  quality_tier:   QualityTier | null;
  duplicate_of:   string | null;  // id of first occurrence
  notes:          string;

  // Processing outputs
  thumbnail_path: string | null;  // generated 320px thumbnail
  webp_path:      string | null;  // WebP converted image
  width:          number | null;
  height:         number | null;
  duration_s:     number | null;  // video only
}

// ── Manifest ────────────────────────────────────────────────────────────────

export interface MediaManifest {
  generated:     string;
  version:       string;
  root_path:     string;
  total_files:   number;
  total_size_mb: number;
  duplicates:    number;
  by_type:       Record<string, number>;
  by_guardian:   Record<string, number>;
  by_source:     Record<string, number>;
  media:         MediaEntry[];
}

// ── Processing ───────────────────────────────────────────────────────────────

export interface ProcessOptions {
  /** Destination root for processed files */
  outputDir:        string;
  /** Convert images to WebP (default: true) */
  convertWebP:      boolean;
  /** Max width for resized images (default: 2400) */
  maxWidth:         number;
  /** WebP quality 0-100 (default: 85) */
  webpQuality:      number;
  /** Generate 320px thumbnail (default: true) */
  generateThumbs:   boolean;
  /** Move duplicates to archive subfolder instead of deleting */
  archiveDuplicates: boolean;
  /** Only process files with status='approved' */
  approvedOnly:     boolean;
}

export interface ProcessResult {
  entry:         MediaEntry;
  success:       boolean;
  webpPath?:     string;
  thumbPath?:    string;
  error?:        string;
  savedBytes?:   number;
}

// ── Events (for watcher daemon) ──────────────────────────────────────────────

export type MediaEvent =
  | { type: 'add';    entry: MediaEntry }
  | { type: 'change'; entry: MediaEntry }
  | { type: 'remove'; id: string; path: string };

export interface WatcherOptions {
  rootPath:        string;
  manifestPath:    string;
  autoProcess:     boolean;
  processOptions?: Partial<ProcessOptions>;
  onEvent?:        (event: MediaEvent) => void;
}
