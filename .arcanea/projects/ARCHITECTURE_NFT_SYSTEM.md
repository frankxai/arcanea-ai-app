# Arcanea NFT System Architecture

## Overview

Complete end-to-end architecture for NFT generation, curation, deployment, and community management.

```
┌──────────────────────────────────────────────────────────────┐
│                    ARCANEA NFT SYSTEM                         │
│                                                              │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐    │
│  │ GENERATE │──▶│  CURATE │──▶│ DEPLOY  │──▶│ OPERATE │    │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘    │
│       │              │             │              │          │
│   /nft skill     Feedback      IPFS +         Discord +     │
│   Gemini API     Page          ERC721A        Twitter +     │
│   Taste Profile  Art Director  Base chain     arcanea.ai    │
│   Trait Engine   Quality Gate  Mint page      Living NFTs   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              SHARED INFRASTRUCTURE                    │   │
│  │  Supabase │ Vercel │ Pinata │ Claude API │ Gemini   │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Layer 1: Generate

### Trigger
- `/nft` command in Claude Code
- arcanea.ai/forge web UI (future)
- API endpoint (future)

### Process
```
1. Load TASTE_PROFILE.md (golden rules)
2. Load characters.json (dedup check)
3. Load rarity-report.md (distribution gaps)
4. Design characters from FACTIONS.md lore
5. Build prompt: FORMAT + TIER + CHARACTER + ATMOSPHERE + EXPRESSION
6. Call Gemini API (gemini-3.1-flash-image-preview)
7. Save: image + metadata + prompt
8. Update characters.json + rarity report
```

### Files
- `packages/nft-forge/src/trait-engine.ts`
- `packages/nft-forge/src/prompt-builder.ts`
- `packages/nft-forge/src/providers/gemini.ts`
- `scripts/collection-v1-*.js` (batch generators)

### Config
- API key: `.nano-banana-config.json` (gitignored)
- Taste rules: `output/collection-v1/TASTE_PROFILE.md`
- Art direction: `.claude/skills/arcanea-nft-pfp/references/art-direction-bible.md`

## Layer 2: Curate

### Feedback Loop (YOU as Tester)

**URL:** arcanea.ai/forge/collection/feedback

**Flow:**
```
View image → Rate (1-5) → Tag (Face Quality, Sacred Gear, etc.) → Note → Submit
                                          ↓
                               Export as JSON
                                          ↓
                        Claude Code reads feedback
                                          ↓
                    Adjusts prompts for next batch
```

**Feedback tags:** Face Quality, Hair Silhouette, Sacred Gear, Starlight Mark, Expression, Atmosphere, Color Palette, Crop Issue, Eye Direction, Too Busy, Too Simple, Wrong Mood, Premium Feel, Would Buy, Needs Work, Crown Jewel

**Export format:** JSON file per review session, loadable by Claude Code for analysis.

### Quality Gate (Automated)
```
packages/nft-forge/src/quality/pipeline.ts
├── Aesthetic score (>7.0)
├── Style consistency (CLIP >0.80)
├── Palette compliance (Delta-E <10)
├── Thumbnail test (64px readable)
├── Defect detection (hands, artifacts)
└── Uniqueness check (LPIPS >0.15)
```

### Art Director Agent
```
.claude/agents/nft-art-director.md
├── Pre-generation checklist (12 items)
├── Quality scoring rubric (10 dimensions, 100 points)
├── Iteration protocol (diagnose → fix → regenerate)
└── Taste profile integration
```

## Layer 3: Deploy

### IPFS Upload
```
Pinata SDK → upload images/ directory → get CID
          → upload metadata/ directory → get CID
          → update metadata image URIs with real CIDs
