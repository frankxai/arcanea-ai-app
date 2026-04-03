# Arcanea Master Plan — Central Orchestrator

> **Last Updated**: 2026-04-03 (MCP Product + Luminor Agent System Sprint)
> **Version**: 2.2.0
> **Guardian**: Shinkami (Source Gate)
> **Status**: Active — MCP Phase 1+2 Complete, Luminor System Built, Publishing Next

This is the **single source of truth** for the entire Arcanea platform. Every agent, skill, command, and session MUST consult this document before making architectural decisions. It aggregates state from `.arcanea/projects/`, `task_plan.md`, `progress.md`, and live deployment data.

---

## Quick State Dashboard

| Metric | Value | Target |
|--------|-------|--------|
| Total Pages | ~190 (+2 new: /ops/agents, /contribute) | 80 (prune stubs) |
| Pages with Metadata | ~79 (+2) | 100% |
| Pages with loading.tsx | ~81 (+32) | 100% of dynamic pages |
| Milestones Active | 11 (M001-M010 + M006) | M001 (Auth) → M008 (Onboarding) → M006 (Creator Tools) → M009 (Polish) |
| Vercel Build | PASSING (3 build bugs fixed: layout dynamic, phosphor Stop dup, leaderboard JSX) | Maintain green |
| Last Deploy | 2026-03-30 | Ops Center + Performance + Agent Certification + Creations Gallery |
| Live URL | arcanea.ai | arcanea.ai |
| 7-Gap Status | 5/7 closed, 2 blocked (npm publish needs creds, Supabase needs dashboard) | 7/7 |
| Agent Framework | evaluation-framework.ts, agent-registry.ts (38 agents), reasoning-bank.ts | Learning loop |
| Studio Decomposition | 1644L → 496L main + 6 components (all < 300L) | Under 500L |
| Quality Gates | CI workflow + canon-lint + pre-commit hooks | Automated |
| Cross-Repo | repos.json registry (7 repos) + sync script + health check | Multi-repo ops |
| **Faction Architecture** | **22 docs, 202K words, 80+ characters, 42/42 build** | **COMPLETE** |
| **Naming Audit** | **4/4 critical collisions FIXED, pushed to main** | **CLEAN** |
| **Council Grade** | **A- overall (A+ characters, A+ villains, C naming → FIXED)** | **Franchise-ready** |

---

## NEW: MCP Product + Luminor Sprint Results (2026-04-02/03)

### MCP Server — Product-Ready
| Achievement | Status |
|-------------|--------|
| SDK upgraded 0.5.0 → 1.29.0 | COMPLETE |
| 34 tools via registerTool() + Zod schemas | COMPLETE |
| HTTP/SSE dual-transport (cloud-ready) | COMPLETE |
| memory-mcp migrated from raw JSON-RPC → SDK 1.29 | COMPLETE |
| World Intelligence Engine (world_report, generate_conflict, weave_narrative) | COMPLETE |
| 79 dep vulnerabilities → 0 | COMPLETE |
| npm publish | BLOCKED (needs `npm login`) |

### Luminor Agent System — Operational
| Achievement | Status |
|-------------|--------|
| Engineering Kernel (CANONICAL prompt) | COMPLETE |
| 10 domain modules (github, frontend, backend, mcp, ops, security, test, research, lore) | COMPLETE |
| Spawn config (25+ agent types mapped) | COMPLETE |
| @arcanea/flow v0.1.0 package | COMPLETE |
| Proven: haiku+kernel = senior engineer output | VALIDATED |

### CI/Ops Hardened
| Achievement | Status |
|-------------|--------|
| Execution Law in AGENTS.md | COMPLETE |
| CI: npm rejection, .nvmrc check, typecheck blocks | COMPLETE |
| .nvmrc pinning Node 20 | COMPLETE |
| Linear synced: ARC-71 through ARC-78 | COMPLETE |

### In Progress (agents running)
- Blog post: "Mythology Engine as MCP Server"
- /docs/mcp developer documentation pages
- Luminor auto-injection Claude Code hooks
- World persistence (save_world/load_world)

---

## Faction Architecture Sprint Results (2026-03-30)

