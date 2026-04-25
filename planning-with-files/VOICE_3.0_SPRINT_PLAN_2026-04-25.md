# Voice 3.0 — Sprint Plan
**Date:** 2026-04-25
**Author:** Plan agent
**Status:** Executable. Pickup-cold ready.
**Companion to:** `VOICE_3.0_GROUND_UP_2026-04-25.md` (architecture) + `VOICE_3.0_RESEARCH_2026-04-25.md` (forks/refs)

---

## DAY 0 — start here (pre-flight diagnostic, ~25 min)

Run these in order. Do not write code yet. Goal: capture ground truth before patching.

- [ ] **0.1** Open terminal at repo root. Run `node packages/arcanea-voice/bin/voice-daemon.mjs --persona lumina` (no `--silent`). Clap twice loudly. Observe: does `[voice-daemon] CLAP #N` print? Does `✓ DOUBLE CLAP CONFIRMED` print? Note RMS values.
- [ ] **0.2** Second terminal: `dir %USERPROFILE%\.arcanea\voice-room\SingletonLock` — does the lockfile exist when window is open? Does it disappear when window closes? (Tests singleton logic.)
- [ ] **0.3** Open `https://arcanea.ai/room/lumina?via=clap-daemon` directly in a normal Chrome tab. Press Space, speak. Does the loop work? (Tests prod /room without daemon.)
- [ ] **0.4** Repeat 0.3 in the daemon-launched app-window (clap to summon). Press Space. **Does the mic permission prompt fire?** Does Space toggle recording? Watch DevTools console (Ctrl-Shift-J) for `[VOICE]` log lines.
- [ ] **0.5** In DevTools: `navigator.mediaDevices.getUserMedia({audio:true})` — does it resolve or reject? Inspect `chrome://settings/content/microphone` — is the daemon profile granted? (Permissions are scoped to user-data-dir.)
- [ ] **0.6** Capture screenshots of: daemon terminal, room window console, permissions page. Drop into scratch buffer.
- [ ] **0.7** `tasklist /FI "IMAGENAME eq chrome.exe"` and `tasklist /FI "IMAGENAME eq node.exe"` — RAM footprint baseline before adding agent.

**Gate:** Do not advance past Day 0 until you can articulate in one sentence which step (0.4/0.5) is the actual blocker. The whole product hinges on it.

---

## Diagnosis sub-plan — why daemon-launched window has no working voice loop

The architecture is sound. The room client at `apps/web/app/room/[persona]/room-client.tsx` lines 259-314 has working VAD + MediaRecorder + Groq pipeline. The daemon at `packages/arcanea-voice/bin/voice-daemon.mjs` lines 182-229 launches the right URL with `--app=` mode. So failure is in the seam.

**5 probes, in order:**

1. **Mic permission scope.** App-window with `--user-data-dir=~/.arcanea/voice-room` is a fresh Chromium profile. First launch must prompt for mic. If user dismissed prompt or browser killed before grant persisted, `getUserMedia` silently rejects. **Probe:** open `chrome://settings/content/microphone` *inside the daemon-launched window* (Ctrl-L → paste). Verify `arcanea.ai` is on the allow list. **Fix:** add a one-time onboarding step that calls `getUserMedia` on first room mount with visible permission banner.

2. **`--app=` mode kills key shortcuts.** Chromium app-windows strip Ctrl+L, sometimes mangle Space-key delivery when window doesn't have focus. The room-client uses `e.code === 'Space'` keydown — works in normal tab, may not in app-window. **Probe:** `document.addEventListener('keydown', e => console.log('keydown', e.code, e.repeat))` and tap Space. If no logs, focus is the issue. **Fix:** explicit `window.focus()` on mount + tap-anywhere-to-record fallback.

3. **Autoplay policy + first user gesture.** Even though clap is technically a user gesture in the daemon, that gesture happens in Node, not in browser. Browser sees a fresh tab with no in-page interaction. AudioContext.resume may stall. **Probe:** log `micCtxRef.current.state` after creation — if `'suspended'`, that's it. **Fix:** explicit `await audioContext.resume()` in `startRecording`, gated on a visible "Tap to begin" overlay if state stays suspended.

