# Chat world draft handoff

Scope: carry a world-building conversation into the existing editable world draft
and private save/reopen/export flow without losing decisions or repeating inference.
Owner: Codex root, goal 01a1269f-23eb-7bb2-b609-77d731cacc50; native lane owner
codex-provider-account-20261011. Programme: https://github.com/frankxai/arcanea-ai-app/issues/276.
Base: 49001a3f6a902c333562b99faef31cf86fb62907.
Branch: agent/codex/chat-world-handoff-20261011.
Worktree: C:/Users/frank/starlight/worktrees/arcanea-provider-account-20261011.
Origin: https://github.com/frankxai/arcanea-ai-app.git.

Files: use-chat-world-mode.ts, chat-notices.tsx, new lib/chat/world-handoff.ts,
worlds/generation.ts, worlds/generate/route.ts, chat-world-handoff.test.cjs and
this record. scripts/test-world-generation.cjs includes the new tests in the
existing required CI rail; its named scope was separately checked and admitted.
No overlap with the inspected active foreign file leases.

Reproduction: the existing hook sends an entire transcript through a 500-character
concept field, supplies no required customer key, and reads a saved-world slug
from an explicitly unsaved structured draft. The actual request schema rejects
the proposed bounded conversation envelope before repair. Existing chat output
cannot establish a private saved world.

Acceptance: complete bounded text context, explicit current-account customer key,
server actor binding before inference, validated structured output, no automatic
retry, duplicate-click exclusion, account/cancellation isolation, recovery when
tab storage fails, non-overwriting transfer, complete draft/source download and
reopening in the accepted world creator. Exact-revision build/types/lint, browser
and independent review precede release. Real provider and production customer
acceptance remain separate.

Verification: node --test scripts/tests/chat-world-handoff.test.cjs; the existing
scripts/test-world-generation.cjs regression suite; changed-source TypeScript,
ESLint, formatter, ownership and secret gates; hosted compiled browser checks.
Local dependency reads use an existing checkout, without installing or modifying it.

Non-goals: canon promotion, production DDL, billing/credit changes, publishing,
model replacement, a new editor or scheduler. These remain in the full active goal.
Rollback: bounded reviewed revert of this application slice; preserve user drafts,
source archives, the previous chat branch and failed verification receipts.

Scene brief: the existing world-builder notice presents a single action to prepare
an editable draft. Show Google quota use before that action; then name the unsaved
draft and offer editing and export. Errors retain the conversation and generated
draft. Controls wrap at mobile width, have visible keyboard focus and 44px touch
targets. Status is readable without animation. No generated media or new assets.
The serious baseline is manually carrying a chat transcript into a separate world
editor; no speed, output-quality or market advantage is claimed without comparison.

Instruction evidence: root AGENTS SHA-256
36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5.
SYSTEM.md, SCHEMA.md, SKILLS.md, current creator backlog, shared hub/master plan,
execution protocol, product/machine/workspace policies and applicable design
guidance were read. The supplied root design-kernel paths have moved; their
existing design-agent-standards sources were located. Instructions are loaded
guidance, not proof of runtime enforcement. Starlight SI, task contracts and Emil
design engineering guide this single-writer slice; no agent fanout was admitted.

Machine: review-lite preflight at 2026-10-11T21:25:31Z was bounded, 8943 MB free,
parallelism 1, 45-minute limit and no new agents. Direct disk reading was 82.06 GiB,
8.62% free. The configured quick storage-sensor path is missing in the current
config checkout and origin/main; no new worktree, dependency install, local build,
media or browser worker is started on that basis. Ordinary edits and small tests
remain permitted. No session-owned long-running worker remains.

Previous PR597 remains unfinished and intact at e62099f2 on its original branch.
Its exact-source compiled/source gates passed; independent review timed out. The
clean checkout was released and reassigned; this does not close that PR or goal.

## Implemented and locally checked

The actual conversation-envelope regression failed against accepted source, then
passed with the repair. Fifteen new native source-derived cases pass, including
the actual compiled handler's actor denial and model-prompt exclusion. Thirteen
existing actual-handler generation regressions also pass. Providers and storage
are controlled in these tests; they establish no paid or real-account outcome.

