# Agent Branch Matrix - 2026-04-03

This file records the active Arcanea branches and worktrees observed on this machine, what each branch appears to contain, and whether it should be promoted, held, or treated as experimental.

## Canonical Trunk

- `main`
- Worktree: `C:\Users\frank\Arcanea-agent-control-promote`
- Status: canonical promotion trunk
- Current role:
  - durable docs and ops state
  - verified project-workspace spine
  - SIS runtime and CI discipline
  - safe docs MVP hardening already promoted
- Promotion posture:
  - safe for additional docs/ops control-plane updates
  - do not use for mixed feature development

## Active Feature Worktrees

- `feat/docs-graph-retrieval`
- Worktree: `C:\Users\frank\Arcanea-docs-graph`
- Status: good active branch
- Current observed scope:
  - fold docs into project graph retrieval
  - expose docs on the project workspace page
  - extend project retrieval, enrichment, progress, and API tests
- Current signal:
  - high-leverage and correctly scoped
  - uses a clean worktree instead of dirty `main`
  - aligned with current backlog priority
- Recommendation:
  - continue
  - verify in isolation
  - promote only after tests/build pass

- `integration/agent-control-plane-unification`
- Worktree: `C:\Users\frank\Arcanea`
- Status: mixed integration branch
- Current observed scope:
  - older agent-control-plane work
  - SIS runtime changes already promoted in safe tranches
  - newer `agentdb`/memory changes
  - package and script drift
- Current signal:
  - not safe for blind promotion
  - now contains overlapping product/runtime experiments
  - should be treated as a staging area, not a merge candidate
- Recommendation:
  - review commit-by-commit and file-by-file
  - split any safe `agentdb` tranche into its own clean branch
  - do not merge wholesale

## Recent Promotion Branches

- `promote/agent-control-plane`
- Status: already promoted
- Value delivered:
  - shared agent contract
  - planning-with-files execution control
  - docs MVP hardening
  - SIS runtime launcher fixes

- `promote/sis-runtime-hardening`
- Status: already promoted
- Value delivered:
  - Node/pnpm discipline
  - CI hardening
  - SIS schema/contract/write-path checks
  - legacy export compatibility

## Current Interpretation

If an agent starts now and wants the best available branch:

1. Read `AGENTS.md`
2. Read the latest `planning-with-files/*`
3. Read `docs/ops/MASSIVE_ACTION_LOG_2026-04-03.md`
4. Prefer `main` for durable docs/ops changes only
5. Prefer `feat/docs-graph-retrieval` for the next product-compounding code slice
6. Treat `integration/agent-control-plane-unification` as review/staging territory, not as a production branch

## Immediate Next Decisions

- Promote docs-graph retrieval only if verification is clean
- Review the new `agentdb` tranche separately before allowing any merge discussion
- Keep live DB activation as the top external blocker once credentials are available
