# Arcanea Publishing House — Architecture Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an open, interconnected Agentic Publishing Intelligence Layer that turns any creator's existing tools into an autonomous publishing house — powered by Claude Managed Agents, MCP orchestration, and the Arcanea World Graph.

**Architecture:** Two-repo, three-tier model. Free open-core engine (arcanea-claw, MIT) runs locally with SQLite + Claude Code. Pro tier deploys 5 Claw agents as Claude Managed Agent sessions orchestrated by Maestro (/ao). Enterprise tier white-labels the full system for clients. Revenue comes from the intelligence layer (World Graph, TASTE scoring, Luminor Coach, Distribution Engine), not infrastructure hosting.

**Tech Stack:** Claude Managed Agents API, Claude Code (local orchestrator), MCP servers (Supabase, Notion, Canva, GitHub, Vercel, arcanea-mcp, ComfyUI), Supabase (shared memory), Pandoc (format conversion), Stripe (billing), Railway (optional self-hosted deploy).

---

## 1. Product Architecture

### Three Tiers

| Tier | Name | Deploy Model | License | Price |
|------|------|-------------|---------|-------|
| Free | ArcaneaClaw Engine | Local: Claude Code + SQLite + subagents | MIT | Free (API costs only) |
| Pro | Publishing Intelligence | Cloud: 5 Managed Agent Claws + Supabase + Notion | BSL / Commercial | $29-99/mo + API usage |
| Enterprise | Publishing House | White-label: Dedicated fleet per client | License deal | Custom |

### Revenue Model (Both Deploy Options)

**Self-Hosted (Railway/Docker):**
- Template license: $29/mo or $199 one-time
- Premium skills pack: $49/mo
- Fleet upgrade (5 Claws): $99/mo
- Support tier: $199/mo

**Managed Agents (Anthropic Cloud):**
- Intelligence subscription: $29-99/mo
- Creator pays Anthropic directly for API usage
- We earn from intelligence layer, not compute

**Key principle:** Revenue comes from IP (agent definitions, World Graph, TASTE, Distribution Engine, Luminor Coach), not from hosting infrastructure.

## 2. System Architecture

### Intelligence Layer (Our IP)

```
MAESTRO (/ao orchestrator)
├── MEDIA CLAW — scan, classify, score, process media assets
├── FORGE CLAW — NFT generation, composition, minting, marketplace
├── HERALD CLAW — social content drafting, scheduling, engagement
├── SCOUT CLAW — market monitoring, trend detection, competitor analysis
├── SCRIBE CLAW — formatting, distribution, translation, documentation
└── SHARED INTELLIGENCE
    ├── World Graph (Supabase 12 tables)
    ├── Canon Verifier (arcanea-mcp validate_canon)
    ├── TASTE Scorer (5D: Canon, Design, Emotional, Technical, Uniqueness)
    ├── Luminor Writing Coach (interactive improvement with world-graph RAG)
    └── Distribution Engine (Kindle, Leanpub, Draft2Digital, NFT, Web, Social)
```

### Connector Layer (Creator's Choice)

Creators choose their workspace. We adapt via MCP:

| Workspace | MCP | Status |
|-----------|-----|--------|
| Notion | mcp__notion__* | Connected |
| Linear | mcp__linear-server__* | Connected |
| Asana | asana MCP server | Available |
| GitHub | mcp__github__* | Connected |
| Canva | mcp__claude_ai_Canva__* | Connected |
| Vercel | mcp__claude_ai_Vercel__* | Connected |
| Google Docs | Google MCP | To add |
| Obsidian | Local filesystem via Claw | Supported |

### Deploy Layer (Two Options)

**Option A: Managed Agents (Recommended for Pro/Enterprise)**
- Each Claw = Claude Managed Agent definition
- POST /v1/agents → create definition
- POST /v1/sessions → start task
- SSE streaming for real-time progress
- $0.08/hr runtime + token costs
- Anthropic manages infrastructure

**Option B: Self-Hosted (Railway/Docker)**
- Python daemon with 8-skill pipeline
- Railway one-click template
- Docker Compose for local
- Creator manages infrastructure
- Lower ongoing cost, more maintenance

## 3. Managed Agent Definitions

### Media Claw Agent

