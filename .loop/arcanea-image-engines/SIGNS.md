# Signs

Guardrails learned from observed failures. The worker must read this file every
iteration and obey every sign. Append one sign per diagnosed failure mode.
Never delete or weaken a sign without explicit human approval.

## Universal
- Search the codebase before assuming something is not implemented.
- Implement fully or record the gap in STATE.md; no placeholder implementations.
- One slice per iteration; leave the tree clean or the mess documented.
- If the same failure appears twice, stop and diagnose instead of retrying harder.
- Re-read the actual error output; do not act on a remembered or assumed error.

## Learned
<!-- Append entries: YYYY-MM-DD | failure observed | guardrail adopted -->
