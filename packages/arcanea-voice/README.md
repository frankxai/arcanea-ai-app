# @arcanea/voice

Voice production system for AI coding agents. Record, transcribe, coach, route.

Works with Claude Code, OpenCode, Cursor, and any terminal. Windows, Mac, Linux.

## Quick Start

```bash
npx @arcanea/voice init     # Set up in current project
npx @arcanea/voice           # Record a voice note
npx @arcanea/voice help      # Show all commands
```

## Commands

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
