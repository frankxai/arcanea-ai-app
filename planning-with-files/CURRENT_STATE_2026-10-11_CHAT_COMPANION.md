# Arcanea companion repair

Owning programme: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276). Base: `4441801b5e003499bd70ca25e141fa7986793e58`. Owner: `codex-chat-companion-20261011`. Reader PR560 remains on its separate review branch.

## Task contract

- Scope: make the existing floating companion use the customer's selected provider, key and model; preserve partial replies and drafts; abort on stop, close and identity change; share useful safe errors with full chat.
- Files: `apps/web/components/lumina/{lumina-bubble,companion-chat}.tsx`, `apps/web/components/chat/chat-area.tsx`, `apps/web/app/chat/page.tsx`, `apps/web/lib/chat/error-message.ts`, `packages/design-system/{package.json,src/companion.module.css}`, `scripts/{verify-companion-browser.cjs,tests/chat-error-message.test.cjs,capture-sovereign-built-app.cjs,verify-author-draft-browser.cjs}`, `.github/workflows/companion.yml`, this pickup.
- Non-goals: provider or credit rails, durable chat/history integration, image/voice, SDK upgrades, pricing, paid calls, production promotion or brand identity changes.
- Acceptance: explicit send only; missing key preserves draft and gives Settings recovery; existing SDK renders streams; stop/close preserve partial text and drafts; account changes discard prior transcript and abort; keyboard/IME/focus, 44px controls, 375px, reduced motion and forced colors work; raw provider errors are never rendered.
- Verification: pure error tests; compiled hosted browser fixture and source-bound captures; native lint/typecheck/build and security; inspect the exact preview and mobile/desktop captures.
- Rollback: revert this consumer/styles/helper slice. It changes no creation, billing or persistence data.

## Why this change

| Before                                                           | After                                                                                     | Why                                                                             |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Companion sends a fixed model without a provider or customer key | Existing `useProvider` feeds the installed AI SDK transport on each explicit send         | It uses the same BYOK route as full chat                                        |
| Custom stream parser with no request cancellation                | Installed SDK handles the protocol and aborts its request on stop, close and unmount      | Partial replies remain usable and late responses cannot cross account lifetimes |
| Ctrl/Cmd+K opens both companion and command palette              | Existing command palette owns its shortcut                                                | One keystroke opens one interface                                               |
| Missing-key denial becomes “Something went wrong”                | Shared safe error copy points to customer provider settings                               | The customer gets an actionable next step without raw provider details          |
| Arbitrary consumer styling and animated spring toggles           | Canonical design-system CSS, static keyboard interactions, 44px targets and visible focus | Respect the accepted Arcanea palette and repeated-use accessibility             |
| Empty SDK streams finish successfully with no visible answer     | Explicit “No text returned” recovery retains the sent message                             | A completed HTTP stream alone does not establish a usable reply                 |
| Editing a failed prompt could append a duplicate user turn       | The installed SDK replaces the identified failed message                                  | Recovery keeps the conversational context coherent                              |

The named alternative is the existing full chat's SDK transport/provider implementation. Reuse avoids a second protocol implementation. The installed versions are AI SDK `6.0.300` and React bindings `3.0.303`; no package upgrade is included. Current upstream documentation defaults to v7, so installed source remains the implementation reference for this repair.

## Evidence limits and release state

Implementation is a candidate until its checks and rendered captures pass. The hosted browser fixture intercepts provider requests and emits synthetic SDK stream events. Its synthetic Supabase BroadcastChannel event tests the actual AuthProvider's UI lifetime; it does not establish real login, cookies, production RLS or customer outcomes. No real provider calls or production writes are authorized in that fixture.

At source `249e900e5e6fa440fb5aa22109d8f1875e57c58b`, both Companion runs 38094265938 and 38094906153 pass all four modes with complete cleanup. Initial native CI 38094265927 passes; ready-event CI 38094906230 retains a broader gallery failure because its capture fixture still searches for `Open Arcanea assistant`. The compiled app now calls the control `Open Arcanea companion`. The gallery capture and author-draft overlap check now use that current name, preserving their presence, hiding and geometry assertions. CodeQL analysis 38094906209 and separate finding check 114339265916 report no new alerts for 249e900e. Those results belong to that retained revision; the compatibility revision requires fresh native, browser and security evidence. The owned scope is twelve files, and the companion receipt now binds both consumer fixtures among nineteen source hashes.

