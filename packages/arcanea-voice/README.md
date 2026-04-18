# @arcanea/voice

Voice production system for AI coding agents. Record, transcribe, coach,
route — plus a JARVIS-tier **Presence Room** with a god-tier particle
orb, function-calling, and a voice-to-Claude-Code bridge.

Works with Claude Code, OpenCode, Cursor, and any terminal. Windows,
Mac, Linux. Two surfaces share one codebase:

- **Hosted:** `arcanea.ai/room/{persona}` — installable PWA with BYOK
- **Local:** `voice jarvis --local` — on-device server with tool
  execution and a Chromium `--app` window option

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full
picture, [`docs/VISION.md`](./docs/VISION.md) for where it's going, and
[`docs/VIBEVOICE.md`](./docs/VIBEVOICE.md) for the long-form TTS
integration path.

## Quick Start

```bash
npx @arcanea/voice init     # Set up in current project
npx @arcanea/voice           # Record a voice note
npx @arcanea/voice help      # Show all commands
```

## Commands

### Presence (live voice room on localhost)

Spawn a full-screen orb room in your browser — speak, Lumina replies, the
orb reacts to her voice. Zero deploy, zero sign-in, all data stays on your
machine.

| Command | Persona | Notes |
|---|---|---|
| `voice jarvis` | JARVIS — concise assistant | Cyan / white |
| `voice lumina` | Lumina, First Light | Gold / teal (default) |
| `voice draconia` | Draconia, Guardian of Fire | Red / gold |
| `voice lyria` | Lyria, Guardian of Sight | Violet |
| `voice alera` | Alera, Guardian of Voice | Teal |
| `voice shinkami` | Shinkami, the Source | Silver |
| `voice nero` | Nero, Primordial Darkness | Indigo |
| `voice presence` | Lumina (alias) | |

Inside the room: **Space** to speak (auto-stops on silence), **Esc** to
interrupt, **1–7** to switch persona live. Server runs at
`http://127.0.0.1:7777` (override with `ARCANEA_VOICE_PORT`).

### Tools Lumina can use

In local mode the LLM can chain tools across up to 4 rounds per turn (8 total
calls, hard cap). The agent decides autonomously when to invoke them:

| Tool | What it does |
|---|---|
| `shell_run` | Execute a whitelisted command (git, ls, node, pnpm, gh, curl GET…). 10s timeout, 4KB stdout cap. |
| `file_write` | Write a text file under `$HOME` or `cwd`. Creates parent dirs. |
| `claude_prompt` | Stage a prompt on the system clipboard + `~/.arcanea/voice-inbox/`. Paste into Claude Code with Ctrl+V. |
| `claude_code_launch` | **Hands-free.** Same as `claude_prompt` but ALSO spawns a new terminal running `claude --dangerously-skip-permissions "<prompt>"` so the work starts immediately. |
| `open_url` | Open an https URL in the default browser. |
| `linear_issue` | Create a Linear issue via GraphQL. Requires `LINEAR_API_KEY`. |

### Keys + config

Needs `GROQ_API_KEY` for transcription + LLM. `ELEVENLABS_API_KEY` optional
(premium voices for Lumina and Coach). Edge TTS fallback works offline.
Optional overrides:

- `ARCANEA_VOICE_LLM` — Groq model (default `llama-3.3-70b-versatile`). Any Groq
  model that supports the `tools` param works (`moonshotai/kimi-k2-instruct`,
  `openai/gpt-oss-120b`, etc.).
- `ARCANEA_VOICE_PORT` — server port (default `7777`).
- `ARCANEA_CLAUDE_BIN` — path to the `claude` binary if it's not on `PATH`.
- `LINEAR_API_KEY` — raw Linear personal API key (no `Bearer` prefix).

### Tests

```bash
node test/tools.test.mjs
```

Covers: tool schema shape, shell allowlist enforcement, path sandbox, inbox
writes, clipboard fallback, URL scheme validation, linear key guard.

