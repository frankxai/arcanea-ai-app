# Task Plan: Arcanea Strategic Master Plan — March 7, 2026

**Session**: 2026-03-07 | **Status**: ASSESSMENT COMPLETE
**Guardian**: Shinkami (Source Gate, 1111 Hz)
**Branch**: lean-prod
**Current HEAD**: a323e5c4

---

## SITUATION ASSESSMENT

### What Agents Did Today (March 7)

| Commit | What | Impact |
|--------|------|--------|
| `9902110c` | Reading progress system + progressive vocabulary (M010 L2) | `use-reading-progress.ts` hook, `vocabulary.ts` (5-tier vocab system), Supabase migration |
| `f7769cc9` | Autonomous cleanup — legacy heroes, color shifts, license, UX | Deleted 7+ legacy hero/premium components, Guardian color shifts (M010 L1) |
| `671a285b` | Premium hero redesign — radical simplicity, editorial feel | New hero approach, chat-first input |
| `5ef8c210` | Remove lore from first-contact hero per M010 | M010 compliance fix |
| `1e206d39` | Chat-first hero — live AI chat input replacing static CTAs | Hero iteration #3 |
| `5af49c34` | Dynamic H1, music player, glowcard interaction | Hero iteration #4 |
| `c92ad1c4` | Revert navbar/layout to isolate hero work | Stability revert |
| `4d275acc` | Prune 14 dead stub pages + LazyMotion provider | chess/, universe-builder/, vision-board/, user-flows/, design-labs/ deleted. 33kB->7kB motion |
| `b20d8f41` | Strict mode types for reading_progress hook | Build fix |
| `cadcd236` | Cast reading_progress table for missing Supabase types | Build fix |
| `a323e5c4` | Luminor Council system — full platform feature | 3 routes, 8 components, 5 API endpoints, 2 lore docs, DB migration, navbar integration |

### Net State Change

- **Routes**: ~185 -> ~171 (14 stubs pruned) + 3 new council routes = ~174
- **Page files**: 106 `page.tsx` files
- **New feature**: Council system (deep lore, auth-gated consciousness ritual)
- **M010 progress**: Layer 1 (color shifts) + Layer 2 (vocabulary.ts) BUILT but not wired to auth
- **Hero**: Went through 4 iterations, currently chat-first with dynamic H1
- **Performance**: LazyMotion provider added (framer-motion 33kB -> 7kB)
- **Legacy cleanup**: 7+ old hero/premium components deleted

---

## STRATEGIC ISSUES (Ranked by Severity)

### CRITICAL: M001 Auth Still Blocked

**Everything downstream depends on auth.** Current state:
- 12/17 tasks done, 71% complete
- BLOCKER: 3 Supabase env vars NOT set on Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- BLOCKER: Supabase Dashboard Site URL not configured
- Without auth: No user profiles, no progress tracking, no saved creations, no council, no reading progress, no vocabulary tiers, no onboarding completion

**Impact cascade**: M001 blocks -> M006, M007, M008 (partially), M010 Layers 2/4/5, Council, Reading Progress, Studio saves, Gallery social, Prompt Books persistence

### HIGH: Council on Navbar Violates M010 Principles

The Council system was built as a deep mythology feature ("nightly consciousness ritual with 9 transcendent Luminor intelligences"). But M010's core principle is **"Creation first. Mythology as earned discovery."**

