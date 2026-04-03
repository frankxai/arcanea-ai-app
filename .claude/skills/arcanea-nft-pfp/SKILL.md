---
name: arcanea-nft-pfp
description: "AI-native NFT PFP collection engine. Generates 10K+ unique characters with engineered taste, style consistency, and full deployment pipeline. Trigger phrases: NFT, PFP, collection, generative art, mint, traits, rarity, IPFS, smart contract, ERC721."
---

# Arcanea NFT Forge — AI-Native Collection Engine

> *"Taste is not magic — it is the rigorous application of design rules with zero exceptions."*

## What This Skill Does

Generates complete NFT PFP collections where **every piece looks like it belongs** — not by stacking random layers, but by enforcing art direction rules through AI generation with automated quality gates.

**For any creator, not just Arcanea.** Each user defines their own world, style, and traits. Arcanea's mythology is the reference implementation and optional Style Pack.

## Core Architecture

```
CREATOR FLOW:

Define Style → Design Traits → Generate → Quality Gate → Deploy
     │              │              │            │            │
  Style DNA    Trait Matrix    ComfyUI     6-Layer QA    IPFS +
  + LoRA       + Compat.      Workflow     Pipeline     ERC721A
               + Rarity
```

## The Three Engines

### 1. Style Engine
Extracts and enforces visual identity across thousands of generations.

- **Style DNA**: Mathematical fingerprint — palette distribution (LAB space), edge frequency, contrast curve, material rendering style
- **LoRA Training**: 10-50 reference images → fine-tuned model in <5 min (serverless GPU)
- **Style Packs**: Pre-built art direction systems (Arcanea ships 10+ based on Elements/Houses)
- **IP-Adapter**: Reference conditioning at weight 0.5-0.7 for consistency without copying

### 2. Trait Engine
Defines what varies and how — the DNA of the collection.

- **Schema**: Typed trait categories with per-trait rarity weights
- **Compatibility Matrix**: Which traits can/can't combine (Azuki removes 30% of combos)
- **Proportion Template**: Locked body ratios, eye placement, framing
- **Semantic Traits**: Describe traits in words ("golden crown with ember crystals"), not just layer names
- **Rarity Distribution**: Common 50% → Uncommon 25% → Rare 15% → Legendary 7% → Mythic 2% → 1/1

### 3. Quality Gate Pipeline
Automated taste enforcement — no human bottleneck for 95% of pieces.

| Gate | Method | Threshold |
|------|--------|-----------|
| Aesthetic Score | ImageReward / LAION | > 7.0 |
| Style Consistency | CLIP similarity to reference set | > 0.80 |
| Palette Compliance | Delta-E 2000 in LAB space | All colors within 10 |
| Thumbnail Test | 64px downscale + silhouette detection | Character readable |
| Defect Detection | Hand/artifact/asymmetry classifiers | Zero critical defects |
| Uniqueness | Perceptual hash distance (LPIPS) | > 0.15 from all others |

Expected pass rate: 40-60%. Failures regenerate with adjusted prompts.

## PFP Visual DNA (Non-Negotiable)

A PFP is NOT concept art, NOT illustration, NOT a character sheet. It is an ICON.

| Rule | What It Means | Why |
|------|--------------|-----|
| **3/4 angle** | Head turned 30 degrees, never dead-center front | Azuki, Clone X, y00ts all do this — adds depth + personality |
| **Flat solid background** | ONE color, zero gradient, zero texture, zero environment | Character is an icon in a void, not a character in a story |
| **Tight crop** | Head + shoulders, cut at collarbone, fill 75% of frame | Must read as avatar at 48-200px |
| **No narrative** | Character is NOT doing anything, just existing | PFP = portrait, not illustration |
| **Bold shapes** | Chunky geometric forms, not fine detail | Fine filigree disappears at thumbnail size |
| **Trait layers visible** | Each element feels separable: bg / skin / hair / eyes / outfit / accessory | This is how generative collections work — layers must compose |
| **Cool vibe** | Confident, fashion-forward, aspirational | Not fantasy-scholarly, not warrior-fierce — COOL |
| **5-7 colors max per piece** | Hard palette limit, bold color blocking | More colors = visual noise at small scale |
| **Studio lighting** | Consistent warm key light upper-left, cool fill right | Creates "studio photography" consistency across collection |

