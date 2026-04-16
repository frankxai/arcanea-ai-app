# Short Status And Handover - 2026-04-16

## What Landed

- `/templates` page now shows **9 blueprints** (was 7), zero "Coming Soon"
- **5 GitHub repos live** — all public, all with LICENSE + CONTRIBUTING + GitHub Actions CI
  - `arcanea-templates` — meta-aggregator with deploy buttons for all templates
  - `arcanea-chat-template` — 12 Luminors + real BYOK end-to-end + OG image + Apache 2.0 NOTICE
  - `cosmic-landing-template` — 12 motion primitives + OG image
  - `arcanea-dashboard-template` — 6 liquid glass widgets, Recharts, mock data
  - `arcanea-mcp-starter` — MCP SDK 1.29, 3 example tools, Claude Desktop config
- Strategy doc rewritten for **free-first OSS** direction (no Founding Circle, LemonSqueezy+Whop deferred)
- Frank's TODO doc at `docs/strategy/FRANK_TODO_WHEN_BACK.md` with exact commands

## What Changed This Session

**Main repo (arcanea-ai-app) commits:**
- `2df3faa3` — docs: update Frank's TODO with 5 repos
- `09c2b7d8` — feat: add MCP Starter to /templates page (9 total)
- `9259031c` — docs: Frank's TODO when back
- `f2ad35cc` — feat: add dashboard + free-first strategy
- `25bfb9f6` — docs: template business model

**External repos shipped (not in this git log):**
- `arcanea-chat-template`: 6 commits — Luminor wiring, selector UI, real BYOK, build fixes, OG image, license fix, CI
- `cosmic-landing-template`: 4 commits — tailwind fix, OG image, LICENSE+CONTRIBUTING, CI
- `arcanea-dashboard-template`: 3 commits — full v1 scaffold, LICENSE+CONTRIBUTING, CI
- `arcanea-mcp-starter`: 3 commits — full v1 scaffold, LICENSE+CONTRIBUTING, CI
- `arcanea-templates`: 3 commits — meta-aggregator README, LICENSE+CONTRIBUTING

## Current Blockers

1. **Vercel deploy (interactive auth)** — `vercel link && vercel --prod` needed for chat, landing, dashboard templates. Frank must run this manually.
2. **npm publish** — `arcanea-mcp-starter` ready to publish but needs `npm login` first.
3. **Vercel marketplace submission** — web form at vercel.com/templates/submit, can't be automated.
4. **Browser testing** — Luminor selector + BYOK flow not yet tested in a real browser. Needs live Vercel URL first.

## Recommended Next Stack

1. **Frank runs `vercel link && vercel --prod`** on 3 template repos → gets live preview URLs
2. **Browser-test BYOK + Luminor selector** end-to-end on the live chat template
3. **Strip Drizzle/Postgres from chat template** into opt-in `/with-db` branch — makes main branch zero-dep fork+deploy
4. **Scaffold `arcanea-world-engine-template`** — unique, zero competition, uses Living Worlds data model
5. **Draft launch posts** — X thread, HN Show HN, Reddit /r/nextjs, Vercel community forum
6. **Set up GitHub Projects V2** — one board across all template repos
7. **Submit templates to Vercel marketplace** — OG images already wired, metadata ready

## Verification Evidence

- **Main app build**: `✓ Compiled successfully in 51s` (after MCP Starter card added)
- **Chat template build**: `✓ Compiled successfully in 33.6s` (after OG image added)
- **Dashboard template build**: `✓ Compiled successfully in 4.6s` (static prerender)
- **Cosmic landing build**: `✓ Compiled successfully` (static prerender)
- **MCP starter build**: `tsc` clean (zero errors)
- **All 5 GitHub repos**: HTTP 200 verified via curl
- **arcanea.ai/templates**: HTTP 200, 9 blueprints rendered, 0 "Coming Soon"
- **Memory persisted**: `project_template_business_model.md` saved
