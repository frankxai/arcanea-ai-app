# Voice Dashboard — `/voice/dashboard`

The voice command center for Arcanea. Multi-modal façade over a single intent bus: **clap, click, voice, ⌘K** all resolve to the same `Intent` object and route through the same dispatcher.

## What it does

| Surface | Capability |
|---|---|
| **Persona Stage** | Animated orb (BR2049-style halo + pulse on clap), live audio meter, persona name in Instrument Serif |
| **Persona Tiles** | 7 Guardians — Lumina, JARVIS, Draconia, Lyria, Alera, Shinkami, Nero. Color-keyed selection. Keyboard-accessible. |
| **Activation Modes** | Click · Voice activation · Double-clap |
| **Adaptive Clap Detection** | Running noise-floor EMA + 50ms attack-time gate + 1-4kHz frequency profile filter. Adapts to ambient noise in ~2s. |
| **Agent Visualizer** | Live registry of 9 Arcanean agents (orchestrators, guardians, specialists). Status dots pulse when agents are working. |
| **Runtime Launcher** | Quick-copy commands for Claude Code, Gemini, Codex, Kilo, OpenCode, AIChat |
| **Workflow Grid** | 12 quick-launch tiles — Author Team, Orchestra, Library, Pulse, SIS, GitHub PRs, etc. Categorized (create/discover/ops/review). |
| **Logic Stream** | Terminal-style scrolling log of every intent — color-coded by trigger (click/clap/voice/palette) |
| **Embedded Viewer** | iframe pane for YouTube search (`yt: query`), web search, GitHub, Vercel, Arcanea routes |
| **Command Palette** | ⌘K — fuzzy search across all personas, workflows, runtimes |
| **Recent Sessions** | localStorage log of summons with trigger + relative time |
| **Mic / Output Selector** | `enumerateDevices()` + `setSinkId()` for full audio routing |

## Architecture

```
voice/dashboard/
├── page.tsx                           Server shell + metadata
├── dashboard-client.tsx               3-column orchestrator
├── audio-utils.ts                     Mic, RMS, freq filter, clap detector, devices, session log
├── lib/
│   ├── intent-bus.ts                  Pub/sub for unified intent routing
│   ├── workflows.ts                   12 workflow definitions + voice triggers
│   ├── agents.ts                      9 agents across 3 tiers
│   └── runtimes.ts                    6 AI coding runtimes
└── components/
    ├── agent-visualizer.tsx           Live agent registry, pulse on activity
    ├── runtime-launcher.tsx           Click-to-copy CLI commands
    ├── workflow-grid.tsx              Filterable workflow tiles
    ├── logic-stream.tsx               Terminal-style intent log
    ├── command-palette.tsx            ⌘K palette
    └── embedded-viewer.tsx            iframe + URL bar + quick tabs
```

## Layout (3 zones)

- **LEFT 320px** — Agent registry · Runtime launcher
- **CENTER flex** — Persona orb · Activation panel · Persona tiles · Devices · Sessions
- **RIGHT 380px** — Workflows · Logic Stream · Embedded Viewer

Aesthetic: **Blade Runner 2049 × Apple Liquid Glass**. Atmospheric haze, refracted glass layers, gold-on-cool-teal tension. Glassmorphism (`bg-white/[0.02..0.05]` with `backdrop-blur-md`), Geist sans + Instrument Serif accent, JetBrains Mono in the Logic Stream.

## Clap-detection algorithm

Adapted from `tom-s/clap-detector` and `web-audio-beat-detector` patterns:

1. **Mic capture** — `getUserMedia` → `AudioContext` → `AnalyserNode` (fftSize 1024, smoothing 0.3).
2. **Noise floor EMA** — every frame below floor*1.5 contributes to a running EMA (alpha 0.008, ~2s tau). Adapts to ambient.
3. **Attack-time gate** — peaks must rise from baseline within 50ms. Speech and music build over 100-200ms; this kills 90% of false-positives without a separate VAD.
4. **Frequency profile** — `getByteFrequencyData` → ratio of energy in 1-4kHz band must exceed `midHighRatio` (default 0.30).
5. **Refractory** — 100ms minimum between clap registrations (suppresses sustain).
6. **Double-clap pattern** — two confirmed claps within `[150ms, 650ms]` triggers the summon.

