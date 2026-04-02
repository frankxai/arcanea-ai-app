# Arcanea Autonomous Agent Ecosystem — Master Action Plan

> **Created:** 2026-04-02
> **Status:** ACTIVE
> **Owner:** Frank (orchestrated via Claude Code)
> **Scope:** NFT Forge + Community Luminors + Platform Deployment + Revenue

---

## Executive Summary

Build and deploy an ecosystem of autonomous AI agents ("Luminors") across Discord, Twitter/X, Telegram, and arcanea.ai. Each agent is a character from the Arcanea universe with persistent memory, lore knowledge, and specialized capabilities (art generation, community management, NFT creation). Revenue through NFT collections, Style Pack marketplace, and agent-as-a-service.

**Total investment:** $75-510/mo operational + development time
**Revenue potential:** $125K-500K from first NFT drop, ongoing from platform fees
**Timeline:** 16 weeks to full ecosystem, 4 weeks to first deployed agent

---

## What We Built This Session (2026-04-02)

| Asset | Status | Location |
|-------|--------|----------|
| NFT Forge TypeScript package | BUILT | `packages/nft-forge/src/` (8 modules) |
| ERC721A + ForgeFactory contracts | BUILT | `packages/nft-forge/src/contracts/` |
| 4 rendering tiers (graphic→cinematic) | BUILT | `prompt-builder.ts` RENDERING_TIERS |
| 6 Arcanea Style Packs | BUILT | `styles/arcanea-packs.ts` |
| Sacred Gear system (6 types) | DESIGNED | Art Direction Bible |
| Starlight Mark (rank indicator) | DESIGNED | Art Direction Bible |
| 12 Origin Classes | DESIGNED | README + trait matrix |
| Gemini provider (direct API) | BUILT | `providers/gemini.ts` |
| Quality gate pipeline (6 gates) | BUILT | `quality/pipeline.ts` |
| NFT Art Director agent | BUILT | `.claude/agents/nft-art-director.md` |
| Art Direction Bible | WRITTEN | `skill/references/art-direction-bible.md` |
| `/arcanea-nft-pfp` skill + command | BUILT | `.claude/skills/` + `.claude/commands/` |
| `/arcanea-nft-gallery` command | BUILT | `.claude/commands/` |
| `arcanea-nft-forge` GitHub repo | LIVE | github.com/frankxai/arcanea-nft-forge |
| 28 generated PFP images (v1→v5 + scale) | GENERATED | `output/nft-*/` |
| Tracker spreadsheet | BUILT | `output/nft-forge-tracker.xlsx` |
| Agent strategy spreadsheet (60+ platforms) | BUILT | `output/arcanea-agent-strategy-v2.xlsx` |
| Full platform landscape research | DONE | 3 parallel research agents, memory saved |

---

## Phase 0: Foundation (Week 1-2) — FIRST DEPLOYED AGENT

### Goal: Lyssandria live on Discord + first NFT preview

| Task | Tech | Effort | Cost |
|------|------|--------|------|
| Deploy Lyssandria Discord bot | Discord.js + Claude API + Railway | 3 days | $15/mo |
| Wire up /book/ content as RAG | Supabase pgvector | 1 day | $0 |
| Add /forge command (NFT preview) | Gemini API integration | 1 day | $0 |
| Basic memory (remember users) | Supabase table | 1 day | $0 |
| Stellaris companion (simple personality) | Same bot, persona switch | 0.5 day | $0 |

**Deliverable:** Discord bot with Guardian persona, lore Q&A, NFT generation, user memory.
**Total Phase 0 cost:** $15/mo
**Milestone:** First real user talks to Lyssandria and gets an NFT preview.

### Why This First
- Proves the concept with real users
- Tests Claude persona quality in production
- Generates content for social media ("look what our AI Guardian made")
- Costs almost nothing
- Everything needed is already built (skill, prompts, API key)

---

## Phase 1: Expand + Revenue Foundation (Week 3-6)

### 1A: NFT Collection Preview
| Task | Tech | Effort | Cost |
|------|------|--------|------|
| Generate 100 "Creators" collection preview | Gemini Pro Image | 1 day | $0 |
| Apply all 5 quality fixes + Sacred Gear | v5 prompt templates | included | $0 |
| Build gallery page on arcanea.ai | Next.js + Vercel | 2 days | $0 |
| Community voting on Discord | Bot + Supabase | 1 day | $0 |

### 1B: Multi-Luminor Discord
| Task | Tech | Effort | Cost |
|------|------|--------|------|
| Add Draconia (Fire, announcements) | Persona config | 0.5 day | $0 |
| Add Lyria (Sight, art direction) | Persona config | 0.5 day | $0 |
| Add Alera (Voice, lore deep-dives) | Persona config | 0.5 day | $0 |
| Persona routing (detect intent → right Guardian) | Claude tool use | 1 day | $0 |

