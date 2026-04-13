---
title: Decision — Second Brain Architecture
domain: decisions
created: 2026-04-08
updated: 2026-04-08
author: frank + claude
status: growing
links: [meta/agent-protocol, arcanea/overview, frankx/overview, sis/overview, business/overview, music/overview]
---

# Decision: Second Brain Architecture

**Date:** April 8, 2026
**Status:** LOCKED
**Scope:** All brands (Arcanea, FrankX, SIS, Music, Business)

## Decision

Build a Karpathy-style LLM Wiki as the unified knowledge substrate for all brands. Markdown-based, agent-maintained, interlinked, compounding over time. Located in `Business/wiki/` (or `Arcanea/wiki/` as working copy).

## Why

1. Knowledge was fragmented across 14+ Notion pages, 12 Linear projects, multiple local folders
2. No single source of truth for cross-brand knowledge
3. Agents couldn't access a coherent picture of the empire
4. Karpathy demonstrated that persistent wiki > RAG for compounding knowledge

## Architecture

- **Wiki root:** `Business/wiki/` (spans all brands)
- **5 brand domains:** arcanea/, frankx/, sis/, music/, business/
- **4 cross-cutting:** decisions/, learnings/, people/, meta/
- **Agent protocol:** Daily (9am) + Weekly (Sundays) maintenance passes
- **Sync:** Git-backed → frankxai/second-brain repo (future)

## What Changed

### Created (April 8)
- 4 new Linear projects: FrankX.ai, SIS, Business Ops, Music Empire
- Notion Empire Dashboard (unified command center)
- Wiki directory structure (9 folders, 7 seed articles)
- Agent maintenance protocol
- Naming conventions standardized across all tools

### Existing (kept as-is)
- Arcanea Notion Hub (kept, not duplicated — linked from wiki)
- FrankX.ai Notion Hub (kept, linked)
- SIS Notion page (kept, linked)
- Music Hub (kept, linked)
- Developer Hub (kept, linked)
- All 12 existing Linear projects (kept)
- GTD Architecture (April 4 decision, complementary)
- /ao Orchestra skill (April 5 build, complementary)

## Trade-offs

| Considered | Chose | Why |
|-----------|-------|-----|
| Wiki in Notion | Wiki in local markdown | Agent-native, git-backed, works offline, no API limits |
| One mega-doc | Interlinked articles | Compounds better, each article stays focused |
| RAG over raw docs | Persistent wiki | Karpathy: wiki compounds, RAG re-reads |
| Separate wikis per brand | Unified wiki with domain folders | Cross-pollination is a feature |