4. **`?via=clap-daemon` query param triggering unexpected branch.** Grep room-client for `via` or `searchParams` reads — if any code path conditionally disables space-to-talk when `via=clap-daemon`, that's the bug. **Probe:** open `https://arcanea.ai/room/lumina?via=clap-daemon` in normal tab — if works there but not in app-window, query param is innocent.

5. **Edge vs Chrome binary selection.** `findChromium()` at daemon line 130 prefers Chrome but falls back to Edge. Edge's app-window mode handles permissions differently (some enterprise policies block mic on app-windows entirely). **Probe:** log which binary actually selected. Force Chrome only and retest.

**Most likely root cause (rank order):** #1 (permission scope) > #3 (autoplay) > #5 (Edge selected) > #2 (Space) > #4 (query param).

---

## The 7-day plan

### Day 1 — Diagnose + ship the unblock
**Theme:** Make existing daemon → room loop actually work end-to-end.

**Tickets:**
- **T1.1** Run all 5 diagnostic probes. Document findings in commit message.
- **T1.2** Patch root cause. If #1 (permission): add 1-time mic-permission gate on `/room/[persona]` mount that shows "Grant microphone access" CTA when `permissions.query({name:'microphone'})` returns `'prompt'` or `'denied'`.
- **T1.3** Add explicit `window.focus()` and `audioContext.resume()` in `startRecording` (~line 261).
- **T1.4** Force daemon to prefer Chrome over Edge; surface chosen browser in logs.
- **T1.5** Add `?debug=1` query param overlaying current state (mic permission, audio context state, has stream, recorder state).

**Deliverables:**
- `apps/web/app/room/[persona]/room-client.tsx` — patched
- `packages/arcanea-voice/bin/voice-daemon.mjs` — Chrome-preferred `findChromium()`

**Verification:**
- Clap → window → Space pressed → "Listening" → speak → "Thinking" → reply audio plays. End-to-end <8s. Repeat 3x.
- `?debug=1` overlay shows `mic=granted, ctx=running, stream=ok` after first interaction.

**Critic notes:** If Day 1 doesn't fix the loop, the rest is theoretical. Do not start Day 2 until Frank can clap-and-speak in the daemon-launched window.

---

### Day 2 — TTS greeting on room mount
**Theme:** First impression — premium activation.

**Tickets:**
- **T2.1** Create `apps/web/app/api/voice/greeting/route.ts`. Edge runtime. Input: `?persona=lumina&tenant=arcanea`. Output: streaming MP3. Internally calls `/api/ai/speak` (existing) with persona-keyed greeting.
- **T2.2** Add `GREETINGS` const to `apps/web/app/room/[persona]/personas.ts` — one line per persona.
- **T2.3** In `room-client.tsx`, useEffect on mount that:
  - Reads `?via` query param. Only fires if `via=clap-daemon`.
  - Creates `<audio src="/api/voice/greeting?persona=X" autoplay>`.
  - Wires AnalyserNode to greeting audio so the LuminaPresence orb pulses to greeting waveform.
- **T2.4** Server-side LRU cache (in-memory, 30min TTL) on `/api/voice/greeting` keyed by `persona+tenant` to avoid re-billing TTS on every clap.

**Deliverables:**
- `apps/web/app/api/voice/greeting/route.ts` — new
- `apps/web/app/room/[persona]/personas.ts` — adds `greeting` field
- `apps/web/app/room/[persona]/room-client.tsx` — greeting playback effect

**Verification:**
- Clap → window opens → greeting audio plays automatically within 1.5s. Orb pulses. After greeting, mic ready (Space works).
- Refresh `/room/lumina` directly (no `?via=`) — no greeting plays.

**Critic notes:** Autoplay may still be blocked even with clap upstream — Chrome's autoplay policy is per-document, not per-process. If blocked, `<audio>` throws NotAllowedError. **Fallback:** render "Activate" button overlay that disappears after first click.