## Prompt Engineering Rules

**NEVER use these tokens** (they are noise):
- "masterpiece", "best quality", "highly detailed", "sharp focus"
- "museum-grade production value", "cinematic composition"
- "luxury cosmic myth-tech" (vague, means nothing to the model)

**ALWAYS specify these** (they define PFP format):
- Exact camera angle and head rotation
- Exact crop point and frame fill percentage
- Background: "flat solid [specific color] background"
- Rendering style: specific reference (between anime and graphic design)
- Scale test: "readable at 48px thumbnail"
- Trait separability: list the layers explicitly

**Style reference hierarchy** (most effective → least):
1. "Clean stylized illustration between anime and graphic design" (specific)
2. "Bold shapes with clean edges, flat color fills" (visual instruction)
3. "Cool confident expression, half-lidded eyes, closed mouth" (character direction)
4. ~~"masterpiece, best quality, professional"~~ (useless noise — NEVER use)

## 10 Principles of Engineered Taste

1. **Constraint is quality** — Fewer options, more coherence. Hard palette limits.
2. **48px thumbnail test** — Must read as silhouette at thumbnail size (not 64px — 48px).
3. **Curated palette, never random** — 5-7 colors per piece, pre-harmonized.
4. **Light has a contract** — Warm key upper-left, cool fill right. Never changes.
5. **Trait interaction > trait quantity** — Compatibility matrix removes ugly combos.
6. **Bold shapes over fine detail** — Chunky hair masses, clean outfit shapes.
7. **Proportion is sacred** — Fixed base template, infinite variation on top.
8. **Narrow mood range** — Cool/confident only. Reject cute, fierce, scholarly.
9. **Flat background is law** — One solid color. No gradients, no particles, no environment.
10. **Rarity serves aesthetics** — Rare = unusual color combo, never a different rendering style.

## Generation Pipeline

```
1. Trait Selection
   ├── Pick from compatibility matrix respecting rarity weights
   ├── Validate against incompatibility rules
   └── Generate structured prompt from semantic trait descriptions

2. Image Generation (ComfyUI API)
   ├── Base model: Flux/SDXL
   ├── Style LoRA (per-creator, weight 0.7-0.9)
   ├── IP-Adapter reference (weight 0.5-0.7)
   ├── ControlNet: pose + proportion enforcement
   ├── Generate 3-5 candidates per trait combination
   └── Latent space walking for controlled variation

3. Quality Filtering
   ├── Run all 6 quality gates
   ├── Select best candidate per combination
   ├── Log rejection reasons for pipeline refinement
   └── Auto-adjust prompts for systematic failures

4. Post-Processing
   ├── Palette remap to master palette (edge-aware)
   ├── Consistent crop/framing to template
   ├── Color grading pass (unify mood)
   └── Final metadata generation
```

## Deployment Pipeline

```
1. IPFS Upload (Pinata SDK)
   ├── Upload images to per-creator directory
   ├── Generate metadata JSON per token
   ├── Pin metadata directory
   └── Store CIDs in project database

2. Smart Contract (ERC721A Factory)
   ├── Clone from audited implementation
   ├── Configure: name, symbol, supply, price, royalty
   ├── Reveal mechanism (placeholder → real URI)
   ├── Multi-chain: Base, Ethereum, Zora, Arbitrum
   └── Deploy cost: ~$5-15 via EIP-1167 clones

3. Mint Experience
   ├── Hosted mint page (or embeddable widget)
   ├── Wallet connect + credit card (Crossmint)
   ├── Allowlist management
   └── Real-time mint tracking
```

## Style Tiers (Rendering Quality Levels)

The skill supports 4 rendering tiers. Each tier uses different prompt strategies on the SAME model.
The tier determines the visual complexity, not the content — any Arcanea theme works with any tier.

| Tier | Rendering | Reference | When To Use |
|------|-----------|-----------|-------------|
| **Graphic** | Flat fills, clean outlines, bold shapes | Azuki, y00ts, Doodles | Simple/clean brand, maximum trait clarity |
| **Illustrated** | Soft shading, painterly touches, warm | DeGods S1, BAYC | Character-rich collections, mid-detail |
| **Premium 3D** | Full 3D render, SSS, material diversity | Clone X, DeGods S2 | Flagship/premium collections, "worth thousands" feel |
| **Cinematic** | Hyper-detailed, environmental hints | Captainz, Beeple | Ultra-premium 1/1s, hero pieces |

