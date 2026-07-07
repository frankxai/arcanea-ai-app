# Worker Contract

## Job
Move one coherent slice toward:

Every queued Arcanea creation brief is generated on its correct engine lane, ledgered, gated at 30 points, and approved assets are promoted with gallery-ready sidecars

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

## Iteration Procedure
1. `node .loop/arcanea-image-engines/dispatch.mjs --dry-run` — read `briefs/queue.jsonl`, decide the engine lane per the LOOP.md lane table, append `queued` ledger rows to the run workspace, write `proofs/latest-dispatch.json`.
2. For the ONE selected brief (one slice): generate on its lane using the invocation in LOOP.md. Every brief must exist as a full creation brief (`~/.claude/skills/lumina/references/creation-brief.md` skeleton) before generation. Higgsfield lane: draft first, 4K only after the draft passes inspection.
3. Update the asset's ledger row: `gate_30_score`, `gate_verdict`, `ship_status`, `failure_modes`, `next_improvement`. Scores use the 30-point scale — 29-30 flagship, 26-28 approved, 22-25 iterate, 0-21 restart. First generations are raw plates.
4. Promote approved/flagship assets: copy to `.arcanea/image-lab/approved/<YYYY-MM-DD>/` and write the sidecar `<asset>.json` (world, characters, canon_refs, engine, harness, model, prompt, gate_30_score, gate_verdict, run, created) — the gallery-sync input contract.
5. Run the gate: `node .loop/arcanea-image-engines/verify.mjs`.

## Ledger Schema (every asset, every engine)
`id, ts, run, batch, engine, harness, model, request_id, prompt_file, asset_path, use_case, world, characters, canon_refs, gate_30_score, gate_verdict, ship_status, failure_modes, next_improvement`

`ship_status`: raw | iterate | approved | flagship | killed. Run workspaces live at `.arcanea/image-lab/<run-id>/` with `ledger.csv`, `prompts.jsonl`, `oversight.md`.

## Canon Protocol
Before writing any brief: read `.arcanea/lore/CANON_LOCKED.md` plus the relevant canon layer. Never contradict locked canon; new lore is a marked proposal for Frank.

## Return
- Files changed.
- Gate command and result.
- Evidence path under proofs/.
- STATE.md updated: queue, decisions, next action.
- New sign appended to SIGNS.md if a failure mode was diagnosed.
- Next action or blocker.