The sensitivity slider controls the dynamic threshold multiplier (`sensitivity × noiseFloor`), default 4.0× — works in offices and quiet rooms; bump to 5-6 in noisy environments.

## Voice activation (lightweight)

Sustained RMS above 0.08 for 400ms within a 4s debounce window triggers a summon. Not a wake word — just an "I'm talking continuously" trigger. Wake-word ("Hey Lumina") via Picovoice Porcupine or openWakeWord is the next track.

## Intent Bus

```ts
import { emit, subscribe, type Intent } from './lib/intent-bus';

emit({ kind: 'workflow', workflowId: 'pulse', trigger: 'palette', summary: 'Daily pulse' });

subscribe((intent) => {
  console.log(intent.trigger, intent.kind, intent.summary);
});
```

Every UI surface (clap, click, voice, palette, hotkey) pushes the same `Intent` shape. Subscribers (Logic Stream, Agent Visualizer, future SSE bridge) react. This is the architectural lock that makes the dashboard feel coherent instead of fragmented.

## Adding a new workflow

Edit `lib/workflows.ts`:

```ts
{
  id: 'open-something',
  label: 'Something',
  hint: 'What it does',
  voiceTriggers: ['something', 'open something'],
  category: 'discover',
  action: { kind: 'route', href: '/something' },
  color: '#00bcd4',
}
```

Tile auto-renders. Voice triggers and palette match against `label`, `hint`, and `voiceTriggers`.

## Adding a new persona

Edit two files in lock-step:

1. `dashboard-client.tsx` — `PERSONAS` array
2. `packages/arcanea-voice/src/persona.mjs` — `PERSONAS` object (CLI side)

Then ensure `/room/<id>` route exists.

## Adding a new runtime

Edit `lib/runtimes.ts`:

```ts
{
  id: 'my-runtime',
  name: 'My Runtime',
  tagline: 'Brief description',
  color: '#hexcolor',
  command: 'my-runtime',
  hosted: 'https://hosted.url',  // optional
  status: 'ready',  // 'ready' | 'install' | 'planned'
}
```

## Hotkeys

- `⌘K` / `Ctrl+K` — toggle command palette
- `↑ ↓` — navigate palette
- `↵` — execute selected
- `Esc` — close palette

## Known boundaries

- **Browser-only** — clap detection runs in the dashboard tab. Always-on system-wide trigger requires `arcanea-voice daemon` (next track).
- **Some sites refuse iframe embed** — X-Frame-Options DENY/SAMEORIGIN sites (Google, Twitter, most banks). Workflows route those to a new tab via `window.open`.
- **Output device selection (`setSinkId`)** is Chromium-only.
- **Wake-word ("Hey Lumina")** not yet shipped. See research brief in `docs/voice-dashboard-2.0-research.md` for the Picovoice Porcupine vs openWakeWord vs Web Audio + MFCC tradeoff analysis.

## Roadmap

| Track | Status |
|---|---|
| v1: Persona tiles + click/clap activation | ✅ shipped 2026-04-24 |
| v2: 3-column layout, agent viz, workflows, runtimes, embedded viewer, ⌘K palette, adaptive clap | ✅ shipped 2026-04-25 |
| v3: Real SSE feed for agent activity (replaces synthetic mocking) | planned |
| v3: Wake-word "Hey Lumina" via Porcupine | planned |
| v3: Voice intent classification → workflow trigger | planned |
| v4: `arcanea-voice daemon` — always-on system listener | planned |
| v4: LiveKit room integration — voice-to-voice latency under 500ms | planned |

## Credits

Built by the Arcanea Author Team multi-agent dispatch:
- **Researcher** — surveyed the GitHub Jarvis-class landscape
- **Tester** — Playwright QA pass on v1
- **UI/UX Pro Max** — design vision (BR2049 × Liquid Glass)
- **Lore Master** (orchestrator) — synthesis and engineering