The automatic design scan reported incomplete coverage. A manual installed Impeccable scan of the five changed UI/error/style files found two existing decorative gradient headings in full chat. Both now use the shared `--arc-text-primary` token; the shortcut heading uses sentence case. No finding was reported for the companion components, error helper or companion styles. This scan checks code patterns; it does not establish complete accessibility, measured performance or customer acceptance.

Source `49558fee00f17932f281eb927cfdcb35054272a9` retained a failed short-height capture: the full-chat greeting was outside the viewport and could not be clicked. The empty-state flex box was fixed to its parent's height while centering taller content, allowing it to overflow above the scroll origin. It now has a minimum height and can grow within a shrinkable scroll region. The capture waits for actual scroll, viewport visibility and an ordinary click before taking the full-chat screenshot; it uses no forced click, relaxed timeout or hidden loading layer. Earlier captures taken during lazy loading remain failure evidence, not final visuals.

Full chat mounted its closed lazy command palette on entry, showing a dark loading backdrop while the unused chunk loaded. The palette now mounts when its existing open state is true. History/provider hooks are untouched; durable history PR447 remains separate. No active lease covered this page at the scope check, and the owned repair now includes thirteen files with twenty source bindings. The page's required full-file formatting changes layout only outside the conditional mount; the historical state at twelve files/nineteen bindings remains attached to its earlier source.

The broader gallery run at 49558fee also retained an early companion-presence assertion. A hard navigation can reach the specimen before Auth resolves. The capture now waits for the actual companion, then keeps its presence/hiding assertions. The font-fallback context blocks font requests while retaining JavaScript; it uses the same companion presence check. Navigation, fallback prose, typography and specimen checks remain in place.

Compiled run38096641045 at 32cabefc passed 20 source hashes, 12 captures, four browser modes and 24 synthetic requests with clean shutdown. Visual inspection still found faint secondary text and starter cards hidden during their entrance delays. The candidate now uses design-system text tokens, renders the frequently visited welcome without entrance animations, and uses the existing installed Radix dialog for labelled shortcuts, contained focus, Escape and focus restoration. The fixture waits for finite animations before captures and checks all four starters plus keyboard focus. Fresh hosted verification and independent review remain required.

Run38097339361 at 41f85f63 passed desktop and mobile starter/focus checks, then failed on a cancelled finite-animation promise during reduced-motion hydration. Its failed artifact and clean shutdown are retained. Captures now wait until no finite animation is running rather than awaiting promises for animation instances that hydration can remove. The command-palette assertion uses its actual combobox role so the accepted mainline's updated placeholder does not invalidate single-owner keyboard verification.

The branch integrated accepted main1b6905bd without altering its 61 files; the chat diff remains 13 files. Run38097902919 at 3d013a60 then found three legitimate comboboxes on Worlds: creation search, sort and the open palette. The fixture now scopes the single input assertion to the labelled Command Palette dialog and retains the companion-hidden assertion. Its early failure artifact remains recorded. Build/typecheck/lint and broader gallery checks passed at the preceding 41f85f63 source; new final-source checks remain required. The subsequent mainb4520829 update changes only MEMORY.md and is outside this chat diff.

Run38098161662 at 1769fc83 passed desktop/mobile starter and shortcut focus/reachability checks, then timed out while waiting for all background finite animations in reduced motion. The capture now waits only for running finite animations in the actual companion, chat log or shortcuts dialog. Each capture also records geometry and requires full opacity through its ancestors. Background animations remain untouched; request, focus, viewport, starter and cleanup assertions remain. No new local browser or worker is admitted while review-lite reports HOLD at 4359MB free against 6144MB required.

Run38098475857 at 008e70e9 passed all 21 source hashes, 12 captures and four modes with clean shutdown. The shortcut PNGs still showed the underlying page rather than the dialog despite its measured viewport/focus/opacity checks. Visual acceptance failed. The dialog now uses the standard sibling Overlay/Content portal layout, and the fixture checks dialog visibility, viewport and focus again after capturing. Welcome copy now describes creative actions instead of promising image speed, instant stories or a specialist count. Fresh verification and actual visual acceptance remain required.

The root cause is the chat route's existing fixed z-100 isolated layer: a default body portal at z-50 paints beneath the whole page, even while Radix disables the covering page's pointer events and lets focus/click checks pass. The shortcuts portal now mounts inside the existing chat-area root, so it shares the route's layer. No layer constants were increased. Review and browser bindings now also include the unchanged chat route layout, for 22 source hashes. Actual rendered dialog inspection remains required.

