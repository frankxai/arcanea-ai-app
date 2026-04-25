# Voice 3.0 — Ground-Up Architecture
**Date:** 2026-04-25
**Status:** Architecture proposal. Implements over the next 1-2 weeks.
**Trigger:** Frank's question — "this is browser-only, can it actually control my CLI/PC? do I need a local app? multi-tenant for SIS / FrankX / Arcanea?"

The honest answer: the v2 dashboard is a polished UI on top of an incomplete substrate. To get actual *Jarvis-class* behavior — voice → CLI command → file written → window opened → result spoken back — we need a local agent. This doc lays out the full target architecture and the migration path from where we are today.

---

## What we have shipped (v2 — current)

```
[clap]                                           [click / ⌘K]
    ↓                                                ↓
voice-daemon.mjs (Node, FFmpeg)              Browser dashboard
    ↓                                                ↓
spawn Chromium → arcanea.ai/room/X          /api/voice/classify (Groq Llama)
                       ↑                            ↓
                       └────────────────────────  intent bus
```

What works:
- Clap → browser window
- ⌘K palette / voice classifier → intent emitted → workflow tile / persona summon / runtime copy
- Logic Stream watches every intent

What doesn't:
- **Browser can't shell-execute.** Workflows that "run /pulse" can only *copy the slash command to clipboard*. User still has to paste in Claude Code.
- **No singleton.** Each clap spawned a new window (fixed today: shared user-data-dir + SingletonLock check + focus-existing).
- **No persistent state.** Each room load is fresh. No "Lumina remembers we were just talking about Las Tierras."
- **One tenant only.** No SIS / FrankX / Oracle separations.
- **No greeting.** Window opens silent. Should announce "Sir, the Voice Dashboard is ready" with TTS.

---

## What we're targeting (v3 — ground up)

```
                    ┌─────────────────────────────────┐
                    │   System tray / autostart       │
                    │   single Tauri app or PWA       │
                    └────────────────┬────────────────┘
                                     │
   ┌─────────────────────────────────▼────────────────────────────┐
   │              ARCANEA LOCAL AGENT (port 7777)                  │
   │  Node + WebSocket server. Spawns CLI. Reads/writes filesystem. │
   │  Holds session state. Executes workflows. Bridges browser ↔ OS.│
   └────┬───────────┬────────────┬───────────────────┬─────────────┘
        │           │            │                   │
   [daemon]    [dashboards]  [voice classifier]  [TTS player]
   FFmpeg     React, hosted   Groq route          ElevenLabs
   clap +     on Vercel       (already shipped)   stream
   wake-word                                       
        │           │
   posts to     fetches localhost:7777
   localhost    via WebSocket
   on detect
```

### What changes

| Layer | v2 | v3 |
|---|---|---|
| Daemon | Spawns Chromium directly | POSTs to localhost:7777 → agent decides |
| Agent | None | Node HTTP/WS server, spawns CLI, holds state |
| Dashboard | One route | Per-tenant routes loading per-tenant config |
| Workflow exec | Clipboard copy | Agent shells out, returns result |
| State | Fresh per load | Persistent session via agent |
| TTS | None | Greeting + response audio via ElevenLabs |
| Singleton | Best-effort | Agent owns the truth — one window, focused |

### What stays

- Every modality emits the same `Intent` shape
- `/api/voice/classify` route stays
- BR2049 × Liquid Glass aesthetic
- All existing UI components (agent visualizer, workflow grid, logic stream, embedded viewer)

The agent is purely **additive**. Browser dashboards keep working when agent is offline (they fall back to v2 behavior — clipboard copy, hosted routes only). When agent is online, workflows actually fire.

---

## The local agent — `@arcanea/voice-agent`

