# Current State - 2026-06-12

Status: integration pass in progress
Branch: `integrate/agent-native-main-2026-06-12`
Base: `origin/main` at `c7af7cab`

## Summary

Arcanea is being consolidated around a green-main, agent-native posture. The
working strategy is audit-and-cherry-pick, not wholesale branch merging.

This pass updated the public repository entrypoints and architecture docs so
the GitHub surface matches the product north star in `AGENTS.md`: BYOK-first
creative intelligence workspace with projects, continuity, docs, memory,
creations, provenance, project graph context, workflow orchestration, creator
and social compounding.

## Integrated

- Fresh integration branch created from `origin/main`.
- Cherry-picked `b5b580fa`:
  - `packages/orchestrator/src/cli.ts`
  - reports orchestrator CLI version `1.2.1`.
- Root public entrypoints added or updated:
  - `README.md`
  - `llms.txt`
  - `LICENSE`
  - `CONTRIBUTING.md`
  - `SECURITY.md`
  - `CODE_OF_CONDUCT.md`
  - `SUPPORT.md`
  - `GOVERNANCE.md`
- Architecture docs added:
  - `docs/architecture/arcanea-os.md`
  - `docs/architecture/sis-memory.md`
  - `docs/architecture/palace.md`
  - `docs/architecture/verticals.md`
- `.gitignore` updated so root community health files can be tracked.

## Current Decisions

- Public posture: agent-native product first.
- Merge policy: audited cherry-picks only.
- SIS is the canonical continuity substrate.
- Palace and vertical language must map to real product state and actions.
- Package-level memory systems must integrate with SIS or be documented as
  legacy/adapters.

## Open Follow-Ups

- Run full verification after docs and branch audit are committed.
- Reconcile the untracked `planning-with-files/PLAN_UNIVERSAL_MARKETPLACE_2026-05-27.md`
  separately; it existed before this integration pass and was not staged.
- Decide whether `.antigravitycli/` is personal local state or repo state before
  staging; it existed before this pass and was not touched.
- Continue branch salvage from `CURRENT_BRANCH_AUDIT_2026-06-12.md`.
- Implement SIS memory hygiene: index reconciliation, TTL, vault path resolution,
  and handoff drift checks.

## Verification Target

```bash
pnpm install --frozen-lockfile
pnpm run type-check
pnpm run lint
pnpm run build
pnpm run verify:project-workspaces
pnpm run sis:check
pnpm run sis:contracts
pnpm run agents:bridge:check
pnpm --dir apps/web test:media
```

## Rollback

Revert the integration branch commits or reset the branch to `origin/main`.
Do not reset or clean unrelated untracked files.
