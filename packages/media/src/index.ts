/**
 * @arcanea/media
 * Local-first media intelligence for the Arcanea universe.
 *
 * Architecture:
 *   scanner   → walks filesystem, builds MediaEntry[] with Guardian tags
 *   catalog   → manifest.json CRUD, search, filter, bulk ops
 *   processor → sharp (images) + FFmpeg (video) — ALL LOCAL, $0
 *   watcher   → chokidar daemon, auto-processes new drops
 *
 * Guardian: Elara (Starweave Gate, 852 Hz) — Transformation
 */

export { scanDirectory }                from './scanner.js';
export { processEntry, processBatch, PROCESSING_COSTS } from './processor.js';
export { MediaCatalog }                 from './catalog.js';
export { MediaWatcher }                 from './watcher.js';
export { detectGuardian, GUARDIANS, GUARDIAN_NAMES } from './canon.js';

export type {
  MediaEntry, MediaManifest, MediaType, MediaStatus,
  QualityTier, MediaSource, GuardianName,
  ProcessOptions, ProcessResult,
  WatcherOptions, MediaEvent,
} from './types.js';
