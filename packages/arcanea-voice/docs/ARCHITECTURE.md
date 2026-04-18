# @arcanea/voice — Architecture

A voice presence layer for Arcanea. Two surfaces, one design, zero hard
dependencies beyond `three.js` + `framer-motion` on the browser side and
Node 18 built-ins on the server side.

## Surfaces

```
┌────────────────────────────────────────┐   ┌────────────────────────────────────┐
│  Hosted Room                           │   │  Local Room (this package)         │
│  arcanea.ai/room/{persona}             │   │  voice jarvis --local              │
│                                        │   │  http://127.0.0.1:7777/?persona=…  │
│  • apps/web/app/room/[persona]/…       │   │                                    │
│  • Uses /api/ai/{transcribe,chat,speak}│   │  • packages/arcanea-voice/src/…    │
│    (server-side keys)                  │   │  • Direct Groq + ElevenLabs calls  │
│  • BYOK path via localStorage          │   │  • Claude Code + shell_run tools   │
│  • PWA installable                     │   │  • --app launches Chromium app     │
└────────────────────────────────────────┘   └────────────────────────────────────┘
                 │                                          │
                 │    both surfaces reuse these:            │
                 ▼                                          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  components/presence/{lumina-orb,lumina-presence,use-audio-analyser}     │
│  — three.js particle shell + bloom + halo ring + orbiting satellites     │
│  — persona-coloured, audio-reactive (mic on listen, TTS on speak)        │
└──────────────────────────────────────────────────────────────────────────┘
```

## Voice loop (local server)

```
 ┌─────────┐   MediaRecorder   ┌──────────┐   transcribe(file)   ┌────────┐
 │ Browser │ ───── webm ─────▶ │ handleCo │ ───── curl -F ─────▶ │  Groq  │
 │  (mic)  │                   │  nverse  │   whisper-large-v3   │  STT   │
 └────┬────┘                   └────┬─────┘                      └────┬───┘
      │                             │                                 │
      │                             │  text                           │
      │                             ▼                                 │
      │                      ┌──────────────┐   fetch()     ┌────────┴────┐
      │                      │ runLlmLoop   │ ───────────▶  │ Groq LLM    │
      │                      │ MAX_ROUNDS=4 │   tools:[…]    │ llama-3.3   │
      │                      │ MAX_CALLS=8  │ ◀───────────   │ function    │
      │                      └──────┬───────┘   tool_calls   │ calling     │
      │                             │                         └─────────────┘
      │                             │  tool_calls?
      │                             ▼
      │                      ┌──────────────┐
      │                      │ executeTool  │   shell_run • file_write
      │                      │  (tools.mjs) │   claude_prompt • claude_code_launch
      │                      └──────┬───────┘   open_url • linear_issue
      │                             │
      │                             │  final reply text
      │                             ▼
      │                      ┌──────────────┐                  ┌─────────────┐
      │   audio/mpeg  ◀───── │  synthesize  │ ────────────────▶│ ElevenLabs  │
      │   headers            └──────────────┘   turbo v2.5     │ → Groq PlayAI│
      │   x-voice-*                                             │ → Edge TTS  │
      │                                                          └─────────────┘
      ▼
 AudioElement + AnalyserNode → orb speaking state
```

Every stage logs `[VOICE] stage total=Xms` on the client, and the server
emits `x-voice-t-{stt,llm,tts}-ms` response headers + a stderr line per
turn. Perf regressions surface immediately.

## Barge-in

While the agent is speaking, a second `AnalyserNode` polls the mic at
~60 fps. RMS > 0.045 for >150 ms → `audio.pause()` + `AbortController.abort()`
+ flip to listening. Closes the UX gap with ElevenLabs Conversational AI.

## Push-to-talk semantics

`Space` is hybrid:

| Gesture | Behaviour |
|---|---|
| Tap (<200 ms)   | Toggle — starts recording, VAD auto-stops on 900 ms silence |
| Hold (>=200 ms) | Push-to-talk — release stops recording immediately |

`e.repeat` is always ignored. OS key autorepeat was the root cause of
the original "nothing heard" bug — it fired keydown 30 ×/s and thrashed
start/stop, producing blobs that were too small to transcribe.

## Safety invariants

- `shell_run` uses a strict first-token allow-list + curl flag blocklist
- `file_write` resolves paths and rejects anything outside `$HOME` or `cwd`
- Blobs < 2 KB (≈200 ms of webm/opus) are rejected by the server before
  they reach Groq — prevents accidentally burning quota on thrash artifacts
- `MAX_ROUNDS=4` / `MAX_TOOL_CALLS=8` caps on the tool-calling loop
- `--dangerously-skip-permissions` is ONLY used inside `claude_code_launch`
  (Frank's existing `cla` launcher behaviour — explicit user intent)

## Extension points

| Plug | Where | How |
|---|---|---|
| New persona           | `src/persona.mjs` + `web/client.mjs PERSONA_PALETTES` + `apps/web/.../room-client.tsx PERSONAS` + `/api/ai/speak/route.ts PERSONA_MAP` |
| New tool              | Add OpenAI-shape schema to `TOOLS` + handler + dispatch case in `tools.mjs` |
| New TTS provider      | Add `synthesizeX(text, voiceId)` to `server.mjs`, chain inside `synthesize()` |
| New LLM provider      | Swap `callGroqChat` body; keep the OpenAI-compat interface so tool-calling still works |
| New orb upgrade       | Edit shaders in `apps/web/components/presence/lumina-orb.tsx` (VERT/FRAG/CORE/HALO/SAT) |

## State machine (client)

```
    idle ───── Space/Click ─────▶ listening ─── VAD silence (900ms) ────▶ thinking
     ▲                               │                                     │
     │                      Space up (hold mode)                            │
     │                               ▼                                     ▼
     └──── audio ended ─── speaking ◀──── audio playback ◀── tts_ready ────┘
                              │
                         barge-in detected
                              │
                              ▼
                           listening
```

## Non-goals (deliberate)

- **WebRTC migration.** Sub-500 ms total latency would require it, but
  `fetch` + MediaRecorder + Groq is already <1.5 s end-to-end, which is
  acceptable for a thoughtful-assistant UX over a realtime-chatter UX.
- **Streaming STT.** Groq whisper isn't truly streaming; the full-response
  latency (~400 ms) beats what partial transcripts would buy.
- **Custom turn-detection model.** Nice to have. Silence VAD at 900 ms
  does 90% of the job.
- **Electron/Tauri wrapper.** `--app` mode (Chromium --app flag, per-persona
  user-data-dir) gives the native-window feel with zero build pipeline.

## File map

```
packages/arcanea-voice/
├── bin/voice.mjs                  — CLI; dispatches to server or browser
├── src/
│   ├── persona.mjs                — 7 personas (color, accent, voice, prompt)
│   ├── server.mjs                 — HTTP + static + /api/converse + /api/health
│   ├── tools.mjs                  — 6 tool schemas + executor + safety invariants
│   └── transcribe.mjs             — Groq / local whisper dispatcher
├── web/
│   ├── index.html                 — full-screen orb room
│   ├── client.mjs                 — mic + VAD + push-to-talk + barge-in
│   ├── orb.mjs                    — vanilla three.js particle orb
│   └── style.css                  — dark-room aesthetic
├── test/
│   ├── tools.test.mjs             — 14 tool-dispatch assertions
│   └── server.test.mjs            —  7 HTTP integration assertions
└── docs/
    ├── ARCHITECTURE.md            — this file
    ├── VISION.md                  — why this exists, where it's going
    └── VIBEVOICE.md               — optional local TTS integration path
```
