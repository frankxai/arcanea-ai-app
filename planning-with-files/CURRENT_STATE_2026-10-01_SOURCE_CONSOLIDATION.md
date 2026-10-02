# Arcanea source consolidation evidence

Source task: `01a0f74f-8bad-7db1-ab06-fd89b5faec84`.
Owner: Codex, branch `agent/codex/arcanea-source-consolidation-20261001`.
Base: `2b9a0a5e421d39d272a0f00fef764b3cbe10b3b3` (GitHub main matched by ls-remote).
Owner issue: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276).
State: local proposal and source-audit implementation; broader goal active.

Scope: verify the one-source Arcanea proposal; define repo, skill/plugin/MCP, community and revenue boundaries with evidence.
Files: `scripts/audit-skill-sources.mjs`, `scripts/audit-skill-sources.test.mjs`, `docs/strategy/arcanea-source-consolidation-2026-10-01.md`, this record.
Non-goals: license changes, archives, canon edits, skill migrations, plugin installs, deployment, commerce changes and runtime fanout.
Acceptance: reproducible committed-source inventory; duplicate variants visible; source/root scoping; working edits excluded; rights evidence never labeled clearance; full ecosystem proposal linked to existing issue.
Verification: Node 22.23.2 via fnm, matching `.nvmrc` 22. Two Node tests passed, covering scalar-name review, Unicode byte parsing, identical/variant duplicates, immutable ref, dirty/untracked exclusion, root restriction, traversal and invalid refs. Inventory: 261 paths, 31 duplicated recognized names (28 identical skill texts, three variants), no root license.
Rollback: revert the four exact files; no production or data side effects.

## Current findings

- Use the app as proposed public Arcanea integration source, with shared dependencies retaining owners until an actual contract migration.
- Reuse `packages/arcanea-skills/skills` as proposed curated root; it is not already a cleared public pack.
- Root plugin and skills package still reference the old Arcanea repository; blanket install exposes development sources.
- Canon's Heart-frequency conflict is inside `CANON_LOCKED.md`; ruling pending.
- Local MCP directory points to private `arcanea-mcp-generate`, not the nonexistent GitHub `arcanea-mcp` name.
- `skill-bundles` has no origin and its launcher worktree is another harness's lane. Root support is specified, not implemented here.
- Routing guard, explicit-file check and lane ownership passed. Workload/storage admission was checked; a sparse isolated worktree avoided checking out the full app or installing dependencies. Machine details and control-plane limitations are in the private hub handover.

## Verification boundaries

Inventory tests are local CLI evidence, not full app lint/typecheck/build or installer evals. No independent provider review yet. Emil/Apple skills selected and read, applied to proposed website acceptance, reduced motion/focus/touch/interruption runtime verification not applicable to this non-UI change. Proposed policy is not merged or loaded by any installed consumer.

Next bounded action: review the proposal against #276, obtain rights/Heart rulings, and coordinate the root-selector change with the existing launcher owner. Then choose four skill survivors from exact paths with support files, provenance and failing/passing evals before migration.

## Release-guide reconciliation, October 1

Scope: correct active-looking mirror, dual-remote, direct-merge and age-based
archive guidance in existing docs/ops/RELEASE_POLICY.md and .arcanea/MASTER_PLAN.md.
Owner: Codex, existing consolidation branch/draft #487; #276/#408/#427.
Exact base for this slice: 5327861370c95748764017dc2e022b67b4abb348.
Files: those two guides and this existing task record.
Acceptance: one public integration source; canon remains in place; no app mirror
or dual pushes; pinned folder consumers distinguished from pending launcher;
no direct-merge exception or age-only deletion; historical tasks preserved;
current exact-SHA checks, review and human gates stated without claiming actual
environment/protection enforcement or installed consumer compatibility.
Non-goals: canon, source skills/runtime, workflows/protection, archive/rename,
licensing, merge, release or deployment changes. No new repo, worktree or guide.
Verification: inspect the bounded documentation diff, preserve historical
milestone/extraction references, formatter and enabled secrets, exact-head CI.
No implementation-mirroring tests are added for this documentation change.
Rollback: scoped revert of the three-file policy slice, preserving other work.

