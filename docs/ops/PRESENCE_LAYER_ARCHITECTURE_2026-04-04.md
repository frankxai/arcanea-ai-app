# Arcanea Presence Layer — Complete Architecture Research

**Date:** 2026-04-04
**Status:** RESEARCH COMPLETE → BUILD PHASE
**Session:** Overnight Multi-Hour Build

---

## Hardware Reality: GTX 1650 4GB

| Tool | Runs? | Quality | Speed |
|------|-------|---------|-------|
| Wav2Lip (lip sync) | YES | 5/10 at 300px | Batch only |
| Groq Whisper (STT) | YES (API) | 9/10 | ~1s |
| Edge-TTS (free MS TTS) | YES (API) | 7/10 | ~200ms |
| ElevenLabs (premium TTS) | YES (API) | 9/10 | ~500ms |
| Screen capture (ffmpeg) | YES | N/A | Instant |
| Claude/Gemini reasoning | YES (API) | 10/10 | ~2-3s |
| ComfyUI (local) | BARELY | SD 1.5 only | 30-60s |
| LivePortrait | NO | - | Needs 6GB+ |
| SadTalker | NO | - | Needs 6-8GB |
| MuseTalk | TECHNICALLY | - | 5 min per 8s |
| Audio2Face | NO | - | Needs RTX 3060+ |
| Any local LLM | NO | - | Needs 8GB+ |

**Architecture: API-first locally, GPU for product.**

---

## API-Powered Pipeline (Works TODAY)

```
You speak → mic (ffmpeg)
    ↓
Groq Whisper API → text (~1s)
    ↓
Claude/Gemini API → reasoning (~2s)
    ↓
ElevenLabs API → voice audio (~500ms)
    ↓
Simli/Hedra API → talking avatar (real-time)
    ↓
Display: browser or OBS overlay
```

Total latency: ~4-5 seconds end-to-end.

---

## Cloud Avatar API Comparison

| Service | Cost/min | Latency | Quality | Best For |
|---------|----------|---------|---------|----------|
| **Simli** | $0.05 | <300ms | 8/10 | Cheapest real-time. YC-backed. |
| **Hedra Live** | $0.05 | <100ms | 8/10 | Fastest latency. Character-3. |
| HeyGen LiveAvatar | ~$0.60 | Low | 9/10 | Highest quality. No free tier. |
| D-ID | $0.60-3.33 | ~1-3s | 7/10 | Established but expensive. |
| **NVIDIA ACE NIM** | FREE (1000 credits) | Low | 9/10 | Free prototype. 3D output. |

**Recommendation:** Start with Simli ($10 free) or Hedra (free tier, 400 credits).

---

## GPU Upgrade Tiers

| GPU | VRAM | Price | Key Unlock |
|-----|------|-------|------------|
| GTX 1650 (current) | 4GB | - | APIs only |
| **RTX 3060** | 12GB | ~$250 used | Everything turns on |
| **RTX 4060 Ti** | 16GB | ~$400 new | Full local stack (sweet spot) |
| RTX 4070 Ti Super | 16GB | ~$750 new | Smooth multi-model |
| RTX 4090 | 24GB | ~$1600 | No compromise |
| RTX 5090 | 32GB | ~$2000 | Future-proof |

---

## NVIDIA Stack

- **NIM (cloud):** 1000 free credits — ACE/Audio2Face/Riva
- **TensorRT:** Works on GTX 1650, 2-5x acceleration
- **Audio2Face:** Needs RTX 3060+, free via Omniverse
- **Broadcast:** RTX 2060+, noise/eye contact/bg removal
- **Maxine SDK:** RTX 2060+, face tracking 68 points

---

## Existing Codebase Assets

| Component | Location | Status |
|-----------|----------|--------|
| TTS Engine (4 providers) | arcaneabot/src/tts/tts.ts | Working |
| Voice Capture Pro | .arcanea/scripts/voice/voice.ps1 | Working |
| Voice Hotkey System | .arcanea/voice/arcanea-voice.ps1 | Working |
| Voice Respond | .arcanea/scripts/voice/voice-respond.ps1 | Working |
| Voice Tray App | .arcanea/scripts/voice/voice-tray.pyw | Working |
| Video Pipeline | content/arcanea-video-pipeline/ | Scaffolded |
| ArcaneaClaw Daemon | ~/arcanea-claw/ | Working |
| ComfyUI MCP | Connected | Working |
| Character Forge | /character-forge skill | Working |
| NFT PFP Engine | /arcanea-nft-pfp skill | Working |

---

## Product Architecture

### Characters
| Character | Avatar Source | Voice | When |
|-----------|-------------|-------|------|
| Lumina | ComfyUI portrait | ElevenLabs cloned | Default companion |
| 10 Guardians | Unique portraits | Unique voices | Gate interactions |
| Frank | Real photo/video | Real voice | Academy, coaching |
| User's own | Character Forge | User-chosen | Social, their worlds |

### Commands That Get Avatars
/arcanea, /guardian, /luminor, /academy, /arcanea-buddy, /pp, /arcanea-council, /lumina, /nero, /god, /forge

---

## Phased Build Plan

### Phase 1: Quick Win (TODAY, $0-10)
- Add screen capture to voice.ps1
- Sign up Simli/Hedra
- Wire: voice → Groq → Claude → ElevenLabs → Simli
- Display in browser

### Phase 2: Agentic Voice (THIS WEEK)
- Voice command parsing
- Screen capture → Gemini multimodal
- Agent dispatch from voice
- SIS vault integration

### Phase 3: Product (2 WEEKS)
- 10 Guardian portraits via ComfyUI
- 10 ElevenLabs voices
- Next.js /presence page + WebRTC
- Integrate with chat system

### Phase 4: Local Power (AFTER GPU)
- MuseTalk + Piper TTS + Whisper local
- NVIDIA Audio2Face for 3D
- TensorRT optimization

### Phase 5: Scale (MONTH+)
- npm @arcanea/presence package
- Avatar marketplace
- Multi-avatar conversations
- User character forge → instant avatar

---

## Licensing Notes
- **LivePortrait:** InsightFace = non-commercial (AVOID for product)
- **MuseTalk:** MIT (SAFE for commercial)
- **SadTalker:** MIT (SAFE but lower quality)
- **Wav2Lip:** Research only (grey area)

---

## Cost Summary

| Path | Upfront | Monthly | What You Get |
|------|---------|---------|--------------|
| API-only (current) | $0 | $5-20 | Working avatar, cloud-dependent |
| RTX 3060 | $250 | $0-5 | Local + APIs for quality |
| RTX 4060 Ti | $400 | $0 | Full local stack, zero ongoing |
| RTX 4090 | $1600 | $0 | Everything simultaneously |
