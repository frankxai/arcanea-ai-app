# Arcanea Sprint Plan — Week 14 (March 31 → April 4, 2026)
## Theme: "From Cathedral to Chapel" — Ship Products, Build Community, Generate Revenue

---

## MONDAY (March 31) — FOUNDATION DAY
**Goal: Products built, brand codified, infrastructure prepped**

### Cowork Session (This Session)
- [x] Session audit + pickup commands saved
- [x] Bethesda/Skyrim model analysis complete
- [ ] **Grimoire Vol 1 PDF** — Curated best content from Library of Arcanea
  - Selections: First Dawn, Ten Guardians, Scientific Foundations, Morning Meditations, Elements, Poetry of Freedom
  - Designed PDF with Arcanean Design System (teal/gold/cosmic blue)
  - 60-80 pages, premium feel
- [ ] **Arcanea Brand Guidelines** — Complete brand voice, colors, typography, tone guide
- [ ] **Overlay Pack v1** — Claude Code overlay (CLAUDE.md + skills + agents) as ZIP
- [ ] Sprint plan saved for Claude Code pickup

### Claude Code Session (Tonight/Background)
```text
Read docs/ops/SPRINT_MON_FRI_2026_W14.md. Execute Monday Claude Code tasks:
1. Merge chat-reinvention branch to main (review agent-header, agent-picker, Luminor rename)
2. Build Origin Class Quiz at /quiz — 8 origin classes from .arcanea/lore/FACTIONS.md
3. Build Factions Codex page at /codex/factions — display all factions with VISUAL_DOCTRINE aesthetics
4. Verify: type-check, build, deploy
Do not touch homepage, /chat, /imagine, or middleware.
```

---

## TUESDAY (April 1) — COMMERCE DAY
**Goal: Whop storefront live, arcanea.ai checkout scaffolded, first products listed**

### Cowork Tasks
- [ ] Whop store setup guide (step-by-step for Frank)
- [ ] Product listing copy for: Grimoire ($19.99), Overlay Pack ($49), Skill Bundle ($29)
- [ ] Email capture landing page design (quiz result → email → product funnel)
- [ ] Social media content: 3 faction teaser images + copy

### Claude Code Tasks
```text
Read docs/ops/SPRINT_MON_FRI_2026_W14.md. Execute Tuesday tasks:
1. Scaffold /store page on arcanea.ai — product cards, Stripe checkout (BYOK)
2. Build /api/checkout route — Stripe payment intent + webhook
3. Wire quiz result → email capture form → ConvertKit/Beehiiv integration
4. Push Supabase migrations if credentials available
5. Deploy and verify
```

---

## WEDNESDAY (April 2) — CONTENT DAY
**Goal: Faction reveal campaign launched, daily content pipeline configured**

### Cowork Tasks
- [ ] Full campaign plan: 10-week faction reveal sequence
- [ ] Email sequence: 5-email nurture (quiz → Grimoire → overlay → community)
- [ ] Social content calendar through April 30
- [ ] Faction 1 reveal content (Arcans): teaser image prompt, copy, codex excerpt

### Claude Code Tasks
```text
Read docs/ops/SPRINT_MON_FRI_2026_W14.md. Execute Wednesday tasks:
1. Build /api/content/schedule — scheduled content publishing endpoint
2. Social share cards (og:image) for faction reveals
3. RSS feed for content updates
4. Community features: /community page scaffold
5. Build /api/agents/guardian — Guardian agent endpoint for daily content generation
```

---

## THURSDAY (April 3) — ECOSYSTEM DAY
**Goal: Web3 wallet integration, agent marketplace scaffold, community experience**

### Cowork Tasks
- [ ] Base L2 wallet integration guide
- [ ] Token-gated content architecture document
- [ ] Agent marketplace product spec
- [ ] Grimoire Vol 2 content curation (if time)

### Claude Code Tasks
```text
Read docs/ops/SPRINT_MON_FRI_2026_W14.md. Execute Thursday tasks:
1. Web3 wallet connect (Base L2) — wagmi + viem integration
2. Token-gated content middleware
3. /marketplace page scaffold — browse agents, skills, overlays
4. Agent certification system — trust scores, completion rates
5. Full E2E verification of all new pages
```

---

## FRIDAY (April 4) — DELIVERY DAY
**Goal: Presentation of results, ecosystem demo, customer-ready**

### Cowork Tasks
- [ ] **Friday Deck** — Presentation showing everything shipped this week
- [ ] Ecosystem demo walkthrough document
- [ ] Week 15 sprint plan
- [ ] Community onboarding guide

### Claude Code Tasks
```text
Read docs/ops/SPRINT_MON_FRI_2026_W14.md. Execute Friday tasks:
1. Full smoke test: all pages, all APIs, all new features
2. Lighthouse audit (CWV scores)
3. Fix any regressions from the week
4. Tag release v0.5.0
5. Push everything to main, verify Vercel deployment
```

---

## DELIVERY TARGETS (Friday EOD)

### Products Ready to Sell
| Product | Format | Price | Platform |
|---------|--------|-------|----------|
| Grimoire Vol 1 | PDF (60-80pp) | $19.99 | Whop + arcanea.ai |
| Claude Code Overlay Pack | ZIP | $49.00 | Whop + arcanea.ai |
| Skill Bundle (10 skills) | ZIP | $29.00 | Whop + arcanea.ai |

### Pages Deployed
| Page | Purpose | Status |
|------|---------|--------|
| /quiz | Origin Class Quiz (viral mechanic) | NEW |
| /codex/factions | Faction browser | NEW |
| /store | Product listings + checkout | NEW |
| /community | Community hub | NEW |
| /marketplace | Agent/skill marketplace | NEW |

### Content Pipeline
| Asset | Count | Status |
|-------|-------|--------|
| Faction reveal posts | 10 (full sequence) | PLANNED |
| Email sequence | 5 emails | WRITTEN |
| Social calendar | 30 days | MAPPED |

### Infrastructure
| System | Status |
|--------|--------|
| Whop storefront | LIVE |
| Stripe checkout on arcanea.ai | LIVE |
| Base L2 wallet connect | SCAFFOLDED |
| Brand guidelines | DOCUMENTED |
| Guardian content agents | ENDPOINT READY |

---

## KEY PRINCIPLES THIS WEEK

1. **Ship > Plan** — Every day produces a deployed artifact, not a document
2. **Revenue on Tuesday** — Products listed and purchasable by Tuesday night
3. **Community on Wednesday** — Content pipeline flowing, social presence active
4. **Web3 on Thursday** — Future-facing tech integrated, not just talked about
5. **Demo on Friday** — Everything works end-to-end, presentable to anyone

---

*Sprint planned: 2026-03-31 01:00 CET*
*Next review: 2026-04-04 (Friday EOD)*