---

### Day 3 — Multi-tenant scaffolding
**Theme:** Arcanea / SIS / FrankX as first-class tenants.

**Tickets:**
- **T3.1** Create `apps/web/lib/tenants.ts`. Type `Tenant` with `{ id, name, color, accent, personas, workflowSet, greeting, voiceMap }`. Three concrete tenants.
- **T3.2** Refactor `app/voice/dashboard/page.tsx` to read `?tenant=` and pass to client. Default = `arcanea`. Create alias routes `app/voice/sis/page.tsx` and `app/voice/frankx/page.tsx`.
- **T3.3** Inside `dashboard-client.tsx`, accept tenant prop, theme BR2049 gradients/accent off `tenant.color`/`tenant.accent`. Filter `WORKFLOWS` by `tenant.workflowSet`. Pass tenant.greeting through to room links.
- **T3.4** Add tenant param to `/room/[persona]?tenant=sis` so greeting api fetches right line.
- **T3.5** Update daemon to accept `--tenant <id>`. Default `arcanea`. Pass to URL as `?tenant=`.
- **T3.6** Define `SIS_WORKFLOWS` and `FRANKX_WORKFLOWS` arrays in `lib/workflows.ts` (4-6 each — SIS: search vault, recall, confirm, contradict; FrankX: daily ops, content pipeline, publish, brand check).

**Deliverables:**
- `apps/web/lib/tenants.ts` — new
- `apps/web/app/voice/sis/page.tsx`, `app/voice/frankx/page.tsx` — new
- `apps/web/app/voice/dashboard/lib/workflows.ts` — extended
- `dashboard-client.tsx` — tenant-aware theming
- `voice-daemon.mjs` — `--tenant` flag

**Verification:**
- `arcanea.ai/voice/dashboard` — Atlantean teal, full Arcanea workflows.
- `arcanea.ai/voice/sis` — purple Starlight, SIS workflows only.
- `arcanea.ai/voice/frankx` — amber, FrankX workflows.
- `node voice-daemon.mjs --tenant sis --persona alera` — clap opens `/room/alera?tenant=sis&via=clap-daemon` with SIS greeting.

**Critic notes:** Tenants will diverge over time. Don't over-abstract on Day 3. Keep it as flat config. Resist building `<TenantProvider>` context until 3+ tenants actually using it. **Rule:** copy-paste twice, abstract on the third.

---

### Day 4 — Local agent skeleton (`@arcanea/voice-agent`)
**Theme:** The bridge. Localhost:7777. Workflows actually fire.

**Tickets:**
- **T4.1** Scaffold `packages/arcanea-voice-agent/` with `package.json` (`name: @arcanea/voice-agent`, `bin: { arcanea-agent: ./bin/agent.mjs }`), `src/server.mjs`, `bin/agent.mjs`, `src/auth.mjs`, `src/dispatch.mjs`. Pure Node. Token auth: write random token to `~/.arcanea/agent-token` on first launch, require as `Authorization: Bearer <token>`.
- **T4.2** HTTP server on `127.0.0.1:7777` (not `0.0.0.0`). CORS allowlist: `http://localhost:3000`, `https://arcanea.ai`. Endpoints:
  - `GET /health` → `{ ok, version, uptime, tenants }` (no auth, used for discovery)
  - `POST /intent` (auth) → `{ kind, payload, tenant }`, dispatches
  - `POST /summon/:persona` → opens persona room window
  - `POST /tts` → proxies to greeting endpoint or local OpenAI key
- **T4.3** WebSocket server same port at `/events`. Streams `{ kind, ts, payload }` for Logic Stream.
- **T4.4** Dashboard discovery: in `dashboard-client.tsx`, on mount, race-fetch `http://localhost:7777/health` with 250ms timeout. If 200, set `agentMode=true`. Surface green "Agent online" pill in header. Otherwise stay in v2 (clipboard) mode.
- **T4.5** Move `openSummon()` from daemon to agent. Daemon becomes dumb clap detector that POSTs to `localhost:7777/intent {kind:'clap', tenant}` on detect. If agent offline, daemon falls back to direct browser launch.

