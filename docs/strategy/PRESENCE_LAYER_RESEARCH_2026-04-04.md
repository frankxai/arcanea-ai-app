# Arcanea Presence Layer — Complete Research (2026-04-04)

> Strategic research for AI avatars, voice orchestration, GPU capabilities, and the Presence Layer product vision.

---

## 1. Current Hardware

- **GPU**: GTX 1650 Max-Q (4GB GDDR5, 896 CUDA cores, NO Tensor Cores, 128 GB/s)
- **RAM**: 16GB
- **OS**: Windows 11 Home
- **Mic**: Shure MV6 (broadcast tier)

## 2. Existing Voice Infrastructure

### Core Voice Package
- `packages/arcanea-voice/` — NPM `@arcanea/voice` v0.1.0 (bin/voice.mjs entry, src/ empty)
- `.arcanea/scripts/voice/voice.ps1` — Premium Voice v3: 7 modes, smart mic detection, Groq+ElevenLabs
- `.arcanea/scripts/voice/voice-respond.ps1` — TTS response pipeline
- `.arcanea/scripts/voice/voice-tray.pyw` — System tray always-on
- `.arcanea/voice/arcanea-voice.ps1` — F9 hotkey system with content routing

### TTS Engine (4 Providers)
- `arcaneabot/src/tts/tts.ts` — ElevenLabs, OpenAI (gpt-4o-mini-tts), Edge-TTS, Sherpa-ONNX
- Default ElevenLabs voice: `pMsXgVXv3BLzUgSXRplE`, model: `eleven_multilingual_v2`
- Edge-TTS default: `en-US-MichelleNeural`

### STT Systems
- Groq Whisper API (whisper-large-v3-turbo) — FREE, already integrated
- Local Whisper skill at `arcaneabot/skills/openai-whisper/`
- OpenAI Whisper API at `arcaneabot/skills/openai-whisper-api/`

### Video & Media
- `content/arcanea-video-pipeline/` — Full video processing infrastructure
- `apps/web/app/api/ai/generate-video/` — Next.js API route
- `packages/media/` — sharp + ffmpeg processing
- `~/arcanea-claw/` — Python media daemon (scan → classify → process → upload)
- `arcaneabot/skills/video-frames/` — ffmpeg frame extraction

### Voice Data
- `content/voice/` — Recordings organized by mode (notes, strategy, agents, etc.)
- `content/voice/tts-test/` — 8 voice samples (Andrew, Ava, Brian, Charlie, Daniel, George, Roger, Sarah)

---

## 3. Local Avatar Tech — Verified VRAM Requirements

### Runs on GTX 1650 4GB:

| Tool | VRAM | Quality | Speed | License | Install |
|------|------|---------|-------|---------|---------|
| **Wav2Lip** | ~1.5GB at 300px | 5/10 | Batch only | Non-commercial (research). Commercial via Sync Labs. | `git clone Rudrabha/Wav2Lip` |
| **Piper TTS** | ~0.3GB ONNX | 7/10 | Real-time | MIT | `pip install piper-tts` |
| **Edge-TTS** | 0 (API) | 7/10 | ~200ms | Free Microsoft service | `pip install edge-tts` |
| **Whisper.cpp tiny/base** | ~0.5GB | 6/10 | Near real-time | MIT | `winget install whisper-cpp` |
| **OpenCV face detection** | ~0.2GB | 6/10 | Real-time | Apache 2.0 | `pip install opencv-python` |

### Does NOT run on GTX 1650 4GB:

| Tool | Min VRAM | Quality | License | Notes |
|------|----------|---------|---------|-------|
| **LivePortrait** | 6GB+ | 9/10 | Apache 2.0 (BUT InsightFace = non-commercial) | GitHub #136 confirmed |
| **SadTalker** | 6-8GB | 7/10 | MIT | OOM at 6GB per GitHub #118 |
| **MuseTalk** | 4GB (5min/8sec) | 8/10 | MIT (commercial OK) | Technically loads but unusable speed |
| **Audio2Face** | 12GB RTX 3060+ | 9/10 (3D) | Free (Omniverse) | Completely incompatible |
| **EchoMimic** | 6-8GB | 8/10 | Apache 2.0 | Low VRAM mode still needs 6GB |
| **NVIDIA Broadcast** | RTX 2060+ | 8/10 | Free with RTX | Needs Tensor Cores |
| **NVIDIA Maxine** | RTX 2060+ | 8/10 | Free for dev | Needs RTX architecture |

