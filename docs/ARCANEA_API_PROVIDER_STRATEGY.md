# Arcanea API Provider Strategy

> *"The Arcanea Gateway: Curated Intelligence for Creators"*

**Status**: Strategic Plan + Active Build | **Date**: March 2026
**Scope**: Arcanea as an AI API Provider + Gateway Service
**Legal Model**: BYOK (Bring Your Own Key) — zero legal risk, no partnerships needed
**Oracle Conflict**: NONE — BYOK routing software ≠ cloud AI infrastructure service

---

## Executive Summary

Arcanea should become an **AI API provider** — a curated intelligence gateway that offers pre-selected, quality-validated AI models through a single unified endpoint. This positions Arcanea not just as a consumer of AI APIs, but as a **value-adding intermediary** that creators, developers, and platforms can plug into.

**The core thesis**: The AI model market is fragmenting (400+ models across 60+ providers). Most users cannot evaluate which model is best for their task. Arcanea's opportunity is to **curate the best models, optimize routing for quality and speed, and offer this as a service** — becoming the "sommelier of AI" rather than the "grocery store of AI."

---

## Part 1: Why Arcanea Should Do This

### 1.1 Strategic Positioning

| Without API Provider | With API Provider |
|---------------------|------------------|
| Consumer of AI APIs | Producer AND consumer |
| Dependent on single provider (Gemini) | Multi-provider resilience |
| Platform only | Platform + Infrastructure |
| Revenue: subscriptions only | Revenue: subscriptions + API usage + platform fees |
| Invisible to developer ecosystem | Listed in Vercel AI SDK, LobeChat, 30+ tools |

### 1.2 Market Opportunity

- **$100B+ enterprise AI market** in 2026, with cost control as top concern
- **OpenRouter**: $5M ARR (2025) with zero marketing, purely word-of-mouth — proving the model
- **61 community providers** already in Vercel AI SDK — the ecosystem is open and welcoming
- **30+ platforms** accept OpenAI-compatible endpoints (LobeChat, Open WebUI, Continue, Cursor, etc.)

### 1.3 Competitive Moat

OpenRouter is a "grocery store" — 500+ models, no curation, no opinion. Arcanea's approach:

| OpenRouter | Arcanea Gateway |
|-----------|----------------|
| 500+ models, user picks | 26 curated models, quality-guaranteed |
| Zero markup, 5.5% platform fee | Subscription tiers OR small markup |
| No opinion on quality | Quality-first: only fastest + smartest models |
| No creative specialization | Creator-optimized: writing, code, vision, audio |
| Generic API | Arcanea-enhanced: Guardian routing, creative prompts |

**The pitch**: "We tested 400 models so you don't have to. These 26 are the absolute best — each #1 at something specific."

### 1.4 What Arcanea Adds (Value Beyond Proxying)

1. **Quality curation** — only models that pass Arcanea's benchmark suite
2. **Speed guarantee** — Cerebras (2,000+ tok/s) and Groq (800+ tok/s) as primary backends
3. **Creative routing** — task-type classification routes to the best model per use case
4. **Guardian alignment** — optional Arcanea personality layer (system prompts)
5. **Semantic caching** — Supabase pgvector for 60-85% cost reduction on repeated queries
6. **Unified billing** — one API key, one invoice, all models

---

## Part 2: Legal & Licensing (The Smooth Path)

### 2.1 Legal Landscape Summary

| Provider | Standard ToS | Aggregation Allowed? | Path Forward |
|----------|-------------|---------------------|--------------|
| **Cerebras** | Prohibits reselling under consumer ToS | YES via API Certification Partner Program | Apply to partner program (Portkey, Vercel, OpenRouter already certified) |
| **Groq** | Allows "Customer Applications" using Groq backend, prohibits "substantially similar" services | GRAY ZONE under standard ToS | Contact Business tier for custom agreement |
| **Google (Gemini)** | Allows commercial use via API | YES under standard terms | Already using via `@ai-sdk/google` |
| **Open-source models** | Apache 2.0 / Llama license | YES — self-hosted or via certified provider | Use Cerebras/Groq as hosts |

