# Arcanea Sprint Plan — Q2 2026
## 7-Day / 30-Day / 90-Day Execution Roadmap

> **Start Date**: 2026-03-31
> **Guardian**: Shinkami → Draconia (execution mode)

---

## WEEK 1 SPRINT (Mar 31 - Apr 6)
### Goal: Ship 3 Revenue Products. Money Day 1.

| Day | Morning (4h) | Evening (4h) | Ship |
|-----|-------------|-------------|------|
| **Mon 31** | AgentDB Cloud: wrap memory-system in Edge API, auth via API keys | AgentDB: Stripe usage metering, rate limits, /docs page | AgentDB v0.1 |
| **Tue 1** | Skill Packs: package top 20 skills into 4 tiers (free/starter/pro/team) | Skill Packs: landing page at /products/skills, Stripe checkout | Skill Store v0.1 |
| **Wed 2** | Creative API: add API key auth to /api/imagine, /api/create, /api/chat | Creative API: usage tracking, quota management, API docs | Creative API v0.1 |
| **Thu 3** | Integration testing all 3 products, fix bugs | Landing page: /products hub with all 3 products, pricing comparison | Products Hub |
| **Fri 4** | API documentation (OpenAPI spec, interactive playground) | ProductHunt draft, Twitter thread, HN post prep | Docs |
| **Sat 5** | Launch on ProductHunt + Twitter/X + Reddit r/artificial | Content: blog post "We Built the Infrastructure AI Agents Need" | LAUNCH |
| **Sun 6** | Monitor metrics, respond to feedback, fix critical bugs | Plan Week 2 based on data | Iterate |

**Agent Assignments for Week 1:**
- 2 coder agents: API development + Stripe integration
- 1 frontend agent: Product pages + docs
- 1 content agent: Blog + social posts
- 1 QA agent: Testing + monitoring

---

## MONTH 1 SPRINT (Mar 31 - Apr 30)

### Week 1: Ship AgentDB + Skills + Creative API
### Week 2: Ship MCP Marketplace + Content Moderation API

| Task | Agent | Days |
|------|-------|------|
| MCP Registry backend (list, search, install, rate) | coder | 2 |
| MCP Marketplace UI at /marketplace | frontend | 2 |
| Stripe Connect for MCP sellers (20% commission) | coder | 1 |
| Content Moderation API (anti-slop + voice scoring) | coder | 2 |
| /products/content-moderation landing page | frontend | 1 |

### Week 3: Ship Knowledge Base + Agent Identity

| Task | Agent | Days |
|------|-------|------|
| Knowledge API: domain-packaged queries over Library content | coder | 2 |
| Agent Identity: profile creation, reputation scoring | coder | 2 |
| Identity verification endpoint (is this agent trustworthy?) | coder | 1 |
| Landing pages for both products | frontend | 2 |

### Week 4: Consolidate + Optimize + Content Push

| Task | Agent | Days |
|------|-------|------|
| Fix bugs across all 6 products | QA | 3 |
| Analytics dashboard: revenue, usage, growth per product | coder | 2 |
| Blog series: "Building for the Agent Economy" (4 posts) | content | 4 |
| SEO: product pages, comparison pages, use case pages | SEO | 3 |
| Email list: capture leads, welcome sequence | content | 2 |

**Month 1 Targets:**
- 6 products live
- $1,200 MRR
- 100 API users
- 5 blog posts
- ProductHunt + HackerNews launch

---

## QUARTER 1 (90 DAYS: Mar 31 - Jun 30)

### Month 2: Platform Products (Apr 30 - May 31)

| Product | Revenue Model | Build Time | MRR Target |
|---------|--------------|-----------|-----------|
| **Orchestration Platform** | $0.10/agent-min, $99/mo | 2 weeks | $3,000 |
| **World Engine** | $99/mo per world | 2 weeks | $2,000 |
| **Agent Academy** | $49/cert, $199/mo fleet | 1 week | $1,000 |