Retained attempts: run38092654639 at `010c7077afcff4148e256feca38822c2c192efa6` could not locate the opener after five seconds. Run38092934564 at `735399aeaf437d6d7a718d88dd26fae908cad929` retained a failure screenshot and no page errors: the normal first-visit Worlds dialog correctly hides background controls from accessibility navigation. The fixture now dismisses it through its visible Skip button. Increasing the wait alone did not fix the check. Both failed receipts remain available. A separate in-process check of the installed SDK reproduced an empty stream ending `ready` with no error or answer; explicit empty-response recovery was then added.

Run38093433718 at `d18b46b44f31a812775255aa99efb4afb31322f8` reached SDK streaming and aborted the stopped request, but then observed a third fixture request and the unsent draft in the transcript. The Stop button had been reused as a submit button before the click default action finished. Stop now prevents that default action and Stop/Send have separate React identities. The regression checks that stopping sends no additional request and preserves the draft. No real provider call was made.

Cancellation aborts the browser request. The current server chat route's provider cancellation and billing behaviour are outside this scope; already-started work may still be charged. Provider key storage remains the existing browser settings implementation, whose wider account isolation is a separate owned task. Replies are ephemeral in this page and do not transfer into full chat.

Production release requires exact-revision independent review, real provider acceptance and applicable release gates. The full Arcanea programme remains active: Queen/SIS, graphs/memory, private creator workspaces, canvas, reader scenes, academy/community, books/media, developer kits and commerce remain distinct obligations.

Skills applied: Starlight SI routing (one admitted implementation lead), Emil design engineering, Premium Web OS and humanizer. Loading guidance is not proof of runtime enforcement. Machine pressure keeps builds/browser work on the hosted runner; no new local swarm, install or server is started.

## Integration with accepted production, 11 October 2026

