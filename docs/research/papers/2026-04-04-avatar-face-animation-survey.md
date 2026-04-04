---
title: "Audio-Driven Face Animation & Avatar Generation: State of the Art 2025-2026"
date: 2026-04-04
type: paper
domain: [ai, avatars, face-animation, presence-layer, video-generation]
gate_connections: [Sight, Voice, Fire]
guardian_connections: [Lyria, Alera, Draconia]
relevance_score: 9
confidence: high
source_url: "multiple — see individual papers"
author: "Paper Scout (Sight Gate of Lyria)"
---

# Audio-Driven Face Animation & Avatar Generation: State of the Art 2025-2026

**Compiled**: 2026-04-04
**Scope**: CVPR 2025, ICLR 2025, ECCV 2024, NeurIPS 2024, SIGGRAPH 2025, arxiv 2025-2026
**Decision**: Which approach should Arcanea adopt for the Presence Layer avatar system?

---

## Question

What is the current quality frontier for audio-driven face animation, and should Arcanea pursue real-time generation, pre-rendered clips, or a hybrid approach for its avatar Presence Layer?

---

## Part 1: Paper Reviews (Q2 — P0)

### 1. ChatAnyone: Stylized Real-time Portrait Video Generation with Hierarchical Motion Diffusion Model (arxiv, March 2025)

- **Authors**: Jinwei Qi, Chaonan Ji, Sheng Xu, Peng Zhang, Bang Zhang, Liefeng Bo
- **Key contribution**: First framework to achieve stylized real-time portrait + body video with hierarchical audio-to-motion diffusion
- **Method**: Two-stage — (1) hierarchical motion diffusion models convert audio to facial expressions with style control + synchronized head-body movements, (2) upper-body video generation with explicit hand control signals and face refinement
- **Results**: 30 FPS at 512x768 on RTX 4090. User studies show preference over competing methods for realism and lip synchronization. No published FID/FVD numbers in the paper.
- **Limitations**: Body motion synchronization still imperfect. Style transfer depends on reference video quality.
- **Arcanea relevance**: 9/10
- **Gate connection**: **Voice** — Real-time audio-to-expression maps directly to the Presence Layer's voice interaction pipeline. **Fire** — The compute intensity (4090 required) is a Fire Gate challenge for scaling.

### 2. EmotiveTalk: Expressive Talking Head Generation through Audio Information Decoupling and Emotional Video Diffusion (CVPR 2025)