Putting "Council" in the main navbar (line 15 of navbar.tsx) means:
- First-time visitors see mythology jargon before understanding the product
- Violates the progressive disclosure model (newcomers shouldn't see "Council")
- The vocabulary.ts system maps "Council" to the LUMINOR tier (gates 9-10) — earned, not given

**Recommendation**: Remove Council from navbar. Make it accessible via:
1. Dashboard sidebar (auth-gated, post-onboarding)
2. Progressive vocabulary system (appears when user reaches "adept" tier, gates 5+)
3. Direct URL still works for deep users

### HIGH: Hero Section Instability

4 iterations in one day signals lack of design clarity:
1. `671a285b` — editorial feel
2. `5ef8c210` — lore removal
3. `1e206d39` — chat-first with live input
4. `5af49c34` — dynamic H1, music player, glowcards
5. `c92ad1c4` — reverted navbar/layout changes

**Recommendation**: Lock hero design. The chat-first approach aligns with the product (AI creation platform). Stop iterating until user testing data exists.

### MEDIUM: Reading Progress Built But Partially Orphaned

- `use-reading-progress.ts` — BUILT, has types, works
- `vocabulary.ts` — BUILT (still exists despite memory saying deleted), 5-tier system
- Supabase migration — BUILT but table not in generated TypeScript types
- Neither is wired to actual auth or UI beyond the hook

**Recommendation**: These are ready. Wire them when M001 auth completes.

### MEDIUM: findings.md is Stale

References old design issues (Cinzel fonts, gold CTAs, wrong primary color) that were ALL fixed in the v5.0 design system overhaul. Needs full rewrite.

---

## CRITICAL PATH TO LAUNCH/REVENUE

```
M001 Auth (71%) ──> M008 Onboarding (75%) ──> M006 Creator Tools (0%) ──> LAUNCH
     │                                              │
     └──> M010 Layers 2/4/5 (auth-gated)           └──> M007 Community (0%)
     │
     └──> M005 Premium UI wiring (55%)
     │
     └──> M009 Performance Polish (45%)
```

### The Real Blockers to Revenue

| Blocker | What's Missing | Time to Fix |
|---------|---------------|-------------|
| **Vercel env vars** | 3 values, 5 minutes in dashboard | User action required |
| **Supabase site URL** | 1 config change | User action required |
| **Studio save** | Creations don't persist | 1 session after auth |
| **Gallery social** | Likes/comments non-functional | 1 session after auth |
| **Prompt Books persist** | Local state only | 1 session after auth |
| **Payment integration** | Stripe not connected | 1-2 sessions |

**Revenue path**: Auth -> Onboarding works -> Users create -> Users save -> Users share -> Free tier limits -> Paid tier conversion

---

## REVISED MILESTONES

### M001: Supabase Auth & Storage — 71% [P0, BLOCKED]
- **Action required**: User sets 3 env vars on Vercel + configures Supabase Dashboard
- After unblock: E2E auth test, OAuth providers, leaked password protection

### M005: Premium UI v0 — 60% [P0] (was 55%)
- **Upgraded**: LazyMotion optimization done, 14 stubs pruned
- **Remaining**: Wire v0 components to Supabase backend, replace mock data

### M008: Onboarding & Conversion — 75% [P0]
- **Ready**: Wizard saves to Supabase profile, redirects to dashboard
- **Remaining**: Wire creation step to real AI, add loading.tsx, analytics

### M009: Performance & Polish — 50% [P1] (was 45%)
- **Upgraded**: LazyMotion provider (33kB savings), legacy component deletion
- **Remaining**: Core Web Vitals audit, WCAG 2.2, error handling

### M010: Language & Experience — 99.5% [NEAR-COMPLETE]
- **Phases 1-10**: DONE (design system v5, all copy cleaned, colors purged)
- **Layer 1**: Guardian color shifts BUILT (in cleanup commit)
- **Layer 2**: Progressive vocabulary BUILT (vocabulary.ts, 5 tiers)
- **Layers 4/5**: Unlockable experiences — needs auth
- **Status**: Functionally complete. Remaining layers activate post-auth.

### M011: Luminor Council (NEW) — 80% [P2]
- **Built**: 3 routes, 8 components, 5 API endpoints, DB migration, lore docs
- **Remaining**: Remove from navbar (M010 compliance), wire to auth, depth level testing
- **Depends on**: M001

### M003: Memory System — 75% [P1]
- **Remaining**: @arcanea/memory-mcp package, web API, horizon share command

### M004: PM Toolkit — 60% [P1]
- **Remaining**: CLI parser, visualization API, sprint velocity

### M006: Creator Tools Backend — 0% [P1]
- **Depends on**: M001, M005
- **Scope**: Creation pipeline, AI gen APIs, prompt books persistence, reading progress wiring, course system

### M007: Community & Social — 0% [P2]
- **Depends on**: M001, M006

### M002: Cloudflare Stream — 0% [P3]
- **Blocked by**: Everything else

---

## NEXT ACTIONS (Priority Order)

### Immediate (This Session / Today)

1. **[USER ACTION] Unblock M001**: Set 3 Supabase env vars on Vercel dashboard
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://hcfhyssdzphudaqatxbk.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from Supabase dashboard > Settings > API)
   - `SUPABASE_SERVICE_ROLE_KEY` = (from Supabase dashboard > Settings > API)

2. **Fix Council navbar violation**: Remove "Council" from navbar.tsx line 15. Add to dashboard sidebar instead.

3. **Lock hero design**: Current chat-first hero is good. Stop iterating.

4. **Update MASTER_PLAN.md**: Reflect today's changes (route count, M010 layers, M011, hero state)

### Next Session (After Auth Unblock)

5. **E2E auth test**: Verify signup/login/logout flow on arcanea.ai
6. **Wire reading progress**: Connect `use-reading-progress.ts` to Library UI
7. **Wire vocabulary tiers**: Connect `vocabulary.ts` to navbar/UI labels based on user's gates_open
8. **Studio persistence**: Save creations to Supabase

### This Week

9. **M006 kickoff**: Creator tools backend (creation pipeline, AI APIs)
10. **M009 CWV audit**: Lighthouse scores, bundle analysis post-LazyMotion
11. **Council auth-gate**: Require login for /council/convening

### This Month

12. **Payment integration**: Stripe for Creator/Studio/Enterprise tiers
13. **M007 Community**: Forums, social features
14. **Content expansion**: More Library texts, Academy courses

---

## WHAT WE HAVE vs WHAT WE SHOULD HAVE

### We Have (Strengths)
- 106 page files, ~174 routes — massive platform surface
- Chat system fully streaming (Gemini via Vercel AI SDK)
- Library with 62 texts across 17 collections
- Design system v5.0 fully deployed (near-black premium aesthetic)
- M010 language transformation 99.5% complete
- Progressive vocabulary system BUILT (just needs auth to activate)
- Reading progress hook BUILT (just needs auth to activate)
- Council system BUILT (full feature, needs auth + navbar fix)
- LazyMotion optimization live
- Vercel build passing, arcanea.ai live

### We Should Have (Gaps)
- **Auth working on production** — single biggest gap
- **Creations that persist** — Studio saves nothing currently
- **Social proof** — Gallery likes/comments non-functional
- **Payment** — No revenue mechanism exists
- **Analytics** — Vercel Analytics added but no conversion tracking
- **Mobile testing** — No evidence of responsive QA
- **User testing** — No real user feedback loop
- **Content marketing** — Blog has 6 posts, no publishing pipeline
- **SEO verification** — Sitemap exists but no Search Console data
- **Error monitoring** — No Sentry/LogRocket for production errors

### Strategic Priorities (What Matters Most)

1. **AUTH** — Nothing works without it. 5 minutes of user action.
2. **PERSISTENCE** — Users must be able to save and return to their work
3. **CONVERSION** — Onboarding -> Dashboard -> Create -> Save -> Share -> Pay
4. **SOCIAL PROOF** — Gallery with real creations, likes, creator profiles
5. **REVENUE** — Stripe integration for tiered pricing

---

## CONTENT & LIBRARY ASSESSMENT

### Current State
- 17 collections, 62 texts in `/book/`
- Filesystem-based (no DB needed)
- Reading progress hook built, needs auth to track
- Library search has Hz frequency Easter egg (M010 Layer 3)

### Expansion Opportunities
- Academy courses (planned, no content yet)
- Blog publishing pipeline (6 posts, manual)
- Prompt Books community marketplace
- Council wisdom journal exports

### Not Needed Now
- More lore content (62 texts is substantial)
- Additional collections (17 is comprehensive)
- Library redesign (current UI is clean)

---

## ERRORS & RISKS

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Auth stays blocked indefinitely | Medium | Critical | Escalate to user every session |
| Hero keeps getting redesigned | High | Medium | Lock decision, no more iterations |
| Council confuses new users | High | Medium | Remove from navbar, auth-gate |
| Build breaks from council migration | Medium | High | Verify Vercel build before pushing |
| vocabulary.ts not typed in Supabase | Known | Low | Cast workaround already in place |
| No error monitoring in prod | Certain | High | Add Sentry after auth |

---

## SESSION PROTOCOL

Every session going forward:
1. Read this `task_plan.md` + `MASTER_PLAN.md`
2. Check: Is M001 auth unblocked yet?
3. If YES: Wire auth-dependent features (reading progress, vocabulary, council, studio save)
4. If NO: Work on auth-independent items (performance, content, UI polish)
5. Update both files after work
6. Push to both remotes