Fresh GitHub metadata: app, arcanea and records are public, unarchived, default
main. arcanea-code and oh-my-arcanea are public/unarchived with default dev;
their earlier production/master release-branch claims are not reasserted.
Other proposed retirement statuses and branch/environment protections are not
verified by this slice. Different-harness policy review remains required before
promotion; prior unavailable review paths are not counted as sign-off.
Reader draft #490 remains separately at 60fcf333b4, with four required CI checks
and 13 native reader tests passing. Its branch remains intact; this worktree is
back on the consolidation branch. Full creator/world/revenue objective active.

## Independent guide review and correction

Both source CI36909193888 and description-edited CI36910266070 completed
SUCCESS at 411ec427e79c01020562f1a187df0bdabc4aa1d3: Install and the four
required checks. Sonnet 4.6 independently reviewed the full three-document
guide change at that exact revision and returned scoped PASS with two LOW
findings. Markdown formatting had made historical queue numbering ambiguous
and corrupted the reading*progress/pb*\* table identifiers. The correction
labels historical item numbers non-authoritative and protects the identifiers
with code spans; source history and actual database state are not modified.
Scope of this correction: MASTER_PLAN and this task record, base411ec427e7.
Formatter, enabled secrets, new-head CI and a bounded independent delta check
must bind the corrected candidate. The full PR/skills/reader/release remains
outside this guide verdict. No passport, rights or readiness promotion follows.

The tool-free high-effort review completed in158seconds on Claude Code2.1.287
with a240second deadline after a separate response-health probe succeeded.
Provider receipt identifies first-party claude-sonnet-4-6; reported review
cost is $0.424038 list equivalent, not billed subscription spend. Earlier
zero-output timeout attempts are retained; the new result does not diagnose
their individual causes. Complete input/output/hash/usage receipts are private.
Hub save remains held by the Queen handover lane; product evidence is on #427.

## Independent package-core review reconciliation

The corrected guide source e2012e95de passed CI36912589855 and the independent
documentation delta check. A separate full seven-file package-core review at
that SHA returned REVISE: one MEDIUM runtime-floor finding, two LOW filesystem
and assertion findings, and one INFO undocumented-export observation. It did
not inspect skill instructions/examples or approve the whole PR or release.

The package now declares Node >=22, matching the repository's .nvmrc/CI baseline,
and documents the existing identity/location exports. Official Node docs record
structuredClone since17 and node:test since18/16.17; the review's blanket claim
that node:test is absent from all Node16 is corrected. No Node16 runtime test was
performed. The earlier >=16 floor nevertheless advertised a development workflow
that uses APIs beyond that floor; Node22 is the supported, tested repo baseline.

The destination-parent race remains explicitly documented in code and README.
Path-based checks cannot guarantee containment when another local process swaps
a parent between check and write; adding another check would not remove that
race. This candidate installer requires trusted, stable home/source trees.
The source-junction test accepts both legitimate validation errors; the reviewer
inferred a Windows variation without executing it. No protection, passport,
rights or ready state is promoted. The INFO API exports are now documented.

Verification: the first local test invocation lacked the checkout's yaml dependency
and failed; rerun uses existing local yaml2.9.0 via process-scoped NODE_PATH,
without installing dependencies. Frozen CI resolves the pinned yaml2.9.1.
Formatter, enabled secrets, candidate-head CI and independent delta review remain
required. The hub's former foreign lane is now clear and an owned save is queued.
Scope: package.json, README, installer comment, junction-test assertion and this
task record, basee2012e95de. Rollback: revert those exact changes. Full goal active.

## Imported skill notice evidence follow-up

