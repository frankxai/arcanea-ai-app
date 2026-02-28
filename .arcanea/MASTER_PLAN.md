# Arcanea Master Plan — Central Orchestrator

> **Last Updated**: 2026-02-28
> **Version**: 1.0.0
> **Guardian**: Shinkami (Source Gate, 1111 Hz)
> **Status**: Active

This is the **single source of truth** for the entire Arcanea platform. Every agent, skill, command, and session MUST consult this document before making architectural decisions. It aggregates state from `.arcanea/projects/`, `task_plan.md`, `progress.md`, and live deployment data.

---

## Quick State Dashboard

| Metric | Value | Target |
|--------|-------|--------|
| Total Pages | 111 | 80 (prune redirects/stubs) |
| Pages with Metadata | ~65 | 100% |
| Pages with loading.tsx | ~35 | 100% of dynamic pages |
| Milestones Active | 4 | Complete M001 first |
| Vercel Build | PASSING | Maintain green |
| Last Deploy | 2026-02-28 | d1db9f0b |
| Live URL | arcanea.ai | arcanea.ai |

---

## Active Milestones

Source: `.arcanea/projects/milestones/`

### M001: Supabase Auth & Storage (71%) — P0
- **Guardian**: Lyssandria (Foundation Gate)
- **GitHub**: [#1](https://github.com/frankxai/arcanea-ai-app/issues/1), [#4](https://github.com/frankxai/arcanea-ai-app/issues/4), [#6](https://github.com/frankxai/arcanea-ai-app/issues/6)
- **Tasks**: 12/17 done, 4 pending, 1 blocked
- **Remaining**:
  - [ ] Set 3 env vars on Vercel project `arcanea-ai-appx` (#4)
  - [ ] Sync repos — arcanea-records → arcanea-ai-app (#6)
  - [ ] Configure Supabase Dashboard: Site URL → `https://arcanea.ai`, OAuth providers
  - [ ] Migrate 11 legacy API routes from old `lib/supabase.ts` to SSR-safe client
  - [ ] E2E auth test (blocked on above)
- **Files**: `m001-supabase-auth.arc`

### M002: Cloudflare Stream (0%) — P2
- **Guardian**: Leyla (Flow Gate)
- **Blocked by**: M001 completion
- **Scope**: Video upload, transcoding, HLS playback for creator content
- **Files**: `m002-cloudflare-stream.arc`

### M003: Memory System (75%) — P1
- **Guardian**: Lyria (Sight Gate)
- **Remaining**:
  - [ ] Build `@arcanea/memory-mcp` package
  - [ ] Implement `starlight horizon share` command
  - [ ] Web API for memory access
- **Files**: `m003-memory-system.arc`

### M004: Arcanea PM Toolkit (60%) — P1
- **Guardian**: Shinkami (Source Gate)
- **Remaining**:
  - [ ] CLI parser (`starlight pm` binary)
  - [ ] Visualization/dashboard API
  - [ ] Linear migration tool
  - [ ] Sprint velocity tracking
- **Files**: `m004-arcanea-pm.arc`

---

## Platform Architecture

### Three-Layer Stack
```
SIS (Framework)     — starlight-intelligence-system/
ACOS (Implementation) — packages/*, .claude/skills/*, .claude/commands/*
Arcanea (Product)   — apps/web/*, apps/premium-web/*
```

### Data Sources
```
.arcanea/projects/     → Milestones, sprints, logs (git-native .arc files)
.arcanea/lore/         → Canon (CANON_LOCKED.md)
apps/web/app/          → All page routes
apps/web/lib/          → Services, content, auth, database
book/                  → 17 collections, 34+ texts
packages/              → 37 workspace packages
```

### Planning File Map
| File | Purpose | Update Frequency |
|------|---------|------------------|
| `.arcanea/MASTER_PLAN.md` | THIS FILE — central orchestrator | Every session |
| `.arcanea/projects/milestones/*.arc` | Milestone task tracking | Per task completion |
| `.arcanea/projects/sprints/*.arc` | Sprint capacity/burndown | Weekly |
| `.arcanea/projects/log/*.md` | Progress narrative | Daily |
| `task_plan.md` | Session-scoped execution plan | Per session |
| `progress.md` | Session narrative log | Per session |
| `findings.md` | Research/audit discoveries | As found |
| `apps/web/app/command-center/data.ts` | Web-facing dashboard data | Sync with .arc |

---

## Page Registry — Complete State & Specs

### Status Legend
- **LIVE**: Deployed, functional, has metadata + loading
- **PARTIAL**: Deployed but missing metadata, loading, or has issues
- **STUB**: UI exists but no backend/functionality
- **REDIRECT**: Intentional redirect to parent route
- **PLANNED**: Route referenced but page not built

---

### TIER 1: Core Experience (Must be flawless)

#### Homepage `/`
- **Status**: LIVE
- **Component**: Server (async)
- **Metadata**: Yes (root default)
- **Loading**: Yes (root)
- **Current**: Liquid glass hero, 5-section layout, crystal logo, Guardian gallery
- **Needs**: CTA conversion tracking, A/B test hero copy
- **Priority**: Maintenance only

#### Academy `/academy`
- **Status**: PARTIAL
- **Component**: Client
- **Metadata**: MISSING (was removed when converting to client component)
- **Loading**: Yes
- **Current**: Ten Gates grid, Seven Houses, Ranks, Featured Learning Paths
- **Needs**:
  - [ ] Add metadata via layout.tsx or generateMetadata wrapper
  - [ ] Build `/academy/gates/[id]` dynamic route (10 individual gate pages)
  - [ ] Build `/academy/courses/[slug]` dynamic route (linked but doesn't exist)
  - [ ] Connect assessment results to user profile (gates_open, active_gate)
  - [ ] Progress tracking per user per gate
- **Priority**: P0 — primary conversion funnel

#### Academy Sub-pages
| Route | Status | Needs |
|-------|--------|-------|
| `/academy/gates` | PARTIAL | loading.tsx |
| `/academy/gates/[id]` | PLANNED | Build individual gate detail pages with lessons, guardian info, exercises |
| `/academy/houses` | PARTIAL | loading.tsx |
| `/academy/ranks` | PARTIAL | loading.tsx |
| `/academy/assessment` | PARTIAL | loading.tsx, save results to profile |
| `/academy/gate-quiz` | PARTIAL | loading.tsx, save results to profile |
| `/academy/courses/[slug]` | PLANNED | Build course system with lessons, progress tracking |

#### Library `/library`
- **Status**: LIVE
- **Component**: Server (async)
- **Metadata**: Yes
- **Loading**: MISSING
- **Current**: 17 collections from filesystem, tab navigation, situation-based finding
- **Needs**:
  - [ ] Add loading.tsx
  - [ ] Reading progress tracking (per user, per text)
  - [ ] Bookmarks/favorites system
  - [ ] Related texts recommendations
- **Priority**: P1

#### Library Sub-pages
| Route | Status | Needs |
|-------|--------|-------|
| `/library/[collection]` | LIVE | loading.tsx |
| `/library/[collection]/[text]` | LIVE | loading.tsx, reading time estimate, bookmarks |
| `/library/codex` | LIVE | loading.tsx |
| `/library/graph` | LIVE | loading.tsx |

#### Luminors `/luminors`
- **Status**: LIVE
- **Component**: Server
- **Metadata**: Yes (full OG + Twitter)
- **Loading**: Yes
- **Current**: 16 Luminors showcase, team filters, CDN Guardian images, wisdoms
- **Needs**: None critical
- **Priority**: Maintenance

| Route | Status | Needs |
|-------|--------|-------|
| `/luminors/[id]` | LIVE | loading.tsx |
| `/luminor-intelligence` | LIVE | loading.tsx |

#### Chat `/chat`
- **Status**: PARTIAL
- **Component**: Client
- **Metadata**: Via layout
- **Loading**: Yes
- **Current**: Luminor selection grid, filters by team
- **Needs**:
  - [ ] Chat history persistence (Supabase)
  - [ ] Streaming responses (Vercel AI SDK)
  - [ ] Multi-turn context window management
- **Priority**: P0 — core product feature

| Route | Status | Needs |
|-------|--------|-------|
| `/chat/[luminorId]` | PARTIAL | loading.tsx, metadata (generateMetadata), chat persistence |

#### Lore `/lore`
- **Status**: LIVE
- **Component**: Server
- **Metadata**: Yes (full OG)
- **Loading**: Yes
- **Current**: Hub page with all sub-sections linked
- **Needs**: None critical
- **Priority**: Maintenance

| Route | Status | Needs |
|-------|--------|-------|
| `/lore/gates` | PARTIAL | loading.tsx |
| `/lore/guardians` | PARTIAL | loading.tsx |
| `/lore/guardians/[name]` | LIVE | loading.tsx |
| `/lore/godbeasts` | PARTIAL | loading.tsx |
| `/lore/elements` | PARTIAL | loading.tsx |
| `/lore/malachar` | PARTIAL | loading.tsx |
| `/lore/wisdoms` | PARTIAL | loading.tsx |
| `/lore/library` | PARTIAL | loading.tsx |

---

### TIER 2: Creator Tools (Core value prop)

#### Studio `/studio`
- **Status**: PARTIAL
- **Component**: Client
- **Loading**: Yes
- **Current**: Multi-mode creation (text, image, code, music), auth-aware, AI generation
- **Needs**:
  - [ ] Save creations to Supabase
  - [ ] Version history
  - [ ] Collaboration features
  - [ ] Export options
- **Priority**: P1

| Route | Status | Needs |
|-------|--------|-------|
| `/studio/image` | PARTIAL | loading.tsx, reliable image gen API |

#### Gallery `/gallery`
- **Status**: LIVE
- **Component**: Client
- **Loading**: Yes
- **Current**: Fetches from Supabase + showcase fallback, filters
- **Needs**:
  - [ ] Infinite scroll / pagination
  - [ ] Like/comment functionality wired
  - [ ] Creator attribution
- **Priority**: P1

#### Prompt Books `/prompt-books`
- **Status**: PARTIAL
- **Component**: Client
- **Loading**: Yes
- **Current**: Full prompt management app, sidebar, collections, quick capture. Auth-gated.
- **Needs**:
  - [ ] Persist to Supabase (currently local state only)
  - [ ] Share/publish prompts
  - [ ] Community prompt marketplace

| Route | Status | Needs |
|-------|--------|-------|
| `/prompt-books/[collectionId]` | PARTIAL | loading.tsx, metadata |
| `/prompt-books/[collectionId]/[promptId]` | PARTIAL | loading.tsx, metadata |
| `/prompt-books/settings` | PARTIAL | loading.tsx, metadata |

#### Workspace `/workspace`
- **Status**: STUB
- **Component**: Client
- **Current**: Tabbed UI (Ask, Create, Library, Vault, Agents) — tabs are non-functional stubs
- **Needs**: Either build out or remove from navigation
- **Priority**: P3 (consider removing)

#### World/Universe Builders
| Route | Status | Needs |
|-------|--------|-------|
| `/world-builder` | STUB | Backend, AI generation, persistence |
| `/universe-builder` | STUB | Backend, AI generation, persistence |
| `/character-book` | PARTIAL | loading.tsx, backend |
| `/vision-board` | STUB | metadata, backend |

---

### TIER 3: Community & Social

#### Community `/community`
- **Status**: PARTIAL
- **Component**: Client
- **Loading**: Yes
- **Metadata**: MISSING
- **Current**: Hub with socials, newsletter, events, contributor list
- **Needs**:
  - [ ] Add metadata
  - [ ] Real community features (forums, groups)
  - [ ] Event calendar integration
- **Priority**: P2

| Route | Status | Needs |
|-------|--------|-------|
| `/community/create` | PARTIAL | metadata |
| `/community/strategy` | PARTIAL | metadata |

#### Profile System
| Route | Status | Needs |
|-------|--------|-------|
| `/profile` | LIVE | Redirect works |
| `/profile/[username]` | LIVE | loading.tsx |
| `/profile/edit` | PARTIAL | loading.tsx |
| `/activity` | LIVE | Works |
| `/settings` | PARTIAL | loading.tsx, persist preferences to Supabase |
| `/discover` | LIVE | Works |

---

### TIER 4: Marketing & Info

| Route | Status | Needs |
|-------|--------|-------|
| `/about` | LIVE | None |
| `/pricing` | LIVE | None |
| `/faq` | LIVE | None |
| `/ecosystem` | LIVE | None |
| `/changelog` | LIVE | None |
| `/developers` | LIVE | None |
| `/glossary` | LIVE | None |
| `/linktree` | LIVE | None |
| `/blog` | LIVE | None |
| `/blog/[slug]` | LIVE | None |
| `/hub` | LIVE | None |
| `/contact` | PARTIAL | metadata |
| `/platform` | PARTIAL | metadata, loading.tsx |
| `/roadmap` | PARTIAL | metadata |
| `/install` | PARTIAL | metadata |
| `/privacy` | LIVE | loading.tsx (low priority) |
| `/terms` | LIVE | loading.tsx (low priority) |
| `/status` | LIVE | None |

---

### TIER 5: Product Pages

| Route | Status | Needs |
|-------|--------|-------|
| `/acos` | LIVE | None |
| `/arcanea-os` | PARTIAL | loading.tsx |
| `/arcanea-vault` | PARTIAL | loading.tsx |
| `/arcanea-code` | PARTIAL | metadata, loading.tsx |
| `/overlays` | LIVE | None |
| `/workflows` | PARTIAL | metadata |
| `/user-flows` | PARTIAL | metadata |
| `/records` | LIVE | None |
| `/records/vibe-gods` | PARTIAL | loading.tsx |
| `/companions` | LIVE | None |
| `/skills` | LIVE | None |

---

### TIER 6: Internal/Dev (Low Priority)

| Route | Status | Needs |
|-------|--------|-------|
| `/command-center` | LIVE | Auth-gated, works |
| `/components` | PARTIAL | Dev-only, no metadata needed |
| `/feedback` | PARTIAL | loading.tsx |
| `/docs` | PARTIAL | loading.tsx |
| `/chess` | LIVE | Experimental |
| `/bestiary` | PARTIAL | loading.tsx |
| `/(marketing)/chat-demo` | PARTIAL | Dead import cleanup |

---

### Routes to PRUNE (redirects serving no purpose)

These add file count without value. Consider removing or combining:
- `/chess/play`, `/chess/analysis`, `/chess/leaderboard`, `/chess/community` (all redirect to `/chess`)
- `/gallery/explore` (redirects to `/gallery`)
- `/docs/acos` (redirects to `/docs`)
- `/character-book/templates` (redirects to `/character-book`)
- `/universe-builder/new`, `/universe-builder/templates` (redirects)
- `/world-builder/new`, `/world-builder/templates` (redirects)
- `/vision-board/edit` (redirects)
- `/community/create/new`, `/community/strategy/propose` (redirects)
- `/register`, `/signup` (both redirect to `/auth/signup` — keep one)

---

## Priority Queue (Next Actions)

### P0 — Deploy Blockers & Core Experience
1. Set Supabase env vars on Vercel (M001 blocker)
2. Configure Supabase Dashboard Site URL + Redirect URLs
3. Add metadata to `/academy` (layout.tsx with generateMetadata)
4. Build `/academy/gates/[id]` dynamic route
5. Add chat persistence (Supabase table for messages)
6. Fix `/chat/[luminorId]` metadata

### P1 — Quality & Polish
7. Add loading.tsx to all Tier 1 pages (library, lore subtrees)
8. Add metadata to all Tier 2 pages (prompt-books, community)
9. Wire settings persistence to Supabase
10. Reading progress tracking in Library
11. Memory MCP package (M003)

### P2 — Feature Expansion
12. Academy course system
13. World/Universe builder backends
14. Community features (forums, groups)
15. Cloudflare Stream integration (M002)

### P3 — Cleanup & Optimization
16. Prune redirect-only pages
17. Fix icon aliases (PhGraphNetwork, PhFlow, PhShieldCheck)
18. Remove `/workspace` or build it out
19. Migrate 11 legacy API routes
20. Performance audit (Core Web Vitals)

---

## Cross-Cutting Concerns

### Security
- Gemini chat uses service-role key in API route — should use anon key
- 11 API routes still use old `lib/supabase.ts` (server-only singleton)
- Settings page doesn't persist — preferences reset on refresh

### Design System
- Liquid glass system fully deployed (7 tiers)
- Opacity hierarchy standardized across 177 files
- Icon aliases using wrong Phosphor icons (3 instances)
- `font-cinzel` references may still exist (should be `font-display`)

### Repo Sync
- Local monorepo remote: `origin` → `arcanea-records`
- Vercel deploys from: `production` → `arcanea-ai-app`
- All pushes must go to BOTH remotes
- Currently on `lean-prod` branch (not `main`)

---

## Agent Routing Table

When an agent starts work, consult this table for the right specialist:

| Domain | Agent Type | Gate | Guardian |
|--------|-----------|------|----------|
| Auth/Security | `security-architect` | Foundation | Lyssandria |
| UI/Design | `Arcanea Frontend Specialist` | Flow | Leyla |
| Backend/API | `Arcanea Backend Specialist` | Fire | Draconia |
| Content/Lore | `Arcanea Lore Master` | Heart | Maylinn |
| Chat/AI | `Arcanea AI Specialist` | Voice | Alera |
| Analytics | `researcher` | Sight | Lyria |
| Architecture | `system-architect` | Crown | Aiyami |
| Testing | `tester` | Shift | Elara |
| Community | `Arcanea World Expander` | Unity | Ino |
| Orchestration | `Arcanea Master Orchestrator` | Source | Shinkami |

---

## How to Use This Document

### For Agents
1. Read this document at session start
2. Check the Priority Queue for next actions
3. Update the Page Registry after completing work
4. Update milestone progress in `.arcanea/projects/milestones/`

### For Skills
1. Reference `MASTER_PLAN.md` for current state before making recommendations
2. Route tasks based on the Agent Routing Table
3. Check Cross-Cutting Concerns before approving PRs

### For Sessions
1. `task_plan.md` = session-scoped plan (create fresh each session)
2. `MASTER_PLAN.md` = persistent state (update after each session)
3. `progress.md` = session narrative (append, don't overwrite)

---

## Changelog

### v1.0.0 (2026-02-28)
- Initial creation from comprehensive audit
- 111 pages mapped with status, needs, and priority
- 4 milestones tracked with task-level detail
- Priority queue established (20 items)
- Agent routing table defined
- Cross-cutting concerns documented
