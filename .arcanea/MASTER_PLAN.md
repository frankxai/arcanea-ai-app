# Arcanea Master Plan — Central Orchestrator

> **Last Updated**: 2026-03-10
> **Version**: 1.7.0
> **Guardian**: Shinkami (Source Gate, 1111 Hz)
> **Status**: Active

This is the **single source of truth** for the entire Arcanea platform. Every agent, skill, command, and session MUST consult this document before making architectural decisions. It aggregates state from `.arcanea/projects/`, `task_plan.md`, `progress.md`, and live deployment data.

---

## Quick State Dashboard

| Metric | Value | Target |
|--------|-------|--------|
| Total Pages | ~185 (routes, 16 redirect-only pruned) | 80 (prune stubs) |
| Pages with Metadata | ~77 (+12) | 100% |
| Pages with loading.tsx | ~81 (+32) | 100% of dynamic pages |
| Milestones Active | 11 (M001-M010 + M006) | M001 (Auth) → M008 (Onboarding) → M006 (Creator Tools) → M009 (Polish) |
| Vercel Build | PASSING | Maintain green |
| Last Deploy | 2026-03-10 | Wave 4 (5d43cdb9) -- 4 commits since a560a8ff |
| Live URL | arcanea.ai | arcanea.ai |

---

## Active Milestones

Source: `.arcanea/projects/milestones/`

