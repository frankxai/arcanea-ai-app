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

## Native failure and memory-loss correction

CI36981919511 at `66a3562a62f8b913066ba4d2f1212edec59a74b6` passed
Install, Lint and TypeScript, plus the web build and existing quick tests, but
failed the newly wired SDK suite: 21 pass/one fail. Two records shared a
millisecond, so the old timestamp-only filename overwrote the first memory.
The failed run and its Build/CI Status verdicts are retained.

Correction scope: evolution module, policy tests, README and this record, at
base66a3562. Two deterministic regressions failed before the correction: three
same-timestamp concurrent writes retained one file; unsafe timestamp input was
accepted. Filenames now use a normalized timestamp plus random UUID and
exclusive creation. Parseable ISO timestamps are checked before directory
creation; the record retains the supplied timestamp. Existing memory filenames
remain readable. Directory-link containment and broad SDK promotion remain open.
This changes memory filenames, not memory content or public-canon authority.

Official Node22 docs confirm [exclusive file creation](https://nodejs.org/docs/latest-v22.x/api/fs.html#file-system-flags)
and [random UUID generation](https://nodejs.org/docs/latest-v22.x/api/crypto.html#cryptorandomuuidoptions).
The corrected source must pass its 24-case local/native suite and the complete
required checks, then receive an admitted exact-source different-harness review.
No passing rerun, review, rights grant or creator acceptance is inferred here.

## Continued file and Git boundaries

Previous turn made progress: current draft4991259381 passed CI36983223654,
local/nativeSDK24 and quick632. Issues283/276 and hubbb58990/draft98 were saved.
Full goal remains active. This next slice starts at that exact source1259381.

User job: inspect and build a creator-owned world without exporting undeclared
files, escaping its folder, staging unrelated edits or overwriting accepted lore.
Scope: contained world I/O and memory paths; shared declared-source filtering for
hash/index; YAML visibility failures closed; explicit Git paths and surfaced
failures; append-only local candidate outputs from agent helpers; types/docs/tests.
Files: world-sdk src/{world-paths,source-files,frontmatter,fs-world,contenthash,
index-build,harness,evolution,scaffold}.mjs, package.json, index.d.ts, README,
tests/{helpers,filesystem-boundary,source-boundary,git-boundary}.mjs,
tests/promotion-policy.test.mjs, pnpm-lock.yaml and this record.
Use yaml2.9.1 from the existing lock resolution; no local dependency install.
Local small Node22 tests may use the existing yaml2.9.0 with process-scoped
NODE_PATH; frozen nativeCI supplies the pinned2.9.1. No new repo/worktree/server.
Acceptance: red regressions for traversal/links/partial-batch hazards, undeclared
and ambiguous private sources, unrelated/pre-staged Git edits and silent errors;
shared hash/index selection; preserved accepted files; all local/native tests and
required checks at the resulting revision, then admitted independent review.
Stop at a reviewable draft; no merge/release or code/lore licence/Heart choice.
Rollback: scoped revert while retaining evidence; no production/data migration.
The cross-process parent-swap race requires a trusted stable filesystem and sole
Git worktree writer; portable path checks do not authenticate that environment.
Unexpected I/O failure may leave partial new files. General v1.1 validation,
scaffold publication defaults, human promotion and graph proofs remain open.

### File and Git verification before commit

The exact base1259381 failed all 34 initial boundary regressions; the log is
retained. After implementation and four additional retry/metadata/custom-root
cases, the formatted Node22.23.2 suite passed62/62 with no skipped cases.
Local YAML resolution is the existing2.9.0 via process-scoped NODE_PATH; native
frozen CI must verify the direct2.9.1 dependency. No install was performed.
The lockfile change is four importer lines using an existing resolution; its
native pnpm format is retained per the repository's .prettierignore.

Read/hash/index now follow declared content and local policy/media pointers.
Remote HTTP(S) pointers remain metadata. Actual Markdown visibility/status is
parsed with duplicate-key/type/ambiguity rejection, including CRLF; supplied
public flags cannot override a private or candidate document. Non-public world
hash/index/proof operations reject before adapters. Agent helper writes are
unique local private CANDIDATE documents, without modifying accepted sources.
Write batches prevalidate portable paths and existing destinations; links,
hardlinks, aliases, locked canon and existing scaffold output are refused.
Git commits require explicit regular files at the repository root, refuse foreign
staged changes and redirected Git environments, and surface failures. Context
commits track their own paths and retain them after signing failures for retry.
These APIs still require caller ownership, stable trees and a sole Git writer;
the pending human receipt and full graph acceptance are not implemented.

Fresh independent-review admission at2026-10-02T09:24:33.895Z is HOLD:
5417MiB free/6144 required,32 task runtimes/12 budget. No provider was invoked.
An exact-source complete review packet will be saved; draft499 cannot be promoted
without admitted different-harness review and all native required checks.
The capability-loading path named by home instructions is absent both from the
local canonical config checkout and its current HEAD; no missing guide is
treated as permission to activate a provider or bypass admission.

### Native format correction

CI36990060684 at15d2a27cfad31241620ab0e1bc57713b4fcfbeb5 passed its
frozen Install and TypeScript checks; Lint failed the changed-file Prettier
check on packages/world-sdk/package.json. The local standalone formatter used
the general JSON parser instead of Prettier's inferred json-stringify parser
for package.json. Correct the package format with the same pinned3.9.9;
SDK runtime, dependency version and four-line lock importer remain unchanged.
Retain this failed run and verify all required checks at the corrected source.

The initial native Build completed successfully:SDK62/62 and quick632/632
under frozen YAML2.9.1, plus web build and existing boundary/rendered checks.
CI Status failed because Lint failed; it is retained as failure, not green.
The correction changes only JSON layout and this record. An exact parsed-JSON
comparison verifies no package metadata or dependency semantics changed.
