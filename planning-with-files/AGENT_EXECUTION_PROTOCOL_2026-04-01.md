# Agent Execution Protocol — 2026-04-01

## Before Coding

Every agent should read:

1. `planning-with-files/CURRENT_STATE_2026-04-01.md`
2. `planning-with-files/CURRENT_BACKLOG_2026-04-01.md`
3. `planning-with-files/CURRENT_CHANGELOG_2026-04-01.md`

## Task Contract Template

Use this before any substantial task:

```text
Scope:
Owner:
Files:
Non-goals:
Acceptance criteria:
Verification:
```

## Branch Discipline

- Do not work directly on a dirty `main` worktree.
- Use a fresh worktree or clean branch for promotion work.
- Promotion to `main` requires clean verification evidence.
- If `main` moves materially, reverify in a clean worktree from current remote `main`.

## Verification Hierarchy

- Product slice verification beats intuition.
- Prefer exact commands over “should work”.
- For this current slice, the required gate is:

```text
pnpm run verify:project-workspaces
pnpm --dir apps/web test:media
```

## Merge Rules

- Merge narrow, verified slices.
- Do not bundle unrelated cleanup into promotion branches.
- Keep DB activation, lint debt, and feature expansion as separate tasks if they are not required for the current promotion.

## Planning With Files Rules

- `CURRENT_STATE_*` = what is true now
- `CURRENT_BACKLOG_*` = what should happen next
- `CURRENT_CHANGELOG_*` = what actually landed
- newest dated files supersede older ones