**Deliverables:**
- `packages/arcanea-voice-agent/` — new package
- Discovery branch in `dashboard-client.tsx`
- Modified `voice-daemon.mjs` to POST clap events

**Verification:**
- `node packages/arcanea-voice-agent/bin/agent.mjs` → server starts, health returns 200
- Dashboard shows "Agent online" pill
- Daemon clap → agent receives POST → agent opens window
- Killing agent → daemon clap still works (graceful fallback)

**Critic notes:** Port 7777 may be in use (some VPNs claim it). On bind failure, try 7778, 7779. Write chosen port to `~/.arcanea/agent-port`, dashboard reads during discovery. CORS: do NOT use `Access-Control-Allow-Origin: *` — agent has shell access. Token auth required.

---

### Day 5 — Agent intent dispatch + first real workflow
**Theme:** Prove agent can fire CLI command and stream output back.

**Tickets:**
- **T5.1** In agent `src/dispatch.mjs`, implement intent kinds: `clap`, `summon`, `runtime`, `workflow`, `tts`. For each, route to handler.
- **T5.2** Implement `runtime` intent: spawn `claude`, `gemini`, or `codex` CLI as child process with optional initial prompt. Stream stdout to subscribed WS clients tagged with runtime ID. Track open sessions in memory.
- **T5.3** Implement *one* real workflow end-to-end: `daily-ops`. Dashboard fires "Run Daily Ops" → POST `/workflow/daily-ops` → agent spawns `claude /dawn` in new Windows Terminal window (`wt.exe new-tab "claude /dawn"`) — visible to user, not headless.
- **T5.4** Logic Stream WebSocket integration: `dashboard-client.tsx` subscribes to `ws://localhost:7777/events` when `agentMode=true`. Replace synthetic event ticker with real agent events.
- **T5.5** Add "Reconnect Agent" button in dashboard header for manual retry without refresh.

**Deliverables:**
- `packages/arcanea-voice-agent/src/dispatch.mjs` — intent router
- `packages/arcanea-voice-agent/src/handlers/runtime.mjs` — CLI spawner
- `packages/arcanea-voice-agent/src/handlers/workflow.mjs` — workflow executor
- Modified `apps/web/app/voice/dashboard/components/logic-stream.tsx` — consumes WS

**Verification:**
- With agent online, click "Daily Ops" → Windows Terminal opens with `claude /dawn`. Logic Stream shows event "spawned wt.exe pid=X".
- Disconnect agent → click "Daily Ops" → falls back to clipboard (v2). No crash.

**Critic notes:** Spawning child processes from a long-running Node service is dangerous if not contained. Each spawned CLI must be tracked, killable on agent shutdown, rate-limited (max 3 concurrent runtime spawns). Don't let agent become a fork bomb. Add kill-all endpoint + button.

---

### Day 6 — Tauri rewrap
**Theme:** Native window + system tray + autostart. Premium feel.

**Tickets:**
- **T6.1** Scaffold `apps/voice-desktop/` as Tauri 2 project. `pnpm create tauri-app`, TypeScript + React. Use existing `apps/web/app/voice/dashboard` as webview target (point Tauri devUrl at `https://arcanea.ai/voice/dashboard` for prod, `http://localhost:3000/voice/dashboard` for dev).
- **T6.2** Tauri config: window 1300x900, transparent + decorations false (custom titlebar to match BR2049), always-on-top toggle.
- **T6.3** System tray icon: orb logo. Right-click menu: Show/Hide/Switch Tenant (Arcanea/SIS/FrankX submenu)/Quit. Left-click: toggle window.
- **T6.4** Tauri sidecar: bundle `@arcanea/voice-agent` Node binary as sidecar so desktop app starts agent automatically (no separate install).
- **T6.5** Autostart on login (Tauri plugin-autostart). Default off, toggle in tray menu.
- **T6.6** First build target: Windows MSI. `pnpm tauri build --target x86_64-pc-windows-msvc`. Don't worry about macOS yet.

