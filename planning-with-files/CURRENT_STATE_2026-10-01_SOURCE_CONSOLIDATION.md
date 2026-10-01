# Arcanea source consolidation evidence

Source task: `01a0f74f-8bad-7db1-ab06-fd89b5faec84`.
Owner: Codex, branch `agent/codex/arcanea-source-consolidation-20261001`.
Base: `2b9a0a5e421d39d272a0f00fef764b3cbe10b3b3` (GitHub main matched by ls-remote).
Owner issue: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276).
State: local proposal and source-audit implementation; broader goal active.

Scope: verify the one-source Arcanea proposal; define repo, skill/plugin/MCP, community and revenue boundaries with evidence.
Files: `scripts/audit-skill-sources.mjs`, `scripts/audit-skill-sources.test.mjs`, `docs/strategy/arcanea-source-consolidation-2026-10-01.md`, this record.
Non-goals: license changes, archives, canon edits, skill migrations, plugin installs, deployment, commerce changes and runtime fanout.
Acceptance: reproducible committed-source inventory; duplicate variants visible; source/root scoping; working edits excluded; rights evidence never labeled clearance; full ecosystem proposal linked to existing issue.
Verification: Node 22.23.2 via fnm, matching `.nvmrc` 22. Two Node tests passed, covering scalar-name review, Unicode byte parsing, identical/variant duplicates, immutable ref, dirty/untracked exclusion, root restriction, traversal and invalid refs. Inventory: 261 paths, 31 duplicated recognized names (28 identical skill texts, three variants), no root license.
Rollback: revert the four exact files; no production or data side effects.

## Current findings

- Use the app as proposed public Arcanea integration source, with shared dependencies retaining owners until an actual contract migration.
- Reuse `packages/arcanea-skills/skills` as proposed curated root; it is not already a cleared public pack.
- Root plugin and skills package still reference the old Arcanea repository; blanket install exposes development sources.
- Canon's Heart-frequency conflict is inside `CANON_LOCKED.md`; ruling pending.
- Local MCP directory points to private `arcanea-mcp-generate`, not the nonexistent GitHub `arcanea-mcp` name.
- `skill-bundles` has no origin and its launcher worktree is another harness's lane. Root support is specified, not implemented here.
- Routing guard, explicit-file check and lane ownership passed. Workload/storage admission was checked; a sparse isolated worktree avoided checking out the full app or installing dependencies. Machine details and control-plane limitations are in the private hub handover.

## Verification boundaries

Inventory tests are local CLI evidence, not full app lint/typecheck/build or installer evals. No independent provider review yet. Emil/Apple skills selected and read, applied to proposed website acceptance, reduced motion/focus/touch/interruption runtime verification not applicable to this non-UI change. Proposed policy is not merged or loaded by any installed consumer.

Next bounded action: review the proposal against #276, obtain rights/Heart rulings, and coordinate the root-selector change with the existing launcher owner. Then choose four skill survivors from exact paths with support files, provenance and failing/passing evals before migration.

## Release-guide reconciliation, October 1

Scope: correct active-looking mirror, dual-remote, direct-merge and age-based
archive guidance in existing docs/ops/RELEASE_POLICY.md and .arcanea/MASTER_PLAN.md.
Owner: Codex, existing consolidation branch/draft #487; #276/#408/#427.
Exact base for this slice: 5327861370c95748764017dc2e022b67b4abb348.
Files: those two guides and this existing task record.
Acceptance: one public integration source; canon remains in place; no app mirror
or dual pushes; pinned folder consumers distinguished from pending launcher;
no direct-merge exception or age-only deletion; historical tasks preserved;
current exact-SHA checks, review and human gates stated without claiming actual
environment/protection enforcement or installed consumer compatibility.
Non-goals: canon, source skills/runtime, workflows/protection, archive/rename,
licensing, merge, release or deployment changes. No new repo, worktree or guide.
Verification: inspect the bounded documentation diff, preserve historical
milestone/extraction references, formatter and enabled secrets, exact-head CI.
No implementation-mirroring tests are added for this documentation change.
Rollback: scoped revert of the three-file policy slice, preserving other work.

Fresh GitHub metadata: app, arcanea and records are public, unarchived, default
main. arcanea-code and oh-my-arcanea are public/unarchived with default dev;
their earlier production/master release-branch claims are not reasserted.
Other proposed retirement statuses and branch/environment protections are not
verified by this slice. Different-harness policy review remains required before
promotion; prior unavailable review paths are not counted as sign-off.
Reader draft #490 remains separately at 60fcf333b4, with four required CI checks
and 13 native reader tests passing. Its branch remains intact; this worktree is
back on the consolidation branch. Full creator/world/revenue objective active.