Scope: existing immutable source auditor and selected import evidence, under #276
and draft #487. Owner: Codex in the assigned source-consolidation worktree.
Base: `0a04c976d66f2f2d12aa895060f94c6c089f635b`.
Files: `scripts/audit-skill-sources.{mjs,test.mjs}`,
`docs/strategy/arcanea-skill-rights-evidence-2026-10-01.{md,json}`,
`.github/workflows/ci.yml` and this record.
User job: safely discover and reuse curated Arcanea skills without assuming that
publicly visible development imports have blanket redistribution rights.
Acceptance: recognize preserved upstream notice filenames, bind exact notice
bytes to a commit and retain unreviewed applicability; document the selected
restricted copies and provenance gaps without selecting licences or changing canon.
Verification: four focused Node 22 tests passed locally, including the new notice
fixture. The existing CI package-test step now also runs those fixtures; test:quick
did not include this auditor. Exact delta review and source CI will be recorded
in the PR/issue and hub.
Non-goals: rights clearance, whole-repo inventory, current-tree deletion, history
rewrite, public copy correction, provider/consumer installation, merge or release.
Rollback: reviewed revert of this delta; preserve import and failed-attempt evidence.
Budget/stop: one sequential text/audit/review workload, no installs or full app
build. Stop on routing/ownership/admission failure or failed verification.

The receipt measures ten skill bodies/notices at base and main
`e863be8304fdde9f00ba812d7845d66ec52787b9`, with identical local bytes between
those trees. Eight document-skill copies carry restrictive Anthropic notices;
algorithmic-art preserves Apache 2.0 with a placeholder copyright appendix;
apple-design preserves Emil Kowalski's MIT notice. Nine notices match pinned
current upstream, zero skill bodies do. Current-upstream comparison is not proof
of import revision, contractual authorization or supporting-resource rights.
Root licence choice stays with Frank; four internal candidates, zero ready.
The auditor adds notice hashes and UPSTREAM-LICENSE recognition while keeping
all applicability unreviewed. No development import or notice was altered.

## Public skills consumer and source terms, 2026-10-02 local

Scope: move the /skills reader from the earlier OSS pack into the existing curated
catalog and correct two public blanket MIT claims/source pointers, under #276
and draft #487. Owner: Codex in the assigned source-consolidation worktree.
Base: `21850c2da160e3319c582b6973e14e2be8368a04`.
User job: find creator workflows they can review and reuse without mistaking
pending or uncurated development imports for released skills.
Files: apps/web/app/skills/{page.tsx,[slug]/page.tsx},
apps/web/app/v3/v3-below-fold.tsx, components/skills/InstallTabs.tsx,
lib/skills/{loader.ts,**tests**/loader.test.ts}, apps/web/next.config.js,
packages/arcanea-skills/scripts/catalog.{cjs,d.cts}, .arcanea/config/repos.json,
.github/workflows/ci.yml and this record.
Acceptance: reuse the existing catalog rights/eval/review/content gate, expose
only validated ready bodies, exclude candidates/undeclared folders, bind source
and guidance links to a full source commit, reject stale/invalid evidence, and
show an honest zero-ready state. Source links identify the public app, terms
stay per-skill, and registry visibility agrees with current GitHub metadata.
Budget/stop: one sequential text/test/review workload; no dependency installs,
new worktrees, fanout or full local app build. Stop on routing/lane/admission or
verification failure. No canon, licence choice, rights promotion, history rewrite,
archive/rename, home install, merge, deployment or publishing.
Rollback: reviewed revert of these twelve files, retaining rights/eval evidence.

The old loader read oss/skills/arcanea and generated legacy source/installation
pointers. The web reader now calls the same loadCatalog/selectReady/validateSources
functions used by package API/installer. Validated sources expose already-parsed
description/body alongside their unchanged hash/file inventory. Declaration types
bridge this CJS source without a dependency/lockfile change. Five web-reader cases
exercise actual catalog logic; old reader passed1/failed4, new reader passes5.
The existing eleven package cases also pass. Local TS runtime used existing
Sucrase3.35.1 type erasure and YAML2.9.0, not native tsx or a typecheck. CI runs
native tsx with frozen dependencies. Syntax, source-copy and link checks passed.

Ready source/guidance URLs require a full VERCEL_GIT_COMMIT_SHA (or explicit
trusted fixture revision); no moving branch fallback or universal npx claim.
Installer/copy commands were replaced with the same-revision package guidance.
Catalog declarations are checked, not independently authenticated; this adapter
does not grant rights, certify reviewers or prove an installed harness.
Candidate slugs return null for the existing detail route's notFound behavior.
Zero ready is derived, not a hardcoded promotion. Missing/invalid catalog, malformed
ready evidence or changed resources fail reads rather than being silently listed.

