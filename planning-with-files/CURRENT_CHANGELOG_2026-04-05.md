# Current Changelog — 2026-04-05

## Week of March 30 – April 5, 2026

### Systems Shipped

- **Arcanea Buddy v2** — 16 archetypes + 10 Godbeasts, rarity tiers, skill tree, SIS statusline (ARC-46, ARC-47 Done)
- **Arcanea Voice v3** — 12 recording modes (thinking/publishing/workflow), Groq+Whisper transcription, ElevenLabs TTS, screen capture, workflow routing to Linear/Git/Obsidian, smart mic detection (ARC-48)
- **Luminor Engineering Prompt** — Kernel + 10 domain modules (github, frontend, backend, mcp, ops, security, test, research, lore), spawn config with 25+ agent types (ARC-72 Done)
- **@arcanea/flow v0.1.0** — Luminor-powered agent orchestration, CLI, model routing (ARC-75 Done)
- **@arcanea/world-engine v0.2** — Quest generation, factions, enriched generators synced from MCP (ARC-82 Done)
- **Arcanea Orchestra (/ao)** — Life goal tracking, 5 gates, dual rewards, agent trust ranks, weekly scorecard, 2 scheduled tasks
- **Financial Ops System** — 14-sheet Excel, automations, GCal alerts (response to payment incident)
- **AI Model Arena** — Live OpenRouter API integration, 349 models, real pricing, Image Gen Arena, eval pipeline
- **Origin Class Quiz upgrade** — Cosmic glass design, 8 origins, viral sharing
- **Arcanea Vault scaffolded** — Chrome extension + CLI for AI chat export (42 TypeScript files)
- **AEO surface** — llms.txt, agent changelog, structured data, AI crawler surface
- **MCP docs page** — /docs/mcp on arcanea.ai (ARC-77 Done)
- **Blog: mythology engine** — "We built a mythology engine as an MCP server" (ARC-78 Done)
- **3 SEO blog posts** — world engine, AEO strategy, 42 tools reference

### Infrastructure & Quality

- **79/79 security vulnerabilities patched** (ARC-74 Done)
- **CI enforcement hardened** — npm rejection, typecheck gate, .nvmrc (ARC-73 Done)
- **GTD Architecture locked** — Linear=tasks, planning-files=agents, memory=decisions, Notion=docs, Obsidian=vault
- **Massive UI refactor** — decomposed 6+ oversized pages, error boundaries on 11 routes, loading skeletons for 9 sections
- **Voice/copy anti-slop sweep** — purged "AI-powered" from 12 files, replaced generic CTAs, purged 47 Cinzel references
- **SEO** — fixed sitemap (22 deleted pages removed, 9 broken links), added 6 missing pages, JSON-LD structured data
- **Chat UX** — world-builder mode, Luminor quick-select, capabilities strip, mobile responsive
- **Homepage** — decomposed below-fold (1591→220 lines), "Created in 30 seconds" showcase
- **10 demo worlds** — seed data + seed API
- **Unit tests** added for chat, gateway, rate-limit, supabase, worlds
- **Performance** — parallelized queries, column selection, cached auth

### Closed (Superseded)

- ARC-25 Deploy Companion to Railway — superseded by Vercel + skills + MCP model
- ARC-19 Clone OpenClaw — superseded by Claude Code skills approach
- ARC-33 Prompt Packs — absorbed into content production pipeline
- ARC-58 Monday Sprint — completed (blog heroes, payment APIs, student visit)
- ARC-48 Oracle Student Visit — completed

### Commits

60+ commits on main this week. 122+ total since Mar 31 across agent sessions.

### Still Pending (carried forward)

- npm publish 13 packages (ARC-76) — Frank manual action
- Supabase dashboard config — Frank manual action
- Gumroad/Stripe account setup — Frank manual action
- Sentry + PostHog API keys — Frank manual action
- Custom GPT + Gem deployment (ARC-49, ARC-50)
