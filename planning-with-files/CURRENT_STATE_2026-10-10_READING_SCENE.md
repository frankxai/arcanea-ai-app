# Reading to a private scene creation

Scope: select an existing public chapter passage, edit its visual interpretation,
generate one image through the existing credit-reserved image route, recover the
same request after interruption, export the artifact, and save a private creation.
Owner: Codex thread 01a1269f-23eb-7bb2-b609-77d731cacc50; programme issue #276.
Base: 2ed6ae8b362689d21075aa983ecc3f438e36bcb6, frankxai/arcanea-ai-app.
Branch: agent/codex/reading-scene-20261010. Reused clean, handed-off billing worktree;
the old branch and all other owners' work remain preserved.

Files: components/saga/{chapter-reader.tsx,scene-visualizer.tsx,scene-workspace-view.tsx,scene-visualizer.module.css};
lib/reading-scene/{brief.ts,session.ts,**tests**/brief.test.ts,**tests**/session.test.ts};
app/api/reading-scenes/route.ts; scripts/verify-reading-scene-browser.cjs;
scripts/review-reading-scene.mjs; scripts/tests/reading-scene-{save,postgrest}.test.cjs;
scripts/fixtures/reading-scene-postgrest.sql;
.github/workflows/reading-scene.yml; this pickup.

Real Auth verification extension: scripts/run-reading-scene-auth-fixture.mjs,
scripts/verify-reading-scene-auth-browser.cjs and scripts/fixtures/reading-scene-auth.sql
add two disposable GoTrue password identities to the existing hosted Postgres
fixture. The app is rebuilt with a loopback Auth/Data API gateway; ordinary login
must produce actual SSR cookies, carry the anonymous brief, save through the real
Next route, retry a committed save after losing its acknowledgement, reopen in a
fresh tab and deny a second account/anonymous request. Generation alone is an
intercepted synthetic raster. No production identity, provider credential, live
migration, actual generation/credit proof or production profile-trigger proof is
included. Loopback browser CSP is bypassed without changing deployed headers.
The runner must stop its own containers, app children and gateway and remove the
private fixture config. Source-bound hosted terminal evidence is still pending.
Run38079665266 at4804417c reached real password login and scene save, then the
compiled browser received403. The first route interception assertion escaped its
receipt handler; the runner failure and successful cleanup are retained. A local
regression reproduces same-origin rejection when Next normalizes127.0.0.1 to
localhost. The origin check now uses the received Host authority with the request
protocol, rejects malformed authorities and ignores forwarded-host claims. The
two new compiled-handler tests initially failed; fresh hosted acceptance remains
required. Failed save responses now reach the bounded browser receipt normally.
Rationale: https://nextjs.org/docs/app/guides/data-security#allowed-origins-advanced.

At46aefe7197f562ad7e61c0622367eb763399b820, hosted Reading scene38080378312
passed all six source/recovery tests, nine actual route tests, six PostgREST cases,
four browser modes and five actual password/SSR-cookie/private-save checks.
The real Auth receipts and hashes match that source and report complete owned
cleanup. Native replacement CI38080419679 passed lint, typecheck and build.
The CodeQL analysis job38080378290 completed successfully, but its separate
finding check114296333904 failed with one high and three medium findings.
Do not treat an analysis-job completion as a clean security verdict.

The high finding came from the fixture's add-mask log calls. Credentials are now
never emitted; application/test child stdout is suppressed and bounded redacted
receipts carry diagnostics. The three medium findings came from writing provider
responses directly into review artifacts. Full validated review/cost evidence now
uses bounded escaped JSON records in the hosted job log; fixed-path artifact
receipts bind their hashes and local source metadata. Full verdicts/counts stay
in the bound job-log record. Provider findings
must satisfy a strict source-path/line/text schema before earning a verdict.
scripts/tests/reading-scene-review.test.cjs executes the actual entrypoint with
isolated Git/filesystem/HTTP boundaries: no approval or paid call is simulated
as real. Budget/actor/head denial, excess cost, malformed/truncated output and
blocking findings must fail; complete source and retained JSON-log hashes bind
the valid synthetic verdict. The hosted workflow runs these cases on each change.
No provider call or independent approval has run. Fresh hosted tests and the
separate CodeQL finding check must verify this changed revision before release.

