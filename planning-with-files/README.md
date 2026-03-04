# Planning With Files

This directory is the execution control plane for Arcanea.

## Purpose

1. Keep a single source of truth for active priorities.
2. Force explicit problem -> solution -> owner -> verification mapping.
3. Standardize quality gates and reduce AI slop regressions.

## Files

- `truth-layer.json`: machine-readable state for active phases, blockers, and owners.
- `ALIGNMENT_BOARD.md`: tactical board with actionable checklists.
- `MASSIVE_ACTION_2026-03-04.md`: current stabilization strategy and standards contract.
- `HANDOFF_TEMPLATE.md`: mandatory end-of-task handoff format.

## Operating Rules

1. Every significant change must update `truth-layer.json` and `ALIGNMENT_BOARD.md`.
2. Every fix item must include owner + verification command.
3. No deploy PR is complete without build evidence and rollback notes.