### 2.2 Three Legal Strategies (Pick One or Combine)

#### Strategy A: BYOK (Bring Your Own Key) — ZERO Legal Risk
Users provide their own Cerebras/Groq API keys. Arcanea only routes and adds value. No reselling occurs.

- **Legal risk**: None. Users have direct contracts with providers.
- **Revenue model**: Subscription for routing intelligence, caching, analytics.
- **Downside**: Higher friction (users need multiple API keys).
- **Precedent**: LiteLLM, parts of OpenRouter.

#### Strategy B: Managed Keys with Partner Agreements — LOW Risk
Arcanea holds provider API keys and bills users directly. Requires commercial agreements with each provider.

- **Legal risk**: Low (covered by partner agreements).
- **Revenue model**: Markup on tokens OR platform fee (5-10%).
- **Requirement**: Apply to Cerebras Partner Program + Groq Business tier.
- **Precedent**: OpenRouter, Portkey.

#### Strategy C: Hybrid (Recommended) — LOWEST Friction
- Default: Arcanea-managed keys for instant access (Strategy B).
- Optional: BYOK for power users who want direct provider pricing.
- This is exactly what OpenRouter does, and it works.

### 2.3 What You Need Before Launch

| Item | Priority | Status |
|------|----------|--------|
| Apply to Cerebras API Certification Partner Program | HIGH | TODO |
| Contact Groq Business tier for custom agreement | HIGH | TODO |
| Draft Arcanea API Terms of Service | HIGH | TODO |
| Add liability caps + indemnification to ToS | HIGH | TODO |
| Add upstream SLA disclaimers | MEDIUM | TODO |
| Privacy policy for API data handling | HIGH | TODO |

### 2.4 Terms of Service Template (Key Clauses)

Based on OpenRouter's proven ToS structure:

1. **User indemnification** — users responsible for their API usage
2. **Upstream SLA disclaimer** — Arcanea does not guarantee upstream provider uptime
3. **Liability cap** — max liability = fees paid in prior 12 months or $100
4. **Model terms pass-through** — users must comply with individual model licenses
5. **No training** — Arcanea does not train on user data (opt-out by default)
6. **Data retention** — configurable per user (zero retention available)

---

## Part 3: Technical Architecture

### 3.1 What To Build

```
┌──────────────────────────────────────────────────────────┐
│                    ARCANEA GATEWAY                        │
│                                                          │
│  ┌─────────┐   ┌──────────┐   ┌────────────────────┐    │
│  │ Vercel   │   │ OpenAI   │   │ Vercel AI SDK      │    │
│  │ AI SDK   │   │ Compat   │   │ Provider Package   │    │
│  │ Provider │   │ API      │   │ @arcanea/ai-sdk    │    │
│  └────┬─────┘   └────┬─────┘   └────────┬───────────┘    │
│       │              │                    │               │
│       └──────────────┴────────────────────┘               │
│                      │                                    │
│              ┌───────┴────────┐                           │
│              │  Gateway Core  │                           │
│              │  (Edge Runtime)│                           │
│              └───────┬────────┘                           │
│                      │                                    │
│    ┌─────────────────┼─────────────────────┐              │
│    │                 │                     │              │
│    ▼                 ▼                     ▼              │
│  ┌─────┐     ┌──────────┐          ┌───────────┐         │
│  │Cache │     │ Router   │          │ Analytics │         │
│  │Layer │     │ Engine   │          │ + Billing │         │
│  └──┬──┘     └────┬─────┘          └─────┬─────┘         │
│     │             │                       │               │
│     │    ┌────────┴──────────┐            │               │
│     │    │                   │            │               │
│     ▼    ▼                   ▼            ▼               │
│  ┌──────────┐         ┌──────────┐  ┌─────────┐          │
│  │ Cerebras │         │  Groq    │  │ Supabase│          │
│  │ (Speed)  │         │ (Speed)  │  │ (State) │          │
│  └──────────┘         └──────────┘  └─────────┘          │
│                                                          │
│  Future: Anthropic, Google, xAI, Mistral, DeepSeek       │
└──────────────────────────────────────────────────────────┘
```

