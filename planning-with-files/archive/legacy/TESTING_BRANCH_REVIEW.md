# Testing Branch Review

Date: 2026-03-28
Branch reviewed: `testing/phase0-codex-review`
Reviewer: Codex

## Executive Summary

This branch is ahead of `main`, and `main` is an ancestor of `testing/phase0-codex-review`, so there is no history-level conflict preventing integration.

That does **not** make it safe to merge wholesale.

The branch contains one clean foundation commit, one mostly-contained chat architecture commit, and one very broad accumulation commit that overlaps multiple active workstreams and protected surfaces.

## Ancestor Check

- `git merge-base --is-ancestor main testing/phase0-codex-review`
- Result: `true`

Interpretation:

- `testing/phase0-codex-review` contains `main`
- merge can happen cleanly at the git-history level
- safety depends on content overlap and runtime behavior, not ancestry

## Build Verification

Command run:

- `pnpm --filter @arcanea/web build`

Result:

- compile phase succeeded
- production build failed during prerender because Supabase env vars were not set

Observed failure:

- missing `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`
- missing `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_ANON_KEY`
- prerender failures surfaced on `/living-lore/crew/[memberId]` and `/academy/gates`

Interpretation:

- there is no immediate compile regression from the branch itself
- full build is **not verified clean** in a production-like environment
- current failure signal is environment-gated, not obviously caused by the reviewed commits

## Commit Review

### 1. `c65a3c8f`

Title:

- `fix: foundation cleanup — remove legacy chat code, restore type safety`

What it does:

- deletes legacy unused chat files
- restores type ownership for `EmotionalTone`
- tightens `code-block.tsx` typing
- updates `tsconfig.chat-imagine.json`
- removes `ignoreBuildErrors: true`
- adds `apps/web/.env.example`

Risk:

- low to moderate
- strongest commit in the branch
- mostly cleanup and type-safety restoration

Overlap with active in-flight files:

- none from the currently dirty working tree

Recommendation:

- good cherry-pick candidate

### 2. `700f8deb`

Title:

- `feat: chat architecture — collapse luminorId route, Playwright setup, E2E tests`

What it does:

- reduces `/chat/[luminorId]` to redirect behavior
- adds Playwright config and E2E coverage
- adjusts strictness/config files
- minor chat component fixes

Risk:

- moderate
- directionally good, but it touches active chat architecture
- should be reviewed against the currently evolving chat path before merging

Overlap with active in-flight files:

- `apps/web/lib/ai/arcanea-intelligence.ts`

Protected-surface overlap:

- touches `/chat`

Recommendation:

- do **not** merge blindly
- keep separate or cherry-pick only the Playwright/E2E/config pieces after chat-owner review

### 3. `e17e7c60`

Title:

- `feat: accumulated session work — chat UX, community, imagine, living-lore, infra`

What it does:

- very broad batch of changes across chat, imagine, community, living-lore, auth, landing, infra, hooks, settings, docs, middleware, and package outputs

Risk:

- high
- this is not a review-friendly merge unit
- it mixes product work, infra work, docs, generated output, and settings changes

Overlap with active in-flight files:

- `apps/web/app/api/imagine/generate/route.ts`
- `apps/web/app/v3/v3-below-fold.tsx`
- `apps/web/components/landing/social-proof.tsx`
- `apps/web/lib/chat/suggestion-engine.ts`

Protected-surface overlap:

- `/chat`
- `/imagine`
- homepage-related files
- `apps/web/middleware.ts`

Recommendation:

- do **not** merge this commit to `main` as-is
- split into smaller reviewable units
- isolate infra/docs from product-surface changes
- isolate community work from imagine/chat changes
- exclude protected surfaces from current merge path

## Current Overlap With Live Agent Work

Based on the current dirty working tree, the overlap risk is concentrated in:

- `apps/web/lib/ai/arcanea-intelligence.ts`
- `apps/web/app/api/imagine/generate/route.ts`
- `apps/web/app/v3/v3-below-fold.tsx`
- `apps/web/components/landing/social-proof.tsx`
- `apps/web/lib/chat/suggestion-engine.ts`

This means the branch is **not** safe to merge wholesale while parallel agents are actively changing related product areas.

## Recommendation

### Final Recommendation

Do **not** merge `testing/phase0-codex-review` directly to `main`.

### Preferred path

1. Cherry-pick `c65a3c8f`
2. Hold `700f8deb` for targeted extraction:
   - likely keep Playwright/E2E/config pieces
   - review chat-route changes separately
3. Keep `e17e7c60` separate and split it before any merge attempt

### Merge classification

- `c65a3c8f`: merge-worthy by cherry-pick
- `700f8deb`: selective cherry-pick only
- `e17e7c60`: keep separate, split before merge
