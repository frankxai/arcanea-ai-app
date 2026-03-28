# Ecosystem Status — March 28

Date: 2026-03-28
Workspace: `C:\Users\frank\Arcanea-main-audit`
Reviewer: Codex

## Executive Summary

Arcanea has one active deployable app surface in this repo, a large package ecosystem with a usable core and a broken compatibility ring, and multiple satellite repos whose branch topology is too far apart for safe blind merges.

The biggest operational reality is simple:

- `@arcanea/core` now builds cleanly
- the package ecosystem is partially healthy
- the main product repo is **not release-clean** because `apps/web` still fails on `main`
- required runtime env is largely absent in the current environment
- satellite repos have drifted too far from their stable branches

## DCC / Project Dashboard State

- `dev-control-center.html` does **not** exist in this worktree
- `.arcanea/projects/` currently contains only:
  - [`living-lore-ip-strategy.md`](C:\Users\frank\Arcanea-main-audit\.arcanea\projects\living-lore-ip-strategy.md)

Interpretation:

- there is no live Dev Control Center artifact to trust for current ecosystem state
- current-state reporting has to come from git, package builds, repo metadata, and config files

## Repo Status

### Active

- `frankxai/arcanea-ai-app`
  - primary working repo
  - default branch: `main`
  - public
  - description present
  - currently the real control plane for app + package work
- `frankxai/arcanea`
  - public mirror / OSS-facing surface
  - default branch: `main`
  - public
  - description present
  - active, but should remain secondary to the app repo unless sync is formalized
- `frankxai/arcanea-code`
  - public satellite
  - default branch: `dev`
  - active development exists
  - release/stable branch discipline is weak
- `frankxai/oh-my-arcanea`
  - public satellite
  - default branch: `dev`
  - active development exists
  - release/stable branch discipline is weak

### Dormant / Underdefined

- `frankxai/arcanea-records`
  - public
  - default branch: `main`
  - empty description
  - no clear role surfaced in this workspace

### Local directories present but not wired as git repos

- `arcanea-companion`
- `arcanea-skills-opensource`
- `arcanea-soul`
- `oss`

Interpretation:

- these exist as directories but are not repo-connected in this worktree
- treat them as dormant or staging artifacts until formalized

## Package Status

Summary from [`PACKAGE_HEALTH.md`](C:\Users\frank\Arcanea-main-audit\planning-with-files\PACKAGE_HEALTH.md):

- `42` packages audited
- `22` ACTIVE
- `9` NEEDS_FIX
- `11` DORMANT
- `0` ARCHIVE

Build health:

- `32` pass
- `9` fail
- `1` has no build script

High-risk package failures:

- `arcanea-mcp`
- `auth`
- `claude-arcanea`
- `cli`
- `overlay-chatgpt`
- `overlay-claude`
- `overlay-copilot`
- `overlay-cursor`
- `overlay-gemini`

## Deployed Surfaces And Health

### `apps/web`

Status:

- only app under `apps/`
- deploy target is Vercel via [`vercel.json`](C:\Users\frank\Arcanea-main-audit\vercel.json)
- region configured: `iad1`
- build command: `cd apps/web && npx next build --webpack`

Health:

- **DEGRADED**

Why:

- production build on `main` is blocked by current `/chat` import/export mismatch in `use-chat-sessions.ts`
- clean testing-branch build compiled but failed static prerender without Supabase env
- current shell environment only has `OPENAI_API_KEY` set
- no verified Supabase, Stripe, Gemini, Anthropic, or service-role config present

### API surfaces inside `apps/web`

Status:

- co-hosted with the Next.js app
- partially env-gated

Health:

- **UNKNOWN / DEGRADED**

Why:

- many routes require Supabase, Stripe, Gemini, Anthropic, or Blob env
- no current environment verification for those integrations

### Historical / implied surfaces not present in this repo

- no `apps/premium-web`
- no additional app directory under `apps/`

Interpretation:

- any historical references to multiple app deployments are stale relative to the current workspace

## Branches Needing Merge Or Disposal

### In `arcanea-ai-app`

- `testing/phase0-codex-review`
  - compare against `main`: `ahead_by 3`, `behind_by 2`, `status: diverged`
  - not safe to merge wholesale
  - cherry-pick `c65a3c8f`, extract from `700f8deb`, split `e17e7c60`
- `claude/cleanup-incidents-docs-fS4LS`
  - `ahead_by 0`, `behind_by 523`, `status: behind`
  - stale, safe to close unless still needed
- `cursor/development-environment-setup-9dbe`
  - `ahead_by 1`, `behind_by 885`, `status: diverged`
  - stale
  - only material change is an `AGENTS.md` addition
- `vercel/vercel-speed-insights-to-nextj-i9vkg4`
  - `ahead_by 1`, `behind_by 888`, `status: diverged`
  - stale
  - touches homepage-adjacent layout and lockfile, so it should not be merged blindly

### In satellite repos

- `frankxai/arcanea-code`
  - `dev` ahead of `production` by `1198`
  - release line needs a deliberate cut, not a merge
- `frankxai/oh-my-arcanea`
  - `dev` ahead of `master` by `1459`
  - release line needs a deliberate cut, not a merge

## Env Vars Needed But Not Set

Current shell env found:

- `OPENAI_API_KEY` only

Critical missing env for real app operation:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_APP_URL` or `NEXT_PUBLIC_SITE_URL`

Revenue / billing env missing or not verified:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_CREATOR`
- `STRIPE_PRICE_STUDIO`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Operational / observability env missing or not verified:

- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `BLOB_READ_WRITE_TOKEN`
- `VERCEL_ENV`

## Top 5 Things Blocking Revenue

1. `apps/web` is not release-clean on `main`
   - current build blocker sits in `/chat`, so the canonical product repo cannot be verified end-to-end
2. Stripe integration is not validated in the current environment
   - checkout, portal, webhook, and price envs are missing or unverified
3. Supabase is not configured in the current environment
   - auth, community, gallery, profiles, storage, and several content surfaces degrade or fail
4. Paid ecosystem surfaces are not healthy
   - `cli`, `claude-arcanea`, overlay packages, and `auth` fail to build
5. Repo and branch sprawl slows safe shipping
   - main repo has diverged feature branches, and satellite repos are thousands of commits away from their stable branches

## Top 5 Things Blocking First Real User

1. Missing Supabase env breaks core user journeys
   - signup/login, community stats, profiles, gallery, and prerendered lore/academy pages
2. `main` web build is currently broken by `/chat` store export drift
   - this blocks confidence in the primary app surface even if chat fixes are happening elsewhere
3. AI provider setup is incomplete
   - current env exposes only `OPENAI_API_KEY` while many routes assume Gemini or Anthropic availability
4. There is no trustworthy live ops dashboard in-repo
   - DCC artifact is absent, leaving repo/build/env truth fragmented
5. Important stabilization work is stranded on non-merged branches
   - especially the testing review branch and large satellite repo `dev` lines

## Recommended Next Actions

1. Merge the `@arcanea/core` fix immediately.
2. Resolve the `/chat` export mismatch on `main` before any release or broader quality claims.
3. Stand up a minimum real environment set for Supabase, Gemini, Anthropic, and Stripe in preview.
4. Run a focused compatibility sweep for `auth`, `cli`, `claude-arcanea`, and the overlay family against current `@arcanea/core`.
5. Establish release discipline for `arcanea-code` and `oh-my-arcanea` instead of letting `dev` drift indefinitely from stable.
