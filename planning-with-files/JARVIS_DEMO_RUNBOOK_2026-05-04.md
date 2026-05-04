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
OPENAI_API_KEY=sk-...
```

That key alone unlocks Jarvis's voice (TTS) + transcription fallback + chat fallback. Cost for the demo: under $0.10. Get one at platform.openai.com → API keys.

If you also want streaming Groq LLM (~3× faster first-token), drop `GROQ_API_KEY=gsk_...` next to it. Free at console.groq.com.

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
  └─ /api/ai/speak        → OpenAI TTS, voice="onyx", model="tts-1-hd"
```

Run on Vercel = no briefing context (serverless can't read your filesystem). Run on localhost = full awareness of your repo, branch, commits, planning files. Today's demo runs locally.

## What's deliberately NOT in this build

- Tool calling (open_url, system_status as live tools) — deferred. Today's Jarvis answers from briefing context, not live tool calls. Cleaner demo.
- ElevenLabs TTS via server route — works only on the BYOK path (browser → ElevenLabs direct). Server uses OpenAI onyx. Both produce a deep voice; ElevenLabs "George" is slightly warmer if you BYOK.
- Picovoice wake-word — using existing clap daemon. Can be upgraded next sprint.
- HUD overlay state machine — exists in `@arcanea/presence`, not yet mounted in `/room`.
- SIS voice-operator (`:7373` FastAPI) — never installed. Tonight's demo runs entirely off Arcanea.

## Next sprint tasks (when ready)

1. Wire Jarvis tool calling via Vercel AI SDK — `open_url`, `git_status`, `system_status` as proper tools
2. Migrate the brain into SIS voice-operator (`:7373`); keep Arcanea as the distribution shell
3. HUD overlay mounted on `/room/jarvis` with state machine
4. Demo video recorded for the homepage
5. Decompose 871-line `room-client.tsx` (over the 500-line ceiling per `apps/web/CLAUDE.md`)

## Verification

- `pnpm --dir apps/web exec tsc --noEmit` — passes (clean)
- Diff scope: 127 insertions / 20 deletions across 3 files + 1 new — Frank's other 22 WIP files untouched