The client now supplies the current account's explicit Gemini key, preserves all
bounded text turns and validates actor-bound unsaved output. The server compares
the expected actor before inference and keeps actor metadata out of the model
prompt. Existing normal request and output controls remain covered. Conversation
input admits at most 40 user/assistant turns and 24,000 characters; encoded ingress
is capped at 150,000 bytes. Normal concept requests retain their 8,192-byte limit.
The existing model, 6,000 output-token ceiling, 45-second provider deadline and
zero automatic retries remain. Current primary guidance:
https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text.

The complete generated draft and source conversation transfer to the accepted
actor-scoped world creator key. A separate tab-local source archive survives that
creator's working-draft rewrites. Unreadable or concurrently created drafts are
never overwritten. Storage failure keeps the result in memory for complete JSON
download and retries transfer without another inference. Cancelled or stale-account
output is excluded. Unknown inference outcomes require a separate quota-warning
confirmation before another attempt in this session. This uncertainty guard is
not yet durable through a reload; there is no server operation reconciliation.

The notice names an unsaved draft, offers editing/export/transfer retry and states
Google quota use before dispatch. Changed controls use existing canonical tokens,
44px targets and visible focus; the status has no animated dependency. Changed-source
ESLint passed using a byte-identical existing config and read-only dependencies.
Formatter and whitespace checks passed. Rendered desktop/mobile and full workspace
checks remain pending. No visual score or independent acceptance is claimed.

Limitations: tab storage is local to this tab; no cross-device/source-history
guarantee is added. The in-memory result needs download if storage fails. Real
provider creation, account-isolated private save/reopen, useful editorial output,
production deployment and exact-source independent review remain open. Broader
canvas/memory/Queen, commerce, community, publishing and client requirements stay
in the full goal, not this slice's acceptance.

Status: source implemented and native recovery/handler checks pass; release
acceptance is pending. Next: exact-source hosted build/types/lint and compiled
chat-to-world browser proof, then independent review and owner-approved promotion.

## Reload recovery refinement, 12 October 2026

The previous goal turn was a requested status summary, with no source progress.
Current state was revalidated before this implementation. Three additional real
regressions failed against the candidate: reload repeated an uncertain inference,
reload lost a completed draft when editor transfer failed, and unavailable storage
still admitted inference. All three now pass with the repair.

The account-scoped tab recovery record is written and read back before dispatch.
An interrupted pending attempt restores the quota warning; a separate explicit
confirmation is required before another attempt. Each attempt has a distinct ID,
so a late prior result cannot replace a newer confirmed attempt. A validated
completed result is retained before editor admission, including when another draft
blocks transfer. Recovery is bounded to 250,000 characters and excludes credentials.
The accepted creator's separate 150,000-character draft limit remains unchanged.
The original source archive and full JSON download retain the conversation.

Returning from the creator now opens newer edits of the same draft without
overwriting them. Starting another draft requires explicit confirmation, a cleared
working draft and a retained original source archive. Different or unreadable
drafts and malformed/foreign recovery records remain protected.

The combined required native generation command passes all 36 cases (23 new
handoff/handler cases and 13 existing generation cases). Changed-source ESLint
passed after this refinement. These are controlled local checks, not live Google,
Supabase account isolation, browser taste or customer success evidence.

The earlier statement that uncertainty recovery is in-memory only is superseded
by this refinement. Recovery survives reload in the same tab; cross-device/cloud
recovery and server-side operation reconciliation remain unimplemented here.
If completed-result persistence itself fails, export is still required before
leaving the session. No guarantee is made after clearing browser storage.

Machine admission at 2026-10-11T21:55:34Z returned HOLD for review-lite: 4,936 MB
free versus 6,144 MB required. No new agent, full local build, install, model,
server or browser worker was started. Ordinary edits and small tests proceeded;
hosted build/type/lint and visual verification remain the next release gates.

## Compiled browser coverage candidate

Draft PR602 first candidate bb3f8f685769cf48e8345a737854aa99abaa09b6 has hosted
Build, Lint and TypeScript passed, a successful Vercel preview and the existing
four-mode compiled companion check passed. CI38178859871 is terminal SUCCESS,
including Build114587678753 and CIStatus114588443056. Companion38178859864 is
terminal SUCCESS. Its independent review was skipped because the accepted review
lane permits only the earlier PR597 branch. A skipped review is not acceptance
and no branch admission is bypassed.