Scope: integrate the preserved chat562 candidate with current production and repair
credential lifetime and full-chat Stop. Owner: Codex thread
`01a1269f-23eb-7bb2-b609-77d731cacc50`, isolated checkout
`arcanea-provider-account-20261011`, branch `agent/codex/provider-account-20261011`.
Programme: #276. Accepted base: `a4285de66ce00cbbaa66d7f5b6910f9b627be49f`.
Preserved candidate: `86a412efcebf3873bbed0d8796d6a684e85470da` (#562).
Original #562 and stacked #567 remain intact. The sixteen accepted document-recovery
files are integration-only; no live migration is executed.

Files: the original thirteen chat files, use-conversation Stop action, portable
companion/Stop SDK regressions, and ChatWelcome/ChatNotices/ChatOverlays components.
Acceptance: current actor/key is checked immediately before SDK fetch; changing
account A to B to A cannot resurrect an obsolete callback or recovery alert;
removed keys do not send; updated keys are reread on explicit send; Stop aborts
without resending and retains the partial answer. Existing browser, keyboard,
mobile, reduced-motion and safe-error requirements remain.
Verification: native actual-SDK tests, scoped formatting/lint, frozen hosted
build/typecheck/lint, exact-source compiled browser captures and independent review.
No paid provider call, billing/credit change, SDK upgrade, production secret,
permission change, asset generation, canon promotion or live SQL migration.
Rollback: reviewed revert of this consumer slice; preserve accepted scene and
project-document work, account preferences and unfinished branches.

The first broad own-lane refresh hit the native routing subprocess's eight-second
limit twice. Refreshing only this integration's explicit paths succeeded through
supported claim --adopt. No peer lease was changed. Native leases govern their
resolved checkout; the other checkout's broad manifest claim is preserved and
does not reserve this owned integration globally. AGENTS.md source remains
`36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5`.
Node 24/pinned pnpm remains Frank's selected contract. Machine review-lite admits
one bounded workload and no new parallel agents; builds/browser work use hosted CI.

Before correction, seven of the nine portable companion cases failed against the
actual old component. The matching-send and current empty-reply controls passed.
The actual full-chat input binding called handleRegenerate, which did not abort.
The first Stop fixture needed explicit synthetic-stream cleanup after that handler
replaced the SDK active response; its hung attempt is retained as failed evidence.
The corrected fixture then reproduced the missing abort in under one second.
After correction, the nine companion cases and five Stop/account/safe-error tests
pass locally using the already installed real SDK. React scheduling and provider
responses are synthetic. No production login, RLS or provider-quality claim follows.

Notices, welcome and overlays now have separate ownership and the chat page and
chat-area component remain under 500 lines. The existing oversized conversation
hook is changed only to expose the SDK Stop action; its broader refactor remains.
Welcome copy no longer claims that keys never leave the browser or promises an
unverified model count. One inherited mount-effect lint warning remains in the
extracted welcome component; scoped lint has no errors. Hosted checks, fresh
rendered inspection, independent review and real-provider/customer acceptance
remain pending at this checkpoint. The full Arcanea programme stays open.

The enabled staged secret scanner blocked the first commit on generic-api-key
in the synthetic key assertion. The fixture uses short, unmistakable dummy
values now; no exclusion, allow comment or hook bypass was added. The redacted
finding is retained privately. A clean scanner run is still required.

At public candidate `68becdf21be8794276cc4d484a5e5738d1f66148` (#591), hosted
frozen install and TypeScript passed. Companion38159959317 built successfully,
then failed because its old shared provider storage write was correctly ignored
by the accepted account fence. The fixture now executes the actual checked-in
providerStorageNames helper and supplies guest-scoped keys/provider/model. Its
request body, no automatic sends, identity abort and recovery assertions remain.
CI38159959285 lint failed on the extracted welcome mount effect under the actual
zero-warning contract. The welcome now uses a stable hydration snapshot with the
same server/initial-client fallback, following React's documented server snapshot
contract (https://react.dev/reference/react/useSyncExternalStore). Fresh scoped
lint reports nine files, zero errors and zero warnings; fresh hosted checks remain
required. The earlier failed attempts are retained. No timeout or safety assertion
was relaxed. Local review admission is HOLD after free RAM crossed the floor;
no new local browser, reviewer, install or worker is started.

## Hosted release follow-up, 11 October 2026

At candidate `287241d0574c55549133d00515d6d11c845ba334`, CI38160630917
passes frozen install, lint, TypeScript and build. Companion38160630885 passes
four modes, 24 synthetic provider requests, 28 source hashes and twelve captures;
the receipt reports browser/stream-server cleanup with no errors. The source,
PNG sidecars and downloaded artifacts remain bound to that retained revision.
Desktop/mobile companion and full-chat, mobile shortcuts, short-height reduced
motion and forced-color companion frames were inspected. The welcome and controls
are readable/reachable. Inherited full-chat composer contrast remains a separate
acceptance gap; passing this fixture does not close the full visual/product bar.

Reading38160630282 fails at the existing launcher-overlap check because its exact
locator still names `Open Arcanea assistant`; the app now names that same control
`Open Arcanea companion`. The locator is corrected without removing presence,
geometry or overlap assertions. Fresh compiled reading/auth/database evidence is
required. Production alias inspection reports READY at accepted base
`a561c3e2c34eb0898339e53377b11f47eadf956c`; this chat candidate is still a draft.

Owner and issue remain the integration contract above and programme276. Scope
also includes the reading verifier, `scripts/review-companion.py`, its no-network
admission regressions, the owned Companion workflow and this pickup. Budget:
one anonymous call per matching hosted PR event to explicit model
`nvidia/nemotron-3.5-lightning:free`, only after the live catalogue confirms zero
prices and the complete encoded request fits its context. No credentials, tools,
fallback or retry. Only already-public exact Git source is submitted; unpublished
IP, private memory, assets and customer content are excluded. Kilo's current
anonymous/model contracts were checked at https://kilo.ai/docs/gateway/authentication
and https://kilo.ai/docs/gateway/models-and-providers. Providers may retain public
inputs/output; this does not authorize private-data submission or paid inference.

The hosted reviewer adapts the existing retained public review protocol. It
requires the owned same-repository branch/actor, public commit and matching open
PR head/base; covers every changed file and complete required context; scans the
actual encoded input with inline allow comments disabled; verifies model, full
coverage, source quotes and manifest in the response; and rechecks the PR after
inference. All response/usage/source receipts remain artifacts. A source pass
still requires lead reconciliation and cannot establish runtime/customer release
acceptance. Other lanes/forks do not dispatch. The payload scanner is pinned to
gitleaks8.30.1 and its official GitHub asset SHA256.

Acceptance: denial of missing/nonzero/invalid prices, incomplete context, private
source, wrong owner/revision, inherited credentials, incomplete coverage and
invented source quotes before promotion. Verification: actual no-network review
tests, unchanged native SDK regressions, secret/ownership hooks and fresh hosted
checks plus complete independent source verdict/reconciliation. Rollback: revert
the reviewer/job and locator follow-up while preserving the consumer correction
and accepted production. Stop at any provider/schema/coverage failure; preserve
the attempt and repair the actual cause rather than bypassing it.

Fresh review-lite admission reports HOLD at 5668MB free versus 6144MB required,
27 task runtimes and no owned dev server. Hosted execution supplies this review;
no local reviewer, server, build, installation or new agent is started. The current
capability-loading path is absent on starlight-agent-config origin/main; its
scoped historical source was explicitly read at
`fed3c56c8166ef4457cf164b36d5524e569b7224`. That read restores guidance for this
session, not accepted policy or a runtime enforcement mechanism. Queen/SIS,
memory/graph/canvas, commerce, publication and the full programme remain open.

At follow-up `47ac623f09f6850845f9ec5b7a867b9fb0a2a5c0`, CI38162432267
passes install/lint/typecheck/build. Reading38162432370 passes compiled reading,
isolated database and actual password-login/private-scene fixture stages. The
compiled Companion job38162432329 also passes. Its independent source job fails
correctly: the model omits input-bar, tokens.css and the SDK context test while
claiming an unsupplied chat-layout file. Its apparent pass is unvalidated and
cannot approve anything. All 42 complete inputs, raw response and failed receipt
are retained; that single attempt reports 243894 prompt tokens, 2183 completion
tokens and cost0. No retry of that unchanged review is made.

The current review protocol supersedes the earlier single-call budget: three
sequential zero-price module calls maximum per matching event, with fresh live
price/source checks before each call and immediate stop on any defect or invalid
response. Experience, account/transport and verification each have explicitly
assigned changed paths and shared complete context. Every changed path has one
accountable module; the aggregate must cover the entire original source manifest.
The prior 42-file manifest maps to 26/20/31 complete files and 8/3/11 changed paths
respectively. The model must give verifiable, quoted audit observations from
distinct supplied files as well as exact coverage; copied placeholders or invented
paths cannot pass. Eight actual no-network regressions pass, including complete
module union, unavailable/private context and pre-inference scan/price refusal.
Fresh hosted module results are still required. Application source is unchanged
by this protocol refinement, but the new candidate requires fresh revision-bound
checks. No customer, paid provider, production migration or whole-product success
is established by these fixtures.

At `e2996a7087535fdd159cf005095e460ff8f0dbf2`, CI38163275690 and
Reading38163275706 pass, as does the compiled Companion job38163275611.
The experience review stops at finish_reason=length: all12000 output tokens were
reasoning tokens, with zero final content. That attempt reports cost0, has no
valid verdict and remains in the retained artifact. Other modules did not dispatch.
The output allowance now includes24000 reasoning/visible tokens, each call has a
240-second bound and the three-module job has an18-minute bound. This preserves
reasoning, the complete source, exact quotes/coverage and truncation refusal.
The documented combined reasoning/output budget behavior was checked at
https://openrouter.ai/docs/guides/best-practices/reasoning-tokens ; Kilo/model
behavior remains subject to actual response evidence. Nine no-network cases pass,
including the actual parser's denial of empty, truncated, tool-bearing and wrong
model responses. No source verdict or production promotion is claimed.

At `7b99e4dac74c73cdd5ad5b10aa25ae11249f631a`, build, types, lint,
compiled Companion and Reading38163995274 all finish SUCCESS. Independent
review 38163995268 is rejected for a source-binding mismatch: the response invents
eight-character head/base values and a different manifest. It also uses synthetic
ellipsis quotes and alternate finding fields. Its unvalidated warning cannot
approve the source or establish those findings. The single call reports 143792
prompt tokens and 13552 completion tokens. It finishes normally and reports zero
cost. The raw response, complete inputs and failed receipt are retained. No
unchanged retry.

Accepted main `d5f16b301dde856b004a1a262f596a4ca9c04e86` is integrated
as merge `f26b8ae99184cb6a686bd8be997363b151d375c5`. Its seven document,
footer, fixture and worldbuilding paths are integration-only and remain identical
to accepted main. This chat candidate still changes 22 paths and does not execute
a live migration. Latest read-only alias metadata reports production READY at
d5f; that deployment does not contain this candidate.

The prompt previously told the reviewer to replace all example fields, including
the literal binding values, and omitted the exact finding object from its example.
The repair uses an actual strict JSON Schema: full head/base/manifest values are
single-value enums, source paths are supplied enums, and findings require the
literal quote, scenario and fix fields. The exact binding is repeated after the
source. Local validation remains mandatory even if the endpoint ignores or only
partially enforces the schema. Observations must also audit changed paths.

The explicit independent model is now `dots-studio/dots-3-note-preview:free`.
Live Kilo catalog evidence lists 512000 context and both response_format and
structured_outputs; its official model card describes code and long-context use,
without establishing performance on this task. The previous model did not list
structured output support. Sources checked: https://kilo.ai/docs/gateway/api-reference,
https://openrouter.ai/docs/guides/features/structured-outputs and
https://huggingface.co/dots-studio/dots3-note-prev . No superiority claim is made.

Budget: five sequential anonymous zero-price calls maximum, one per experience,
account/transport, companion-browser, reading-browser and review-protocol module;
240 seconds per call, 26 minutes per hosted job, immediate stop on any failure,
no credentials, tools, paid fallback, automatic retry or private source. Every
changed path has one accountable module and the union includes all 42 complete
source/context paths. All five actual encoded packets must pass inline-allow-free
secret scanning, live explicit-zero prices, structured-output support and the
unchanged conservative byte-based context bound before inference. Endpoint/schema
errors remain failures. This supersedes the earlier three-module contract.

Ten actual no-network admission tests and 14 actual-SDK/account/Stop/error cases
pass locally on Node 24.16.0. Packet previews fit the verified 512000 context bound,
including the 24000 output allowance; these previews are not hosted review results.
Machine admission remains HOLD at 4651MB free against 6144MB required. No local
build, browser, install, reviewer or agent is launched. Fresh complete independent
review, exact-source hosted checks/captures, reconciliation, release gates and real
provider/customer acceptance remain required. The full programme stays active.

## Composer refinement after the d00 review failure

Scope: Make the full-chat composer, model selection and focus controls readable
and usable with keyboard and touch, while preserving send, Stop and account lifetime.
Owner: codex-provider-account-20261011, programme #276 and draft PR #591.
Files: Existing owned chat page, input bar, agent header, design-system companion
stylesheet, browser fixture, review protocol and this state record. The input-bar
styling is adopted from this same thread's retained entry-handoff lane; its draft
and history work remains preserved in PR #567.
Non-goals: No billing, provider spending, credentials, canon, migration or release
approval. No claim of customer success from synthetic streams.
Acceptance criteria: Rendered enabled text and placeholders meet 4.5:1 contrast;
icons meet 3:1; primary composer controls have 44px targets; model selection works
with keyboard, Escape and focus return; all existing interruption checks pass.
Verification: Actual hosted compiled browser fixture, source-bound captures,
existing SDK tests, lint, typecheck and build. Valid independent review remains
required at the resulting revision.
Rollback: Revert the composer refinement commit without removing accepted main
or the preceding account/Stop changes.

Accepted URI normalization main 89f9d1fd911407aa3bc8128fecca96f00c7cc6c6 is
integrated as dc32e4ac642ce8e1340a7d2cabbc2288a6d81edb. All five incoming
Git objects match accepted main; their integration-only ownership is released.
Production was observed READY at 89f9d1f. This chat candidate remains draft.

At d00b4e3381df911085b71c9431b126f8c46aa17b, build, types, lint,
Reading 38165933399 and the compiled Companion job 114548376488 pass.
The independent review in 38165933431 fails literal source-quote validation.
It also repeats observations from one file. The single response reports cost zero
and a normal stop; four remaining modules never dispatch. Its proposed SDK
dispose method is absent from the inspected installed SDK, and its type-only
runtime claim lacks a demonstrated failure. Neither finding nor verdict is
accepted as valid. Raw evidence is retained, and the validator is not weakened.

The prepared paid Gemini packet is not executed or approved. It becomes stale
when this candidate changes and must be rebuilt and cost-qualified if approved.
Current PP admits one bounded review-lite workload at 7520MB free, with no new
parallel agents. Design guidance is read from the existing design-agent-standards
repo because the historical loose-root paths have moved; this is an explicit
source handoff, not a new runtime enforcement hook.

The composer now uses a solid design-token surface, readable token text and
placeholder colors, 16px input text and 44px controls. Focus pills expose pressed
state and keep readable labels when inactive. The model picker uses the already
installed Radix radio menu with keyboard navigation and Escape/focus recovery.
No dependency is added. The browser fixture measures actual rendered placeholder,
label and enabled-icon contrast and target geometry in each of its four modes;
those new assertions have not yet run in the hosted compiled app.

The retained low-contrast captures are the refinement input. The serious design
alternative is the existing accepted composer with faint controls and a click-only
model popup; this change preserves its creation and account behavior. No buyer,
competitor superiority or paid product qualification is inferred from the change.
Four modified TSX files parse with the installed compiler, 14 actual-SDK/account/
Stop/error cases pass, and ten no-network review admission tests pass. Quoted
citations now require the very cited source line; wrong-line, joined-line and
changed-whitespace regressions are denied. The independent prompt specifies this
literal format and requires evidence before inventing an SDK cleanup API.
Fresh compiled browser checks, typecheck, lint, build, design inspection and valid
independent review remain pending. No production promotion is made.

Local complete-packet preflight at 873acd6cde4b1434ec6e66807f362fe53b171a26
denies the experience module's 508167 encoded bytes against the unchanged
512000 context bound including its 24000 output reserve. No inference occurs.
The failure receipt is retained. The complete-source review is now six sequential
modules: experience, composer, account/transport, companion-browser,
reading-browser and review-protocol. Every changed path still belongs to exactly
one module; shared complete context is retained. Composer adds complete focus-mode,
model inventory and disclosure source. No file, quote validation, output reserve
or context bound is weakened to fit. Maximum six anonymous zero-price calls,
240 seconds per call and 30 minutes per hosted job; no automatic retry or fallback.
This supersedes the five-module contract for the refined candidate.

At c61ad5cd4bdf316b98ba95e810d438b9e61e6e4c, all six packets pass local
payload scanning and live zero-price/support/context admission with 46 complete
source/context files and 24 changed paths. Lint and typecheck pass on the hosted
candidate. The compiled browser reaches the new contrast assertions but fails
to find the model menu by its specified accessible name. Actual installed Radix
source supplies aria-labelledby from the trigger before spreading content props;
that attribute overrides aria-label in accessible-name computation. The content
now explicitly clears the inherited labelled-by attribute, preserving its intended
Choose a model label. The fixture keeps the same name and recovery assertions.

An external GitHub action advanced this branch to 7be4522688a67bad42ec12b58d4c6e7999e0e7b0,
merging accepted auth main eeba317030e2b4b268d77f756c400e39ac917db9. The
local owned branch fast-forwards to that published descendant and preserves the
accepted auth Git object exactly; integration-only auth ownership is released.
The c61 CI/Reading/independent handles are terminal cancelled, not still running.
Their retained review receipt records one dispatched call with no result/verdict;
no cost or quality result is inferred. The later 7be Companion run38169354969
is terminal failed, with compiled114558542389 and independent114558542538 both
failed. Consume its separate artifacts without relaunching that unchanged source.
PR591 was externally marked ready and is restored to draft while browser acceptance
fails and the separate paid review approval remains pending. This preserves the
actual source merge; no high-risk promotion or funded review is authorized by
readiness alone. Fresh checks are required for the name repair.

## Accepted chat production and bounded interface follow-up

Scope: Complete the chat selector and featured companion controls with Phosphor
SVGs and visible keyboard/touch targets; require decoded welcome images in render
captures; make the review verdict policy explicit and support a narrow follow-up
without dropping complete configured context.
Owner: codex-provider-account-20261011, programme276. Original PR591 is merged by
another action; this follow-up needs its own draft PR.
Files: Owned agent-header.tsx, chat-welcome.tsx, verify-companion-browser.cjs,
review-companion.py, test_review_companion.py and this state record.
Non-goals: No provider spending, credentials, migration execution, canon/name
changes, private-store provisioning or claim of complete creator acceptance.
Acceptance criteria: Existing send/Stop/account/draft and menu/focus recovery pass;
selectors render SVGs and featured controls have44px targets; welcome captures
wait for image decode and include dimensions; all changed files have one review
owner, all configured complete context is retained, and contradictory verdicts fail.
Verification: Hosted compiled browser, lint/typecheck/build, source/PNG bindings,
no-network review regressions, exact-revision independent reconciliation.
Rollback: Revert only the follow-up commit; retain accepted production ancestry.

Current remote merge7a3cc5db0a42796c55b86074690dfce3ae3120f5 preserves accepted
private-image maina05de2b978fe97a9c670ecba67bca1a132eb63a8. All29 incoming Git
objects match that accepted main; integration-only ownership is released. No
migration or private-storage configuration is executed by this lane. Accepted
private-image source remains separate from actual supplier/store/customer proof.

CI38170241793 passes Install, Lint, TypeScript, Build and CI Status at7a.
Reading38170241802 passes. Companion38170241798 compiled114561153399 passes,
but independent114561153626 times out after one dispatched experience request:
no response, usage or verdict. The prior43cc independent114560053508 also times
out; its CI38169875820 Build is terminal cancelled after the newer remote merge.
Those cancelled/timed-out attempts are retained and are never restarted unchanged.
No valid current independent source verdict is claimed.

All12 actual7a captures were inspected;31 Git-source hashes and every PNG/sidecar
hash match both7a and accepted production sourced2285fb74f296ce783d3f0fed9bdef6959e3f9d9.
Four modes prove close/Stop/identity recovery, menu keyboard selection/Escape/focus,
shortcut containment/return and no page errors. Each measures14 composer/control
entries: minimum contrast7.2109 in ordinary/reduced modes and14.0247 in forced
colors, with44px enabled controls. These are24 synthetic loopback requests and
zero real provider calls/production writes; owned browser/server cleanup succeeds.
The desktop welcome capture lacks a completed mascot image, so visual readiness
is incomplete despite the behavioral pass. The follow-up waits for visible,
loaded and decoded mascot imagery and records dimensions before capture.

An external action merges591 at20:04:56Z to d2285fb74f296ce783d3f0fed9bdef6959e3f9d9.
The current arcanea.ai alias points to READY production deployment
dpl_BqPRrUniUUUB2Kgu8hNMmvEfgfJ7 at that source. This lane does not perform that
promotion or infer an independent verdict, budget approval or customer success
from the merge. The review-timeout gap remains explicit.

Raw7be review findings and response hash are preserved. Its pass plus three
findings is invalid and is not normalized into approval. Lead reconciliation
traces intentional draft retention/close abort, closed-first dialog/ref timing
and the stream-only Stop trigger with error reset on the next send. No cited
failure is reproduced in the stated scenario; source-only gaps remain. The
prompt now states that pass requires empty findings, including P3 suggestions.
The validator still rejects contradictory verdicts, false lines/quotes, wrong
source/model, missing coverage and private/paid inputs.

A follow-up changes four review domains. The contract dispatches only domains
with changed files, at most the original six; every changed file still has one
owner and every configured complete context remains supplied. Inherited chat,
error-display, SDK/account and reader context is added explicitly so accepted
files stay reviewable after the original changes land. Unregistered context and
empty changes are denied; aggregate coverage and source/price/scan/support bounds
remain enforced. No output/context bound, timeout or release assertion is reduced.
Eleven no-network regressions pass, including complete sparse-follow-up coverage
and nonempty pass denial for every priority. Two changed TSX files parse; browser
syntax and owned-file formatting pass. Fresh hosted renders and full checks are
required for the follow-up. The separate $2 review approval is still unanswered.

The full goal stays active: real read/create/save/reopen/payment and private
production storage, graph/memory/canvas/studio, operational Queen/SIS, academy/
community, books/art/music/video, income streams, API/MCP/kits/IP and clients all
retain their owning acceptance and publication gates.

## Follow-up browser pass and state-record formatting repair

At 49aeae5748da91f6074ced81245873bc0c3da142, compiled companion job
114566511193 passes all four modes with no browser failures and complete cleanup.
All four full-chat captures now record decoded mascot images at 140 by 76 pixels.
Desktop/mobile renders show the actual SVG selectors and featured controls.
CI 38172051566 Build and TypeScript pass, but Lint job 114566648600 fails only
the changed-file Prettier step for this appended state record. Its raw log is
retained. Formatting is repaired in the owned record; application and fixture
source remains unchanged. Fresh exact-revision CI is required.

Independent job 114566511321 returns one experience response with normal stop,
89,528 input and 11,955 completion tokens, including 10,741 reasoning tokens,
and reports zero cost. The source-quote validator rejects it. No verdict or
remaining-module coverage is accepted, no quote is normalized, and no unchanged
source is retried. The response and unvalidated findings remain retained. The
strong independent review and real creator/customer acceptance remain open.