---

## 4. Cloud Avatar APIs

| Service | Cost/min | Latency | Quality | Free Tier | Best For |
|---------|----------|---------|---------|-----------|----------|
| **Simli** | $0.05 | <300ms | 8/10 | $10 credits | Cheapest real-time |
| **Hedra Live** | $0.05 | <100ms | 8/10 | 400 credits (free plan) | Fastest latency |
| **HeyGen LiveAvatar** | ~$0.60 | Low | 9/10 | None (pay-as-you-go) | Highest quality |
| **D-ID** | $0.60-3.33 | 1-3s | 7/10 | Lite $5.99/mo (10 min) | Established player |
| **NVIDIA ACE NIM** | FREE | Low | 9/10 | 1000 credits | Full stack prototype |

---

## 5. GPU Upgrade Analysis

### Tier Map

| GPU | VRAM | Price | Bandwidth | Tensor Cores | What It Unlocks |
|-----|------|-------|-----------|-------------|-----------------|
| GTX 1650 (current) | 4GB | - | 128 GB/s | None | APIs only, Wav2Lip low-res |
| RTX 3060 | 12GB | ~$250 used | 360 GB/s | 3rd Gen (112) | LivePortrait, MuseTalk, SadTalker, Audio2Face, SD 1.5, 7B LLM Q4 |
| RTX 4060 Ti | 16GB | ~$400 new | 288 GB/s | 4th Gen (136) | Simultaneous avatar stack, 13B LLM Q4, SDXL |
| RTX 4070 Ti Super | 16GB | ~$750 new | 672 GB/s | 4th Gen | Same VRAM, 2x bandwidth — smooth multi-model |
| RTX 4090 | 24GB | ~$1600 | 1,008 GB/s | 4th Gen (512) | Everything simultaneously, 70B Q4 (tight) |
| RTX 5090 | 32GB | ~$2000 | ~1,790 GB/s | 5th Gen (FP4) | Future-proof, all models |

### Sweet Spot: RTX 4060 Ti 16GB ($400)
First tier where full local avatar stack runs simultaneously:
- MuseTalk (3GB) + Piper (0.5GB) + Whisper (1GB) + 7B LLM Q4 (5GB) + overhead (1.5GB) = ~11GB

### eGPU Option
- Sonnet Breakaway 750 + RTX 4060 Ti: ~$750 total, ~85-90% native performance
- Plugable TBT5-AI + RTX 4090: ~$2200, ~90-95% (TB5)
- Requires Thunderbolt 3/4/USB4 port on laptop

---

## 6. NVIDIA Technology Stack

| Tech | Avatar Role | Free? | Min GPU | Notes |
|------|------------|-------|---------|-------|
| NIM (cloud) | Full ACE pipeline via API | 1000 free credits | None (cloud) | build.nvidia.com |
| NIM (self-host) | Local model serving in Docker | 90-day eval | RTX 3060+ (WSL2) | nvcr.io containers |
| TensorRT | Accelerate models 2-5x | Yes | GTX 1650+ | pip install tensorrt |
| Audio2Face | Audio → 3D face blendshapes | Yes (individual) | RTX 3060 12GB | Omniverse platform |
| Broadcast | Noise removal, eye contact, bg | Yes (RTX) | RTX 2060+ | Consumer app |
| Maxine Video Effects SDK | Face tracking (68 pts), gaze | Yes (dev) | RTX 2060+ | Developer SDK |
| Maxine AR SDK | Body pose, hand, face mesh | Yes (dev) | RTX 2060+ | Developer SDK |
| Maxine Live Portrait | Animate photo with webcam | Yes (dev) | RTX GPU | Coming Spring 2026 |
| Riva | ASR + TTS | Via NIM | RTX 3060+ | Speech pipeline |
| Jetson Orin Nano | Dedicated AI box (8GB, 40 TOPS) | $249 hardware | Self-contained | Always-on, low power |