The existing browser verifier is extended in a separately admitted ninth path.
It exercises the actual compiled world-mode hook and controls at desktop, mobile,
reduced-motion and forced-color settings. Intercepted generation and synthetic
Supabase auth events are used; app API writes and real providers remain blocked.
The scenario covers source longer than 500 characters, unknown result, reload
without a second dispatch, explicit retry consent, complete source and draft
downloads, completed-draft reload, accepted editor transfer and preservation of
newer applied edits. The actual source manifest includes the world hook, controller,
schemas, handler, creator and editor. Each new capture gets the existing revision/
source/pixel sidecar. These new runtime assertions are prepared, not yet executed.

During that scenario preparation, recovered conversation export was made available
even without a surviving chat view. Consent retains that source, and an explicitly
confirmed new attempt can reuse it. A new native regression passes alongside the
existing cases: 37 combined checks. No credentials or account IDs enter portable
conversation/download artifacts. The pending source still belongs to the signed-in
account in this tab; no cloud or cross-device promise is added.

## First compiled world scenario result and repair

Companion38179520905 / compiled114588916530 is terminal FAILURE at c467: the
prepared-world action was absent. The actual page and captured image confirm
world mode and a completed one-user/one-assistant conversation. The existing
page threshold counts two creator messages, not two total turns. The verifier's
setup is corrected to supply the second explicit creator decision; the accepted
threshold is preserved. The failure receipt and four captures remain retained,
including the actually inspected failed desktop frame. Cleanup passed; no page
exception, real provider call or production write was recorded.

That frame also exposes a product defect: the World Builder's avatar field is
rendered as text, but its value is an image path. The helper is separately admitted
as the tenth owned path. A native test reproduced the wrong value before repair.
The builder now uses the existing chat glyph and supported academy/wisdom metadata
without the invalid type assertions. No new portrait, asset or brand identity is
introduced. The verifier checks that the path is absent and binds both helper and
configuration source. This refinement has 38 combined native checks; compiled
coverage needs a fresh actual run before acceptance.

The next compiled114591039911 at db974437 is terminal FAILURE at a fixture
expectation that empty-composer Send should be enabled. Actual source uses
disabled={!canSend}; the retained, inspected desktop image confirms two creator
messages, the visible prepared-world CTA and the corrected glyph. The assertion
now waits for Send to return disabled after streaming, matching the real empty
composer. All quota/reload/source/editor assertions remain. Four captures and
the failure receipt are retained; browser/server cleanup passed and no page
exception was recorded. Hosted TypeScript114591201641 and Lint114591201648 pass.

Updating the reviewable PR description caused GitHub's existing edited-event gate
to replace initial db runs38180133050/38180133072 with38180214158/38180214167.
The earlier pair is terminal cancelled, not an observation timeout or a manual
restart. The same source revision is retained. No workflow trigger is removed.

## Quota alert selector recovery

The preceding requested-status turn gathered the terminal compiled failure and
therefore supplied evidence that changed the next action. Current worktree,
instruction hash and ten-path ownership were revalidated before this correction.
At 2bb147c8196e828be75d09d8fc2aa1f1bf8be1ec, CI38180646713 is terminal SUCCESS:
TypeScript114592431430, Lint114592431439, Build114592947893 and
CIStatus114593608909 pass. Authenticated and independent acceptance remain skipped.

Companion38180646722 / compiled114592297269 is terminal FAILURE. The actual log
shows the quota alert assertion matched both the chat warning and Next.js's
route announcer. The assertion is scoped to the named Chat main landmark; the
quota text, disabled retry control, no-repeat request counts, reload, downloads,
editor and all four mode checks are unchanged. This retains strict uniqueness
inside the relevant user surface. The original failure remains available and
does not establish acceptance of the later scenario steps.

Fresh review-lite admission is HOLD: 4,746 MB free versus 6,144 MB required and
27 task runtimes. No new local agent, build, browser, server, model or install
was started. Ordinary source edits and small checks remain permitted. The full
goal and both draft PRs remain unfinished; independent and real provider/private
customer proof, production verification and broader creator/business work remain.