### Thinking (internal, Ctrl+C to stop)
| Command | Alias | Default | Description |
|---------|-------|---------|-------------|
| `voice note` | `n` | 1m | Quick voice note |
| `voice strategy` | `s` | 5m | Strategy session (extracts action items) |
| `voice agent` | `a` | 2m | Agent dispatch (transcript becomes a prompt) |
| `voice reading` | `r` | 10m | Reading capture at 24kHz |

### Publishing (broadcast quality)
| Command | Alias | Default | Description |
|---------|-------|---------|-------------|
| `voice newsletter` | `nl` | 5m | Newsletter draft at 48kHz |
| `voice voiceover` | `v` | 3m | Production voiceover 48kHz/24bit |
| `voice arcanea` | `c` | 5m | Content asset 48kHz/24bit |

### Workflow (routes to tools)
| Command | Alias | Description |
|---------|-------|-------------|
| `voice issue` | `i` | Create issue from voice |
| `voice task` | `t` | Create backlog task |
| `voice idea` | `id` | Capture idea |
| `voice standup` | `su` | Daily standup log |
| `voice commit` | `cm` | Voice-to-commit-message |

### Management
| Command | Description |
|---------|-------------|
| `voice mic` | Show available microphones |
| `voice rev` | QC last recording (dB analysis) |
| `voice play` | Play last recording |
| `voice list` | List recent recordings |

## Features

- **Smart mic detection** — auto-selects best mic (broadcast > studio > headset > laptop)
- **12 recording modes** — different quality profiles per intent
- **Groq transcription** — free, instant, whisper-large-v3-turbo (2h/day)
- **Local Whisper fallback** — offline, unlimited, supports faster-whisper
- **Voice coaching** — word count, filler detection, sentence analysis
- **QC for publishing** — dB levels, clipping detection
- **TTS coach response** — AI speaks back after recording
- **Cross-platform** — Windows, Mac, Linux
- **Zero npm dependencies**

## Requirements

- **Node.js 18+**
- **ffmpeg** — audio recording and analysis
  - Windows: `choco install ffmpeg` or `winget install ffmpeg`
  - Mac: `brew install ffmpeg`
  - Linux: `apt install ffmpeg`

## Optional (recommended)

| Tool | Purpose | Install |
|------|---------|---------|
| Groq API key | Free cloud transcription (2h/day) | [console.groq.com](https://console.groq.com) |
| openai-whisper | Local transcription fallback | `pip install openai-whisper` |
| faster-whisper | Faster local transcription | `pip install faster-whisper` |
| edge-tts | Free TTS coach voice | `pip install edge-tts` |
| ElevenLabs key | Premium TTS voice | [elevenlabs.io](https://elevenlabs.io) |

Set API keys as environment variables:
```bash
export GROQ_API_KEY=gsk_xxx
export ELEVENLABS_API_KEY=sk_xxx
```

## As a Claude Code Skill

Copy `templates/SKILL.md` to `.claude/skills/voice/SKILL.md` in your project. Then use `/voice` in Claude Code conversations.

## API

```javascript
import { detectBestMic, transcribe, speak, analyze } from '@arcanea/voice';

const mic = detectBestMic();
// { name: 'Shure MV6', tier: 'BROADCAST' }

const result = transcribe('/path/to/audio.wav');
// { text: 'Hello world', backend: 'groq' }

const coaching = analyze(result.text);
// { wc: 12, sentences: 2, fillers: 0, richness: 83 }

speak('Recording complete. Zero fillers.', { persona: 'lumina' });
// Plays TTS via best available backend
```

## Disclaimer

This package is a voice recording and transcription tool. It uses third-party APIs (Groq, ElevenLabs, OpenAI) when configured by the user. Users are responsible for:

- Their own API key management and costs
- Compliance with recording consent laws in their jurisdiction
- Content generated through the tool
- Securing their API keys (never commit them to version control)

The package itself does not store, transmit, or process audio data beyond what the user explicitly configures. All recordings stay on the user's local machine unless they configure cloud transcription.

## License

MIT - See [LICENSE](LICENSE)

## Part of the Arcanea Ecosystem

[arcanea.ai](https://arcanea.ai) — The Creative Multiverse