Reading38081583662 at54bfe70d passed route/source/review/database checks but
failed the compiled desktop replacement assertion before real Auth acceptance.
The retained3453-byte artifact11680627322 reports a passage-length denial with
the existing brief intact and no generation requests. The fixture now releases
editor focus and asserts that the actual rendered chapter text is selected
before both activations, including the same-task queued-selection regression.
No product code, timeout or retry was changed to mask that failure. Its cause is
not yet certified; a fresh hosted run must verify the interaction. CodeQL's
separate check114299899573 succeeded but still reported one medium response-file
warning on verdict/count fields. Those response values remain in the full
structured job-log evidence; artifact receipts retain only source metadata and
cryptographic bindings. No warning was dismissed and no paid review occurred.

Atf2fc0070, CodeQL finding check114301549354 reports zero new alerts. Reading
38082127063 still failed before replacement activation: the new explicit DOM
selection precondition failed, rather than a product timeout. Retain artifact
11681170864 and its failure. The fixture now brings chapter prose into view
before selecting it, as a reader must, and compares normalized rendered text.
Bounded range/selection/focus diagnostics remain if that precondition fails.
No app behavior, retry or timeout changed; fresh hosted acceptance is required.

Non-goals: no canon or manuscript change, new billing rail or prices, provider
migration, automatic publication, new orchestrator, historical migration replay,
or replacement of the accepted creator-entry PR505. This is one implementation
lane within the full platform/team/community/commercial goal, which remains open.

Review repair at sourcebb482ab2: the exact-head Codex review found that a
TypeScript Pick left runtime credit balance metadata in retained/exported results,
and the disappearing selection action lost keyboard focus when replacement opened.
The result now uses an explicit field allowlist, including image fields. Existing
browser recovery is projected on restoration; persistence also projects results.
A separate arcanea.reading-scene-export.v1 export retains source, brief, model and
generation provenance while omitting owner, creationId, requestKey and billing.
The exported result also omits generationId, whose suffix is the private save key;
Provider/model, image bytes and the chapter hash retain portable provenance.
Replacement focuses its first action with the explanatory text as its description;
cancellation restores focus to the brief or the workspace for a completed scene.
Two meaningful source tests and all four browser modes exercise metadata exclusion
and keyboard replacement. This is the existing owner's six-file repair, with no
lease overlap.
Completed-scene cancellation additionally retains the image/private save and
focuses the workspace because the completed brief is disabled.
New hosted verification is pending; bb482ab2's green checks certify
only the previous revision. No paid provider review or production release occurred.

Atfc26f60a, Reading38084156841 passes desktop privacy/focus/recovery/export but
fails the new mobile selection precondition before any generation. Retain
artifact11681014828 (130998 bytes) and ui-failed-fc26f60a. The fixture now waits
for the closed panel's Reopen scene control, releases any previously focused
element before selecting prose, and retains bounded range/focus diagnostics.
No product code, assertion, retry or timeout was relaxed. Fresh verification is
required; the cause is not certified as a browser or application defect.

At9b669fcc, Reading38084540297 fails on a detached paragraph during selection
scrolling. Retain artifact11682115367 (3357 bytes) and ui-failed-9b669fcc.
Inspection finds ChatMarkdown creates every ReactMarkdown component type inside
render; reader progress/toolbar scroll updates re-render that child and can replace
paragraph DOM. Stable module-level renderers now preserve those types; the image
renderer consumes a scoped lightbox callback through context, retaining the existing
image/lightbox behavior. This fixes the renderer rather than relying on memo for
correctness. The shared file had no active lease overlap and is added to this lane.
All browser modes now require that actual scrolling preserves the selected paragraph
node and text. UI/capture bindings additionally include chat-markdown.tsx, and its
changes trigger this workflow. Fresh browser/native/Auth/security proof is pending.
References: https://react.dev/learn/preserving-and-resetting-state and
https://react.dev/reference/react/memo.