A small Node package that:
- Boots an HTTP + WebSocket server on `localhost:7777` at user login
- Provides endpoints for: workflow execution, persona summon, file ops, CLI launch, session state, transcription bridge
- Authenticates dashboards via a session token written to `~/.arcanea/agent-token` (so only Frank's local browser, not arcanea.ai visitors, can call the agent)
- Spawns Claude Code / Gemini / Codex as child processes when a runtime is requested
- Streams output back to the dashboard via WebSocket

Skeleton shape:

```ts
// packages/arcanea-voice-agent/src/server.ts
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';

const app = createServer(handleHttp);
const wss = new WebSocketServer({ server: app });

function handleHttp(req, res) {
  if (req.method === 'POST' && req.url === '/intent') {
    // Receive intent from daemon or dashboard
    // Route to executor
  }
  if (req.url === '/health') {
    res.end(JSON.stringify({ ok: true, version, uptime, openSessions }));
  }
}

wss.on('connection', (ws) => {
  // Dashboard subscribes here for streamed agent activity
  ws.on('message', handleDashboardCommand);
});
```

### Endpoints

| Endpoint | Purpose |
|---|---|
| `POST /intent` | Daemon or dashboard fires an intent. Agent dispatches. |
| `POST /workflow/:id` | Execute a workflow (route, CLI, embed) — for CLI: spawn the command, stream output |
| `POST /summon/:persona` | Open persona room window (focused if exists) |
| `POST /runtime/:id` | Spawn the runtime CLI (claude, gemini, codex) with optional initial prompt |
| `POST /tts` | Generate TTS audio via ElevenLabs, stream MP3 |
| `GET /health` | Discovery — dashboard probes this on load to decide v2 vs v3 mode |
| `WS /events` | Stream of agent activity for the Logic Stream and Agent Visualizer |

### Why localhost:7777 specifically

Already used by `arcanea-voice --local` mode (the in-browser persona room with local server). Reuse the port. Existing voice CLI's local mode becomes a *capability* of the agent, not a separate process.

---

## Multi-tenant architecture

Each tenant is a JSON config + color palette + persona/workflow catalog:

```ts
// apps/web/lib/tenants.ts
export const TENANTS = {
  arcanea: {
    name: 'Arcanea',
    color: '#00bcd4',
    accent: '#ffd700',
    personas: [...],          // Lumina, Jarvis, Draconia, ...
    workflows: WORKFLOWS,      // already shipped
    runtimes: RUNTIMES,
    greeting: 'The Arcanea Voice Dashboard is at your service.',
  },
  sis: {
    name: 'Starlight Intelligence System',
    color: '#a78bfa',
    accent: '#ffffff',
    personas: [/* Starlight personas */],
    workflows: SIS_WORKFLOWS,
    runtimes: RUNTIMES,
    greeting: 'Sir, the Starlight Intelligence System is activating.',
  },
  frankx: {
    name: 'FrankX',
    color: '#f59e0b',
    accent: '#fbbf24',
    personas: [/* FrankX personas */],
    workflows: FRANKX_WORKFLOWS,
    runtimes: RUNTIMES,
    greeting: 'Welcome back. FrankX command center online.',
  },
};
```

Routes:
- `/voice/dashboard` → defaults to `arcanea` tenant (current behavior)
- `/voice/dashboard?tenant=sis` → SIS view
- `/voice/sis` (alias)
- `/voice/frankx` (alias)

Daemon supports multi-tenant via clap pattern OR persona arg:
- `voice daemon --tenant sis --persona starlight` → claps open SIS room
- 2 claps = primary tenant (Arcanea)
- 3 claps = secondary tenant (SIS)
- 4 claps = tertiary (FrankX)

---

## Premium activation — "Sir, the Voice Dashboard is ready"

### The greeting layer

New API route `/api/voice/greeting`:
- Input: `{ persona, tenant }`
- Output: MP3 stream from ElevenLabs (key already in env)
- Caches by `(persona, tenant)` hash — same greeting reused across sessions
- Per-tenant greeting scripts above

### The activation choreography

When a daemon-launched window mounts:
1. `t=0ms` — page loads, BR2049 haze fades in over 800ms
2. `t=300ms` — orb pulses once at persona color (light beat)
3. `t=600ms` — `/api/voice/greeting` audio starts streaming, plays through window's audio context
4. `t=600-3000ms` — orb radial waveform reflects greeting audio level (real-time AnalyserNode reading the greeting MP3)
5. `t=3000ms` — greeting ends, orb settles, mic icon glows ready, dashboard fully interactive

For the v2 dashboard (already shipped), a simplified version:
- Add `<audio autoplay>` on `/room/<persona>` mount with src `/api/voice/greeting?persona=X`
- Autoplay works because user just clapped (counts as user gesture in Chrome)
- Skip the choreography; just play the line

### Per-tenant greetings (proposed copy)

| Tenant | Persona | Greeting |
|---|---|---|
| Arcanea | Lumina | "First Light is here. Speak when ready." |
| Arcanea | Jarvis | "JARVIS online. Standing by." |
| SIS | Starlight | "Sir, the Starlight Intelligence System is activating." |
| FrankX | FrankX | "Welcome back. The command center is yours." |
| Oracle | Oracle | "Oracle ready. What's the question?" |

Voice characters tuned per persona via ElevenLabs voice IDs (already mapped in `packages/arcanea-voice/src/persona.mjs`).

---

## Migration path — order of operations

### Sprint 1 (this week — incremental wins)
1. ✅ **Singleton fix** (shipped today) — shared user-data-dir, focus existing window, 60s cooldown
2. **TTS greeting on /room/<persona>** — `/api/voice/greeting` route + autoplay audio on mount
3. **Multi-tenant scaffold** — `tenants.ts` config, `/voice/dashboard?tenant=X` route param, color theming swap
4. **SIS dashboard variant** — copy of Arcanea config with SIS personas + workflows
5. Confirm v2 dashboard *survives* with no agent (graceful degradation)

### Sprint 2 (next week — local agent)
1. **`@arcanea/voice-agent` package skeleton** — HTTP + WebSocket server on port 7777
2. **`/health` endpoint + dashboard discovery** — dashboard probes localhost; if responds, switch to "agent mode" (workflows fire vs copy)
3. **`/runtime/:id` endpoint** — spawn `claude` / `gemini` / `codex` from agent
4. **Daemon → agent integration** — daemon POSTs to agent on clap; agent decides spawn vs focus
5. **Logic Stream → WebSocket** — real-time agent events (currently faked)

### Sprint 3 (next week — premium)
1. **TTS streaming during agent responses** — every "I'll do X" speaks
2. **Multi-clap pattern** for tenant switching (3 claps SIS, etc.)
3. **System tray icon** — Win32 + macOS menu bar
4. **Tauri rewrap** of the dashboard as a native window with full local access

---

## Open questions for Frank

1. **Tauri vs persistent browser tab + PWA install** — the latter is faster but feels less premium. Tauri = real desktop app. Worth ~3 days?
2. **Tenant switching mechanic** — multi-clap pattern or system-tray menu? Multi-clap is cooler but tray menu is more discoverable.
3. **Always-listening wake word ("Hey Lumina") vs clap-only** — Picovoice Porcupine free tier (3 monthly users, fine for one founder) gives you "Hey Lumina" + "Hey Jarvis" + custom phrases. ~3h to integrate.
4. **Voice characters per tenant** — Lumina sounds different from Starlight should sound different from FrankX. Need to choose ElevenLabs voice IDs per tenant.
5. **Agent installer story** — how does someone *else* (a paying customer) install the agent on their machine? Probably a `pnpm install -g @arcanea/voice-agent && arcanea-agent install` that creates the autostart entry.

---

## Why this matters strategically

The v2 dashboard is the *demo*. The v3 architecture is the *product*. Once the local agent is real:
- Workflows actually execute (CLI fires, files write)
- Multi-tenant means each Arcanea customer gets their own dashboard skin
- Wake word + clap + ⌘K are equivalent triggers — *same intent bus, three modalities*
- TTS makes it feel alive
- Tauri rewrap makes it sellable as a native app

This is the bridge from "cool web dashboard" to "thing people pay for."

For Gate-0 sprint to first €1: the *demo* (v2 + greeting + multi-tenant) is enough to land the first paying member. The agent (v3 Sprint 2) is what justifies the recurring subscription.

---

*Drafted by Lumina, 2026-04-25 ~13:30 UTC. Implements alongside the Voice Dashboard 2.0 ship logged in OVERNIGHT_BUILD_2026-04-25.*