Next tracing includes catalog and skills resources only for /skills routes, using
the existing monorepo tracing root. Actual deployed traces/rendering remain
unverified; a config include is not proof of production file availability.
Primary documentation: https://nextjs.org/docs/app/api-reference/config/next-config-js/output
and https://vercel.com/docs/environment-variables/system-environment-variables.

Public /skills copy now states creator workflows, ready count and per-skill terms,
with an honest empty state and public app source link. The homepage removes its
blanket public-repo MIT statement and fixed MIT/uncurated skill-count badges;
remaining counters are labelled listed repos/packages. Its featured source uses
arcanea-ai-app. Registry app visibility/public URL were reconciled against GitHub
(private=false, archived=false, main); the diverged arcanea entry remains tracked
with a salvage-review description. Shared owners and other registry facts remain.
Formatting changes in existing large TSX/config files follow required Prettier;
only the described copy/selection/tracing logic changes. Other MIT assertions and
third-party rights remain review work. No rendered or live-public repair is claimed.

Exact candidate CI and scoped independent source/copy review are recorded in the
PR/issue and hub after terminal verification. All four internal skill candidates
remain zero ready; licence/Heart, donor folds, plugins/MCP consumers, creator and
community/revenue acceptance and Frank's named #408 merge approval remain open.

A subsequent default-context check found the initial adapter still assumed an
apps/web working directory. The app's existing book resolver supports monorepo
root as well. The skill adapter now checks those two fixed catalog locations at
call time and requires exactly one; missing/ambiguous locations fail instead of
choosing a duplicate. A sixth consumer case proves the default call in both actual
execution roots. The explicit-fixture five cases and eleven package checks retain
their earlier evidence. Initial source016db8 is retained; exact delta review and
new source CI must bind the corrected candidate before acceptance. This proves
local supported roots, not the deployed Vercel filesystem layout.

A seventh case rejects both absent and duplicate default catalogs before reading
their bodies. All seven consumer cases pass locally at the corrected source.

The complete twelve-file source/copy review at016db8 returned PASS with two LOW
and two INFO; it did not execute tests, fetch deployed traces or certify the whole
PR. LOW category-option forwarding and evaluation/review declaration fields are
corrected in this follow-up. The ready fixture now also verifies case-insensitive
category reads with explicit source options. Legacy optional display fields are
marked as currently absent (INFO); deployed trace inspection remains open (INFO).
The root-context correction was found by maker inspection and the new runtime
case, not by that baseline review. Exact follow-up review binds these corrections.

## Pinned skill documentation resources, 2026-10-02 local

Scope/user job: a creator reading a skill can open its worked example and resources
from the same reviewed source commit. Owning issue #276; existing draft #487.
Owner: Codex in the assigned source-consolidation worktree.
Exact base: `b37c2a6dcb43a90a9872826b47d0b79dc8178b2c`.
Files: apps/web/lib/skills/loader.ts, lib/skills/**tests**/loader.test.ts,
components/skills/SkillDocumentation.tsx, app/skills/[slug]/page.tsx, this record.
Acceptance: actual Markdown-renderer output resolves each current candidate's
example link to its own source folder at the full commit; only validated files
resolve locally; preserve supported external links; reject traversal, malformed
encoding, unsupported protocols and missing files. No new catalog or parser.
Budget/stop: one sequential text/test/review workload, existing dependencies,
no new worktree, fanout, local full app build or installed harness. Stop on
ownership, admission, tests or review failure. Rollback: reviewed revert of these
five files, keeping previous catalog and rights/eval receipts.

All four candidate bodies link references/example.md. Previously the detail page
used default ReactMarkdown and left that URL relative to the web route. The first
new static renderer case reproduced the problem (seven earlier cases passed, one
failed). A small server documentation component now uses ReactMarkdown's supported
urlTransform with its default sanitizer and the loader's validated file inventory.
Relative local hrefs resolve to immutable GitHub source files; local image srcs
resolve to raw bytes at the same commit. Query/fragment suffixes and encoded
filenames are retained. Fragment-only links target the source SKILL.md because
this web renderer does not assign heading IDs. HTTP(S)/mailto links retain their
supported behavior; protocol-relative/root paths, backslashes, control characters,
encoded or plain traversal, unknown files and unsafe protocols do not resolve.
Rejected links render as plain text rather than empty-href anchors.
Primary API reference: https://github.com/remarkjs/react-markdown#options