```json
{
  "name": "arcanea-media-claw",
  "model": "claude-sonnet-4-6",
  "system": "You are the Media Claw — Arcanea's media intelligence agent. You scan directories for creative assets, classify them by guardian/element/gate taxonomy, score quality using the TASTE 5D system, and process them for distribution. You always verify against the World Graph for canon alignment.",
  "tools": [{ "type": "agent_toolset_20260401" }],
  "mcp_servers": [
    { "name": "supabase", "type": "url", "url": "${SUPABASE_MCP_URL}" },
    { "name": "arcanea", "type": "url", "url": "${ARCANEA_MCP_URL}" }
  ]
}
```

### Forge Claw Agent

```json
{
  "name": "arcanea-forge-claw",
  "model": "claude-sonnet-4-6",
  "system": "You are the Forge Claw — Arcanea's NFT creation agent. You generate art compositions, build metadata, score rarity, prepare IPFS pins, and coordinate minting. All creations must align with the World Graph taxonomy.",
  "tools": [{ "type": "agent_toolset_20260401" }],
  "mcp_servers": [
    { "name": "supabase", "type": "url", "url": "${SUPABASE_MCP_URL}" },
    { "name": "arcanea", "type": "url", "url": "${ARCANEA_MCP_URL}" },
    { "name": "comfyui", "type": "url", "url": "${COMFYUI_MCP_URL}" }
  ]
}
```

### Herald Claw Agent

```json
{
  "name": "arcanea-herald-claw",
  "model": "claude-sonnet-4-6",
  "system": "You are the Herald Claw — Arcanea's marketing intelligence agent. You draft platform-optimized social content, compose threads, schedule posts, monitor engagement, and cross-post across platforms. Voice must match the creator's brand.",
  "tools": [{ "type": "agent_toolset_20260401" }],
  "mcp_servers": [
    { "name": "supabase", "type": "url", "url": "${SUPABASE_MCP_URL}" },
    { "name": "canva", "type": "url", "url": "${CANVA_MCP_URL}" },
    { "name": "slack", "type": "url", "url": "${SLACK_MCP_URL}" }
  ]
}
```

### Scout Claw Agent

```json
{
  "name": "arcanea-scout-claw",
  "model": "claude-haiku-4-5",
  "system": "You are the Scout Claw — Arcanea's market intelligence agent. You scan trends, track competitors, detect alpha opportunities, gauge sentiment, and generate reports. Efficiency matters — use Haiku-tier speed.",
  "tools": [{ "type": "agent_toolset_20260401" }]
}
```

### Scribe Claw Agent

```json
{
  "name": "arcanea-scribe-claw",
  "model": "claude-sonnet-4-6",
  "system": "You are the Scribe Claw — Arcanea's publishing agent. You format manuscripts (Markdown to EPUB/PDF/DOCX via Pandoc), distribute to platforms (Leanpub API, Draft2Digital), translate content, generate changelogs, and compose newsletters.",
  "tools": [{ "type": "agent_toolset_20260401" }],
  "mcp_servers": [
    { "name": "supabase", "type": "url", "url": "${SUPABASE_MCP_URL}" },
    { "name": "github", "type": "url", "url": "${GITHUB_MCP_URL}" },
    { "name": "notion", "type": "url", "url": "${NOTION_MCP_URL}" }
  ]
}
```

## 4. Maestro Orchestrator (/ao upgrade)

The /ao orchestrator gains a new `publish` subcommand:

```
/ao publish "My New Book"
  → Scribe Claw: format MD → EPUB/PDF
  → Media Claw: generate/select cover art
  → quality-gate: TASTE score ≥ 80 or revision loop
  → Herald Claw: draft social campaign
  → Scribe Claw: distribute to Kindle, Leanpub, arcanea.ai, NFT
  → Scout Claw: monitor launch metrics
  → Report results to Notion dashboard
```

Implementation: /ao detects whether Managed Agents API is configured. If yes, creates sessions. If no, falls back to Claude Code local subagents.

## 5. Creator User Flow

### Flow 1: "I write in Notion"

1. Creator writes chapters in Notion
2. /ao reads from Notion via MCP, pulls content
3. Quality gate runs TASTE scoring
4. Scribe Claw formats to EPUB/PDF
5. Media Claw selects/generates cover
6. Herald Claw drafts marketing
7. Distribution pushes to platforms
8. Analytics feed back to Notion dashboard

### Flow 2: "I write in Markdown"