Acceptance: a source-bound passage becomes an editable brief and a real usable
image; generation shows catalog credits and requires normal authentication;
uncertain responses retain the request identity; local recovery is scoped to the
signed-in actor; saves remain private and retry idempotently; exports retain
source/provenance; keyboard, touch, reduced motion and interruption are verified.

Verification: meaningful source/recovery/denial tests; native lint/type/build;
compiled desktop/mobile/reduced-motion browser checks; exact-revision independent
review; source-bound hosted preview and stable production verification before
claiming release. Provider fixtures do not establish actual paid output quality.
Rollback: revert this bounded change; retain existing creations and billing data.

Scene brief: keep reading primary. One quiet “Visualize a passage” action opens
an inline workspace below the chapter. Selected prose, editable composition and
the resulting image carry the hierarchy. Use existing Arcanea tokens, sentence
case, visible focus, 44px touch controls and no entrance animation. Creation
output is a personal interpretation, never approved canon or a rights grant.

Serious alternative: copy a passage from an ebook into an image tool and save
files manually. Measure usable output, continuity, repair effort and cost before
claiming an advantage. No such comparison has yet been run.

Evidence: route guard/check passed; current production verified directly through
Vercel at dpl_3qy6PjqamyUnfo7ZHvDhtdhhjvaN / base2ed6ae8b. Interactive admission
is BOUNDED (one task); swarm/build/browser admission remains held. No extra worker,
new checkout, install, local server, paid creator generation or process killing.
Installed /si, graph-engineering, humanizer and Emil guidance read. Relocated
design standards resolved under design-agent-standards. Missing config capability
guides remain unresolved and are not represented as loaded. No config writes.

Status: implementation candidate in review-ready PR560; release remains held,
with no creator acceptance certification yet.

Database verification extension: the reader workflow now runs the actual save/
reopen route against the installed PostgREST client, PostgREST13.0.7 and disposable
Postgres17. The fixture copies the columns, constraints, RLS expressions and
auth.uid body inspected read-only on2026-10-10; the January repository schema
differs. Requests must run as non-owner, non-bypass anon/authenticated roles.
The six cases cover concurrent same-key saves, lost acknowledgement retries,
JSON chapter filtering/latest reopening, foreign reads/writes/deletes, forged
ownership/owner transfer, changed visibility and missing profile failure.
Authentication delivery and owner profiles are synthetic seams; production
triggers/grants/session creation are excluded. No live database write, migration,
provider call or production-account acceptance follows from these checks.
Local syntax/format verification and hosted terminal results remain required.
The first hosted database run38076583339 at67f1841f failed because the test
adapter added a second slash to PostgREST paths; use the validated URL origin
as the client base. The failure is retained and does not establish a production
reader fault. The artifact now explicitly selects the TAP reporter.
Atfffd9316, all six PostgREST/database cases passed; browser38076777463 failed
at passage replacement. The action now snapshots the live in-chapter selection
before hashing/focus, retaining captured state as a fallback after selection
collapses. The browser regression activates in the same task as highlighting,
before selectionchange/React commit. Fresh terminal checks remain required;
the database pass and browser failure are retained separately.

Local implementation evidence: six source/recovery tests and six compiled actual-route
tests pass; targeted ESLint passes with zero warnings; both browser/review scripts
pass syntax checks. Private save/reopen uses existing creations RLS, inspected
read-only on production: RLS enabled; private reads and insert/update restricted
to auth.uid owner. No database migration or public object upload. Inline image
bytes are bounded; ten saves/minute per process use the existing limiter. A
distributed quota remains a separate inherited reliability gap.

