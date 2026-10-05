# Arcanea Creation Engine: architecture and build plan (2026-10)

Status: proposal for Frank. Author: CEO session frank-be (Claude), 2026-10-06.
Scope: images, video and worlds on arcanea.ai, linked in each creator's profile, running on current Vercel primitives.

## 1. The bet

**Higgsfield generates media; Arcanea remembers worlds.** That positioning was locked in the 2026-07-11 audit.

Higgsfield is a strong multi-model studio:
- Soul 2.0 and Soul Cinema images;
- Soul ID, which builds a persistent face from about 20 photos and reuses it across Kling 3.0, Veo 3.1, Seedance 2.0 and WAN 2.6;
- Cinema Studio, with virtual lenses, camera bodies, grading, first and last frame, and motion reference;
- Canvas, which chains models and saves pipelines;
- MCP and CLI access from Claude.

We should match the parts creators rely on: consistent characters, camera control, model choice, saved pipelines and MCP. We win on the thing Higgsfield doesn't model, which is the world. Every image, clip and scene belongs to a world, a character and a canon. It carries its lineage, and a Director reasons over that graph.

**Central design idea: every creation is a node in the creator's world graph.** Nothing is orphaned. A generation is a durable *job*. The job produces an *asset*, the asset is linked to a world, character or scene, and its provenance (prompt chain, model, seed, parent asset, cost) is kept. Galleries, profiles, remixes and the Director all read the same graph.

## 2. What exists today (origin/main 93eb7cc1)

