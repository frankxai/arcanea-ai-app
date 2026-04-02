# Arcanea Voice Capture System

> Your voice is an asset. Capture it. Transcribe it. Route it. Monetize it.

## Quick Start

```powershell
# One-shot recording (30 seconds, Ctrl+C to stop early)
powershell -ExecutionPolicy Bypass -File .arcanea/voice/voice-quick.ps1

# With custom duration
powershell -ExecutionPolicy Bypass -File .arcanea/voice/voice-quick.ps1 60

# Full system with hotkeys (F9=toggle, F10=quick, ESC=exit)
powershell -ExecutionPolicy Bypass -File .arcanea/voice/arcanea-voice.ps1
```

## Setup (one time)

```powershell
# Install whisper for local transcription
pip install openai-whisper

# OR use Groq's free Whisper API (faster, no GPU needed)
# Set GROQ_API_KEY in your environment
```

## What It Does

1. Records your voice (WAV, 16kHz mono — broadcast quality)
2. Transcribes with Whisper (local or Groq API)
3. Routes by content type: book, website, music, idea, voiceover, arcanea-dev
4. Saves audio + transcript + log entry
5. Copies transcript to clipboard

## File Structure

```
.arcanea/voice/
  recordings/          — WAV audio files (keep for voiceovers!)
  transcripts/         — Text transcripts
  voice-log.md         — Running log of all captures
  arcanea-voice.ps1    — Full hotkey system
  voice-quick.ps1      — One-shot recorder
```

## Audio Device

The scripts use "Microphone Array (Realtek(R) Audio)" by default.
If your mic has a different name, find it with:

```powershell
ffmpeg -list_devices true -f dshow -i dummy 2>&1 | Select-String "audio"
```

Then update the device name in the scripts.

## Your Voice is an Asset

- **Voiceovers**: Use recordings for website narration, course content, book audiobooks
- **Content**: Transcripts feed into blog posts, documentation, lore
- **Training**: Your voice patterns can inform Luminor coaching style
- **Monetization**: arcanea.ai voice content, podcast, audio courses
