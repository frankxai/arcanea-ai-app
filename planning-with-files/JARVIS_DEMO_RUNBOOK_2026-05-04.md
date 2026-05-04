# Jarvis Voice Demo — Runbook

**Built:** 2026-05-04 · **Branch:** feature/i18n-foundation · **Demo target:** localhost:3000/room/jarvis

## What was shipped this session

Four files. ~130 net lines added.

1. **`apps/web/app/room/[persona]/personas.ts`** — Jarvis persona upgraded from generic prompt to research-grade Sir/mountain-king voice. Color shifted from icy cyan to sky steel (`#7dd3fc`). Voice key wired to ElevenLabs "George" (deep BBC). Greeting: `"Sir. Standing by."`

2. **`apps/web/app/api/ai/speak/route.ts`** — Added `jarvis: { voice: 'onyx', model: 'tts-1-hd' }` to OpenAI TTS PERSONA_MAP. Onyx is the deepest stock voice; tts-1-hd is the higher-quality model.

3. **`apps/web/app/room/[persona]/room-client.tsx`** — Three additions:
   - Mic on/off toggle (visible pill in top status bar, keyboard shortcut **M**, stops in-flight recording on disarm)
   - Briefing fetch on mount → composed system prompt
   - Subtle visual dim of orb glow when mic disarmed (opacity 0.32 vs 0.7)

4. **`apps/web/app/api/voice/briefing/route.ts`** — NEW. Node-runtime endpoint that returns today's git activity, current branch, latest planning files, system memory snapshot. Server runs on Frank's machine in dev → has full filesystem + git access. On Vercel returns a remote-mode placeholder.

## What you must do (60 seconds)

Add ONE line to `apps/web/.env.local`:

```
GROQ_API_KEY=gsk_...
```

That single key now covers the full pipeline:
- **STT** — Groq Whisper-large-v3-turbo (already wired in `/api/ai/transcribe`)
- **LLM** — Groq Llama 3.3 70B Versatile via the BYOK browser path, OR via the existing chat route
- **TTS** — Groq PlayAI (Atlas voice for Jarvis), wired into `/api/ai/speak` as the primary path on this branch

Free tier at console.groq.com. Total cost for the demo: $0.

OpenAI is now an *optional* fallback. If you have `OPENAI_API_KEY` set, the speak route uses it only when Groq fails. The original "you need OpenAI" guidance is obsolete on this branch.

## Demo runbook (90 seconds, in order)

```bash
# Terminal 1 — start the server (this machine becomes Jarvis's brain)
cd C:\Users\frank\Arcanea
pnpm --dir apps/web dev

# Wait for "Local: http://localhost:3000"
```

Then in your browser:

1. Open **http://localhost:3000/room/jarvis**
2. Allow microphone when prompted
3. Watch the top pill — green dot = MIC ON, red dot = MIC OFF. Tap or press **M** to toggle.
4. Press and hold **Space** (or tap anywhere) and speak

## Try these lines (each demonstrates a different capability)

| Say this | What it shows |
|---|---|
| "Sir, what was I working on today?" | Daily briefing context — git log + branch + planning files |
| "What's the system status?" | Memory snapshot from briefing |
| "Tell my brother about Arcanea." | Persona voice + general knowledge |
| "Should I install the voice operator now?" | Watch for honest dissent — Jarvis disagrees plainly |
| "Thanks Jarvis." | Should respond with single word: "Sir." |

## Mic toggle (the new control)

- **Pill at top, between BYOK and persona name.** Green pulse = listening enabled. Red = off.
- **Click pill** or press **M** to toggle.
- When OFF: Space + tap are inert, orb glow dims, in-flight recording stops immediately.
- Speech playback is NOT affected by mic disarm — only input.

## Architecture (one diagram, mental model)

```
Browser /room/jarvis (face)
  ↓
localhost:3000 Next.js dev server (brain)
  ↓
  ├─ /api/voice/briefing  → git + fs + memory snapshot (local-only superpower)
  ├─ /api/ai/transcribe   → Groq Whisper-large-v3-turbo (or OpenAI fallback)
  ├─ /api/ai/chat         → Vercel AI SDK → Anthropic / OpenRouter / Google / xAI
  └─ /api/ai/speak        → Groq PlayAI Atlas-PlayAI (or OpenAI onyx fallback)
```

Run on Vercel = no briefing context (serverless can't read your filesystem). Run on localhost = full awareness of your repo, branch, commits, planning files. Today's demo runs locally.

## What's deliberately NOT in this build

- Tool calling (open_url, system_status as live tools) — deferred. Today's Jarvis answers from briefing context, not live tool calls. Cleaner demo.
- ElevenLabs server route — BYOK path keeps George voice for users with their own key. Server now defaults to Groq Atlas-PlayAI.
- Picovoice wake-word — closed by Sir's decision. Clap detection stays primary; we polish the daemon, we do not replace it.
- HUD overlay state machine — exists in `@arcanea/presence`, not yet mounted in `/room`.
- SIS voice-operator (`:7373` FastAPI) — never installed. Tonight's demo runs entirely off Arcanea.

## Next sprint tasks (when ready)

Full backlog with scope, touch-points, and definition-of-done lives at
`planning-with-files/VOICE_BACKLOG_2026-05-04.md`. Five items:
- VOICE-1 — Tool calling for Jarvis (open_url, git_status, system_status, explain_arcanea)
- VOICE-2 — Migrate brain into SIS voice-operator (`:7373`); Arcanea stays the distribution shell
- VOICE-3 — HUD overlay state machine on `/room/jarvis`
- VOICE-4 — Decompose 871-line `room-client.tsx` (over the 500-line limit)
- VOICE-5 — Daily Briefing v2 (calendar + Linear + Vercel + memory)

**Closed:** Picovoice wake-word. Clap detection stays primary — Sir's call.

## Verification

- `pnpm --dir apps/web exec tsc --noEmit` — passes (clean)
- Diff scope: 127 insertions / 20 deletions across 3 files + 1 new — Frank's other 22 WIP files untouched
