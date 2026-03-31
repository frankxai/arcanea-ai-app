# Git Ops Branch Promotion Plan - 2026-03-31

## Purpose

This document defines how Arcanea should move current repo work toward stable default branches without mixing unrelated dirty state, forcing unsafe merges, or losing control of upstream forks.

## Current branch topology

### Main platform repo

- `Arcanea`
  - local branch: `main`
  - local commit: `4ed01ce0b45bb2b1294d35eabdcecd4ba6964223`
  - remote tracking:
    - `origin/main`
    - `origin/testing/chat-project-workspaces`

### Attached worktrees

- `C:\Users\frank\Arcanea`
  - branch: `main`
- `C:\Users\frank\Arcanea-integration-review`
  - branch: `testing/chat-project-workspaces`
- `C:\Users\frank\Arcanea-main-project-integration`
  - branch: `integration/project-workspaces-mainline`

### Standalone repos

- `arcanea-code`
  - current branch: `dev`
  - canonical remote branch: `origin/dev`
  - upstream fork source: `upstream/dev`
- `oh-my-arcanea`
  - current branch: `dev`
  - many remote feature/fix branches exist
- `arcanea-opencode`
  - current branch: `dev`
  - also has `origin/main`
- `claude-arcanea`
  - current branch: `master`
- `codex-arcanea`
  - current branch: `master`
- `arcanea-flow`
  - current branch: `main`
  - behind `origin/main` by 1 commit
  - also has `legacy-fork/*` and upstream fork history
- `arcanea-orchestrator`
  - current branch: `main`
  - many upstream and origin remote branches available
- `arcanea-infogenius`
  - current branch: `main`
- `arcanea-onchain`
  - current branch: `main`

## What should go to main and what should not

### Move toward main/default branch

These should be promoted through reviewed slices into their default branches:

- `Arcanea/main`
- `arcanea-flow/main`
- `arcanea-orchestrator/main`
- `arcanea-infogenius/main`
- `arcanea-onchain/main`
- `claude-arcanea/master`
- `codex-arcanea/master`

### Keep on dev for now

These should keep `dev` as the active integration branch until the product boundary is cleaner:

- `arcanea-code/dev`
- `oh-my-arcanea/dev`
- `arcanea-opencode/dev`

Reason:

- they still carry active branding and packaging cleanup
- they are closer to runtime integration layers than to stable end-user product releases

### Do not fast-forward blindly

These need selective integration, not blanket merges:

- `arcanea-flow`
  - because of divergence from `legacy-fork` and `upstream`
- `arcanea-orchestrator`
  - because upstream Composio branches may be useful, but must be evaluated for Arcanea fit
- `arcanea-code`
  - because upstream `anomalyco/opencode` syncs should be deliberate

## Promotion strategy by repo

### 1. Arcanea main repo

Promote in slices, not as one commit:

- Slice 1:
  - control plane recovery
  - machine readiness
  - wrappers
  - repo registry
  - integration map
  - ops docs
- Slice 2:
  - internal `/ops` surface
  - `/command` nav entry
- Slice 3:
  - unrelated command-center or changelog changes only if reviewed separately

Do not include in these slices:

- mass deletions under `.claude/skills/...` unless intentionally audited
- `.tmp/`
- unrelated app product changes

### 2. Arcanea project-graph work

Use branch flow:

- `testing/chat-project-workspaces`
  -> review
  -> merge or cherry-pick into `integration/project-workspaces-mainline`
  -> then into `main`

Reason:

- keeps project-graph work isolated from control-plane work
- avoids mixing workspace feature work into platform ops commits

### 3. arcanea-orchestrator

Promote directly into `main` once sliced:

- Arcanea CLI/help/config surface
- config template
- Windows-safe bootstrap scripts

Do not include:

- generated `packages/web/dist-server/`
- local `agent-orchestrator.yaml`

### 4. arcanea-flow

Promote directly into `main` in one bounded slice:

- Arcanea CLI wrappers
- `ao` bridge
- visible Arcanea help/config changes

Do not include:

- broad package-wide identity rewrites
- upstream sync imports
- speculative removal of `v3/@claude-flow`

### 5. Runtime family

For `arcanea-code`, `oh-my-arcanea`, and `arcanea-opencode`:

- land cleanup into `dev`
- cut to main only after packaging boundaries are clarified

For `claude-arcanea` and `codex-arcanea`:

- smaller direct commits to `master` are acceptable

## Better Git Ops model for all repos

### Repo classes

Every repo should be tagged as one of:

1. product
2. runtime
3. compatibility
4. vertical
5. docs/content

Suggested current mapping:

- product:
  - `Arcanea`
  - `arcanea-flow`
  - `arcanea-orchestrator`
- runtime:
  - `arcanea-code`
  - `oh-my-arcanea`
  - `claude-arcanea`
  - `codex-arcanea`
- compatibility:
  - `arcanea-opencode`
- vertical:
  - `arcanea-infogenius`
  - `arcanea-onchain`
  - `arcanea-claw`
- docs/content:
  - `arcanea-lore`
  - `arcanea-records`
  - `arcanea-ecosystem`

### Branch policy

- `main` or `master`
  - stable reviewed branch
- `dev`
  - integration branch for fast-moving runtime repos
- feature branches
  - short-lived only
- worktrees
  - for isolated feature execution, not long-term branch substitutes

### Merge policy

- no giant omnibus merges
- no blind upstream pulls on forks
- use cherry-pick or explicit merge review for upstream adoption
- require one verification command per slice before promotion

### Worktree policy

- one active feature per worktree
- worktree path must correspond to a tracked branch
- orphaned non-git folders should never reuse active worktree paths

## Better software DevOps model

### Shared standards all repos should have

- declared canonical branch
- declared upstream remote if forked
- smoke command in repo registry
- machine-readable repo role
- build/install instructions
- one health check path

### What they should share better

- command wrapper strategy
- naming conventions
- smoke-check conventions
- release and slice policy
- orchestration handoff contract

### What they should not share blindly

- generated artifacts
- stale compatibility code
- copied docs that diverge without purpose
- upstream branch imports without review

## What is interconnected today

Shared across the constellation:

- PowerShell wrappers and operator commands
- repo registry
- health and readiness scripts
- handoff docs and planning docs
- Arcanea orchestration identity
- runtime harness overlays
- worktree-based agent execution strategy

The strongest shared contract should be:

- repo metadata
- smoke command
- branch policy
- upstream policy
- orchestration role

## Immediate actions

1. Commit `/ops` surface plus `/command` nav entry in the main repo as a dedicated slice.
2. Commit control-plane Slice 1 separately.
3. Commit `arcanea-orchestrator` productization to its own `main`.
4. Commit `arcanea-flow` delegation slice to its own `main`.
5. Then review runtime repos on `dev` for what should stay there versus what is ready for main/master.
