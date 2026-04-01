# Planning With Files

This directory is the execution control plane for Arcanea.

## Purpose

1. Keep one human-readable current state for all active agents.
2. Keep one ranked backlog with explicit verification gates.
3. Keep one changelog of what actually landed, not what was discussed.
4. Force task contracts so agents do not overlap blindly.

## Canonical Files

- `CURRENT_STATE_YYYY-MM-DD.md`: current branch/repo state, verification status, blockers, and promotion posture.
- `CURRENT_BACKLOG_YYYY-MM-DD.md`: ranked next actions with owner, scope, and verification command.
- `CURRENT_CHANGELOG_YYYY-MM-DD.md`: ledger of real changes that landed.
- `AGENT_EXECUTION_PROTOCOL_YYYY-MM-DD.md`: branch discipline, task contracts, and merge rules.

## Agent Rules

1. Read the newest `CURRENT_STATE`, `CURRENT_BACKLOG`, and `CURRENT_CHANGELOG` files before coding.
2. Verify whether remote `main` already contains the promotion slice before treating promotion as pending work.
3. Every substantial task must include:
   - scope
   - owner
   - files
   - non-goals
   - acceptance criteria
   - verification command
4. Treat the newest dated `CURRENT_*` files as authoritative until replaced.
5. Do not merge to `main` from a dirty worktree.
6. Verification evidence beats confidence.
