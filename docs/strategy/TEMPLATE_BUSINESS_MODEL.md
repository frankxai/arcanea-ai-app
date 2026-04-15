# Arcanea Template Strategy

**Last updated:** 2026-04-15
**Owner:** Frank
**Direction:** Free-first OSS. Monetization deferred until quality bar is unambiguous.

## North Star

> "Everything we build, you can fork. Free forever until it's so good you'd pay to skip building it yourself. Then optional premium kits for those who want more."

## Principles

1. **Free-first, excellence-gated.** Every template starts free (MIT). We only introduce paid tiers when the free version is already best-in-class AND people are asking.
2. **Build for builders.** Single-page README. Zero required env vars. Real deploy button. Clean fork tree.
3. **Separate repos, one ecosystem.** Each template is its own repo (needed for Vercel deploy button + clean fork). A meta-repo `arcanea-templates` indexes them.
4. **OSS community before paywalls.** Drop Founding Circle for now. The path is: OSS → Sacred Mark / NFT holders → team platform for Arcanea's own agents.
5. **Ship, then raise.** Launch everything free. When a template has 5K+ duplicates and users ask for more, *then* introduce a premium kit.

## The Templates (all free, MIT, staged by priority)

| # | Template | Status | Repo | Notes |
|---|----------|--------|------|-------|
| 1 | **cosmic-landing-template** | ✓ Live | `frankxai/cosmic-landing-template` | 12 motion primitives, MIT |
| 2 | **arcanea-chat-template** | ✓ Live | `frankxai/arcanea-chat-template` | 12 Luminors + real BYOK + OG image |
| 3 | **arcanea-dashboard-template** | **Building now** | `frankxai/arcanea-dashboard-template` | Cosmic analytics, 6 widgets — biggest v0 category gap |
| 4 | **arcanea-world-engine-template** | Planned | `frankxai/arcanea-world-engine-template` | Unique — zero competition |
| 5 | **arcanea-mcp-starter** | Planned | `frankxai/arcanea-mcp-starter` | MCP SDK 1.29 + 5 tools + agent example |
| 6 | **arcanea-agent-template** | Planned | `frankxai/arcanea-agent-template` | Claude Managed Agent API + MCP integration |
| 7 | **arcanea-publishing-template** | Planned | `frankxai/arcanea-publishing-template` | Multi-agent writing w/ Taste Gate |

Plus the meta-index:
- **arcanea-templates** (meta-repo) — single README pointing to all 7+ templates with screenshots and deploy buttons.

## Market Evidence (v0 Leaderboard, April 2026)

| Rank | v0 Template | Category | Duplicates | Our Template |
|------|-------------|----------|-----------|--------------|
| 1 | Financial Dashboard | Dashboards | 27.6K | arcanea-dashboard-template |
| 2 | Futuristic Dashboard | Dashboards | 24.4K | arcanea-dashboard-template |
| 3 | Pointer AI Landing | Landing | 19.1K | cosmic-landing-template |
| 4 | Brillance SaaS Landing | Landing | 12.3K | cosmic-landing-template |
| 5 | M.O.N.K.Y Dashboard | Dashboards | 10.5K | arcanea-dashboard-template |
| 6 | Nano Banana Playground | AI apps | 5.4K | arcanea-chat-template |
| 7 | Habbo AI Chatroom | AI | 2.5K | arcanea-chat-template |

**Dashboard is the biggest gap** (zero cosmic/glass competition across 62K combined duplicates in top-3).

## Management Tool

**GitHub Projects V2** (one project: "Arcanea Templates")

Why:
- Free.
- Native cross-repo aggregation (issues from all template repos in one board).
- Roadmap + Kanban + Table views.
- Already where the code lives.
- Forkers and OSS contributors use it natively.
- Notion stays for lore + docs. Linear not needed yet.

Setup (one-time, via gh CLI):
```bash
gh project create --title "Arcanea Templates" --owner @me
gh project link frankxai/arcanea-chat-template --owner @me
gh project link frankxai/cosmic-landing-template --owner @me
gh project link frankxai/arcanea-dashboard-template --owner @me
# ...link each new template repo as created
```

## Future Paid Tier (WHEN, not NOW)

When quality is unambiguous and demand is clear:

| Tier | Platform | Why that platform |
|------|----------|-------------------|
| Premium kits (digital goods) | **LemonSqueezy** | Merchant of Record — handles Dutch BTW / EU VAT automatically |
| Community + cohorts | **Whop** | Best creator community infra, low fee (~3%) |
| Sacred Mark / NFT holders | Onchain | Per `project_nft_forge_evolved.md` — 4-tier mark system |
| Team platform (arcanea.ai app) | Stripe via Supabase | Direct subscription when we're ready |

**Nothing paid until:** 5K+ duplicates on a template OR specific user request for premium features OR Frank decides the quality has crossed the bar.

## Voice Rules for Template READMEs

- No "premium" or "pro" in the README (even in a section header). Everything says "MIT. Free. Fork it."
- No "sign up" or "login required" on any template landing page.
- Arcanea link in header = brand trust, not upsell.
- Credits: "Built by Arcanea. Fork freely."

## Execution State (this session)

**Done:**
- cosmic-landing-template shipped
- arcanea-chat-template shipped with full BYOK + OG + Arcanea metadata + production build passing
- Strategy doc updated to reflect free-first direction

**Next (building now):**
- arcanea-dashboard-template scaffold
- cosmic-landing OG image
- chat template: strip DB dependency to opt-in branch

**Next session commands Frank runs:**
```bash
# Link each template to Vercel + deploy
cd C:\Users\frank\arcanea-chat-template && vercel link && vercel --prod
cd C:\Users\frank\cosmic-landing-template && vercel link && vercel --prod
cd C:\Users\frank\arcanea-dashboard-template && vercel link && vercel --prod

# Create GitHub Project to manage all templates
gh project create --title "Arcanea Templates" --owner @me

# Submit each to Vercel marketplace (web)
# https://vercel.com/templates/submit
```
