# Arcanea Grok Media — Manual Testing Checklist

Extension: **Arcanea Media — Grok Export & Library** v0.1.0
Manifest Version: 3 | Minimum Chrome: 114
Build output: `dist/` (esbuild via `build.mjs`)

---

## 1. Setup Steps (Windows PowerShell — NOT WSL)

npm install must run from Windows PowerShell due to WSL2 filesystem locking.

```powershell
# Open Windows PowerShell (not WSL, not CMD)

# Navigate to the extension package
cd C:\Users\frank\Arcanea\packages\grok-media

# Install dependencies (Preact, Dexie.js, esbuild, TypeScript, Vitest)
npm install

# Build all entry points (minified, no sourcemaps)
npm run build

# Development build with watch mode and inline sourcemaps (optional)
# npm run dev
```

### Verify dist/ contents after build

The build script compiles five entry points and copies two HTML files:

```powershell
dir dist\
```

Expected files:

| File | Source | Description |
|---|---|---|
| `background.js` | `src/background/service-worker.ts` | Service worker (ESM) |
| `content.js` | `src/content/index.ts` | Content script (IIFE) |
| `sidepanel.js` | `src/sidepanel/app.tsx` | Preact side panel (ESM) |
| `popup.js` | `src/popup/popup.ts` | Popup actions (IIFE) |
| `content.css` | `src/content/content.css` | Content script styles |
| `popup.html` | `src/popup/popup.html` | Popup shell |
| `sidepanel.html` | `src/sidepanel/index.html` | Side panel shell |

If any file is missing, check the PowerShell console for esbuild errors.

The build also copies `assets/icons/` to `dist/icons/` if icons exist. Icons are referenced from
the root `assets/icons/` path in manifest.json (not from dist/), so missing icons show a default
puzzle-piece icon — this does not break functionality.

---

## 2. Chrome Loading Steps

### 2a. Load the extension

1. Open Chrome and navigate to `chrome://extensions`
2. Toggle **Developer mode** ON (top-right switch)
3. Click **Load unpacked**
4. Select the directory: `C:\Users\frank\Arcanea\packages\grok-media`
   - Select the ROOT of the package — where `manifest.json` lives
   - Do NOT select the `dist/` subfolder
   - Chrome reads `manifest.json` from the root; it then loads `dist/background.js`,
     `dist/content.js`, etc. as declared in the manifest
5. The extension card should appear showing **"Arcanea Media — Grok Export & Library"**

### 2b. Verify the extension loaded correctly

- The extension card shows the correct name and version (0.1.0)
- If icons were generated, the icon appears in the Chrome toolbar
- If icons are missing, a grey puzzle piece appears — this is expected in Phase 1
- No red error banner appears on the extension card

### 2c. Inspect the service worker

1. On the extension card, click **"Service worker"** (blue link next to "Inspect views")
2. The DevTools console opens for the background service worker context
3. On first install, you should see no errors — the `onInstalled` handler sets default
   settings (`arcanea_grok_settings`) and initializes `downloadHistory: []` in
   `chrome.storage.local`
4. If you see `"Extension installed"` in the log (visible in dev build), setup completed

### 2d. After code changes — reload procedure

1. Make changes to source files in `src/`
2. Run `npm run build` in PowerShell
3. On `chrome://extensions`, click the refresh icon on the extension card
4. For content script changes: also reload the grok.com tab
5. For popup/side panel changes: close and reopen the popup/panel

---

## 3. Functional Test Matrix

For each test: check the box when passing, note failures with observed vs expected behavior.

### 3a. Extension Load

- [ ] **Extension loads without errors**
  - Precondition: Extension loaded via Load Unpacked
  - Action: Open `chrome://extensions`, inspect the extension card
  - Expected: No error badge, service worker status shows "Active" or "Idle"

