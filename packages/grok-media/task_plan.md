# Arcanea Grok Media — Master Task Plan

> **Goal**: Build a pro-level Chrome extension for Grok media management that matches/exceeds Kario Studio's $2.99 PRO tier, integrates with Arcanea's media pipeline, and serves as the first in a family of Arcanea creator tool extensions.
>
> **Strategy**: Ship Phase 1 (core export) FAST, iterate to Phase 5. Open-source core, premium Arcanea integration.

---

## Architecture

### Extension Identity
- **Name**: Arcanea Media — Grok Export & Library Manager
- **ID**: `packages/grok-media/`
- **Manifest**: V3 (Chrome 114+ for side panel)
- **Stack**: TypeScript, esbuild, Preact (lightweight UI), IndexedDB (Dexie.js wrapper)
- **Shared**: `@arcanea/extension-core` for types + Guardian classification

### Folder Structure
```
packages/grok-media/
  manifest.json
  build.mjs                    # esbuild config
  package.json
  tsconfig.json
  src/
    background/
      service-worker.ts        # Message router, download queue, alarms
      download-manager.ts      # Chrome downloads API, retry logic, rate limiting
      network-sniffer.ts       # MAIN world fetch/XHR interception
    content/
      scanner.ts               # Scroll-based lazy load scanner
      selectors.ts             # ALL DOM selectors (isolated for updates)
      stream-capture.ts        # MutationObserver for real-time image capture
      dom-actions.ts           # Click, unfavorite, upscale button automation
    sidepanel/
      index.html
      app.tsx                  # Preact root
      components/
        MediaGrid.tsx          # Masonry grid with selection
        DownloadQueue.tsx      # Active download progress
        VideoGenQueue.tsx      # Video generation automation
        StoryBoard.tsx         # Drag-drop video storyboard
        ProjectManager.tsx     # Project folder organization
        Settings.tsx           # Config & preferences
        FilterBar.tsx          # Date range, type, status filters
      hooks/
        useMediaDB.ts          # Dexie.js IndexedDB wrapper
        useDownloadQueue.ts    # Download state management
        useGrokAPI.ts          # API call abstractions
    popup/
      popup.html              # Quick actions popup
      popup.ts
    shared/
      types.ts                # MediaItem, Project, QueueItem, etc.
      constants.ts            # Rate limits, CDN domains, API endpoints
      uuid.ts                 # UUID extraction regex
      rate-limiter.ts         # Configurable delay engine
      metadata.ts             # JSON metadata format
      logger.ts               # Structured logging
    pipeline/                  # Arcanea integration (Phase 5)
      taste-scorer.ts          # Client-side TASTE quality evaluation
      guardian-classifier.ts   # Auto-classify media by Guardian/element
      export-manifest.ts       # Generate arcanea-manifest.json format
      webp-converter.ts        # Browser-side WebP conversion (Canvas API)
  assets/
    icons/                     # 16, 32, 48, 128px
    screenshots/               # Store listing screenshots
  dist/                        # Build output (gitignored)
  tests/
    selectors.test.ts          # Selector validation
    download-manager.test.ts
    rate-limiter.test.ts
  STORE_LISTING.md
  PRIVACY_POLICY.md
```

### Data Model (IndexedDB via Dexie.js)
```typescript
interface MediaItem {
  id: string;              // Grok UUID
  type: 'image' | 'video';
  url: string;             // Original URL
  hdUrl?: string;          // HD version URL
  thumbnailUrl?: string;
  prompt?: string;         // Generation prompt
  timestamp: number;       // Creation date
  downloadedAt?: number;   // When we downloaded it
  upscaleStatus: 'none' | 'pending' | 'processing' | 'done' | 'failed';
  projectId?: string;      // Project folder assignment
  metadata?: Record<string, unknown>;  // Full Grok JSON response
  // Arcanea pipeline fields
  tasteScore?: number;     // 0-100 TASTE evaluation
  guardian?: string;       // Auto-classified Guardian
  element?: string;        // Fire/Water/Earth/Wind/Void
  exportedAt?: number;     // When sent to Arcanea pipeline
}

interface Project {
  id: string;
  name: string;
  createdAt: number;
  mediaIds: string[];
  metadata?: Record<string, unknown>;
}

interface QueueItem {
  id: string;
  type: 'download' | 'upscale' | 'generate';
  status: 'pending' | 'active' | 'done' | 'failed' | 'retrying';
  mediaId?: string;
  prompt?: string;
  mode?: 'custom' | 'normal' | 'fun' | 'spicy';
  attempts: number;
  maxAttempts: number;
  error?: string;
  createdAt: number;
  completedAt?: number;
}

interface DownloadHistory {
  mediaId: string;
  downloadedAt: number;
  filePath: string;
  fileSize: number;
}
```