---

## 7. Cloud GPU Pricing (For Product Scale)

| Provider | GPU | $/hr | Notes |
|----------|-----|------|-------|
| Vast.ai | L40 (48GB) | $0.31 | Best value for inference |
| RunPod | T4 (16GB) | $0.40 | Light inference |
| Vast.ai | A100 (40GB) | $0.52 | Cheapest A100 |
| RunPod | A100 (40GB) | $0.60 | More reliable |
| RunPod | H100 (80GB) | $1.50 | Maximum performance |

---

## 8. Character Hierarchy for Avatars

### Primary Characters (Avatar Priority)

| Character | Role | When Users See Them | Voice | Visual Style |
|-----------|------|---------------------|-------|-------------|
| **Arcanea** | The world itself. The meta-intelligence. | System-level interactions, onboarding, world navigation | Ethereal, layered, neither male nor female | Cosmic, shifting, crystalline — the angular A mark animated |
| **Lumina** | First Light. Creation guide. Chat default. | Chat conversations, creative guidance, manifestation | Warm, clear, encouraging | Radiant, golden-white, feminine divine |
| **Nero** | Primordial Darkness. Debug/depth. | Deep analysis, debugging, shadow work | Deep, resonant, contemplative | Dark, starfield, potential |
| **10 Guardians** | Gate-specific coaches | Gate interactions, domain expertise | Each unique | Each unique per canon |
| **10 Godbeasts** | Sacred companions | Advanced interactions, rare appearances | Creature sounds + speech | Mythical creature designs |
| **Frank** | The founder | Academy, coaching, announcements | Real voice | Real photo/video |
| **User's Own** | Their character | Social profiles, their worlds | User-chosen | Character Forge output |

### Arcanea as the Main Character

Arcanea IS the world speaking. Not a person — an intelligence. The crystalline A mark comes alive.
- Arcanea appears at system level: navigation, world selection, meta-guidance
- Lumina appears within creation: chat, imagine, build
- Guardians appear within their Gates

---

## 9. Existing Skills & Commands That Connect

### Already Built:
- `/arcanea` — Lumina chat persona
- `/guardian` — Channel specific Guardian
- `/luminor` — Channel a Gate
- `/academy` — Ten Gates journey
- `/arcanea-buddy` — Vel'Tara companion
- `/pp` — Peak Performance (Shinkami)
- `/arcanea-council` — Council activation
- `/lumina` — First Light
- `/nero` — Primordial Darkness
- `/god` — Quick deity invocation
- `/forge` — Media generation
- `/character-forge` — Character creation
- `/arcanea-nft-pfp` — Portrait generation

### Commands to Build:
```
voice avatar start              # Start avatar mode
voice avatar --character arcanea # Main character
voice avatar --character lumina  # Creation guide
voice avatar --cloud simli      # Cloud rendering
voice screen                    # Screen capture for multimodal
voice dispatch "fix the build"  # Agent dispatch from voice
```

---

## 10. Phased Build Plan

| Phase | Timeline | Cost | Deliverable |
|-------|----------|------|------------|
| 1: Quick Win | Today | $0-10 | Arcanea talks back via Simli + voice pipeline |
| 2: Agentic | This week | $0 | Voice-controlled coding, screen awareness |
| 3: Product | 2 weeks | Cloud APIs | arcanea.ai/presence — users talk to Guardians |
| 4: Local Power | After GPU upgrade | $250-400 | Full offline avatar, zero API cost |
| 5: Scale | Month+ | - | npm @arcanea/presence, avatar marketplace |

---

## 11. Licensing Warnings

- **LivePortrait**: Code is Apache 2.0 but uses InsightFace models (NON-COMMERCIAL research only). Trap for product use.
- **Wav2Lip**: Non-commercial for open-source version. Commercial requires Sync Labs API.
- **MuseTalk**: MIT — fully commercial safe. RECOMMENDED for product.
- **SadTalker**: MIT — commercial safe but lower quality.
- **EchoMimic**: Apache 2.0 — commercial safe.

---

*Generated by Arcanea Intelligence System, 2026-04-04*
