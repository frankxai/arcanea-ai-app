---
title: "Consolidated tech stack and product roadmap"
uuid: 06eea678-5953-4d96-be1f-b61aa49a331f
created: 2026-04-16T02:42:14.066535Z
updated: 2026-04-16T02:44:26.888183Z
source: claude.ai export
---

# Consolidated tech stack and product roadmap

**Frank**:

Lisr me all our websites and products we want to deliver, list all tech stack i need for every site to get results i want, i shared across dozens chats for each ideas and you had aggregation chats you can use and pull in

**Claude**:

```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Good. I have enough across the aggregation chats. Let me compile the full map.
```
This block is not supported on your current device yet.
```

Enough. Here's the full consolidated map.

---

# SITES + PRODUCTS + TECH STACK

## DOMAIN REGISTRY

| Domain | Status | Purpose |
|--------|--------|---------|
| `frankx.ai` | Live | Personal brand hub, consulting, workshops |
| `arcanea.ai` | Live (needs product layer) | Creative universe, Guardian chat, academy, community |
| `vibeclubs.ai` | Domain owned | Neuro-state music clubs, local chapters, membership |
| `gencreator.ai` | Domain owned | Agentic creator OS + methodology community |
| `animelegends.ai` | Domain owned | Anime culture channel + AI creative tools |
| `starlightintelligence.org` | Concept + Vault live | OSS memory vaults, SIS protocol, stichting eventually |
| `disruptivepassiveincome.com` | Domain owned | AI affiliate hub, learn-to-earn, tool blueprints |
| `apiosk.ai` / `aiposk.ai` | Concept | x402 agent payment gateway, API kiosk for micropayments |

---

## PRODUCTS BY BRAND

### frankx.ai
- Workshops (live, first booked May 13, €1,200): VibeOS Sound Lab (€497), AI Architecture Sprint, Guardian Session, Enterprise (€25K+)
- Consulting: AI architecture, go-to-market
- Blog / SEO engine: 41–51 article matrix across 6 clusters
- Free tools: Workout Music Generator, Content Hook Generator (lead magnets)
- Podcast: Golden Age Transmissions

### arcanea.ai
- Guardian Chat (AI companions per archetype)
- VibeOS Starter Kit — PRIMARY revenue unlock
- Music catalog: 300+ Suno tracks → streaming + sync + Content ID royalties
- AI Music Academy (€97/mo): Suno mastery, frequency composition
- World-Builder's Workshop (€497): 8-week, multi-modal creation
- Transmedia Architect (€2,997): 12-week, catalog strategy
- Creator Residency (€9,997): 3-month immersive
- Guardian NFT collections (curated)
- Guardian Trials: quarterly creator competition → equity prizes
- Arcanea Framework (OSS npm packages, SOUL.md, SKILL.md templates): free + €99/mo premium
- SOUL.md Guardian consciousness packs: premium moat

### vibeclubs.ai
- Vibe Club on Circle (single paid community brand, €29/mo Creator, €99/mo Architect)
- Chapter Starter Kit: local IRL frequency clubs
- Amsterdam flagship chapter

### gencreator.ai
- GenCreator OS (ACOS): open-source, 90+ skills, 65+ commands, 38 agents
- GenCreator community (€47/mo): builder tools, methodology
- Notion templates + digital products (€47–€297): revenue floor, ships immediately

### animelegends.ai
- Anime culture content channel
- AI creative tools for visual storytelling
- Evening ritual packs, K-pop aesthetic

### starlightintelligence.org
- Starlight Vault: public + API endpoints (`/vaults /cosmos /synthesis /archetypes /frequency /souls`)
- SIS open protocol documentation
- Dutch stichting (nonprofit stewardship layer, future)

### disruptivepassiveincome.com
- Curated AI tool marketplace with blueprints
- PartnerStack, OpenRouter, Railway affiliate integrations
- Learn-to-earn: content → affiliate → autonomous agent income
- Agent-generated content with embedded affiliate links

### apiosk.ai (concept → build)
- x402 HTTP-native micropayment gateway
- Agent-to-agent payment rails on Base L2 (USDC)
- Pay-per-use API monetization for any Arcanea service endpoint

### Academies (post-June 1)
- AI Architect Academy: Foundation €297 → Pro €997 → Intensive €4,997 → Elite €25K+
- AI Music Academy: standalone or bundled with Vibe Club
- Reality Architect Certification: €9,997 (all three Ways completed)
- Arcanea Retreats: Croatia / Fuerteventura, €5K–€15K

---

## TECH STACK — PER SURFACE

### Core Infrastructure (everything)
| Layer | Tool | Cost |
|-------|------|------|
| Hosting | Vercel | Free → Pro |
| DB + Auth + Vectors | Supabase (single project, multi-tenant schema) | $25/mo |
| Automation | n8n (self-hosted Railway) | ~$20/mo |
| Background services | Railway | ~$20/mo |
| DNS + CDN | Vercel (primary) / Cloudflare (protect origin on critical APIs) | Free |
| Code | Next.js 15 + TypeScript | — |
| Styling | Tailwind CSS | — |
| Repo | GitHub (frankxai org, monorepo) | Free |
| Email transactional | Resend (subdomain isolation per brand) | $20/mo |
| Email community | Substack (content) / ConvertKit or Ghost (owned list, evaluate) | varies |
| Payments (human) | LemonSqueezy (MoR, handles EU VAT) | % |
| Payments (agent) | Coinbase x402 + AgentKit (USDC on Base L2) | per txn |
| Commerce | Whop (premium naming + community + digital products) | % |

### AI / Model Layer
| Purpose | Tool |
|---------|------|
| Primary reasoning | Claude Opus 4.6 |
| Fast execution | Claude Sonnet 4.6 |
| Local / privacy | Ollama (gemma4, qwen3) |
| Image generation | Midjourney, Grok, nano-banana MCP, GenSpark (batch 10) |
| Video generation | Sora, Kling AI, Veo, GenSpark |
| Voice | ElevenLabs |
| Music | Suno (catalog), DistroKid (distribution) |
| Code agents | Claude Code (primary), Gemini Code (secondary), Replit (rapid prototyping) |
| Search / research | Perplexity Labs |

### Agent Infrastructure
| Component | Tool |
|-----------|------|
| Always-on Gateway | OpenClaw (Node.js, persistent memory, HEARTBEAT.md cron) |
| Session dev agent | Claude Code |
| Agent runtime (Web3) | ElizaOS fork → Arcanea OS |
| Agent wallet | Coinbase AgentKit |
| Orchestration | n8n workflows |
| Agent identity | SOUL.md + SKILL.md per Guardian |

### Content Distribution
| Channel | Tool |
|---------|------|
| LinkedIn, TikTok, IG, YT, Threads, Pinterest | Blotato ($29/mo) |
| X/Twitter, Reddit, Dev.to, Bluesky, Discord | Postiz self-hosted (~$5/mo Railway) |
| Orchestration between them | n8n → both |
| Community | Circle (Vibe Club) |

### Design + Whiteboarding
| Purpose | Tool |
|---------|------|
| UI design | Figma (free tier + MCP) |
| Whiteboarding / architecture | Miro ($10/mo + MCP) |
| Rapid UI generation | v0 by Vercel |
| Presentation / brand assets | Canva (MCP connected) |

### MCP Server Layer (Claude Code / ACOS)
Active: Notion, Linear, GitHub, Google Calendar, Google Drive, Figma, Canva, Miro, Slack, n8n, nano-banana. Target: Blotato, Ghost/ConvertKit, Whop, LemonSqueezy, Supabase, ElevenLabs, DistroKid.

---

## ARCHITECTURE DECISION SUMMARY

**Cloudflare vs Vercel**: Use Vercel as primary host. Add Cloudflare **only** in front of `apiosk.ai` API endpoints and any endpoint handling agent payments — DDoS protection on the payment gateway is non-negotiable. Everything else stays Vercel-native.

**Gumroad vs LemonSqueezy vs Whop**: Gumroad is dead for this architecture. LemonSqueezy for subscription/course products (MoR covers EU VAT automatically). Whop for premium community + digital product drops with brand energy. Both in parallel, segmented by product type.

**Ghost vs ConvertKit vs Substack**: Substack = discovery and current content distribution. Owned list migrates to Ghost or ConvertKit (Ghost if you want the full CMS control and membership built-in, ConvertKit if you want sequence automation depth). Evaluate via 30-day test post-June 1.

**Replit**: Use for rapid prototyping and demos, then push to GitHub org for production. Good for Guardian chatbot MVPs before full arcanea.ai integration.

---

This is the full map. The critical gap remains the same: infrastructure is complete, catalog exists, zero published products on a storefront. The VibeOS Starter Kit on Whop or LemonSqueezy this week closes that. Everything else compounds on top.

**Frank**:

All these next js first? Which means react? Or anything needs different approach? Some share supabase, some object storage and some landing pages and then some sophsiticated product capabilities all can be build on next or what else to consider or would be best practices for my visions in april 2026?

**Claude**:

All Next.js / React is the right default for your stack. Here's where the nuance matters:

## Next.js (App Router) — Use for Everything Except:

**frankx.ai, arcanea.ai, vibeclubs.ai, gencreator.ai, animelegends.ai, starlightintelligence.org**
All Next.js. App Router + Server Components handles SEO, dynamic routes, API routes (your backend), streaming AI responses, and auth in one codebase. No separate backend needed until you're at serious scale.

**apiosk.ai** — Next.js App Router but configured as an **edge API-first** surface. Route handlers at the edge, minimal UI. Cloudflare Workers is worth evaluating here specifically because x402 micropayment verification needs sub-50ms latency globally. If you want pure Vercel, Edge Functions work but Cloudflare Workers is architecturally cleaner for a payment gateway.

**disruptivepassiveincome.com** — Next.js, but treat it like a content + affiliate site. Consider whether a headless CMS (Sanity or Payload CMS, both Next.js native) makes sense here so you can publish tool reviews without deploying code.

---

## Object Storage

You need this. Supabase Storage (S3-compatible) handles it directly — no separate AWS S3 or Cloudflare R2 needed unless you hit volume. Use Supabase Storage for:
- Music previews / audio samples
- Guardian artwork / generated images
- SOUL.md / SKILL.md file downloads
- Workshop recordings

If your Suno catalog ever gets to delivery-at-scale, migrate audio to R2 (Cloudflare, zero egress fees) with a simple worker serving presigned URLs.

---

## Supabase Sharing Strategy

**Single Supabase project** with prefixed schemas is correct for now. The practical split:

| Schema | Tables |
|--------|--------|
| `auth` | Supabase managed |
| `frankx_` | workshops, leads, blog_analytics |
| `arcanea_` | guardians, vaults, music, users, subscriptions |
| `vibeclubs_` | chapters, members, events |
| `sis_` | vault_entries, frequency_maps |

Row-level security (RLS) is your access control layer. One user record, multiple brand relationships. This matters when someone is a Vibe Club member AND an Arcanea subscriber — you want one identity, not duplicate auth flows.

The only reason to split Supabase projects: if apiosk.ai needs isolated security posture (agent wallets, payment data). That one gets its own project.

---

## What Doesn't Need Full Next.js

**Landing pages for domains you're not building yet** (animelegends, gencreator during early phase): use a single `app/[site]/page.tsx` in a monorepo with Vercel's multi-domain support. One codebase, multiple domains, zero duplication. This is the key architectural decision — **monorepo with domain routing**, not six separate repos.

**OpenClaw / agent runtime**: Node.js standalone process on Railway. Not Next.js. Separate service, communicates with your Next.js apps via REST or Supabase realtime.

**n8n**: Already self-hosted on Railway. Leave it there.

---

## The 2026 Consideration You Should Care About

**React Server Components + Streaming** are now production-stable and this is where Next.js App Router earns its place for your use case specifically. Guardian chat with streaming Claude responses, real-time Vault synthesis, live workshop sessions — all handled with `use server` actions and Suspense streaming. No separate WebSocket infrastructure needed for 80% of your interactive features.

**Vercel AI SDK** (`ai` package) is the correct abstraction for all Claude integrations across your sites. Unified streaming, tool calling, multi-step agent UX — it's built for exactly your architecture. Don't call the Anthropic API raw in frontend code.

---

## Recommended Repo Structure

```
frankxai/
├── apps/
│   ├── frankx/          → frankx.ai
│   ├── arcanea/         → arcanea.ai  
│   ├── vibeclubs/       → vibeclubs.ai
│   ├── starlightintel/  → starlightintelligence.org
│   └── apiosk/          → apiosk.ai (edge-first)
├── packages/
│   ├── ui/              → shared components
│   ├── db/              → Supabase client + schema types
│   ├── ai/              → Vercel AI SDK wrappers + Guardian prompts
│   └── arcanea-core/    → SOUL.md loader, Guardian registry, lore engine
└── turbo.json           → Turborepo build orchestration
```

Turborepo is the right monorepo tool here. pnpm workspaces underneath. Shared `packages/ai` is where your Guardian SOUL.md files and Claude system prompts live as typed constants — this is your IP moat as importable code.

---

**Bottom line**: Next.js App Router + Turborepo monorepo + single Supabase project + Vercel multi-domain deployment is the correct architecture for April 2026. The only exceptions are OpenClaw (Railway Node.js), n8n (Railway self-hosted), and potentially apiosk.ai's payment core (evaluate Cloudflare Workers specifically for that). Everything else is one repo, one deploy pipeline, one auth system.
