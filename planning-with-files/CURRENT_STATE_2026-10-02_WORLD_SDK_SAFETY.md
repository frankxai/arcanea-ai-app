# World SDK promotion and rights boundary

Source task: `01a0f74f-8bad-7db1-ab06-fd89b5faec84`.
Owner: Codex, branch `agent/codex/arcanea-world-sdk-safety-20261002`.
Exact base: `b86549cd04562471a677301e5c095cd6f093919e`.
Owning issues: [#283](https://github.com/frankxai/arcanea-ai-app/issues/283) and program [#276](https://github.com/frankxai/arcanea-ai-app/issues/276).

User job: create a portable world without an SDK selecting commercial terms,
royalties or turning private memory into accepted canon.
Local decision: one public Arcanea integration repo; locked canon stays in place;
licence choices stay with Frank and each world creator. This slice implements
the existing issue's direct memory-promotion block, not a new world schema.

Scope: block `evolveCharacter` and `evolve` before filesystem access; omit implicit
licence/royalty policies and proof pointers; preserve caller-supplied policies;
prevent `createWorld` model output from selecting those policies; update the CLI,
types, docs and meaningful regression tests; run the SDK suite in native CI.
Files: `packages/world-sdk/src/{evolution,manifest,scaffold,proof}.mjs`,
`packages/world-sdk/bin/cli.mjs`, `packages/world-sdk/index.d.ts`,
`packages/world-sdk/README.md`, `packages/world-sdk/tests/{world-sdk.e2e,promotion-policy}.test.mjs`,
`.github/workflows/ci.yml` and this record.
Relevant skills: none required for this small existing ESM package repair.
Budget: one lead, existing sparse worktree and Node22; no dependency installs,
local full build, new worktree, server, browser or provider fanout.
Acceptance: rights-unselected scaffold has no policy fields/files; explicit
caller values survive; model policy injection is ignored by `createWorld`;
both legacy promotion APIs and CLI reject with `CANON_PROMOTION_REQUIRES_REVIEW`
and preserve world bytes/hash, even with a forged approval option or unsafe slug.
Verification: red regressions against the exact base, SDK Node22 tests, native
Install plus Build/Lint/TypeScript/CI Status at the resulting revision; required
different-harness review before promotion.
Stop condition: reviewable draft with exact-source receipts. No merge/release.
Rollback: revert the exact scoped commit; no production/data migration exists.

## Limits retained

This is a breaking safety restriction: callers must handle rejected evolution.
No human promotion-receipt verifier or candidate schema is implemented here.
Existing worlds and explicit policies are not rewritten or legally cleared.
Package metadata does not grant rights over generated or imported content.
Scaffold policy summaries are declarations, not full legal licence texts.
Source/hash filtering, contained world writes, exact Git staging, surfaced commit
failures, v1.1 validation and other public-canon writers remain open under #283.
Scaffolds still use existing public visibility/canon-level defaults; this slice
does not establish a safe public release or general agent promotion boundary.
Real-chain adapters, creator acceptance, signed human promotion and revenue
acceptance remain unverified. All world outputs are local test fixtures.
Draft #487 and its attribution evidence remain on their existing branch.

## Verification receipt

The eleven initial policy/promotion regressions failed against the exact base
before implementation (0 pass, 11 fail). The repaired Node22.23.2 suite passed
22 tests: thirteen policy/promotion cases and nine existing SDK integration
cases. Two additional explicit-summary/custom-pointer cases were added after
the baseline run; they are not counted as baseline red evidence.
Temporary fixtures clean up only their verified, session-created temp folders.
Formatting uses the existing pinned Prettier3.9.9, with no install.

Different-harness review is not invoked: PP at 2026-10-02T07:59:18.866Z returned
HOLD, with 5232MiB free versus 6144 required and 32 task runtimes versus a budget
of 12. No reviewer PID, provider verdict or spend is claimed. The complete
exact-source review packet is preserved privately for an admitted review.
Native CI and draft/issue receipts will bind the resulting commit on #283/#276;
this local receipt does not claim those pending checks have passed.
