# Arcanea Master Plan — Central Orchestrator

> **Last Updated**: 2026-03-01
> **Version**: 1.1.0
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
| Milestones Active | 10 (M001-M010) | M010 (Language) → M001 (Auth) → M008 → M005 |
| Vercel Build | PASSING | Maintain green |
| Last Deploy | 2026-03-01 | f3573c00 |
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
  - [x] ~~Migrate legacy API routes~~ — DONE (lib/supabase.ts deleted, 0 imports remain)
  - [ ] E2E auth test (blocked on env vars)
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

### M006: Creator Tools Backend (0%) — P1
- **Guardian**: Draconia (Fire Gate)
- **Target**: 2026-03-22
- **Scope**: Creation pipeline, AI generation APIs, Prompt Books persistence, Reading progress, Course system, Gallery social
- **Depends on**: M001, M005
- **Files**: `m006-creator-tools-backend.arc`

### M007: Community & Social (0%) — P2
- **Guardian**: Ino (Unity Gate)
- **Target**: 2026-03-29
- **Scope**: Creator discovery, social interactions, forums, events/challenges, collaboration
- **Depends on**: M001, M006
- **Files**: `m007-community-social.arc`

### M008: Onboarding & Conversion (75%) — P0
- **Guardian**: Maylinn (Heart Gate)
- **Target**: 2026-03-10
- **Scope**: Onboarding wizard integration, welcome dashboard, activation loops, analytics, auth UX
- **Depends on**: M005
- **Files**: `m008-onboarding-conversion.arc`

### M009: Performance & Production Polish (45%) — P1
- **Guardian**: Elara (Shift Gate)
- **Target**: 2026-03-22
- **Scope**: Core Web Vitals, SEO, accessibility, error handling, production hardening, cleanup
- **Depends on**: M005, M008
- **Files**: `m009-performance-polish.arc`

### M010: Language & Experience Transformation (0%) — P0
- **Guardian**: Alera (Voice Gate)
- **Target**: 2026-03-08
- **Strategy**: `.arcanea/strategy/LANGUAGE_EXPERIENCE_STRATEGY.md`
- **Principle**: Creation first. Mythology as earned discovery.
- **Scope**: Rewrite all user-facing copy across the platform. Replace jargon-first, lore-dump UX with progressive disclosure that respects viewer intelligence. Implement hidden depth system (color shifts, progressive vocabulary, Easter eggs).
- **Depends on**: Nothing — this is THE priority
- **Phases**:
  - [ ] Phase 1: Nav + Homepage copy transformation
  - [ ] Phase 2: Onboarding copy transformation
  - [ ] Phase 3: Studio + Dashboard UX simplification
  - [ ] Phase 4: Chat + Discover + Library refinement
  - [ ] Phase 5: Hidden depth system (progressive vocabulary, color shifts, Easter eggs)
  - [ ] Phase 6: Glossary and reference refinement
  - [ ] Update voice.yaml with new anti-slop principles
  - [ ] Update ARCANEA_BRAND_GUIDELINES.md

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
- **Status**: PARTIAL
- **Component**: Client
- **Metadata**: Via layout
- **Loading**: Yes
- **Current**: Luminor selection grid, filters by team, v0 chat components (8 files), sessions API (GET/POST with Supabase + in-memory fallback)
- **Needs**:
  - [x] Chat sessions API (GET/POST) — DONE (Mar 1)
  - [ ] Chat history persistence (Supabase messages table)
  - [ ] Streaming responses (Vercel AI SDK)
  - [ ] Multi-turn context window management
- **Priority**: P0 — core product feature

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
1. **Language & Experience Transformation (M010)** — Rewrite nav, homepage, onboarding, studio, dashboard copy. Kill jargon-first UX. Progressive disclosure. Hidden depth system. See `.arcanea/strategy/LANGUAGE_EXPERIENCE_STRATEGY.md`
2. Set Supabase env vars on Vercel (M001 blocker)
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