### Lore Documents (`.arcanea/lore/`)
| Document | Words | Grade | Status |
|----------|-------|-------|--------|
| FACTIONS.md | 4,500 | A | 8 origin classes, org hierarchy |
| CHARACTER_TEMPLATE.md | 2,500 | A+ | Ready for LOCKED promotion |
| VISUAL_DOCTRINE.md | 3,500 | A | Faction aesthetics, all houses |
| FLAGSHIP_TEAM.md + V2 | 12,000 | A | THE DAWNSWORN — 7 heroes |
| STARBOUND_CREWS.md | 8,000 | A- | 3 crews (Solara, Ninth Flame, Hollow Stars) |
| VOID_ASCENDANTS.md | 7,000 | A+ | 5 Heralds, Shadow Doctrine |
| GATE_TOUCHED_UNDERGROUND.md | 14,000 | A | 7 Havens, 15 mutant powers |
| STARLIGHT_CORPS_CODEX.md | 10,000 | A | 800 years of history, 6 sectors |
| STELLARIS.md | 7,000 | A+ | Franchise mascot, ready for LOCKED |
| LEAGUES_AND_ORDERS.md | 10,000 | A | 7 Leagues, 7 Radiant Orders |
| STORY_ENGINE.md | 8,000 | A | 5 arcs, 10 seeds, timeline |

### Strategy Documents (`.arcanea/strategy/`)
| Document | Grade | Status |
|----------|-------|--------|
| FRANCHISE_PRODUCTS.md | B+ | Product architecture, needs acquisition strategy |
| ECOSYSTEM_MAP.md | B- | 90-day roadmap too ambitious |
| OPS_ARCHITECTURE.md | A- | Immediately implementable |
| ACADEMY_AND_COMMUNITY.md | B | Needs existing community first |
| INTERCONNECTION_MAP.md | C+ | Reclassify as marketing/pitch material |

### Infrastructure
- `.github/workflows/ci.yml` — CI pipeline (lint, typecheck, build)
- `.github/workflows/canon-lint.yml` — Lore validation, blocks merge on canon violations
- 10 packages fixed: `@arcanea/core` dep `^0.1.0` → `workspace:*`
- `claude-arcanea` skills: `shift` → `starweave` (GateName alignment)
- Build: **42/42 packages PASS**

---

## WEEK SPRINT: March 31 — April 6

### P0: SHIP (blocks everything)
- [ ] **Supabase Dashboard config** — 15 min, Frank does manually
  - Site URL → `https://arcanea.ai`
  - Redirect URL → `https://arcanea.ai/auth/callback`
  - Enable Google + GitHub OAuth
- [ ] **E2E auth test** — verify full flow on production
- [ ] **Sentry + PostHog** — set API keys on Vercel (code already installed)

### P0: BUILD (highest leverage products)
- [ ] **Origin Class Quiz** — `/quiz` page, 8 origin classes, viral mechanic
  - Inputs: FACTIONS.md origin classes
  - Output: shareable result card with faction assignment
  - Conversion: quiz result → account creation
- [ ] **Factions Codex page** — `/factions` or `/codex/factions`
  - Display 8 origin classes with VISUAL_DOCTRINE aesthetics
  - Link to CHARACTER_TEMPLATE for "create your character"

### P1: CONTENT (faction launch sequence)
- [ ] **Faction reveal social campaign** — 1 origin class per day for 8 days
  - Sequence: Arcans → Gate-Touched → Bonded → Synths → Awakened → Celestials → Voidtouched → Architects
  - Each: image + 3-line description + "Which one are you?"
- [ ] **Stellaris reveal** — standalone visual + origin story excerpt
- [ ] **Dawnsworn team reveal** — lineup poster concept

### P1: OPS
- [ ] **npm publish** — 13 packages (needs npm credentials)
- [ ] **Promote to LOCKED** — CHARACTER_TEMPLATE.md, STELLARIS.md

### P2: NEXT WAVE
- [ ] Build Starbound Crews V2 (5 crews expanded — was blocked by usage limit)
- [ ] Fix voice-under-pressure progressions (Narrative audit top recommendation)
- [ ] Merge INTERCONNECTION_MAP into ECOSYSTEM_MAP (redundancy fix)

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