**Deliverables:**
- `apps/voice-desktop/` — full Tauri scaffold
- `apps/voice-desktop/src-tauri/tauri.conf.json` — window + tray config
- `apps/voice-desktop/src-tauri/src/main.rs` — sidecar spawn + tray handlers
- One MSI artifact at `apps/voice-desktop/src-tauri/target/release/bundle/msi/arcanea-voice_0.1.0_x64.msi`

**Verification:**
- Install MSI → Arcanea icon in tray → click → window opens → "Agent online" pill green (sidecar started).
- Right-click tray → Switch Tenant → SIS → window navigates to SIS dashboard.
- Close window → process keeps running in tray. Quit from tray → process exits cleanly, agent shuts down.

**Critic notes:** Tauri 2 + Windows + sidecar Node is a known sharp edge — Node's `process.platform` detection inside Tauri can misfire, sidecar permissions need explicit allowlist in `tauri.conf.json`. Budget 1.5 days even though I allocated 1. MSI bundling needs WiX toolchain; if not present, use NSIS bundler. If Day 6 spills into Day 7, defer to Day 8 — don't sacrifice Day 7 for it.

---

### Day 7 — Polish, integrate, ship
**Theme:** Wire everything. Verify end-to-end. Document.

**Tickets:**
- **T7.1** Multi-clap pattern for tenant switching in daemon: 2 claps = primary tenant, 3 claps within 2s = secondary, 4 claps = tertiary. Map to tenant daemon was started with as primary.
- **T7.2** Per-tenant voice characters: extend `PERSONA_MAP` in `apps/web/app/api/ai/speak/route.ts` so SIS personas use different OpenAI voices than Arcanea (`onyx` for Starlight, `shimmer` for Lumina, `alloy` for FrankX).
- **T7.3** End-to-end test script `packages/arcanea-voice-agent/test/e2e.mjs`: starts agent, fakes clap intent, verifies window opens, fakes workflow intent, verifies CLI spawned. Run in CI.
- **T7.4** Update `README.md` for `@arcanea/voice-agent` with install + run instructions. Update `packages/arcanea-voice/README.md` with new daemon → agent flow.
- **T7.5** Write `planning-with-files/CURRENT_STATE_2026-05-02_VOICE_3.0.md` documenting what shipped vs what didn't.

**Deliverables:** Multi-clap pattern, tenant TTS voice mapping, E2E test, READMEs, status doc.

**Verification:**
- Single user flow: install MSI → autostart on → reboot → log in → tray icon → 2 claps → Arcanea Lumina greeting plays in app-window → Space → speak → reply.
- Switch tenant: 3 claps → SIS Starlight greeting (different voice).
- Click "Daily Ops" tile → wt.exe opens with /dawn.

**Critic notes:** Day 7 is integration. Bugs surface here that should have been caught earlier. Don't add new features. Cut scope on T7.2 and T7.3 first if time-pressured.

---

## Risk + dependency map

| Day | Blocks | Blocked by | Risk |
|---|---|---|---|
| Day 1 (diagnose) | Everything else | Nothing | Low if probes done. Catastrophic if skipped. |
| Day 2 (TTS) | Day 7 | Day 1 (autoplay needs working audio context) | Medium — autoplay policy may force fallback button. |
| Day 3 (multi-tenant) | Day 4 | Nothing | Low — pure config + routing. |
| Day 4 (agent) | Days 5, 6 | Day 3 | Medium — port collisions, CORS, auth. |
| Day 5 (dispatch) | Day 7 | Day 4 | High — child process orchestration is fragile. |
| Day 6 (Tauri) | Day 7 | Day 4 (sidecar binary needs to exist) | High — Tauri+Windows+sidecar known sharp edge. |
| Day 7 (polish) | — | All previous | Medium. |