Scene UI is split into scene-visualizer.tsx and scene-workspace-view.tsx, both
under500 lines. Reader swipe/tap navigation defers while a passage is selected.
The account-keyed workspace discards late callbacks after remount; anonymous
briefs can carry through normal login. Private server copies reopen across tabs.
The remote browser fixture verifies interaction/recovery with synthetic auth and
image responses. It cannot certify real authenticated production generation.

The remote review uses the existing Google credential through a manual, actor/
branch/head-bound job. Final source hashes and all findings must be retained.
Native full CI38070644741 and compiled fixture browser38070644789 passed at
dfda19e887d61c94e2a6a00d96cc1feec670ebb7. The first compiled browser38070232827
failed when an old anonymous draft masked a private server copy; carryover now
consumes the anonymous copy only after owner persistence. Same-key interrupted
generation, canceling replacement, image/source export and private reopen passed
desktop,375px touch and reduced motion. Manual38070225186 was canceled as
superseded before review. These failures are retained. Synthetic auth/provider/
storage evidence does not certify real creator output or hosted account ownership.

Visual refinement at900e08e8dacc57f1ff8e9d9ff43da9fb08213f37 constrains the
requested widescreen preview, uses creator-facing model labels and reserves room
for the mobile companion. Fresh verification adds a control-overlap assertion,
forced colors and source/image-hash companions. Exact current-source gates remain
pending after incorporating shared main releases558 and559. The review computes
its actual shared base, reads every complete changed file and context, and binds
the fixed repository/actor/branch/head. It stays disabled without an explicit
manual <=US$1 budget, counts tokens before the one paid call and rejects cost
above that ceiling. Human spend approval is unanswered; no verdict is claimed.

Production creations columns/checks/FK and owner RLS were inspected read-only:
the current payload fits the live schema and requires an existing owner profile.
Existing reader/canvas PR454 is preserved; its alternate credit engine and
unapplied scheduled recovery are not introduced. Reconcile that candidate with
the canonical book-reader path, existing media531/gallery472 and creator505.
No actual production account walkthrough, paid image, comparative creator
value or rights approval is claimed. Handover is hub242 and programme276.
The entire platform/team/books/community/developer/commercial objective remains active.

Latest verified source5b0e989026478c4a49ffc797a9d9c333a75e3e7e passes the
compiled browser38072746669 (desktop,375px touch,reduced motion,forced colors)
and CodeQL38072746689. Native CI38072746671 is still running at this update.
Focus now occurs after workspace commit through a layout effect; the prior
38071810196 focus failure is retained as evidence. Source6d0b54a5 passed full
native CI38071947747 and CodeQL38072098201, not the later changed revision.

Read-only Vercel environment metadata confirms Supabase and Blob configuration,
with no image-provider key configured for production or this preview. No values
were disclosed and no credential/settings mutation occurred. The pending update
checks the required OpenRouter prerequisite even with a retained local draft;
new generation stays disabled if unavailable or unknown. A pending request may
still recover its existing ledger identity. Private saved results and brief
editing/export stay available. This configuration signal grants no entitlement,
model availability or rights. The existing generation route is authoritative.
Seven actual-route tests and six source/recovery tests pass locally; a fresh
compiled browser check must certify the configuration denial before release.

Required next acceptance: authorize/configure the image-provider rail under
existing creation-engine531 and credit529 ownership, preserve BYOK/managed
boundaries, then verify a real scene with two isolated accounts, same-key
interruption/refund and private reopening. Existing author fixture belongs to
another session/preview and is not proof for this candidate. Independent review
budget approval remains unanswered; no review or paid generation has run.