### Message Protocol (content <-> background)
```typescript
type Message =
  | { type: 'SCAN_FAVORITES'; payload: { scrollDelay: number } }
  | { type: 'SCAN_RESULT'; payload: { items: MediaItem[] } }
  | { type: 'DOWNLOAD_BATCH'; payload: { mediaIds: string[]; projectName?: string } }
  | { type: 'DOWNLOAD_PROGRESS'; payload: { mediaId: string; progress: number } }
  | { type: 'UPSCALE_REQUEST'; payload: { videoId: string } }
  | { type: 'UPSCALE_STATUS'; payload: { videoId: string; status: string } }
  | { type: 'STREAM_CAPTURE_START' }
  | { type: 'STREAM_CAPTURE_STOP' }
  | { type: 'STREAM_CAPTURE_ITEM'; payload: { item: MediaItem } }
  | { type: 'GEN_QUEUE_ADD'; payload: { prompt: string; mode: string; count: number } }
  | { type: 'GEN_QUEUE_STATUS'; payload: { queue: QueueItem[] } }
  | { type: 'EXTRACT_FRAME'; payload: { videoUrl: string } }
  | { type: 'FRAME_RESULT'; payload: { dataUrl: string } }
  | { type: 'NETWORK_SNIFF'; payload: { postUrl: string } }
  | { type: 'SNIFF_RESULT'; payload: { urls: string[] } }
```

---

## Phase 1 — Core Export Engine `[CURRENT]`
**Goal**: Scan favorites, batch download images + videos, track history
**Effort**: 2-3 sessions | **Priority**: P0

### Tasks
- [ ] 1.1 Scaffold project: manifest.json, package.json, tsconfig, build.mjs
- [ ] 1.2 Implement `selectors.ts` with all proven DOM selectors
- [ ] 1.3 Implement `scanner.ts` — scroll-based lazy-load scanning
- [ ] 1.4 Implement `download-manager.ts` — Chrome downloads API with retry (3x backoff)
- [ ] 1.5 Implement `network-sniffer.ts` — MAIN world fetch/XHR interception
- [ ] 1.6 Implement `service-worker.ts` — message routing + download queue
- [ ] 1.7 Implement IndexedDB schema via Dexie.js (`useMediaDB.ts`)
- [ ] 1.8 Build side panel UI — MediaGrid + DownloadQueue + FilterBar
- [ ] 1.9 Implement duplicate detection (history-based, hash-based)
- [ ] 1.10 Build popup with quick actions (scan, download all, stats)
- [ ] 1.11 Add rate limiter with configurable delays
- [ ] 1.12 Write tests for selectors, download manager, rate limiter
- [ ] 1.13 Test locally via chrome://extensions Load Unpacked

### Acceptance Criteria
- Can scan all favorites (images + videos) via scroll automation
- Downloads to organized folder: `grok-media/{date}/{uuid}.{ext}`
- Never re-downloads (history tracking)
- Shows progress in side panel
- Works on `grok.com/imagine/favorites`

---

## Phase 2 — HD Upgrade + Stream Capture
**Goal**: Auto-upscale videos, capture images in real-time during browsing
**Effort**: 1-2 sessions | **Priority**: P1

### Tasks
- [ ] 2.1 Implement HD upscale API calls (`POST /rest/media/video/upscale`)
- [ ] 2.2 Build upscale queue with status polling
- [ ] 2.3 Implement `stream-capture.ts` — MutationObserver on image containers
- [ ] 2.4 Add date range filter (from/to date picker)
- [ ] 2.5 Smart filenames from prompt text (slugified, 80 char max)
- [ ] 2.6 JSON metadata export per download (prompt, date, model, dimensions)
- [ ] 2.7 Bulk unfavorite API integration (`POST /rest/media/post/unlike`)
- [ ] 2.8 Bulk delete (true deletion, not just unfavorite)

### Acceptance Criteria
- Auto-scans for SD videos, queues HD upgrade requests
- Stream Capture catches images as user scrolls anywhere on grok.com
- Metadata JSON accompanies every downloaded file
- Date filter works for selective downloads

---

## Phase 3 — Video Gen Queue
**Goal**: Automated batch video generation with 4 modes
**Effort**: 1-2 sessions | **Priority**: P1

### Tasks
- [ ] 3.1 Build VideoGenQueue UI component (side panel tab)
- [ ] 3.2 Implement 4 generation modes (Custom/Normal/Fun/Spicy prompts)
- [ ] 3.3 Queue engine with auto-retry on failure
- [ ] 3.4 Rate limit detection (back off when throttled)
- [ ] 3.5 Progress tracking per queue item
- [ ] 3.6 Auto-download generated videos on completion
- [ ] 3.7 Prompt template system (save/load presets)

### Acceptance Criteria
- Can queue 100+ video generation requests
- Auto-retries on failure (max 3 attempts with exponential backoff)
- Downloads generated videos automatically
- Shows real-time queue status

---

## Phase 4 — Project Management + Story Mode
**Goal**: Project folders, video storyboard, FFmpeg merging
**Effort**: 2-3 sessions | **Priority**: P2

