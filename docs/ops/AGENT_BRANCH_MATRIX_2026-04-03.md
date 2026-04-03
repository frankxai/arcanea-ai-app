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
  - completed and already promoted to `main`

- `feat/provider-routing-tracing`
- Worktree: `C:\Users\frank\Arcanea-provider-tracing`
- Status: good active branch
- Current observed scope:
  - enrich project retrieval traces with available-vs-selected context metadata
  - enrich provider routing traces with route mode, API key source, focus hints, gates, and tools
  - keep the slice limited to project chat/runtime observability
- Current signal:
  - high-leverage and correctly scoped
  - verified in a clean worktree
  - ready for promotion to `main`
- Recommendation:
  - promote as a narrow verified tranche
  - leave DB-backed cost tracing for the post-Supabase slice

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

- `promote/agentdb-starlight-backend`
- Status: promoted to `main`
- Value delivered:
  - Starlight-backed local memory persistence
  - backend labeling on memory routes
  - isolated `agentdb` store test
  - narrow promotion of the safe subset only

- `promote/docs-graph-retrieval`
- Status: promoted to `main`
- Value delivered:
  - docs folded into project workspace graph surfaces
  - docs included in project retrieval selection and trace metadata
  - docs included in enrichment/progress signals
  - dedicated workspace doc panel and stronger docs API contract coverage

- `promote/provider-routing-tracing-main`
- Status: promotion slice complete in successor branch `promote/chat-runtime-metadata`
- Value delivered:
  - richer retrieval trace metadata with available-vs-selected context counts
  - deterministic provider routing trace payloads
  - route mode and API key source visibility for BYOK-first execution
  - focused trace test expansion without broader Agent OS/package churn
  - trunk-heal fixes for `worlds` fork typing, Living Lore frontmatter parsing, and chat-shell hydration mismatches

## Current Interpretation

If an agent starts now and wants the best available branch:

1. Read `AGENTS.md`
2. Read the latest `planning-with-files/*`
3. Read `docs/ops/MASSIVE_ACTION_LOG_2026-04-03.md`
4. Prefer `main` for durable docs/ops changes only
5. Treat `feat/docs-graph-retrieval` as completed work unless new follow-ups appear
6. Treat `feat/provider-routing-tracing` as historical source work and `promote/chat-runtime-metadata` as the current verified promotion slice
7. Treat `integration/agent-control-plane-unification` as review/staging territory, not as a production branch

## Immediate Next Decisions

- Keep the broader Agent OS / package tranche out of `main` until reviewed independently
- Keep live DB activation as the top external blocker once credentials are available
