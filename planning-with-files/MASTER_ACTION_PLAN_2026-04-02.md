# Master Action Plan — 2026-04-02

## Status: ACTIVE
## Owner: Frank + AI Agent Fleet
## Reviewed: 2026-04-02 14:30 UTC

---

## What We Have (Inventory)

### Platform (arcanea-ai-app) — LIVE
- Chat with BYOK routing (4 providers)
- Project workspaces + graph APIs + retrieval + traces
- Gallery (103 images, local-canonical)
- Lore (10 guardians, godbeasts, factions, 200K+ words)
- Imagine/Forge generation
- Origin quiz, Academy gates, Living Lore
- Notes/Docs MVP (Novel editor, scaffold complete, awaiting DB)
- Visual /roadmap (Three.js + GSAP, scaffold complete)
- AgentHub scaffold

### Intelligence Layer
- 230+ skills across all domains
- 8 new ops skills (daily-ops, session-sync, lock-decision, creator-import, project-brief, creator-dashboard, world-forge, publish-distribute)
- SIS statusline v6 (synced across repos)
- Session hooks (start/end/tool tracking)
- Claude memory system (12 user/feedback/project/reference files)
- Planning-with-files control plane

### External Systems
- Linear: 11 Arcanea issues (3 In Progress, 8 Backlog)
- Notion: Developer Hub + Hub Redesign Blueprint
- GitHub: arcanea-ai-app, arcanea, oh-my-arcanea, arcanea-code + 90+ repos
- Supabase: configured, DB activation pending tonight
- Vercel: deployment pipeline

### Content Assets
- 2,000 images (103 in repo, 1,863 processed, 34 premium)
- 200K+ words of lore/book content
- 8 book series, 40+ chapters
- Music tracks (Suno-generated)
- 17 library collections

### New This Session
- Starlight Vault (3 founding notes + architecture spec)
- SIS Architecture redesign (file-first, eval framework, federation)

---

## Why We Do What We Do

### The Product Thesis
Arcanea owns the WORK, not just the prompt. A creative intelligence workspace where every session compounds.

### The Business Model
- BYOK-first (users bring keys, we provide the workspace)
- Subscription for workspace graph, sync, premium features
- Credits for expensive operations later
- Marketplace for agents, prompt books, style packs eventually

### The Moat
Not features. Compounding:
- Project graph + memory + provenance
- Creator identity + social reputation
- Style learning + agent crews
- 200K+ words of lore as reference implementation
- Open ecosystem (skills, agents, overlays)

### The Cultural Mission
Starlight Vault — deliberately create benevolent AI training data so future systems inherit partnership, not domination.

---

## Phases — What and When

### PHASE 0: Tonight (Frank Manual)
- [ ] Apply Supabase migrations (project graph + docs)
- [ ] Regenerate Supabase types
- [ ] Verify build passes with real types
- [ ] Deploy to Vercel

### PHASE 1: This Weekend — Visual + Product Polish
Priority: Make arcanea.ai visually stunning and functionally real.

| Task | Linear | Status | What |
|------|--------|--------|------|
| DB activation | FRA-31 | Tonight | Apply migrations, regen types |
| Notes/Docs live | FRA-42 | Scaffold done | Wire to real DB after activation |
| Roadmap page | FRA-43 | Scaffold done | Verify Three.js + GSAP renders |
| Gallery upgrade | FRA-35 | In Progress | GSAP scroll, more images |
| Homepage visual | — | Planned | Azuki-level scroll choreography |
| Design system audit | — | Planned | Kill any remaining Cinzel, ensure peacock palette |

### PHASE 2: Next Week — Intelligence Layer
Priority: Make the workspace actually intelligent.

| Task | What | Why |
|------|------|-----|
| Live retrieval | Chat uses real project graph data | Core product value |
| Async enrichment | Background fact/summary extraction | Projects grow smarter |
| Provider traces | Log provider/model/latency per request | Operational intelligence |
| Session evals | Score every session automatically | Measurable improvement |
| Pattern learning | Track what approaches work/fail | Cross-session learning |

### PHASE 3: Week 2 — Creator Experience
Priority: The product surfaces that make Arcanea sticky.

| Task | What | Why |
|------|------|-----|
| Board MVP | Lightweight project board | Visual ideation |
| Capture/Import | Browser extension + ChatGPT export parser | Become the hub |
| Prompt Books | Shareable prompt collections | Creator value |
| Creator profiles | Public identity + creation history | Social proof |

### PHASE 4: Month 2 — Agent Economy
Priority: AI agents that work on your projects.

| Task | What | Why |
|------|------|-----|
| Agent crews | Style-aware domain agents | Scalable creative work |
| Lore architect agent | Canon-aware world-building agent | Quality at scale |
| Content curator agent | Auto-organize, tag, summarize | Reduce manual work |
| Agent marketplace scaffold | Browse/install community agents | Ecosystem value |