## Creator transition and independent review contract

At 9f818512387d4912f3ac4ff3ad6c76a89392726d, compiled114594356745 /
Companion38181338911 is terminal FAILURE on the creator's Edit world draft
button. Its five captures include the actual prepared-draft state and failed
creator page; both were inspected. The creator is signed out while the header
shows the fixture account. Synthetic BroadcastChannel events do not persist a
Supabase session. The creator's new subscription initializes from that absent
session and can supersede an earlier broadcast. The fixture now waits for the
creator's initial signed-out affordance, then broadcasts and requires the edit
control. This changes no application authentication. Reload, uncertainty consent
and both downloads were reached before the failure; no later editing or four-mode
acceptance is inferred. The scenario also checks the original name and captures
the revised editor in each mode. Request-count and all previous assertions remain.
CI38181338784 at the same 9f source is terminal SUCCESS, including
Build114594973499 and CIStatus114595559492. Twelve actual admission tests pass
after the review repair; the two prior refusals remain recorded above.

The existing public review rail had no admitted contract for this branch and
cannot route its world-generation handler through the old six-module contract.
Two no-network tests reproduced these limits before correction. Three additional
paths were separately route-checked, found unowned and added to the native lease:
review-companion.py, its admission tests and companion.yml. The explicit reviewed
source contract now binds only PR597 to its original branch and PR602 to this
branch, with same-repository owner, public visibility and immutable head/base
requirements. The old six-module review remains intact. This world slice uses
one complete packet, including creator, editor, auth/key, deadline, generation,
draft, browser and both CI workflows; no changed source or caller is excerpted.

Secret scanning, ignored-inline-allow denial, explicit zero-price model, current
catalog/context checks, no redirects/secrets/tools/fallback/retries, strict literal
bindings/citations, full-file coverage and reconciliation requirements remain.
Other branches, mismatched PRs, private source, missing context, paid pricing and
unowned changed paths are denied. Workflow triggers retain all prior events and
add the actual world sources so future repairs receive compiled verification.
This is an implemented admission candidate, not an earned independent verdict or
permission to skip stronger review, runtime/customer proof or release approval.

## Complete review partition and editor capture correction

At 65ce23d7fab48029be2e1314e716b6f9944ecdcb, independent114596255926
correctly refused before inference: the complete 56-file packet was 1,021,431
encoded bytes, exceeding the verified 512,000 context bound including output
reserve. The actual hosted log confirms the denial; local read-only sizing and
catalog checks agree, with zero provider calls. No price, context or coverage
condition is lowered. The same complete source is now partitioned into client,
server/transport, browser and review-protocol responsibilities. Complete actor,
handoff, draft and creator boundary files are shared where needed; every changed
file has one accountable module and every complete context file is included in
the aggregate. Twelve no-network boundary/coverage tests pass.

Compiled114596256209 reached the revised desktop editor and retained the newer
world name, then failed because the capture helper classified the new editor
capture as a companion dialog. The retained five-capture artifact's failed image
was inspected and shows Tide Ledger revised in the actual editor. The capture
helper now selects the named editor region. All generation counts, reload,
consent, downloads, account, editing and four-mode assertions remain; later modes
and overall browser acceptance are still pending. Browser/server cleanup passed,
with no recorded page exceptions, real provider call or production write.

CI38181968835 at the same 65ce source is terminal SUCCESS, including
Build114596867449 and CIStatus114597582433. Current uncommitted sizing retains
all 56 complete files across four modules: client 434,401 bytes, server 291,065,
browser 368,855 and review 464,643. Each fits the unchanged 512,000 bound with
24,000 output plus 1,024 reserve. Those sizes are local preparation evidence;
the committed source, current catalog and scanned hosted dispatch must still be
verified. No provider call was made by the sizing check. Earlier one-packet
admission is superseded by this complete partition; the actual refusal remains.

## Nested landmark and retained review timeout