Reader geometry maintenance extends the existing candidate without changing its
palette, content, account boundaries or billing behavior. The spacing, type,
control and preview geometry now live in packages/design-system/src/{tokens.ts,
tokens.css}. Its reading-scene.module.css owns the 480px responsive rule; the
app module composes that rule and consumes shared variables. The package stays
private. Turbopack does not support @value, so no build plugin or viewport script
is added. Reference: https://nextjs.org/docs/app/api-reference/turbopack.
Owner and rollback remain this candidate's existing thread and scoped commits.
Acceptance: token overrides must change computed padding, the original desktop
and mobile geometry must remain, and all four browser modes must retain focus,
44px controls, source export and recovery. Verification binds all four new
design-system files into the browser capture hashes and workflow triggers.
Eight source, nine route and five review-boundary checks pass locally. The last
fully verified revision is ef52f90e04424b8c4c3cf35e27c0a7696e707e26:
Reading scene38085149302, native CI38085149279 and CodeQL analysis38085149281
passed, with zero new findings in check114310501523. That proof includes the
portable export privacy repair and stable paragraph selection on scroll.
The geometry change requires fresh hosted verification at its own revision;
the prior revision's green checks are not evidence for changed source.

## Integration with the released reader, 11 October

Scope: deliver the retained passage-to-scene workspace against accepted production
reader/account source, preserving readable initial prose, private recovery and
the existing generation authority.
Owner: Codex thread `01a1269f-23eb-7bb2-b609-77d731cacc50`, native lane
`codex-provider-account-20261011`, existing isolated worktree
`arcanea-provider-account-20261011`, branch `agent/codex/provider-account-20261011`.
Files: the 25 files in retained PR560, plus the existing shared private-configuration
regression in `scripts/tests/provider-fixture-private-config.test.cjs`.
Non-goals: no production database/Auth mutation, migration, secret or billing
change, paid provider/review call, manuscript rewrite, canon promotion, publication,
new orchestrator or native app scaffold. Preserve all peer work and unfinished PRs.
Acceptance criteria: source passage selection, editable brief, explicit generation,
same-request interrupted recovery, private save/reopen/export and account denial
pass compiled hosted checks; initial prose remains visible with app bundles denied;
exact-source independent review precedes normal protected promotion. Real provider
output, production RLS/customer behavior and measured quality/cost need separate proof.
Verification: native configuration safety and review-boundary checks; existing
Reading scene workflow, required CI build/types/lint and blocked-bundle reader
checks at the integrated revision; fresh source-bound review and deployment proof.
Rollback: revert only this scene integration through a reviewed change, preserving
the accepted reader/account fixes, manuscripts and other owners' changes.

Accepted main `e07d56866397e6eacc1093cc79505c173a681da8` and the previous owned
reader head have identical trees. Main was merged into this lane as `b91c54b7`
without changing any file. Retained feature `e6691535358a57c8cfd99552224dbf8e022a1017`
then merged without conflicts. All changes were confined to its 25 declared paths;
the direct Markdown import, missing-document recovery, account fixes and every
non-feature main path remain intact. PR560's historical source and evidence remain
available; its old checks do not approve this integration.

The scene Auth runner still had the private-file overwrite/cleanup defect already
fixed in the provider runner. The regression now admits exactly those two runner
paths. All three checks fail against immutable scene source `e6691535`: occupied
path overwrite, pathname writes and missing descriptor cleanup. After applying the
existing exclusive descriptor implementation, all three scene checks and all three
unchanged provider checks pass. Cleanup removes only a successfully allocated file
and reports its actual allocation/removal state. The fixture admits the two owned
feature branches and accepted main, requires Frank's actor and the exact source,
and continues to use isolated loopback services with synthetic generation.

All five review-boundary tests pass. The local scene-save test cannot load its
explicit worktree-relative TypeScript dependency; no install or substitute is
claimed. Its normal frozen-install hosted check remains required. Build admission
is HOLD at 6,455 MB free / 8,192 MB required, 86% CPU and 27 task runtimes. No local
build, container, browser, server or additional agent was started. A recovered
read-only historical storage sensor reports 85 GiB free; current policy v1.2's
50 GiB/8% floor governs, rather than its older critical classification.