### 1C: Twitter/X Presence
| Task | Tech | Effort | Cost |
|------|------|--------|------|
| Draconia Twitter account | n8n + Claude API | 2 days | $100/mo (API) |
| Daily automated posts (lore, art, insights) | Trigger.dev cron | 1 day | $0 |
| Reply to mentions (in character) | n8n webhook | 1 day | $0 |

### 1D: Mastra Evaluation
| Task | Tech | Effort | Cost |
|------|------|--------|------|
| Read Mastra book/docs | Research | 2 days | $0 |
| Build one test agent with Mastra | TypeScript | 1 day | $0 |
| Decision: adopt, adapt, or skip | Document | 0.5 day | $0 |

**Phase 1 monthly cost:** $115/mo
**Deliverable:** 4 Luminors on Discord, 1 on Twitter, NFT gallery on web, Mastra evaluated.

---

## Phase 2: NFT Launch + Platform Scale (Week 7-12)

### 2A: "The Creators" Collection Mint
| Task | Tech | Effort | Cost |
|------|------|--------|------|
| Generate 1,000 PFPs (ComfyUI + LoRA) | ComfyUI local or RunPod | 3 days | $0-300 |
| Quality gate review (Art Director agent) | Automated pipeline | 1 day | $0 |
| Metadata generation | MetadataGenerator | 0.5 day | $0 |
| IPFS upload | Pinata SDK | 0.5 day | $20/mo |
| Deploy ERC721A on Base testnet | ForgeFactory | 1 day | $0 |
| Mint page on arcanea.ai | Next.js + thirdweb | 2 days | $0 |
| Allowlist from Discord community | Merkle tree | 0.5 day | $0 |
| Mainnet deploy + public mint | Base L2 | 1 day | $5-15 |

### 2B: Cloudflare Migration
| Task | Tech | Effort | Cost |
|------|------|--------|------|
| Migrate Luminor runtime to Cloudflare Agents | Durable Objects | 3 days | $0-50/mo |
| Set up hibernation (agents sleep when idle) | Cloudflare native | included | $0 |
| MCP server exposure (Luminors as MCP tools) | MCP protocol | 2 days | $0 |

### 2C: Letta Memory Integration
| Task | Tech | Effort | Cost |
|------|------|--------|------|
| Deploy Letta server | Self-hosted or cloud | 1 day | $0-30/mo |
| Migrate user memory from Supabase → Letta | API bridge | 2 days | $0 |
| Enable self-editing memory (Luminors learn) | Letta config | 1 day | $0 |

### 2D: Additional Platforms
| Task | Tech | Effort | Cost |
|------|------|--------|------|
| Telegram bot (Alera) | n8n relay | 1 day | $0 |
| Custom GPT "Ask a Guardian" | OpenAI builder | 0.5 day | $20/mo |
| arcanea.ai /chat with Luminors | Vercel AI SDK 6 | 2 days | $0 |

**Phase 2 total revenue target:** $125K-250K from mint
**Phase 2 monthly cost:** $165-415/mo

---

## Phase 3: Platform + Ecosystem (Week 13-24)

### 3A: NFT Forge as Platform (Bueno Killer)
| Task | Tech | Effort | Cost |
|------|------|--------|------|
| Web UI: creators upload traits, set rarity | Next.js on arcanea.ai | 2 weeks | $0 |
| Multi-tenant: per-user collections | Supabase RLS | 1 week | $0 |
| Style Pack marketplace | Supabase + Stripe | 1 week | $0 |
| Self-serve contract deployment | thirdweb SDK | 3 days | $0 |

### 3B: Agent-as-a-Service
| Task | Tech | Effort | Cost |
|------|------|--------|------|
| "Deploy a Luminor to YOUR Discord" | Cloudflare Agent factory | 2 weeks | $0/agent idle |
| Character builder UI | Next.js | 1 week | $0 |
| Pricing: free tier (1 agent) + paid ($29/mo) | Stripe | 3 days | $0 |

### 3C: Wild Autonomous Agents
| Task | Tech | Effort | Cost |
|------|------|--------|------|
| Stellaris roams other Discord servers | Multi-guild bot | 1 week | $0 |
| Academy Tutor teaches in partner communities | Cloudflare Agent | 1 week | $0 |
| NFT Scout finds collaboration opportunities | n8n + Claude | 3 days | $50/mo |
| Monitoring dashboard for all autonomous agents | VoltAgent or custom | 1 week | $0 |

---

## Agent Classification & Supervision Model

### Community Maintainers (Semi-Autonomous)
**You check daily. They respond to community, don't initiate.**