### 3.2 Core Components

#### Component 1: OpenAI-Compatible API (`/v1/chat/completions`)

The universal gateway endpoint. This single endpoint unlocks compatibility with 30+ tools.

**Minimum viable surface:**

| Endpoint | Priority | Purpose |
|----------|----------|---------|
| `POST /v1/chat/completions` | MUST | Chat completions (streaming + non-streaming) |
| `GET /v1/models` | MUST | Model discovery |
| `POST /v1/embeddings` | SHOULD | Embedding support |
| `POST /v1/images/generations` | NICE | Image generation proxy |

**Authentication**: `Authorization: Bearer arc_xxxx` (Arcanea API key prefix)

#### Component 2: Vercel AI SDK Provider Package

Published as `@arcanea/ai-provider` on npm. Implements `LanguageModelV3` spec.

```typescript
import { arcanea } from '@arcanea/ai-provider';
import { generateText } from 'ai';

const { text } = await generateText({
  model: arcanea('arcanea-luminor-v1'),  // Curated fast model
  prompt: 'Write a creation myth',
});
```

**Path to ecosystem visibility:**

| Phase | Action | Result |
|-------|--------|--------|
| 1 | Publish `@arcanea/ai-provider` on npm | Anyone can install |
| 2 | Submit PR to vercel/ai docs | Listed on ai-sdk.dev Community Providers |
| 3 | (Future) Apply for AI Gateway inclusion | Available via `gateway('arcanea/...')` |

#### Component 3: Curated Model Catalog

The key differentiator — Arcanea's opinion on which models are best.

**Launch Catalog (8-12 models):**

| Arcanea Model ID | Backend | Why Selected | Best For |
|-----------------|---------|-------------|----------|
| `arcanea-flash` | Cerebras Llama 3.1 8B | 2,200 tok/s, free tier | Quick tasks, chat |
| `arcanea-swift` | Groq Llama 3.1 8B | 840 tok/s, $0.05/M | Fast reliable chat |
| `arcanea-scholar` | Cerebras Llama 3.3 70B | 450 tok/s, smart | Analysis, writing |
| `arcanea-sage` | Groq Llama 3.3 70B | 394 tok/s, reliable | Complex reasoning |
| `arcanea-titan` | Cerebras Qwen 3 235B | 1,400 tok/s, 235B params | Deep reasoning |
| `arcanea-scout` | Groq Llama 4 Scout | 594 tok/s, MoE | Balanced all-rounder |
| `arcanea-maverick` | Groq Llama 4 Maverick | 562 tok/s, 128E MoE | Creative writing |
| `arcanea-thinker` | Cerebras DeepSeek R1 70B | 450 tok/s, reasoning | Chain-of-thought |
| `arcanea-vision` | Google Gemini 2.0 Flash | Multimodal | Image understanding |
| `arcanea-create` | Gemini 2.5 Flash Image | Image generation | Visual creation |
| `arcanea-whisper` | Groq Whisper v3 Large | 217x realtime | Speech-to-text |
| `arcanea-auto` | Smart Router | ML-based selection | "Just pick the best" |

**The philosophy**: Every model in the catalog has been selected for a reason. Users trust Arcanea's curation instead of evaluating 500+ options.

#### Component 4: Smart Router

Task classification → optimal model selection:

```
User prompt → [Classifier] → task_type
                                  │
                 ┌────────────────┼────────────────┐
                 ▼                ▼                ▼
            "quick-chat"    "deep-analysis"   "creative"
                 │                │                │
                 ▼                ▼                ▼
          arcanea-flash    arcanea-titan    arcanea-maverick
```

