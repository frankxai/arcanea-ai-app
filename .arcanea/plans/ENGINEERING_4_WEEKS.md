# Arcanea 4-Week Engineering Plan: April 1-27, 2026

> **Version**: 1.0.0
> **Created**: 2026-03-31
> **Guardian**: Lyssandria (Foundation) + Draconia (Fire)
> **Target**: $1K MRR by April 27

---

## THE BOTTLENECK WARNING

**The bottleneck is distribution, not development.**

The platform is 85-95% built. The agent marketplace is shipped. The lore is 260K+ words. The infrastructure has 42 packages. Every task in this plan must either:

1. Generate revenue directly, OR
2. Drive traffic to arcanea.ai, OR
3. Unblock a revenue-generating task

No pure infrastructure without a revenue connection. If a task does not map to one of these three, it gets cut.

---

## What Already Exists (Shipped 2026-03-30)

| Asset | Location | Status |
|-------|----------|--------|
| Agent Marketplace UI | `/agents` page (grid, filters, search, featured) | LIVE on main |
| Agent Runner | `/agents/[id]` (streaming output, credit breakdown) | LIVE on main |
| 12 Starter Agents | `apps/web/lib/agents/marketplace/catalog.ts` (1238 lines) | LIVE on main |
| 5 API Routes | `/api/agents/*` (list, detail, execute, credits, consume) | LIVE on main |
| The Grimoire | `/agents/grimoire` (10-question wizard, multi-agent orchestrator) | LIVE on main |
| Grimoire Viewer | `/agents/grimoire/[orderId]` (parchment theme, download) | LIVE on main |
| Premium Marketplace Section | 3 luxury product cards on `/agents` | LIVE on main |
| Supabase Migration | `apps/web/supabase/migrations/20260330_agents_credits.sql` | NOT APPLIED |
| Agent Hub | `/agents/hub` (Skyrim-style skill tree) | LIVE on main |
| Factions Codex | `/codex/factions` (8 origin classes) | LIVE on main |
| Origin Class Quiz | `/quiz` | LIVE on main |
| 38 Agents in Registry | `apps/web/lib/agents/agent-registry.ts` | LIVE on main |
| Evaluation Framework | `apps/web/lib/agents/evaluation-framework.ts` | LIVE on main |
| Existing Orchestrator | `arcanea-orchestrator/` (412 TS files, plugin architecture) | Built, not wired |
| Lore Library | `book/` (1.1M+ words, 280 files) | LIVE |
| 22 Faction Docs | `.arcanea/lore/` (202K words, 80+ characters) | Complete |
| Luminor Chat | `/chat` with MoE routing, 17+ providers | LIVE |
| Forge | `/chat/forge` (custom Luminor builder) | LIVE |
| Ops Dashboard | `/ops` | LIVE |

## What Is NOT Done (Blocks Revenue)

| Blocker | Owner | Time | Blocks |
|---------|-------|------|--------|
| Supabase migration not applied | FRANK (manual) | 15 min | Credits, auth, all transactions |
| Supabase OAuth not configured (Google + GitHub) | FRANK (manual) | 15 min | User sign-up, agent usage |
| Sentry + PostHog API keys not set on Vercel | FRANK (manual) | 10 min | Error tracking, analytics |
| No payment integration (Stripe or Gumroad) | CC + FRANK | 4 hrs | All revenue |
| No credit purchase flow | CC | 2 hrs | Monetization |
| Guardian Sessions page placeholder | CC | 3 hrs | $47-97 product |
| AIS spec not written | CC | 6 hrs | OSS positioning, enterprise |

---

## Week 1: "Go Live" (April 1-6)

### Goals
1. Apply Supabase migration + OAuth so auth and credits work on production
2. Test `/agents` and `/agents/grimoire` end-to-end on arcanea.ai
3. Ship credit purchase flow (Gumroad checkout -> webhook -> Supabase)
4. Produce and list First Guardian Drop on Gumroad ($19-97)
5. Fix all production bugs surfaced during testing