1. Creator writes in `book/` directory or Obsidian vault
2. Local Claw scans for new/changed files
3. Same pipeline as above, locally or via Managed Agents

### Flow 3: "I want an NFT collection"

1. Creator defines collection in World Graph
2. Forge Claw generates art via ComfyUI
3. Media Claw scores TASTE quality
4. Approved assets get metadata built
5. IPFS pin + mint orchestrated by Forge
6. Herald Claw announces collection launch

## 6. Notion Database Schema

Six databases, linked via relations:

### Editorial Board
- Title (title)
- Status (select: draft, review, approved, published)
- Collection (relation → Collections)
- Author (text)
- Word Count (number)
- Quality Score (number)
- Language (select)
- Source Path (text)
- Last Synced (date)

### Asset Library
- File (files)
- Type (select: cover, illustration, banner, social, nft)
- TASTE Score (number)
- Guardian (select)
- Element (select)
- Approved (checkbox)
- Linked Content (relation → Editorial Board)

### Distribution Tracker
- Title (relation → Editorial Board)
- Platform (multi-select: Kindle, Leanpub, Draft2Digital, NFT, Web, Social)
- Status (select: pending, submitted, live, failed)
- URL (url)
- Revenue (number)
- Date Published (date)

### Translation Queue
- Source (relation → Editorial Board)
- Target Language (select)
- Status (select: pending, translating, reviewing, done)
- Quality Score (number)
- Output Path (text)

### Analytics
- Content (relation → Editorial Board)
- Platform (select)
- Views (number)
- Revenue (number)
- Engagement (number)
- Period (date)

### Client Portal (Enterprise only)
- Client Name (title)
- Vertical (select)
- Content Count (number)
- Status (select: onboarding, active, churned)
- Agent Fleet (text)

## 7. Repos

| Repo | License | Contents |
|------|---------|---------|
| `frankxai/arcanea-claw` | MIT | Open-core engine: 8 skills, SQLite, MCP server, Docker, Railway template |
| `frankxai/arcanea-publishing-house` | BSL 1.1 | Pro layer: 5 Managed Agent definitions, Maestro, distribution connectors, Notion templates, Luminor Coach, translation pipeline |
| `frankxai/arcanea` | MIT | OSS: skills, lore, world graph definitions, community contributions |
| `frankxai/arcanea-ai-app` | Private | Production: web app, dashboard, /claw page, showcase |

## 8. Competitive Landscape

| Competitor | What They Do | What Arcanea Does Better |
|-----------|-------------|------------------------|
| Libriscribe (66 stars) | Multi-agent book creation | Living World Graph, TASTE scoring, multi-platform distribution |
| Novelcrafter (SaaS) | Codex for story consistency | Open world graph, not locked to one manuscript |
| Book.io | NFT ebook marketplace | NFTs connected to living world, not static files |
| CrewAI book agents | Sequential agent crews | Managed Agent parallel execution, MCP ecosystem |
| Leanpub | Markdown → book platform | Multi-platform distribution, not locked to one platform |
| BlogCaster | MCP blog → social | Full publishing pipeline, not just social distribution |

**Nobody has built an MCP-native, world-graph-connected, multi-platform autonomous publishing system.** This is genuinely first-to-market.

## 9. Implementation Priority

| Phase | Components | Effort |
|-------|-----------|--------|
| Phase 1 (Week 1) | Agent definitions, /ao publish, Notion DBs, local engine SQLite | 4 days |
| Phase 2 (Week 2) | Scribe pipeline (Pandoc), Herald social, Distribution connectors | 3 days |
| Phase 3 (Week 3) | Luminor Coach, Translation, Scout monitoring | 3 days |
| Phase 4 (Week 4) | License gate, Stripe billing, Blueprint docs, Railway template | 2 days |

## 10. Success Criteria

- [ ] A creator can write in Notion/Markdown, run `/ao publish`, and have content formatted + distributed to 3+ platforms
- [ ] Free tier works fully offline with Claude Code + SQLite
- [ ] Pro tier runs 5 Managed Agent sessions in parallel
- [ ] TASTE scoring blocks content below 60 from distribution
- [ ] World Graph maintains canon consistency across publications
- [ ] At least 2 distribution platforms connected (Leanpub + arcanea.ai)
- [ ] Translation pipeline produces at least 3 languages
- [ ] Client can onboard in under 1 hour using Notion template