At faed3d4372f278bc7f5ff5840d04086d928cf630, compiled114597846347 is
terminal FAILURE on the ambiguous creator main landmark. The actual DOM contains
both root #main-content and the creator's nested main. The fixture targets the
existing root content landmark, also used by the root skip link. Creator session,
editor and all other assertions remain. The nested main is an accessibility defect
still to fix in the occupied creator-page lane: ops-f58e03ef6eff135b49a5,
owner codex:01a123df-58c6-72f3-b86c-65083426cf65. That page was inspected through
its Git source and remains read-only here; the broader quality requirement stays
open rather than being hidden by the scoped assertion.

Independent114597846169 is terminal TimeoutError after dispatch. The actual
hosted failure is retained, without an earned verdict. Complete-source catalog
preflight at exact faed passes all four requests with current zero pricing and
512,000 context: 434,401, 291,065, 368,855 and 465,961 encoded bytes; 56 complete
sources and all 13 changed paths are accounted for. This proves admission only,
not reviewer quality, completion or stronger independent acceptance. No timeout
increase, automatic retry, paid model call or permission bypass was introduced.

Read-only current catalog discovery finds only the existing DOTS model meeting
the admitted zero-price, structured-output and at-least-512,000 context criteria.
No automatic alternative is selected. The independent job now depends on the
compiled recovery job, preserving all review triggers and denial gates while
avoiding inference on a candidate whose browser proof has already failed.
Compiled success still cannot substitute for an independent verdict. Local
capacity remains held; no agent fanout, local reviewer or full build was started.

CI38182499505 at faed is terminal SUCCESS, including Build114598489836 and
CIStatus114599175421. The root layout is added as a complete browser review
context and capture source binding because it defines the content landmark.
The new aggregate has 57 complete files; historical 56-file evidence remains
unchanged. Public-source dispatch still requires current exact-revision admission.

## Four-mode proof and accepted-main integration

At 1a8c257d79b8835b283ea5a1f68e4703bd618f70, CI38183106330 is terminal
SUCCESS: TypeScript114599780868, Lint114599780798, Build114600279146 and
CIStatus114600969332 pass. Compiled114599660071 in Companion38183106339
also passes. Artifact11718398116 is downloaded and inspected: all42 actual Git
source hashes and all20 PNG sidecars match the pinned revision and pixels.
All eight new world-handoff/editor captures were individually viewed. Desktop,
mobile, reduced-motion and forced-color runs each prove two explicit generation
attempts, restored uncertainty consent, complete source/draft downloads, restored
completion, accepted editor transfer and preservation of newer applied edits.
Changed notice controls have44px height and no recorded horizontal overflow.
No page error or cleanup failure is recorded. These are intercepted provider and
synthetic-auth checks: zero real provider calls and zero production writes.

The editor captures expose section headings under the fixed navigation, alongside
the previously recorded nested-main defect. Both require owner-side correction
and fresh visual/accessibility acceptance. Clear handoff controls and a passing
fixture do not establish that the full creator interface meets the premium bar.
The occupied creator page remains read-only in this checkout.

Independent114600528851 is terminal FAILURE. Retained artifact11718975771
contains one world-client response: finish_reason=length, no tool calls, empty
final content,118714 prompt tokens and24000 completion tokens. Reported cost
and its three upstream cost fields are exactly zero. The reported25583 reasoning
tokens exceed completion_tokens; retain that provider inconsistency without
rewriting usage. No independent verdict was earned and remaining modules were
not dispatched. The source/privacy/citation/coverage gate correctly refused it.

Accepted main8936b1400844f1b48e93bc679e1d0af3e74f9e7e includes reader PR600
and source-linked scene SDK PR601. Normal mergea7b7926df191bf79336a26892e0e7cd91ae36de8
preserves all18 incoming Git blobs exactly. Native ownership and staged-secret
gates passed; no other owner's checkout or accepted source was changed. The
remaining world diff stays within its original13 paths. Large-scope admission
and later13-path restoration each hit the helper's8-second routing deadline;
the failed attempts made no claim change. An18-path integration-only claim
passed before merging. Current native claim is the three explicit review/test/
state refinement paths under the same owner, with original application and
integration ownership receipts retained. No gate was bypassed or edited.