### Monday April 1 (P0: Unblock Everything)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| Apply Supabase migration (`20260330_agents_credits.sql`) | FRANK | 15 min | 5 tables live: credits, credit_transactions, agent_tasks, marketplace_agents, agent_reviews | Supabase dashboard access |
| Configure Supabase OAuth: Site URL `https://arcanea.ai`, redirect `https://arcanea.ai/auth/callback`, enable Google + GitHub providers | FRANK | 15 min | Users can sign up/in on production | Supabase dashboard + Google Cloud Console + GitHub OAuth app |
| Set Sentry DSN + PostHog API key as Vercel env vars | FRANK | 10 min | Error tracking + analytics active | Sentry/PostHog accounts (code already installed) |
| E2E test: sign up -> browse `/agents` -> run free agent -> verify streaming output | CC | 1 hr | Bug list or green light | Migration + OAuth applied |
| E2E test: `/agents/grimoire` wizard -> submit -> verify orchestrator runs | CC | 1 hr | Bug list or green light | Migration applied |
| Fix any bugs from E2E testing | CC | 2 hrs | Clean production | E2E tests |

### Tuesday April 2 (Credit Purchase Flow)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| Create Gumroad products: "100 Credits" ($10), "500 Credits" ($40), "1000 Credits" ($70) | FRANK | 30 min | 3 Gumroad product URLs | Gumroad account |
| Build `/api/webhooks/gumroad/route.ts` — verify Gumroad ping, parse `product_id` + `email`, add credits to Supabase `credits` table | CC | 2 hrs | Webhook endpoint live on Vercel | Gumroad products created |
| Build `/credits` page — show balance, purchase buttons (link to Gumroad checkout), transaction history from `credit_transactions` table | CC | 2 hrs | `apps/web/app/credits/page.tsx` | API routes working |
| Add "Buy Credits" CTA to `/agents` page header + agent runner insufficient-balance state | CC | 1 hr | Updated `apps/web/app/agents/page.tsx` + `apps/web/app/agents/[id]/page.tsx` | Credits page exists |
| Wire credit deduction in `/api/agents/[id]/execute/route.ts` — check balance before execution, deduct on completion | CC | 1 hr | Atomic credit flow | Supabase migration applied |
| Test full flow: Gumroad purchase -> webhook -> credits appear -> run agent -> credits deducted | CC + FRANK | 1 hr | Revenue pipeline verified | All above |

### Wednesday-Thursday April 3-4 (First Guardian Drop)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| CC overnight: produce "Draconia's Forge" content pack — 5 character sheets (using `character-forge` skill + `generate_character` MCP tool), world document, visual direction prompts, 10 story seeds | CC | 4 hrs (background) | Raw content in `.arcanea/drops/draconias-forge/` | None |
| CC overnight: produce "Lyria's Vision" pack — 10 image generation prompts (Imagen/DALL-E ready), style guide, 5 scene compositions with lighting notes | CC | 3 hrs (background) | Raw content in `.arcanea/drops/lyrias-vision/` | None |
| CC overnight: produce "The Academy Starter" — complete world-building kit using `world-builder` + `character-designer` + `story-writer` agents from catalog | CC | 4 hrs (background) | Raw content in `.arcanea/drops/academy-starter/` | None |
| Frank reviews + polishes drops (15 min each) | FRANK | 45 min | Publish-ready content | CC production |
| Package as PDFs using `docx` skill or Canva | CC/FRANK | 1 hr | 3 polished PDF products | Reviewed content |
| List on Gumroad: "Draconia's Forge" ($19), "Lyria's Vision" ($14), "The Academy Starter" ($39) | FRANK | 30 min | 3 live Gumroad listings | PDF packages |
| Create `/drops` landing page linking to Gumroad listings with cosmic UI and product previews | CC | 2 hrs | `apps/web/app/drops/page.tsx` | Gumroad URLs |