Classification dimensions:
- **Complexity**: simple → moderate → complex → expert
- **Task type**: chat, analysis, creative, code, vision, audio
- **Speed priority**: fastest → balanced → quality-first
- **Cost priority**: cheapest → balanced → best-regardless

#### Component 5: Caching Layer

Using Supabase pgvector (already in the stack):

- **Exact match**: SHA-256 hash of (model + messages + params) → cached response
- **Semantic cache**: Embed prompt → cosine similarity search → return if >0.93
- **Expected savings**: 60-85% cost reduction for apps with repeated patterns

### 3.3 Deployment Architecture

**Recommended: Hybrid Vercel + Cloudflare**

| Layer | Platform | Why |
|-------|----------|-----|
| **Application** (arcanea.ai) | Vercel | Next.js 16, existing deployment |
| **Gateway Core** (API proxy) | Cloudflare Workers OR Vercel Edge | Unlimited streaming (CF), or simpler (Vercel Edge, 300s max) |
| **State** (cache, billing, keys) | Supabase | Already in stack, pgvector for semantic cache |
| **Analytics** | Supabase + Vercel Analytics | Usage tracking, cost calculation |

**Simplest MVP path**: Deploy gateway as Next.js API routes on Vercel Edge Runtime (already proven in current `/api/ai/chat/route.ts`). Upgrade to Cloudflare Workers later if streaming duration becomes a constraint.

### 3.4 What Can Be Built NOW (Immediate Actions)

These are components that require zero partner agreements and zero legal complexity:

#### Immediate Build 1: OpenAI-Compatible API Endpoint

Add to `apps/web/app/api/v1/chat/completions/route.ts` — an OpenAI-compatible endpoint that routes to Gemini (already configured). This alone makes Arcanea a provider in 30+ tools.

#### Immediate Build 2: `/v1/models` Endpoint

10 lines of code. Returns the model catalog as JSON.

#### Immediate Build 3: Vercel AI SDK Provider Package

Create `packages/ai-provider/` implementing `LanguageModelV3`. Publish to npm as `@arcanea/ai-provider`.

#### Immediate Build 4: BYOK Multi-Provider Support

Add `@ai-sdk/openai-compatible` to support user-provided Cerebras and Groq keys. Zero legal risk — users provide their own keys.

#### Immediate Build 5: LobeChat Built-In Provider PR

Submit a PR to LobeChat adding Arcanea as a built-in provider. Uses `openaiCompatibleFactory` — ~20 lines of actual provider code, ~12 files total.

---

## Part 4: Integration Roadmap

### 4.1 Becoming a Provider in Each Ecosystem

| Platform | Method | Effort | Impact |
|----------|--------|--------|--------|
| **Vercel AI SDK** | Publish npm package + PR to docs | 2-3 days | Listed on ai-sdk.dev |
| **LobeChat** | Submit PR (openaiCompatibleFactory) | 1-2 days | Built-in for 60k+ users |
| **Open WebUI** | Just works (OpenAI-compatible API) | 0 effort | 124k+ star community |
| **LibreChat** | Submit YAML config to config-yaml repo | 1 hour | Pre-configured for users |
| **LiteLLM** | Submit JSON to provider list | 1 hour | Used as backend by many tools |
| **Continue.dev** | Submit docs PR | 1 hour | IDE integration for devs |
| **OpenRouter** | Apply as provider (custom agreement) | Weeks | Massive distribution |
| **Vercel AI Gateway** | Apply for inclusion (business relationship) | Months | `gateway('arcanea/...')` |

### 4.2 Phase Roadmap

#### Phase 1: Foundation (Week 1-2) — Build Now
- [ ] Create OpenAI-compatible `/v1/chat/completions` endpoint
- [ ] Create `/v1/models` endpoint
- [ ] Create `@arcanea/ai-provider` npm package (Vercel AI SDK)
- [ ] Scaffold BYOK support for Cerebras + Groq
- [ ] Submit LobeChat built-in provider PR
- [ ] Submit LibreChat + LiteLLM config PRs