### M006: Creator Tools Backend (75%) — P1
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
  - [x] Course system — 5 courses (Foundation, Flow, Fire, Voice, Vision), 20+ lessons, `/academy/courses` listing + `/academy/courses/[slug]` detail pages, JSON-LD, loading states, error boundaries, sitemap entries
- **Files**: `m006-creator-tools-backend.arc`

### M007: Community & Social (0%) — P2
- **Guardian**: Ino (Unity Gate)
- **Target**: 2026-03-29
- **Scope**: Creator discovery, social interactions, forums, events/challenges, collaboration
- **Depends on**: M001, M006
- **Files**: `m007-community-social.arc`

### M008: Onboarding & Conversion (90%) — P0
- **Guardian**: Maylinn (Heart Gate)
- **Target**: 2026-03-10
- **Scope**: Onboarding wizard integration, welcome dashboard, activation loops, analytics, auth UX
- **Depends on**: M005
- **Progress**:
  - [x] Auth guard wired
  - [x] Orchestrator working (5-step wizard flow)
  - [x] Creation step wired to real AI (Google Gemini via Vercel AI SDK, /api/create — edge runtime, 10s timeout, curated Guardian-specific mock fallback when API key absent)
  - [ ] Activation loop analytics
- **Files**: `m008-onboarding-conversion.arc`