Twelve consumer cases pass locally, including actual server-rendered Markdown
inline/reference links, each of the four current candidate examples in isolated
synthetic-ready fixtures, blocked paths and a synthetic image. Fixture declarations
and image bytes grant no rights and do not prove downloaded-image behavior. The
actual catalog remains four internal candidates and zero ready; no content,
rights, eval, canon or readiness changes. Local tests use existing Sucrase3.35.1
for type erasure and process-scoped dependencies; CI uses native tsx/frozen deps.
Static server rendering is not browser QA or deployed trace inspection. Existing
CI wiring already runs this expanded consumer file; source CI and scoped
independent five-file review must be recorded at the exact candidate revision.
Keep canceled-preview limits and #408/#427 human/source/release gates open.

Resource-renderer review and image fallback correction:
The first five-file independent source attempt reached its configured 300-second
deadline with no verdict; owned PID56100 was terminated and its raw receipt kept.
One sequential streaming retry at unchanged2c63 completed (owned PID3172) with
REVISE/three LOW. Two findings cover the same missing-image fallback; the other
asks for an explicit external-image decision and test. The review inferred an
empty-src HTTP GET. Local React19 static output actually omits src and retains the
img/alt element; no browser requests were inspected. The real plain-text fallback
gap reproduces (thirteen pass, one fails) and is corrected with an img renderer.
Rejected image paths now keep their alt text as plain text, without a broken img.
External HTTP(S) images deliberately retain normal Markdown behavior, now tested
and explicit: their remote bytes are neither pinned nor validated by the local
inventory. Content/rights readiness review still has to consider those URLs.
Fourteen consumer cases pass locally after correction; exact source CI and scoped
correction review remain necessary. Raw initial/timeout/retry/output/SSR receipts
are kept privately; the review does not approve rights, the whole PR or release.

## Restricted document imports: current-tree subtraction, October 2

Scope: remove eight document-skill import trees and their active index rows;
preserve source evidence and document remaining historical/provider obligations.
User job: install/reuse Arcanea workflows without receiving these restricted copies.
Owner: Codex, existing draft487, issue276. Base:a20c06d43a8cc6f448076d15f9e13442660bacbb.
Files:260 explicit tracked files in the eight docx/pdf/pptx/xlsx copy trees;
`.agents/claude-skill-index.md`, existing rights Markdown/JSON, package README
and this task record. No new skill root, repository, archive or licence choice.
Acceptance: all8 trees absent from the candidate index, active rows removed,
notice/blob evidence retained, historical records and other skills byte-preserved.
Consumer grep found only active index and historical audit/rights references;
the broad root plugin remains uncurated. Existing document tool owners retained.
Non-goals: canon, root licence, ready promotion, global uninstall, history rewrite,
legal clearance, app merge, public release or replacement document implementation.
Verification: immutable before/after inventory, retained notice hashes, existing
auditor/package tests, diff/secret checks and all four exact-head native app checks.
Independent review is not invoked while PP HOLD (5677MiB/required6144 this turn).
Budget: ordinary text/removal and small tests, no install/build/worktree/fanout.
Stop: reviewable draft; source/CI proof is not rights or creator/release acceptance.
Rollback: reviewed restoration from a20's exact paths; retain provenance and
unresolved rights, never republish restricted copies as a cleared distribution.

Local attempt: inventory4 passed, package11 failed because the sparse checkout
could not resolve YAML. Rerun used existing YAML2.9.0 through a process-scoped
NODE_PATH: all15 pass, no installation. Frozen CI uses pinned2.9.1 and is pending.
The active generated index is formatted for the existing changed-Markdown gate;
its remaining skill data is preserved. No implementation tests were added for
this removal. All source, rights and release qualifications above remain.

## Canonical skill-root cleanup, October 2