#### Phase 2: Gateway Intelligence (Week 3-4) — Build Now
- [ ] Add task-type classifier for smart routing
- [ ] Implement exact-match caching (Redis/KV or in-memory)
- [ ] Add token counting and usage tracking
- [ ] Create API key management (Supabase-backed)
- [ ] Add rate limiting per API key

#### Phase 3: Provider Partnerships (Week 3-6) — Contact Now
- [ ] Apply to Cerebras API Certification Partner Program
- [ ] Contact Groq Business tier for custom agreement
- [ ] Draft Arcanea API Terms of Service
- [ ] Draft Privacy Policy for API data handling

#### Phase 4: Advanced Features (Week 5-8)
- [ ] Semantic caching with Supabase pgvector
- [ ] Streaming analytics (real-time cost dashboard)
- [ ] Fallback chains (Cerebras → Groq → Gemini)
- [ ] Guardian personality layer (optional system prompt injection)
- [ ] Submit PR to Vercel AI SDK community providers docs

#### Phase 5: Scale (Month 3+)
- [ ] Apply for Vercel AI Gateway inclusion
- [ ] Apply to OpenRouter as a provider
- [ ] Add more providers (Anthropic, xAI, Mistral)
- [ ] Image generation proxy (DALL-E, Flux, Imagen)
- [ ] Embeddings endpoint

---

## Part 5: Business Model

### 5.1 Revenue Streams

| Stream | Model | Example |
|--------|-------|---------|
| **API Usage** | Markup or platform fee on tokens | 10% markup or 5.5% fee (OpenRouter model) |
| **Subscription Tiers** | Monthly plans for guaranteed rate limits | Free / Creator ($19) / Studio ($49) / Enterprise |
| **BYOK Routing** | Subscription for routing intelligence + caching | $9/mo for smart routing with own keys |
| **Platform Integration** | Arcanea platform uses its own gateway | Internal consumption, zero marginal cost |

### 5.2 Pricing Tiers

| Tier | Price | Included | Rate Limit |
|------|-------|----------|------------|
| **Seeker** (Free) | $0 | 100K tokens/day, basic models | 10 req/min |
| **Creator** | $19/mo | 5M tokens/day, all models, caching | 60 req/min |
| **Studio** | $49/mo | 25M tokens/day, priority routing, analytics | 300 req/min |
| **Enterprise** | Custom | Unlimited, SLA, dedicated support | Custom |

### 5.3 Unit Economics

Using Groq's pricing as reference:
- **Cost to Arcanea**: $0.05/M input tokens (Llama 3.1 8B on Groq)
- **Price to user**: $0.06/M input tokens (20% markup)
- **Margin**: $0.01/M tokens
- **At 1B tokens/month**: $10,000 gross margin
- **With caching (60% hit rate)**: Effective margin increases to ~$25,000

With Cerebras free tier:
- **Cost to Arcanea**: $0/M tokens (within free tier limits)
- **Price to user**: $0.02/M tokens (value pricing)
- **Margin**: 100% until free tier exhausted

---

## Part 6: Technical Implementation Guide

### 6.1 File Structure

```
packages/
  ai-provider/                    # Vercel AI SDK provider package
    src/
      arcanea-provider.ts         # Provider factory
      arcanea-chat-model.ts       # LanguageModelV3 implementation
      arcanea-settings.ts         # Model IDs and settings
      index.ts                    # Public exports
    package.json
    tsconfig.json
    tsup.config.ts

apps/web/
  app/api/
    v1/
      chat/completions/route.ts   # OpenAI-compatible chat endpoint
      models/route.ts             # Model catalog endpoint
      embeddings/route.ts         # (Future) Embeddings endpoint
  lib/
    gateway/
      router.ts                   # Smart model router
      cache.ts                    # Caching layer
      providers/
        cerebras.ts               # Cerebras provider adapter
        groq.ts                   # Groq provider adapter
        gemini.ts                 # Gemini provider adapter (existing)
      billing.ts                  # Usage tracking + cost calculation
      rate-limiter.ts             # Per-key rate limiting
      api-keys.ts                 # API key management
```

