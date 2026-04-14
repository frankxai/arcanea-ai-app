# Arcanea Template Business Model

**Last updated:** 2026-04-15
**Owner:** Frank
**Status:** Strategic plan — execution in motion

## Thesis

The template market is large and competitive, but **differentiation comes from taste + mythology**. Arcanea has both. The business model has three tiers: free templates as a discovery engine, premium kits as middle-tier monetization, and the full platform as the flagship.

## Market Research (April 2026)

### v0 Template Leaderboard (ranked by duplicates)
| Rank | Template | Category | Duplicates | Our Advantage |
|------|----------|----------|-----------|---------------|
| 1 | Financial Dashboard | Dashboards | 27.6K | Zero cosmic/glass aesthetic — **open lane** |
| 2 | Futuristic Dashboard | Dashboards | 24.4K | Generic "futuristic" — we ARE the aesthetic |
| 3 | Pointer AI Landing | Landing | 19.1K | Arcanea voice + motion primitives win on taste |
| 4 | Brillance SaaS Landing | Landing | 12.3K | Same |
| 5 | M.O.N.K.Y Dashboard | Dashboards | 10.5K | Data-viz template — we can top with glass |
| 6 | Nano Banana Playground | AI apps | 5.4K | Luminor personas + BYOK is a better story |
| 7 | Habbo AI Chatroom | AI | 2.5K | Multiplayer angle we don't need to chase |

### Vercel Marketplace — AI Chatbot Category
- **Vercel AI Chatbot (our fork source)**: the canonical template. Generic shadcn theme, server-only keys.
- **Gemini AI Chatbot**: single-provider, no personas, no glass.
- **LangChain+Next.js**: agent-focused, different audience.
- **Multi-Modal Chatbot**: Vercel demo for SDK features.

**No competitor has:** 12 personas × real BYOK × cosmic glass × liquid motion. That combination is Arcanea's moat.

### Pricing Signals
- **v0 itself**: $0 free → $20 Premium → $30/user Team → $100/user Business
- **Gumroad**: 10% platform fee (vs 40% Envato). A $49 template nets ~$43.
- **Nextjstemplates.com**: bundles at $99-$299 common.
- **Premium design kits** (Gumroad): $29-$197 range.

## The Three-Tier Model

### Tier 1: Free Vercel Marketplace Templates (Discovery Engine)

Goal: drive traffic + trust. Each template links to arcanea.ai.

| # | Template | Status | Target | GitHub | Lead |
|---|----------|--------|--------|--------|------|
| 1 | **cosmic-landing-template** | Shipped | Landing pages | frankxai/cosmic-landing-template | Motion kit showcase |
| 2 | **arcanea-chat-template** | Shipped v1 | AI chat | frankxai/arcanea-chat-template | 12 Luminors + BYOK |
| 3 | **arcanea-dashboard-template** | **TO BUILD** | Dashboards (highest-volume category) | — | Cosmic analytics + glass cards |
| 4 | **arcanea-world-engine-template** | Planned | Game/fiction tooling | — | Unique — zero competition |
| 5 | **arcanea-mcp-starter** | Planned | Agent builders | — | MCP 1.29 + 5 tools |

Each template:
- MIT license (no attribution required)
- One-click Vercel deploy button
- `.env.example` with zero required vars where possible
- Clear README explaining the 3-4 key files
- Link back to arcanea.ai in header

**Why free:** discovery economics. A template with 10K duplicates becomes a top-of-funnel asset. Gumroad premium = 500 sales × $49 = $24.5K. Free template with 10K duplicates driving 2% to paid = 200 customers × $97/mo = $19.4K/mo recurring.

### Tier 2: Premium Kits on Gumroad ($29-$197)

Goal: monetize the craft directly for builders who want more than the free starters.

| Kit | Price | Contents |
|-----|-------|----------|
| **Arcanea Motion Kit Pro** | $49 | 12 motion primitives + 20 compositions + Framer Motion recipes |
| **Luminor Persona Pack** | $29 | 30+ additional personas with lore + voice profiles |
| **Arcanea Design System Pro** | $97 | Figma tokens + Tailwind config + glass recipes + 40 components |
| **Living World Starter** | $149 | World Engine + Character templates + Lore graph |
| **Arcanea Agent Pack** | $197 | 7 specialized agents + MCP server + Managed Agent API integration |
| **Arcanea Bundle** | $297 | All of the above |

Gumroad fees: 10% + $0.50/tx. Projected: $43 net on a $49 sale.

### Tier 3: Full Platform (Founding Circle)

Per `feedback_quality_standard.md` and `project_pricing_strategy.md`:
- **Founding Circle**: $97/mo — full arcanea.ai + community + early access
- **Team**: $297/mo — multi-user, shared vault
- **Enterprise**: custom — white-label, SLA

Templates funnel → Founding Circle is the flagship monetization.

## Why This Works

1. **First Principles (Gate 1):** Templates are what builders already search for. We meet them where they are.
2. **Voice (Gate 2):** "Everything we build, you can fork" — sovereign, honest, Arcanea.
3. **Design (Gate 3):** Cosmic glass + liquid motion is our moat — nobody else has it at this quality.
4. **Journey (Gate 5):** Fork free → buy kit → subscribe → enterprise. Clean funnel.
5. **Strategy (Gate 7):** 10K-duplicate template is cheaper marketing than 10K ad impressions, and it compounds.

## Execution Roadmap

### Done (this sprint)
- `cosmic-landing-template` live, MIT, deploy button, motion primitives
- `arcanea-chat-template` live, MIT, 12 Luminors + real BYOK end-to-end
- `arcanea.ai/templates` page with 7 blueprints, zero "Coming Soon"

### Next (commands below)
1. `vercel link` both template repos → get live preview URLs → test BYOK + Luminor switch in a real browser
2. Render preview images for Vercel marketplace (1200×630)
3. Submit both templates to https://vercel.com/templates/submit
4. Scaffold `arcanea-dashboard-template` (highest-volume category, best market gap)

### Later
5. Gumroad store setup → Motion Kit Pro first ($49, easiest to package)
6. Founding Circle checkout on arcanea.ai
7. World Engine template (unique, no competition)
8. MCP Starter template (agent-builder audience)

## The Commands Frank Needs to Run

```bash
# 1. Link chat template to Vercel
cd C:\Users\frank\arcanea-chat-template
vercel link      # interactive — pick "arcanea" scope, create new project
vercel --prod    # first production deploy

# 2. Link cosmic landing to Vercel
cd C:\Users\frank\cosmic-landing-template
vercel link
vercel --prod

# 3. Submit to Vercel marketplace (via web)
# Open: https://vercel.com/templates/submit
# Repo URL: https://github.com/frankxai/arcanea-chat-template
# Repo URL: https://github.com/frankxai/cosmic-landing-template
```

After deploys return URLs, paste them back to me and I'll:
- Test BYOK + Luminor switching in browser
- Generate OG preview images
- Prepare marketplace submission metadata
- Scaffold the dashboard template