- [ ] **Service worker initializes storage on install**
  - Precondition: Fresh install (or clear extension data first)
  - Action: Open service worker DevTools via "Inspect views: Service worker"
  - Go to Application > Storage > chrome.storage.local
  - Expected: Key `arcanea_grok_settings` exists with default values:
    ```json
    {
      "downloadPath": "grok-media",
      "scrollDelay": 2000,
      "downloadDelay": 1000,
      "upscaleDelay": 500,
      "maxRetries": 3,
      "autoDownloadAfterGen": true,
      "smartFilenames": true,
      "includeMetadata": true,
      "organizeByDate": true
    }
    ```
  - Key `downloadHistory` exists as an empty array `[]`

---

### 3b. Popup

- [ ] **Popup opens on toolbar icon click**
  - Precondition: Extension loaded
  - Action: Click the Arcanea Media icon in the Chrome toolbar
  - Expected: 280px popup appears showing "Arcanea Media" header with gradient text,
    version tag "v0.1.0", four stat rows (Images, Videos, Downloaded, HD Videos),
    and two buttons: "Open Side Panel" and "Quick Scan"

- [ ] **Popup stats load from service worker**
  - Precondition: Popup open
  - Action: Wait 1-2 seconds after popup opens
  - Expected: The four stat values change from "—" to numbers (all zeros on fresh install)
  - If values stay "—": open service worker console and check for GET_STATS handler errors

- [ ] **"Open Side Panel" button works**
  - Precondition: A grok.com tab is open and active
  - Action: Click "Open Side Panel" in the popup
  - Expected: The Chrome side panel opens on the right side showing the Arcanea Media UI;
    the popup closes automatically

- [ ] **"Open Side Panel" button with no Grok tab**
  - Precondition: No grok.com tab open
  - Action: Click "Open Side Panel" on any non-grok tab
  - Expected: Side panel may fail to open or open blank — note exact behavior

- [ ] **"Quick Scan" button sends message**
  - Precondition: A grok.com/imagine/favorites tab is open
  - Action: Click "Quick Scan" in the popup
  - Expected: Popup closes; scanning begins in the background (visible in side panel if open)
  - Note: If no Grok tab is open, the service worker returns an error — check SW console

---

### 3c. Side Panel

- [ ] **Side panel opens via Ctrl+Shift+G**
  - Precondition: A grok.com tab is active
  - Action: Press Ctrl+Shift+G (Windows/Linux) or Command+Shift+G (Mac)
  - Expected: Chrome side panel opens showing the Arcanea Media UI
  - Note: This shortcut is bound to `_execute_action` in manifest.json, which triggers
    the extension action — behavior depends on `setPanelBehavior({ openPanelOnActionClick: true })`

- [ ] **Side panel shows correct initial state**
  - Precondition: Side panel open, no scan run yet
  - Action: Observe the panel
  - Expected:
    - Header: "Arcanea Media" (teal-to-violet gradient) + "v0.1.0" badge
    - Stats bar: shows counts (zeros on fresh install)
    - Tabs: Library (active), Downloads, Settings
    - Library tab: empty state with message "No media found" and instructions
      "Open grok.com/imagine/favorites and click 'Scan Favorites' to get started."
    - Actions row: only "Scan Favorites" button visible

- [ ] **Library tab is default active tab**
  - Expected: Library tab has the teal underline border; content shows media grid or empty state

- [ ] **Downloads tab shows empty state initially**
  - Action: Click the "Downloads" tab
  - Expected: Empty state message "No active downloads" with subtext
    "Select items from the Library tab and click Download."

- [ ] **Settings tab shows configuration fields**
  - Action: Click the "Settings" tab
  - Expected: Four input fields visible:
    - Download folder (text input, default value "grok-media")
    - Download delay ms (number input, default 1000)
    - Scroll delay ms (number input, default 2000)
    - Max retries (number input, default 3)
  - "Save Settings" button at bottom
  - Note: In Phase 1, the Settings tab inputs are static (not wired to chrome.storage.local
    — the save button does not persist values yet)

---

### 3d. Scan Favorites

All scan tests require being logged into grok.com.

- [ ] **Navigate to the correct scan URL**
  - Precondition: Logged into grok.com
  - Action: Navigate to `https://grok.com/imagine/favorites`
  - Expected: The favorites grid loads with your saved images and videos

- [ ] **"Scan Favorites" button appears and is clickable**
  - Precondition: Side panel open, Library tab active
  - Action: Observe the actions row
  - Expected: "Scan Favorites" button is visible and teal-colored (btn-primary style)