The one world-client request now has an explicit36000-token output limit and
360-second deadline after the observed completion exhaustion. Other modules
retain24000/240. Deep reasoning stays enabled and excluded from returned text;
no fallback or automatic retry is added. Live zero-price, structured-output,
context and completion limits must admit the actual per-request budget before
dispatch. The same model catalog reports a460800 completion ceiling. Thirteen
no-network admission tests pass, including the larger context reserve and refusal
of truncated responses. Current primary explanation of combined reasoning/output
budgets: https://openrouter.ai/docs/guides/best-practices/reasoning-tokens.
This adjustment is prepared; hosted completion and useful review remain unproven.

Complete reading-toolbar TSX/CSS are included with the accepted chapter reader
in the browser review module; the aggregate has59 complete source files. No
source is shortened, no changed-path responsibility is dropped, and the remaining
three modules retain their original output/deadline bounds. Renew all checks at
the resulting public commit and current main base before promotion.

Current PP review-lite remains HOLD:4708MB free versus6144MB required,27 task
runtimes. Disk reading was86212984832 bytes free, above both hard floors. No
new local build, model, server, browser or agent was started. Real Google output,
private authenticated save/reopen, customer usefulness, production verification
and the full platform/Queen/memory/canvas/commerce/community/publishing/client
programme remain open. Goal01a1269f remains ACTIVE; both application PRs stay draft.

## Worlds landmark repair and corrected ownership, 12 October 2026

The previous goal turn was a requested status summary: no implementation progress.
This continuation revalidated the clean checkout, draft PR602 and all terminal
d7d2b177 jobs. CI/build/types/lint and compiled four-mode recovery passed at that
revision. Independent review failed on a finding whose quote does not match the
cited source; its complete final response also labels findings as a pass. No
independent verdict was accepted. The retained lead reconciliation is a separate
assessment, not an independent approval or a rewritten provider response.

The current stable arcanea.ai deployment is READY at accepted main8936b140,
deployment dpl_5YRvq6etyVEVU5BkiXFr3pjfdvLa. This binds the production alias
and source; it does not prove a real customer/provider outcome or deploy this PR.

The earlier nested-landmark attribution to the occupied creator page is corrected.
At current d7 source that page uses a div, and its source plus world-draft-editor
are identical to the other owner's c38ebdb3 revision. The retained faed failure
shows a second main with the class of the parent Worlds loading fallback during
navigation. All three Worlds loading fallbacks contain a nested main, as do the
loaded world browser and detail page. The root app layout already owns the
persistent main-content landmark and skip-link target.

Scope: retain one main landmark through Worlds loading, discovery, detail and
creator navigation, preserving the existing visual composition and skip target.
Owner: codex-provider-account-20261011, native lease ops-e9fe428396c3413bf4e6.
Files: the three apps/web/app/worlds loading.tsx files; worlds/worlds-client.tsx;
worlds/[slug]/page.tsx; scripts/tests/world-landmarks.test.cjs;
scripts/verify-companion-browser.cjs; scripts/review-companion.py;
scripts/tests/test_review_companion.py; .github/workflows/companion.yml; this file.
Non-goals: no overlapping creator/editor edits, visual redesign, authentication
change, provider change, database migration, billing or production promotion.
Acceptance criteria: actual fallbacks rendered inside the inherited main expose
one main; loaded Worlds pages introduce no alternate main; hosted discovery and
creator navigation retain one main with id main-content in all four modes.
Verification: six native landmark checks, existing thirteen review-admission
checks, changed-source syntax/format/whitespace checks, followed by hosted
build/types/lint and compiled four-mode recovery at the new exact revision.
Rollback: revert this bounded commit through a reviewed branch; retain all
earlier generation/recovery/editor-transfer work and failed evidence.

Five regressions failed against the actual candidate before changing app source:
three real React-rendered loading fallbacks produced two main landmarks, and
two loaded-page TSX source checks found an additional main. All six native
landmark checks pass after replacing only the five wrapper tags with divs. Local
rendering uses existing read-only React dependencies from the retained billing
worktree; source comes from this checkout. No install or browser was started.
An initial dependency lookup in the canonical checkout failed before tests ran;
that environment failure is not counted as reproduction of the product defect.

The compiled verifier now requires the unique main landmark at world discovery
and both creator transfers, and records those assertions per mode. Its source
bindings include the real world layouts, fallbacks, loaded pages and native test.
The hosted workflow runs the native landmark regression before building and
retains all existing recovery, account, request-count, export and mode assertions.