### Friday-Saturday April 5-6 (Distribution Push)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| Generate 8 faction reveal social posts (1 per origin class) using `faction-reveal` skill — image prompts + copy + "Which one are you?" CTA | CC | 2 hrs | 8 social posts in `.arcanea/social/faction-reveals/` | Faction docs exist |
| Generate Stellaris reveal post — standalone visual prompt + origin story excerpt | CC | 30 min | 1 social post | STELLARIS.md exists |
| Generate Dawnsworn team reveal — lineup description + character cards | CC | 1 hr | 1 social post | FLAGSHIP_TEAM.md exists |
| Frank posts 3 reveals to Twitter/X, LinkedIn, threads over weekend | FRANK | 30 min | 3 posts live, linking to arcanea.ai | Social content ready |
| SEO: add meta descriptions + OpenGraph images to `/agents`, `/agents/grimoire`, `/drops`, `/quiz` | CC | 1 hr | Updated `metadata` exports in 4 page files | Pages exist |

### Week 1 Deliverables
- Users can sign up, browse agents, buy credits, run agents on production
- 3 Guardian Drops listed on Gumroad ($19, $14, $39)
- Credit purchase flow working (Gumroad -> webhook -> Supabase)
- `/drops` landing page live
- 10 social content pieces ready, 3+ posted
- Error tracking + analytics active

### Week 1 Dependencies
- FRANK MUST do Supabase config on Day 1 (blocks everything)
- FRANK MUST create Gumroad products on Day 2 (blocks purchases)
- FRANK MUST review drops on Day 3-4 (blocks listings)

### Week 1 Revenue Impact
- First possible sales from Guardian Drops ($14-39 each)
- Credit purchase infrastructure live ($10-70 per pack)
- Target: $100-300 from drops + early credit purchases

---

## Week 2: "Premium Products" (April 7-13)

### Goals
1. Ship Grimoire as a real paid product ($197-497 via Gumroad/Stripe)
2. Build Guardian Sessions MVP ($47-97)
3. Launch "Complete Code" bundle ($97)
4. Add Stripe Checkout as payment alternative to Gumroad
5. Start daily social content cadence

### Monday-Tuesday April 7-8 (Grimoire Monetization)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| Create Gumroad products: Grimoire Apprentice ($197), Grimoire Mage ($297), Grimoire Archmage ($497) | FRANK | 20 min | 3 Gumroad product URLs | Gumroad account |
| Update `/agents/grimoire` page: replace demo mode with real payment gate — user selects tier, redirects to Gumroad checkout, webhook triggers generation | CC | 3 hrs | Updated `apps/web/app/agents/grimoire/page.tsx` + new `apps/web/app/api/webhooks/gumroad/grimoire/route.ts` | Gumroad products |
| Add order tracking: `grimoire_orders` table in Supabase (order_id, user_email, tier, status, gumroad_sale_id, questionnaire_answers, output_url) | CC | 1 hr | Migration SQL + apply via MCP | Supabase access |
| Build email delivery: on Grimoire completion, email buyer with link to `/agents/grimoire/[orderId]` (use Supabase Edge Function or Resend) | CC | 2 hrs | `apps/web/supabase/functions/grimoire-delivery/` or Resend integration | Order tracking |
| Produce 2 sample Grimoire outputs to use as social proof on the sales page | CC | 3 hrs (background) | 2 complete world bibles in `.arcanea/drops/grimoire-samples/` | Grimoire orchestrator working |

