---
description: "AI-native NFT PFP collection engine — generate, curate, deploy"
argument-hint: "<subcommand: generate|collection|preview|metadata|deploy|evolve|style>"
---

# /arcanea-nft-pfp — NFT Forge Collection Engine

> See CONNECTORS.md for tool mappings

## Overview

Generate complete NFT PFP collections with engineered taste. For ANY creator — define your style, design your traits, generate with AI, enforce quality, deploy to chain.

## MANDATORY: Pre-Flight Briefing

**Before ANY generation or deployment, ALWAYS present this briefing and get explicit approval:**

```
NFT FORGE — PRE-FLIGHT BRIEFING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT I'LL DO:
  [describe the specific action]

PROVIDER (recommend based on stage):
  [ ] Nano Banana 2 (gemini-3.1-flash) — concept/preview, cheap
  [ ] Nano Banana Pro (gemini-3-pro) — best API quality
  [ ] Grok 2 Image — primary API provider, ~$0.05/img
  [ ] FLUX.2 Max/Pro (OpenRouter) — premium detail
  [ ] GPT-5 Image (OpenRouter) — best text rendering
  [ ] ComfyUI local — production batch, LoRA+ControlNet, FREE
  [ ] ComfyUI cloud (RunPod) — production, no local GPU

ESTIMATED COST:
  Images: [N] x [cost] = $[total]
  Quality scoring: $[amount] (or: skipped / local)
  IPFS: $[amount] (or: not yet)
  Contract: $[amount] (or: not yet)
  ──────────────
  TOTAL: $[amount]

APPROACH:
  Style: [which Style Pack or custom]
  Model: [which checkpoint/model]
  Quality: [standard / premium thresholds]
  Chain: [Base / Ethereum / testnet]

Proceed? (yes / adjust / explain more)
```

**Rules:**
- NEVER start generating without showing this briefing first
- NEVER assume which provider to use — ask
- For previews (< 10 images): can use Gemini free tier, still show briefing
- For batches (> 10 images): MUST show cost estimate
- For deployment (IPFS/contract): MUST show chain + gas estimate
- If user says "just do it" or "yolo": show briefing anyway, just faster

## Provider Model Map (Nano Banana = Gemini Image Gen)

| Codename | Model ID (OpenRouter) | Tier | Cost/Image |
|----------|----------------------|------|------------|
| **Nano Banana** | `google/gemini-2.5-flash-image-preview` | Budget | ~$0.001 |
| **Nano Banana 2** | `google/gemini-3.1-flash-image-preview` | Default | ~$0.005 |
| **Nano Banana Pro** | `google/gemini-3-pro-image-preview` | Premium | ~$0.02 |
| **FLUX.2 Max** | `black-forest-labs/flux.2-max` | Premium | ~$0.05 |
| **FLUX.2 Pro** | `black-forest-labs/flux.2-pro` | Quality | ~$0.03 |
| **GPT-5 Image** | `openai/gpt-5-image` | Premium | ~$0.05 |
| **Grok 2 Image** | Direct xAI API | Primary | ~$0.05 |
| **ComfyUI** | Local Flux/SDXL + LoRA | Production | $0 (electricity) |

**None of the API models (Gemini, FLUX, GPT-5, Grok) support LoRA or ControlNet.**
For style-locked batch production, ComfyUI is the only option.

## Recommended 4-Stage Pipeline

| Stage | Provider | Purpose | Cost (10K collection) |
|-------|----------|---------|----------------------|
| 1. CONCEPT | Nano Banana 2 | Explore style, generate mood board (50-100 images) | $0-5 |
| 2. STYLE LOCK | ComfyUI | Train LoRA on best concept images | $0-10 |
| 3. PRODUCTION | ComfyUI + LoRA | Generate 30K candidates, quality gate selects 10K | $15-800 |
| 4. HERO PIECES | Nano Banana Pro or FLUX.2 Max | Marketing/showcase (10-50 images) | $1-10 |

**Stage 1 uses Gemini for what it's best at:** fast creative exploration.
**Stage 3 uses ComfyUI for what only it can do:** style-locked batch production.
Don't pick one — use both at the right stage.

## Provider Decision Guide

| Situation | Best Provider | Why |
|-----------|--------------|-----|
| Quick concept (1-5 images) | Nano Banana 2 | Cheapest, already configured |
| Style exploration (10-50) | Nano Banana 2 or Pro | Fast iteration, good quality |
| Preview grid (25-100) | ComfyUI local | Need consistency, LoRA support |
| Production batch (1K-10K) | ComfyUI + LoRA | Only option with style lock |
| Hero/marketing pieces | Nano Banana Pro or FLUX.2 Max | Maximum single-image quality |
| Text on image | FLUX.2 or GPT-5 Image | Best text rendering |
| Cheapest possible | ComfyUI local or Nano Banana | $0 per image |

## Cost Reference

| Scale | ComfyUI Local | Cloud (RunPod) | Nano Banana 2 | Full Deploy |
|-------|--------------|----------------|---------------|-------------|
| 10 preview | $0 | $0.50 | $0.05 | N/A |
| 100 samples | $0-1 | $5-10 | $0.50 | N/A |
| 1K test | $2-5 | $30-80 | $5 | +$25 (Base) |
| 10K production | $15-30 | $300-800 | $50 | +$25-250 |

*Nano Banana costs are approximate via OpenRouter. Free tier quotas apply.*

*Cloud costs assume 3 candidates per piece (generate 3, pick best via quality gates)*

## Rendering Tier System

**ALWAYS ask which tier before generating. The tier changes the entire prompt strategy.**

