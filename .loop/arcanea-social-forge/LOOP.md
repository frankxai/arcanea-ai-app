# arcanea-social-forge

## Verdict
MANUAL-FIRST

## Objective
Approved gallery assets plus book excerpts plus the music catalog become weekly batches of gate-passing social assets with ledger rows

## Loop Id
arcanea-social-forge

## Non-Goals
- Do not merge PRs, deploy to production, change secrets, mutate billing, or alter branch protection.
- Do not expand scope without explicit approval.
- Do not weaken tests, lint, typecheck, build, CI, or verifier rules to claim completion.

## Allowed Scope
- Work required to satisfy the objective inside the current branch, worktree, or explicitly assigned slice.

## Forbidden Scope
- Credentials, billing, production mutation, destructive file operations, external sends, force pushes, and gate weakening without explicit approval.
- Broad refactors, dependency upgrades, or repo settings changes unless explicitly approved.
- Writing to untrusted fork PR branches or running secret-dependent code on untrusted changes.

## Actor Model
- Worker: coding agent or command specified in WORKER.md.
- Verifier: independent agent, reviewer command, CI, or `loop_cli.py verify` using VERIFIER.md.
- Human gate: required for unsafe actions, subjective judgment, forked PRs, missing secrets, flaky external services, and product/taste calls.

## Cadence
designed only - activation is Slice 3

## State
- Machine contract: manifest.json
- Human state: STATE.md
- Append-only human ledger: RUNS.md
- Append-only machine ledger: runs.jsonl
- Proof artifacts: proofs/
- Per-PR state: prs/PR-<number>.md when `stateMode` is `per-pr`.

## Verification
Primary gate:

```bash
# Manual verification required
```

Fallback/manual gate: document evidence in proofs/ and return NEEDS-HUMAN unless a human explicitly accepts the manual proof.

## Budgets
- Max iterations: 8
- Stop after same failure: 2
- Abort file: create ABORT in this directory.

## Resume
Run:

```bash
python <plugin>/scripts/loop_cli.py status --loop-dir .loop/arcanea-social-forge
python <plugin>/scripts/loop_cli.py run --loop-dir .loop/arcanea-social-forge
```
