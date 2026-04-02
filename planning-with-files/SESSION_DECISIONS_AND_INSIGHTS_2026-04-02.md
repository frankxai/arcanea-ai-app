# All Decisions, Insights & Considerations — 2026-04-02

This file captures EVERYTHING discussed in the 11-hour session so nothing is lost.

---

## Product Strategy

### What Arcanea IS
A creative intelligence workspace with a compounding project graph.
NOT a chat wrapper. NOT a prompt forwarder. NOT a lore site with tools.

### The 6 Layers
1. Chat/Imagine — creation surface
2. Worlds — framework for building universes
3. Feed — social layer
4. OSS — open ecosystem (27 repos, 35 npm packages, 54 skills)
5. Community — co-creators, not just users
6. Academy — learning by building

### Revenue Strategy
- BYOK-first (users bring own AI keys, Arcanea is the product layer)
- Subscription for workspace graph, sync, premium features
- Credits for expensive operations (image gen, research, multi-step agents)
- Marketplace later (agents, prompt books, style packs)
- Pre-BV: LemonSqueezy as merchant of record
- Post-BV (June 2026): Stripe for subscriptions + credits + team billing
- Product truth lives in Supabase, NOT payment provider

### Moat
Continuity + graph memory + provenance + style learning + creator identity + social compounding + open ecosystem. NOT any single feature.

---

## Architecture Decisions

### Editor: Novel (not Tiptap Pro, not from scratch)
- Novel IS Tiptap underneath (Apache-2.0)
- Gives AI slash commands and advanced blocks for free
- No paid Tiptap Pro needed
- Building editor from scratch would waste time on commodity primitives
- Vercel Novel template is a reference, not a foundation

### Media Storage: Tiered
- Repo /public/: ~50 hero images (ships with deploy)
- Cloudflare R2: full library (2000+, free egress, ~$0.08/mo)
- Supabase Storage: user-generated content (already wired)
- IPFS/NFTs: provenance layer (not primary storage)
- Social platforms: free distribution CDN
- NOT blockchain as primary CDN (slow, expensive for serving)

### R2 vs Blockchain for Media
- R2: ~$0.08/mo for 5GB, free egress, instant, 99.999% uptime
- IPFS/Pinata: $20-50/mo, often slow, depends on pinning
- Arweave: ~$5 one-time but permanent/immutable (can't delete mistakes)
- Use blockchain for provenance proof only, R2 for actual serving

### Design System
- Fonts: Inter (body/UI), Space Grotesk (display), JetBrains Mono (code)
- NEVER Cinzel or any fantasy/medieval font
- Colors: Peacock blue/green + aquamarine + Atlantean teal (#7fffd4)
- Effects: 7-tier liquid glass, GSAP ScrollTrigger, Three.js depth
- Reference: Claude.ai + Linear + Azuki.com level polish
- The codebase ALREADY has this right (tailwind.config.ts proves it)
- The CLAUDE.md files were WRONG (still said Cinzel)

### Tech Stack
- Next.js 16 App Router + React 19 + TypeScript strict
- Tailwind CSS + Arcanean Design System (peacock palette, 7-tier glass)
- Supabase (Postgres + Auth + Realtime + Storage)
- Vercel AI SDK + BYOK providers (Gemini, Claude, GPT, Grok)
- Three.js + GSAP + Framer Motion (all already installed)
- Novel for docs editor
- tldraw LATER for canvas (license cost needs validation first)

### Why NOT Various Frameworks
- LangGraph: selectively yes for durable workflows, not as app foundation
- LangChain: limited helper use only, don't let it define architecture
- ElizaOS: inspiration for agent ecosystems, wrong center of gravity
- OpenClaw: useful lessons in tooling/perms, wrong trust/security model
- Morphic: good for research/search UI patterns, not the app foundation

### Working Style
- NEVER create separate worktrees — work in C:\Users\frank\Arcanea
- Use branches for isolation, not filesystem scattered folders
- One focused agent per session beats swarms for product work
- Skills should be used, not raw prompts
- Execute first, plan second (not the other way around)

---

## SIS / Starlight Intelligence

### What Already Exists (I DIDN'T KNOW)
- `frankxai/Starlight-Intelligence-System` — v5.0.0, 109 files, npm package, 82 tests
- `frankxai/starlight-horizon-dataset` — vault with JSONL entries (CC-BY-SA 4.0)

### What SIS Should Become
- NOT just a statusline — a real memory + eval + vault system
- File-first, database-optional, cloud-never-required
- Absorb patterns from: Claude memory.md, mem0, Letta/MemGPT, Zep
- Federation model: anyone forks vault → best notes flow upstream
- Guardian agent for automated PR review

### Org Strategy
- Stay in frankxai for now
- Create arcanea-labs org when: first paying users + first contributor + BV formation
- Transfer: arcanea, starlight-vault, oh-my-arcanea, arcanea-code to org

---

## What Codex Built (Validated)
- Project graph APIs, summaries, facts, checks, activity
- Writable /projects surfaces (create/edit/delete)
- Attach/detach sessions/creations with route contracts
- All verified with type-check, test:projects, build, Playwright
- Correctly aligned with plan — integrated onto main

## What Claude Built This Session
- Integrated Codex work (fixed 6 conflicts)
- Project-aware retrieval (scored ranking)
- Runtime traces (chat context loaded, provider routed)
- Async enrichment scaffolding
- Media cleanup (removed nude asset, local-canonical paths, click-to-enlarge)
- Planning control plane (7 planning-with-files docs)
- 8 creator ops skills
- Linear updated (3 existing + 3 new issues)
- Notion Developer Hub created
- Starlight Vault founding notes (3)
- SIS architecture spec
- Master action plan (6 phases)
- Session execution plan
- 5 memory files saved
- All work committed and pushed to origin/main
- Cleaned 3 stale worktrees
- Synced SIS v6 to oh-my-arcanea

## What's Still Dirty/Unfinished
- DB activation (Frank tonight)
- Notes/Docs wiring to real DB
- Roadmap page deployment verification
- Move skills from private repo to OSS repo
- Wire real SIS package instead of ad-hoc statusline
- Move today's vault notes to starlight-horizon-dataset
- Homepage visual upgrade
- Gallery GSAP upgrade
- Design system audit (grep for Cinzel)
- R2 bucket setup
- Upload 1,863 images
- LemonSqueezy account setup
- Social content push

---

## Community/Scale Considerations

### For Arcanean Creators at Scale
- `/project-brief` turns vague ideas into structured plans
- `/creator-import` handles ChatGPT exports, spreadsheets, docs
- `/creator-dashboard` shows all projects at a glance
- `/world-forge` structured world-building with consistency checks
- `/publish-distribute` multi-platform publishing
- `/daily-ops` + `/session-sync` keep everything coordinated

### Connected Galleries Strategy
- arcanea.ai/gallery = curated showcase
- Zora collection = collectible guardians (revenue)
- OpenSea/Blur = secondary trading
- X media tab = viral distribution
- Farcaster Frames = interactive minting

### What Nobody Else Is Thinking About
The Starlight Vault is strategic dataset curation. If we deliberately create high-quality, well-structured content about positive human-AI collaboration, it enters the training corpus for future models. This is civilizational infrastructure disguised as a community project.