- [ ] **Scanning overlay/state appears on click**
  - Precondition: On `grok.com/imagine/favorites` with the side panel open
  - Action: Click "Scan Favorites"
  - Expected:
    - The "Scan Favorites" button is replaced by a red "Cancel (0 found)" button
    - The empty state in the media grid shows "Scanning..." heading with
      "Found 0 items so far..." subtext
    - The scan counter increments as items are discovered

- [ ] **Scan counter increments during scroll**
  - Precondition: Scan running on a favorites page with media
  - Action: Watch the Cancel button label during scanning
  - Expected: Counter updates as the scanner scrolls and discovers new items
    (e.g., "Cancel (12 found)", "Cancel (24 found)")

- [ ] **Scan completes — items appear in media grid**
  - Precondition: Scan ran on a page with at least 1 saved item
  - Action: Wait for scan to complete (button returns to "Scan Favorites")
  - Expected:
    - "Scan Favorites" button reappears
    - Media grid populates with thumbnail cards (images show `<img>`, videos show `<video>`)
    - Each card has an aspect-ratio 1:1 square layout
    - Video cards show a "VID" badge (violet)
    - HD-upscaled items show an "HD" badge (gold)
    - "Select All" and "Download All" buttons appear in the actions row

- [ ] **Scan stops automatically at page bottom**
  - Precondition: Favorites page has finite number of items
  - Action: Let scan run to completion without cancelling
  - Expected: After 10 consecutive scroll cycles with no new items found
    (`MAX_IDLE_SCROLLS = 10`), scanning stops automatically

- [ ] **Empty favorites page handled gracefully**
  - Precondition: Account with no saved favorites
  - Action: Click "Scan Favorites" on an empty favorites page
  - Expected: Scan completes quickly, empty state message remains, no errors in console

- [ ] **Scan on non-favorites page**
  - Precondition: On a grok.com page that is NOT the favorites feed
  - Action: Click "Scan Favorites"
  - Expected: Either scan runs and finds 0 items (no masonry cards present), or the
    service worker returns an error if no Grok tab is found at all

---

### 3e. Filter Bar

The filter bar only appears after items are loaded into the library.

- [ ] **Filter bar appears after scan**
  - Expected: Row of pill buttons: All (N), Images (N), Videos (N), HD (N), SD (N)
  - Counts in parentheses match the actual item breakdown

- [ ] **"All" filter shows all items (default active)**
  - Action: Click "All"
  - Expected: All scanned items appear in the grid; "All" chip has teal border and color

- [ ] **"Images" filter shows only images**
  - Action: Click "Images"
  - Expected: Only image cards remain; video cards disappear; no "VID" badges visible

- [ ] **"Videos" filter shows only videos**
  - Action: Click "Videos"
  - Expected: Only video cards remain; all cards have "VID" badge

- [ ] **"HD" filter shows HD-upscaled videos**
  - Action: Click "HD"
  - Expected: Only items where `upscaleStatus === 'done'` appear; each has "HD" badge
  - If no HD items exist: grid is empty (no empty state message — the grid is just blank)

- [ ] **"SD" filter shows SD videos only**
  - Action: Click "SD"
  - Expected: Only video items where upscaleStatus is not "done" appear

- [ ] **Filter counts are accurate**
  - Expected: Sum of Images + Videos counts equals All count;
    HD + SD counts do not exceed Videos count

---

### 3f. Selection

- [ ] **Click a card to select it**
  - Action: Click any media card in the grid
  - Expected: Card gets a teal border and glow (`box-shadow: 0 0 8px rgba(127,255,212,0.3)`)
  - Actions row changes: "Download (1)" and "Clear" buttons appear

- [ ] **Click selected card to deselect it**
  - Action: Click an already-selected card
  - Expected: Teal border disappears; if no cards remain selected, actions row returns to
    "Select All" and "Download All"

- [ ] **Multi-select works independently per card**
  - Action: Click 3 different cards
  - Expected: All 3 show teal selection state; "Download (3)" shows correct count

