# Community demand capture reconciliation

Source: active goal `01a0f74f-8bad-7db1-ab06-fd89b5faec84`, app #276;
original candidate #403 at `f20484f8ec7cc02e2f9507f08186057597360db5`,
owned by task `01a08d75-75fd-7ab2-9234-5351ac1a51e9`.
Base: main `e863be8304fdde9f00ba812d7845d66ec52787b9`.
Owner: Codex, `agent/codex/arcanea-community-capture-20261002`, in the existing
source-consolidation worktree. This additive derivative preserves draft #403 and
its owner's untracked audit. It does not supersede that draft.

User job: a reader or world builder can register interest in Arcanea updates and
know whether that interest was saved. This supports Arcanea's world/audience
priority and eventual releases. A saved signup is not delivered community value
or evidence of paid demand.

Scope: adapt #403's community form to the durable waitlist storage contract already
merged by #458. Main's form only prevents submission. The old draft's Growth Core
proxy would replace newer storage and its CI would remove accepted checks. World
generate/save/create blobs already match main. Main's waitlist API and insert
adapter stay byte-identical.

Files: community form, community-page signup copy and overview extraction, waitlist
submit helper and tests, additive CI test path, this record. Relevant guidance: root AGENTS.md,
apps/web/CLAUDE.md, TASTE.md and DESIGN.md; #276 hierarchy, #408 merge authority and
#427 release proof. Historical blanket licence/count claims in taste guidance
are not verified current rights. No new design skill or image generation is needed
for this existing form.

Behavior: POST only email/source to `/api/waitlist`, with `community_footer` source;
accept only HTTP success and explicit JSON `success: true`; reset only then.
New registrations retain their source; repeat emails remain on the existing shared
list and do not create a second source-specific subscription.
Failures keep the typed email. A ten-second browser timeout permits retry,
acknowledging that an interrupted response may follow a successful write. Existing
server duplicate handling makes retry safe. Accessible form/status IDs are unique
per instance; native email validity remains active. An immediate pending ref stops
same-render duplicate submission. Page copy describes interest capture without
promising weekly delivery, unsubscribe machinery or email isolation.

Non-goals: mail delivery/campaign sends, new backend/storage, pricing/entitlements,
world/auth changes, canon, licensing, archives, private Studio gateways, source
promotion or release. Homepage/dossier and pricing reconciliation remain unfinished
work from #403. Prior #487/#490/#491 proposals remain intact.

Budget and stops: one sequential interactive text/test workload; no dependency
install, new worktree, local full build or long-lived server. PP bounded, above the
4 GiB RAM floor; disk bounded at approximately 14% free. Independent provider reviews
are sequential tool-free calls, each with a 300-second deadline and maximum USD 1;
all attempts and reported list costs are retained. Stop on lane,
branch/upstream change, failed checks or machine hold. No merge/mark-ready/deploy.

Acceptance: exact current API payload; explicit success/failure; source persisted
through the current insert adapter; timeout and network/body failures recover;
form clears only after confirmed save; distinct accessible IDs. Preserve all
existing CI checks. Node 22 frozen remote build/type/lint/status and independent
source review are required for the draft. Actual browser and same-source preview
proof remain unproven until executed. No live signup is submitted.

Verification: `pnpm --dir apps/web exec tsx --test lib/waitlist/__tests__/join.test.ts
lib/waitlist/__tests__/submit.test.ts`; scoped formatting, staged diff and secret
hooks; exact-source independent review and four required CI checks. Local tests use
existing tools without installing dependencies. Results are appended after
execution, retaining failures. The HTTP test uses the real fetch client and
unchanged insert adapter with an in-memory sink; it is not a Supabase or Next route
execution. The fixture server closes at test completion.

Rollback: revert this scoped change through normal protections. No migrations,
account writes or mail were performed. Frank's named `merge N` is required by #408.

## Local verification and retained limits

Fifteen cases pass on Node 22.23.2 using existing Sucrase type erasure: six unchanged
server-adapter cases and nine client cases, including a real fetch/HTTP fixture.
A separate attempt through existing tsx 4.22.3 failed before executing either test
file because its Windows esbuild binary is missing. No dependency was installed.
Frozen Node 22 remote CI remains the native application/toolchain gate.
A focused local TypeScript attempt also stopped before checking source: the
existing TypeScript package directory has no `bin/tsc` entry. No local native
typecheck pass is claimed. These environment failures are preserved with the
passing type-erased test evidence.

Formatting the historical community page would grow it to 775 lines. Its first
four sections are therefore extracted into a 310-line server component, preserving
their existing content and classes. The remaining page is 483 lines. The extracted
hero image now supplies Next Image's required fill/sizes settings. Both touched
components drop the blanket lint-disable header; scoped and CI lint must still
verify them. Existing third-party community links, dates, counts and delivery
claims elsewhere on the page are inherited, unverified and outside this capture
repair. This is not a whole-community design or current-content acceptance.