### Tasks
- [ ] 4.1 Project creation/management UI
- [ ] 4.2 Auto-organize downloads by project/date/prompt
- [ ] 4.3 Pre-download statistics (image count, video count, estimated size)
- [ ] 4.4 StoryBoard UI — drag-drop video sequencing
- [ ] 4.5 Frame extraction (last frame of video for continuation)
- [ ] 4.6 Auto-upload extracted frame to Grok for sequel generation
- [ ] 4.7 FFmpeg.wasm integration for local video merging
- [ ] 4.8 Export/Import entire database (JSON backup)
- [ ] 4.9 Cross-device data transfer

### Acceptance Criteria
- Projects auto-organize media into named folders
- Story Mode: download -> storyboard -> extract frame -> generate sequel -> merge
- FFmpeg merging works entirely in-browser (no native dependencies)
- Full database export/import for backup

---

## Phase 5 — Arcanea Media Pipeline Integration
**Goal**: Connect extension to Arcanea's media processing workflow
**Effort**: 2-3 sessions | **Priority**: P2

### Tasks
- [ ] 5.1 TASTE scorer (client-side quality evaluation)
- [ ] 5.2 Guardian auto-classifier (element/guardian detection from visual cues + prompt)
- [ ] 5.3 WebP conversion in browser (Canvas API)
- [ ] 5.4 Generate arcanea-manifest.json format from downloaded media
- [ ] 5.5 Export to Arcanea folder structure (Guardian-organized)
- [ ] 5.6 Optional: Arcanea API integration (upload to Supabase Storage)
- [ ] 5.7 Optional: AI-powered prompt enhancement (suggest better prompts)
- [ ] 5.8 Arcanea branding: cosmic glass theme in side panel UI

### Acceptance Criteria
- Downloaded media auto-scored by TASTE framework
- Guardian classification assigns media to correct element/guardian
- Export generates Arcanea-compatible manifest
- Optional cloud upload to Arcanea platform

---

## Phase 6 — Polish + Chrome Web Store
**Goal**: Production-ready, published extension
**Effort**: 1-2 sessions | **Priority**: P3

### Tasks
- [ ] 6.1 Icon design (128x128, 48, 32, 16 variants)
- [ ] 6.2 Store listing copy (title, descriptions, screenshots)
- [ ] 6.3 Privacy policy (data handling disclosure)
- [ ] 6.4 Permission justifications for Chrome review
- [ ] 6.5 `npm run build:zip` packaging script
- [ ] 6.6 Chrome Web Store developer account + submission
- [ ] 6.7 Landing page on arcanea.ai
- [ ] 6.8 Keyboard shortcuts (Ctrl+Shift+G open panel, etc.)

### Acceptance Criteria
- Extension passes Chrome Web Store review
- Professional store listing with screenshots
- Clean privacy policy
- Landing page live

---

## Future Extensions (Post-Launch)
- **ChatGPT Export Extension** — export conversations, DALL-E images
- **Meta/Instagram Export** — Reels, Stories, saved posts
- **Midjourney Export** — gallery management
- **Unified Arcanea Media Hub** — all extensions feed into single library
- **Arcanea Companion Integration** — Guardian-guided media curation

---

## Technical Decisions Log

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| UI Framework | React, Preact, Svelte, vanilla | **Preact** | 3KB vs 45KB React, JSX compat, sufficient for side panel |
| State/DB | chrome.storage, localStorage, IndexedDB | **IndexedDB via Dexie.js** | Handles 10K+ items, structured queries, survives SW restarts |
| Build | Webpack, Vite, esbuild | **esbuild** | Matches existing chrome-extension, fastest builds |
| Video merge | Native FFmpeg, FFmpeg.wasm | **FFmpeg.wasm** | No native deps, runs in browser, 25MB WASM bundle |
| Side panel vs popup | Popup, side panel, devtools | **Side panel** | Long-running ops, doesn't close on blur, Chrome 114+ |
| Shared code | Copy, npm link, monorepo | **@arcanea/extension-core** | Already published, Guardian types ready |
| License | MIT, GPL, proprietary | **MIT** | Open-source core, Arcanea integration as premium differentiator |

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Grok DOM changes break selectors | High | Isolate selectors in single module, version-detect |
| Service worker killed mid-download | Medium | Persist queue to IndexedDB, resume on restart |
| 64MiB IPC crash on large videos | High | Store blobs in chrome.storage.local, read by key |
| Chrome Web Store rejection | Medium | Minimal permissions, thorough justifications |
| Rate limiting / account ban | High | Conservative delays, user-configurable, randomized |
| FFmpeg.wasm bundle size (25MB) | Low | Lazy-load only when Story Mode used |

## Reference Links
- [brndnsmth/grok-imagine-favorites-manager](https://github.com/brndnsmth/grok-imagine-favorites-manager)
- [allophylus/grok-imagine-loop](https://github.com/allophylus/grok-imagine-loop)
- [The-Degen-Dev/grok-powertools](https://github.com/The-Degen-Dev/grok-powertools)
- [josephmqiu/grok-imagine-favorites-downloader](https://github.com/josephmqiu/grok-imagine-favorites-downloader)
- [Chrome MV3 Docs](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
- [Kario Studio](https://grokmedia.kario-studio.com/)
- [Chrome Web Store Publishing](https://developer.chrome.com/docs/webstore/publish)