- [ ] **"Select All" selects all filtered items**
  - Precondition: No items selected, at least 2 items visible
  - Action: Click "Select All"
  - Expected: Every card in the current filtered view gets a teal selection border;
    "Download (N)" shows total count matching the filter

- [ ] **"Clear" clears selection**
  - Precondition: At least 1 item selected
  - Action: Click "Clear"
  - Expected: All selection borders disappear; actions row reverts to "Select All" +
    "Download All"

- [ ] **"Select All" respects active filter**
  - Precondition: "Images" filter active, scan has both images and videos
  - Action: Click "Select All"
  - Expected: Only image items are selected; video items remain unselected

---

### 3g. Downloads

- [ ] **"Download (N)" queues selected items**
  - Precondition: 2+ items selected
  - Action: Click "Download (N)"
  - Expected:
    - Active tab switches to "Downloads"
    - Downloads tab label shows count: "Downloads (N)"
    - Each queued item appears as a row with: status label, progress bar, percentage
    - Initial state: "Queued" label, 0% progress
    - Downloads transition through: Queued -> Downloading -> Done (or Failed)
  - Note: Chrome will show its built-in download bar at the bottom of the browser

- [ ] **Download progress updates in real time**
  - Precondition: Download batch running
  - Action: Watch the Downloads tab
  - Expected: Progress bars fill as each file downloads; percentage increments;
    status changes to "Downloading" then "Done"
  - Note: The current progress implementation reports 0% start and 100% on completion
    (Chrome downloads API does not provide byte-level progress in this implementation)

- [ ] **"Download All" downloads all filtered items without requiring selection**
  - Precondition: Items loaded, none selected
  - Action: Click "Download All"
  - Expected: All items in the current filtered view are queued for download;
    panel switches to Downloads tab

