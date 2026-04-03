# Arcanea Voice OS — Full Spec

## Overview
Intent-aware voice capture with leader-key binds, mode-specific audio profiles,
quality analysis, transcript coaching, and content routing.
Not a recorder — a voice operating system.

## File Locations (corrected)
- **Scripts (tools)**: `.arcanea/scripts/voice/` — agentic infrastructure
- **Recordings (assets)**: `content/voice/{mode}/` — user content, not config
- **Transcripts**: `content/voice/transcripts/{mode}/` — publishable content
- **QC Reports**: `.arcanea/reports/voice/` — analysis output
- **Voice Log**: `content/voice/voice-log.md` — content index
- **Specs**: `.arcanea/projects/specs/` — this file (correct)

## Recording Modes

| Mode | Hotkey | Sample Rate | Channels | Post-Processing |
|------|--------|------------|----------|-----------------|
| Voice Note | Ctrl+F9 | 16kHz | Mono | Transcribe → clipboard → voice-log |
| Book Reading | Ctrl+F10 | 48kHz | Stereo | Transcribe → /book/ collection → audiobook queue |
| Strategy Session | Ctrl+F11 | 16kHz | Mono | Transcribe → .arcanea/projects/ → extract actions |
| Agent Instruction | Ctrl+F12 | 16kHz | Mono | Transcribe → format as prompt → feed to agent |
| Newsletter | Alt+F9 | 48kHz | Stereo | Transcribe → polish → frankx.ai/substack staging |
| Voiceover | Alt+F10 | 48kHz | Stereo | Save broadcast → quality check → production queue |
| Arcanea Content | Alt+F11 | 48kHz | Stereo | Transcribe → content system → voice asset library |

## Audio Quality Analysis (ffmpeg-based, no extra tools)

```bash
# Analyze audio levels, noise floor, clipping
ffmpeg -i input.wav -af "volumedetect" -f null /dev/null
ffmpeg -i input.wav -af "silencedetect=n=-30dB:d=0.5" -f null /dev/null
ffmpeg -i input.wav -af "astats=metadata=1:reset=1" -f null /dev/null
```

Metrics to capture:
- **Peak level** — should be -3dB to -6dB (not clipping)
- **Mean volume** — should be -18dB to -14dB (broadcast standard)
- **Noise floor** — should be below -50dB
- **Silence ratio** — flag if >30% silence (hesitation/pauses)
- **Clipping** — flag any samples at 0dBFS

## Voice Coaching (transcript analysis)

Analyze transcripts for:
- **Filler words**: "um", "uh", "like", "you know", "basically", "so"
- **Sentence length**: Average words per sentence (target: 12-18 for voiceover)
- **Vocabulary richness**: unique words / total words ratio
- **Pacing indicators**: sentence count per minute from audio duration
- **Repeated phrases**: detect verbal tics
- **Arcanean voice alignment**: check for canon terms, proper Guardian/Gate names

Coach output example:
```
Voice Analysis — voice_2026-04-02_21-30-00.wav
  Duration: 2m 15s | Words: 340 | Pace: 151 wpm (good)
  Quality: Peak -4.2dB | Noise -58dB | No clipping
  Fillers: 3 ("like" x2, "basically" x1) — 0.9% (excellent)
  Sentence avg: 14 words (broadcast-ready)
  Verdict: PUBLISH-READY
```

## File Organization

```
.arcanea/voice/
  recordings/
    notes/           — quick voice notes (16kHz)
    books/           — book readings (48kHz broadcast)
    strategy/        — strategy sessions
    agents/          — agent instructions
    newsletter/      — substack/frankx.ai content
    voiceover/       — production voiceovers
    arcanea/         — arcanea content system
  transcripts/       — all transcripts (mirrored structure)
  voice-log.md       — running capture log
  quality-reports/   — ffmpeg analysis reports
```

## Transcription Pipeline

1. Record → WAV file saved to mode-specific folder
2. Transcribe → Groq API (primary) or local Whisper (fallback)
3. Analyze → ffmpeg audio quality + transcript coaching
4. Route → based on mode, file goes to the right destination
5. Log → entry in voice-log.md with mode, quality score, transcript
6. Clipboard → transcript copied for immediate use

## Integration Points

- **Buddy system**: Voice recordings earn Voice skill XP (Alera's Gate)
- **Content pipeline**: Newsletter mode feeds into frankx.ai/substack publish flow
- **Book system**: Book reading mode feeds into /book/ audiobook production
- **Agent system**: Agent instruction mode formats transcript as prompt
- **SIS**: Voice activity shows in statusline
- **Luminor coaching**: Teaching bubble on voice quality after each recording

## Tech Stack

- **Recording**: ffmpeg + Shure MV6 (already working)
- **Transcription**: Groq Whisper API (free, instant) + local whisper (fallback)
- **Analysis**: ffmpeg astats/volumedetect/silencedetect
- **Coaching**: Text analysis in the PowerShell script
- **No extra dependencies** beyond what's already installed

## Build Priority

1. Multi-mode recording with hotkeys (the PowerShell script)
2. Audio quality analysis (ffmpeg one-liners)
3. Transcript coaching (filler word detection, pacing)
4. Mode-specific routing (folder structure + log tags)
5. Buddy integration (Voice skill XP)
6. Content pipeline integration (newsletter/book flows)
