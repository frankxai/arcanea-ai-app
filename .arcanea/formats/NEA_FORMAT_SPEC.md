# .nea Format Specification v0.1

> "The birth certificate of creative work."

## What is a .nea file?

A `.nea` file is a **tokenizable artifact** — a creative output that has provenance, ownership, and optionally on-chain representation. It is the bridge between a git repository and a blockchain.

The name comes from Arcanea — the "nea" suffix meaning "of Arcanea" or "born from the arc."

Unlike `.arc` (which tracks a creative journey), `.nea` captures a **finished artifact** — something that was created, is worth preserving, and might be worth owning.

## What makes .nea different from .md

| Property | .md | .nea |
|----------|-----|------|
| Provenance | Git blame | Git blame + origin_arc + origin_commit + creator chain |
| Ownership | Whoever has the repo | Explicit `creator` + optional on-chain `owner` |
| Mintable | No | Yes — `starlight mint` produces ERC-721 metadata |
| Rarity | No concept | Encoded (common → mythic) |
| Display | Rendered text | Rendered as a card/badge with image, colors, rarity |
| Verification | None | Hash of content can be verified against chain |

## When to create a .nea file

A `.nea` file is created when:
- A Gate milestone is completed (auto-mint)
- A sprint finishes at 100% velocity (badge)
- A creative work reaches `evolved` phase and deserves preservation
- A user explicitly mints an achievement
- A collaborative project ships a deliverable

A `.nea` file is NOT for:
- In-progress work (use `.arc`)
- Notes or logs (use `.md`)
- Tasks or sprints (use `.arc`)

## Schema

### Required Fields

```yaml
---
nea_version: 1                  # Format version (always 1 for now)
id: string                      # Globally unique: <project>-<type>-<seq>
type: enum                      # achievement | badge | artifact | certificate | relic | creation
title: string                   # Display name
description: string             # One-line summary
created: date                   # ISO 8601
creator: string                 # Who created this (username or agent name)
---
```

### Artifact Metadata

```yaml
---
# Rarity (determines visual treatment)
rarity: enum                    # common | uncommon | rare | epic | legendary | mythic

# Arcanea Alignment
element: enum                   # fire | water | earth | wind | void
gate: number                    # 1-10
guardian: string                # Associated Guardian

# Provenance — where this came from
origin_project: string          # Project ID
origin_arc: string              # The .arc file ID that produced this
origin_sprint: string           # Sprint ID (optional)
origin_commit: string           # Git SHA (optional — strongest provenance)
contributors: string[]          # Everyone who contributed
---
```

### Display Properties

```yaml
---
# Visual rendering
image: string                   # Path to image asset (relative)
animation: string               # Path to animation (optional)
colors: string[]                # Hex colors for rendering [primary, secondary, accent]
icon: string                    # Phosphor icon name (e.g., "PhTrophy")
---
```

### On-Chain Fields (all optional, future)

```yaml
---
# Web3 — all null/false until minted
chain: string | null            # ethereum | polygon | base | solana
contract: string | null         # Contract address
token_id: number | null         # On-chain token ID
metadata_uri: string | null     # IPFS CID or Arweave URI
content_hash: string | null     # SHA-256 of the markdown body (for verification)
minted: boolean                 # false until on-chain
minted_at: date | null          # When it was minted
minted_by: string | null        # Wallet address that minted
owner: string | null            # Current wallet owner (may differ from minter after transfer)
royalty_bps: number | null      # Royalty in basis points (250 = 2.5%)
---
```

## The Minting Pipeline

When minting works, the flow is:

```
1. Creative work reaches `evolved` in its .arc file
2. Creator runs `starlight mint <nea-file>` (or auto-mint triggers)
3. CLI reads .nea file
4. Computes content_hash (SHA-256 of markdown body)
5. Generates ERC-721 metadata JSON:
   {
     "name": title,
     "description": description,
     "image": "ipfs://...",       // uploaded from image field
     "attributes": [
       { "trait_type": "Element", "value": element },
       { "trait_type": "Gate", "value": gate },
       { "trait_type": "Guardian", "value": guardian },
       { "trait_type": "Rarity", "value": rarity },
       { "trait_type": "Origin Commit", "value": origin_commit },
       { "trait_type": "Content Hash", "value": content_hash }
     ],
     "external_url": "https://arcanea.ai/nea/<id>"
   }
6. Pins metadata + image to IPFS (via Pinata, nft.storage, or similar)
7. Calls smart contract mint function with metadata_uri
8. Updates .nea file with chain, contract, token_id, metadata_uri, minted fields
9. Commits updated .nea file to git
```

The `.nea` file is always the source of truth. The chain record references it. The git history proves provenance.

## Type System

| Type | Meaning | When created |
|------|---------|-------------|
| `achievement` | Completed a significant milestone | Gate completion, major feature ship |
| `badge` | Earned through consistent behavior | Velocity streaks, contribution counts |
| `artifact` | A creative work worth preserving | Story, song, artwork, tool |
| `certificate` | Proof of completion or mastery | Course, training, Gate mastery |
| `relic` | Historical artifact from the project | First commit, founding document |
| `creation` | User-generated content on the platform | Community posts, collaborative works |

## Rarity System

Rarity affects visual rendering and optional on-chain scarcity:

| Rarity | Visual | Meaning | Scarcity |
|--------|--------|---------|----------|
| `common` | Simple border | Regular achievement | Unlimited |
| `uncommon` | Subtle glow | Notable accomplishment | Unlimited |
| `rare` | Element-colored glow | Significant milestone | Limited per project |
| `epic` | Animated border + particles | Major achievement | Few per project |
| `legendary` | Full animation + sound | Extraordinary feat | One per category |
| `mythic` | Custom visual treatment | Once-ever achievement | Unique |

## Agent Integration

### Reading .nea files
Agents read `.nea` files to understand:
- What has been accomplished (provenance)
- What the creator values (what they chose to mint)
- Project maturity (more artifacts = more mature project)

### Creating .nea files
Agents can propose `.nea` files when:
- A milestone completes
- An `.arc` file reaches `evolved` phase
- Exceptional work is recognized

Agents MUST NOT:
- Auto-mint without user approval
- Set `minted: true` without an actual on-chain transaction
- Create `.nea` files for trivial achievements (no participation trophies)

## Rendering

### Terminal
```
╔══════════════════════════════════════╗
║  ★ RARE                    ◆ Earth  ║
║                                      ║
║  Gate Opener — Foundation            ║
║  Gate 1 · Lyssandria · 174 Hz       ║
║                                      ║
║  Completed Gate 1: Foundation        ║
║  milestone for the Starlight         ║
║  Intelligence System                 ║
║                                      ║
║  ─────────────────────────────────── ║
║  Created: 2026-03-31                 ║
║  Origin: sis @ abc123d               ║
║  Minted: ✗ not yet                   ║
╚══════════════════════════════════════╝
```

### Web
Rendered as collectible cards with:
- Rarity-specific border animations
- Element-themed background gradients
- Guardian avatar watermark
- Gate progress ring
- Mint button (if unminted and user is creator)
- Chain badge (if minted — shows network + link to explorer)

### Gallery
Users' `.nea` collections display on their profile as an achievement wall. The gallery groups by rarity, element, or gate.

## File Naming Convention

```
<project>-<type>-<descriptor>.nea

Examples:
  arcanea-achievement-gate-1-foundation.nea
  arcanea-badge-velocity-streak-5.nea
  arcanea-artifact-godbeast-chronicles-vol1.nea
  arcanea-relic-first-commit.nea
```

## Verification

Anyone can verify a `.nea` file's authenticity:

1. **Git verification**: `git log --follow <file>.nea` shows full creation history
2. **Content verification**: Hash the markdown body, compare to `content_hash`
3. **Chain verification**: Look up `token_id` on `contract` address, verify `metadata_uri` matches

This triple verification (git + hash + chain) makes `.nea` files tamper-evident even without blockchain — the chain is optional extra assurance.
