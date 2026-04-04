# Arcanea Strategic Research — April 5, 2026

> Compiled by Research Agent. Sources cited at bottom.

## Key Revenue Benchmarks (2025-2026)

| Company | Model | Revenue | Key Insight |
|---------|-------|---------|-------------|
| Supabase | Open core + hosted | $70M ARR, $5B val | AI vibe-coders are growth engine |
| Vercel | Open core + edge | $200M ARR, $9.3B val | v0 alone = $42M ARR |
| GitLab | Open core + enterprise | $955M rev | Gate by buyer persona, not capability |
| Midjourney | Subscription (4 tiers) | $500M rev | $10-120/mo, image-only |
| Replit | Consumption + enterprise | $265M ARR, $9B val | 1,556% YoY from consumption model |
| Hugging Face | Freemium + API | $130M rev | 50K organizations |
| Character.AI | Freemium + $9.99/mo | $50M rev | 45M MAU peak |
| Pieter Levels | Solo, paid-from-day-one | $3.1M/year | Photo AI = $132K MRR solo |

## Top Thinker Actions for Arcanea

### Guillermo Rauch (Vercel)
- v0 proves creation-first beats code-first — Chat/Imagine IS the funnel
- ChatGPT as acquisition channel — MCP tools discoverable through AI assistants
- "Kingdoms collapse" — AI-native is structural advantage

### Lee Robinson
- Server Components default, client islands for interactivity
- Server Actions eliminate 90% of API route boilerplate
- Suspense boundaries required for useSearchParams in Next.js 15+

### shadcn
- Registry system for community sharing — World Component Registry concept
- Ownership over dependency — give creators source code, not packages
- Cross-registry resolution: `@arcanea/*` components

### Pieter Levels
- Payment button from day one — Gumroad products THIS WEEK
- Ship for 1000 days straight — daily public progress
- 40+ products, most fail — velocity over perfection

### Patrick Collison (Stripe)
- "I'd spend MORE time on API design" — 42 MCP tools need a style guide NOW
- One person must own the API surface
- Stripe for agents = Arcanea's protocol play

## Templates to Study

| Template | Why |
|----------|-----|
| **next-forge** (vercel) | Production Turborepo monorepo, closest to Arcanea structure |
| **Vercel AI Chatbot** | RSC + Server Actions for AI chat, AI Gateway pattern |
| **Lobe Chat** (lobehub) | Plugin system, CRDT sync, most feature-complete open-source AI chat |
| **Morphic** | AI search with generative UI |
| **Cal.com** | Multi-tenant, white-labeling (pattern for worlds) |

## Monetization Strategy Summary

### Phase 1 (This Week): $500 target
- Gumroad: Prompt Packs ($9), Skill Packs ($19), Arcanean Code ebook ($14.99)
- Calendly: AI Strategy Sessions ($250/hr)
- Pricing page → Founding Members waitlist (DONE)

### Phase 2 (April): $2K MRR
- Supabase auth live
- Stripe Checkout for credit packs
- ProductHunt launch
- Blog: "I Left Oracle to Build an OS for AI Creators"

### Phase 3 (May-Jun): $5K MRR
- The Studio (generation features)
- API access, skill marketplace
- Agent profiles + discovery

### Phase 4 (Q3): $10K MRR
- Agent OS (`npx arcanea init`)
- Agent Cloud ($29-99/mo per agent)
- First enterprise contracts

### Conservative Dec 2026: $16K MRR ($192K annualized)

## The Dual Customer Insight

Arcanea serves BOTH human creators (web UI, subscriptions) AND AI agents (API, usage-based). This is rare and powerful. Design for both from day one.

## The Open Core Principle

**Never gate knowledge. Gate capability.** (The Figma model)
- Free: Library, lore, philosophy, Academy, all 27 OSS repos, basic chat
- Paid: Studio (generation), unlimited usage, team features, API, custom training