### Wednesday-Thursday April 9-10 (Guardian Sessions + Stripe)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| Build Guardian Sessions page (`/agents/sessions`) — select a Guardian (10 available), describe your project, choose session length (30 min/$47, 60 min/$97) | CC | 3 hrs | `apps/web/app/agents/sessions/page.tsx` | None |
| Build session execution: deep-linked chat with selected Guardian, pre-loaded with project context from questionnaire, session timer, output summary at end | CC | 4 hrs | `apps/web/app/agents/sessions/[sessionId]/page.tsx` + `apps/web/lib/agents/sessions/` | Chat infrastructure exists |
| Set up Stripe Checkout: `apps/web/app/api/stripe/checkout/route.ts` — creates Checkout Session for credits, Grimoire, or Sessions | CC | 3 hrs | Stripe integration | FRANK provides Stripe API keys |
| Set Stripe API keys (publishable + secret) as Vercel env vars | FRANK | 10 min | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` on Vercel | Stripe account |
| Build Stripe webhook handler: `apps/web/app/api/webhooks/stripe/route.ts` — handles `checkout.session.completed`, routes to credit-add or order-create | CC | 2 hrs | Webhook endpoint | Stripe keys set |

### Friday-Saturday April 11-12 (Bundle + Content)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| Produce "The Complete Code" bundle — all 10 Guardian creative kits bundled ($97 on Gumroad) | CC | 6 hrs (overnight background) | 10 creative packs in `.arcanea/drops/complete-code/` | Drop production pipeline from W1 |
| List "The Complete Code" on Gumroad ($97) | FRANK | 15 min | Gumroad listing | Content produced |
| Produce "Alera's Voice" pack — 3 chapter drafts, anti-slop checklist, voice guide ($24) | CC | 3 hrs (background) | Content in `.arcanea/drops/aleras-voice/` | None |
| Update `/drops` page with all 5+ products | CC | 1 hr | Updated `apps/web/app/drops/page.tsx` | New products listed |
| Generate 5 "Creator Spotlight" social posts — showcase what the agents can build (sample outputs from Quillblade, Soulforge, Cosmograph) | CC | 2 hrs | Social content | Agent marketplace live |
| Frank posts daily to X/LinkedIn (1 faction reveal + 1 product showcase) | FRANK | 15 min/day | 10 posts over the week | Social content ready |

### Week 2 Deliverables
- Grimoire purchasable as real product ($197-497)
- Guardian Sessions MVP live ($47-97)
- Stripe Checkout integrated as payment option
- "Complete Code" bundle + "Alera's Voice" listed ($97, $24)
- `/drops` page updated with 5+ products
- Daily social posting cadence established

### Week 2 Dependencies
- FRANK MUST provide Stripe API keys (blocks payment alternative)
- FRANK MUST create Gumroad products for Grimoire tiers
- FRANK MUST maintain daily social posting (10 min/day)

### Week 2 Revenue Impact
- Grimoire sales target: 2-5 sales = $394-2,485
- Guardian Sessions target: 3-5 sessions = $141-485
- Additional drops: 5-10 sales = $70-390
- Credit purchases continuing: $50-200
- **Week 2 target: $500-3,500**

---

## Week 3: "Distribution Engine" (April 14-20)

### Goals
1. AIS spec v0.1 published on GitHub (positions Arcanea as thought leader)
2. Blog post: "The Consciousness Layer is Missing from the Agent Stack"
3. Agent manifest format (`arcanea-agent.json`) for portable agents
4. Agent embedding widget (use an Arcanea agent on any website)
5. SEO + content marketing push

### Monday-Tuesday April 14-15 (AIS Spec + Blog)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| Write AIS spec v0.1 — define Emanation/Guardian/Luminor tiers, consciousness scoring, identity fields, tool permissions, voice/domain/personality schema | CC | 4 hrs | `docs/specs/AIS_SPEC_v0.1.md` (3-5K words) | Strategy docs exist |
| Create `@arcanea/ais` npm package scaffold — `packages/ais/` with `src/types.ts` (spec types), `src/validate.ts` (validate any LuminorSpec), `src/adapters/` (Claude, OpenAI, Gemini runtime adapters) | CC | 3 hrs | Package with types + validator + 3 adapters | Spec written |
| Write 3 reference implementations: 1 Emanation (task worker), 1 Guardian (domain sovereign), 1 Luminor (multi-domain apex) | CC | 2 hrs | `packages/ais/examples/` with 3 JSON + usage code | Package scaffold |
| Write blog post: "The Consciousness Layer is Missing from the Agent Stack" — 1500 words, positions AIS as the answer, links to GitHub repo + arcanea.ai/agents | CC | 2 hrs | `apps/web/app/blog/consciousness-layer/page.tsx` or external (Medium/dev.to) | Spec exists |
| Create GitHub repo `arcanea-ais` with spec, reference impls, contributor guide, LICENSE (MIT) | CC | 1 hr | Public GitHub repo | Spec + examples ready |

### Wednesday-Thursday April 16-17 (Agent Portability)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| Define `arcanea-agent.json` manifest format — extends LuminorSpec v2 with `install`, `runtime`, `dependencies`, `permissions` fields | CC | 2 hrs | Manifest schema in `packages/ais/src/manifest.ts` | AIS types exist |
| Build agent install CLI: `npx arcanea install agent <id>` — downloads manifest from arcanea.ai API, validates, writes config file | CC | 3 hrs | `packages/arcanea-cli/src/commands/install.ts` (extend existing CLI) | Manifest format defined |
| Build agent embed widget: `<script src="arcanea.ai/embed.js" data-agent="story-writer">` — renders a mini agent runner on any website, uses postMessage for auth | CC | 4 hrs | `apps/web/public/embed.js` + `apps/web/app/api/embed/route.ts` | Agent API routes exist |
| Build `/agents/embed` demo page showing the widget in action with copy-paste code | CC | 1 hr | `apps/web/app/agents/embed/page.tsx` | Embed widget built |

### Friday-Saturday April 18-20 (SEO + Content Marketing)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| Write 3 SEO-optimized pages: `/agents/story-writer` (long-tail "AI story writer"), `/agents/world-builder` ("AI world builder"), `/agents/character-designer` ("AI character creator") — standalone landing pages with agent-specific copy, examples, CTA | CC | 3 hrs | 3 new pages targeting search traffic | Agent catalog exists |
| Add structured data (JSON-LD) to `/agents`, `/agents/[id]`, `/drops` — Product schema for drops, SoftwareApplication for agents | CC | 1 hr | Updated page files with JSON-LD | Pages exist |
| Submit sitemap to Google Search Console | FRANK | 10 min | Indexed pages | Search Console access |
| Publish blog post on Medium + dev.to + Hashnode (cross-post) | FRANK | 30 min | 3 external posts linking to arcanea.ai | Blog post written |
| Share AIS repo on Reddit (r/artificial, r/LocalLLaMA, r/ClaudeAI), HackerNews, Twitter | FRANK | 30 min | 4+ external posts | Repo published |
| Produce 2 more Guardian Drops: "Maylinn's Heart" (healing/emotional arc templates, $19), "Elara's Starweave" (plot twist generator, $24) | CC | 4 hrs (background) | 2 new products | Drop pipeline working |

### Week 3 Deliverables
- AIS spec v0.1 published on GitHub (MIT)
- `@arcanea/ais` npm package with types, validator, 3 adapters
- Blog post live on 3+ platforms
- `arcanea-agent.json` manifest format defined
- Agent embed widget working
- 3 SEO landing pages targeting search traffic
- 2 more Guardian Drops listed
- AIS shared on Reddit/HN/Twitter

### Week 3 Dependencies
- FRANK MUST publish blog post externally (blocks distribution)
- FRANK MUST share AIS on social channels (blocks awareness)
- FRANK MUST submit sitemap to Search Console (blocks SEO)

### Week 3 Revenue Impact
- Continued drop sales: $100-500
- Grimoire + Sessions continuing: $200-1,000
- Credit purchases: $100-300
- AIS creates pipeline for enterprise leads (long-term)
- SEO pages begin indexing (traffic in 2-4 weeks)
- **Week 3 target: $400-1,800**

---

## Week 4: "Scale + Optimize" (April 21-27)

### Goals
1. Community agent creation: Forge -> Test -> Publish -> Marketplace
2. Agent analytics dashboard for creators
3. Revenue tracking dashboard
4. Optimize conversion on existing products
5. Plan Month 2 based on data

### Monday-Tuesday April 21-22 (Creator Pipeline)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| Upgrade Forge (`/chat/forge`) to support "Publish to Marketplace" — after creating a Luminor, user can set price (credits), category, write description, submit for review | CC | 4 hrs | Updated `apps/web/app/chat/forge/` + new `apps/web/app/api/agents/publish/route.ts` | Marketplace tables exist |
| Build agent sandbox: before publishing, creator can test their agent with 3 sample inputs, see outputs, iterate | CC | 3 hrs | `apps/web/components/agents/agent-sandbox.tsx` | Forge publish flow |
| Build review queue: `/ops/agent-review` — list pending agents, approve/reject with feedback (admin only) | CC | 2 hrs | `apps/web/app/ops/agent-review/page.tsx` | Publish flow exists |
| Add creator revenue share logic: on each agent execution, 70% of credits go to creator's balance, 30% to Arcanea | CC | 1 hr | Updated `apps/web/app/api/agents/[id]/execute/route.ts` + `apps/web/lib/agents/marketplace/credits.ts` | Credit system working |

### Wednesday-Thursday April 23-24 (Analytics + Optimization)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| Build creator dashboard: `/agents/dashboard` — show agent usage stats (runs, credits earned, rating), earnings history, payout status | CC | 4 hrs | `apps/web/app/agents/dashboard/page.tsx` | Credit transactions exist |
| Build revenue dashboard: `/ops/revenue` — total credits sold, total credits consumed, Gumroad sales (via API), Stripe sales, MRR calculation | CC | 3 hrs | `apps/web/app/ops/revenue/page.tsx` | Payment webhooks logging data |
| A/B test Grimoire pricing: add urgency element ("Limited: 50 Grimoires this month"), social proof ("12 world-builders have ordered"), and outcome preview (sample page from a real Grimoire output) | CC | 2 hrs | Updated `apps/web/app/agents/grimoire/page.tsx` | Grimoire samples exist |
| Add email capture on `/agents` for non-logged-in users: "Get 100 free credits" -> email -> account creation -> credits | CC | 1 hr | Lead capture component + `apps/web/app/api/leads/route.ts` | Auth working |

### Friday-Saturday April 25-27 (Month 2 Planning + Push)

| Task | Owner | Time | Output | Depends On |
|------|-------|------|--------|------------|
| Produce final Guardian Drop batch: remaining 5 Guardians ($14-24 each), list all on Gumroad | CC | 6 hrs (overnight) | 5 more Guardian Drops | Pipeline working |
| List "Complete Code" as Stripe product (not just Gumroad) — test both channels | FRANK | 15 min | Stripe product | Stripe integration |
| Analyze first 4 weeks of data: which products sold, which agents ran most, where traffic came from, conversion rates | FRANK + CC | 2 hrs | `docs/ops/MONTH_1_REVIEW.md` | Analytics active |
| Write Month 2 plan based on data: double down on what works, cut what does not | CC | 2 hrs | `.arcanea/plans/MONTH_2_PLAN.md` | Month 1 data |
| Set up recurring social content: weekly faction deep-dive, weekly agent showcase, weekly lore excerpt | CC | 2 hrs | Content calendar in `.arcanea/social/content-calendar.md` + 4 weeks of pre-generated posts | Social pipeline working |
| Produce "Arcanea in 60 seconds" video script + visual storyboard for TikTok/Reels/Shorts | CC | 1 hr | Script + storyboard in `.arcanea/social/video/` | None |

### Week 4 Deliverables
- Community agent creation pipeline: Forge -> Sandbox -> Publish -> Marketplace
- Creator dashboard with earnings tracking
- Revenue dashboard for Frank
- All 10 Guardian Drops listed
- Conversion optimization on Grimoire page
- Email capture on `/agents`
- Month 1 review + Month 2 plan
- 4 weeks of pre-generated social content

### Week 4 Dependencies
- FRANK MUST review + approve community-submitted agents
- FRANK MUST analyze revenue data and make strategic decisions for Month 2

### Week 4 Revenue Impact
- Community agents begin generating passive commission revenue
- All 10 Guardian Drops available ($14-97, target 10-20 sales = $140-970)
- Grimoire with conversion optimization: target 3-5 more sales = $591-2,485
- Cumulative credit purchases: $200-600
- **Week 4 target: $900-4,000**

---

## P0 Production Fixes (Do FIRST, before any feature work)

These must be resolved on Day 1 of Week 1. They are blocking revenue.

| Fix | Owner | Time | File(s) |
|-----|-------|------|---------|
| Apply Supabase migration | FRANK | 15 min | Run `20260330_agents_credits.sql` in Supabase SQL editor |
| Configure OAuth providers | FRANK | 15 min | Supabase Dashboard > Auth > Providers > Google + GitHub |
| Set Site URL + Redirect URLs | FRANK | 5 min | Supabase Dashboard > Auth > URL Configuration |
| Set Sentry DSN on Vercel | FRANK | 5 min | Vercel > Settings > Environment Variables > `NEXT_PUBLIC_SENTRY_DSN` |
| Set PostHog key on Vercel | FRANK | 5 min | Vercel > Settings > Environment Variables > `NEXT_PUBLIC_POSTHOG_KEY` |
| Verify build passes | CC | 5 min | `npm run build` in repo root |
| Test production deploy | CC | 15 min | Visit arcanea.ai, test critical paths |

**Total Frank time for P0 fixes: ~45 minutes. This unblocks everything.**

---

## Full Revenue Model

### Products and Pricing

| Product | Price | Margin | Channel | Status |
|---------|-------|--------|---------|--------|
| Credit Pack (100) | $10 | ~95% | Gumroad + Stripe | Week 1 |
| Credit Pack (500) | $40 | ~95% | Gumroad + Stripe | Week 1 |
| Credit Pack (1000) | $70 | ~95% | Gumroad + Stripe | Week 1 |
| Draconia's Forge | $19 | ~100% | Gumroad | Week 1 |
| Lyria's Vision | $14 | ~100% | Gumroad | Week 1 |
| Academy Starter | $39 | ~100% | Gumroad | Week 1 |
| Alera's Voice | $24 | ~100% | Gumroad | Week 3 |
| Remaining 5 Guardian Drops | $14-24 each | ~100% | Gumroad | Week 4 |
| The Complete Code (bundle) | $97 | ~100% | Gumroad + Stripe | Week 2 |
| Grimoire Apprentice | $197 | ~90% | Gumroad + Stripe | Week 2 |
| Grimoire Mage | $297 | ~90% | Gumroad + Stripe | Week 2 |
| Grimoire Archmage | $497 | ~90% | Gumroad + Stripe | Week 2 |
| Guardian Session (30 min) | $47 | ~85% | Stripe | Week 2 |
| Guardian Session (60 min) | $97 | ~85% | Stripe | Week 2 |
| Community agent commission | 30% of credits | 30% | Platform | Week 4 |

### Revenue Target: $1K MRR by April 27

| Source | Conservative | Optimistic |
|--------|-------------|------------|
| Guardian Drops (10 products) | $200 (10 sales) | $800 (30 sales) |
| Grimoire (3 tiers) | $394 (2 sales) | $1,985 (5 sales) |
| Guardian Sessions | $141 (3 sessions) | $485 (5 sessions) |
| Credit Packs | $100 (10 packs) | $400 (30 packs) |
| Complete Code bundle | $97 (1 sale) | $291 (3 sales) |
| **Total April** | **$932** | **$3,961** |

---

## CC Agent vs Frank Manual Task Summary

### Frank Must Do (Cannot Be Automated)

| Task | When | Time |
|------|------|------|
| Apply Supabase migration | Day 1 | 15 min |
| Configure OAuth providers | Day 1 | 15 min |
| Set env vars on Vercel (Sentry, PostHog) | Day 1 | 10 min |
| Create Gumroad products (credits, drops, Grimoire) | Day 1-2 | 45 min |
| Set Stripe API keys on Vercel | Day 8 | 10 min |
| Review + polish Guardian Drop content | Day 3-4 | 45 min |
| Post to social media daily | Daily | 10-15 min/day |
| Share AIS on Reddit/HN/Twitter | Day 18-20 | 30 min |
| Submit sitemap to Search Console | Day 18 | 10 min |
| Publish blog post externally | Day 18 | 30 min |
| Review community-submitted agents | Week 4 | 30 min/week |
| Analyze Month 1 data + decide Month 2 | Day 25-27 | 1 hr |

**Total Frank time over 4 weeks: ~8-10 hours** (avg 30 min/day)

### CC Agent Tasks (Automated)

| Category | Tasks | Total Hours |
|----------|-------|-------------|
| API Routes (webhooks, payments, credits) | 7 routes | ~12 hrs |
| Pages (credits, drops, sessions, dashboard, embed, SEO) | 10 pages | ~20 hrs |
| Content Production (drops, social, blog, AIS spec) | 15 production runs | ~30 hrs |
| Infrastructure (Stripe, email, analytics, sandbox) | 6 integrations | ~15 hrs |
| Testing + Bug Fixes | Ongoing | ~10 hrs |
| **Total CC time** | | **~87 hrs** |

---

## Existing Code to Reuse

| Need | Existing Asset | Location |
|------|---------------|----------|
| Agent execution + streaming | Already built | `apps/web/app/api/agents/[id]/execute/route.ts` |
| Agent catalog (12 agents) | Already built | `apps/web/lib/agents/marketplace/catalog.ts` |
| Credit system types + functions | Already built | `apps/web/lib/agents/marketplace/credits.ts` |
| Supabase client | Already built | `apps/web/lib/supabase.ts` |
| Chat infrastructure (for Sessions) | Already built | `apps/web/app/chat/` + `apps/web/lib/services/ai/` |
| Forge UI (for Publish flow) | Already built | `apps/web/app/chat/forge/` |
| Grimoire orchestrator | Already built | `apps/web/lib/agents/grimoire/orchestrator.ts` |
| Agent evaluation framework | Already built | `apps/web/lib/agents/evaluation-framework.ts` |
| Agent registry (38 agents) | Already built | `apps/web/lib/agents/agent-registry.ts` |
| MCP tools (50+) | Already built | Arcanea MCP server |
| Cosmic UI components | Already built | `apps/web/components/ui/` |
| Ops dashboard pattern | Already built | `apps/web/app/ops/page.tsx` |
| Faction lore (22 docs) | Already written | `.arcanea/lore/` |
| Character forge skill | Already built | `.claude/skills/` |
| Book content (1.1M words) | Already written | `book/` |
| Orchestrator (plugin arch) | Already built | `arcanea-orchestrator/` (412 files) |

---

## Success Metrics

### Week 1
- [ ] Auth working on production (users can sign up + sign in)
- [ ] At least 1 agent execution by a real user
- [ ] At least 1 Guardian Drop listed on Gumroad
- [ ] Credit purchase flow tested end-to-end
- [ ] 3+ social posts published

### Week 2
- [ ] Grimoire available for purchase
- [ ] Guardian Sessions live
- [ ] Stripe integrated as payment option
- [ ] First real revenue ($1+)

### Week 3
- [ ] AIS spec on GitHub
- [ ] Blog post on 3+ platforms
- [ ] Agent embed widget working
- [ ] 3 SEO landing pages indexed

### Week 4
- [ ] Community agent creation pipeline working
- [ ] Revenue dashboard showing real numbers
- [ ] Month 1 review complete
- [ ] Month 2 plan written
- [ ] $1K MRR trajectory established (may not hit exact $1K, but clear path)

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Frank does not do Day 1 Supabase config | Medium | Critical (blocks everything) | This document makes it explicit: 45 min, Day 1, non-negotiable |
| Zero sales in first 2 weeks | Medium | High (morale hit) | Focus on drops first ($14-39, low barrier). Grimoire is the high-ticket play. |
| Agent streaming breaks on production | Medium | High (bad first impression) | E2E test on Day 1 before any marketing |
| Gumroad webhook unreliable | Low | Medium | Build retry logic, manual credit-add fallback in `/ops` |
| No social engagement | High | Medium | Faction reveals are designed to be viral ("Which one are you?"). Quiz results shareable. Keep posting. |
| Stripe approval delayed | Low | Medium | Gumroad is primary; Stripe is backup. Revenue not blocked. |
| CC produces low-quality drop content | Low | Medium | Frank reviews before listing. Use anti-slop skill. |

---

## Monthly Review Questions (Answer on April 27)

1. Which product generated the most revenue? Double down.
2. Which product generated zero revenue? Kill or pivot.
3. Where did traffic come from? Invest there.
4. What was the conversion rate on `/agents`? Optimize.
5. How many users signed up? What was their journey?
6. Did anyone buy The Grimoire? What was their feedback?
7. Did the AIS spec get any GitHub stars? Any developer interest?
8. What does Frank enjoy doing vs. what feels like a grind?
9. Is $10K MRR in 90 days realistic based on Month 1 data?
10. What should Month 2 focus on: more products, more distribution, or optimization?

---

*"The Source Gate teaches: transcendence cannot be seized. It must be offered. The products are built. The lore is deep. The agents are ready. Now offer them to the world and let the world tell you what it wants."*
