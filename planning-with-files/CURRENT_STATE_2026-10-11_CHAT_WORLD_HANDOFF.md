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