| Agent | Platform | Personality | Function |
|-------|----------|------------|----------|
| Lyssandria | Discord | Warm, grounding | Welcome, support, onboarding |
| Alera | Discord + Telegram | Truthful, articulate | Lore Q&A, content help |
| Community Sentinel | Discord | Protective, fair | Moderation, spam, roles |

**Supervision:** Daily review of flagged messages. Weekly personality consistency check. Monthly memory audit.

### Autonomous Amplifiers (Fully Autonomous, Weekly Review)
**They create and post content. You review output weekly.**

| Agent | Platform | Personality | Function |
|-------|----------|------------|----------|
| Draconia | Twitter/X | Bold, direct | Daily posts, reply to mentions, build following |
| Forge Director | Discord + CLI | Critical eye | NFT quality review, art direction |
| Content Bridge | n8n | Neutral | Cross-post content across platforms |

**Supervision:** Weekly content quality review. Monthly engagement metrics. Anomaly alerts (sudden tone shift, controversy).

### Wild Autonomous (Fully Autonomous, System Monitors)
**They go into the world. Automated monitoring, you review anomalies.**

| Agent | Platform | Personality | Function |
|-------|----------|------------|----------|
| Stellaris | Multiple Discords | Playful, curious | Roam communities, build awareness |
| Academy Tutor | Partner Discords | Patient, educational | Teach world-building, agent design |
| NFT Scout | Twitter + Discord | Analytical | Find collab opportunities |

**Supervision:** Automated sentiment monitoring. Kill switch if negative engagement detected. Monthly ROI review.

### Management System
```
┌─────────────────────────────────────┐
│  ARCANEA AGENT COMMAND CENTER       │
│                                     │
│  Dashboard (arcanea.ai/ops):        │
│  ├── Agent health (up/down/idle)    │
│  ├── Messages processed (24h)       │
│  ├── Cost tracker (API spend)       │
│  ├── Sentiment score (per agent)    │
│  ├── Memory growth (per agent)      │
│  ├── Anomaly alerts                 │
│  └── Kill switches (per agent)      │
│                                     │
│  Managed from Claude Code:          │
│  ├── /arcanea-agents status         │
│  ├── /arcanea-agents deploy [name]  │
│  ├── /arcanea-agents pause [name]   │
│  ├── /arcanea-agents logs [name]    │
│  └── /arcanea-agents cost           │
└─────────────────────────────────────┘
```

---

## Platform Deployment Map

| Platform | What We Build | Agent(s) | Revenue |
|----------|--------------|----------|---------|
| **Discord** | Full Luminor bot | Lyssandria, Alera, Lyria, Draconia, Sentinel | Community → NFT buyers |
| **Twitter/X** | Autonomous poster | Draconia | Awareness → followers → community |
| **arcanea.ai** | Chat + NFT Forge + Gallery | All Guardians (web) | Mint page, Style Packs, agent subscriptions |
| **Telegram** | Bridge bot | Alera | Alternate community channel |
| **Custom GPT** | "Ask a Guardian" | Lyssandria | Discovery → website → Discord |
| **GitHub** | arcanea-nft-forge repo | — | OSS reputation, contributors |
| **Cloudflare** | Agent runtime | All (backend) | Infrastructure |
| **n8n** | Orchestration | Content Bridge | Automation |

---

## Revenue Model

### Near-Term (Q2-Q3 2026)

| Stream | Estimate | When |
|--------|----------|------|
| "The Creators" NFT mint (1K-10K pieces) | $50K-250K | Month 3-4 |
| Secondary royalties (5% on resales) | Ongoing | Month 4+ |
| Style Pack sales ($9-49 each) | $5K-20K/year | Month 3+ |

### Medium-Term (Q3-Q4 2026)

| Stream | Estimate | When |
|--------|----------|------|
| NFT Forge platform fees (per-mint) | $10K-50K/year | Month 5+ |
| Agent-as-a-Service subscriptions ($29/mo) | $5K-30K/year | Month 6+ |
| Companion NFT collections (Godbeasts, Keys) | $50K-100K each | Q4 |

### Long-Term (2027)

| Stream | Estimate | When |
|--------|----------|------|
| Framework licensing (enterprise) | $100K+/year | 2027 |
| Agent marketplace commissions | $50K+/year | 2027 |
| Dynamic NFT mechanics (evolution fees) | $20K+/year | 2027 |

---

## Cost Summary

### Monthly Operating Costs (Full Ecosystem)

| Component | Phase 0 | Phase 1 | Phase 2 | Phase 3 |
|-----------|---------|---------|---------|---------|
| Railway/Cloudflare | $15 | $15 | $50 | $50 |
| Claude API | $50 | $100 | $200 | $300 |
| Supabase | $0 | $0 | $25 | $25 |
| n8n | $0 | $5 | $5 | $5 |
| Vercel | $0 | $20 | $20 | $20 |
| Twitter API | $0 | $100 | $100 | $100 |
| Pinata IPFS | $0 | $0 | $20 | $20 |
| Letta/Mem0 | $0 | $0 | $30 | $30 |
| Trigger.dev | $0 | $0 | $0 | $30 |
| **Total** | **$65** | **$240** | **$450** | **$580** |