**Critical path:** 1 → 4 → 5 → 6 → 7. Days 2 and 3 are parallel-eligible but not blocking critical path.

---

## Machine resource budget — 16GB RAM Windows

The v3 stack at full bore: Node agent (~120MB) + Tauri webview (~250MB) + Chromium app-window for room (~400MB) + Next.js dev (~600MB) + ffmpeg daemon (~80MB) + Claude Code child (~400MB) + OS baseline (~3GB) = **~5GB minimum, 7GB realistic**.

That leaves ~9GB for VS Code, Slack, browsers, actual work. Tight but workable.

**Constraints to enforce in code:**
- Agent: cap Node heap with `--max-old-space-size=256`
- Tauri: avoid bundling second Chromium — point at prod webview by default, fall back to localhost only in dev
- Cap concurrent runtime spawns at 3 in agent dispatch
- Daemon: keep buffer-trim window tight (already does — 25ms frames, no growing buffers)
- Next.js dev not part of production stack — only running during local web dev. Production hits arcanea.ai.

**For next session running this plan:** before Day 4, close anything not strictly needed. Recommend kill Slack, extra Chrome windows, background Electron apps. Memory-Guardian skill exists (`/memory-guardian`) — invoke if WSL is in play.

**Telemetry:** Add `process.memoryUsage()` log every 60s in agent. Surface as header pill in dashboard ("Agent: 142MB"). When >250MB, that's a leak — investigate.

---

## What to build first vs defer — the 80/20 cut

**If only 2 days, ship Days 1 + 2.**

Day 1 (diagnose + fix room voice loop) is non-negotiable. Without it, nothing else matters.

Day 2 (TTS greeting) is the demo magic. "Sir, the SIS is activating" in a velvety voice is what makes it feel like Jarvis instead of "another tab." Cheap (~3h), enormous emotional payoff.

**Defer in 2-day mode:** Multi-tenant routing (Day 3) — Frank can use one tenant for now and switch via direct URL. Local agent (Days 4-5) — workflows still copy-to-clipboard. Tauri (Day 6) — web works for personal use.

**If 3-4 days, add Days 3 + 4.** Multi-tenant + agent skeleton (without intent dispatch). Real local agent answering health checks.

**If 5-6 days, add Day 5.** First real workflow firing CLI from dashboard. The demoable miracle.

**Tauri (Day 6) + final polish (Day 7) are last.** If they slip a week, fine.

---

## Stretch goals (after Day 7)

- Picovoice Porcupine wake-word ("Hey Lumina") — replaces or supplements clap
- ElevenLabs voice character per tenant (richer than OpenAI TTS)
- Persistent session state in agent (Lumina remembers prior conversation)
- Agent installer for paying customers (`pnpm install -g @arcanea/voice-agent && arcanea-agent install`)
- macOS port of Tauri build

These are recurring-subscription justifying. Not Sprint 1.

---

## Critical files for next session

- `C:/Users/frank/Arcanea/packages/arcanea-voice/bin/voice-daemon.mjs` — clap detection + browser launch
- `C:/Users/frank/Arcanea/apps/web/app/room/[persona]/room-client.tsx` — voice loop client (Day 1 patches)
- `C:/Users/frank/Arcanea/apps/web/app/api/ai/speak/route.ts` — TTS substrate
- `C:/Users/frank/Arcanea/apps/web/app/voice/dashboard/dashboard-client.tsx` — multi-tenant + agent discovery
- `C:/Users/frank/Arcanea/planning-with-files/VOICE_3.0_GROUND_UP_2026-04-25.md` — architecture
- `C:/Users/frank/Arcanea/planning-with-files/VOICE_3.0_RESEARCH_2026-04-25.md` — fork research

---

## First-action checklist for next session

Save this verbatim. Then start at **DAY 0** and run all 7 diagnostic probes before touching code. The single highest-leverage hour of the next session is Day 0. The rest is conditional on what you find.

**Do not skip diagnosis.** The room-client code is good, the daemon code is good, the seam between them is broken. Find the seam.
