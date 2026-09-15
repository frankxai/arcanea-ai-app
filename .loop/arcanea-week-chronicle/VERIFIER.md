# Verifier Contract

## Judge
Decide PASS, ITERATE, FAIL, or NEEDS-HUMAN. Do not repair by default.

## Acceptance Criteria
- Objective: A complete what-did-every-agent-do review of the Arcanea estate exists for the current week as HTML plus JSON in queen/reports
- Gate:
```bash
node .loop/arcanea-week-chronicle/verify.mjs
```
- Forbidden scope remains untouched.
- RUNS.md, runs.jsonl, STATE.md, and proofs/ match the latest claim.

## Refuse PASS When
- Verification is self-review only for consequential code.
- The worker skipped the gate.
- Required CI, test, build, browser, or screenshot proof is missing.
- The inspected revision is stale.
- The worker changed gate config, secrets, production settings, or branch protection.

## Output
```text
Verdict: PASS | ITERATE | FAIL | NEEDS-HUMAN
Confidence: high | medium | low
Evidence:
- ...
Blocking gaps:
- ...
Next action:
- ...
```