### 6.2 OpenAI-Compatible Endpoint (Core)

The `/v1/chat/completions` endpoint accepts the standard OpenAI request format and routes to the selected backend provider. It supports both streaming and non-streaming responses.

Key implementation details:
- Parse `model` field to determine which backend to route to
- Support `stream: true/false`
- Return standard OpenAI response format with `choices`, `usage`, etc.
- SSE streaming with `data: {json}\n\n` format and `data: [DONE]` terminator
- Authentication via `Authorization: Bearer arc_xxxxx`

### 6.3 Provider Adapters

Each backend provider gets a thin adapter that:
1. Translates Arcanea model IDs to provider model IDs
2. Injects provider-specific API keys
3. Forwards the request
4. Normalizes the response to OpenAI format

Since Cerebras and Groq are both OpenAI-compatible, the adapters are minimal — essentially just base URL + auth header changes.

### 6.4 Vercel AI SDK Provider

The provider package implements `LanguageModelV3` with two methods:
- `doGenerate()` — non-streaming, calls `/v1/chat/completions`
- `doStream()` — streaming, calls `/v1/chat/completions?stream=true`

Since Arcanea's own API is OpenAI-compatible, the provider can use `@ai-sdk/openai-compatible` as a base, making the implementation ~50 lines.

---

## Part 7: Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Provider terminates account (ToS violation) | HIGH if no agreement | CRITICAL | Get partner agreements BEFORE launching managed keys |
| Provider changes pricing | MEDIUM | HIGH | Multi-provider fallback, dynamic pricing |
| Low adoption | MEDIUM | MEDIUM | Start with Arcanea platform as primary consumer |
| Rate limit exhaustion by one user | HIGH | HIGH | Per-key rate limiting, provider quota isolation |
| Streaming timeout on Vercel Edge (300s) | LOW | MEDIUM | Most AI responses complete in <60s; move to CF Workers if needed |
| Competition from OpenRouter/Portkey | HIGH | LOW | Different positioning (curated quality vs. grocery store) |

---

## Appendix A: Key Contacts

- **Cerebras Partner Program**: https://www.cerebras.ai/api-certification-partner-program
- **Groq Business Tier**: https://groq.com/pricing (Business inquiry)
- **Vercel AI SDK Providers**: PR to github.com/vercel/ai
- **LobeChat Provider PR**: github.com/lobehub/lobe-chat
- **OpenRouter Provider Application**: https://openrouter.ai/docs/guides/guides/for-providers

## Appendix B: Competitive Landscape

| Competitor | Models | Differentiator | Arcanea Advantage |
|-----------|--------|---------------|-------------------|
| OpenRouter | 500+ | Largest catalog, zero markup | Curated quality > quantity |
| Portkey | 1,600+ integrations | Enterprise governance | Creator-focused, simpler |
| LiteLLM | 100+ (self-hosted) | Open source, BYO everything | Managed service, zero setup |
| Unify.ai | Multi-provider | Benchmark-driven routing | Creative task optimization |
| Helicone | Multi-provider | Analytics-first | Full gateway, not just analytics |

---

## Part 6: How Arcanea is Unique and Best (March 2026)

### 6.1 The Competitive Landscape — Where Everyone Else Falls Short

