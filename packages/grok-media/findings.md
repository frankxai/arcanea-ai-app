# Grok Media Extension — Research Findings

> Last updated: 2026-03-02

## 1. Competitive Landscape

### Kario Studio — Grok Media Downloader v2.2 (THE BAR)
- **Price**: $2.99 lifetime PRO | Free tier with 50 Video Gen Queue uses
- **Closed source** — can't fork, must build from scratch
- **Key PRO features to match**:
  - Stream Capture (DOM observer for real-time image capture)
  - HD Video Upgrade (auto-scan + 480p->720p API calls)
  - Video Gen Queue (4 modes: Custom/Normal/Fun/Spicy, auto-retry)
  - Project-Based Download (date/prompt folder organization + JSON metadata)
  - Story Mode (5-step: download -> storyboard -> frame extract -> Grok -> FFmpeg merge)
  - Date range filter + history dedup
  - Import/Export database
  - Prompt-based smart filenames
  - Bulk delete/unfavorite

### Grok Automation (kylenguyen.me)
- 100K users, 4.2 stars, FREE
- Better for new content generation at scale (batch prompts -> auto video -> download)
- Auto upscale + download built-in

## 2. Open-Source Repos — Building Blocks

### Tier 1 — Best Code Quality / Most Useful
| Repo | Stars | Key Value | License |
|------|-------|-----------|---------|
| brndnsmth/grok-imagine-favorites-manager | 40 | Network sniffer, proven selectors, HD upscale API | Unlicensed (ARCHIVED) |
| allophylus/grok-imagine-loop | 36 | Video loop chaining, frame extraction, 30+ lang support | GPL-3.0 |
| The-Degen-Dev/grok-powertools | 21 | Glassmorphism UI, R2 cloud backup, Jest+Playwright tests | MIT |

### Tier 2 — Supplementary
| Repo | Stars | Key Value | License |
|------|-------|-----------|---------|
| josephmqiu/grok-imagine-favorites-downloader | 28 | Retry logic (3x backoff), service worker restart survival | MIT |
| exabeet/grok-viewer | 17 | Grid viewer, lightbox, real-time detection | GPL-3.0 |
| nmsbnmsb1/chrome-plugin-grok-spirit | 1 | Prompt archaeology (full JSON structure), Python FFmpeg tooling | MIT |

## 3. Proven Technical Patterns

### DOM Selectors (stable as of Feb 2026)
```javascript
SELECTORS = {
  CARD:         '.group\\/media-post-masonry-card',
  IMAGE:        'img[alt*="Generated"]',
  VIDEO:        'video, [data-testid="video-player"], .video-js',
  PLAY_ICON:    'svg[data-icon="play"], svg[data-icon="play-fill"], [aria-label*="Play"]',
  UNSAVE_BTN:   'button[aria-label="Unsave"], button[aria-label*="nsave"], button:has(path[d^="M12.0014 6.339"])',
  LIST_ITEM:    '[role="listitem"]',
  SCROLL:       'main, [role="main"], .overflow-y-auto, .overflow-auto'
}
```

### UUID Extraction
```javascript
/(?:generated|post|status|imagine\/post)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/
```

### Grok API Endpoints (Reverse-Engineered)
| Endpoint | Method | Body | Purpose |
|----------|--------|------|---------|
| `grok.com/rest/app-chat/conversations` | GET | — | Media URL discovery via network sniffer |
| `grok.com/rest/media/post/unlike` | POST | `{id}` | Unfavorite a post |
| `grok.com/rest/media/video/upscale` | POST | `{videoId}` | Request 480p->720p HD upscale |

### Official xAI API
```
POST https://api.x.ai/v1/videos/generations
  model: "grok-imagine-video"
  prompt, image_url, video_url, duration (1-15), aspect_ratio, resolution

GET https://api.x.ai/v1/videos/{request_id}
  status: done|pending|expired
  video.url, video.duration
```

### Auth: Session cookies (`credentials: 'include'`) for web endpoints
### CDN domains: `assets.grok.com`, `imagine-public.x.ai`, `assets.grokusercontent.com`
### Key field: `hdMediaUrl` in API JSON for full-resolution source

### Rate Limits (proven safe)
| Operation | Delay |
|-----------|-------|
| Downloads | 1000ms/file |
| Upscale requests | 500ms between |
| Unfavorite | 200ms between |
| Scroll loads | 2000ms between |
| Video gen queue | randomized 33-100% of configured max |

### Network Sniffer Pattern (from favorites-manager)
- Opens background tab at post URL
- Injects into MAIN world: monkey-patches `window.fetch` + `XMLHttpRequest.prototype.open`
- Captures `.mp4`, `.jpg`, `.png`, `.webp`, `blob:` URLs
- Relay via hidden DOM element `grok-sniffer-relay`
- 600ms network idle timeout (max 4s)

### Frame Extraction Chain (from imagine-loop)
```
Video element -> background.js fetch as blob ->
FileReader -> Base64 data URL ->
Store in chrome.storage.local (avoids 64MiB IPC crash) ->
Next scene: retrieve + upload as image input
```

## 4. Existing Arcanea Infrastructure

### Chrome Extension (`packages/chrome-extension/`)
- MV3, TypeScript, esbuild build
- Side panel + popup + content script + background service worker
- Guardian routing, multi-provider AI (Claude/Gemini/GPT-4o)
- Subscription tiers: free/creator/luminor/academy
- Store listing + privacy policy ready

### Extension Core (`packages/extension-core/`)
- Shared types: Provider, Message, Conversation, PageContext, ExtensionConfig
- Guardian definitions (10 guardians with colors, domains, frequencies)
- Voice enforcer, guardian router
- npm: @arcanea/extension-core ^0.3.1

### Media Processing Pipeline
- **Media root**: `G:\My Drive\Arcanea` (1,303 files, 4.2 GB)
- **Grok-sourced**: 299 files already in pipeline
- **TASTE framework**: 5-tier scoring (Canon 25%, Design 25%, Emotion 20%, Tech 15%, Unique 15%)
- **Processing**: PowerShell catalog -> Python+Pillow WebP conversion -> FFmpeg video thumbnails
- **Output tiers**: Hero (80-100), Gallery (60-79), Thumbnail (40-59), Reject (<40)

## 5. Critical Gap — What Nobody Has Built

No single extension combines ALL of:
- Bulk download (images + videos)
- Loop chaining (video generation sequences)
- Frame extraction (last frame for continuation)
- HD upscaling (API-driven)
- Prompt export (JSON metadata)
- Duplicate detection
- Real-time viewer
- Retry logic (service worker restart survival)
- Cloud/local pipeline integration (Arcanea-specific)
- Quality evaluation (TASTE scoring)
- Guardian-classified media organization

**Our extension fills this gap AND adds the Arcanea media pipeline integration.**

## 6. MV3 Technical Constraints
- Service worker terminates after ~5min idle -> persist state to chrome.storage
- Use `chrome.alarms` for scheduled work, not setTimeout/setInterval
- 64MiB IPC limit -> store large blobs in storage, read by key
- `webRequest` -> `declarativeNetRequest` in MV3
- MAIN world injection for React/Next.js sites: `chrome.scripting.executeScript({ world: "MAIN" })`
- Side panel API (Chrome 114+) preferred over popup for long-running ops
