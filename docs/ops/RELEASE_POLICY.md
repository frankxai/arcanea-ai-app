# Arcanea Release Policy

Date: 2026-03-29
Status: Draft operating policy
Scope: `arcanea-ai-app`, `arcanea`, `arcanea-code`, `oh-my-arcanea`, `arcanea-records`

## Purpose

Arcanea now has enough repos, branches, and parallel agent activity that release quality can no longer depend on memory or branch folklore.

This policy defines:

- canonical branch per repo
- allowed branch families
- merge rules
- release readiness gates
- stale-branch cleanup rules

## Global Rules

1. `main` means releasable.
2. No large mixed “session accumulation” commits should be merged directly to a release branch.
3. Protected product surfaces must not merge without explicit verification:
   - `/chat`
   - `/imagine`
   - homepage / `v3`
   - billing / credits / Stripe / Supabase payment state
4. Every branch intended for merge must answer:
   - what surface it owns
   - what verification ran
   - what was intentionally left out
5. Diverged stale branches are not “almost ready.” They are extraction sources until proven otherwise.

## Repo Policies

### 1. `frankxai/arcanea-ai-app`

Role:

- canonical product repo
- app, packages, and release-control plane

Canonical release branch:

- `main`

Allowed branch families:

- `feature/<surface>-<topic>`
- `fix/<surface>-<topic>`
- `codex/<topic>`
- `claude/<topic>`
- `design/<topic>`
- `vercel/<topic>` only for tightly scoped deployment/tooling changes
- `testing/<topic>` for review branches that are not release candidates

Merge policy:

- direct merge to `main` only for narrow low-risk fixes
- otherwise require PR or equivalent review summary
- branches touching protected surfaces must include verification notes

Required release gates for `main`:

- root install completes
- `pnpm --dir apps/web type-check`
- `pnpm --dir apps/web build`
- package health on required dependents is known
- preview env checklist is satisfied for affected integrations

Stale branch policy:

- close or archive branches more than 14 days behind unless actively owned
- do not resurrect stale branches by merging blindly; re-extract the useful work

### 2. `frankxai/arcanea`

Role:

- public mirror / OSS-facing repo

Canonical release branch:

- `main`

Merge policy:

- sync from `arcanea-ai-app` deliberately
- never treat this repo as a second source of truth for active product work

### 3. `frankxai/arcanea-code`

Role:

- coding/tooling satellite

Canonical release branch:

- `production`

Working branch:

- `dev`

Policy:

- `dev` may run ahead, but releases happen by intentional cut from `dev` to `production`
- no fast blind merge when divergence is high
- if `dev` exceeds 100 commits ahead of `production`, a release audit is mandatory

### 4. `frankxai/oh-my-arcanea`

Role:

- overlay/workflow satellite

Canonical release branch:

- `master`

Working branch:

- `dev`

Policy:

- same release-cut model as `arcanea-code`
- if `dev` exceeds 100 commits ahead of `master`, require an extraction or release train

### 5. `frankxai/arcanea-records`

Role:

- currently underdefined

Canonical release branch:

- `main`

Policy:

- no automation should publish into this repo until its purpose is defined
- assign one of:
  - archive
  - public data
  - changelog / release record
  - research log

## Branch Types

### Release candidate

Purpose:

- intended to merge

Requirements:

- narrow scope
- explicit verification
- no unresolved protected-surface ambiguity

### Testing branch

Purpose:

- gather or review work without claiming release readiness

Requirements:

- may diverge
- must end in:
  - merge recommendation
  - split recommendation
  - abandon recommendation

### Stale branch

Definition:

- behind current release branch materially
- unclear owner
- no current verification

Required action:

- close, archive, or extract from it

## Merge Decision Matrix

Merge directly when:

- scope is narrow
- affected surfaces are low risk
- verification passed

Cherry-pick when:

- branch contains one or two good commits inside a noisy branch
- current branch divergence is high

Split branch before merge when:

- branch touches multiple protected surfaces
- includes infra + UI + generated files + docs together

Do not merge when:

- branch is stale and heavily diverged
- verification is absent
- another in-flight workstream owns the same surface

## Current March 29 Application

Based on current repo state:

- `testing/phase0-codex-review`
  - do not merge wholesale
  - cherry-pick `c65a3c8f`
  - selectively extract from `700f8deb`
  - split `e17e7c60`
- `origin/claude/arcanea-challenge-platform-r0BHb`
  - do not merge directly
  - treat as concept/extraction source
- `cursor/development-environment-setup-9dbe`
  - stale
  - extract only if needed
- `vercel/vercel-speed-insights-to-nextj-i9vkg4`
  - stale
  - reimplement narrowly on current `main` if still wanted

## Operating Standard

Arcanea should move fast, but `main` must stay believable.

That means:

- fewer giant mixed commits
- fewer stale branches pretending to be near-merge
- more explicit release cuts
- more verification attached to code movement
