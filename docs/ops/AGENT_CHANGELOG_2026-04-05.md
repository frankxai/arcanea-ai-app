# Agent Changelog — April 3-5, 2026

> Machine-readable changelog for AI agents, crawlers, and automated systems.
> Human version: https://arcanea.ai/changelog

## v3.6.0 — World Engine v0.2 + MCP Bridge (2026-04-04)

### New Endpoints
- `POST /api/worlds/mcp-bridge` — REST bridge for all 42 MCP tools
  - Body: `{ "tool": string, "params": object }`
  - Returns: `{ "tool": string, "result": object }`
- `GET /api/worlds/mcp-bridge` — Tool discovery metadata
- `POST /api/projects/[id]/runs` — Create project run
- `POST /api/projects/[id]/runs/preflight` — Preflight check
- `GET /api/projects/[id]/runs/[runId]` — Get run status

### New MCP Tools (added to existing 28)
- `generate_quest` — Auto-links session creations into quests
- `analyze_factions` — Power dynamics across world state
- `generate_conflict` — Faction/character conflict generation
- `world_report` — Full world health assessment
- `weave_narrative` — Narrative generation from creations
- `visualize_character` — Character art direction prompts
- `visualize_location` — Location art direction prompts
- `visualize_creature` — Creature art direction prompts

### New Packages
- `@arcanea/world-engine@0.2.0` — Enriched generators with quest + factions
  - Breaking: `generateLocation()` now returns `atmosphere.visual` instead of flat `description`
  - Breaking: `generateCreature()` adds `lore.godBeastConnection` field

### Files Changed
- `packages/arcanea-mcp/src/index.ts` — Tool count 28→42
- `packages/world-engine/src/generators.ts` — Quest + faction generators
- `apps/web/app/api/worlds/mcp-bridge/route.ts` — REST bridge
- `apps/web/app/api/projects/[id]/runs/` — Run graph API (3 files)

---

## v3.5.0 — Arcanea Orchestrator (2026-04-04)

### New Commands (Claude Code / CLI)
- `/ao status` — Repo/branch/agent state dashboard
- `/ao promote` — Verified promotion workflow
- `/ao digest` — Process agent output efficiently
- `/ao coach` — Ops workflow guidance
- `/ao cleanup` — Clean stale worktrees
- `/ao plan` — Plan sustained sessions
- `/ao handover` — Write durable handover doc
- `/ao sync` — Sync shared intelligence to repos
- `/ao sessions` — Session naming + context recovery

### New Skills
- `/arcanea-showcase` — 5 modes: demo, content, capture, batch, update
  - Generates marketing content from MCP tool outputs
  - Produces social media threads, blog posts, changelog entries

### Session Naming Convention
```
A1-MCP, A2-CHAT, A3-IMAGINE, A4-WORLDS, A5-LORE,
A6-DEPLOY, A7-OPS, A8-SHOWCASE, A9-PRESENCE, A10-OSS
```

### Files Changed
- `.claude/skills/arcanea-orchestrator/SKILL.md` — Sessions mode added
- `.claude/skills/arcanea-showcase/SKILL.md` — New skill
- `.claude/commands/arcanea-showcase.md` — New command
- `.arcanea/ops/` — Shared command system (6 files)
- `.arcanea/scripts/ao-sync.sh` — Repo sync script

---

## v3.4.1 — Visual Polish (2026-04-04)

### New Pages
- `/showcase` — Live MCP demo page with 7 real tool output cards
- `/changelog` updated — 5 new entries (v3.3.1 → v3.6.0)

### Navigation Changes
- Navbar Explore mega menu: added Showcase + Changelog links
- Removed GitHub external link, replaced with Changelog

### Files Changed
- `apps/web/app/showcase/page.tsx` — New page
- `apps/web/app/changelog/page.tsx` — 5 new entries
- `apps/web/components/navigation/navbar.tsx` — Menu updates

---

## v3.4.0 — World Graph + Imagine Overhaul (2026-04-03)

### New Components
- `components/worlds/CharacterCard.tsx` — Character display card
- `components/worlds/WorldDashboard.tsx` — World overview panel
- `components/worlds/ElementBadge.tsx` — Element indicator
- `components/worlds/WorldGraph.tsx` — Graph visualization
- `components/worlds/WorldGraphPanel.tsx` — Graph panel wrapper

### New API Routes
- `POST /api/worlds/generate` — AI world generation
- `POST /api/worlds/generate-image` — World image generation
- `GET /api/worlds` — List with pagination + visibility
- `GET /api/worlds/[slug]` — World details
- `POST /api/worlds/[slug]/fork` — Fork a world
- `POST /api/worlds/[slug]/star` — Star/favorite

### Imagine Page Rewrite
- Floating bottom input bar (Grok-inspired)
- Featured template cards
- Speed/Quality toggle (Gemini Flash vs Pro)
- Provider fallback: OpenRouter → Grok → Gemini

### Files Changed
- `apps/web/app/imagine/page.tsx` — Full rewrite (~1175 lines)
- `apps/web/components/imagine/PromptInput.tsx` — Rewrite
- `apps/web/lib/imagine/generate.ts` — Provider routing
- `apps/web/app/worlds/` — 8 new/modified files

---

## v3.3.1 — Deploy Crisis Fix (2026-04-03)

### Breaking Change
- Next.js aligned to 16.2.2 (pnpm cannot pin 16.1.1)
- All pages use `force-dynamic` — no static prerendering
- `generateStaticParams` removed from all dynamic routes
- `global-error.tsx` removed (caused workStore crash)

### Environment Changes
- `VERCEL_FORCE_NO_BUILD_CACHE=1` — Build env variable
- `installCommand`: `corepack enable && pnpm install` (no flags)
- ESLint pinned to 9.17.0 (9.39 crashes with ajvOrig)

### Files Changed
- `vercel.json` — Install command, build cache flag
- `package.json` — Removed root `next` dependency, updated override
- `apps/web/package.json` — next 16.2.2
- 8 page files — Removed generateStaticParams
- `apps/web/app/global-error.tsx` — Deleted

---

## AEO Surface (2026-04-05)

### New Files for AI Crawlers
- `/llms.txt` — Summary for LLM crawlers
- `/llms-full.txt` — Complete tool schemas and API reference
- `/.well-known/ai-plugin.json` — OpenAI plugin manifest
- `/robots.txt` — Allows GPTBot, ChatGPT-User, Anthropic-ai, PerplexityBot

### JSON-LD Structured Data
- Root layout: WebApplication schema with feature list
- Showcase page: SoftwareApplication with demo data

### Crawl Priority
```
High: /llms.txt, /llms-full.txt, /showcase, /developers, /changelog
Medium: /chat, /imagine, /worlds, /library, /academy
Low: /gallery, /discover, /settings
Block: /api/*, /auth/*, /admin/*
```