Scope: remove19 unlisted duplicate single-file skills from the canonical package
root while retaining exact source copies and all four existing candidate bytes.
User job: inspect one bounded Arcanea root without receiving unrelated old skills.
Owner: Codex, draft487, issue276. Base:794e83bb7a2e229c08a25faa980436196879c7e8.
Files:19 explicit package SKILL.md deletions; existing survivor JSON/Markdown,
package README and this task record. Historical source/resource records retained.
Acceptance: root bodies equal the four catalog paths; every removal has a retained
byte-identical app source, single-file subtree and no active direct-path consumer.
Non-goals: rights choice/clearance, donor retirement, other roots/plugins, installed
tools, candidate rewriting/promotion, working-set links, canon, merge or release.
Verification: exact Git blobs/hashes/subtrees/consumer grep; retained candidate and
source-record equality; existing auditor4/catalog11; all four exact-head CI checks.
Independent review remains held by recent PP HOLD5315MiB/required6144,32runtimes/12.
Rollback: reviewed scoped restoration of19 paths from the pinned base; preserve
all later edits and unresolved rights. Budget: ordinary text/removal/small tests,
no new worktree/install/local build/provider or foreign process cleanup.
Stop: tested reviewable draft with source/CI/limits saved; full goal remains active.

## Duplicate OSS working-set root, October 2

Scope: remove18 duplicate single-file skills from `.claude/skills/oss` and their
active index rows; preserve the identical role-based working-set sources.
User job: discover one working-set definition per retained skill instead of the
same name arriving through the obsolete OSS copy root.
Owner: Codex, draft487/issue276. Base:0e20b3b42a2f5cb81617c8f9d6310e9a270746c5.
Files:18 explicit SKILL.md deletions plus existing index, survivor JSON/Markdown,
package README and this task record. All historical metadata is retained.
Acceptance: duplicate root absent; retained bodies and canonical candidates byte-
preserved;138 remaining index rows preserve metadata; source mappings and current
versus historical claims explicit. Consumer grep finds only index/history paths.
Non-goals: other roots, global install/uninstall, working-set links, rights/Heart/
licence choice, candidate promotion, canon, archive, history rewrite, merge/release.
Verification: exact single-file trees/blobs/hashes, retained source/candidate and
index/evidence equality, existing audit4/catalog11 and all four exact-head CI checks.
Independent cumulative review only after machine admission; recent HOLD5127/6144,
32 task runtimes/12. No reviewer invocation/PID/cost from this removal.
Rollback: reviewed scoped restoration from pinned base; preserve all later work.
Budget: ordinary text/removal/small tests, no install/local build/worktree/fanout.
Stop: reviewable draft and verified issue/hub receipts; full goal stays active.

## Doc-coauthoring attribution and duplicate, October 2

Scope: trace the remaining recognized duplicate pair; remove its external copy
and active index row; attach explicit observed-source attribution to the retained body.
Owner: Codex, draft487/issue276. Base:24ddaec778c931ce2536986c611f8a5db74ec232.
Files: one explicit SKILL.md deletion, one UPSTREAM.md addition, existing index,
rights JSON/Markdown, survivor JSON/Markdown and this task record.
Acceptance: retained skill and four candidates byte-preserved;137 remaining index
rows preserve metadata; observed upstream bytes reconstruct after removing only
the local version line; source hashes/import history and rights gaps are explicit.
Tracked path references are the active index and March24 historical skills audit;
that dated audit and its earlier grading claims remain historical evidence.
Non-goals: a licence grant, historical clearance, generic-source retirement,
working-set links, global install/uninstall, canon, archive/history/merge/release.
Verification: pinned official GitHub tree/content/README/marketplace/notices;
immutable before/after inventories, equality proofs, existing audit4/catalog11,
named-file/secret checks and four exact-head native CI contexts.
Upstream import pin remains unknown. No root/sibling licence is invented from
generic README language. Independent cumulative review requires fresh admission.
Rollback: reviewed scoped revert of these8 files, preserving all later work.
Budget: ordinary text/small tests, no install/build/worktree/provider fanout.
Stop: evidence-bound draft and issue/hub receipts; full goal remains active.
