---
description: "NFT collection strategy — lore, repo architecture, workflow planning, deployment roadmap"
---

# /nft-strategy — Collection Strategy & Planning

## When To Use
Before generating any NFTs. This is the PLANNING command. `/nft` is the EXECUTION command.

## Workflow

### 1. Collection Identity
- **Name**: What's this collection called?
- **Supply**: How many? (10 preview, 100 sample, 1K test, 10K production)
- **Chain**: Base (default), Ethereum, Zora, Solana
- **Lore hook**: One paragraph that explains WHY this collection exists in the Arcanea universe
- **Numbering**: `[Collection Name] #XXXX` — NO character names at scale

### 2. Trait Architecture
Define all trait categories with rarity weights:

```
TRAIT CATEGORIES (for a 10K collection):
├── Origin Class (12 options) — determines visual species/type
├── Element (7 options) — determines color accent
├── Rank (5 options) — determines Starlight Mark shape + power level
├── Sacred Gear (6 options) — the statement piece
├── Hair Style (15+ options) — primary visual differentiator
├── Hair Color (10+ options)
├── Eye Style (8+ options)
├── Skin Tone (10+ options)
├── Outfit (10+ options)
├── Accessory (8+ options)
└── Background Color (10+ options)
```

### 3. Rarity Distribution
Target for 10K collection:
- Common (40%): Apprentice rank, Arcan/Gate-Touched origin, Gate Chain gear
- Uncommon (25%): Mage rank, Synth/Bonded/Celestial origin
- Rare (20%): Master rank, Voidtouched/Awakened/Eldrian/Shadowkin origin
- Legendary (10%): Archmage rank, Bonded(Godbeast)/Starborn origin
- Mythic (5%): Luminor rank, Architect origin, Crystal Crown gear

### 4. Repo Architecture
```
arcanea-nft-forge/           ← The engine (TypeScript package)
├── src/                     ← Trait engine, prompt builder, quality gates
├── contracts/               ← ERC721A + ForgeFactory
├── agents/                  ← NFT Art Director agent
├── skill/                   ← Skill definitions
└── README.md

arcanea-nft-collections/     ← The collections (content)
├── the-creators/            ← First collection
│   ├── COLLECTION.md
│   ├── characters.json
│   ├── images/
│   ├── metadata/
│   ├── prompts/
│   └── rarity-report.md
├── godbeasts/               ← Future: 10 Godbeast 1/1s
├── guardians/               ← Future: 10 Guardian 1/1s
└── README.md
```

### 5. Naming Convention
- **Collection pieces**: `[Collection] #XXXX` (numbered, no names)
- **1/1 hero pieces**: CAN have names (Lyssandria, Draconia — these are canon characters)
- **Traits**: Use origin class names from FACTIONS.md (Arcan, Synth, Bonded, etc.)
- **Sacred Gear**: Use the 6 canonical types

### 6. Visual Style Decisions
- **Rendering tier**: premium3d (default for collections) or cinematic (for 1/1s)
- **Design style**: Document the "look" — what reference (Clone X? Azuki? Own style?)
- **Composition**: 3/4 view, head+shoulders, flat bg (LOCKED from Art Direction Bible)
- **Trait visibility**: Should hands be visible? More body? Current crop is tight head+shoulders

### 7. CANON RULES (Never Violate)
- Godbeasts are CREATURES, not character origins
- Bonded humans who bond with Godbeasts are "Bonded" origin with "Bond Tier: Godbeast" sub-trait
- Origin classes come from FACTIONS.md — don't invent new ones without canon review
- Starlight Mark shapes are locked per rank (dot → diamond → triangle → pentagon → star)
- Sacred Gear types are the canonical 6 — don't add new ones without design review
- Elements are the canonical 7 (Fire, Water, Earth, Wind, Void, Spirit, All)

### 8. Process
```
/nft-strategy  →  Plan collection, define traits, set rarity
/nft           →  Generate images with Art Director mindset
/nft-gallery   →  Review, score, stage approved pieces
/nft deploy    →  IPFS + smart contract deployment
```
