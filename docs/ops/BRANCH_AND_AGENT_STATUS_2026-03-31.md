# Branch and Agent Status - 2026-03-31

## Current repo shape

- Main control plane repo: `C:\Users\frank\Arcanea`
- Main branch: `main`
- Main HEAD: `4ed01ce0b45bb2b1294d35eabdcecd4ba6964223`
- Active product worktree: `C:\Users\frank\Arcanea-integration-review`
- Product branch: `testing/chat-project-workspaces`
- Product HEAD: `106670a624898bd946ef6f22bc31f16cf3ab7a0c`

## Current branch inventory

Remote branches currently visible:

- `origin/main` -> `4ed01ce0b`
- `origin/testing/chat-project-workspaces` -> `106670a62`

No other remote branches are currently present in this clone's `origin/*` refs.

## Divergence summary

From `origin/main...origin/testing/chat-project-workspaces`:

- `main` is ahead by `102` commits
- `testing/chat-project-workspaces` is ahead by `3` commits

This means the testing branch should be treated as a narrow feature slice, not as an alternate trunk.

## What the other agents appear to have changed on main

Based on current `main` history and working tree:

- new planning and sprint docs landed on `main`
- `AgentHub`, factions, quiz, and book-related feature work landed on `main`
- orchestrator and repo-constellation work is in progress in the main working tree
- multiple `.claude` skills and external skill bundles are being removed or reorganized
- ops surfaces and internal command/dashboard paths are being added under `apps/web/app/command/*` and `apps/web/app/api/ops/internal/*`

Key signals from `git status` on `main`:

- many dirty tracked files in `.arcanea`, `.claude`, docs, and `apps/web`
- several untracked platform/ops files and directories
- main should be treated as an active multi-agent integration surface, not a clean release candidate

## What is isolated on the testing branch

The testing branch is a focused product/data slice centered on project workspaces and graph-backed continuity:

- project graph migrations
- project APIs
- `/projects` and `/projects/[id]`
- project session/creation linking actions
- project graph enrichment/progress/trace logic
- project contract tests
- Playwright browser smoke coverage for the project workspace slice

Recent commits on the testing branch:

1. `91833fd74` - expand workspace graph surfaces
2. `dec20f0d7` - add writable project surfaces
3. `106670a62` - add linking actions and route contracts

## Merge risk assessment

### Main -> testing

Very high risk if done as a blind merge.

Reasons:

- `main` has moved far beyond the testing branch in unrelated areas
- `main` includes broad content, agent, ops, and docs churn
- some protected/high-churn surfaces have changed on `main`, including `/chat`, `/imagine`, and multiple app surfaces

### Testing -> main

Reasonable if done as a narrow promotion, not as a worktree dump.

The testing branch is only three focused commits ahead and has already been kept intentionally scoped to project-workspace functionality.

## Recommended promotion order

1. Promote activation-safe docs/scripts first
2. Promote project graph runtime and API changes second
3. Promote `/projects` product surfaces third
4. Promote Playwright/browser harness last, only after re-running it on top of updated `main`

## Do not do

- Do not merge `main` wholesale into `testing/chat-project-workspaces` unless the goal is a dedicated rebase/integration session
- Do not merge `testing/chat-project-workspaces` wholesale into `main` while `main` still has a dirty working tree
- Do not assume prior branch handoff docs are fully current; some were written before the latest `main` sprint/planning commits

## Immediate next operator move

1. Clean or checkpoint the dirty working tree on `main`
2. Rebase or cherry-pick the 3 testing commits onto a fresh integration branch off current `main`
3. Re-run:
   - `pnpm --dir apps/web type-check`
   - `pnpm --dir apps/web test:projects`
   - `pnpm --dir apps/web build`
   - `pnpm exec playwright test` from `apps/web`
4. Only then decide what is safe to promote to `main`

## Practical interpretation

The repo is not blocked by lack of ideas. It is constrained by integration discipline.

`main` is currently the moving platform/agent strategy trunk.
`testing/chat-project-workspaces` is currently the best-scoped product feature branch.

Treat them that way.
