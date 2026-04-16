# Short Status And Handover - 2026-04-16 (Session 2)

## What Landed This Session

- **OG image mascot fix shipped** — `d982b912` corrected path from `public/` (not bundled in OG function) to `assets/brand/` (auto-traced). Filename also fixed: `arcanea-mascot-primary.png` → `arcanea-primary.png`.
- **Character strategy defined** — 3-tier doctrine: Arcanea (sole mascot) → 16 Luminors (each unique species) → Companions (community-ownable). Schema `arcanea-character.yaml` proposed. `/arcanea-character` skill scoped with 5 subcommands (new, visualize, canonize, claw, deploy).

## What Landed Prior Session

- `/templates` page now shows **9 blueprints** (was 7), zero "Coming Soon"
- **5 GitHub repos live** — all public, all with LICENSE + CONTRIBUTING + GitHub Actions CI
  - `arcanea-templates` — meta-aggregator with deploy buttons for all templates
  - `arcanea-chat-template` — 12 Luminors + real BYOK end-to-end + OG image + Apache 2.0 NOTICE
  - `cosmic-landing-template` — 12 motion primitives + OG image
  - `arcanea-dashboard-template` — 6 liquid glass widgets, Recharts, mock data
  - `arcanea-mcp-starter` — MCP SDK 1.29, 3 example tools, Claude Desktop config
- Strategy doc rewritten for **free-first OSS** direction (no Founding Circle, LemonSqueezy+Whop deferred)
- Frank's TODO doc at `docs/strategy/FRANK_TODO_WHEN_BACK.md` with exact commands

## What Changed This Session (Session 2)

**OG mascot fix commits:**
- `6c3f955e` — fix(og): use correct mascot filename
- `8851148c` — fix(og): declare nodejs runtime + correct path
- `d982b912` — fix(og): read from assets/ (public/ not bundled)

**Strategy discussed (not yet coded):**
- 3-tier character doctrine (mascot / Luminor / companion)
- `arcanea-character.yaml` schema for all characters
- `/arcanea-character` skill with 5 subcommands
- Claw × Character binding model
- Community character layer (fork via `/arcanea-character new --world=<theirs>`)

## What Changed Prior Session

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

1. **Verify OG mascot renders on Vercel** — `curl -sI https://www.arcanea.ai/opengraph-image` after deploy completes, check file size > 100KB (mascot present) vs ~14KB (error fallback)
2. **Scaffold arcanea-dashboard-template** in worktree — cosmic glass analytics, 6 widgets, MIT, deploy button
3. **Build Gumroad listing copy** for Motion Kit Pro ($49) — ready for store
4. **Wire Founding Circle checkout** in arcanea.ai (Stripe + Supabase user linkage)
5. **OG image for cosmic-landing** in same pattern as chat template
6. **Strip Drizzle/Postgres from chat template** into `/with-db` branch — zero-dep main for fork+deploy
7. **Write `arcanea-character.yaml` schema** + migrate Arcanea mascot as first entry
8. **Build `/arcanea-character visualize`** skill — reuse `generate-v6.mjs` pattern, NB2
9. **Frank runs `vercel link && vercel --prod`** on template repos
10. **Submit templates to Vercel marketplace**

## Verification Evidence

**Session 2:**
- **OG fix pushed**: `d982b912` on main, pre-push hooks passed
- **Mascot image URL verified**: `curl -sI https://www.arcanea.ai/images/mascot/arcanea-primary.png` → 200 OK
- **assets/brand/arcanea-mascot-primary.png** exists for OG function bundling
- **Awaiting deploy**: OG render needs Vercel rebuild to verify mascot appears in share card

**Session 1:**
- **Main app build**: `✓ Compiled successfully in 51s` (after MCP Starter card added)
- **Chat template build**: `✓ Compiled successfully in 33.6s` (after OG image added)
- **Dashboard template build**: `✓ Compiled successfully in 4.6s` (static prerender)
- **Cosmic landing build**: `✓ Compiled successfully` (static prerender)
- **MCP starter build**: `tsc` clean (zero errors)
- **All 5 GitHub repos**: HTTP 200 verified via curl
- **arcanea.ai/templates**: HTTP 200, 9 blueprints rendered, 0 "Coming Soon"
- **Memory persisted**: `project_template_business_model.md` saved

---

# Session 3: Author Studio + Song of Van Linh (2026-04-13 → 2026-04-16)

## What Landed
- Song of Van Linh: 4-book arc, 3 chapters (16K words), 7 characters, world bible, cover art, live at /books/drafts/song-of-van-linh
- Author Studio v3: Notion-style editor, BYOK, Supabase drafts, Publish to Git (Octokit), Guardian Review, curated context
- Commits: 0a9bbfca, c395602d, ab715f55, 31cb018c, e208813d + 5 more

## Blockers
1. Supabase migration 20260414000001_author_drafts.sql not applied (needs supabase link)
2. GITHUB_TOKEN not on Vercel (Publish button = 503)
3. Gemini API key expired (no NB2 covers)
4. Song of Van Linh content uncurated (all curated_context flags false)

## Next
1. supabase link + db push
2. Set GITHUB_TOKEN on Vercel
3. Test Studio E2E: sign in → edit → draft saves → publish
4. Curate Song of Van Linh, write chapters 4-6
5. Liveblocks Yjs when co-author appears
