# Arcanea Intelligence Gateway — Task Plan

**Goal**: Arcanea as a cutting-edge AI API provider with curated intelligence gateway
**Strategy**: `docs/ARCANEA_API_PROVIDER_STRATEGY.md`
**Legal Model**: BYOK (Bring Your Own Key) — no partnerships, no reselling, no Oracle conflict

---

## Phase 1: Foundation — BUILT

| # | Task | Status | Files |
|---|------|--------|-------|
| 1.1 | Gateway types (OpenAI-compatible) | `complete` | `lib/gateway/types.ts` |
| 1.2 | Curated model catalog (26 models, frontier-only) | `complete` | `lib/gateway/models.ts` |
| 1.3 | Smart router (task classification + auto-select) | `complete` | `lib/gateway/router.ts` |
| 1.4 | Provider adapters (13 providers, Anthropic translator) | `complete` | `lib/gateway/providers.ts` |
| 1.5 | SSE streaming utilities + Anthropic adapter | `complete` | `lib/gateway/streaming.ts` |
| 1.6 | Gateway barrel export | `complete` | `lib/gateway/index.ts` |
| 1.7 | `/api/v1/chat/completions` (OpenAI-compatible) | `complete` | `app/api/v1/chat/completions/route.ts` |
| 1.8 | `/api/v1/models` (model discovery) | `complete` | `app/api/v1/models/route.ts` |
| 1.9 | Vercel AI SDK provider package | `complete` | `packages/ai-provider/` |
| 1.10 | API documentation page | `complete` | `app/developers/api/page.tsx` |
| 1.11 | Model catalog verified with March 2026 benchmarks | `complete` | `lib/gateway/models.ts` |

## Phase 2: Ecosystem Integration — TODO

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Submit LobeChat provider PR | `pending` | openaiCompatibleFactory, ~12 files |
| 2.2 | Submit LibreChat YAML config | `pending` | 1 YAML file |
| 2.3 | Submit LiteLLM provider JSON | `pending` | 1 JSON file |
| 2.4 | Publish `@arcanea/ai-provider` to npm | `pending` | Need npm account |
| 2.5 | Submit PR to Vercel AI SDK docs | `pending` | Community provider listing |
| 2.6 | Submit Continue.dev docs PR | `pending` | Provider docs page |

## Phase 3: Production Hardening — TODO

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | API key management (arc_ keys, Supabase-backed) | `pending` | User key storage |
| 3.2 | Rate limiting with token bucket (KV/Redis) | `pending` | Per-key limits |
| 3.3 | Usage tracking + cost calculation | `pending` | Per-key metrics |
| 3.4 | Exact-match cache (SHA-256) | `pending` | Cost reduction |
| 3.5 | Semantic cache (pgvector) | `pending` | 60-85% savings |
| 3.6 | Fallback chains (auto-retry on error) | `pending` | Provider resilience |

## Phase 4: Documentation & Legal — TODO

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | API documentation page on arcanea.ai | `complete` | Interactive docs |
| 4.2 | Terms of Service for API | `pending` | BYOK model, based on OpenRouter |
| 4.3 | Privacy Policy for API | `pending` | Zero data retention option |
| 4.4 | Developer quickstart guide | `pending` | 5-minute setup |

## Architecture Summary

```
apps/web/
  lib/gateway/           ← Gateway core (BUILT)
    types.ts             ← OpenAI-compatible types
    models.ts            ← 26 curated models, 13 providers
    router.ts            ← Smart routing + task classification
    providers.ts         ← Multi-provider dispatch + Anthropic adapter
    streaming.ts         ← SSE proxy + format translation
    index.ts             ← Barrel export
  app/api/v1/            ← API endpoints (BUILT)
    chat/completions/    ← POST: chat completions
    models/              ← GET: model catalog
  app/developers/api/    ← Documentation (BUILT)
    page.tsx             ← Interactive API docs

packages/ai-provider/   ← Vercel AI SDK provider (BUILT)
  src/
    arcanea-provider.ts  ← createArcanea() factory
    arcanea-models.ts    ← Model ID types
    index.ts             ← Public API
```

## Curated Model Catalog (26 Models)

### Frontier Reasoning (8)
- arcanea-opus (Claude Opus 4.6) — #1 coding, #1 human preference
- arcanea-sonnet (Claude Sonnet 4.6) — Best value frontier
- arcanea-gpt5 (GPT-5.2 Pro) — #1 math, 100% AIME
- arcanea-gemini-pro (Gemini 3.1 Pro Preview) — #1 raw reasoning, 77.1% ARC-AGI-2
- arcanea-grok (Grok 4.20) — 500B params, real-time knowledge
- arcanea-deepseek-r1 (DeepSeek R1) — Transparent reasoning
- arcanea-kimi (Kimi K2.5) — 1T MoE, agentic champion
- arcanea-deepseek (DeepSeek V3.2) — 50-100x cheaper, still competitive

### Performance (5)
- arcanea-haiku (Claude Haiku 4.5)
- arcanea-gemini-flash (Gemini 2.5 Flash)
- arcanea-qwen (Qwen 3 235B @ 1,400 tok/s)
- arcanea-maverick (Llama 4 Maverick 128E)
- arcanea-mistral (Mistral Large)

### Speed Demons (3)
- arcanea-bolt (Cerebras 8B @ 2,200 tok/s)
- arcanea-thunder (Cerebras 70B @ 450 tok/s)
- arcanea-lightning (Groq 8B @ 750 tok/s)

### Image Gen (5)
- arcanea-flux-pro (Flux 2 Pro) — #1 photorealism
- arcanea-dalle (DALL-E 3) — #1 prompt comprehension
- arcanea-imagen (Imagen 4) — #1 text rendering
- arcanea-ideogram (Ideogram V3) — #1 logos/typography
- arcanea-recraft (Recraft V3 SVG) — Only SVG vector AI

### Video Gen (3)
- arcanea-veo (Veo 3.1) — #1 realism, film-grade + audio
- arcanea-sora (Sora 2) — #1 storytelling, 60s + audio
- arcanea-kling (Kling 2.6) — Best value, $0.05/sec

### Audio (1)
- arcanea-whisper (Whisper V3 Turbo @ 217x realtime)

### Smart (1)
- arcanea-auto (auto-select best model for task)
