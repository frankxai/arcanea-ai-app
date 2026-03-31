# Arcanea Monetization Playbook — Path to Autonomous Passive Income

> **Date**: 2026-03-31
> **Goal**: $10K MRR by Month 6. $100K MRR by Month 18.
> **Philosophy**: Build once, earn forever. Every feature should generate revenue while you sleep.

---

## The Revenue Stack (Ordered by Speed to Revenue)

### Layer 1: Credits (Ship Week 1) — Estimated $2-5K/mo

**Model**: Pre-paid credits for AI generation
**Why first**: Lowest friction to first dollar. No recurring commitment required.

| Pack | Price | Credits | Per Credit | Margin |
|------|-------|---------|-----------|--------|
| Starter | $5 | 50 | $0.10 | ~70% (AI API cost ~$0.03/generation) |
| Popular | $19 | 250 | $0.076 | ~75% |
| Power | $49 | 750 | $0.065 | ~78% |

**Credit costs**:
- 1 text generation (Gemini): ~$0.005
- 1 image generation (Imagen/DALL-E): ~$0.02-0.04
- 1 music generation (Suno API): ~$0.05-0.10
- Average blended cost per credit: ~$0.025
- Average margin per credit: ~75%

**Revenue math**: 100 users × avg $15/mo in credits = $1,500/mo
**At 1,000 users**: $15,000/mo (before costs)

### Layer 2: Forge Subscription (Ship Week 1) — Estimated $3-10K/mo

**Model**: $29/mo for unlimited creation
**Why**: Predictable recurring revenue. Higher lifetime value.

| Metric | Conservative | Optimistic |
|--------|-------------|-----------|
| Conversion rate (free→paid) | 2% | 5% |
| Free users needed for $10K | 17,241 | 6,897 |
| Churn rate | 8%/mo | 4%/mo |
| LTV (at 8% churn) | $362 | $725 |
| CAC target | <$36 | <$72 |

**Key insight**: Forge users who build worlds with interconnected lore, characters, and stories have very low churn because leaving = abandoning their creative universe. This is the lock-in.

### Layer 3: Premium Courses (Ship Month 2) — Estimated $2-10K/mo

**Model**: One-time purchase courses, $49-199 each

| Course | Price | Topic | Effort |
|--------|-------|-------|--------|
| Foundation of World-Building | $49 | Create your first world | 10 lessons, 3h video equiv |
| AI Prompt Mastery | $79 | Master creative prompting | 15 lessons |
| Character Design Lab | $49 | Build compelling characters | 10 lessons |
| Music Composition Studio | $49 | Create with AI music tools | 8 lessons |
| Advanced World Architecture | $199 | Full universe construction | 25 lessons |

**Revenue math**: 50 course sales/mo × avg $70 = $3,500/mo

### Layer 4: Marketplace (Ship Month 2-3) — Estimated $5-50K/mo

**Model**: Creator-to-creator marketplace, Arcanea takes 20%

**What sells**:
| Product Type | Price Range | Commission | Volume Potential |
|-------------|------------|------------|-----------------|
| World Templates | $5-29 | $1-5.80 | High |
| Prompt Collections | $3-15 | $0.60-3 | Very High |
| Character Packs | $3-19 | $0.60-3.80 | High |
| Custom AI Agents | $10-49 | $2-9.80 | Medium |
| Story Starters | $2-9 | $0.40-1.80 | Very High |
| Music Packs | $5-29 | $1-5.80 | Medium |
| Design Systems | $15-49 | $3-9.80 | Low-Medium |

**Platform GMV math**:
- 100 active sellers × avg $200/mo in sales = $20,000 GMV
- Arcanea 20% = $4,000/mo
- At 500 sellers: $100K GMV → $20K/mo

**The flywheel**: More creators → more products → more buyers → more revenue for creators → more creators

### Layer 5: API & Developer Access (Ship Month 3) — Estimated $5-20K/mo

