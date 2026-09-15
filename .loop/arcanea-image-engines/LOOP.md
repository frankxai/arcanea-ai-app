# arcanea-image-engines

## Verdict
GO

## Objective
Every queued Arcanea creation brief is generated on its correct engine lane, ledgered, gated at 30 points, and approved assets are promoted with gallery-ready sidecars

## Loop Id
arcanea-image-engines

## Non-Goals
- Do not merge PRs, deploy to production, change secrets, mutate billing, or alter branch protection.
- Do not expand scope without explicit approval.
- Do not weaken tests, lint, typecheck, build, CI, or verifier rules to claim completion.

## Allowed Scope
- `.loop/arcanea-image-engines/**` (queue, dispatch, proofs)
- `.arcanea/image-lab/<run-id>/**` (new run workspaces, ledgers, galleries)
- `.arcanea/image-lab/approved/**` (promotion targets + sidecar JSON)

## Relationship To arcanea-image-lab
`.loop/arcanea-image-lab/` is the pre-existing Codex-only night-run contract and remains the worker contract for the gpt-image-2 lane. This loop is the multi-engine dispatcher above it: it routes briefs across four engine lanes (Higgsfield, Codex gpt-image-2, NB2, Grok Imagine) plus arcanea-mcp routed generation, and owns the shared ledger schema, gate, and promotion contract. Codex-lane batches keep obeying the image-lab contract; the other lanes mirror its discipline.

## Engine Lanes
| need | engine | harness | invocation |
|---|---|---|---|
| cinematic | higgsfield | claude | `higgsfield-generate` skill family (draft-then-4K) |
| text | gpt-image-2 | codex | Codex `image_gen` per `.loop/arcanea-image-lab/` |
| character | nb2 | antigravity | NB2 / `nb-generate.mjs` (GEMINI_API_KEY) |
| volume | grok-imagine | grok-cli | Grok CLI / Hermes agent |
| routed | arcanea-mcp | claude | `arcanea_generate_image` with TASTE reroll |

One engine lane per harness session (parallel-agents protocol). Production discipline for every lane: brief before generation, ledger row per asset, brand palette, no gate inflation.

## Forbidden Scope
- Credentials, billing, production mutation, destructive file operations, external sends, force pushes, and gate weakening without explicit approval.
- Broad refactors, dependency upgrades, or repo settings changes unless explicitly approved.
- Writing to untrusted fork PR branches or running secret-dependent code on untrusted changes.

## Actor Model
- Worker: coding agent or command specified in WORKER.md.
- Verifier: independent agent, reviewer command, CI, or `loop_cli.py verify` using VERIFIER.md.
- Human gate: required for unsafe actions, subjective judgment, forked PRs, missing secrets, flaky external services, and product/taste calls.

## Cadence
manual or scheduled night-run

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
node .loop/arcanea-image-engines/verify.mjs
```

Fallback/manual gate: document evidence in proofs/ and return NEEDS-HUMAN unless a human explicitly accepts the manual proof.

## Budgets
- Max iterations: 12
- Stop after same failure: 2
- Abort file: create ABORT in this directory.

## Resume
Run:

```bash
python <plugin>/scripts/loop_cli.py status --loop-dir .loop/arcanea-image-engines
python <plugin>/scripts/loop_cli.py run --loop-dir .loop/arcanea-image-engines
```