### M001: Supabase Auth & Storage (90%) — P0
- **Guardian**: Lyssandria (Foundation Gate)
- **GitHub**: [#1](https://github.com/frankxai/arcanea-ai-app/issues/1), [#4](https://github.com/frankxai/arcanea-ai-app/issues/4), [#6](https://github.com/frankxai/arcanea-ai-app/issues/6)
- **Tasks**: 15/17 done, 2 pending (admin-only), 0 blocked
- **ALL CODE IS COMPLETE**: Auth context, OAuth (Google+GitHub), callback route, profile bootstrap, middleware, protected routes, RLS policies
- **Remaining (ADMIN TASKS ONLY)**:
  - [x] ~~Set 3 env vars on Vercel project `arcanea-ai-appx`~~ — DONE (confirmed set on Vercel, 2026-03-10)
  - [x] ~~Sync repos~~ — arcanea-records → arcanea-ai-app (lean-prod branch)
  - [x] ~~Migrate legacy API routes~~ — DONE (lib/supabase.ts deleted, 0 imports remain)
  - [x] ~~DB tables~~ — All persistence tables created: profiles, creations, reading_progress, pb_* (Prompt Books), chat_sessions, luminor_councils, activity_log
  - [ ] **Supabase Dashboard config** (15 min): Site URL → `https://arcanea.ai`, add redirect URL `https://arcanea.ai/auth/callback`, enable Google + GitHub OAuth providers
  - [ ] **E2E auth test** — verify full flow on production
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

### M005: Premium UI Overhaul via v0 (55%) — P0
- **Guardian**: Leyla (Flow Gate)
- **Target**: 2026-03-15
- **v0 Chats Generated**:
  - Studio UI: `kAvqGXxPRym` — [v0.app/chat/kAvqGXxPRym](https://v0.app/chat/kAvqGXxPRym)
  - Onboarding: `sOnFGuExkoy` — [v0.app/chat/sOnFGuExkoy](https://v0.app/chat/sOnFGuExkoy)
  - Gallery: `hJWNhFkicaR` — [v0.app/chat/hJWNhFkicaR](https://v0.app/chat/hJWNhFkicaR)
  - Settings: `nlNsLw1Dtlz` — [v0.app/chat/nlNsLw1Dtlz](https://v0.app/chat/nlNsLw1Dtlz)
  - Chat: `kWa3haHToWu` — [v0.app/chat/kWa3haHToWu](https://v0.app/chat/kWa3haHToWu)
- **Extracted & Build-Verified** (Mar 1):
  - Studio: 8 components (sidebar, right-panel, bottom-bar, 5 tabs)
  - Gallery: 3 new + 5 existing (masonry, skeletons, gallery-page, data)
  - Onboarding: 6 components (welcome, step2-5, orchestrator) in `components/arcanea/`
  - Chat: 8 components (page, sidebar, messages, input, guardian-info, empty, types, data)
  - Settings: sidebar component
- **Remaining**: Wire to Supabase backend, replace mock data
- **Tasks**: 8/8 pages premium (Studio, Settings, Onboarding, Gallery, Chat, Academy, Community, Pricing all upgraded)
- **Mar 1 Session 2**: Academy rewritten (376 lines, Ten Gates grid, Houses, Ranks), pricing reviewed (509 lines, already complete)
- **Files**: `m005-premium-ui-v0.arc`

### M006: Creator Tools Backend (60%) — P1
- **Guardian**: Draconia (Fire Gate)
- **Target**: 2026-03-22
- **Scope**: Creation pipeline, AI generation APIs, Prompt Books persistence, Reading progress, Course system, Gallery social
- **Depends on**: M001, M005
- **Progress**:
  - [x] Gallery social wired (like/comment components connected)
  - [x] Studio image generation wired (AI generation API)
  - [x] Code AI wired (code tab with AI assistance)
  - [x] Save creations to Supabase — API routes `/api/studio/save` (images) + `/api/creations` (text/code) + `creation-service.ts` all built
  - [x] Prompt Books persistence — DB schema live (6 tables: pb_collections, pb_prompts, pb_tags, pb_prompt_tags, pb_prompt_versions, pb_templates), service layer + Zustand store + full UI all built
  - [x] Reading progress tracking — DB table `reading_progress` live, `useReadingProgress` hook + `ReadingTracker` component + `ReadBadge` + collection progress bars all wired
  - [ ] Course system
- **Files**: `m006-creator-tools-backend.arc`

### M007: Community & Social (0%) — P2
- **Guardian**: Ino (Unity Gate)
- **Target**: 2026-03-29
- **Scope**: Creator discovery, social interactions, forums, events/challenges, collaboration
- **Depends on**: M001, M006
- **Files**: `m007-community-social.arc`

### M008: Onboarding & Conversion (85%) — P0
- **Guardian**: Maylinn (Heart Gate)
- **Target**: 2026-03-10
- **Scope**: Onboarding wizard integration, welcome dashboard, activation loops, analytics, auth UX
- **Depends on**: M005
- **Progress**:
  - [x] Auth guard wired
  - [x] Orchestrator working (5-step wizard flow)
  - [ ] Wire creation step to real AI generation (currently mock)
  - [ ] Activation loop analytics
- **Files**: `m008-onboarding-conversion.arc`

### M009: Performance & Production Polish (88%) — P1
- **Guardian**: Elara (Shift Gate)
- **Target**: 2026-03-22
- **Scope**: Core Web Vitals, SEO, accessibility, error handling, production hardening, cleanup
- **Depends on**: M005, M008
- **Progress**:
  - [x] Error boundaries added (error.tsx on key routes)
  - [x] LazyMotion domAnimation migration: 22/41 files converted (54%), ~8kB savings per route. Remaining 19 need domMax for layout/drag.
  - [x] `as any` casts removed from council service (proper typed Supabase)
  - [x] SEO metadata verified on all key pages — added metadata to /lore + /library layouts (Mar 10)
  - [x] Accessibility fixes: chat textarea aria-label, opengraph image alt text, proper heading hierarchy verified
  - [x] next.config.js hardened (wildcard image hostname removed, AVIF/WebP, poweredByHeader: false)
  - [x] Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
  - [x] Anti-slop audit: 9 banned patterns verified ZERO across apps/web/ (Mar 10)
  - [x] Luminor count alignment: 10 → 16 across all user-facing surfaces (Mar 10)
  - [x] Canon fix: Maylinn element Wind → Air, personality aligned with Heart Gate (Mar 10)
  - [x] SEO: removed duplicate JSON-LD from root layout (was firing on all pages) (Mar 10)
  - [x] SEO: fixed 74 double-branded page titles ("X | Arcanea | Arcanea" → "X | Arcanea") (Mar 10)
  - [x] SEO: added metadata layouts for blog posts (arcanea-skills-system, arcanea-prompt-books) (Mar 10)
  - [x] WCAG: aria-labels on chat send/dismiss/scroll buttons (Mar 10)
  - [x] WCAG: aria-labels on studio toolbar buttons (5), textareas (4), inputs (2), icon buttons (5) (Mar 10)
  - [x] Profile layout.tsx added with metadata (Mar 10)
  - [ ] Core Web Vitals audit (Lighthouse)
  - [ ] Remaining WCAG 2.2 audit items
- **Files**: `m009-performance-polish.arc`

### M010: Language & Experience Transformation (100%) — COMPLETE
- **Guardian**: Alera (Voice Gate)
- **Target**: 2026-03-08 — COMPLETED 2026-03-10
- **Strategy**: `.arcanea/strategy/LANGUAGE_EXPERIENCE_STRATEGY.md`
- **Principle**: Creation first. Mythology as earned discovery. Luminor as brand vocabulary.
- **Scope**: Rewrite all user-facing copy across the platform. Replace jargon-first, lore-dump UX with progressive disclosure that respects viewer intelligence. Implement hidden depth system (color shifts, progressive vocabulary, Easter eggs). Final piece: specialist/intelligence → Luminor rename across all surfaces.
- **Depends on**: Nothing — COMPLETE
- **Phases**:
  - [x] Phase 1: Nav + Homepage copy transformation (34890534, 986703aa)
  - [x] Phase 2: Onboarding copy transformation (7f4763c9)
  - [x] Phase 3: Studio + Dashboard UX simplification (92e69b01) — removed Guardian badge, Gate/Element dropdowns, 10-Gates sidebar, "Manifest"→"Save"
  - [x] Phase 4: Chat + Discover + Library refinement (483c67d2) — removed chat badge, "Luminor Codex"→"Codex"
  - [x] Phase 5: Anti-slop sweep (cba5c4f2) — removed "transcended"/"manifest"/"mythological"/"sacred texts" from 24 first-contact pages. Deep lore pages keep mythology (progressive disclosure).
  - [x] Phase 5b: voice.yaml anti-slop codification (7465f9f7)
  - [x] Phase 5c: Luminor→Intelligence CTAs (ab0cb339)
  - [x] Phase 6: Hidden depth Layer 3 — 404 lore quote, Hz frequency Easter egg in Library search, source code lore comments
  - [x] Phase 7: Glossary checked — deep reference page, mythology appropriate, no changes needed
  - [x] Update voice.yaml with new anti-slop principles (7465f9f7)
  - [x] Update ARCANEA_BRAND_GUIDELINES.md — voice, anti-slop filter, progressive disclosure
  - [x] Phase 8: Deep M010 sweep (2026-03-07) — navbar simplified (5 clean labels), footer restructured (4 columns, no lore dump), root metadata cleaned, below-fold: PATHWAYS/FEATURES/FAQ cleaned (Luminor→specialist), HowItWorks/CTA cleaned, chat page "Choose a specialist", FAQ 16→10 count fixed, contact/changelog/hub/updates all cleaned, zero AI slop remaining (grep verified), 14 legacy color files purged
  - [x] Phase 9: Design System v5 color purge (2026-03-07) — 251 legacy color occurrences (#8b5cf6→#0d47a1, rgba(139,92,246)→rgba(13,71,161)) replaced across 46 active files: studio (7), chat (10), gallery (5), imagine (1), arcanea/onboarding (9), academy (3), landing (4), ecosystem (1), community (1), hub (3), glow-card, global-glow-tracker, luminors/config. Active render path fully clean. Only archived (v1/v2/v3-variations) and deep-lore pages retain old colors intentionally.
  - [x] Phase 9b: Studio Luminor→AI rename (2026-03-07) — all user-facing "Luminor" labels in Studio AI panel → "AI", variable names cleaned (luminorMessages→aiMessages, luminorInput→aiInput, onAskLuminor→onAskAI)
  - [x] Phase 9c: Anti-slop pass 2 (2026-03-07) — "Your Journey Awaits"→"Start Here", "seamlessly switch"→"switch", "seamlessly connects"→"connects" on academy and arcanea-os pages
  - [x] Phase 9d: Missing loading.tsx — added v4/loading.tsx (last missing top-level page)
  - [x] Phase 10: Deep color + Luminor + slop sweep (2026-03-07) — #78a6ff→#00bcd4 across library-experience (15+), gallery, chat-imagine (3), particles, character-book, ecosystem, docs, community, components, command-center, prompt-books, records, academy gates. #8B5CF6→#0d47a1 on hub pages. Hub "Luminor Chat"→"AI Chat", "Luminor Guide"→"AI Specialist Guide", guides "Working with Luminors"→"Working with AI Specialists". Onboarding meet-luminor metadata cleaned. Dashboard metadata cleaned. FAQ/platform/acos slop phrases removed.
  - [x] Phase 11: Guardian→Luminor deep sweep (2026-03-10) — ~176 edits across ~90 files. Landing (luminor-showcase, testimonials, social-proof), academy (gate-quiz 18 edits, gates-page, ranks-page), chat (EmptyState, meet-luminor), studio (image, main), platform, developers, contact, feedback, roadmap, privacy, docs, linktree, overlays, workflows, acos, ecosystem-diagram. Variable names preserved, deep lore pages kept "Guardian" intentionally.
  - [ ] Phase 6 remaining: Layer 1 (color shifts per Guardian domain), Layer 2 (progressive vocabulary — needs auth), Layer 4/5 (unlockable experiences — needs auth)

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
- **Status**: LIVE
- **Component**: Client
- **Metadata**: Yes (layout.tsx)
- **Loading**: Yes
- **Current**: Premium 376-line experience — parallax hero, interactive Ten Gates grid with guardian/godbeast info, Seven Houses explorer, Magic Ranks progression path, cosmic glass design
- **Needs**:
  - [x] Add metadata via layout.tsx — DONE
  - [x] Build `/academy/gates/[id]` dynamic route — DONE (10 gates pre-rendered)
  - [ ] Build `/academy/courses/[slug]` dynamic route (linked but doesn't exist)
  - [ ] Connect assessment results to user profile (gates_open, active_gate)
  - [ ] Progress tracking per user per gate
- **Priority**: P0 — primary conversion funnel

#### Academy Sub-pages
| Route | Status | Needs |
|-------|--------|-------|
| `/academy/gates` | LIVE | loading.tsx added |
| `/academy/gates/[id]` | LIVE | 10 gates pre-rendered, generateMetadata, element colors, teachings, navigation |
| `/academy/houses` | PARTIAL | loading.tsx added |
| `/academy/ranks` | PARTIAL | loading.tsx added |
| `/academy/assessment` | PARTIAL | loading.tsx added, save results to profile |
| `/academy/gate-quiz` | PARTIAL | loading.tsx added, save results to profile |
| `/academy/courses/[slug]` | PLANNED | Build course system with lessons, progress tracking |

#### Library `/library`
- **Status**: LIVE
- **Component**: Server (async)
- **Metadata**: Yes
- **Loading**: Yes
- **Current**: 17 collections from filesystem, tab navigation, situation-based finding
- **Needs**:
  - [x] Add loading.tsx — DONE (2026-03-01)
  - [ ] Reading progress tracking (per user, per text)
  - [ ] Bookmarks/favorites system
  - [ ] Related texts recommendations
- **Priority**: P1

#### Library Sub-pages
| Route | Status | Needs |
|-------|--------|-------|
| `/library/[collection]` | LIVE | loading.tsx added |
| `/library/[collection]/[text]` | LIVE | loading.tsx added, reading time estimate, bookmarks |
| `/library/codex` | LIVE | loading.tsx added |
| `/library/graph` | LIVE | loading.tsx added |

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
- **Status**: LIVE
- **Component**: Client
- **Metadata**: Via layout
- **Loading**: Yes
- **Current**: Luminor selection grid, streaming via useChat() + /api/ai/chat (Gemini), session persistence (Supabase + file fallback), bond state calculation, guest mode
- **Needs**:
  - [x] Chat sessions API (GET/POST) — DONE (Mar 1)
  - [x] Chat history persistence (Supabase + file fallback) — DONE
  - [x] Streaming responses (Vercel AI SDK + Google Gemini) — DONE
  - [ ] Multi-turn context window management
  - [ ] Typing indicators
  - [ ] File attachments
- **Priority**: P1 — polish features

| Route | Status | Needs |
|-------|--------|-------|
| `/chat/[luminorId]` | LIVE | loading.tsx added, generateMetadata via layout, chat persistence wired to Supabase |

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
| `/lore/gates` | LIVE | loading.tsx added, deep narrative + sacred geometry + creative lessons |
| `/lore/guardians` | LIVE | loading.tsx added, full personality profiles, 3-column layout |
| `/lore/guardians/[name]` | LIVE | enriched godbeast descriptions + deeper teachings |
| `/lore/godbeasts` | LIVE | loading.tsx added, origin narratives + legendary encounters |
| `/lore/elements` | LIVE | loading.tsx added, cosmological context + Malachar connection |
| `/lore/malachar` | LIVE | loading.tsx added, 2 new teaching cards |
| `/lore/wisdoms` | LIVE | loading.tsx added, richer domains + voice samples |
| `/lore/library` | LIVE | loading.tsx added |

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
- **Metadata**: Yes (layout.tsx)
- **Current**: Hub with socials, newsletter, events, contributor list
- **Needs**:
  - [x] Add metadata — DONE (2026-03-01)
  - [ ] Real community features (forums, groups)
  - [ ] Event calendar integration
- **Priority**: P2

| Route | Status | Needs |
|-------|--------|-------|
| `/community/create` | PARTIAL | metadata |
| `/community/strategy` | PARTIAL | metadata |

#### Dashboard `/dashboard`
- **Status**: LIVE
- **Component**: Client
- **Metadata**: Yes (layout.tsx with OG)
- **Loading**: Yes
- **Current**: Auth guard, welcome header, stats grid (4), quick actions (3), recent activity, guardian companion sidebar, Ten Gates progress sidebar
- **Needs**:
  - [ ] Add metadata via layout.tsx
  - [ ] Wire stats to real Supabase data (creations count, gates_open, streak)
  - [ ] Wire recent activity to activity_log table
  - [ ] Guardian image from media catalog
- **Priority**: P0 — post-login landing page

#### Onboarding `/onboarding`
- **Status**: LIVE
- **Component**: Client
- **Loading**: No (needs)
- **Current**: 5-step wizard (Welcome → Creator Type → Guardian → Creation → Universe), saves to Supabase profile, redirects to /dashboard
- **Needs**:
  - [ ] Add loading.tsx
  - [ ] Add metadata via layout.tsx
  - [ ] Wire creation step to real AI generation (currently mock)
- **Priority**: P0 — conversion funnel

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
| `/blog` | LIVE | JSON-LD, aria-labels, shared data module |
| `/blog/[slug]` | LIVE | Article JSON-LD, safe rendering, shared data |
| `/hub` | LIVE | None |
| `/contact` | LIVE | None |
| `/platform` | LIVE | None |
| `/roadmap` | LIVE | None |
| `/install` | LIVE | None |
| `/privacy` | LIVE | loading.tsx (low priority) |
| `/terms` | LIVE | loading.tsx (low priority) |
| `/status` | LIVE | None |

---

### TIER 5: Product Pages

| Route | Status | Needs |
|-------|--------|-------|
| `/acos` | LIVE | None |
| `/arcanea-os` | LIVE | None |
| `/arcanea-vault` | LIVE | None |
| `/arcanea-code` | LIVE | None |
| `/overlays` | LIVE | None |
| `/workflows` | LIVE | None |
| `/user-flows` | LIVE | None |
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

### Routes Pruned (Wave 11, 2026-03-01)

16 redirect-only routes deleted. Route count reduced from 201 → ~185:
- ~~`/chess/play`, `/chess/analysis`, `/chess/leaderboard`, `/chess/community`~~ — DELETED
- ~~`/gallery/explore`~~ — DELETED
- ~~`/docs/acos`~~ — DELETED
- ~~`/character-book/templates`~~ — DELETED
- ~~`/universe-builder/new`, `/universe-builder/templates`~~ — DELETED
- ~~`/world-builder/new`, `/world-builder/templates`~~ — DELETED
- ~~`/vision-board/edit`~~ — DELETED
- `/community/create/new`, `/community/strategy/propose` — kept (may have future use)
- `/register` — kept (redirects to `/auth/signup`)

---

## Priority Queue (Next Actions)

### P0 — Deploy Blockers & Core Experience
1. ~~**Language & Experience Transformation (M010)**~~ — COMPLETE (2026-03-10). specialist/intelligence → Luminor rename finalized.
2. ~~Set Supabase env vars on Vercel~~ — DONE (confirmed 2026-03-10)
3. Configure Supabase Dashboard Site URL + Redirect URLs
3. ~~Add metadata to `/academy`~~ — DONE (2026-03-01, layout.tsx with generateMetadata)
4. ~~Build `/academy/gates/[id]` dynamic route~~ — DONE (2026-03-01, 10 gates pre-rendered)
5. ~~Add chat persistence (Supabase tables + service)~~ — DONE (2026-03-01, chat_sessions + chat_messages)
6. ~~Fix `/chat/[luminorId]` metadata~~ — DONE (2026-03-01, generateMetadata via layout)

### P1 — Quality & Polish
7. ~~Add loading.tsx to all Tier 1 pages~~ — DONE (2026-03-01, 32+17 new, 98 total)
8. ~~Add metadata to all Tier 2 pages~~ — DONE (2026-03-01, 12 new layout.tsx)
9. ~~Wire settings persistence to Supabase~~ — DONE (2026-03-01, avatar + prefs + metadata JSONB)
10. ~~Migrate legacy API routes~~ — DONE (2026-03-01, lib/supabase.ts deleted, 0 imports remain)
11. Integrate v0 Studio UI into /studio (M005-T1)
12. Integrate v0 Gallery UI into /gallery (M005-T4)
13. Reading progress tracking in Library (M006-T4)
14. Memory MCP package (M003)
15. ~~Add missing API routes~~ — DONE (2026-03-01, /api/creations/upload, /api/profiles, /api/profiles/[username], /api/notifications/unread-count, /api/notifications/read-all)
16. ~~Add JSON-LD structured data to homepage~~ — DONE (2026-03-01, Organization + WebSite schemas)
17. ~~Fix broken OG image references~~ — DONE (2026-03-01, 6 refs to non-existent static images removed)
18. ~~Fix site.webmanifest icons~~ — DONE (2026-03-01, point to dynamic /icon and /apple-icon routes)
19. ~~Add production OG/Twitter/favicon~~ — DONE (2026-03-01, opengraph-image.tsx, twitter-image.tsx, icon.tsx, apple-icon.tsx)
20. ~~Add global-error.tsx~~ — DONE (2026-03-01, root error boundary with branded UI)
21. ~~Wire dashboard to Supabase~~ — DONE (2026-03-01, profile + stats + activity from live services)
22. ~~Improve robots.txt~~ — DONE (2026-03-01, exclude auth/dashboard/settings/onboarding)
23. ~~Security headers in next.config.js~~ — DONE (2026-03-01, HSTS, X-Frame, Referrer-Policy, Permissions-Policy)
24. ~~Dynamic sitemap with Library content~~ — DONE (2026-03-01, ~190 URLs: 17 collections + 76 texts + 10 gates)
25. ~~Pre-render Library texts~~ — DONE (2026-03-01, generateStaticParams → 59 pages pre-rendered)
26. ~~Metadata for builder pages~~ — DONE (2026-03-01, world-builder, universe-builder, vision-board)
27. ~~Auth form accessibility~~ — DONE (2026-03-01, sr-only labels, aria-required, aria-label)
28. ~~Verify API key usage~~ — DONE (2026-03-01, chat uses GOOGLE_AI_KEY not service-role)
29. ~~Blog JSON-LD structured data~~ — DONE (2026-03-01, Article schema on all 6 blog posts)
30. ~~Extract shared blog data~~ — DONE (2026-03-01, DRY — lib/blog-data.ts, removed 300 LOC duplication)
31. ~~Fix blog XSS~~ — DONE (2026-03-01, replaced dangerouslySetInnerHTML with safe React rendering)
32. ~~Fix blog Chinese characters~~ — DONE (2026-03-01, 9-step protocol translated to English)
33. ~~Blog pagination accessibility~~ — DONE (2026-03-01, aria-labels, nav landmark, aria-current)
34. ~~JSON-LD structured data for 6 key page types~~ — DONE (2026-03-01, Academy/Library/Collections/Texts/Luminors/About)
35. ~~Vercel Web Analytics~~ — DONE (2026-03-01, @vercel/analytics installed, Analytics component in root layout)
36. ~~Discover page title SEO~~ — DONE (2026-03-01, improved from "Discover" to descriptive title)
37. ~~Dynamic blog sitemap~~ — DONE (2026-03-01, 6 blog posts from shared data module)
38. ~~JSON-LD for FAQ/Lore/Guardians/Pricing/Ecosystem~~ — DONE (2026-03-01, FAQPage + ItemList + Product schemas)
39. ~~Lazy-load react-syntax-highlighter~~ — DONE (2026-03-01, CodeBlock component, ~150KB savings)
40. ~~Lazy-load graph visualization~~ — DONE (2026-03-01, dynamic import with ssr:false, ~150KB savings)
41. ~~Lazy-load onboarding steps~~ — DONE (2026-03-01, React.lazy for steps 2-5)
42. ~~All PARTIAL pages verified~~ — DONE (2026-03-01, contact/platform/roadmap/install/workflows/user-flows/arcanea-code/arcanea-os/arcanea-vault all have metadata+loading)
43. ~~JSON-LD for guardian detail + academy gate pages~~ — DONE (2026-03-01, Article+Breadcrumb for 10 guardians, Course+Breadcrumb for 10 gates)
44. ~~Fix 25 broken internal links~~ — DONE (2026-03-01, /signup→/auth/signup, /register→/auth/signup, pruned sub-route links)
45. ~~Remove 4 duplicate navbars~~ — DONE (2026-03-01, FAQ/pricing/changelog/install had custom nav duplicating global Navbar)
46. ~~Canonical URL~~ — DONE (2026-03-01, alternates.canonical in root layout metadata)
47. ~~Remove debug console.log~~ — DONE (2026-03-01, chat-imagine gate invocation)

### P2 — Feature Expansion
48. Integrate v0 Onboarding wizard (M008-T1)
49. Integrate v0 Settings page (M005-T2)
50. Academy course system (M006-T5)
51. World/Universe builder backends
52. Community features — forums, groups (M007)
53. Cloudflare Stream integration (M002)

### P3 — Cleanup & Optimization
54. ~~Prune 15+ redirect-only pages~~ — DONE (2026-03-01, 16 routes deleted)
55. Core Web Vitals audit (M009-T1)
56. WCAG 2.2 accessibility audit (M009-T3)
57. Remove `/workspace` or build it out
58. TypeScript strict mode cleanup
59. Lazy-load framer-motion on heavy pages (28 pages import it)

---

## Cross-Cutting Concerns

### Security
- ~~RLS on arcanea table~~ — FIXED (2026-03-01)
- ~~Overly permissive feedback policy~~ — FIXED (2026-03-01)
- ~~auth_rls_initplan performance~~ — FIXED (2026-03-01)
- ~~Gemini chat uses service-role key~~ — VERIFIED OK (2026-03-01, uses GOOGLE_GENERATIVE_AI_API_KEY, not service-role)
- ~~11 API routes used old `lib/supabase.ts`~~ — FULLY MIGRATED (2026-03-01), file deleted, 0 imports remaining
- ~~Settings page doesn't persist~~ — FIXED (2026-03-01, wired to Supabase profiles)
- ~~Session helper hardcoded localhost~~ — FIXED (2026-03-01, clean URL construction)
- Enable leaked password protection in Supabase Dashboard
- Security headers added to next.config.js (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)

### Design System
- Liquid glass system fully deployed (7 tiers)
- Opacity hierarchy standardized across 177 files
- Icon aliases using wrong Phosphor icons (3 instances)
- ~~`font-cinzel` references~~ — VERIFIED: 0 remaining (2026-03-01)

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

### v1.7.0 (2026-03-10) — Database Infrastructure + Accessibility

- **M006 Creator Tools: 15% → 55%**
  - Created `reading_progress` table in production Supabase with RLS policies — Library tracking now has a real backend
  - Created 6 Prompt Books tables (`pb_collections`, `pb_prompts`, `pb_tags`, `pb_prompt_tags`, `pb_prompt_versions`, `pb_templates`) with RLS, triggers, auto-count functions
  - Verified Studio save pipeline is complete: `/api/studio/save` (images) + `/api/creations` (text/code) → Supabase Storage + DB
  - All 3 persistence features (creations, reading progress, prompt books) now have full frontend + API + DB — only blocked by M001 auth

- **M009 Performance: 60% → 70%**
  - Fixed chat textarea missing `aria-label` (WCAG 2.2)
  - Fixed opengraph-image.tsx missing `alt` attribute
  - Added `profile/layout.tsx` with metadata (was the only key page missing it)
  - Verified LazyMotion coverage on all active-path pages
  - Verified SEO metadata present on all key routes via layout.tsx

- **Quality verification**: Zero slop, zero specialist refs, zero console.log in components, proper heading hierarchy

### v1.6.0 (2026-03-10) — M010 Completion + Quality Deep Dive

- **M010 Language Transformation: 100% COMPLETE**
  - Navbar: Removed "Luminors" link (violates progressive disclosure) — now 5 clean links
  - Homepage: Fixed 3 remaining "Guardian" → "Luminor" in below-fold (gallery desc, lore desc, pathways)
  - Homepage: Replaced 2 dead /world-builder pathway links with working /studio and /chat routes
  - Homepage: "Design Games" pathway → "Chat with a Luminor" (links to working page)
  - Homepage: "specialized writing partners" → "Luminor writing partner"
  - Product pages: Full Guardian→Luminor sweep on arcanea-code, arcanea-os, arcanea-vault, ecosystem
  - Community/Blog/Changelog: Full Guardian→Luminor sweep
  - Dashboard: "Intelligence" → "Luminor" on quick actions and companion card
  - Chat demo: Cleaned greeting (removed "!" and overwrought tone)
  - Discover: Fixed "guardian" → "Luminor" in showcase data
  - Academy: Fixed "transcendence" slop, cleaned Guardian labels
  - API chat route: "specialist" → "Luminor" in comments
- **Security hardening (next.config.js)**:
  - Removed wildcard `**` image hostname — restricted to Supabase CDN + OAuth avatars
  - Added `poweredByHeader: false`
  - Added AVIF/WebP image format optimization
- **Zero "specialist" remaining** in app or components (grep-verified)
- **Zero anti-slop phrases** remaining (unleash, harness, delve, tapestry, embark — grep-verified)
- **Accessibility audit**: WCAG 2.2 review of 7 key pages (in progress)
- **SEO audit**: Metadata, heading hierarchy, structured data review (in progress)
- **Performance**: All Tier 1 pages use LazyMotion (verified), no unoptimized `motion` imports in active path

### v1.3.0 (2026-03-07) — Deep M010 Quality Sprint
- M010 Language Transformation: 90% → 98% — comprehensive anti-slop sweep
- Navbar: 5 labels simplified from lore-heavy to clean (Explore, Create, Chat, Library, Academy)
- Footer: 4 columns restructured, removed duplicate links, "Kingdom of Light" → "Creative Intelligence"
- Root layout: metadata cleaned (no Guardians/Luminors on first-contact SEO)
- Homepage below-fold: PATHWAYS/FEATURES/FAQ all cleaned, "10 Luminor Guides" → "10 AI Specialists"
- HowItWorks + CTA: "Canon-backed" → professional copy, Benefits list rewritten
- Chat page: "Choose an Luminor" → "Choose a specialist" (grammar + M010)
- FAQ page: fixed 16→10 count inconsistency, 4 Luminor→specialist replacements
- Contact/Changelog/Hub: all first-contact Luminor references cleaned
- Hero chat box: "Continue in studio" → "Continue in chat" with prompt passthrough
- Pricing: "Start Ascending" → "Get Started"
- Install: "Create Something Amazing" → "Start Creating"
- 2 new loading.tsx files (design-lab, imagine)
- 14 legacy color files flagged for purge (#7fffd4, #8b5cf6)
- Zero AI slop remaining (grep-verified across entire app directory)

### v1.2.0 (2026-03-01) — v0 Premium UI + Milestones Sprint
- 5 new milestones created: M005 (Premium UI v0), M006 (Creator Backend), M007 (Community), M008 (Onboarding), M009 (Performance)
- 4 v0 premium UI components generated: Studio, Settings, Onboarding, Gallery
- Feedback route build error fixed (untyped table bypass)
- Legacy API migration: 5 routes migrated to SSR-safe Supabase client
- Settings page wired to Supabase profiles (avatar, preferences, metadata JSONB)
- Chat hook enhanced with sessionId tracking and sessions sidebar
- 17 new loading.tsx files created (98 total)
- 2 Supabase RLS policies tightened
- Build: PASSING (201 routes, 0 errors)

### v1.1.0 (2026-03-01) — Massive Action Session
- Academy Gates system built: 10 individual gate pages, lib/gates.ts data layer
- Chat persistence: chat_sessions + chat_messages tables, chat-service.ts, Supabase RLS
- 32 new loading.tsx files (81 total across platform)
- 12 new metadata layout.tsx files
- All lore pages enriched with deep narrative content
- 3 Supabase security advisories resolved (RLS fixes + index)
- Build: 201 routes, 0 errors — pushed to both remotes
- P0 items 3-6 completed, P1 items 7-8 completed
- Commit: c6538cb4

### v1.0.0 (2026-02-28)
- Initial creation from comprehensive audit
- 111 pages mapped with status, needs, and priority
- 4 milestones tracked with task-level detail
- Priority queue established (20 items)
- Agent routing table defined
- Cross-cutting concerns documented
