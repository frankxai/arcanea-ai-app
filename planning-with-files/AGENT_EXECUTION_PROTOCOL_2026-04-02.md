# Agent Execution Protocol - 2026-04-02

## Read Order

Every agent must read:

1. `AGENTS.md`
2. newest `planning-with-files/CURRENT_STATE_*`
3. newest `planning-with-files/CURRENT_BACKLOG_*`
4. newest `planning-with-files/CURRENT_CHANGELOG_*`
5. newest `planning-with-files/AGENT_EXECUTION_PROTOCOL_*`
6. `.arcanea/CLAUDE.md`

## Task Contract

Every substantial task must define:

```text
Scope:
Owner:
Files:
Non-goals:
Acceptance criteria:
Verification:
```

## Branch Rules

- Never work directly on a dirty `main` worktree.
- Create a branch or a fresh worktree for any substantial change.
- If another agent is already changing a surface, either avoid overlap or make integration the explicit task.
- Promotion to `main` requires clean verification evidence.

## Verification Rules

- Use exact commands, not assumptions.
- Keep verification attached to the task contract.
- For current project-workspace work:

```text
pnpm run verify:project-workspaces
pnpm --dir apps/web test:media
```

## Source Of Truth Rules

- `planning-with-files/` = live execution control
- `.arcanea/` = shared intelligence substrate
- tool-specific files are pointers, not independent strategy documents

## Repo Focus

- `arcanea-ai-app` remains the product center until DB activation, docs promotion, and graph retrieval are fully live
- other repos should not be modified casually without explicit ownership and merge review