**Month 2 Targets:**
- 9 products live
- $8,000 MRR
- 300 API users
- 3 enterprise leads

### Month 3: Commerce Layer (Jun 1 - Jun 30)

| Product | Revenue Model | Build Time | MRR Target |
|---------|--------------|-----------|-----------|
| **Agent Wallet** | 2.5% transaction fee | 3 weeks | $2,000 |
| **Prompt Marketplace** | 30% commission | 2 weeks | $1,000 |
| **Agent Monitoring** | $49/mo per 10 agents | 2 weeks | $1,500 |

**Month 3 Targets:**
- 12 products live
- $12,000 MRR ($144K ARR)
- 500 API users
- First enterprise contract signed

---

## YEAR 1 QUARTERLY ROADMAP

### Q2 2026 (Apr-Jun): Foundation
- Ship 12 products
- $12K MRR
- Establish PMF for top 3
- Kill bottom 3

### Q3 2026 (Jul-Sep): Scale
- Scale winning products 10x
- Launch AIOS Cloud (Agent OS)
- Launch Multiverse Platform
- $35K MRR
- First 3 enterprise contracts

### Q4 2026 (Oct-Dec): Enterprise
- Enterprise sales motion
- SOC 2 compliance
- SLA guarantees
- Partner program (agent builders)
- $50K MRR ($600K ARR)

### Q1 2027: Platform
- Agent-to-Agent commerce at scale
- 1000+ agents on platform
- International expansion
- Potential seed round ($1-3M at $10-15M valuation)
- $100K MRR ($1.2M ARR)

---

## Agent Autonomy Plan

### What Agents Do (90%+ of work)
- Build features (coder agents in swarms)
- Write docs and blog posts (content agents)
- Monitor and fix bugs (ops agents)
- Deploy and scale (DevOps agents)
- Respond to support tickets (support agents)
- A/B test pricing (growth agents)
- Generate social content (marketing agents)

### What Frank Does (10% of work, 2-4h/week)
- Review weekly revenue dashboard
- Make strategic product decisions
- Close enterprise deals (video calls)
- Set quarterly OKRs
- Approve major architectural changes

### Automation Schedule
| Time | Event | Agent |
|------|-------|-------|
| 6:00 AM | Health check all products | Ops Agent |
| 8:00 AM | Deploy any queued changes | Deploy Agent |
| 10:00 AM | Content published (blog/social) | Content Agent |
| 12:00 PM | Revenue report to Frank | Analytics Agent |
| 2:00 PM | Customer support sweep | Support Agent |
| 4:00 PM | Code review + merge PRs | Review Agent |
| 6:00 PM | Security scan | Security Agent |
| 10:00 PM | Performance optimization | Perf Agent |
| 2:00 AM | Full test suite | QA Agent |

---

## Success Metrics

### North Star: Monthly Recurring Revenue
### Supporting Metrics:
- API calls/day (product usage)
- Active agents (platform stickiness)
- Time to first value (onboarding speed)
- Net Revenue Retention (expansion > churn)
- Agent satisfaction score (NPS equivalent)

---

## First 3 Products to Build (Starting Tomorrow)

### 1. AgentDB Cloud
**Why first**: Every agent needs memory. Highest demand, lowest competition, fastest to build.
**Pricing**: Free (100 queries/day) → $5/mo (10K) → $49/mo (unlimited)
**Tech**: Edge Function wrapper around @arcanea/guardian-memory + Supabase for persistence

### 2. Creative API
**Why second**: Multi-modal generation (image+music+story) in one API. Unique offering.
**Pricing**: Per-generation credits. $0.01 text, $0.10 image, $0.25 music.
**Tech**: API key auth on existing /api/imagine, /api/create, /api/chat

### 3. Skill Packs
**Why third**: 80 skills already built. Just package, price, and sell.
**Pricing**: $0 (5 free) → $9 (starter 20) → $29 (pro 50) → $49 (all 80+)
**Tech**: npm packages with license validation

---

*"The agents are coming. They need infrastructure. We have it. Ship."*
