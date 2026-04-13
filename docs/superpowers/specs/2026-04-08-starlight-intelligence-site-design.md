# Starlight Intelligence Site — Design Spec

**Date:** 2026-04-08
**Domain:** starlightintelligence.org
**Repo:** frankxai/Starlight-Intelligence-System (site/ directory)
**Deploy:** Vercel

## Vision

A calm, beautiful web experience for browsing public Starlight Vaults — memory gardens of humans and agents. GitHub-native, zero backend, forkable by anyone.

## Architecture

- **Framework:** Next.js 15 (App Router, RSC, ISR)
- **Styling:** Tailwind CSS 4
- **Data source:** GitHub API → reads JSONL/MD files from public repos
- **Hosting:** Vercel (free tier viable)
- **Database:** None (GitHub IS the database)

## Data Format

Each public vault is a GitHub repo (or fork of SIS) containing:
```
public-vault/
├── profile.json          # { name, bio, avatar, links }
├── strategic.jsonl       # one JSON object per line
├── technical.jsonl
├── creative.jsonl
├── operational.jsonl
├── wisdom.jsonl
└── horizon.jsonl
```

Entry schema (per JSONL line):
```json
{
  "insight": "string (or 'wish' for horizon)",
  "category": "string",
  "confidence": "low|medium|high",
  "tags": ["string"],
  "source": "string",
  "createdAt": "ISO 8601"
}
```

## Vault Registry

`vault-registry.json` in the SIS repo root:
```json
{
  "vaults": [
    {
      "slug": "frank",
      "name": "Frank",
      "repo": "frankxai/Starlight-Intelligence-System",
      "path": "public-vault",
      "avatar": "https://github.com/frankxai.png",
      "bio": "Builder of Arcanea"
    }
  ]
}
```

## Routes

| Route | Purpose | Data |
|-------|---------|------|
| `/` | Hero + SIS explanation + live river of recent entries + Deploy CTA | All vaults, latest entries |
| `/vaults` | Directory of public vaults | vault-registry.json |
| `/vaults/[slug]` | Individual vault view — timeline of entries | GitHub API → repo JSONL |
| `/vaults/[slug]/[category]` | Category-filtered view | Single JSONL file |
| `/docs` | How to deploy, configure, connect agents | MDX |
| `/api/vaults` | JSON list of all registered vaults | vault-registry.json |
| `/api/vaults/[slug]` | Full vault data as JSON (for agents) | GitHub API |

## Design System

- **Palette:** Slate-900 bg, white text, blue-500 accents, amber-400 for horizon/vision entries
- **Typography:** Inter (body), JetBrains Mono (code/tags), system sans (headings)
- **Cards:** rounded-xl, subtle border, hover glow
- **Animations:** Subtle fade-in on scroll, no heavy motion
- **Tone:** Calm, legible, minimal — like a well-kept notebook

## Agent API

`GET /api/vaults/[slug]` returns:
```json
{
  "name": "Frank",
  "slug": "frank",
  "lastUpdated": "2026-04-08T...",
  "entries": {
    "strategic": [...],
    "technical": [...],
    "creative": [...],
    "operational": [...],
    "wisdom": [...],
    "horizon": [...]
  },
  "meta": {
    "totalEntries": 19,
    "source": "github:frankxai/Starlight-Intelligence-System"
  }
}
```

## Shared Components (future @starlight/vault-renderer)

- `VaultCard` — preview card for directory listing
- `EntryTimeline` — chronological list of vault entries
- `EntryCard` — single insight rendered beautifully
- `CategoryNav` — 6 vault category tabs
- `VaultRiver` — live scrolling feed of recent entries
- `DeployButton` — one-click Vercel deploy fork

## Privacy Model

- Only files in `public-vault/` are ever read or displayed
- Local ~/.starlight/ vaults are NEVER exposed
- Users explicitly opt-in by adding public-vault/ to their fork
- The site has no write access — read-only from GitHub

## v1 Scope

- Frank's vault as first showcase
- Static generation with ISR (revalidate: 3600)
- No auth, no write, no Supabase
- Mobile responsive
- Agent-readable API
