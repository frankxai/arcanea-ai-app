# Excellence review repair

Source task: `01a06ecf-6107-7e80-abe9-bb0fcdc9b7f2` — connect and improve Arcanea's app, worlds, books, skills and tools with evidence before promotion.

Scope: restore the visual-review workflow without changing the repository's action allowlist. Owner: the coordinating Arcanea task, branch `codex/arcanea-excellence-review-20260909`.

Files: `.github/workflows/excellence-loop.yml`, the small test step in `.github/workflows/ci.yml`, `scripts/excellence-review.mjs`, `scripts/excellence-artifact.py`, `scripts/excellence-review.test.mjs`, and this record. Other capability, book, Orthea and author-draft branches retain their ownership.

## Verified cause

Recent successful preview deployments triggered `Excellence loop` runs that ended in `startup_failure` with no jobs or logs. Run `34397215028` is one example. The live selected-actions policy allows GitHub-owned actions and `pnpm/action-setup@*`; verified third-party actions are disabled. Both `anthropics/claude-code-action@beta` references violate this policy. A regression test against the original file failed and named both uses before the replacement was written.

## Resulting behavior

The workflow now waits for a successful pull-request CI run, so screenshot artifacts exist before review. A manual dispatch can also select a successful CI run. Both execute repository-owned code from the default branch with GitHub-owned setup actions. There is no PR checkout, dependency installation, model tool access, content-write token, automatic code edit or push. The existing Gemini provider performs one bounded image critique per selected run; duplicate bot receipts suppress replay of that run. Repository action policy and secrets remain unchanged.

The reviewer verifies the CI workflow, same-repository PR association, current open/non-draft head, artifact source, tested merge parents, downloaded ZIP digest and report provenance. It reads selected archive members without extracting them. Archive entries, expansion, selected bytes, image dimensions, API response sizes, execution time and model output are bounded. ZIP paths, duplicates, symlinks, missing data and malformed verdicts fail closed. Provider credentials never enter prompts, subprocesses or model receipts.

Supported screenshot selections cover Orthea's five encounter states, Sovereign Depths' hero/grid/Vorrak views, and Weight of Wonders' hero/atlas/Orvess views. This is sample coverage, not every world or dossier. Other changed web files remain explicitly unassessed. Unknown-only routes receive a missing-evidence comment without a provider call. More than eight selected images requires a smaller review. Non-web package changes consume no image review. Book/author/studio coverage is a next bounded extension, owned with their route maintainers.

Output is `clear`, `refine` or `needs_review` for the supplied pixels. It is advisory and never substitutes for the rubric's full `ship` verdict or required CI. The comment and hashed receipt identify source, tested merge, CI run and sampled images. A head change before publication stops the comment. Bot identity is required for duplicate detection; arbitrary comment markers are not authority. Plain-text rendering prevents provider output from creating mentions, images or HTML.

## Verification and remaining release work

Local regression suite: 22 tests, including a real Python ZIP reader subprocess with 13 hostile archive cases and a valid PNG/JSON archive. The original action-policy regression was red before the repair. Local Node is 24; Node 22 CI remains the authoritative runtime gate. Normal exact-head independent code review, CI, and a real workflow run are still required before claiming the startup defect repaired in production.

Actual CI image data is evidence supplied by the reviewed branch, not an attestation that the branch cannot forge screenshots. No PR code executes in the secret-bearing reviewer. Live Vercel inspection, complete responsive/theme checks, measured contrast, keyboard reachability, alt text, canon/editorial approval and human playtesting remain separate. A successful API/code review is not a creative quality pass.

Acceptance: allowed actions start successfully; a real known CI artifact passes all identity checks and receives a bounded provider critique; stale/foreign/unsafe evidence cannot publish a verdict; required app build/type/lint checks pass. No author migration, product publication approval, npm release or public lore change is implied by this workflow repair.

Rollback: revert this scoped repair through normal protections. Preserve PR receipts and private evidence. Do not restore automatic branch writes or loosen the selected-actions policy to recover a failed review. No database or application-data rollback is involved.

References: [GitHub workflow-run security](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run), [GitHub privileged-workflow guidance](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/), [Gemini image inputs](https://ai.google.dev/gemini-api/docs/generate-content/image-understanding).

## Actual workflow result and response follow-up

PR389 merged normally as `fdf78d1a36ff691c375a6eabb595ba39f4a4e199` after full CI34401681814, CodeQL34401681806 and independent Gemini review34401677808 passed at `ab649bd872ab528334e9a6ac01a53d6dd9922e45`. All 22 boundary tests also passed under CI Node22. The six owned files were unchanged from the earlier reviewed candidate after rebasing onto the merged MCP preparation.

Actual default-branch dispatch34402936762 on Orthea CI34396938279 started correctly and reached independent image critique after all artifact checks. It then failed closed. No verdict, response artifact or PR comment was produced. The startup defect is resolved; successful visual critique remains unverified. The original generic failure log cannot distinguish an incomplete answer, a malformed/contradictory verdict or a provider/transport failure. These are hypotheses, not an established cause.

The follow-up owns only the reviewer, its tests, artifact-path list and this record. It records static boundary errors separately from unsafe generic error strings. A bounded private response receipt includes finish reason, numeric token counts and at most16000 characters of final-answer text, explicitly labeled untrusted. Thought parts, credentials, signed URLs and the provider envelope are excluded. No incomplete, blocked, malformed or contradictory response becomes a published verdict.

Gemini2.5Flash defaults to dynamic thinking. The request now explicitly caps thinking at1024 tokens within the unchanged4096 output-token ceiling, making the review budget predictable. This is a budget refinement, not proof that truncation caused the first failure. [Official thinking-budget documentation](https://ai.google.dev/gemini-api/docs/generate-content/thinking). No automatic retry or provider switch was added. A new reviewed default-branch run must establish the actual result before declaring the visual-review path complete.

The integration candidate also carries the exact four-file preview-range change from PR390, source `5ae8f293ae9d134b3ded52d5c54c03290f0808aa`, with its owner's provenance preserved. These two delivery fixes share one fresh review/CI cycle to avoid another strict-base rebuild between them. PR390 and its failed run34403086680 remain preserved: that run passed build/lint/types and13 Git fixtures, then observed416ms on the unchanged Orvess desktop radio (about410ms presentation delay, zero browser errors). This combined candidate does not change app code or the200ms gate and does not claim to repair that rendering delay. Fresh required CI and independent review remain mandatory. The original preview-range branch is not modified by this integration.
