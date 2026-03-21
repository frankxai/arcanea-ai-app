# feat(provider): add Arcanea Intelligence Gateway as built-in provider

## Summary

Add [Arcanea](https://arcanea.ai) as a built-in provider in LobeChat. Arcanea is a curated AI gateway that offers 25 hand-picked models from 13 providers through a single OpenAI-compatible endpoint. Each model is selected for being #1 at something specific — coding, math, reasoning, speed, value, image generation, video, or audio.

**Why Arcanea is different from OpenRouter**: OpenRouter offers 500+ models with no curation. Arcanea curates 25 models, each benchmark-verified as the best at its specific task. Smart routing automatically selects the optimal model per request. BYOK means zero markup on model costs.

## Changes

This PR adds 4 files across 3 packages:

### 1. Runtime Provider (`packages/model-runtime/src/providers/arcanea/index.ts`)

Uses `createOpenAICompatibleRuntime` with:
- **Base URL**: `https://arcanea.ai/api/v1`
- **Model discovery**: Fetches from `GET /api/v1/models` with auto-detection of vision, reasoning, and function call capabilities
- **Debug flag**: `DEBUG_ARCANEA_CHAT_COMPLETION=1`

### 2. Model Provider Card (`packages/model-bank/src/modelProviders/arcanea.ts`)

Standard `ModelProviderCard` with:
- **Check model**: `arcanea-auto` (smart router — always available)
- **Model fetcher**: Enabled (auto-discovers available models)
- **SDK type**: `openai` (fully OpenAI-compatible)

### 3. Model Definitions (`packages/model-bank/src/aiModels/arcanea.ts`)

21 chat models + 3 image models + 1 video model + 1 STT model = **26 total** (25 distinct + arcanea-auto router).

Default-enabled models (appear in model selector without user action):
- `arcanea-auto` — Smart router (recommended default)
- `arcanea-opus` — Claude Opus 4.6 (#1 coding, 80.8% SWE-bench)
- `arcanea-sonnet` — Claude Sonnet 4 (best speed/intelligence balance)
- `arcanea-gpt5` — GPT-5 (#1 math, 100% AIME 2025)
- `arcanea-o4-mini` — o4-mini (fast affordable reasoning)
- `arcanea-gemini-pro` — Gemini 2.5 Pro (#1 raw reasoning, 77.1% ARC-AGI-2)
- `arcanea-gemini-flash` — Gemini 2.5 Flash (fastest multimodal)
- `arcanea-deepseek` — DeepSeek V3 (#1 value, $0.27/M input)
- `arcanea-thinker` — DeepSeek R1 (chain-of-thought reasoning)
- `arcanea-bolt` — Cerebras Llama 3.1 8B (#1 speed, 2,200 tok/s)
- `arcanea-scholar` — Cerebras Llama 3.3 70B (smart + fast)
- `arcanea-titan` — Cerebras Qwen 3 235B (235B at 1,400 tok/s)
- `arcanea-scout` — Groq Llama 4 Scout (balanced MoE)
- `arcanea-maverick` — Groq Llama 4 Maverick (creative writing)
- `arcanea-flux-pro` — FLUX 1.1 Pro Ultra (#1 photorealism)

### 4. Model list fixture (`packages/model-runtime/src/providers/arcanea/fixtures/models.json`)

JSON fixture for testing, containing the full model catalog with pricing, capabilities, and metadata.

## Technical Details

| Property | Value |
|----------|-------|
| **API Base URL** | `https://arcanea.ai/api/v1` |
| **Authentication** | Bearer token (user's Arcanea API key) |
| **OpenAI Compatible** | Yes — full `/v1/chat/completions` and `/v1/models` |
| **Streaming** | Yes (SSE with `data: [DONE]` terminator) |
| **Auth Model** | BYOK (Bring Your Own Key) — user provides provider keys through Arcanea |
| **Models Endpoint** | `GET /api/v1/models` (dynamic discovery) |
| **Smart Routing** | Use `arcanea-auto` model ID for automatic model selection |
| **Providers Routed** | Anthropic, OpenAI, Google, DeepSeek, Meta/Cerebras, Meta/Groq, Cohere, Perplexity, Black Forest Labs, Qwen |

## Model Catalog

### Text Models (21)

| Model ID | Backend | Best For | Context | Pricing ($/M tokens) |
|----------|---------|----------|---------|---------------------|
| `arcanea-opus` | Claude Opus 4.6 | #1 coding (80.8% SWE-bench) | 200K | $15 / $75 |
| `arcanea-sonnet` | Claude Sonnet 4 | Speed + intelligence balance | 200K | $3 / $15 |
| `arcanea-gpt5` | OpenAI GPT-5 | #1 math (100% AIME 2025) | 1M | $10 / $40 |
| `arcanea-o4-mini` | OpenAI o4-mini | Affordable reasoning | 128K | $1.1 / $4.4 |
| `arcanea-gemini-pro` | Gemini 2.5 Pro | #1 reasoning (77.1% ARC-AGI-2) | 1M | $1.25 / $10 |
| `arcanea-gemini-flash` | Gemini 2.5 Flash | Fastest multimodal | 1M | $0.15 / $0.60 |
| `arcanea-deepseek` | DeepSeek V3 | #1 value ($0.27/M) | 131K | $0.27 / $1.10 |
| `arcanea-thinker` | DeepSeek R1 | Chain-of-thought | 131K | $0.55 / $2.19 |
| `arcanea-bolt` | Cerebras Llama 3.1 8B | #1 speed (2,200 tok/s) | 131K | $0.10 / $0.10 |
| `arcanea-swift` | Groq Llama 3.1 8B | Low-latency chat | 131K | $0.05 / $0.08 |
| `arcanea-scholar` | Cerebras Llama 3.3 70B | Analysis + writing | 131K | $0.60 / $0.60 |
| `arcanea-sage` | Groq Llama 3.3 70B | Complex reasoning | 131K | $0.59 / $0.79 |
| `arcanea-titan` | Cerebras Qwen 3 235B | Deep reasoning at speed | 131K | $0.90 / $0.90 |
| `arcanea-scout` | Groq Llama 4 Scout | Balanced all-rounder | 1M | $0.11 / $0.34 |
| `arcanea-maverick` | Groq Llama 4 Maverick | Creative writing | 1M | $0.20 / $0.60 |
| `arcanea-vision` | Gemini 2.0 Flash | Image understanding | 1M | $0.10 / $0.40 |
| `arcanea-command` | Cohere Command R+ | Enterprise RAG | 128K | $2.50 / $10 |
| `arcanea-sonar` | Perplexity Sonar Pro | Web search + citations | 127K | $3 / $15 |
| `arcanea-haiku` | Claude 3.5 Haiku | Instant classification | 200K | $0.80 / $4 |
| `arcanea-qwen` | Qwen 3 235B | Multilingual reasoning | 131K | $0.30 / $1.20 |
| `arcanea-auto` | Smart Router | Automatic best model | 200K | varies |

### Image Models (3)

| Model ID | Backend | Best For |
|----------|---------|----------|
| `arcanea-flux-pro` | FLUX 1.1 Pro Ultra | #1 photorealism ($0.055/image) |
| `arcanea-flux-fast` | FLUX Schnell | Fast iteration |
| `arcanea-create` | Google Imagen 4 | Text rendering + photorealism |

### Video Models (1)

| Model ID | Backend | Best For |
|----------|---------|----------|
| `arcanea-veo` | Google Veo 3.1 | Film-grade video + audio |

### Audio Models (1)

| Model ID | Backend | Best For |
|----------|---------|----------|
| `arcanea-whisper` | Whisper v3 Large (Groq) | 217x realtime transcription |

## Testing

```bash
# Unit tests
pnpm --filter model-runtime test -- --testPathPattern=arcanea

# Verify model fetching
curl https://arcanea.ai/api/v1/models -H "Authorization: Bearer YOUR_KEY"

# Verify chat completions
curl https://arcanea.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "arcanea-auto", "messages": [{"role": "user", "content": "Hello"}], "stream": true}'
```

## File Placement Guide

When submitting the actual PR to `lobehub/lobe-chat`, place files as follows:

```
packages/
  model-runtime/
    src/
      providers/
        arcanea/
          index.ts              <-- arcanea.ts (runtime provider)
          index.test.ts         <-- (write tests following groq pattern)
          fixtures/
            models.json         <-- models.json (test fixture)
  model-bank/
    src/
      aiModels/
        arcanea.ts              <-- arcanea-models.ts (model definitions)
      modelProviders/
        arcanea.ts              <-- arcanea-provider.ts (provider card)
```

Additionally, register the provider in these index files:
- `packages/model-bank/src/aiModels/index.ts` — add `export { default as arcanea } from './arcanea';`
- `packages/model-bank/src/modelProviders/index.ts` — add `export { default as Arcanea } from './arcanea';`
- `packages/model-runtime/src/providers/index.ts` — add `export { LobeArcaneaAI } from './arcanea';`

If `ModelProvider` enum does not yet include `Arcanea`, add it to the enum or use the string literal `'arcanea'` as the provider identifier.

## References

- [Arcanea API Documentation](https://arcanea.ai/docs/api)
- [Arcanea Model Catalog](https://arcanea.ai/docs/models)
- [OpenAI API Compatibility Spec](https://platform.openai.com/docs/api-reference/chat)
- [LobeChat Custom Provider Guide](https://lobehub.com/docs/self-hosting/environment-variables/model-provider)