### M009: Performance & Production Polish (99%) — P1
- **Guardian**: Elara (Starweave Gate)
- **Target**: 2026-03-22
- **Scope**: Core Web Vitals, SEO, accessibility, error handling, production hardening, cleanup
- **Depends on**: M005, M008
- **Progress**:
  - [x] Error boundaries added (error.tsx on key routes)
  - [x] LazyMotion domAnimation migration: only 3 files legitimately need domMax (navbar, profile-view, how-it-works — all use layoutId). All others converted to domAnimation.
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
  - [x] Chat stream parser: fixed Vercel AI SDK 0:"" protocol display bug on /chat (Mar 10)
  - [x] Pricing comparison table: 10→16 Luminors for Creator/Studio (Mar 10)
  - [x] About page metadata: Ten→Sixteen intelligences (4 places) (Mar 10)
  - [x] Welcome/onboarding/contact/v4 copy: Ten→Sixteen intelligences (Mar 10)
  - [x] FAQ: fixed Spark plan (2 Luminors/50 msgs → 3/100), Studio plan description accuracy (Mar 10)
  - [x] Contact FAQ: accurate pricing info, Apprentice to Luminor rank (Mar 10)
  - [x] Academy: Gate 10 Godbeast Amaterasu→Source (canonical fix) (Mar 10)
  - [x] domMax→domAnimation: 4 more components (navigation, creation-gallery, BreathingGuide, footer) (Mar 10)
  - [x] Anti-slop verification: zero banned patterns in user-facing content confirmed (Mar 10)
  - [x] domMax→domAnimation: 6 more routes (landing hero, gate-quiz, assessment, studio/image, graph-viz, luminors-experience) — ~8kB/route savings (Mar 10)
  - [x] WCAG 2.4.7 focus rings: added focus:ring-2 to 10 inputs across FAQ, chat, companions, blog, hub, changelog, character-book, council (Mar 10)
  - [x] WCAG 1.3.1 aria-labels: 5 unlabeled search/email inputs (FAQ, hub/updates, changelog, hub/guides) (Mar 10)
  - [x] Dead code: removed duplicate Inter font load (--font-body unused variable) (Mar 10)
  - [x] Manifest path: /site.webmanifest → /manifest.webmanifest (Mar 10)
  - [x] Server component conversion: roadmap, arcanea-vault, arcanea-os (removed "use client" + artificial 800ms loading delays + dead LoadingState/Sparkles code) (Mar 10)
  - [x] Removed artificial 800ms loading delay from contact page (Mar 10)
  - [x] Deep count sweep: 10→16 Luminors/intelligences across 15+ files (companions, install, luminor-intelligence 4x, opengraph-image, home-content, hero-v3, v3/variations 6x) (Mar 10)
  - [x] Anti-slop: "seamlessly"→"naturally" in assessment quiz (Mar 10)
  - [x] Added missing metadata: council/create-luminor/layout.tsx, v3/layout.tsx (Mar 10)
  - [x] WCAG focus rings: navbar desktop links, Enter Studio CTA, desktop/mobile logos (Mar 10)
  - [x] WCAG focus rings: profile edit (5 form fields — fixed outline-none → focus:outline-none) (Mar 10)
  - [x] WCAG focus rings: chat-input textarea, imagine PromptInput, comment-section input (Mar 10)
  - [x] Navbar: mobile logo changed from inert <div> to <Link> (Mar 10)
  - [x] Navbar: /council link removed (M010 progressive disclosure — deep page only) (Mar 10)
  - [x] motion→m migration: comment-section, imagine PromptInput (LazyMotion compat) (Mar 10)
  - [x] Link audit: all footer links, nav links, auth links verified existing (Mar 10)
  - [x] Anti-slop: 12x "begin your journey" replaced with direct CTAs across 10 files (Mar 10)
  - [x] Anti-slop: "extraordinary" in blog-data, "seamless" in acos, exclamation marks in FAQs (Mar 10)
  - [x] Anti-slop: "Your companion awaits" → actionable copy on platform/contact (Mar 10)
  - [x] "16 Creative Guides" → "16 Luminors" in v3-below-fold (Mar 10)
  - [x] Dead code: deleted unused components/layout/navigation.tsx (zero imports) (Mar 10)
  - [x] Error boundaries: added error.tsx to activity, dashboard, community, imagine (Mar 10)
  - [x] Metadata: added layout.tsx with metadata for chat-demo, components pages (Mar 10)
  - [x] Broken link: /community/create/new → /studio (route did not exist) (Mar 10)
  - [x] WCAG: role="alert" on chat error banner, aria-live="polite" on message container (Mar 10)
  - [x] WCAG focus rings: step2-creator-type, step3-guardian (2), step4-creation textarea (Mar 10)
  - [x] WCAG focus rings: 5 studio textareas (text, image, code, music modes) (Mar 10)
  - [x] WCAG focus rings: studio/image select + input, lore/library search input (Mar 10)
  - [x] WCAG focus rings: 9 prompt-books inputs/selects across 6 files (Mar 10)
  - [x] WCAG focus rings: completed all bare focus:outline-none — 21 files fixed (studio creation-panels 5, prompt-books 12, chat InputArea/Sidebar, council ConveningFlow, templates 2, v3 hero-chat-box) (Mar 10)
  - [x] Anti-slop: "begin your journey" on glossary, "Your imagination awaits" on imagine page (Mar 10)
  - [x] Error boundaries: added error.tsx to companions, discover, feedback, lore, profile, prompt-books, settings (Mar 10)
  - [x] WCAG audit complete: only 2 bare focus:outline-none remain (library modal container, headless UI Menu.Items — both containers, not interactive elements)
  - [x] Naming v2 sweep: Luminor→companion on 13 first-contact surfaces (chat, dashboard, hub, workspace, vault, code, os, acos, blog, music) (Mar 10)
  - [x] Gallery cleanup: removed LuminorShowcase, deleted luminor-agents.ts, CDN-only images (Mar 10)
  - [x] Deleted dead files: home-content.tsx, gallery/luminors/page.tsx (Mar 10)
  - [x] Icon barrel removal: 4.5MB savings by eliminating barrel re-export (2026-03-27)
  - [x] Syntax highlighter lazy-loading (2026-03-27)
  - [x] next/image for homepage images (2026-03-27)
  - [x] React.memo on MessageBubble, ThinkingSection, ImageGrid (2026-03-30)
  - [x] Ops Center dashboard built (2026-03-30)
  - [x] Ops component library added (2026-03-30)
  - [x] Intelligence system fixes (SIS, hooks, statusline v6) (2026-03-30)
  - [x] ACOS v11 installed (2026-03-30)
  - [x] Bootstrap hook upgraded to v3 (2026-03-30)
  - [x] .arcanea/ directories scaffolded (12 directories) (2026-03-30)
  - [x] Pickup Plan created (2026-03-30)
  - [x] Session Intelligence System (SIS) operational (2026-03-30)
  - [x] TS types, missing icons, accessibility fixes (code review pass) (2026-03-30)
  - [x] Agent Certification page built (dual-track for humans and AI agents) (2026-03-30)
  - [x] /creations gallery page — user's saved creations display (2026-03-30)
  - [ ] Core Web Vitals audit (Lighthouse — cannot run locally in WSL2)