The complete review contract adds the six navigation paths and their real layout
and read-helper context. One fifth module owns the navigation changes; changed
paths remain singly assigned and complete context remains covered across modules.
Thirteen no-network review-admission tests pass. No price/context/citation gate,
independent-review requirement, model or retry rule is weakened. Full source/cost
preflight and all new hosted results remain pending until the commit exists.

Current review-lite admission is HOLD: 5503MB free against 6144MB required,
27 task runtimes. Fresh disk reading is 85726158848 bytes, above both hard floors.
No local agent fanout, reviewer, build, browser, server or model is admitted.
Ordinary edits and small tests proceeded. Header-obscured editor headings remain
in the occupied editor lane and need owner correction; the wrapper repair does
not establish premium acceptance of the whole editor. Real provider output,
private authenticated save/reopen, stronger independent review, production
verification and the full Queen/memory/canvas/commerce/community/publishing/client
programme remain open. The full goal remains ACTIVE.

Uncommitted no-inference preparation accounts for all73 complete sources and
all19 changed paths across five modules. Encoded requests are434401,291065,
475406,285872 and484144 bytes, each within512000 including its unchanged finite
output reserve. This is preparation only; current catalog/price scanning at the
committed public candidate remains required. Main advanced to680901563775853b51df3aa58ae658c23d632ec6
while working: accepted PR608 changes five World SDK/memory-boundary paths and
does not overlap this repair. Integrate those exact accepted blobs before the
single hosted-validation push; no owner branch is assumed complete by its merge.

## Explicit independent-review alternative

Landmark repair commit15516835b22e302bbc3cb57b8b27e1e996daf7bc is followed by
normal merge37998f99c596a5c83d38891abbbfcdb39d856294 of accepted main68090156.
All five incoming staged Git blobs were compared to that exact main and match.
Native ownership and staged-secret hooks passed for both commits. No SDK owner's
checkout, creator/editor source, live data or locked canon was changed here.

The live Kilo catalog also exposes nvidia/nemotron-3-ultra-550b-a55b:free with
1,000,000 context,65,536 completion capacity and exactly zero listed prices.
Its catalog does not advertise provider-side structured output. It is an
explicit alternative to the failed DOTS review, never an automatic fallback.
Current primary gateway guidance confirms anonymous free access and requires
public, non-confidential trial inputs: https://kilo.ai/docs/gateway/models-and-providers.
Deep reasoning controls: https://openrouter.ai/docs/guides/best-practices/reasoning-tokens.
Catalog/price checks must be refreshed immediately before each hosted dispatch.

Scope/owner/files: extend the admitted review script, its tests, companion workflow
and this existing record under the same native owner. The world PR explicitly
selects Nemotron Ultra with high reasoning; PR597 retains its original DOTS
provider-schema route. Other branches, model IDs, auto routes, paid pricing,
missing capabilities and insufficient context/completion remain denied. No
tools, credentials, redirects, retries, fallback or private artifacts are sent.
All inputs must already exist at the pinned public commit and pass secret scanning.

The alternative supplies the complete same JSON report schema in the prompt
and requires strict post-response validation. This is not a claim of native
structured-output support. Both routes require exact hashes/revisions, every
complete file, literal lines/quotes, observations of changed source, finite
output/deadlines and an untruncated final response. Pass with findings remains
invalid. Findings require independent lead reconciliation and cannot approve
customer outcomes or release. The alternate route is restricted to PR602.

Adding the route exposed a post-validator gap previously covered only by the
DOTS provider schema: unexpected nested finding/observation keys and empty or
oversized limit strings were accepted. A native regression reproduced that gap;
the validator now checks those exact fields and bounds for both models. Sixteen
no-network checks pass after that repair; the added legacy-lane denial test must
also pass before commit. All original failed reviewer evidence remains intact.
No model call has been made for this alternative; its useful complete review
and exact-source hosted/browser/production/customer acceptance remain unproven.

Rollback: revert the explicit alternative through a reviewed branch, retain the
strict validator repair, UI landmark fix, complete source partitions and all
failed evidence. No paid provider authorization is inferred from the Node24 reply.
The broader creator/platform/community/commercial goal remains ACTIVE.
