# Findings: Arcanea — March 7, 2026

## Design System v5.0 — COMPLETE (Supersedes Wave 10 findings)

All issues from the previous findings.md are RESOLVED:
- Primary color: Cyan #00bcd4 (not gold, not violet)
- Fonts: Space Grotesk (display) + Inter (body) + JetBrains Mono (code)
- Legacy colors fully purged: 251 replacements across 46 files (Mar 7)
- Glass morphism: 7-tier system on near-black base rgba(9,9,11,...)

## Today's Key Discoveries

### 1. Progressive Vocabulary System EXISTS and Works
- File: `apps/web/lib/vocabulary.ts` (101 lines)
- 5 tiers: newcomer -> explorer -> initiate -> adept -> luminor
- Maps to gates_open count (0, 1-2, 3-4, 5-8, 9-10)
- Renames UI labels progressively: "Chat" -> "Companion" -> "Guardian" -> "Council"
- NOT wired to any UI yet — needs auth (gates_open from user profile)

### 2. Reading Progress Hook EXISTS and Works
- File: `apps/web/hooks/use-reading-progress.ts`
- Tracks: text_id, collection_id, progress (0-100), completed_at, last_position
- Uses Supabase `reading_progress` table (migration exists but types not generated)
- TypeScript workaround: cast to `any` for missing types
- NOT wired to Library UI yet — needs auth

### 3. Council System — Full Feature, M010 Conflict
- 3 routes: /council, /council/convening, /council/create-luminor
- 8 components in `components/council/`
- Service layer: `lib/council/service.ts` (396 lines)
- Types: `lib/council/types.ts` (207 lines)
- DB: `luminor_councils`, `council_seats`, `council_convenings` tables
- ON NAVBAR (line 15) — violates M010 progressive disclosure
- Should be dashboard-only, auth-gated, appears at "adept" vocabulary tier

### 4. Hero Section — 4 Iterations, Needs Lock
- Current: Chat-first hero with live AI input, dynamic H1
- Previous attempts: editorial, lore-removal, music player, glowcards
- Navbar changes reverted to isolate hero work
- Risk: More iterations without user data = wasted effort

### 5. Route Count Reduction
- Previous: ~185 routes
- Pruned today: 14 stub pages (chess, universe-builder, vision-board, user-flows, design-labs)
- Added today: 3 council routes
- Current: ~174 routes, 106 page.tsx files

### 6. LazyMotion Optimization
- File: `apps/web/lib/motion.tsx`
- Framer Motion: 33kB -> 7kB initial bundle
- Uses `domAnimation` features (not full `domMax`)
- Applied globally — all motion components benefit

### 7. Legacy Cleanup — 7+ Components Deleted
- hero-section.tsx, hero-v2.tsx, hero-v3.tsx, hero-premium.tsx
- features-premium.tsx, luminor-showcase-premium.tsx, pricing-premium.tsx
- These were NOT in the v3 render path but bloated the codebase

### 8. M001 Auth — Still the Single Point of Failure
- 3 env vars on Vercel = 5 minutes of user action
- Blocks: Council, reading progress, vocabulary tiers, studio saves, gallery social, onboarding completion, prompt books persistence
- Every new feature built without auth is technical debt waiting to activate

### 9. Supabase Types Drift
- `reading_progress` table exists but not in generated TypeScript types
- `council` tables (3) exist but not in generated types
- Need to run `npx supabase gen types typescript` after migrations
- Current workaround: cast to `any` (fragile)

### 10. Content Pipeline Assessment
- 62 texts across 17 collections (filesystem-based)
- 6 blog posts (manual, no publishing pipeline)
- No Academy courses built yet (routes planned)
- Council adds 2 lore documents (LUMINOR_COUNCIL.md, COUNCIL_RITUAL_GUIDE.md)
