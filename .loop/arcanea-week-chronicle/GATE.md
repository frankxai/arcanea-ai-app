# Verification Gate

## Must Pass
- The objective in LOOP.md is satisfied at the inspected revision.
- The primary gate passes or the verdict is NEEDS-HUMAN with concrete manual evidence.
- No forbidden scope was changed.
- State files and proof artifacts reflect the latest run.

## Commands
```bash
node .loop/arcanea-week-chronicle/verify.mjs
```

## Verifier Verdicts
- PASS: objective proven with evidence.
- ITERATE: fixable gap remains and next action is clear.
- FAIL: wrong objective, unsafe output, or misleading evidence.
- NEEDS-HUMAN: missing credentials, production authority, subjective taste, or unavailable evidence.

## Critical Rejects
- Gate was skipped, weakened, or unrelated to the objective.
- Worker changed forbidden scope.
- Latest PR SHA or inspected revision is stale.
- Fork/untrusted code path needs secrets.
- State hides a blocker or resets history.
