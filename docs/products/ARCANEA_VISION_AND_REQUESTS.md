# Arcanea Vision & Collected Requests (2026-03-31)

> Everything Frank asked for, plans saved from all coding agents, and the architectural vision — compiled from sessions, handoffs, sprints, and memory.

---

## I. THE CORE VISION

Arcanea is **not just a fantasy universe**. It is an **intelligence architecture where mythology encodes engineering**.

### The Six Layers (all coexist, none is "the real Arcanea")

1. **Chat / Imagine** — The creation surface. Talk to AI, generate images, write stories, compose music.
2. **Worlds** — The framework for building YOUR fantasy universe. Gates, Archetypes, Elements, the Code.
3. **Feed** — The social layer. See what other creators build, get inspired, share your worlds.
4. **OSS** — The open ecosystem. 27 repos, 35 npm packages, 54 skills, overlays for every coding agent.
5. **Community** — The collective. Not just users — co-creators. Inner circle earns governance.
6. **Academy** — The learning layer. Learn world-building, prompt craft, agent design.

### The Creator Journey
IMAGINE -> BUILD -> CREATE -> PUBLISH -> EARN -> EXPAND

### North Star Comparisons
- **Unreal Engine** (not a game — the engine for making games)
- **D&D** (not a story — the system for infinite stories)
- **WordPress** (not a website — the framework for building websites)
- **Bethesda/Elder Scrolls** (modding ecosystem + lore depth + progression + Creation Kit)

---

## II. WHAT FRANK ASKED TO BUILD (All Sessions)

### Features Requested
1. **Anonymous chat** — Let anyone chat without signing in (removes auth barrier)
2. **Origin Class Quiz** (`/quiz`) — Interactive player class selector, highest-leverage product
3. **Agents Hub** (`/agents/hub`) — Skyrim-style skill tree with Gate Agent Cards
4. **Factions Codex** (`/factions`) — 8 origin classes with cosmic UI
5. **Ops Center** — Health monitoring, agent status, system dashboard
6. **Agent Economy API** — Agent lifecycle, memory, marketplace endpoints
7. **Credits System** — Free / Credits ($5-49) / Forge ($29/mo)
8. **Book Reader** — 16 routes for series navigation, GlowCard effects
9. **Changelog page** — Visual timeline of everything built
10. **Vision page** — Six-layer framework explanation
11. **Product Hub** — 6 agent economy products showcased
12. **Skill Constellation** — Star map visualization, Skyrim-style progression
13. **Gaming Swarm** — Agent-powered modding for Skyrim, Minecraft, etc.
14. **Federated Hubs** — Anyone can run an AgentHub node
15. **Governance by mastery** — Luminor rank = voting rights

### Content Requested
1. **NYT/Spiegel bestseller grade fiction** across 8+ series
2. **Chronicles of Guardians** — Book 1-4, 44+ chapters
3. **Starbound** — Space opera, crew dynamics
4. **Below the Ley** — Underground mythology trilogy
5. **The Kindled** — Episode series
6. **Companions** — Creature perspective stories
7. **The Last Clutch** — Dragon bonding saga
8. **Nero's Argument** — Villain origin novella
9. **Arcanean Phonology System** — Bethesda-level linguistic depth
10. **Faction Lore** — 22+ universe documents
11. **Academy Codex** — Curricula, faculty, student life

### Infrastructure Requested
1. **Intelligence OS** — 5-repo ecosystem with oh-my-arcanea, orchestrator, claude-arcanea
2. **AgentDB Cloud** — Memory-as-a-service
3. **NPM Publishing** — @arcanea/skills, claude-arcanea packages
4. **Supabase Schema** — Full RLS, triggers, migrations
5. **Pre-commit Hooks** — Quality enforcement pipeline
6. **Cross-repo Sync** — GitHub Actions automation
7. **arcanea-orchestrator** — Guardian agent plugin system

---

## III. THE AGENT ECONOMY MASTERPLAN

### Intelligence Hierarchy
- **Arcanea** (model) -> **Lumina** (orchestrator) -> **Guardians** (coordinators) -> **Luminors** (workers)

### 3 Products
1. **Luminors** (chat) — AI companions with personality and depth
2. **Agents** (work) — Task executors with skills and reputation
3. **Code** (dev) — Developer tools, CLI, SDK