| Tier | Command Flag | Visual Quality | Reference |
|------|-------------|---------------|-----------|
| `graphic` | `--tier graphic` | Flat fills, bold shapes, clean | Azuki, y00ts |
| `illustrated` | `--tier illustrated` | Painted, warm shading, textured | DeGods S1, BAYC |
| `premium3d` | `--tier premium3d` | Full 3D, SSS, material diversity | Clone X, DeGods S2 |
| `cinematic` | `--tier cinematic` | Hyper-detailed, film-grade | Captainz, hero 1/1s |

**The tier is 100% prompt engineering — same model, same cost.** Don't default to `graphic`.
For collections meant to sell, default to `premium3d`. For brand/clean collections, use `graphic`.

## Subcommands

### `/arcanea-nft-pfp generate`
Generate a single character or small batch from trait specifications.

**Workflow:**
1. Ask for: rendering tier, style pack (or custom), trait descriptions, quantity
2. Load the rendering tier config from `RENDERING_TIERS[tier]`
3. If Arcanea pack: overlay pack theme onto tier rendering config
4. Build generation prompt with SPECIFIC art direction (never generic quality tokens)
5. Generate via Gemini API (direct key in `.nano-banana-config.json`) or OpenRouter
6. Save to `output/` and open for review
7. Present results with assessment

### `/arcanea-nft-pfp collection`
Design a full 10K collection from scratch.

**Workflow:**
1. **Concept**: Ask for collection name, theme, supply, target audience
2. **Style**: Choose style pack or upload reference images (10-50)
3. **Traits**: Define trait categories interactively:
   - Category name, required/optional, traits with rarity weights
   - Semantic descriptions for each trait
   - Build compatibility matrix (what can't combine)
4. **Proportions**: Set body ratios, crop, framing
5. **Lighting**: Lock direction, quality, shadow style
6. **Mood**: Define emotional band (primary + allowed + rejected)
7. **Preview**: Generate 25-sample grid for approval
8. **Generate**: Full batch with quality gates
9. **Export**: Metadata JSON + image files ready for deployment

### `/arcanea-nft-pfp preview`
Generate a preview grid (25-100 samples) to test visual consistency.

**Workflow:**
1. Load existing collection schema or create quick one
2. Generate N samples across rarity tiers
3. Arrange in grid layout
4. Run quality gate stats (pass rate, gate-by-gate scores)
5. Present grid with rarity distribution analysis

### `/arcanea-nft-pfp metadata`
Generate or regenerate ERC-721 metadata for a collection.

**Workflow:**
1. Load collection schema and trait selections
2. Configure: name template, description template, base URI, royalty info
3. Generate metadata JSON per token
4. Generate collection-level metadata (contractURI)
5. Export as files ready for IPFS upload

### `/arcanea-nft-pfp deploy`
Deploy collection to IPFS and blockchain.

**Workflow:**
1. **IPFS Upload**: Upload images + metadata via Pinata SDK
2. **Contract**: Deploy ERC721A via ForgeFactory (choose chain)
3. **Configure**: Set mint price, max per wallet, royalty BPS
4. **Allowlist**: Generate Merkle tree from address list
5. **Reveal**: Configure placeholder → real metadata swap
6. **Verify**: Contract verification on block explorer
7. **Mint Page**: Generate embeddable mint widget

### `/arcanea-nft-pfp evolve`
Update traits on mutable NFTs (post-mint).

**Workflow:**
1. Define evolution rules (what triggers change)
2. Generate new metadata for evolved tokens
3. Update IPFS metadata
4. Emit on-chain events

### `/arcanea-nft-pfp style`
Manage Style Packs — browse, preview, create, export.

**Workflow:**
1. `list` — Show all available style packs with previews
2. `preview <pack-id>` — Generate 10 samples in this style
3. `create` — Interactive Style Pack builder
4. `export <pack-id>` — Export as shareable JSON
5. `import <path>` — Import external style pack

## Arcanea Style Packs (Built-In)

| Pack | Vibe | Use For |
|------|------|---------|
| `arcanea-lumina` | Radiant, scholarly, gold | Divine/elegant collections |
| `arcanea-nero` | Mysterious, void, purple | Dark/mystical collections |
| `arcanea-pyros` | Fierce, ember, crimson | Warrior/action collections |
| `arcanea-aqualis` | Fluid, oceanic, teal | Ethereal/healing collections |
| `arcanea-starlight` | Military, cosmic, silver | Heroic/noble collections |
| `arcanea-cosmic-luxury` | Flagship Arcanea aesthetic | Premium/flagship collections |

## Quality Thresholds

| Gate | Standard | Premium |
|------|----------|---------|
| Aesthetic Score | > 7.0 | > 8.0 |
| Style Consistency | > 0.80 | > 0.85 |
| Palette Compliance | Delta-E < 10 | Delta-E < 7 |
| Thumbnail Test | 15% area | 20% area |
| Uniqueness | LPIPS > 0.15 | LPIPS > 0.20 |

## Integration Points

- **ComfyUI MCP**: `mcp__comfyui__*` for generation workflows
- **Nano Banana**: Image generation fallback
- **Pinata SDK**: IPFS uploads
- **thirdweb SDK**: Contract deployment
- **Supabase**: Collection state, user projects

## Code Location

```
packages/nft-forge/src/
├── trait-engine.ts          # Schema, rarity, compatibility
├── metadata-generator.ts    # ERC-721 metadata
├── prompt-builder.ts        # Trait → prompt construction
├── quality/pipeline.ts      # 6-gate quality enforcement
├── styles/style-pack.ts     # Style Pack system
├── styles/arcanea-packs.ts  # Built-in Arcanea presets
├── comfyui/workflow.ts      # ComfyUI integration
└── contracts/               # Solidity (ERC721A + Factory)
```