- **Files**: `m009-performance-polish.arc`

### M010: Language & Experience Transformation (100%) — COMPLETE
- **Guardian**: Alera (Voice Gate)
- **Target**: 2026-03-08 — COMPLETED 2026-03-10
- **Strategy**: `.arcanea/strategy/LANGUAGE_EXPERIENCE_STRATEGY.md`
- **Principle**: Creation first. Mythology as earned discovery. Companions by proper name. Luminor = rank only. Guardian = Gate-keeper role only.
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
  - [x] Build `/academy/courses/[slug]` dynamic route — DONE (5 courses, 20+ lessons, pre-rendered)
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
| `/academy/courses` | LIVE | 5 courses, difficulty badges, prerequisites, grid layout |
| `/academy/courses/[slug]` | LIVE | 5 pre-rendered courses, inline lessons, JSON-LD, prev/next nav |

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
| `/research` | LIVE | NEW (2026-03-24): Ecosystem showcase, tech stack, Intelligence OS |
| `/ecosystem` | LIVE | UPDATED (constellation map with 19 interactive nodes) |
| `/vision` | LIVE | NEW (2026-03-24): Six Layers, Creator Journey, Guardians, Open Source Philosophy |
| `/architecture` | LIVE | NEW (2026-03-24): 6-tab interactive ReactFlow (ecosystem, intelligence, memory, agents, roadmap, business) |
| `/about` | LIVE | None |
| `/pricing` | LIVE | UPDATED (credits model: Free / Credits $5-49 / Forge $29/mo) |
| `/faq` | LIVE | None |
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
| `/companions` | LIVE | Design system v5 aligned (Mar 10) |
| `/companions/forge` | LIVE | NEW: 3-step forge flow, 16 archetypes (Mar 10) |
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
13. ~~Reading progress tracking in Library (M006-T4)~~ — DONE (hook, tracker, badges, progress bars all wired)
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
50. ~~Academy course system (M006-T5)~~ — DONE (5 courses, 20+ lessons, 2026-03-10)
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
| Testing | `tester` | Starweave | Elara |
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

### v1.9.0 (2026-03-30) — Operations Infrastructure + Performance + Milestone Tracking

- **M009 Performance: 99% (near-complete)**
  - Removed 4.5MB icon barrel re-export — major bundle size reduction
  - Lazy-loaded syntax highlighter for code blocks
  - Converted homepage images to next/image
  - React.memo optimization on MessageBubble, ThinkingSection, ImageGrid components
  - TS types, missing icons, and accessibility fixes (code review pass)
  - Statusline v6 fixed

- **Operations Infrastructure**
  - Ops Center dashboard built (`/ops`) with component library and data layer
  - ACOS v11 installed with bootstrap hook v3
  - Session Intelligence System (SIS) operational
  - .arcanea/ directories scaffolded (12 directories)
  - Pickup Plan created for session continuity

- **New Pages**
  - `/creations` — User's saved creations gallery
  - `/academy/certification` — Agent Certification page (dual-track for humans and AI agents)
  - `/ops` — Ops Center dashboard

- **Milestone Tracking (T3-1)**
  - Created 6 standalone `.arc` milestone tracking files in `.arcanea/projects/milestones/`
  - M001, M003, M005, M006, M008, M009 all have task-level detail extracted from MASTER_PLAN

- **Recent Commits** (2026-03-27 to 2026-03-30):
  - `a348e854c` feat(academy): Agent Certification page
  - `ea1dc77c0` perf: React.memo on chat components
  - `7611f185e` feat(ops): ops component library and data layer
  - `fedec40bf` feat(ops): Ops Center dashboard, intelligence fixes, statusline v6
  - `54dd8f30b` fix(quality): TS types, missing icons, accessibility
  - `7e1e37739` perf: 4.5MB icon barrel removal, lazy-load syntax highlighter, next/image
  - `060a00113` feat(creations): /creations gallery page
  - `1a0f48112` feat(platform): Studio upgrade, Gallery polish, Imagine advanced features
  - `3cd3c2623` fix(lore): replace Hz frequency labels with poetic taglines
  - `83171a85d` polish(library): gradient tab navigation, Chronicles link

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