- [ ] **Downloaded files appear in correct folder**
  - Precondition: Download completed
  - Action: Open Windows Explorer and navigate to:
    `C:\Users\frank\Downloads\grok-media\YYYY-MM-DD\`
    (or wherever Chrome's default download location is set)
  - Expected: Files organized by date subfolder; filenames follow the pattern:
    - With smart filenames: `{slugified-prompt}-{8-char-uuid}.jpg` or `.mp4`
    - Without smart filenames: `{full-uuid}.jpg` or `.mp4`
  - Note: `organizeByDate: true` and `smartFilenames: true` are the defaults

- [ ] **JSON metadata file accompanies each download**
  - Precondition: Download completed, `includeMetadata: true` (default)
  - Action: Check the same folder as the media file
  - Expected: A `.json` file with the same base name as the media file exists
  - Example: `dragon-forest-a1b2c3d4.jpg` has a matching `dragon-forest-a1b2c3d4.json`
  - JSON contents include: id, type, prompt, generatedAt, downloadedAt, resolution,
    model (grok-imagine), source (grok-imagine), hdUpscaled (boolean)

- [ ] **Failed download shows error state**
  - Precondition: Attempt to download an item with an expired CDN URL or no network
  - Action: Trigger download; wait for retry exhaustion (3 attempts with backoff)
  - Expected: Status changes to "Failed" (red text); progress bar stays at 0%

- [ ] **Rate limiting between downloads**
  - Precondition: Download batch of 5+ items
  - Action: Watch Chrome's download shelf
  - Expected: Downloads do not all fire simultaneously; approximately 1000ms gap between
    each file start (configurable via `downloadDelay` in settings)

---

### 3h. Duplicate Detection

- [ ] **Re-scan does not re-queue already-downloaded items**
  - Precondition: Complete a download batch, then click "Scan Favorites" again
  - Action: After the second scan completes, attempt to download all items
  - Expected: Items already in `downloadHistory` (chrome.storage.local) are filtered
    out by the service worker's `SCAN_RESULT` handler before being sent to the side panel;
    previously downloaded items should not appear in the new scan results
  - To verify: Check the `SCAN_RESULT` log in the service worker console for
    "duplicatesSkipped" count > 0

- [ ] **Duplicate count is reported**
  - Precondition: Some items already downloaded
  - Action: Inspect the side panel state after second scan
  - Expected: The `ScanResult` payload includes `duplicatesSkipped: N` where N > 0
    (visible in service worker console logs)

---

### 3i. Cancel

- [ ] **Cancel button stops active scan**
  - Precondition: Scan is running (Cancel button visible)
  - Action: Click "Cancel (N found)"
  - Expected:
    - Scanning stops immediately (the `AbortSignal` is triggered in the content script)
    - Button reverts to "Scan Favorites"
    - Items found before cancellation remain in the media grid
    - No further scroll events occur

- [ ] **CANCEL_OPERATION message reaches content script**
  - Precondition: Scan running
  - Action: Click Cancel; open content script console (DevTools on grok.com tab,
    Console filter by "Arcanea" or "Scanner")
  - Expected: Log entry "Scan cancelled by user" appears

---

### 3j. Settings Tab

- [ ] **Settings values display**
  - Action: Click Settings tab
  - Expected: Four inputs render with placeholder/default values:
    - Download folder: "grok-media"
    - Download delay: 1000
    - Scroll delay: 2000
    - Max retries: 3
  - Note: In Phase 1, these inputs are hardcoded defaults — they are not loaded from
    `chrome.storage.local` via GET_SETTINGS. The Save Settings button does not persist
    values to storage. This is a known Phase 1 limitation.

- [ ] **Save Settings button is clickable**
  - Action: Modify a value and click "Save Settings"
  - Expected: No crash or JS error (even though persistence is not yet wired)

---

## 4. Known Limitations (Phase 1)

The following features are NOT implemented in Phase 1 and are planned for Phases 2-6:

### Phase 2 — Not Yet Built
- **HD Video Upgrade**: The `UPSCALE_REQUEST` message type exists in the protocol and
  `dom-actions.ts` is scaffolded, but automatic HD upscale API calls (`POST /rest/media/video/upscale`)
  are not yet triggered from the UI
- **Stream Capture**: `stream-capture.ts` exists but the UI has no "Start Capture" toggle
  in the side panel; the `STREAM_CAPTURE_START/STOP` messages are routed but untested
- **JSON metadata per download**: Code is implemented in `download-manager.ts` via
  `downloadMetadata()` but has not been end-to-end tested
- **Date range filter**: No date picker UI exists; all items show regardless of date
- **Bulk unfavorite**: API endpoint is known but not wired to any UI action
- **Smart filename from prompt**: The `promptToFilename()` function is implemented in
  `metadata.ts` but requires the scanner to populate `item.prompt`, which it currently
  does not (prompt is not extracted from the DOM in `scanner.ts`)

### Phase 3 — Not Yet Built
- **Video Generation Queue**: No UI component; no `GEN_QUEUE_ADD` message sender exists
- **Generation modes** (Custom/Normal/Fun/Spicy): Not implemented

### Phase 4 — Not Yet Built
- **Project folders**: No project creation UI; `project.ts` types exist only
- **Story Mode**: No storyboard UI, no frame extraction, no FFmpeg.wasm integration
- **Database export/import**: No backup/restore UI

### Phase 5 — Not Yet Built
- **TASTE scorer**: No client-side quality evaluation
- **Guardian classifier**: No auto-classification by element/guardian
- **Arcanea pipeline export**: No manifest generation or Supabase upload

### Phase 6 — Not Yet Built
- **Extension icons**: `assets/icons/` directory exists but PNG files may not be generated;
  run `node generate-icons.mjs` if available
- **Chrome Web Store packaging**: `npm run build:zip` calls `scripts/package.mjs` which
  may not exist yet
- **Privacy policy and store listing**: Stubs only

### Settings Tab
- Settings inputs are static HTML with hardcoded default values
- "Save Settings" button does not call `UPDATE_SETTINGS` message to the service worker
- Settings are NOT loaded from `chrome.storage.local` on panel open
- The service worker does handle `GET_SETTINGS` and `UPDATE_SETTINGS` correctly — the
  side panel UI just does not call them yet

### Network Sniffer
- `network-sniffer.ts` is implemented in the background but requires MAIN world injection
  (`scripting` permission is declared). End-to-end testing of `NETWORK_SNIFF` messages
  has not been performed.

### IndexedDB (Dexie.js)
- `useMediaDB.ts` hook is implemented but the side panel `app.tsx` uses
  `chrome.storage.local` (via the service worker) for scan results, not IndexedDB directly.
  Dexie.js is a declared dependency but may not be integrated in Phase 1.

---

## 5. Debugging Tips

### View service worker logs

1. Go to `chrome://extensions`
2. Find the Arcanea Media card
3. Click **"Service worker"** next to "Inspect views"
4. DevTools opens in a separate window — Console tab shows all `log.info/warn/error` output
5. Log format: `[ServiceWorker] message`, `[DownloadManager] message`, etc.
6. All messages are routed through `chrome.runtime.onMessage.addListener` — add breakpoints
   there to inspect message payloads