**Model**: Usage-based API for developers who want to build on the Arcanea framework

| Tier | Price | Includes |
|------|-------|---------|
| Free | $0 | 100 API calls/day, basic world generation |
| Developer | $49/mo | 10K calls/day, all generation endpoints |
| Studio | $199/mo | 100K calls/day, custom model fine-tuning |
| Enterprise | Custom | Unlimited, dedicated infrastructure |

**Use cases**:
- Game studios building AI-driven narratives
- EdTech platforms adding creative AI tools
- Content agencies automating world-building
- Indie developers building on the mythology framework

### Layer 6: Licensing & White-Label (Month 6+) — Estimated $10-100K/mo

**Model**: License the Arcanea framework to organizations

| License | Price | Includes |
|---------|-------|---------|
| Community | Free | Open-source packages, self-hosted |
| Professional | $499/mo | Hosted infrastructure, support, custom theming |
| Enterprise | $2,999/mo | White-label, dedicated instance, SLA |
| Studio | $9,999/mo | Full framework + content library + AI models |

**Target customers**:
- Game studios wanting AI world-building tools
- Educational institutions creating interactive learning
- Entertainment companies building franchise worlds
- Agencies offering AI-powered creative services

### Layer 7: Content & IP (Ongoing) — Estimated $1-10K/mo

| Product | Price | Channel |
|---------|-------|---------|
| Arcanea book series (10+ planned) | $14.99/book | Amazon, direct sales |
| Music albums (AI-composed, human-curated) | $9.99/album | Spotify, Bandcamp |
| Art prints (Gallery highlights) | $19-79 | Printful, direct |
| Card game (Origin Classes, Guardians) | $29.99 | Direct, game stores |
| Arcanea merch (T-shirts, posters) | $15-45 | Printful, direct |

---

## The Autonomous Income Machine

### What "Passive" Means for Arcanea

**Fully Autonomous (No Human Touch)**:
- Credit purchases → Stripe processes → Credits added → AI generates
- Subscription renewals → Stripe bills → Access continues
- Marketplace sales → Buyer pays → Creator gets 80% → Arcanea gets 20%
- API usage → Metered billing → Auto-invoicing

**Semi-Autonomous (Occasional Human Touch)**:
- Course creation (one-time effort, sells forever)
- Marketplace quality review (AI-assisted, human escalation)
- Book publishing (write once, sell forever)
- Community management (AI-moderated, human-led events)

**Human-Required (Strategic Only)**:
- New feature design
- Brand partnerships
- Investor relations
- Platform vision

### Revenue Automation Architecture

```
┌─────────────────────────────────────────────────┐
│                REVENUE ENGINE                     │
├─────────────┬──────────────┬────────────────────┤
│   STRIPE    │   SUPABASE   │    AI APIS         │
│             │              │                     │
│ ┌─────────┐ │ ┌──────────┐ │ ┌────────────────┐ │
│ │Checkout │ │ │user_     │ │ │Gemini (text)   │ │
│ │Sessions │ │ │credits   │ │ │Imagen (image)  │ │
│ │         │ │ │          │ │ │Suno (music)    │ │
│ │Subscr.  │ │ │credit_   │ │ │                │ │
│ │Billing  │ │ │transact. │ │ │Cost: ~$0.025   │ │
│ │         │ │ │          │ │ │per generation  │ │
│ │Webhooks │ │ │creations │ │ │                │ │
│ │→ auto   │ │ │          │ │ │Margin: ~75%    │ │
│ │process  │ │ │marketplace│ │ │                │ │
│ └─────────┘ │ └──────────┘ │ └────────────────┘ │
├─────────────┴──────────────┴────────────────────┤
│              AUTONOMOUS FLOW                      │
│                                                   │
│  User pays → Credits added → User creates         │
│  → Creation saved → Appears in gallery            │
│  → Others discover → They sign up → They pay      │
│  → CYCLE REPEATS WITH ZERO HUMAN INTERVENTION     │
└─────────────────────────────────────────────────┘
```

