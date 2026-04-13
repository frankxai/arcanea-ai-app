---
title: Second Brain — Master Index
created: 2026-04-08
updated: 2026-04-10
author: claude
status: active-build
links: [meta/second-brain-buildout-plan, meta/confidential-tier, meta/inbox-architecture, meta/semantic-map-at-scale, meta/notion-map, meta/knowledge-inventory, meta/knowledge-systems, skills/README]
---

# Second Brain — FrankX Empire

One brain. Many brands. Agent-maintained. Compounding forever.

Inspired by [Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): instead of re-reading raw docs every time, AI incrementally builds and maintains this persistent wiki.

## Domains

| Domain | Articles | Focus |
|--------|----------|-------|
| [arcanea/](arcanea/) | Creative intelligence platform | Tech, design, content, revenue |
| [frankx/](frankx/) | Personal brand & products | Content, audience, products |
| [sis/](sis/) | Enterprise AI consulting | Frameworks, clients, proposals |
| [music/](music/) | AI music & academy | Production, distribution, education |
| [business/](business/) | Holding company | BV, finance, tax, subscriptions |

## Cross-Cutting

| Section | Purpose |
|---------|---------|
| [decisions/](decisions/) | Architecture decision records (dated) |
| [learnings/](learnings/) | Patterns, insights, post-mortems |
| [people/](people/) | Network, advisors, allies |
| [meta/](meta/) | Wiki maintenance, full Notion semantic map, knowledge systems, inventory |
| [skills/](skills/) | Skill specs for `/capture`, `/inbox-triage`, `/repo-triage`, `/ship-it`, `/confidential-capture`, `/harvest` |
| [scripts/](scripts/) | Automation scripts (repo-triage.py etc.) |
| [milestones/](milestones/) | Shipped milestones with screenshots + social drafts |
| [reports/](reports/) | Auto-generated reports (repo triage, etc.) |

## Buildout Plan

**Start here before any second-brain session:** [meta/second-brain-buildout-plan.md](meta/second-brain-buildout-plan.md)

Supporting architecture:
- [meta/confidential-tier.md](meta/confidential-tier.md) — T0/T1/T2 trust model
- [meta/inbox-architecture.md](meta/inbox-architecture.md) — single INBOX, daily triage
- [meta/semantic-map-at-scale.md](meta/semantic-map-at-scale.md) — scaling the wiki past 200 articles
- [skills/README.md](skills/README.md) — skill registry and build order

## Platform Connections

| Tool | Role | Brand Scope |
|------|------|-------------|
| Linear | Task execution | ARC, FX, SIS, BIZ, MUS |
| Notion | Team knowledge | Per-brand hubs + Empire Dashboard |
| GitHub | Source code | Per-brand repos + second-brain |
| Google Drive | Media + docs | FrankX Empire/ root folder |
| Obsidian | Personal vault | Private, feeds into wiki |
| Planning Files | Agent execution | Arcanea repo |

## Notion Hub IDs

| Hub | Page ID | URL |
|-----|---------|-----|
| Arcanea | cb430b46-e54d-4036-a8ba-2cff7050ae39 | [notion.so](https://notion.so/cb430b46e54d4036a8ba2cff7050ae39) |
| FrankX.ai | 28426ac2-b7f6-80ca-bc10-d39cf07f73e4 | [notion.so](https://notion.so/28426ac2b7f680cabc10d39cf07f73e4) |
| SIS | 33626ac2-b7f6-8128-a774-fe8756713a27 | [notion.so](https://notion.so/33626ac2b7f68128a774fe8756713a27) |
| Music | 27b26ac2-b7f6-808c-a479-d3aedc9116f8 | [notion.so](https://notion.so/27b26ac2b7f6808ca479d3aedc9116f8) |
| Developer Hub | 33626ac2-b7f6-8189-b0ce-ea79c116f4ee | [notion.so](https://notion.so/33626ac2b7f68189b0ceea79c116f4ee) |
| Empire Dashboard | 33c26ac2-b7f6-8162-a085-fa1fa9917883 | [notion.so](https://notion.so/33c26ac2b7f68162a085fa1fa9917883) |

## Linear Project IDs

| Project | ID | URL |
|---------|----|-----|
| Arcanea (main) | df23e16b-dd2c-40b1-a828-2ccdb6fa1701 | [linear.app](https://linear.app/arcanea/project/arcanea-7dd598a4744a) |
| MCP Server | 7d65cc20-f4d6-4f97-a9d4-bd7142d96758 | [linear.app](https://linear.app/arcanea/project/arcanea-mcp-server-3d634735962f) |
| Content Production | bd46c227-5696-4ba1-880f-e0714502d679 | [linear.app](https://linear.app/arcanea/project/content-production-ad552c7291e1) |
| FrankX.ai | 54d8e481-fea4-4c41-bf62-f06aac1edae6 | [linear.app](https://linear.app/arcanea/project/frankxai-personal-brand-and-products-6f6144a2d5c1) |
| SIS | cd41a403-a4da-498f-ac11-6a604ca9a8ac | [linear.app](https://linear.app/arcanea/project/starlight-intelligence-systems-enterprise-ai-b36a116ed920) |
| Business Ops | 7a80126e-8245-4ecb-84af-070d90526e41 | [linear.app](https://linear.app/arcanea/project/business-ops-holding-and-finance-cc242c34b038) |
| Music Empire | 071075e3-9271-4773-97d0-17aa39508543 | [linear.app](https://linear.app/arcanea/project/music-empire-ai-music-academy-and-frankx-music-6cf38ccae587) |

## GitHub Repos

| Repo | Purpose | Status |
|------|---------|--------|
| frankxai/arcanea-ai-app | Arcanea platform (Next.js 16) | LIVE, private |
| frankxai/arcanea | OSS public mirror | LIVE, 3★ |
| frankxai/agentic-creator-os | ACOS — creator AI OS, 75+ skills/38 agents | LIVE, 2★ |
| frankxai/Starlight-Intelligence-System | SIS core engine (v5.0.0) | LIVE, 2★ |
| frankxai/frankx.ai-vercel-website | FrankX.ai website | LIVE, 2★ |
| frankxai/ai-architect-academy | AI Architect Academy (3 labs, 5 paths) | LIVE, 1★ |
| frankxai/starlight-horizon-dataset | Public AI alignment data | LIVE (11 entries) |
| frankxai/second-brain | This wiki (git-backed) | TBD |

> **Total repos under frankxai/:** 106 (public + private). See [meta/knowledge-inventory.md](meta/knowledge-inventory.md) for full detail.

## Maintenance

See [meta/agent-protocol.md](meta/agent-protocol.md) for how agents grow this wiki.
- **Daily pass:** 9am — update blockers, gate status, revenue path
- **Weekly pass:** Sundays — harvest Obsidian, scan Notion, prune stale articles
