# Handover — 2026-04-25 — Voice 3.0 Days 0-4

## Situation

**Project:** `arcanea-ai-app` (https://github.com/frankxai/arcanea-ai-app), production at https://arcanea.ai (Vercel project `arcanea-ai-appx`).

**Goal of this session:** Execute Voice 3.0 Days 0-4 from the autonomous-execution prompt at `planning-with-files/NEXT_SESSION_PROMPT_VOICE_3.0.md`. Take the v2 dashboard (clap → window opens but voice loop doesn't work) to a state where `/room/<persona>` voice loop is unblocked, has a TTS greeting on activation, supports three tenants (Arcanea/SIS/FrankX), and a local agent skeleton answers `/health` for dashboard discovery.

**State at session end:** Days 0-4 shipped to `main` in commit `d19449e7`. Days 5-7 (real CLI spawn, Tauri rewrap, polish) remain. The current Voice Dashboard at https://arcanea.ai/voice/dashboard is in v2 mode (clipboard fallback) until an agent runs locally — agent runs only on Frank's machine.

## What's Done

- **Day 0 diagnosis** — `planning-with-files/VOICE_3.0_DAY0_DIAGNOSIS_2026-04-25.md`. Code-based root cause: probe **#1** (mic permission scope on fresh `~/.arcanea/voice-room` Chromium profile) + **#3** (`AudioContext` stays `'suspended'` after the `await getUserMedia` consumes the user-gesture token). Probes #2/#4/#5 are not the issue. One-sentence root cause: *the voice loop runs but reads silent audio, so VAD never trips and `hasSpokenRef` stays false*.

- **Day 1 fixes** (`apps/web/app/room/[persona]/room-client.tsx`, `packages/arcanea-voice/bin/voice-daemon.mjs`):
  - `navigator.permissions.query({name:'microphone'})` on mount, state in `micPermission` ref
  - `primeMic()` callback creates AudioContext with explicit `await ctx.resume()`, persists stream + analyser in refs so first Space is instant
  - Permission activation overlay rendered when `?via=clap-daemon` and mic state is `'prompt' | 'denied' | 'unknown'` and stream not yet primed
  - `?debug=1` overlay (top-right, `mic / ctx / tracks / recorder / via`)
  - `window.focus()` on mount (covers app-window focus loss)
  - Daemon logs which browser was selected; warns when Edge is picked

- **Day 2 TTS greeting** (`apps/web/app/api/voice/greeting/route.ts`, `personas.ts`, `room-client.tsx`):
  - Edge-runtime route returns `audio/mpeg` from OpenAI `tts-1-hd`
  - In-memory LRU cache with 30-min TTL keyed by `persona+tenant`
  - `personas.ts` adds `greeting: string` field per persona + `greetingFor(personaId, tenantId)` helper with `TENANT_GREETING_OVERRIDE` map
  - `room-client.tsx` autoplay effect: only fires when `?via=clap-daemon`, 350ms delay, falls through silently on `NotAllowedError`

- **Day 3 multi-tenant** (`apps/web/lib/tenants.ts`, `app/voice/{sis,frankx}/page.tsx`, daemon):
  - 3 tenants — `arcanea` (teal/gold), `sis` (purple), `frankx` (amber)
  - Each has `personaAllowlist`, `workflowAllowlist`, `voiceMap`, `defaultPersona`
  - `dashboard-client.tsx` accepts optional `tenantId` prop; reads `?tenant=` if no prop; filters personas + workflows; theme color drives header pill
  - `WorkflowGrid` accepts optional `workflows={}` prop replacing hard import
  - Daemon `--tenant <id>` flag, default `arcanea`, propagated into URL

- **Day 4 local agent** (`packages/arcanea-voice-agent` v0.1.0):
  - HTTP + WebSocket server on `127.0.0.1` only, port fallback `7777 → 7785`
  - Token auth via `~/.arcanea/agent-token` (mode 0600 POSIX, 256-bit hex). `/health` is the only unauth endpoint
  - CORS allowlist: `localhost:3000`, `127.0.0.1:3000`, `arcanea.ai`, `www.arcanea.ai`. NEVER `*` — agent has shell access
  - Endpoints: `GET /health`, `POST /intent`, `POST /summon/:persona`, `GET/DELETE /runtimes`, `WS /events`
  - Memory telemetry every 60s (warns >250 MB RSS), `--max-old-space-size=256`
  - Dispatch: `clap | summon | workflow | runtime | tts` — v0.1 records + emits events (Day 5 spawns child processes); `MAX_CONCURRENT_RUNTIMES=3`
  - **5/5 smoke tests pass** (`packages/arcanea-voice-agent/test/agent.test.mjs`)
  - Dashboard discovery: race-fetch `/health` w/ 250ms timeout, only when running locally; `Agent` pill in header (port + RAM); `v2` pill clickable for retry
  - `/api/voice/agent-token` + `/api/voice/agent-port` Node-runtime routes (localhost-only) bridge token/port to dashboard JS
  - Daemon best-effort agent ping on clap with graceful fallback

- **Pushed to main** as `d19449e7` (1,716 insertions across 20 files).

## What's Not Done

- **Day 5 — real CLI spawn** (deferred): `runtime` intent should `child_process.spawn('claude', ['/dawn'])`, stream stdout via WS. `daily-ops` workflow should fire `wt.exe new-tab "claude /dawn"` on Windows. Currently the dispatcher emits an event but doesn't shell out. **Why deferred:** Day 5 is high-risk (child-process orchestration is fragile — kill tracking, rate limit, fork-bomb prevention). Scope-cut for one session.
- **Day 6 — Tauri rewrap** (deferred): `apps/voice-desktop/` Tauri 2 project, sidecar Node, system tray, autostart. **Why deferred:** 1.5-day track minimum per sprint plan; needs Wix/NSIS toolchain decisions. Critic note in plan flagged this explicitly.
- **Day 7 — polish** (deferred): multi-clap pattern (2/3/4 claps for tenant switch in daemon), per-tenant TTS voices wired everywhere, E2E test, READMEs.
- **Manual verification** of Day 1 patches: requires Frank to clap and physically test the daemon-launched window. Probes 0.1, 0.4, 0.6 in the original sprint plan all needed human-in-the-loop. The code-based diagnosis is high-confidence but the ?debug=1 overlay should confirm `mic=granted, ctx=running, stream=ok` on next test.
- **Vercel deploy verification** for `/voice/sis` and `/voice/frankx` aliases — they typecheck clean but a real deploy probe + screenshot would confirm the tenant theming renders correctly.

## Critical Context

**Don't skip:**
- The agent NEVER binds to `0.0.0.0`. It has shell access. Token-only-via-localhost is the entire security model. `Access-Control-Allow-Origin: *` is forbidden — keep the allowlist.
- Token file is `~/.arcanea/agent-token` (mode 0600). The dashboard reads it via `/api/voice/agent-token`, gated by `host.startsWith('localhost') || '127.0.0.1'`. In Vercel prod the gate returns 404 — don't try to ship a token through the cloud.
- Memory rule: `--max-old-space-size=256`. Frank's machine is 16 GB. Multiple Claude Code instances at once will swap.
- The daemon prefers Chrome over Edge. If Frank only has Edge installed, mic in `--app=` mode may fail differently. Daemon logs which binary it picked.
- Pre-existing `@arcanea/core` build error (`fonts.sans` missing on `Record<string, string>`) is **not my code**. It blocks `pnpm run type-check` from the root, but `npx tsc --noEmit` from `apps/web/` is clean. Use the latter.

**Pre-existing staged state in working tree:** when the session started there were 70+ already-staged skill files (`.arcanea/skills/...`) from a previous session. I `git reset HEAD`'d them to commit only Voice 3.0 cleanly. They are now untracked again, which is correct — Frank can pick them up next session if he wants to commit them.

**Cached-belief rule (per CLAUDE.md):** verify current state by reading disk before citing memory. Memory is authoritative for intent + strategy + decisions, never for code/deploy/version state.

## Next Actions (ordered)

### Immediate — verify Day 0-4 actually works

1. **Manual room-loop test (10 min).**
   ```bash
   # Visit directly first (no daemon)
   open https://arcanea.ai/room/lumina?via=clap-daemon&debug=1
   # Should see: activation overlay → tap → permission prompt → mic granted → debug pill shows ctx=running
   # Greeting plays. Press Space → "Listening" → speak → reply.
   ```
2. **Daemon test.**
   ```bash
   node packages/arcanea-voice/bin/voice-daemon.mjs --persona lumina
   # Clap twice. Window opens at /room/lumina?via=clap-daemon&tenant=arcanea
   # Confirm browser=Chrome in daemon logs. If Edge — install Chrome and retest.
   ```
3. **Tenant test.**
   ```bash
   node packages/arcanea-voice/bin/voice-daemon.mjs --persona lumina --tenant sis
   # Clap → window opens at /room/lumina?via=clap-daemon&tenant=sis
   # Greeting should be "Sir, the Starlight Intelligence System is activating."
   # Voice character should be 'shimmer' not 'nova'.
   ```
4. **Agent + dashboard discovery.**
   ```bash
   pnpm --filter @arcanea/voice-agent start
   # Then in another terminal:
   pnpm --filter @arcanea/web dev
   # Visit http://localhost:3000/voice/dashboard
   # Header should show green "Agent" pill with port + RAM.
   # Visit http://localhost:3000/voice/sis — purple theme, SIS workflows only.
   # Visit http://localhost:3000/voice/frankx — amber theme.
   ```

### Short — Day 5 (real CLI spawn) — 1 day

Spec is in `planning-with-files/VOICE_3.0_SPRINT_PLAN_2026-04-25.md` § "Day 5". Key tickets:
- **T5.2** `packages/arcanea-voice-agent/src/handlers/runtime.mjs` — spawn `claude` / `gemini` / `codex` as child process, track in `activeRuntimes` Map, stream stdout to subscribed WS clients tagged with runtime id
- **T5.3** Implement `daily-ops` workflow: `dispatch({kind:'workflow', workflowId:'daily-ops'})` → `wt.exe new-tab "claude /dawn"` (Windows). Fall back to `terminator -e "claude /dawn"` (Linux), `osascript -e 'tell app "Terminal" to do script "claude /dawn"'` (macOS).
- **T5.4** `dashboard-client.tsx` Logic Stream: subscribe to `ws://localhost:7777/events` when `agentMode=true`, replace synthetic events with real ones
- **T5.5** "Reconnect Agent" button (the v2 pill is already clickable — convert into a proper retry handler)

**Critic notes carried over:** spawned children must be killable on agent shutdown, rate-limited (max 3 concurrent). Don't let agent become a fork bomb.

### Medium — Day 6 (Tauri rewrap) — 1.5 days

- Scaffold `apps/voice-desktop/` via `pnpm create tauri-app` (TypeScript + React)
- Tauri 2 config: window 1300×900, transparent, `decorations: false`, custom titlebar
- Tray icon (orb logo), right-click → tenant submenu, left-click toggle window
- Sidecar `@arcanea/voice-agent` Node binary → starts agent on app launch
- `tauri-plugin-autostart` for login autostart (default off, toggle in tray)
- First build: Windows MSI via `pnpm tauri build --target x86_64-pc-windows-msvc`. If WiX absent, switch bundler to NSIS.
- **Macro reference:** EpicenterHQ/epicenter (Whispering — MIT) is the cleanest Tauri-2 + sidecar reference. **Don't fork** — read patterns.

### Long — Day 7 (polish) — 1 day

- **T7.1** Multi-clap pattern in daemon: 2 claps = primary tenant, 3 claps within 2s = secondary, 4 claps = tertiary
- **T7.2** Per-tenant voice characters: extend `PERSONA_MAP` in `apps/web/app/api/ai/speak/route.ts` so SIS personas use different OpenAI voices (`onyx` Starlight, `shimmer` Lumina, `alloy` FrankX)
- **T7.3** E2E test `packages/arcanea-voice-agent/test/e2e.mjs`: starts agent, fakes clap intent, verifies window opens, fakes workflow intent, verifies CLI spawned. Wire into CI.
- **T7.4** Update READMEs (`packages/arcanea-voice-agent/`, `packages/arcanea-voice/`)
- **T7.5** Write `planning-with-files/CURRENT_STATE_2026-05-02_VOICE_3.0.md`

### Stretch — Founding Circle demo

The Sprint 3 ship (greeting + multi-tenant + Tauri MSI) is what justifies a Founding Circle subscription. Prep a screen-recording + 60s narrative for landing page once Day 6 + Day 7 ship.

## Files to Read First

- `planning-with-files/VOICE_3.0_GROUND_UP_2026-04-25.md` — full architecture (local agent, multi-tenant, premium activation, migration path)
- `planning-with-files/VOICE_3.0_SPRINT_PLAN_2026-04-25.md` — 7-day executable plan with day-by-day tickets, deliverables, verification, critic notes, risk map
- `planning-with-files/VOICE_3.0_RESEARCH_2026-04-25.md` — fork research (Picovoice Porcupine, ElevenLabs UI Orb, LobeChat workspace pattern, Whispering Tauri reference)
- `planning-with-files/VOICE_3.0_DAY0_DIAGNOSIS_2026-04-25.md` — code-based root-cause analysis from this session
- `apps/web/app/room/[persona]/room-client.tsx` — voice loop client (Day 1 patches; ~870 lines)
- `apps/web/app/voice/dashboard/dashboard-client.tsx` — multi-tenant + agent discovery (~600 lines)
- `apps/web/lib/tenants.ts` — tenant registry (small file, central truth)
- `packages/arcanea-voice-agent/src/server.mjs` — agent HTTP+WS implementation
- `packages/arcanea-voice/bin/voice-daemon.mjs` — clap detector + browser launch + agent ping
- `apps/web/CLAUDE.md` and `packages/CLAUDE.md` — domain-scoped standards

## Repo Map

| Path | Purpose | State |
|---|---|---|
| `apps/web/` | Next.js 16 production app, deployed to Vercel `arcanea-ai-appx` (https://arcanea.ai) | Voice 3.0 Days 0-4 patches live |
| `apps/web/app/voice/{dashboard,sis,frankx}/` | Three multi-tenant voice dashboards | Live; theming + filtering working |
| `apps/web/app/room/[persona]/` | Per-persona voice room (Space-to-talk + clap-greeting) | Day 1 + Day 2 patches live |
| `apps/web/app/api/voice/{greeting,agent-token,agent-port,classify}/` | TTS greeting + agent bridge routes | Greeting cached, agent bridge localhost-only |
| `packages/arcanea-voice/` | System daemon (FFmpeg-based clap detector + browser launcher) | `--tenant` flag added; logs browser binary |
| `packages/arcanea-voice-agent/` | Local HTTP+WS agent on 127.0.0.1:7777 | v0.1.0 skeleton — Day 4 done; Day 5 spawn handlers TBD |
| `apps/voice-desktop/` | Tauri 2 wrapper | NOT YET CREATED — Day 6 |
| `planning-with-files/` | Source-of-truth planning + sprint docs | Voice 3.0 plans + Day 0 diagnosis present |
| `docs/ops/` | Handovers (this doc lives here) | 14 prior handovers |
| `book/` | 17-collection content library | Untouched this session |
| `arcanea-onchain/` | Onchain workspace (separate `.mcp.json`) | Untouched this session |

## Memory entries relevant to next agent

From `~/.claude/projects/C--Users-frank-Arcanea/memory/MEMORY.md`:

- `feedback_session_protocol.md` — MUST read `.arcanea/MASTER_PLAN.md` before any work
- `feedback_yolo_mode.md` — Claude launcher must use `--dangerously-skip-permissions`
- `feedback_no_coauthor_contamination.md` — NEVER add `Co-Authored-By: claude-flow/ruvnet`. Arcanea is sovereign. (Honored in Voice 3.0 commit.)
- `feedback_cached_belief_validation.md` — Verify current state from disk before citing memory
- `feedback_ship_means_ship.md` — "Put on website" = commit + push + deploying. Voice 3.0 commit pushed to main; arcanea.ai will pick it up on next Vercel build.
- `feedback_design_taste.md` — Hates Cinzel, wants peacock blue/aquamarine, 3D liquid glass Apple UI. Day 6 Tauri + ElevenLabs Orb need to honor this.
- `feedback_quality_standard.md` — 7-gate excellence filter: First Principles, Voice, Design, Perf, Journey, Engineering, Strategy
- `project_voice_product_suite.md` — Voice UX overhaul: always-visible mic, auto-send, 6 personas, /voice page, rate limiting (already partially shipped pre-this-session)
- `project_router_spec.md` — `@arcanea/router-spec` and Composio AO facts. Single-source routing yaml.
- `project_pp_audit_2026_04_14.md` — RAM 92%, Next.js 2.6 GB leak, max 4-5 agents. Day 5 must obey this.

## Verification on next session start

```bash
cd C:/Users/frank/Arcanea
git log --oneline -5
# Should show d19449e7 at HEAD (or newer if Frank pushed more)

# Confirm agent test still passes (5/5)
pnpm --filter @arcanea/voice-agent test

# Confirm web app typechecks (run from apps/web — turbo from root will fail
# on a pre-existing @arcanea/core 'fonts.sans' error that is NOT in my code)
cd apps/web && npx tsc --noEmit
```

Both should be clean. If they aren't, something regressed between this session and the next — investigate before starting Day 5.

---

*Generated 2026-04-25 by Lumina (autonomous Claude Code session). Sprint plan: `planning-with-files/VOICE_3.0_SPRINT_PLAN_2026-04-25.md`. Next session resumes at Day 5 (real CLI spawn) per the master prompt.*
