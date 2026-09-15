# Worker Contract

## Job
Move one coherent slice toward:

A complete what-did-every-agent-do review of the Arcanea estate exists for the current week as HTML plus JSON in queen/reports

## Iteration Procedure
1. `node .loop/arcanea-week-chronicle/chronicle.mjs` — scans `git log --all --since=<7 days>` across the 9 tracked arcanea repos, aggregates lanes from branch names (`codex/*`, `agent/claude/*`, `agent/grok/*`), scans `.arcanea/image-lab/*/ledger.csv` for image runs, and writes `queen\reports\arcanea-week-<date>.html` + `.json`.
2. `node .loop/arcanea-week-chronicle/verify.mjs` — gate: both artifacts exist, all 9 repos covered, zero-commit repos listed explicitly.
3. Read-only with respect to every repo; the only writes are the two report artifacts. Enrichment (Slice 4): fold in starlight-bridge sessions and `.loop/*/runs.jsonl` ledgers.

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