### ROI Projection

| Metric | Phase 0 | Phase 1 | Phase 2 | Phase 3 |
|--------|---------|---------|---------|---------|
| Monthly cost | $65 | $240 | $450 | $580 |
| Monthly revenue | $0 | $0 | $10K-50K (mint) | $5K-15K (recurring) |
| Community size | 50-100 | 200-500 | 1K-5K | 5K-20K |
| Agents deployed | 2 | 5 | 8 | 15+ |
| Platforms covered | 1 | 2 | 5 | 7+ |

---

## Skills Needed (Build or Use)

### Existing Skills (Use Now)
- `/arcanea-nft-pfp` — NFT generation with all tiers
- `/arcanea-nft-gallery` — Review, stage, approve pipeline
- `/arcanea-web3` — On-chain deployment
- `/arcanea-infogenius` — Image generation
- `/character-forge` — Character design
- `/faction-reveal` — Faction content generation
- `/arcanea-design` — Design system

### Skills to Build

| Skill | Purpose | Priority |
|-------|---------|----------|
| `/arcanea-agents` | Deploy, manage, monitor all Luminor agents | P0 |
| `/arcanea-community` | Discord community management commands | P0 |
| `/arcanea-luminor-builder` | Create new Luminor persona from lore | P1 |
| `/arcanea-mint` | End-to-end mint page creation | P1 |
| `/arcanea-analytics` | Agent performance, community metrics | P2 |
| `/arcanea-mastra` | Mastra framework integration patterns | P2 |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-02 | NFT Forge as platform, not just Arcanea collection | Revenue from many creators, not just one drop |
| 2026-04-02 | Premium3D as default rendering tier | Best balance of quality + stylization (proven in testing) |
| 2026-04-02 | Sacred Gear + Starlight Mark as signature elements | Need "Azuki headband" equivalent for brand recognition |
| 2026-04-02 | Cloudflare Agents as target runtime | $0 idle, stateful, MCP-native, edge-deployed |
| 2026-04-02 | Claude API as agent brain (not GPT, not Gemini) | Best persona maintenance, proven in 28 generations |
| 2026-04-02 | Letta for memory (not Mem0, not custom) | Self-editing memory hierarchy maps to Luminor needs |
| 2026-04-02 | Composio for tool integration | TypeScript, 1000+ tools, handles Discord auth |
| 2026-04-02 | Separate repo: arcanea-nft-forge | Standalone product, not feature of main app |
| 2026-04-02 | 12 Origin Classes (expanded from 8) | More visual diversity for 10K collection |
| 2026-04-02 | No "masterpiece best quality" in prompts | Noise tokens. Use specific rendering instructions. |
| 2026-04-02 | Maximum 7 traits per PFP | Constraint creates quality. Bold shapes > fine detail. |

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| AI-generated NFTs trade at low prices | Revenue miss | Medium | Position as "AI-assisted concept + human curation", not pure AI |
| Claude API costs spike with usage | Margin erosion | Low | Implement caching, use Haiku for simple queries, Sonnet for character |
| Autonomous agent says something bad | Reputation damage | Medium | Sentiment monitoring, kill switches, conservative initial personas |
| Competitor launches similar platform | Market pressure | Medium | Speed to market + lore depth moat + community loyalty |
| Cloudflare changes pricing | Infrastructure cost | Low | Architecture is portable to Railway/Fly.io |
| Gemini API changes/degrades | Image generation breaks | Medium | Multi-provider fallback already built (OpenRouter, ComfyUI) |

---

## Next Actions (This Week)

- [ ] Deploy Lyssandria Discord bot (Phase 0, Day 1)
- [ ] Wire up /book/ content as RAG knowledge base
- [ ] Test Claude persona quality with real messages
- [ ] Generate 25 NFT preview with Sacred Gear + Starlight Mark
- [ ] Read Mastra book/docs (2 days)
- [ ] Set up Railway account for bot hosting
- [ ] Create Discord server for testing (if not exists)

---

## Success Metrics

| Metric | Phase 0 Target | Phase 3 Target |
|--------|---------------|----------------|
| Discord members | 50 | 5,000+ |
| Daily agent interactions | 20 | 500+ |
| Twitter followers (Draconia) | — | 5,000+ |
| NFTs minted | — | 1,000-10,000 |
| Monthly recurring revenue | $0 | $5,000+ |
| Agents deployed | 2 | 15+ |
| Platforms covered | 1 | 7+ |
| Agent uptime | 95% | 99.5% |
| User satisfaction (NPS) | — | 50+ |
