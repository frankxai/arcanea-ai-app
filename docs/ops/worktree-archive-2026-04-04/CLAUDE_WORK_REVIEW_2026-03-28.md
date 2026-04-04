# Claude Work Review — 2026-03-28

Date: 2026-03-28
Review branch: `codex/integration-review-2026-03-28`
Base reviewed: `origin/main`
Reviewer: Codex

## Findings

### 1. Protected surfaces changed heavily after the audit window

Recent mainline work since `821bb2e0` is concentrated in:

- `/chat`
- `/imagine`
- homepage / `v3`
- credits / Supabase-backed billing routes
- lore hero rendering

That means any next pass needs to treat current `main` as a moving integration target, not a stable base.

### 2. The earlier `/chat` session-store contract break is already fixed on current `main`

The import/export mismatch I found during the package audit is no longer present.

Current `main` now contains:

- [`apps/web/hooks/use-chat-sessions.ts`](C:\Users\frank\Arcanea-integration-review\apps\web\hooks\use-chat-sessions.ts)
- [`apps/web/lib/chat/supabase-store.ts`](C:\Users\frank\Arcanea-integration-review\apps\web\lib\chat\supabase-store.ts)

Verified restored exports:

- `cloudSessionToLocalSession`
- `renameCloudSession`
- `deleteCloudSession`
- `saveSessionToCloud`
- `loadCloudSessions`

Interpretation:

- the earlier release blocker in chat session sync appears to have been actively repaired
- any new `apps/web` build verdict should be re-run against current `main`, not inferred from the earlier audit run

### 3. Chat work is directionally coherent but large

Recent chat commits:

- `2a6a7ca9` — chat UX excellence
- `74b9fab5` — premium chat experience personality/layout/dedup/streaming/chips
- `cc900060` — premium chat experience layout/streaming/cloud sync
- `01afd96a` — z-index/nav click fix

What improved:

- more canonical chat layout primitives
- better message rendering and session management
- cloud sync path reintroduced
- clickability issue fixed at the layout level

Why it is still risky:

- the commits are large and stack on each other
- chat logic now spans page, layout, hooks, local store, cloud sync, AI routing, and new components
- verification evidence is not bundled with the commits themselves

### 4. Imagine work is accelerating but overlaps multiple layers

Recent imagine commits:

- `3c8bff59` — public access + route integrity + new shared chat/imagine support files
- `402fb15d` — OpenRouter provider with 8 models
- `55adf4de` — GPT-5 Image Mini + Gemini model fix
- `b9c26fd8` — masonry layout, prompt history, style chips

What improved:

- broader provider support
- stronger prompt input UX
- more product-grade generation controls

Why it is still risky:

- provider logic, contracts, route behavior, and UI changed in close succession
- image generation surfaces often fail at runtime rather than compile time
- this path needs explicit browser and provider verification, not code review alone

### 5. Homepage work continued despite being a protected surface for this pass

Recent homepage-related commits:

- `0fa95d16` — marketing copy cleanup
- `b1595dcf` — performance work on hero/v3

Interpretation:

- main is still moving on homepage work
- any “do not touch homepage” follow-up must be treated as “review-only” unless we intentionally reopen that surface

### 6. Credits / monetization work is moving toward reality

Recent credits commit:

- `489bcf6a` — replace mock credit flows with Supabase-backed balance/spend/webhook behavior

What improved:

- balance route now queries live data
- spend route now attempts real debit + transaction logging
- webhook handlers now cover purchase and subscription lifecycle

Why it matters:

- this is one of the highest-value changes for real revenue readiness

Why it is still risky:

- billing changes are env-sensitive
- current environment still lacks verified Stripe and Supabase credentials
- graceful degradation is present, but business correctness is not yet proven

### 7. The remote Claude branch is stale and should not be merged blindly

Reviewed branch:

- `origin/claude/arcanea-challenge-platform-r0BHb`

Compare result against current `main`:

- `ahead_by: 5`
- `behind_by: 535`
- `status: diverged`

What is on it:

- large challenge/arena/platform work
- commerce/mana/wallet types
- runtime state directory churn

Recommendation:

- do not merge this branch directly
- if any concepts are still wanted, re-extract them intentionally on top of current `main`

## Open Risks

### 1. Mixed velocity across protected product surfaces

`/chat`, `/imagine`, and homepage are all changing at once. Even when individual commits are good, the integration risk rises fast without a stronger verification gate.

### 2. Verification is lagging behind code movement

I confirmed one repaired contract by inspection, but I did not run a fresh full web build or browser pass in this review branch. The repo needs re-verification against current `main`.

### 3. Credits work is now valuable enough to deserve its own release gate

Billing and entitlement logic should not ride with general UX churn. It now deserves:

- env checklist
- webhook verification
- transaction logging verification
- failure-mode review

### 4. Branch archaeology is getting expensive

There are now:

- recent fast-moving mainline commits
- testing review work still needing selective merge
- stale Claude branch work
- stale Cursor/Vercel branches

Without an explicit release policy, useful work keeps turning into branch archaeology.

## Short Integration Summary

Current `main` is more advanced than the earlier audit snapshot.

The good news:

- chat session sync contract is repaired
- credits work is moving toward live revenue plumbing
- imagine is becoming a stronger product surface

The bad news:

- the highest-risk surfaces are all moving simultaneously
- stale large branches still exist
- verification is still not keeping pace with the rate of change

Best next move:

1. freeze review scope on `/chat`, `/imagine`, homepage, and billing
2. run a fresh verification pass on current `main`
3. then execute the governance outputs:
   - `docs/ops/RELEASE_POLICY.md`
   - `docs/ops/PREVIEW_ENV_CHECKLIST.md`
   - `docs/ops/PLANNING_DOC_POLICY.md`
   - `planning-with-files/CORE_DEPENDENT_COMPATIBILITY_SWEEP.md`