| Competitor | What They Do | Their Weakness | Arcanea's Edge |
|-----------|-------------|----------------|----------------|
| **OpenRouter** | 500+ models, pass-through pricing | Zero curation. User drowns in choices. No opinion on quality. | Arcanea curates 26 models. Each is #1 at something. |
| **Portkey** | Enterprise gateway + observability | Developer-focused, no consumer brand. Complex setup. | Arcanea has brand, community, AND gateway. |
| **LiteLLM** | Open-source proxy, 100+ providers | Self-hosted, no curation, no SaaS. Infra, not product. | Arcanea is a hosted service with smart routing. |
| **Helicone** | Logging + analytics for LLM calls | Observability only, not a provider. No routing. | Arcanea routes, caches, AND observes. |
| **Vercel AI Gateway** | Provider switching in AI SDK | SDK-level, not API-level. Requires code changes per model. | Arcanea is a drop-in API — works with any tool. |
| **Direct Providers** | Individual APIs from Anthropic, OpenAI, etc. | Each has different format, billing, limits. No cross-provider routing. | One endpoint, 13 providers, smart selection. |

### 6.2 The Six Things Only Arcanea Does

1. **Benchmark-Verified Curation** — Every model ranked against March 2026 published benchmarks (ARC-AGI-2, AIME 2025, SWE-bench Verified, GPQA Diamond, Terminal-Bench 2.0). Not opinions — data.

2. **Multi-Modal Through One API** — Text + Image + Video + Audio generation through the same OpenAI-compatible endpoint. No one else offers Flux 2 Pro + Veo 3.1 + Sora 2 + Whisper through one API with smart routing.

3. **Speed-Aware Routing** — Arcanea knows that simple questions should go to Cerebras at 2,200 tok/s, not Claude Opus at $25/M output. The router matches task complexity to model capability AND speed.

4. **BYOK With Zero Markup** — OpenRouter charges 5.5% on every token. Arcanea charges for the intelligence layer (routing, caching, analytics), not for proxying. Users pay providers directly at their prices.

5. **26 Models, 13 Providers, Each #1 At Something** — Not a model dump. Each model has a specific reason:
   - arcanea-opus: #1 coding (80.8% SWE-bench)
   - arcanea-gpt5: #1 math (100% AIME 2025)
   - arcanea-gemini-pro: #1 raw reasoning (77.1% ARC-AGI-2)
   - arcanea-bolt: #1 speed (2,200+ tok/s)
   - arcanea-deepseek: #1 value (66% SWE-bench at $0.27/M)
   - arcanea-flux-pro: #1 photorealism ($0.055/image)
   - arcanea-veo: #1 video realism (film-grade + audio)
   - ...and so on. Every slot has a champion.

6. **Arcanea Brand + Creator Community** — OpenRouter is a utility. Arcanea is a universe. The gateway is embedded in a living mythology, a creator platform, and a design philosophy. Developers who use Arcanea become part of something.

### 6.3 The 30-Second Pitch

> "Arcanea is a curated AI gateway. 26 hand-picked models from 13 providers — each the best at something specific — through one OpenAI-compatible endpoint. Smart routing picks the optimal model for every task. BYOK means zero markup on model costs. Works with LobeChat, Cursor, LangChain, and 30+ tools instantly. One API change, instant access to the frontier."

---

## Part 7: Monetization Strategy — Deep Analysis

### 7.1 Revenue Model: Value-Layer Pricing

Arcanea does NOT markup model tokens. Revenue comes from the **intelligence and infrastructure layer**:

| Revenue Stream | How It Works | Margin |
|---------------|-------------|--------|
| **Free Tier (Seeker)** | 100K tokens/day, 10 req/min. BYOK only. | $0 (acquisition funnel) |
| **Creator ($19/mo)** | 5M tokens/day, 60 req/min, smart routing, semantic caching, usage dashboard | ~85% margin (pure SaaS) |
| **Studio ($49/mo)** | Unlimited tokens, 300 req/min, fallback chains, API key management, team access, SSO | ~85% margin |
| **Enterprise (custom)** | Dedicated infra, SLA, custom models, on-prem caching | 60-70% margin |
| **Semantic Caching** | Save users 60-85% on repeated/similar queries via pgvector | Paid tiers only |
| **Ecosystem Fees** | If LobeChat/Cursor etc. drive traffic via integration | Revenue share possible |

