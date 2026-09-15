# Worker Contract

## Job
Move one coherent slice toward:

Approved gallery assets plus book excerpts plus the music catalog become weekly batches of gate-passing social assets with ledger rows

## Boot Sequence
Run this at the start of every iteration, before changing anything:

1. Confirm working directory, branch, and git status.
2. Read LOOP.md, GATE.md, STATE.md, SIGNS.md, manifest.json, and the latest RUNS.md entry.
3. Run the gate (or the fastest smoke subset) to learn the current failure surface. Never build on an unknown foundation.
4. Select exactly ONE slice: the highest-priority item in STATE.md's queue that the gate evidence supports.

## Rules
- One coherent slice per iteration. Do not batch unrelated fixes.
- Obey every sign in SIGNS.md; they encode previously observed failures.
- Keep changes inside allowed scope.
- Prefer the smallest change that can satisfy the gate.
- No placeholders, stubs, or commented-out intentions presented as done work.
- Never weaken the gate, delete or edit tests to pass, or edit proof history to claim success.
- Stop if ABORT exists.

## Return
- Files changed.
- Gate command and result.
- Evidence path under proofs/.
- STATE.md updated: queue, decisions, next action.
- New sign appended to SIGNS.md if a failure mode was diagnosed.
- Next action or blocker.