Source review and required CI results will be linked to the exact commit on #276
and in agentic-ops-hub #98. Source-matched browser proof, live storage acceptance,
mail delivery and release approval remain separate work.

Initial complete seven-file review at `9afb94d408406b32c2cb316020d3fe06af8c4b94`
returned REVISE: unused Link import, field/error association, native typecheck
evidence gap. The unused import is removed and the status description is directly
associated with the email input. The review's proposed `aria-invalid` for all
failed saves is not applied: transport/storage failures do not establish an
invalid address. Native required/email validation remains operative. The review's
critical lint severity overstates the known soft lint posture; its underlying
unused import is still corrected. Fresh source review and CI remain necessary.
Raw review and all attempts are preserved privately.

Three-file correction review at `226d6caafe882bbbc48c4a5ee6b9679d477fe1e1`
returned PASS with one LOW: a browser-accepted address rejected by the server lacks
a control-level `aria-invalid` marker. The live status remains directly associated
with the field; a later validation-400 distinction can add that marker correctly.
CI36945626972 actually ran all fifteen native waitlist cases successfully and
passed TypeScript at this source. Its Lint job failed on Prettier for submit.ts;
the initial local formatter was 3.8.3, while frozen CI uses the current lockfile.
The receipt guard was split into simple equivalent checks as a formatting
hypothesis; that hypothesis was disproved by the next native formatter failure.
This source change requires fresh review and required CI; the failed run is kept.

The same-source Vercel preview `dpl_FmU9eyQMw6PWP2dhusKZaepBjZ6c` reached READY.
An authorized authenticated GET of /community returned initial HTML with its
deployment marker, updated signup copy/form and expected email control. It is not
hydration, browser or live signup proof. Direct unauthenticated GET redirects to
Vercel login. Browser QA admission returned HOLD at 7801 MiB free, below the required
8192 MiB including reserve; no browser was started or foreign process stopped.

Two-file guard review at `78dc99ec606ac490b3192e19fb1248200bb2b3d7` returned
PASS/no findings. CI36946322787 again failed Lint on submit.ts formatting while
TypeScript passed. Its exact final outcome is recorded on #276 and in the hub.
Vercel's current78 preview `dpl_7wLr5MMZycY9zCPrc23beQvjabYt` is CANCELED at
ignored-build, despite GitHub success. The prior226 HTML is not current78 proof.

A bounded 2,801,547-byte formatter archive was read from the official npm registry
and its SHA-512 matched the exact accepted lockfile's Prettier3.9.9 integrity.
Only its standalone JS, TypeScript/estree plugins and licence were retained as
private review tools; no node_modules, package installation or lockfile change.
Exact formatting output proves the remaining difference was the union type's
leading-pipe layout, not the receipt conditional. That whitespace-only difference
is corrected. The prior review's assertion that the conditional caused the failure
is also unsupported and retained as a review-reconciliation note. Frozen native CI
must verify this exact correction. Source behavior and tests remain unchanged.