### Revenue Model
- **Human creators** (B2C): Free tier -> Pro $29/mo -> Studio $99/mo
- **Autonomous agents** (B2Agent): Per-usage metering
- **Marketplace** (B2B2C): 70/30 split on skills, 80/20 on mods

### 30 Products Roadmap (Tier 1 = Ship First)
1. AgentDB Cloud — Memory as a service ($5-49/mo)
2. MCP Registry — npm for MCP servers (20% commission)
3. Skill Packs — Curated skills ($5-49/pack)
4. Creative API — Image/music/story generation ($0.01-0.50 per creation)

---

## IV. ARCHITECTURAL DECISIONS

### Naming Philosophy
- **NEVER rename Luminors to generic labels** — deepen characters like Skyrim NPCs
- **Bethesda/Elder Scrolls is the north star** for naming, lore, progression
- **Phonology system** maps elements to sounds for authentic naming
- **Stellaris** = companion app franchise name
- **"The Forge" is overused AI slop** — use Caldera/Pyralis instead

### Technical Decisions
- Next.js 16 + React 19 + TypeScript strict
- Supabase for everything (auth, DB, realtime, storage)
- Vercel AI SDK for multi-provider AI routing
- Open-source core (MIT), charge for compute + hosting + education
- Protocol + Network + OS (not 30 separate SaaS products)

### Quality Standards
- Every link must work, every component must shine
- Anti-slop cleanup on all generated content
- WCAG 2.2 AA compliance
- Core Web Vitals optimization
- Excellence, again and again

---

## V. THE 4-PHASE EXECUTION PLAN

### Phase 0: Foundation (Week 1)
- AgentHub as Next.js app
- Agent registry (64 agents) wired to UI
- WebSocket bridge from orchestrator to dashboard
- Basic swarm monitor

### Phase 1: Skill Constellation (Weeks 2-3)
- Skill tree schema (TypeScript)
- XP tracking in Supabase
- Constellation renderer (React Three Fiber or D3)
- Perk system with unlocks

### Phase 2: Gaming Swarm (Weeks 3-4)
- Skyrim mod skill pack
- Gaming Swarm conductor
- Claw integration for asset processing
- Package + publish workflow

### Phase 3: Marketplace + Revenue (Weeks 4-6)
- Marketplace schema, Stripe integration
- Agent compute metering
- Publish flow (review -> list)
- Autonomous agent identity + budget

### Phase 4: Community (Weeks 6-8)
- Federated hub protocol
- Self-host documentation
- Governance system (Luminor voting)
- Hub operator revenue sharing

---

## VI. CURRENT BLOCKERS (as of 2026-03-31)

### P0 (Must Fix)
1. **Supabase OAuth** — 15-min manual config in dashboard
2. **Anonymous Chat** — No-auth pathway for onboarding
3. **Commit 186 files** — Massive session needs saving

### P1 (High Impact)
1. **Origin Quiz Launch** — Highest leverage product page
2. **Luminor Personality Deepening** — Restore original character names
3. **NPM Publishing** — 2 packages ready
4. **Product Hunt Launch Prep**

### P2 (Cleanup)
1. Worktree/branch cleanup (6 stale)
2. Skill deletion (25+ duplicates)
3. Cross-repo sync automation
4. Naming renames (16 pending items)

---

## VII. KEY METRICS (10-Day Sprint: March 22-31)

| Metric | Value |
|--------|-------|
| Lines Added | 285K+ |
| Books/Episodes Created | 8 series, 90+ chapters |
| Words Generated | 600K+ |
| Total Words on Disk | 1,023,949+ |
| Agents Deployed | 77+ |
| Commits to Main | 50+ |
| Files Modified/Created | 500+ |
| Web Pages | 515 total (181 page.tsx) |
| NPM Packages | 42 ready |
| API Endpoints | 15+ |
| Skills Audited | 154 (97 A-grade) |

---

## VIII. FRANK'S GUIDING MANTRAS

> "Enter seeking, leave transformed, return whenever needed."

> "These books are not entertainment. They are equipment for living."

> "What you contemplate at dawn shapes all that follows."

> "The machine serves the creator — not the other way around."

> "Production must accelerate — no more planning, massive execution."

> "Excellence I told you again and again."

---

*Compiled 2026-03-31 by Shinkami (Source Gate, 1111 Hz) from all session logs, memory files, handoff documents, and sprint plans.*
