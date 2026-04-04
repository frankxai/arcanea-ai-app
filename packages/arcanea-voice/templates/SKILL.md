---
name: voice
description: "Voice capture, transcription, and coaching for Claude Code. Record voice notes, strategy sessions, agent dispatches, voiceovers. Auto-transcribes via Groq (free) or local Whisper. Routes to Linear, Git, clipboard. Use when: voice recording, transcription, voice note, dictation, standup, commit message by voice."
---

# /voice — Arcanea Voice

Voice production system for Claude Code. Record, transcribe, coach, route.

## Commands

Run via `node node_modules/@arcanea/voice/bin/voice.mjs [mode]` or if globally installed: `voice [mode]`

### Thinking (internal)
- `voice n [sec]` — Quick note (1m default, Ctrl+C stops)
- `voice s [sec]` — Strategy session (5m)
- `voice a [sec]` — Agent dispatch — transcript becomes a prompt (2m)
- `voice r [sec]` — Reading capture 24kHz (10m)

### Publishing (broadcast quality)
- `voice nl [sec]` — Newsletter draft 48kHz (5m)
- `voice v [sec]` — Voiceover 48kHz/24bit (3m)
- `voice c [sec]` — Arcanea content 48kHz/24bit (5m)

### Workflow (routes to tools)
- `voice i` — Create issue from voice (Linear/GitHub)
- `voice t` — Create task
- `voice id` — Capture idea
- `voice su` — Daily standup
- `voice cm` — Commit message by voice

### Manage
- `voice mic` — Show available microphones
- `voice rev` — QC last recording (dB analysis)
- `voice play` — Play last recording
- `voice l` — List recent recordings

## Setup
- Requires: ffmpeg, Node.js 18+
- Optional: `pip install openai-whisper` (local fallback)
- Optional: `pip install edge-tts` (free TTS)
- Set `GROQ_API_KEY` for free cloud transcription (2h/day)
- Set `ELEVENLABS_API_KEY` for premium TTS ($5/mo)

## After Recording
The transcript is on your clipboard. Paste it as your next message to Claude Code.
For agent dispatch mode, the transcript IS the prompt — paste and execute.
