# Arcanea Planning — Wave 9 Assessment

> Generated: 2026-02-27 | Guardian: Shinkami | Gate: Source

---

## Current State — The Numbers

| Metric | Count | Notes |
|--------|-------|-------|
| **Pages (page.tsx)** | 111 | Full app router coverage |
| **API Routes (route.ts)** | 30 | 11 need SSR migration |
| **Loading Skeletons** | 48 | Good Suspense coverage |
| **UI Components** | 141 | Rich component library |
| **Supabase Tables** | 7 | profiles, creations, collections, collection_items, likes, follows, activity_log |
| **Storage Buckets** | 4 | avatars, creations, thumbnails, arcanea-gallery |
| **Applied Migrations** | 5 | Foundation + fixes + optimizations |
| **Database Services** | 5 | profile, creation, like, follow, activity |
| **Published npm Packages** | ~28 | Across @arcanea/* namespace |
| **Security Advisories** | 0 | All cleared |

---

## Milestone Status

### M001: Supabase Auth & Storage — 80% (was 60%)

**What we built this session:**
- 7 tables with full RLS + performance-optimized policies
- Auto-generated TypeScript types from live schema
- AuthProvider migrated to SSR-safe pattern
- Profile bootstrap fixed for real schema
- 5 database services (profile, creation, like, follow, activity)
- 3 new collection API routes (CRUD + items)
- Profile system (redirect → view → edit with avatar upload)
- Settings page, activity feed, chat auth wiring
- Gallery rewritten to query creations table
- Like count triggers + view count RPC
- Onboarding persistence to Supabase

**Remaining (4 tasks):**

| # | Task | Blocker | Priority |
|---|------|---------|----------|
| 1 | **Sync repos** — `arcanea-records` → `arcanea-ai-app` (Vercel watches wrong repo) | None | P0 |
| 2 | **Configure OAuth** — Google + GitHub providers in Supabase dashboard | Manual (dashboard) | P0 |
| 3 | **Test auth E2E** — signup → confirm → callback → profile on arcanea.ai | Needs 1+2 | P0 |
| 4 | **Delete orphan** — `arcanea-ai-app` (no x) Vercel project | Manual (dashboard) | P1 |

### M003: Memory System — 75% (unchanged)

| # | Task | Status |
|---|------|--------|
| 1 | StarlightVaults core | Done |
| 2 | FileBackend + word index | Done |
| 3 | CLI binary | Done |
| 4 | MEMORY.md bridge | Done |
| 5 | 38/38 tests | Done |
| 6 | @arcanea/memory-mcp server | Pending |
| 7 | `starlight horizon share` | Pending |
| 8 | Web API at arcanea.ai | Blocked by M001 |

### M004: PM Toolkit — 40% (unchanged)

| # | Task | Status |
|---|------|--------|
| 1 | .arc format schema | Done |
| 2 | .nea tokenizable artifacts | Done |
| 3 | Directory structure | Done |
| 4 | Initial milestone files | Done |
| 5 | Progress log system | In Progress |
| 6 | CLI parser for .arc files | Pending |
| 7 | Terminal visualization | Pending |
| 8 | Linear migration | Pending |

### M002: Cloudflare Stream — 0% (deferred)

Not started. Target: W14.

---

## Critical Issues Found (Audit)

### 1. CRITICAL: Repo Misalignment (Vercel won't deploy our changes)

**Problem:** Local repo pushes to `frankxai/arcanea-records` but Vercel project `arcanea-ai-appx` watches `frankxai/arcanea-ai-app`.

**Impact:** All 128 files we committed + pushed are NOT deploying to arcanea.ai.

**Fix options:**
- A) Change Vercel to watch `arcanea-records` instead
- B) Add `arcanea-ai-app` as a second remote and push there
- C) Mirror `arcanea-records` → `arcanea-ai-app`

### 2. CRITICAL: 11 API Routes Using Old Supabase Singleton

**Problem:** Routes import `supabaseServer` from `@/lib/supabase` (no cookie handling) instead of `createClient()` from `@/lib/supabase/server`.

**Impact:** Silent auth failures — user sessions don't refresh in Route Handlers.

**Files:**
- `api/bonds/progress/route.ts`
- `api/bonds/[userId]/memories/route.ts`
- `api/bonds/[userId]/route.ts`
- `api/bonds/[userId]/[luminorId]/route.ts`
- `api/collections/route.ts`
- `api/collections/[id]/items/route.ts`
- `api/collections/[id]/route.ts`
- `api/creations/route.ts`
- `api/creations/[id]/route.ts`
- `api/profile/[userId]/route.ts`
- `api/profile/[userId]/stats/route.ts`

### 3. HIGH: Gemini Chat Route Using Service Role Key

**File:** `api/ai/chat/route.ts:36-40`
**Problem:** Creates raw Supabase admin client in a user-facing route. Should use SSR-safe `createClient()`.

### 4. MEDIUM: Health Check Hardcoded

**File:** `api/health/route.ts:34`
**Problem:** `database: true` is hardcoded. DB is now live — should do real connectivity check.

### 5. MEDIUM: Type Workarounds in like-service-new.ts

**Problem:** Multiple `as any` / `as unknown` casts because generated types don't include `likes` table properly.
**Fix:** Regenerate types from live schema.

---

## Recommended Next Priorities

### P0 — Ship Auth to Production (1-2 hours)

1. **Fix repo alignment** — push to `arcanea-ai-app` or reconfigure Vercel
2. **Migrate 11 API routes** to SSR-safe Supabase client
3. **Fix Gemini chat route** — remove service role key usage
4. **Configure OAuth** in Supabase dashboard (Google + GitHub)
5. **Verify deployment** succeeds on Vercel
6. **Test auth E2E** on arcanea.ai

### P1 — Harden the Platform (2-4 hours)

7. **Regenerate Supabase types** to eliminate `as any` workarounds
8. **Implement real health check** with DB ping
9. **Add error boundaries** to auth-gated pages
10. **Add rate limiting** to auth endpoints (Supabase has built-in, verify config)

### P2 — Showcase Hidden Value (2-4 hours)

11. **Update homepage** to reveal Intelligence layer (9 packages, ~30K LoC)
12. **Showcase arcanea-flow** (146K LoC multi-agent system)
13. **Create /ecosystem page** with real package data
14. **Fix Command Center** with live data from PM toolkit

### P3 — Complete Memory System (4-8 hours)

15. **Build @arcanea/memory-mcp** server
16. **Implement horizon share** protocol
17. **Wire Memory web API** (requires auth working)

### P4 — Polish & Growth (ongoing)

18. **Design system cleanup** — remaining raw hex colors
19. **SEO** — structured data, OG images per page
20. **Performance** — bundle analysis, image optimization
21. **Analytics** — Vercel Analytics or Plausible

---

## The Goal

**M001 at 100% = auth works on arcanea.ai.** That's the gate to everything else — community features, creation uploads, memory web API, social layer. Everything downstream depends on a working auth system on the live site.

**Next milestone after M001:** M003 (Memory System) → ship the MCP server and web API. This is the moat — HorizonLedger dataset.

---

## Quick Decision Needed

The repo misalignment (`arcanea-records` vs `arcanea-ai-app`) is the #1 blocker. Options:

| Option | Pros | Cons |
|--------|------|------|
| **A) Reconfigure Vercel** to watch `arcanea-records` | Simple, one-time | May break existing deployments |
| **B) Push to both remotes** | No Vercel changes | Dual maintenance |
| **C) Mirror repos** (GitHub Action) | Automated | Extra infrastructure |

Recommendation: **Option B** for now (add `arcanea-ai-app` as second remote, push once), then migrate to A when ready.