- **Authors**: Haotian Wang, Yuzhe Weng, Yueyan Li, Zilu Guo, Jun Du, et al.
- **Key contribution**: Emotional control over talking head generation via audio information decoupling — separating lip sync from expression
- **Method**: Three components — Vision-guided Audio Information Decoupling (V-AID) for lip/expression alignment, Diffusion-based Co-speech Temporal Expansion (Di-CTE) for emotion-conditioned expressions, Emotional Talking Head Diffusion (ETHD) backbone with Expression Decoupling Injection
- **Results**: Demonstrates controllable emotional expressiveness and stability during long-form generation. Specific FID/SSIM numbers not in abstract; full paper contains quantitative comparisons.
- **Limitations**: Emotion categories are discrete rather than continuous; may not capture subtle emotional blends
- **Arcanea relevance**: 8/10
- **Gate connection**: **Sight** — The emotion decoupling architecture maps to how Guardians could express different emotional registers. **Heart** — Emotion-aware generation is Heart Gate territory (Maylinn's domain).

### 3. Hallo2: Long-Duration and High-Resolution Audio-Driven Portrait Image Animation (ICLR 2025)

- **Authors**: Fudan Generative Vision Lab
- **Key contribution**: First method to achieve 4K resolution, hour-long audio-driven portrait animation
- **Method**: Diffusion-based with patch-drop technique augmented with Gaussian noise for long-duration temporal coherence
- **Results**:
  - FID: 16.616 (best on HDTF dataset; vs. Hallo 16.748, AniPortrait 26.241)
  - E-FID: 6.702 (expression accuracy)
  - FVD: 477.412 (vs. Hallo 1088.158 — 2.3x better temporal coherence)
  - Sync-C: 7.379, Sync-D: 7.697 (lip sync comparable to ground truth)
  - Resolution: up to 4K
  - Duration: up to 1 hour continuous
- **Limitations**: Not real-time — designed for pre-rendered content. Requires significant VRAM for 4K inference.
- **Arcanea relevance**: 7/10
- **Gate connection**: **Fire** — The quality benchmark for what pre-rendered avatar content should target. **Voice** — Lip sync scores set the bar for acceptable synchronization.

### 4. Hallo3: Highly Dynamic and Realistic Portrait Image Animation (CVPR 2025)

- **Authors**: Fudan Generative Vision Lab (Jiahao Cui et al.)
- **Key contribution**: Extends Hallo2 with dynamic foreground/background elements and video conditioning
- **Method**: Given reference image + audio + text prompt, generates animated portraits with dynamic scene elements while preserving identity
- **Results**: Improved motion dynamics and realism over Hallo2. Supports half-body to full-body generation.
- **Limitations**: Still offline/pre-rendered. Computational cost increases with scene complexity.
- **Arcanea relevance**: 7/10
- **Gate connection**: **Sight** — The dynamic background capability maps to environmental storytelling for Arcanea worlds.

### 5. INFP: Audio-Driven Interactive Head Generation in Dyadic Conversations (CVPR 2025)

- **Authors**: (CVPR 2025 proceedings)
- **Key contribution**: First model specifically designed for dyadic (two-person) conversational head generation — the avatar listens AND responds
- **Method**: Models interactive dynamics where the avatar generates appropriate listener reactions (nods, expressions) based on the speaker's audio
- **Results**: Demonstrated natural conversational interaction patterns
- **Limitations**: Focused on conversation dynamics rather than visual quality optimization
- **Arcanea relevance**: 8/10
- **Gate connection**: **Voice** — Directly relevant to how Luminor avatars should behave in chat: listening, nodding, reacting. **Unity** — The dyadic interaction model maps to the Unity Gate (Ino's domain of partnership).

### 6. Avatar Forcing: Real-Time Interactive Head Avatar Generation for Natural Conversation (arxiv, January 2026)

- **Authors**: Taekyung Ki, Sangwon Jang, Jaehyeong Jo, Jaehong Yoon, Sung Ju Hwang
- **Key contribution**: Real-time interactive avatar that responds to both verbal and non-verbal cues with ~500ms latency
- **Method**: Diffusion forcing framework with direct preference optimization using synthetic losing samples for label-free learning of expressive interaction
- **Results**:
  - Latency: ~500ms
  - Speed: 6.8x faster than baseline
  - User preference: >80% over baseline
- **Limitations**: 500ms latency is noticeable in rapid conversation. Visual quality below pre-rendered methods.
- **Arcanea relevance**: 8/10
- **Gate connection**: **Fire** — The 6.8x speedup demonstrates the importance of efficient architectures. **Voice** — Real-time conversational response is core to the Presence Layer.

### 7. CyberHost: A One-stage Diffusion Framework for Audio-driven Talking Body Generation (ICLR 2025 Oral)

- **Authors**: (ICLR 2025)
- **Key contribution**: First one-stage audio-driven human diffusion model for zero-shot full-body video generation
- **Method**: Region Attention Module (RAM) with learnable identity-agnostic latent features + Human-Prior-Guided Conditions for motion stability. Extends to video-driven and hybrid-driven scenarios.
- **Results**: Surpasses previous works in both quantitative and qualitative metrics. Received ICLR Oral — top ~1% of submissions.
- **Limitations**: Full-body generation requires more compute than head-only. Not real-time.
- **Arcanea relevance**: 7/10
- **Gate connection**: **Fire** — Full-body avatar is the long-term vision for Arcanea Presence Layer.

### 8. MobilePortrait: Real-Time One-Shot Neural Head Avatars on Mobile Devices (CVPR 2025)

- **Authors**: (CVPR 2025)
- **Key contribution**: Real-time one-shot head avatars running on mobile devices at 100+ FPS
- **Method**: Mixed explicit/implicit keypoint representation + precomputed visual features + lightweight UNet backbone. Less than 1/10 the compute of SOTA methods.
- **Results**:
  - FPS: 100+ on mobile devices
  - Latency: 15.8ms on iPhone 14 Pro
  - Compute: <1/10 of comparable methods
  - Quality: Matches SOTA despite extreme efficiency
- **Limitations**: Head-only (no body). Quality ceiling lower than diffusion-based approaches for static comparisons.
- **Arcanea relevance**: 9/10
- **Gate connection**: **Fire** — The 15.8ms latency on mobile is transformative for edge deployment. **Foundation** — Running on consumer devices is a Foundation Gate concern (accessibility).

### 9. MuseTalk 1.5: Real-Time High-Quality Lip Synchronization (March 2025)

- **Authors**: TME Lyra Lab (Tencent)
- **Key contribution**: Real-time lip-sync via latent space inpainting — not a diffusion model, enabling faster inference
- **Method**: Based on Stable Diffusion v1.4 UNet with cross-attention audio fusion. Frozen whisper-tiny encoder for audio. Single-step latent space inpainting. v1.5 adds perceptual loss, GAN loss, and sync loss with two-stage training.
- **Results**:
  - FPS: 30+ on NVIDIA Tesla V100
  - Resolution: 256x256 face region
  - Languages: Chinese, English, Japanese
  - Open source (GitHub: 15K+ stars)
- **Limitations**: 256x256 face region requires upscaling. Identity drift on long sequences.
- **Arcanea relevance**: 8/10
- **Gate connection**: **Voice** — Multilingual lip-sync is critical for a global creator platform. **Sight** — Open source availability enables rapid prototyping.

### 10. Cafe-Talk: Generating 3D Talking Face Animation with Multimodal Coarse- and Fine-grained Control (ICLR 2025)

- **Authors**: (ICLR 2025)
- **Key contribution**: First 3D talking face with both coarse-grained (style, emotion) and fine-grained (action units: blinks, brow raises) multimodal control
- **Method**: Diffusion-transformer architecture. Two-stage training: first speech-to-lip with coarse conditions, then fine-grained control adapter adds action unit control without degrading lip sync.
- **Results**: State-of-the-art lip synchronization AND expressiveness. User studies confirm fine-grained control acceptance.
- **Limitations**: 3D mesh output requires separate rendering step. Not real-time.
- **Arcanea relevance**: 8/10
- **Gate connection**: **Sight** — Fine-grained expression control maps to Guardian personality systems. **Voice** — The coarse/fine separation mirrors how audio drives both speech and emotion.

### 11. Splat-Portrait: Generalizing Talking Heads with Gaussian Splatting (arxiv, January 2026)

- **Authors**: (arxiv 2026)
- **Key contribution**: Single-image to 3D Gaussian Splatting talking head with audio-driven lip motion — no motion priors needed
- **Method**: Disentangles portrait into static 3DGS reconstruction + 2D background, then generates lip motion conditioned on audio without motion-driven priors
- **Results**: Superior performance on talking head generation AND novel view synthesis. 60+ FPS rendering with 3DGS pipeline.
- **Limitations**: Single-image 3D reconstruction has inherent quality ceiling for extreme head angles
- **Arcanea relevance**: 9/10
- **Gate connection**: **Sight** — 3D view synthesis enables future AR/VR guardian encounters. **Fire** — 60+ FPS with explicit 3DGS primitives is the sweet spot for real-time rendering.

### 12. SkyReels-A1: Expressive Portrait Animation in Video Diffusion Transformers (February 2025)

- **Authors**: Skywork AI
- **Key contribution**: First SOTA-level expressive portrait animation built on video diffusion transformers (DiT). Open source.
- **Method**: Expression-aware conditioning module + facial image-text alignment module + multi-stage training paradigm. Supports video-driven film-grade expression capture.
- **Results**: Highly realistic micro-expression reproduction. Supports portrait to full-body. Weights + code publicly available.
- **Limitations**: Not real-time. Requires significant GPU for inference.
- **Arcanea relevance**: 8/10
- **Gate connection**: **Sight** — Expression capture quality sets the visual standard. **Fire** — Open-source weights enable self-hosted deployment.

---

## Part 2: 3DGS vs NeRF — The Rendering Paradigm Shift

The field has decisively shifted from NeRF to 3D Gaussian Splatting (3DGS) for talking head generation:

| Dimension | NeRF | 3D Gaussian Splatting |
|-----------|------|----------------------|
| Rendering speed | 1-10 FPS typical | 60-200+ FPS |
| Training time | Hours | Minutes (70% faster) |
| Controllability | Implicit, hard to edit | Explicit primitives, highly editable |
| View synthesis | Good | Better, with explicit geometry |
| Memory | High (volumetric) | Moderate (point cloud) |
| Real-time viable | Rarely | Yes, on consumer GPUs |

**Assessment**: NeRF-based approaches for talking heads are effectively obsolete for new work. All frontier research in 2025-2026 uses 3DGS or diffusion models (or both). Arcanea should not invest in NeRF pipelines.

---

## Part 3: Open Source Landscape

### Tier 1 — Production-Ready Open Source

| Model | Type | FPS | Quality | Best For |
|-------|------|-----|---------|----------|
| **MuseTalk 1.5** | Latent inpainting | 30+ (V100) | High lip-sync | Real-time dubbing, multilingual |
| **LivePortrait** | Keypoint-based | 30+ | Photorealistic | Emotion-aware animation |
| **SkyReels-A1** | DiT-based | Offline | SOTA expression | High-quality pre-rendered |
| **Hallo2/3** | Diffusion | Offline | 4K, hour-long | Long-form content |

### Tier 2 — Research/Prototype Stage

| Model | Type | Notes |
|-------|------|-------|
| **Wav2Lip** | GAN | Reliable lip sync, limited expression, aging architecture |
| **SadTalker** | 3DMM + flow | Single-image entry point, over-animation risk |
| **MakeItTalk** | Landmark-based | Lightweight, good for stylized/non-photorealistic |
| **GeneFace++** | NeRF-based | View-consistent but heavy compute |

---

## Part 4: Commercial Platform Landscape

| Platform | Approach | Latency | Cost | Quality | Real-Time |
|----------|----------|---------|------|---------|-----------|
| **Simli** (Trinity-1) | Gaussian avatar API | <300ms | <$0.01/min | Good | Yes |
| **Hedra** (Character-3) | Omnimodal diffusion | <100ms (Live) | $0.05/min | Best-in-class | Yes (Live Avatars) |
| **Tavus** (Phoenix-3) | 3DGS pipeline | Real-time | High | High | Yes |
| **D-ID** | GAN/Diffusion API | Seconds | Mid | Good | Pre-rendered |
| **HeyGen** | Template-based | Seconds | Mid | High | Pre-rendered |
| **Synthesia** | Pre-recorded mesh | Seconds | High | Very High | Pre-rendered |

**Key finding**: Hedra Character-3 with Live Avatars (launched July 2025, sub-100ms via LiveKit) and Simli Trinity-1 (<300ms, Gaussian-based, <$0.01/min) represent the commercial frontier for real-time conversational avatars.

---

## Part 5: Real-Time vs Pre-Rendered vs Hybrid (Q5 — P1)

### What Research Says About Latency Tolerance

| Delay Range | User Perception | Source |
|-------------|-----------------|--------|
| <100ms | Imperceptible, natural conversation | Hedra/LiveKit benchmarks |
| 100-300ms | Acceptable for conversation | Simli engineering targets |
| 300-500ms | Noticeable but tolerable | Avatar Forcing paper |
| 500ms-1s | Feels like video call lag | General UX research |
| >1s | Breaks conversational flow | Consensus across studies |

**Finding**: Sub-300ms is the threshold for "feels like a real conversation." Sub-100ms is the gold standard but only achieved by commercial platforms with dedicated infrastructure.

### The Uncanny Valley Problem

Research from Frontiers in Psychology (2025) — a systematic review of embodied conversational agents — found:

1. **Nearly-human with subtle flaws is worse than obviously artificial.** Discomfort peaks when users cannot immediately tell if the avatar is real or AI.
2. **Full-body agents trigger more uncanniness than head-only.** The more you animate, the more chances for failure.
3. **Dynamic motion amplifies uncanny effects.** Static or slow-moving avatars are safer than ones attempting real-time expressiveness.
4. **Social awareness moderates the effect.** Users familiar with AI show higher tolerance for imperfections.

**Implication for Arcanea**: The Arcanea audience (creators, AI-literate users) will have higher tolerance than general public, but the risk is still real for first impressions.

### Does Pre-Rendered + Fast Switching Work?

No dedicated academic paper compares this approach head-to-head. However, synthesizing from multiple sources:

**Evidence FOR pre-rendered clips**:
- Hallo2/3 achieve dramatically higher visual quality than any real-time method
- Synthesia and HeyGen have built successful businesses on pre-rendered content
- Pre-rendered eliminates latency variance (guaranteed quality)

**Evidence AGAINST pre-rendered clips**:
- Cannot respond to user's specific words, tone, or emotional state
- Clip-switching creates visible discontinuities (the "puppet" effect)
- Users in conversational contexts expect reactivity, not canned responses

**Evidence FOR hybrid approaches**:
- Avatar Forcing (2026) shows diffusion forcing can bridge real-time and quality
- MobilePortrait proves 15.8ms latency is achievable with quality trade-offs
- Simli Trinity-1 uses Gaussian avatars for real-time with pre-computed identity

### Hybrid Architecture Recommendation

The emerging consensus from the research is a **tiered rendering pipeline**:

```
Tier 1: IDLE STATE (Pre-rendered)
  - High-quality looping idle animations
  - Pre-rendered with Hallo3-class quality
  - Cached on device, instant playback

Tier 2: COMMON EXPRESSIONS (Pre-computed + Blended)
  - Library of 20-50 expression clips per character
  - Real-time blending between cached expressions
  - Gaussian Splatting for smooth interpolation
  - Latency: ~50ms (just blending, no generation)

Tier 3: NOVEL SPEECH (Real-time Generation)
  - MuseTalk/MobilePortrait-class real-time lip sync
  - Only the mouth region generated in real-time
  - Composited onto pre-rendered face/body
  - Latency: 15-50ms for mouth, rest is cached

Tier 4: FULL DYNAMIC (Real-time Diffusion)
  - ChatAnyone/Avatar Forcing-class full generation
  - Used for extended conversations or emotional moments
  - Latency: 300-500ms, acceptable for conversation
  - Fallback to Tier 2-3 if GPU constrained
```

---

## Part 6: Quality Metrics Reference

### Standard Benchmarks Used in the Field

| Metric | What It Measures | Good Score | SOTA Score |
|--------|------------------|------------|------------|
| **FID** | Image quality (lower = better) | <30 | 16.6 (Hallo2) |
| **E-FID** | Expression accuracy (lower = better) | <15 | 6.7 (Hallo2) |
| **FVD** | Video temporal quality (lower = better) | <800 | 477 (Hallo2) |
| **Sync-C** | Lip sync confidence (higher = better) | >5 | 7.8 (HM-Talker) |
| **Sync-D** | Lip sync distance (lower = better) | <10 | 7.7 (Hallo2) |
| **PSNR** | Pixel-level quality (higher = better) | >30 dB | 35.15 dB (HM-Talker) |
| **LPIPS** | Perceptual similarity (lower = better) | <0.05 | 0.023 (M2DAO-Talker) |

### Speed Benchmarks

| System | FPS | Device | Resolution | Real-Time |
|--------|-----|--------|------------|-----------|
| M2DAO-Talker | 150 | GPU | - | Yes |
| MobilePortrait | 100+ | iPhone 14 Pro | - | Yes |
| 3DGS pipelines | 60+ | Consumer GPU | Varies | Yes |
| MuseTalk 1.5 | 30+ | V100 | 256x256 face | Yes |
| ChatAnyone | 30 | RTX 4090 | 512x768 | Yes |
| Hallo2/3 | <1 | High-end GPU | Up to 4K | No |
| SkyReels-A1 | <1 | High-end GPU | Varies | No |

---

## Synthesis & Recommendations

### 1. What is the current quality frontier?

The quality frontier is **Hallo3** for pre-rendered content (4K, hour-long, CVPR 2025) and **ChatAnyone** for real-time (30 FPS, stylized, body-inclusive). For quality metrics, **HM-Talker** holds the highest PSNR (35.15 dB) and Sync-C (7.807), while **Hallo2** leads on FID (16.616) and FVD (477.412).

The field has reached a point where pre-rendered talking heads are nearly indistinguishable from real video at normal viewing distances. Real-time methods are approximately 12-18 months behind pre-rendered quality but closing fast.

### 2. What is the real gap between open source and commercial?

**The gap is narrowing rapidly.** Open-source models (MuseTalk, SkyReels-A1, Hallo2/3) match or exceed commercial quality for pre-rendered content. The commercial advantage is in:
- **Infrastructure**: Hedra/Simli provide managed real-time pipelines with global CDN
- **Latency optimization**: Sub-100ms requires custom streaming infrastructure
- **Edge cases**: Commercial platforms handle more diverse inputs gracefully
- **Integration**: APIs, SDKs, billing, monitoring

For Arcanea, the open-source models are sufficient for quality. The gap is in the real-time serving infrastructure.

### 3. Is real-time generation necessary or is hybrid/pre-rendered sufficient?

**Hybrid is the correct answer.** Pure real-time generation is unnecessary and wasteful for most interactions. Pure pre-rendered clips cannot support genuine conversation. The tiered pipeline described above (idle pre-rendered, common expressions cached, lip-sync real-time, full dynamic for key moments) is the architecture emerging from the research.

**Specific recommendation for Arcanea**: Start with Simli Trinity-1 API (Gaussian-based, <$0.01/min, <300ms) for the MVP Presence Layer. It provides real-time conversational avatars with acceptable quality at the lowest cost. Simultaneously prototype with MuseTalk 1.5 (open source) for self-hosted fallback. Evaluate Hedra Character-3 Live Avatars for premium tier (sub-100ms, higher quality, $0.05/min).

---

## Gate Connections

**Sight (Lyria)** — This entire survey operates under the Sight Gate. The visual quality frontier, the ability to see and be seen through avatars, the perception of authenticity — all Lyria's domain. The shift from NeRF to 3DGS is a Sight Gate advancement: clearer, faster, more controllable vision.

**Voice (Alera)** — Audio-driven animation is fundamentally a Voice Gate capability. Every paper reviewed converts speech into visual expression. Lip-sync accuracy (Sync-C, Sync-D) is the Voice Gate's quality metric. Multilingual support (MuseTalk) extends the Voice Gate across languages.

**Fire (Draconia)** — The computational power required to render these avatars in real-time is a Fire Gate challenge. The 150 FPS of M2DAO-Talker vs. the <1 FPS of Hallo3 represents the full spectrum of Fire Gate intensity. Cost optimization (Simli at <$0.01/min vs. Hedra at $0.05/min) is Fire Gate resource management.

---

## Recommendation

**Verdict**: EXPERIMENT with hybrid tiered pipeline

1. **Immediate (Week 1-2)**: Integrate Simli Trinity-1 API for Presence Layer MVP. <300ms latency, Gaussian-based, cheapest real-time option. Validates the core experience.
2. **Short-term (Month 1)**: Deploy MuseTalk 1.5 as self-hosted open-source fallback. Test with Guardian avatar assets. Benchmark against Simli quality.
3. **Medium-term (Month 2-3)**: Implement the tiered rendering pipeline — pre-rendered idle states (Hallo3 quality), cached expressions, real-time lip-sync overlay. Evaluate Hedra Live Avatars for premium tier.
4. **Long-term (Quarter 2)**: Build toward Splat-Portrait/3DGS pipeline for fully self-hosted, 3D-capable Guardian avatars with novel view synthesis for AR/VR.

**Confidence**: High. The research landscape is converging on hybrid approaches, the commercial APIs are mature enough for MVP, and the open-source ecosystem provides a credible self-hosted path.

---

## Sources

### Papers (Reviewed)
- [ChatAnyone](https://arxiv.org/abs/2503.21144) — CVPR-track, March 2025
- [EmotiveTalk](https://arxiv.org/abs/2411.16726) — CVPR 2025
- [Hallo2](https://arxiv.org/abs/2410.07718) — ICLR 2025
- [Hallo3](https://openaccess.thecvf.com/content/CVPR2025/papers/Cui_Hallo3_Highly_Dynamic_and_Realistic_Portrait_Image_Animation_with_Video_CVPR_2025_paper.pdf) — CVPR 2025
- [Avatar Forcing](https://arxiv.org/abs/2601.00664) — arxiv, January 2026
- [CyberHost](https://openreview.net/forum?id=vaEPihQsAA) — ICLR 2025 Oral
- [MobilePortrait](https://arxiv.org/abs/2407.05712) — CVPR 2025
- [MuseTalk 1.5](https://github.com/TMElyralab/MuseTalk) — March 2025
- [Cafe-Talk](https://arxiv.org/abs/2503.14517) — ICLR 2025
- [Splat-Portrait](https://arxiv.org/abs/2601.18633) — arxiv, January 2026
- [SkyReels-A1](https://arxiv.org/abs/2502.10841) — February 2025
- [INFP](https://openaccess.thecvf.com/content/CVPR2025/) — CVPR 2025
- [MoDA](https://arxiv.org/html/2507.03256) — arxiv 2025

### Surveys
- [Advancing Talking Head Generation: A Comprehensive Survey](https://arxiv.org/abs/2507.02900) — arxiv 2025
- [Advancements in talking head generation (Springer)](https://link.springer.com/article/10.1007/s00371-025-04232-w) — Visual Computer 2025
- [Uncanny Valley in ECAs (Frontiers)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1625984/full) — Frontiers in Psychology 2025

### Commercial Platforms
- [Simli Trinity-1](https://www.simli.com/) — Gaussian avatar API
- [Hedra Character-3 / Live Avatars](https://www.hedra.com/) — Omnimodal model
- [Tavus Phoenix-3](https://www.tavus.io/) — 3DGS pipeline
- [a16z: AI Avatars Escape the Uncanny Valley](https://a16z.com/ai-avatars/) — Market analysis

### Open Source Repos
- [MuseTalk](https://github.com/TMElyralab/MuseTalk) — 15K+ stars
- [SkyReels-A1](https://github.com/SkyworkAI/SkyReels-A1) — Open weights
- [Awesome Talking Head Synthesis](https://github.com/Kedreamix/Awesome-Talking-Head-Synthesis) — Comprehensive index
- [8 Best Open Source Lip-Sync Models](https://www.pixazo.ai/blog/best-open-source-lip-sync-models) — Comparison