---

## Revenue Projections

### Conservative Scenario

| Month | Credits | Forge | Courses | Marketplace | API | Total MRR |
|-------|---------|-------|---------|-------------|-----|-----------|
| 1 (Apr) | $500 | $290 | - | - | - | $790 |
| 2 (May) | $1,500 | $870 | $700 | - | - | $3,070 |
| 3 (Jun) | $3,000 | $1,740 | $1,400 | $500 | - | $6,640 |
| 4 (Jul) | $4,500 | $3,190 | $2,100 | $1,500 | $500 | $11,790 |
| 5 (Aug) | $6,000 | $4,930 | $2,800 | $3,000 | $1,000 | $17,730 |
| 6 (Sep) | $8,000 | $7,250 | $3,500 | $5,000 | $2,000 | $25,750 |

### Optimistic Scenario

| Month | Credits | Forge | Courses | Marketplace | API | Total MRR |
|-------|---------|-------|---------|-------------|-----|-----------|
| 1 (Apr) | $2,000 | $580 | - | - | - | $2,580 |
| 3 (Jun) | $10,000 | $5,800 | $5,000 | $4,000 | $2,000 | $26,800 |
| 6 (Sep) | $25,000 | $14,500 | $10,000 | $15,000 | $10,000 | $74,500 |

---

## What to Focus on FIRST (Decision Framework)

### The Revenue Priority Matrix

| Revenue Stream | Speed to $1 | Speed to $1K/mo | Effort | Ongoing Maintenance |
|---------------|-------------|-----------------|--------|-------------------|
| **Credits** | 1 week | 1 month | Medium | None (automated) |
| **Forge** | 1 week | 2 months | Medium | None (automated) |
| **Courses** | 2 weeks | 2 months | High | Low (content updates) |
| **Marketplace** | 2 months | 4 months | Very High | Medium (moderation) |
| **API** | 3 months | 6 months | Very High | Medium (docs/support) |
| **Licensing** | 6 months | 12 months | Very High | High (custom work) |

### Week 1 Focus: Credits + Forge
**Why**: Fastest path to revenue. Infrastructure serves all future streams.
**Action**: Wire Stripe, build credit ledger, connect to AI APIs.

### Month 1 Focus: Credits + Forge + First Course
**Why**: Courses leverage existing content (200K words → structured courses).
**Action**: Package 5 existing Academy courses as premium products.

### Month 2-3 Focus: Marketplace + API
**Why**: Platform revenue scales with users, not with Frank's time.
**Action**: Build marketplace infrastructure, launch API beta.

---

## Pricing Psychology

### The Arcanea Pricing Ladder

```
FREE                    $0     → Get hooked (unlimited chat + Library)
CREDITS                 $5+    → First payment (low commitment)
FORGE                   $29/mo → Power user (unlimited creation)
COURSES                 $49+   → Deep learning (one-time)
MARKETPLACE SELLING     $0     → Earn from platform (creator becomes stakeholder)
ENTERPRISE              $499+  → Business use (different budget)
```

**Key principle**: Each step up should feel like a natural progression, not a sales pitch.

### Why Credits Before Subscription
- Lower initial commitment ($5 vs $29/mo)
- Users see value before committing to recurring
- Credit buyers who exhaust credits naturally upgrade to Forge
- Credit revenue is immediate (not amortized over subscription period)

### The "Free is Real" Philosophy
Free users get:
- Unlimited text chat with Lumina
- Full Library access (200K+ words)
- 5 daily credits (enough to try image/music generation)
- Academy (free courses)
- Gallery browsing
- Community access

This isn't a trial. It's a real product. Paid tiers add power, not access.

---

*The goal isn't to maximize revenue per user. It's to maximize the number of users who find Arcanea indispensable for their creative work. Revenue follows.*