Official references consulted: [React useId](https://react.dev/reference/react/useId)
and [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

## October 3: built-browser recovery verification

Scope: existing draft493 at27ad6204, one sequential text/CI workload. Owner: Codex,
same worktree/branch. Files: bounded browser verifier, additive native CI step,
this record and, only after a reproduced defect, the existing community form.
No dependency installation, local build/browser, new repo/worktree/API or live signup.
Storage is bounded at13.6percent free. Missing progressive-skill-gateway/capability
guides on the local config checkout remain limitations; no substitute is invented.

The browser drives the production-built React form in desktop,375px touch and
reduced motion. All writes are intercepted transport fixtures: native required/email
validity, associated label/status, in-flight exclusion, literal-success receipt,
HTTP failure, connection loss, the actual ten-second timeout, retry and editing
after success. JSON binds built checkout and PR source separately, with source hashes
and partial failure evidence. No screenshot/visual approval, full accessibility,
Supabase persistence, email delivery, paid demand or release acceptance follows.
First native run must reproduce any stale confirmation before its form correction;
retain its failing artifact. Current-source independent review remains separate.

Correction to earlier task wording: the existing migration is UNIQUE(email,source),
not email alone. Different sources can create distinct waitlist rows; duplicate
handling makes a retry for the same email/source idempotent. The browser fixture
does not verify the live database's deployed schema. Neither API nor migration changes.
The serious alternative is the existing source/HTTP fixture proof; it does not
exercise hydration, native constraint handling or the visible retry interaction.
Keep original403, pricing494/shared submit helper, parent work and280/408/427.
Rollback: scoped revert of these owned additions/correction only. Native CI and
actual browser results will be recorded on493/276 with source identities.

The first native run37091767939 at7affa3b475 reached the actual browser and failed
in all three modes only when a new address retained the previous save message.
Each mode passed the preceding seven journeys, including real timeout/retry,
and intercepted nine writes. Artifact11263055432 binds builtmerge d5a18e65 to
source7affa3b475; JSON SHA2568d8983a1946407f17693c825114009b375c38581a3adda9872cb0b0332df376d.
Install/Lint/TypeScript passed; Build and CI Status failed as required. Keep that
failure. The form correction clears terminal success/error feedback on editing,
without changing request payloads, in-flight exclusion, the API or shared helper.
The browser verifier remains byte-identical. Resulting-head CI and independent
review remain pending at this assembly checkpoint.

Local attempts retained: atomic patch initially refused an absent sparse task
file before any edits; materializing only its exact tracked paths resolved it.
The first formatter pass was non-idempotent; repeated formatting stabilized
before staging. Initial CI-preservation comparison used implicit Windows decoding;
explicit UTF-8 proves all previous jobs, steps and conditions unchanged. Security
hooks remained enabled. These failures do not establish application test failure.

## October 3: canonical community entry paths

Source: same goal and owning issue276, existing draft493 at
658380ed5d75afc7159f5bbef1715255e41744ba. Five-file exclusive lane
codex-209eab67: community-data.ts, community-overview.tsx, page.tsx,
verify-community-capture-browser.cjs and this record. Guard, explicit routing,
clean branch/upstream identity and separate session ownership pass. No new repo,
backend, license, install, image, local build/browser or production write.

Reader/builder job: enter the existing books or Library, find the canonical app
source and discussion path, or register interest with a truthful save receipt.
This supports the broader creator/community outcome; entry links and a form alone
do not establish delivered community value, demand or revenue.

Live read-only evidence, October3: Discord invite API at03:25UTC returns404
Unknown Invite/code10006. GitHub metadata rechecked in this slice confirms
arcanea-skills-opensource404, claude-arcanea archived, and the canonical app public
with no GitHub-detected license. Both production reader entrypages return200 with
their expected titles at03:33UTC; that is entrypage evidence, not full chapter
functionality or deployment-source binding. Apps/web, book, packages and docs
exist at the exact source tree. No license choice or repository archival follows.

The serious alternative was to preserve the inherited multi-repo/Discord entry
surface. Its missing/archived destinations contradict the available entry paths.
The app's earlier consolidation and reader drafts remain intact; this derivative
points into their existing home instead of duplicating canon, skills or readers.

Changes: replace vanity readiness counts with linked Read/Build/Discuss/Follow
actions; point every main-content GitHub entry at arcanea-ai-app or its folders;
route expired invite actions to the existing interest form; keep local reader and
anchor links in the same tab. Label all four gathering concepts as undated
proposals. Preserve all three creation concepts as ideas without unsupported
creator attribution, weekly submission or image-preview claims. Replace promises
of governance/canon voting, marketplace publishing and unrestricted reuse with
reviewable contributions and applicable terms. Existing source/backups preserve
the original proposed material. Uppercase interface styling is removed in the
owned page and overview. Global footer/shared navigation belong to other work;
this is a community-main claim, not an estate-wide link cleanup.

Verification adds four built-browser journey groups per mode: canonical folder
links/proposal status; keyboard or touch hero action to the interest section;
actual navigation to books; actual navigation to Library. Existing nine signup
groups, all write interception, ten-second deadline, retries and source payload
checks remain. Evidence also hashes the three community source files. Official
[Playwright locators](https://playwright.dev/docs/api/class-locator) and
[page URL assertions/navigation](https://playwright.dev/docs/api/class-page)
were consulted before implementation. No external accounts, joins, emails or
real registrations are performed.

Fresh task correction: source uniqueness is UNIQUE(email,source), as the previous
section states. At6583, native CI37092308687 passed all required checks and all
three modes/nine signup groups. Baseline stale-receipt failure37091767939 remains
preserved. Read-only deployed project metadata identified Arcanea project
hcfhyssdzphudaqatxbk as ACTIVE_HEALTHY with RLS enabled and INSERT-only public roles
on waitlists/subscribers, matching the recorded unique constraints. This does not
prove the production app's current environment binding or a live persisted signup.

Small pinned-format/syntax/protected-source checks and new exact-revision native
CI remain required. Independent review of the full updated PR remains pending;
earlier correction reviews exclude these new page/verifier changes. Existing
provider-limit failure is terminal, not a live verifier or an independent verdict.
No acceptance, source-matched preview, full accessibility, visual approval,
chapter-link completeness, mail delivery or release is inferred. Keep draft493,
original403, pricing494/shared helper and all retained fronts;408/427 govern
merge/release. Rollback is a scoped revert of these five files, without a migration.

Local verification limits: the first protected-source check tried to hash a sparse
absent unchanged helper and stopped. Git's skip-worktree flag and exact HEAD blob
comparison resolve that check without materializing or changing the helper. The
Node REPL child environment also lacks GitHub CLI authentication; its failed reads
are not repository availability evidence. The existing authenticated PowerShell
CLI supplies those reads. No authentication, permission or security setting changed.
