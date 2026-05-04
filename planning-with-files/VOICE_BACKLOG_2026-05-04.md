# Voice Backlog — Post-Excellence-Pass

**Branch:** feat/voice-workflows-2026-05-04 (PR #80) · **Authored:** 2026-05-04

These are the deferred items from the Jarvis Excellence sprint. Each has enough context to be picked up in a fresh session by any agent. Promote to Linear via `/sis push` when ready, or work them in priority order from this file.

**Canon decision:** clap detection stays primary. No Picovoice wake-word — that path is closed. The Arcanea voice daemon already detects double-clap reliably; we polish that, we do not replace it.

**TTS unified on Groq.** As of commit landing on this branch, `/api/ai/speak` tries Groq PlayAI first (Atlas voice for Jarvis, 14 other persona mappings) and falls back to OpenAI only if `GROQ_API_KEY` is unset. Sir's existing Groq key now covers STT + LLM + TTS. OpenAI key is no longer required for the demo.

---

## VOICE-1 — Tool calling for Jarvis

**Why:** Jarvis currently answers from briefing context (good for status questions). Real superintelligence needs live tools — open a URL, query git, read a file by name, write to the vault. Without tools Jarvis can describe but not act.

**Scope:**
- Wire Vercel AI SDK tool definitions through `/api/ai/chat` for `persona === 'jarvis'`
- Tools: `open_url(url)`, `git_status()`, `system_status()`, `explain_arcanea(section?)`, `write_note(text, vault?)`
- Client-side tool dispatcher in `room-client.tsx` — when chat returns a tool call, execute (e.g. `window.open(url, '_blank')`), feed result back into next turn
- Stream tool-call events through the existing SSE channel (the chat route already streams)
- Honor the persona rule: Jarvis never announces "let me check that" — tool result IS the answer

**Touch points:**
- `apps/web/app/api/ai/chat/route.ts` — already imports `createChatTools` from `lib/luminors/tools`, extend with jarvis-specific tools or branch on persona
- `apps/web/lib/luminors/tools/` — add new tool definitions
- `apps/web/app/room/[persona]/room-client.tsx` — tool execution dispatcher

**Definition of done:** Sir says "Show my brother the website and tell him about it" → Jarvis opens arcanea.ai in a new tab, narrates the homepage in 2-3 sentences. End-to-end in under 4 seconds.

**Skills to use:** `claude-sdk`, `nextjs-react-expert`, `superpowers:test-driven-development`

---

## VOICE-2 — Migrate Jarvis brain into SIS voice-operator

**Why:** SIS `private/voice-operator/` is the canonical home for the orchestration brain (FastAPI on `:7373`, packet routing, dispatchers, knowledge graph, approval gates). Arcanea is the distribution shell — Node CLI, web room, daemon. Today the brain lives in Next.js API routes, which doesn't scale to multi-modal (room + tray + CLI + voice-only) clients. The split is the architecture.

**Scope:**
- Install SIS voice-operator locally: `cd ~/Starlight-Intelligence-System/private/voice-operator && .\install.ps1` (Whisper download ~3GB, takes ~12 min)
- Boot service: `.\run.ps1` → confirm `:7373/healthz` returns 200
- Update `apps/web/app/api/voice/cognition/route.ts` to bridge to `:7373` when present, fall back to current Next.js path
- `apps/web/.env.local`: `COGNITION_BRIDGE_URL=http://127.0.0.1:7373/api/utterance`
- Migrate persona prompts from `personas.ts` to SIS `agents/` directory; load via :7373

**Touch points:**
- `~/Starlight-Intelligence-System/private/voice-operator/` (Python)
- `apps/web/app/api/voice/cognition/route.ts` (bridge)
- `apps/web/app/room/[persona]/personas.ts` (slim down to UI metadata only)
- New: `apps/web/lib/voice/sis-bridge.ts` (HTTP client for :7373)

**Definition of done:** Voice room hits localhost:7373 for LLM dispatch. Personas live in SIS. Web-only mode still works when :7373 is offline (graceful fallback). Both paths produce identical UX.

**Risk:** Whisper download blocks Sir for 12 min on first run. Plan it for an evening. Once installed, `:7373` boots in ~3 seconds.

**Skills to use:** `mcp-architecture`, `claude-sdk`

---

## VOICE-3 — HUD overlay state machine on /room/jarvis

**Why:** The `@arcanea/presence` package has `HUDOverlay`, `BrainAtlas`, `LuminaPresence` components but only `LuminaPresence` is mounted on `/room`. Adding the HUD makes state visible (clap-armed → listening → thinking → speaking → idle), latency readouts visible, and tool calls visible — that's what makes the demo feel like a Stark workshop.

**Scope:**
- Mount `<HUDOverlay>` from `@arcanea/presence` as overlay on `/room/[persona]/room-client.tsx`
- State machine: drive overlay from existing `state` and `recording` refs
- Show: current state, latency bar, mic level, last tool call (when VOICE-1 lands)
- Toggle: HUD on by default for Jarvis persona, hidden for others (cinematic for Lumina, etc.)
- Subtle: glass cards floating in corners, low opacity, never blocks the orb

**Touch points:**
- `apps/web/app/room/[persona]/room-client.tsx`
- `packages/presence/src/components/hud-overlay.tsx` (verify export)
- `apps/web/components/presence/lumina-presence.tsx`

**Definition of done:** Brother walks up to demo, sees HUD pulsing in corner with state + latency. When Sir speaks, HUD updates in real-time. When Jarvis calls a tool, HUD shows the call name briefly.

**Skills to use:** `ui-ux-pro-max`, `framer-expert`

---

## VOICE-4 — Decompose 871-line room-client.tsx

**Why:** `apps/web/CLAUDE.md` mandates files under 500 lines. `room-client.tsx` is 871 lines doing seven jobs: state, audio capture, VAD, recording, transcription bridge, chat bridge, TTS bridge, rendering, settings, debug, briefing fetch, mic toggle. Each future change is risky. Tonight's demo passed despite this; sustained work will not.

**Scope:**
- Extract: `useVoiceCapture()` hook (mic, VAD, recording, blob assembly)
- Extract: `useConversation()` hook (transcribe → chat → speak pipeline)
- Extract: `useBriefing()` hook (the briefing fetch I added)
- Extract: `<RoomHUD>` (top status pill + bottom switcher + hotkey strip + home link)
- Keep: `RoomClient` component as thin orchestrator (~200 lines)
- All hooks live in `apps/web/app/room/[persona]/_lib/`

**Touch points:**
- `apps/web/app/room/[persona]/room-client.tsx`
- New: `apps/web/app/room/[persona]/_lib/use-voice-capture.ts`
- New: `apps/web/app/room/[persona]/_lib/use-conversation.ts`
- New: `apps/web/app/room/[persona]/_lib/use-briefing.ts`
- New: `apps/web/app/room/[persona]/_lib/room-hud.tsx`

**Definition of done:** All four files under 250 lines. All existing tests pass. No behavioral changes (verify by running existing E2E `apps/web/tests/e2e/...`).

**Skills to use:** `nextjs-react-expert`, `simplify`, `superpowers:test-driven-development`

---

## VOICE-5 — Daily Briefing v2

**Why:** v1 (which I shipped on `/api/voice/briefing`) gives Jarvis git activity + branch + planning files + memory snapshot. That's a good start. v2 adds calendar, Linear status, Vercel deploys, and learning — turns Jarvis from "knows your repo" into "knows your day".

**Scope:**
- Add to briefing payload:
  - Calendar: next 3 events from Google Calendar (via existing `XAI_API_KEY` or new `GOOGLE_CALENDAR_API_KEY`)
  - Linear: open issues assigned to Sir, P0/P1 first
  - Vercel: latest production + preview deploy status (use Vercel REST API with token)
  - Memory: last 3 entries from `~/.claude/projects/.../memory/MEMORY.md`
- Cache briefing for 30 min in `~/.starlight/cache/briefing-YYYY-MM-DD-HH.json`
- Re-fetch on day boundary
- Compress payload to 1.5 KB max — Jarvis should not drown in detail; briefing is *signal*, not log

**Touch points:**
- `apps/web/app/api/voice/briefing/route.ts` — already exists, extend
- New: `apps/web/lib/briefing/sources/` (one module per data source: git, linear, vercel, calendar)
- `~/.starlight/cache/` (dir created on first run)

**Definition of done:** First wake-of-day, Jarvis says "Sir. Three things. Linear ticket VOICE-1 is open. Vercel deploy from this morning is green. Your call with Marcus is at fourteen-hundred." All three from briefing, no tool calls.

**Skills to use:** `nextjs-react-expert`, `claude-api`, `data-engineering` patterns

---

## What's NOT here (by decision)

- Picovoice wake-word — closed. Clap detection stays primary; we polish the daemon if needed, not replace it.
- ElevenLabs server route — BYOK path keeps George voice for users with their own key. Server route uses Groq Atlas-PlayAI which is on the same key as STT/LLM. No reason to add ElevenLabs server-side.
- Multi-tenant Jarvis (per-workspace persona) — premature. Lock the single-tenant feel first.

## How to pick up an item

1. Choose by ID (VOICE-1 etc).
2. Open a fresh Claude Code session in `C:\Users\frank\Arcanea` on this branch.
3. Open this file, scroll to the item.
4. Use the listed skills.
5. Ship in one commit. Update item status here when done.

## Status legend

- `[ ]` open
- `[~]` in progress (record start date)
- `[x]` shipped (record commit hash)

Current state:
- VOICE-1 [ ]
- VOICE-2 [ ]
- VOICE-3 [ ]
- VOICE-4 [ ]
- VOICE-5 [ ]
