# @arcanea/voice

Voice production system for AI coding agents. Record, transcribe, coach, route.

Works with Claude Code, OpenCode, Cursor, and any terminal. Windows + Mac + Linux.

## Quick Start

```bash
npx @arcanea/voice init          # Set up in current project
npx @arcanea/voice               # Quick voice note
npx @arcanea/voice strategy      # Strategy session
npx @arcanea/voice agent         # Agent dispatch (becomes a prompt)
```

## Features

- **Smart mic detection** - auto-selects best mic (Shure > Studio > Headset > Laptop)
- **7 recording modes** - different quality profiles per intent
- **Groq transcription** - free, instant, whisper-large-v3-turbo (2h/day)
- **Local Whisper fallback** - offline, unlimited
- **Voice coaching** - word count, filler detection, sentence analysis
- **QC for publishing** - dB levels, clipping detection
- **ElevenLabs TTS** - AI coach speaks back (optional, $5/mo)
- **Cross-platform** - Windows, Mac, Linux

## Modes

| Mode | Alias | Quality | Default | Use Case |
|------|-------|---------|---------|----------|
| note | n | 16kHz mono | 60s | Quick thoughts |
| strategy | s | 16kHz mono | 5m | Planning sessions |
| agent | a | 16kHz mono | 2m | Agent instructions |
| reading | r | 24kHz mono | 10m | Source capture |
| newsletter | nl | 48kHz mono | 5m | Publishing drafts |
| voiceover | v | 48kHz/24bit stereo | 3m | Production audio |
| arcanea | c | 48kHz/24bit stereo | 5m | Content assets |

## Setup

### Required
- **ffmpeg** - audio recording (`brew install ffmpeg` / `choco install ffmpeg`)
- **Node.js 18+**

### Optional (recommended)
- **Groq API key** - free transcription: `export GROQ_API_KEY=gsk_xxx`
- **Whisper** - offline fallback: `pip install openai-whisper`
- **ElevenLabs** - premium TTS: `export ELEVENLABS_API_KEY=sk_xxx`
- **Edge TTS** - free TTS: `pip install edge-tts`

## License

MIT
