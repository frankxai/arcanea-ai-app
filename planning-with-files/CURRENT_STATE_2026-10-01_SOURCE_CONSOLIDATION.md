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
- Routing guard and explicit-file check passed through the bootstrap fallback. Registry discovery and canonical capability-loading/storage-sensor files are absent in the current control-plane branch; not repaired by this product slice.
- PP interactive admission allowed one workload with 5,541 MB free RAM; new swarms paused. Fresh C: free space was about 16%, above the worktree floor. A sparse isolated worktree avoided checking out the full app or installing dependencies.

## Verification boundaries

Inventory tests are local CLI evidence, not full app lint/typecheck/build or installer evals. No independent provider review yet. Emil/Apple skills selected and read, applied to proposed website acceptance, reduced motion/focus/touch/interruption runtime verification not applicable to this non-UI change. Proposed policy is not merged or loaded by any installed consumer.

Next bounded action: review the proposal against #276, obtain rights/Heart rulings, and coordinate the root-selector change with the existing launcher owner. Then choose four skill survivors from exact paths with support files, provenance and failing/passing evals before migration.