```

### Smart Contract
```
contracts/ForgeFactory.sol
├── Deploy implementation (ERC721AForge)
├── Create collection via factory (EIP-1167 clone)
├── Configure: name, symbol, supply, price, royalty
├── Set Merkle root (allowlist)
├── Set phases: CLOSED → ALLOWLIST → PUBLIC
└── Reveal: swap placeholder URI → real metadata URI
```

### Mint Page
```
arcanea.ai/forge/collection
├── Collection preview (live now)
├── Wallet connect (thirdweb SDK)
├── Mint button (calls contract)
├── Reveal countdown
└── Holder dashboard
```

## Layer 4: Operate

### Living NFTs (Dynamic Evolution)
```
packages/nft-forge/src/dynamic-metadata.ts
├── Gate Counter: tracks holder activity
│   ├── Academy lessons completed
│   ├── Content created
│   ├── Lore contributed
│   ├── Hold duration
│   └── Community actions
├── Evolution tiers: Apprentice → Mage → Master → Archmage → Luminor
├── Dynamic metadata endpoint: returns tier-appropriate art
└── Evolution announcements: social sharing when tier changes
```

### Community Agents
```
apps/discord-bot/
├── Lyssandria (Foundation Guardian)
│   ├── /lore — Arcanea knowledge Q&A
│   ├── /reveal — Random character reveal
│   ├── /forge — Preview trait combinations
│   ├── /gates — Show Gate progression
│   └── @mention chat — Full conversational AI
├── Draconia (Twitter via n8n)
│   ├── Daily character reveals
│   ├── Lore threads
│   └── Engagement replies
└── Community Sentinel (moderation)
    ├── Spam detection
    ├── Role assignment
    └── Alert on flagged content
```

### Trait-to-Persona Engine
```
generateAgentPersona(metadata) → Claude system prompt

Each NFT can become a living AI agent with personality
derived from its traits (origin, element, rank, gear).
```

## Automation Workflows

### Daily (Automated)
```
06:00  Draconia posts daily lore (n8n cron)
08:00  Character reveal on Discord (bot scheduled)
12:00  Engagement check — reply to mentions (n8n)
18:00  Community stats update (Supabase → ops dashboard)
```

### On Generation (Claude Code)
```
/nft invoked
  → Load taste profile
  → Check dedup
  → Generate batch
  → Save images + metadata + prompts
  → Update characters.json
  → Update rarity report
  → Log to tracker spreadsheet
```

### On Feedback (You)
```
Visit arcanea.ai/forge/collection/feedback
  → Rate images
  → Tag strengths/weaknesses
  → Export JSON
  → Claude Code reads feedback
  → Adjusts prompt templates
  → Next batch improves
```

### On Deploy (Claude Code)
```
/nft deploy
  → Upload to IPFS (Pinata)
  → Deploy contract (Base)
  → Configure phases
  → Generate Merkle tree
  → Update mint page
  → Announce on Discord + Twitter
```

## Repo Map

| Repo | What | Status |
|------|------|--------|
| `frankxai/arcanea-ai-app` | Main web platform (arcanea.ai) | LIVE, deployed |
| `frankxai/arcanea-nft-forge` | NFT engine, contracts, strategy | 13 commits |
| `frankxai/arcanea` | OSS skills, agents, lore | Active |
| (future) `frankxai/arcanea-agents` | Discord/Twitter bot deployment | Planned |

## Design System (NFT-Specific)

### Colors
| Token | Hex | Use |
|-------|-----|-----|
| `--nft-gold` | #ffd700 | CTA, premium accent, Sacred Gear highlight |
| `--nft-teal` | #2dd4bf | Starlight Mark, interactive elements |
| `--nft-bg` | #09090b | Page background |
| `--nft-surface` | rgba(255,255,255,0.02) | Card backgrounds |
| `--nft-border` | rgba(255,255,255,0.06) | Borders |
| `--nft-text-primary` | #ffffff | Headings |
| `--nft-text-secondary` | rgba(255,255,255,0.50) | Body text |
| `--nft-text-tertiary` | rgba(255,255,255,0.30) | Labels, hints |

### Typography
- Display: Space Grotesk (headings)
- Body: Inter (content)
- Mono: JetBrains Mono (data, code)
- NEVER Cinzel (per existing feedback)

### Components
- Cards: rounded-2xl, border-white/[0.06], bg-white/[0.02]
- Buttons: rounded-lg, teal or gold, semibold
- Tags: rounded-full, small text, toggle state
- Tabs: rounded-xl container with rounded-lg active state
- Inputs: rounded-lg, border-white/[0.1], focus:border-teal
