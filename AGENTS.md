# Arcanea Agent Contract

This file is the repo-level entrypoint for every coding agent working in Arcanea.

## Source Of Truth Order

Agents must read and obey these sources in this order:

1. `AGENTS.md`
2. newest files in `planning-with-files/`
3. `.arcanea/CLAUDE.md`
4. `.arcanea/MASTER_PLAN.md`
5. `.arcanea/lore/CANON_LOCKED.md` when touching lore, guardians, voice, or mythology

`.arcanea/` is the shared intelligence substrate for Claude, Codex, Cursor, Gemini, opencode, and internal Arcanea agents.

## Product North Star

Arcanea is a BYOK-first creative intelligence workspace.

The core product centers on:
- projects
- continuity
- docs
- memory
- creations
- provenance
- project graph context
- workflow orchestration
- creator and social compounding over time

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

## Branch Discipline

- Never work directly on a dirty `main` worktree.
- Use a fresh branch or worktree for substantial changes.
- Keep promotion slices narrow and verifiable.
- If another agent is already editing a surface, avoid overlapping writes unless integration is the explicit task.

## Verification

- Verification evidence beats confidence.
- Use the verification command attached to the task contract.
- For active project-workspace work, prefer:

```text
pnpm run verify:project-workspaces
pnpm --dir apps/web test:media
```

## Planning With Files

Use `planning-with-files/` as the execution control plane:
- `CURRENT_STATE_*` = what is true now
- `CURRENT_BACKLOG_*` = what happens next
- `CURRENT_CHANGELOG_*` = what landed
- `AGENT_EXECUTION_PROTOCOL_*` = branch and merge rules

Agents must update these files when materially changing repo direction, promotion posture, or shared operating rules.