The complete 32-source review of historical `e6691535` returned raw WARN. Its five
findings and lead reconciliation remain preserved, with no independent PASS
claimed for that source. Fresh integrated-source review and runtime checks remain
pending. Handover268 is accepted as `c92c7151`; its complete tree equals reviewed
`9cc45cb5` and both receiving CI and estate checks pass. Programme276 and the full
founder platform/creator/community/revenue goal remain open.

## Review corrections and SDK account boundary, 11 October

The integrated candidate `bc832fc7885262cdb6ae621991f119437ee39fdf` is draft PR584.
Its frozen-install hosted build, types, lint, Reading scene workflow, isolated real
password/private-recovery checks and Vercel preview passed. Draft-only skipped
checks, including CodeQL, are not passes. Those results approve that source only.

The complete 40-source independent zero-price NVIDIA review returned raw WARN
with five findings. Two defects were reproduced before correction: an eight-byte
PNG header was accepted into a creation, and completed recovery accepted
`requestKey: null` with `generationId: gen_null`. A separate lead review reproduced
old scene actions sending/persisting after the SDK changed actor before React
cleanup, late A-to-B-to-A callbacks writing recovery state, and a queued stale load.
Keep those failures and the raw WARN; no independent PASS is claimed for bc832.

Corrections reuse existing mechanisms: the already-declared Sharp 0.35.5 dependency
fully decodes original raster pixels with warning, channel and 16,777,216-pixel
bounds before database insertion; completed recovery requires a request; scene
actions use the accepted Auth credential scope synchronously and reject old epochs.
The workspace key includes the epoch, and load, selection, retention, export and
asynchronous callbacks check scope. Generation accepts exactly one image.
The previous browser pixel fixture itself failed real decoding and is replaced
with a complete synthetic one-pixel PNG. This proves fixture integrity, not AI art
quality. The original PNG/JPEG/WebP bytes remain intact after a valid save.

Five actual-component/account tests, nine briefing/recovery tests and thirteen
actual-route/real-codec tests pass locally. The route tests used the existing
billing worktree's installed Next/Zod/Sharp modules through an in-memory loader;
this is not a frozen install of this worktree. The hosted workflow runs the tests
normally after its frozen install. A new browser helper preserves the actual SDK
BroadcastChannel listener and inserts a connected enabled scene click immediately
after it; real disposable password login supplies the second session. Hosted
execution of this new boundary check is pending, not established by native mocks.

The other three independent findings are reconciled as follows: the Origin
comparison deliberately ignores forwarded authorities and tests malformed/mixed
authorities; an unverified custom TLS-proxy configuration is not a demonstrated
bypass. Chapter state is keyed by owner/book/chapter and selection snapshots retain
the chapter-only browser selection through button activation. URL-only results can
be downloaded but cannot be privately saved by this bytes-only endpoint; arbitrary
remote fetching is not added. Future private asset ingestion remains separate work.

Read-only production catalog inspection confirms the deployed public client points
to Arcanea's backend and existing creations columns support this slice. Four actual
owner RLS policies were inspected; no customer rows, production writes, migrations
or accounts were used. Inherited anon/authenticated TRUNCATE/REFERENCES/TRIGGER
grants require permissions-owner review; they were not changed. Public client
binding and catalog metadata do not prove customer save/recovery or model value.

Scope now also owns `scripts/tests/reading-scene-account.test.cjs` and
`scripts/reading-scene-account-boundary.cjs`; the native lane explicitly contains
55 paths, including previous accepted provider/reader ownership. All other owners'
work is preserved. Fresh exact-source CI, independent review, browser/visual checks
and deployment/source binding are required before promotion. The whole founder
goal and programme276 remain open; real provider quality/cost, premium commerce,
canvas/memory, Queen runtime, academies, publishing/community and developer access
are not completed by this correction.