| Area | Today | Gap |
|---|---|---|
| Images | `lib/imagine/generate.ts`: direct xAI Grok → OpenRouter → Gemini fallback | Not on AI Gateway; per-provider keys; no shared model registry or per-model cost |
| Video | `/api/imagine/animate`: xAI `grok-imagine-video`, polled for about 105 s inside one request, with fal.ai Kling and Gemini fallbacks | **No auth or credit gate (fix: #524)**; polling inside the request is fragile; no job record; no refund |
| Credits | `/api/credits/spend` | Writes columns that don't match the migration and ignores upsert errors, so success is not a debit receipt (#449 state note); uniform 1 credit for every type |
| Admission | `/api/imagine/generate` lets anonymous users through on a spend 401 | **Live cost hole (fix: #449)** |
| Storage | Vercel Blob `put` and `list` per user prefix (`/api/imagine/save`, `/gallery`) | Flat blob list with no asset table, links or metadata; #472 builds an owner-scoped media library |
| Worlds | Myth Studio (#512), the World Engine, `packages/arcanea-mcp` (54 tools), three.js | Not linked to generated media |
| Stack | Next 16.3.6, AI SDK 6 (`ai` 6.0.185), `@ai-sdk/*` 3.x, analytics 1.6 and speed-insights 1.3, Blob 2.8, zod 3 | Next 16.3.8 is a security release; AI SDK 7, Analytics and Speed Insights 2.0 are current |

## 3. Target architecture (Vercel-native)

### 3.1 Model layer: one registry on AI Gateway
- All generation goes through **Vercel AI Gateway**: one key, or OIDC on Vercel; fallback chains through `providerOptions.gateway.models`; cost and latency logs; optional BYOK.
- `lib/models/registry.ts` is the single source for every model. Each entry records the capability (image, edit, image-to-video, text-to-video, director), the Gateway id, the inputs it supports (reference images, first or last frame, audio, duration, aspect), the unit cost, and the **credit price**. Today's uniform 1 credit cannot price video honestly; the price is Frank's decision.
- Image models: `openai/gpt-image-2`, `google/imagen-4.0-ultra-generate-001`, `bfl/flux-2-pro`, `google/gemini-3-pro-image` and `gemini-3.1-flash-image-preview`, `xai/grok-imagine-image`.
- Video models: `google/veo-3.1-generate-001` (text-to-video, up to 1080p, 8 s), `alibaba/wan-v2.6-i2v-flash` (image-to-video, 2–15 s, with audio). Keep fal.ai Kling only for models that aren't on the Gateway.
- Director and text: Claude Sonnet and Opus 5.x, Gemini 3.1 Pro, GPT-5.6, through the Gateway, using the AI SDK 7 `reasoning` option.
- APIs: AI SDK 7 `generateImage`, `experimental_generateVideo`, and `generateText` or `streamText`. AI SDK 7 needs Node 22 or later and ESM.

### 3.2 Job layer: durable generation with Vercel Workflow
- Every paid generation is a **Workflow** (`"use workflow"` and `"use step"`, GA since April 2026), running on Vercel Queues with managed persistence. Video and multi-shot chains no longer block a request.
- Steps: `admit` (auth, BotID, rate limit) → `debit` (an idempotent ledger RPC with a request key) → `generate` (registry model, with fallbacks) → `store` (through the media storage adapter in 3.3) → `link` (asset row and graph edges) → `notify`. A failure after `debit` triggers a `refund` step.
- `generation_jobs` (Supabase, RLS): owner, kind, model, inputs, status, steps, cost, debit id, error, timestamps.
- **Streaming:** the workflow writes progress (queued, generating, a preview frame, stored) to a stream. The UI subscribes through the AI SDK UI stream, so galleries fill in live and survive a page reload.

### 3.3 Asset and graph layer
- **Storage follows the estate decision: Cloudflare R2 through the Starlight Media Platform** (`agentic-ops/media-platform`), with Vercel still hosting the app.
  - User creations go to `portfolio-media-private`, served by short-lived HMAC URLs from `media-api.starlightintelligence.org`.
  - Published or public creations are promoted into `portfolio-media-public` under content-addressed keys (`v1/arcanea/<category>/<sha256>.<ext>`).
  - Originals go to `portfolio-media-archive`.
  - Today's Vercel Blob flow (`/api/imagine/save`, `/gallery`) stays only during the transition, behind a `MediaStore` adapter (`put`, `signedUrl`, `promote`), so the cutover follows the media platform's copy-and-cutover stages.
- `assets`: owner, kind (image, video, model3d, audio), the storage `object_key` and bucket, a sha256, width, height, duration, model, seed, prompt and enhanced prompt, `parent_asset_id` (remix lineage), `job_id`, visibility, moderation status.
- `asset_links`: an asset linked to a world, character, scene or recipe, with a role (reference, keyframe, final, variant).
- Galleries are queries over `assets`, not storage listings: by owner, by world, by character, and a public feed. Images use `next/image` with the media domain allowed; video uses a signed URL plus a poster frame, with HLS later.
- Build on #472 (owner-scoped media library) rather than a second gallery.

### 3.4 Consistency layer: characters and the world style bible
- A **character** keeps a reference set of asset ids. That's our Soul ID equivalent, but it lives in the world and doesn't need training. References go to models that accept image inputs: Gemini image edit, gpt-image-2 edit, FLUX, and Veo or Wan first frames.
- The **world style bible** holds palette, lens, lighting and texture as structured prompt fragments. It extends the existing SPARK.SHAPE.SHARPEN enhancer. A canon check runs before anything is published.
- **Camera language** (the Cinema Studio analog): a typed `shot` spec (lens, move, framing, duration, first and last frame) compiled into each model's prompt and parameters.

### 3.5 The Director (agentic, human-approved)
- An AI SDK 7 agent. Use `WorkflowAgent` from `@ai-sdk/workflow` so a multi-step plan is durable.
- Tools: `plan_shots`, `generate_image`, `edit_image`, `generate_video`, `link_asset`, `canon_check`, `world_compile`. The world tools come from `arcanea-mcp`.
- **Spend needs a human yes.** The Director proposes a plan with a credit estimate, and nothing paid runs until the creator approves it.
- **Generative UI**, in three levels (CopilotKit's taxonomy):
  - *Controlled* first: typed AI SDK tool parts that render our own components (shot card, storyboard strip, character sheet, cost-and-approve bar), using Arcanea design tokens.
  - *Declarative* later: A2UI or Open-JSON-UI for Director-composed layouts.
  - *Open-ended* only at the MCP edge: MCP Apps.
- Prompt chains become **recipes**: saved, forkable workflow definitions such as "portrait → 3 variants → keyframe → 8 s Veo shot".

### 3.6 Canvas (the Higgsfield Canvas analog)
- A node graph of steps (prompt, image, edit, video, upscale, link) built on React Flow (xyflow, MIT). A saved graph is a recipe, and running it starts the workflow from 3.2. The Director can draft a canvas for the creator to edit.

### 3.7 MCP: parity, then beyond it
- A hosted remote MCP at `mcp.arcanea.ai` (OAuth) exposing creation and world tools, with MCP Apps UI so a Claude or ChatGPT user gets real cards. Higgsfield has MCP. Ours adds world memory: `world_compile`, `canon_check`, character references, lineage.

### 3.8 Trust and economics
- Admission on every paid route: an auth check, then an idempotent debit that is confirmed before the provider call. #449 and #524 start this.
- BotID (`checkBotId`) on the generation endpoints, Firewall rate limits, per-user daily caps, a cost ceiling per job, moderation (the provider's safety filters plus our own checks), and spend alerts.
- No credit-pressure UI (dark patterns), in line with the audit.

### 3.9 Observability
- AI Gateway usage logs, Vercel Observability, and an OTel trace per job through `@vercel/otel` and `instrumentation.ts`. Evals on Director plans: shot coverage, canon violations, cost against estimate.

## 4. Build plan (each phase is one lane with a five-line contract and its own PRs)

| Phase | Deliverable | Done when |
|---|---|---|
| **P0 trust (now)** | #449 generate admission and #524 video and enhance admission merged; atomic idempotent debit RPC fixing the ledger column mismatch; BotID on generate and animate; Next 16.3.8 | An anonymous POST to any paid route returns 401; a signed-in POST without credits returns 402; the ledger shows exactly one debit per generation |
| **P1 registry and assets** | AI SDK 7 and AI Gateway image generation through `lib/models/registry.ts`; `assets` and `asset_links` tables with RLS; a `MediaStore` adapter (R2 through the Starlight Media Platform, with Blob only as the transition fallback); gallery reads `assets` (merged with #472) | Images come only through the Gateway; every saved image has an asset row; preview e2e passes |
| **P2 durable video** | Workflow-based video (Veo 3.1 and Wan through the Gateway, Kling only as a fallback); `generation_jobs`; streamed progress; refund on failure; video gallery | A 1080p, 8 s clip completes via the workflow and survives a page reload; a failed job refunds |
| **P3 characters and worlds** | Character reference sets, world style bible, shot spec, profile graph (world → characters → assets), remix lineage | One character renders consistently across 4 images and 1 clip; the profile shows the graph |
| **P4 Director and generative UI** | WorkflowAgent Director with approval-gated spend; shot cards, storyboard and cost bar; recipes | From one sentence, the Director proposes a 4-shot plan with a cost, runs it after approval, and links every asset |
| **P5 canvas and MCP** | React Flow canvas and recipes; hosted `mcp.arcanea.ai` with MCP Apps; public remix feed | A recipe runs from the canvas and from Claude through MCP with the same result |

## 5. Decisions for Frank
1. Credit prices per model class, especially video.
2. Whether Kling or Seedance justify keeping fal.ai beside the Gateway.
3. Public feed and moderation policy.
4. Order of P3 against P4. Recommendation: P3 first, because consistency is what creators pay for.

Sources: Higgsfield feature summaries ([geo.higgsfield.ai](https://geo.higgsfield.ai/higgsfield-ai-features-worth-knowing), [The Rundown](https://www.therundown.ai/tools/higgsfield)); Vercel AI Gateway image and video docs (vercel.com/docs/ai-gateway/modalities); Vercel Workflow ([examples.vercel.com/workflow](https://examples.vercel.com/workflow)); CopilotKit generative UI ([github.com/CopilotKit/generative-ui](https://github.com/CopilotKit/generative-ui)).