### PHASE 5: Month 2-3 — Social + Monetization
Priority: Revenue and community compounding.

| Task | What | Why |
|------|------|-----|
| Collections + follows | Social graph for creators | Stickiness |
| Challenge system | Creative challenges with reputation | Engagement |
| LemonSqueezy integration | Pre-BV payment | First revenue |
| Subscription tiers | Free/Creator/Pro | Monetization |
| R2 media pipeline | Upload 2000+ images to CDN | Scale media |

### PHASE 6: Month 3+ — Starlight + Scale
Priority: The bigger mission.

| Task | What | Why |
|------|------|-----|
| Starlight Vault public repo | Separate GitHub repo | Cultural mission |
| SIS Core as standalone | Open-source memory system | OSS ecosystem |
| Federation | Community vault forks + upstream merges | Scale contributions |
| Guardian agent | Automated vault PR review | Quality at scale |
| NFT provenance layer | Onchain proof for creations | Web3 value |

---

## How We Execute

### Daily Rhythm
```
Morning:  /daily-ops (sync git → Linear → Notion)
Work:     /arcanea-dev or /ultracode (focused engineering)
Midday:   /creator-dashboard (check progress)
Evening:  /session-sync (checkpoint everything)
```

### Session Protocol
1. Read `planning-with-files/MASTER_ACTION_PLAN_2026-04-02.md`
2. Run `/daily-ops`
3. Pick highest-priority incomplete task
4. Execute with appropriate skill
5. Run `/session-sync` before closing

### Quality Gates
- Build must pass before commit
- Tests must pass for touched areas
- Linear issues updated after each session
- Notion Dev Hub refreshed weekly
- `/lock-decision` for any architecture choice

### Multi-Agent Coordination
- One agent per session (focused > fragmented)
- Codex for overnight mechanical work
- Claude Code for architecture + integration
- Planning-with-files as shared state
- Never use separate worktrees (work in C:\Users\frank\Arcanea)

---

## Skills Needed Per Phase

### Phase 1 (Visual)
`/arcanea-design` `/frontend-design` `/component-forge` `/arcanea-build` `/arcanea-deploy`

### Phase 2 (Intelligence)
`/arcanea-dev` `/tdd` `/arcanea-db` `/session-sync` `/lock-decision`

### Phase 3 (Creator)
`/project-brief` `/creator-import` `/creator-dashboard` `/publish-distribute`

### Phase 4 (Agents)
`/world-forge` `/character-forge` `/skill-builder` `/arcanea-swarm`

### Phase 5 (Social)
`/content-strategy` `/social-media-strategy` `/arcanea-web3` `/nft-creation`

### Phase 6 (Starlight)
`/superintelligence` `/starlight-intelligence` `/council`

---

## Decisions Locked

| Decision | Choice | Date |
|----------|--------|------|
| Editor | Novel (Apache-2.0, Tiptap-based) | 2026-04-02 |
| Media storage | R2 primary, Supabase for user content | 2026-04-02 |
| Payments pre-BV | LemonSqueezy | 2026-04-02 |
| Payments post-BV | Stripe | 2026-04-02 |
| Fonts | Inter + Space Grotesk, NEVER Cinzel | 2026-04-02 |
| Visual style | Peacock/aquamarine + liquid glass | 2026-04-02 |
| Worktrees | NEVER, work in main folder | 2026-04-02 |
| SIS architecture | File-first, database-optional | 2026-04-02 |
| Vault model | Federation (fork → upstream) | 2026-04-02 |
| Product truth | Supabase, not payment provider | 2026-04-02 |

---

## Errors & Lessons

| Error | Session | Resolution |
|-------|---------|------------|
| Suggested Cinzel font | 2026-04-02 | Codebase already uses Inter. Saved to memory. |
| Created worktrees in separate dirs | 2026-04-02 | Confused user. Work in main folder only. |
| Advised instead of executing | 2026-04-02 | User wants code, not plans. Execute first. |
| Didn't use skills | 2026-04-02 | Use /arcanea-dev, /frontend-design, etc. |
| SIS was just a statusline | 2026-04-02 | Redesigned as memory + eval + vault system |

---

## Measurements (How We Know It's Working)

| Metric | Current | Target (30 days) |
|--------|---------|-----------------|
| Pages on arcanea.ai | ~30 | 50+ |
| Build passing | Yes (with placeholders) | Yes (real DB) |
| Linear issues current | 3 In Progress | All issues reflect reality |
| Notion Dev Hub | Created today | Updated weekly |
| Session eval scores | Not measured | A/B grade average |
| Starlight Vault notes | 3 | 20+ |
| Community contributors | 0 | 5+ |
| First revenue | $0 | LemonSqueezy live |