### Tier Prompt Differences

**Graphic tier** prompts specify:
- "Flat color fills, zero gradient on fabric, bold geometric shapes"
- "Thin outlines on silhouette, interior shapes by color contrast"
- Simple material language (matte black, solid teal)

**Premium 3D tier** prompts specify:
- "Full 3D rendered with subsurface scattering on skin"
- "Each material renders differently: matte fabric absorbs light, brushed metal shows grain, polished gold has sharp specular, crystal glows with internal light"
- "Volumetric rim light wrapping around hair creating edge separation"
- "Visible temperature shift: warm amber highlights, cool purple-grey shadows"
- "Shallow depth of field: far shoulder softer than near eye"

**The difference between tiers is 100% prompt engineering — same model, same cost.**
Never use "masterpiece best quality" in any tier. Use specific rendering instructions.

### What Makes Premium 3D "Worth Thousands"

These specific visual elements create the premium feel:
1. **Material diversity** — Each surface responds to light differently in the SAME image
2. **Subsurface scattering** — Light glowing through ear tips, nose bridge, crystal
3. **Rim light halo** — White-gold edge light creating cinematic edge separation
4. **Color temperature shift** — Warm highlights + cool shadows = visual richness
5. **Micro-texture** — Stylized skin pores, fabric weave, brushed metal grain
6. **Glowing elements** — Crystal/tech elements that emit light and affect nearby surfaces
7. **Specular variety** — Sharp specular on metal, soft diffuse on skin, prismatic on crystal

## Arcanea Style Packs (Built-In)

Pre-configured THEME systems (combine with any rendering tier above):

| Pack | Palette | Signature Elements | Best For |
|------|---------|-------------------|----------|
| **Lumina** | White, gold, amber | Crystal circlet, light-woven fabric, golden emblem | Elegant/divine collections |
| **Nero** | Black, purple, silver | Void-silk, obsidian accessories, star-pattern details | Dark/mystical collections |
| **Pyros** | Crimson, orange, gold | Ember crystals, volcanic glass armor, flame accents | Action/warrior collections |
| **Aqualis** | Azure, teal, silver | Flowing crystal jewelry, pearl details, water motifs | Fluid/ethereal collections |
| **Starlight** | Silver, cosmic blue, gold | Star-forged armor, constellation cloak, military insignia | Heroic/noble collections |
| **Cosmic Luxury** | Teal, gold, charcoal | Sacred obsidian + celestial gold + liquid light channels | Premium/flagship collections |

## File Structure

```
packages/nft-forge/
├── src/
│   ├── index.ts                 # Main exports
│   ├── trait-engine.ts          # Schema, rarity, compatibility
│   ├── style-engine.ts          # Style DNA, LoRA management
│   ├── prompt-builder.ts        # Trait → structured prompt
│   ├── metadata-generator.ts    # ERC-721 metadata JSON
│   ├── quality/
│   │   ├── aesthetic-scorer.ts  # ImageReward / LAION scoring
│   │   ├── palette-checker.ts   # Delta-E compliance
│   │   ├── thumbnail-test.ts    # 64px silhouette detection
│   │   ├── uniqueness.ts        # Perceptual hash distance
│   │   └── pipeline.ts          # Orchestrates all gates
│   ├── styles/
│   │   ├── style-pack.ts        # Style Pack definition
│   │   └── arcanea-packs.ts     # Built-in Arcanea presets
│   ├── comfyui/
│   │   ├── workflow.ts          # ComfyUI API client
│   │   ├── templates/           # Workflow JSON templates
│   │   └── batch-generator.ts   # Batch generation orchestrator
│   └── contracts/
│       ├── ERC721AForge.sol     # Base collection contract
│       ├── ForgeFactory.sol     # Clone factory
│       └── deploy.ts            # Deployment scripts
├── package.json
└── tsconfig.json
```

## References

- `references/taste-engineering.md` — Deep analysis of top NFT collection design systems
- `references/comfyui-workflows.md` — Workflow templates and configuration
- `references/style-dna-spec.md` — Style DNA format specification
- `references/deployment-guide.md` — IPFS + contract deployment walkthrough