### View content script logs

1. Open a grok.com tab
2. Open DevTools on that tab (F12)
3. In the Console, filter by "Scanner", "Arcanea", or select the "content.js" source context
   from the dropdown next to the filter bar (shows "top" by default — change to the extension)
4. The content script runs at `document_idle` and logs via `createLogger('Scanner')`,
   `createLogger('DomActions')`, etc.

### Inspect chrome.storage.local data

**Via service worker DevTools:**
1. Open service worker DevTools
2. Go to Application panel > Storage > Extension storage > Local
3. All keys: `arcanea_grok_settings`, `downloadHistory`, `scannedItems`

**Via console (service worker context):**
```javascript
// Read all storage
chrome.storage.local.get(null, console.log)

// Read settings only
chrome.storage.local.get('arcanea_grok_settings', console.log)

// Read download history
chrome.storage.local.get('downloadHistory', console.log)

// Read scanned items (populated after SCAN_RESULT)
chrome.storage.local.get('scannedItems', console.log)

// Clear all extension data (reset to fresh install state)
chrome.storage.local.clear()
```

### Inspect side panel state

1. Right-click anywhere inside the side panel
2. Select "Inspect" — opens DevTools attached to the side panel page
3. Console shows Preact render errors, message listener errors, etc.
4. React DevTools extension (if installed) can inspect Preact component state

### Simulate messages manually (service worker console)

```javascript
// Trigger a stats request
chrome.runtime.sendMessage({ type: 'GET_STATS' }, console.log)

// Get settings
chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, console.log)

// Trigger a scan (requires grok.com tab open)
chrome.runtime.sendMessage({ type: 'SCAN_FAVORITES', payload: {} }, console.log)

// Cancel active operation
chrome.runtime.sendMessage({ type: 'CANCEL_OPERATION' }, console.log)
```

### Inspect IndexedDB

1. Open side panel DevTools (right-click > Inspect on the side panel)
2. Application > Storage > IndexedDB
3. If Dexie.js has created the database, it appears here as `ArcaneaMediaDB` (or similar)
4. In Phase 1, IndexedDB may be empty — `scannedItems` are stored in `chrome.storage.local`

### Reload after code changes

```powershell
# In PowerShell — rebuild after any source change
npm run build

# Or use watch mode during development (sourcemaps included, not minified)
npm run dev
```

Then in Chrome:
- `chrome://extensions` > click the reload icon on the Arcanea Media card
- Reload grok.com tab if content script changed
- Reopen popup or side panel if those files changed

### Common errors and fixes

| Error | Likely cause | Fix |
|---|---|---|
| "No Grok tab found" in popup | No `https://grok.com/*` tab open | Open grok.com first |
| `chrome.sidePanel is undefined` | Chrome version < 114 | Update Chrome |
| Content script not running | Wrong URL pattern | Ensure URL matches `https://grok.com/*` exactly |
| Downloads not appearing | Chrome download location set to "Ask each time" | Set to automatic in Chrome settings |
| Extension icon not showing | Icons not generated | Run `node generate-icons.mjs` from the package dir |
| Service worker shows "inactive" | Normal — SW sleeps when idle | Click any extension action to wake it |
| Build fails on `src/sidepanel/index.html` | File not found | Verify path exists at `src/sidepanel/index.html` |
| `dist/` files are outdated | Rebuild not run | Run `npm run build` again |