### 7.2 Unit Economics

| Metric | Value | Notes |
|--------|-------|-------|
| **COGS per request** | ~$0.0001 | Edge compute + Supabase per-request cost |
| **Creator tier margin** | ~$16/user/mo | $19 - ~$3 infrastructure |
| **Studio tier margin** | ~$42/user/mo | $49 - ~$7 infrastructure |
| **Break-even** | ~100 paid users | Covers Vercel Pro + Supabase Pro + domain |
| **$10K MRR** | ~250 Creator + 100 Studio | Achievable within 6 months of launch |
| **$100K MRR** | ~2,500 Creator + 1,000 Studio | Requires ecosystem integrations (LobeChat, Cursor) |

### 7.3 Why This Model Works

1. **No token cost risk** — BYOK means Arcanea never pays for model inference
2. **Pure SaaS margins** — Revenue is subscriptions for routing/caching/analytics, not reselling
3. **Network effects** — More users = better caching = lower costs = better value
4. **Viral distribution** — Listed in 30+ tools means discovery is built-in
5. **Low churn** — Once configured, switching gateway is painful; strong lock-in
6. **Upsell path** — Free → Creator → Studio → Enterprise is natural progression

### 7.4 Competitive Pricing Comparison

| Provider | Free Tier | Paid Tier | Token Markup |
|----------|----------|----------|-------------|
| **OpenRouter** | Limited free models | Pay-per-use | 5.5% on all tokens |
| **Portkey** | 10K logs/mo | $49/mo (10M logs) | None (BYOK) |
| **Helicone** | 100K logs/mo | $20/mo | None (logging only) |
| **Arcanea** | 100K tokens/day | $19/mo (Creator) | **Zero** (BYOK) |

**Arcanea wins because**: Zero token markup + smart routing + caching = users save money compared to direct API calls while getting better model selection.

### 7.5 The Caching Revenue Multiplier

Semantic caching (pgvector similarity matching) is the hidden revenue driver:

- **Hit rate**: 15-40% for typical applications (higher for FAQ bots, customer service)
- **Savings per cache hit**: 100% of model cost (cached response, no provider call)
- **User perception**: "Arcanea saved me $X this month" → strong retention signal
- **Arcanea cost**: ~$0.001 per cached response (Supabase pgvector query)
- **User savings**: $0.001-$0.075 per cached response (depending on model)

At Creator tier ($19/mo), a user doing 100K requests/month with 30% cache hit rate:
- 30,000 cache hits × avg $0.01 savings = **$300/month saved**
- User pays $19/mo for $300/mo in savings = **15.8x ROI**

This is the monetization story: **Arcanea pays for itself 15x over**.

---

## Appendix C: Sources

### Provider APIs
- Cerebras Docs: https://inference-docs.cerebras.ai
- Groq Docs: https://console.groq.com/docs
- Cerebras Partner Program: https://www.cerebras.ai/press-release/cerebras-launches-api-certification-partner-program

### Legal
- Cerebras ToS: https://www.cerebras.ai/terms-of-service
- Groq Services Agreement: https://console.groq.com/docs/legal/services-agreement
- OpenRouter Terms: https://openrouter.ai/terms

### Vercel AI SDK
- Provider Spec: https://ai-sdk.dev/providers/community-providers/custom-providers
- OpenAI-Compatible Guide: https://ai-sdk.dev/providers/openai-compatible-providers/custom-providers
- Community Providers: https://ai-sdk.dev/providers/community-providers

### Platforms
- LobeChat Provider System: https://lobehub.com/docs/self-hosting/environment-variables/model-provider
- Open WebUI: https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible/
- LibreChat Custom Endpoints: https://www.librechat.ai/docs/quick_start/custom_endpoints

### Market Data
- OpenRouter Revenue (Sacra): https://sacra.com/c/openrouter/
- Top LLM Gateways 2025: https://www.helicone.ai/blog/top-llm-gateways-comparison-2025
