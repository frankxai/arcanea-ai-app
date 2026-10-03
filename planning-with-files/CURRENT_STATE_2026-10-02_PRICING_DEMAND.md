# Pricing proposals and interest capture

Source: goal `01a0f74f-8bad-7db1-ab06-fd89b5faec84`, app #276 and #427.
Base: main `e863be8304fdde9f00ba812d7845d66ec52787b9`.
Owner: Codex, branch `agent/codex/arcanea-pricing-demand-20261002`, in the existing
assigned source-consolidation worktree. Original draft #403 at
`f20484f8ec7cc02e2f9507f08186057597360db5`, owner task
`01a08d75-75fd-7ab2-9234-5351ac1a51e9`, remains intact with its untracked audit.
This additive derivative does not supersede or authorize that draft.

User job: distinguish proposed plans from available offers, register interest and
know whether an email reached the interest list. Signup is not paid demand,
delivered value, an entitlement or mail-delivery proof. This serves #276's audience
and release priority.

Scope: reconcile existing pricing and metadata. Retain $0/$12/$39 as explicitly
unapproved proposals. Remove unsupported popularity, unlimited usage, tool/repo
counts, blanket licence, local-only hosted privacy, first-100 scarcity, lifetime
discount, private Discord and access/delivery claims. Keep plan comparison, signup
and world/library/source paths. Use existing design variables, canonical glass
recipe and sentence case. No images, animations, dependencies or new tokens.

Original #403 only adds program/source/page_path to the old form payload. Its
broader Growth Core API would replace the newer #458 durable Supabase insert.
Use main's unchanged API/insert adapter with email/source instead. Shared submit
helper and nine tests are copied byte-for-byte from draft #493 at
`27ad6204f098b2edffd3a8fbb2dc828a1bd5b75e`. Identical source avoids a second request
implementation. This branch starts at main and includes none of #493's community
edits. Add the same native test path to CI; preserve every existing check.

Files: pricing client/metadata, shared waitlist helper/tests, CI test path and
this record. Guidance: AGENTS.md, apps/web/CLAUDE.md, TASTE.md, DESIGN.md, humanizer,
#276 hierarchy, #408 merge authority and #427 proof. Historical MIT/count
requirements in taste guidance are not evidence of rights or shipped capabilities.

Behavior: retain source `pricing_founding_circle`. Native required/email/max320
validation stays active. Unique label/control/live-status IDs bind descriptions.
An immediate ref prevents duplicate pending requests; email is read-only during
save and clears only after HTTP success plus literal JSON success. Failures retain
it. The ten-second timeout acknowledges a possibly completed write and safe retry.
Repeated emails remain on the shared list, without a second plan subscription.
The form stays mounted; no confirmation mail or paid access is claimed.

Non-goals: approve prices/benefits/licence/Heart, checkout, new subscription or
backend, mail, world/auth/canon changes, archive/rename/history, homepage/dossier
integration or production. Draft #487 already contains README/community/repository
metadata proposals absent from main; do not duplicate them. Launcher upstream is
unresolved. No foreign branch, audit or remote is changed.

Budget: one sequential interactive text/test workload. PP bounded, 7800 MiB free
at admission; disk bounded at about 14% free. No installation, new worktree, local
full build, browser or persistent service. Independent provider review is a
sequential tool-free call, maximum USD 1 and 300-second deadline. Stop on changed
branch/upstream/ownership, machine hold or failed verification. Preserve attempts.
No merge/mark-ready/deploy; #408 and #427 retain authority.

Acceptance: explicit proposal status in copy/metadata, retained unapproved numbers,
honest shared-list capture, recoverable failures and current API payload. Local
behavioral cases and static React render, exact-source independent review and
four native CI contexts are required for a verified draft. Static rendering does
not prove hydration, interaction, layout, live storage or customer success.
Browser and release gates remain pending until executed at the exact source.

Verification: existing Node 22/Sucrase type erasure for 15 join/submit cases; real
React static markup; scoped formatting, diff and secret hooks. Remote frozen
Node/pnpm performs native tests and build/typecheck/lint/status. No live signup or
database write. HTTP fixture uses real fetch and unchanged insert adapter with an
in-memory sink; its owned server closes at completion.

Rollback: leave the draft unmerged. If later integrated, revert its scoped change
while retaining the identical shared helper if #493 has also integrated. Preserve
main #458, merged world/auth work and other proposals.

Local results: all 15 join/submit cases passed using Node 22 and Sucrase type
erasure, including actual HTTP fetch through the unchanged insert adapter fixture.
Real React 19 static rendering passed proposal-price/copy, unique ID, bound
label/status, native validation and expected-link checks. This is source/SSR proof;
browser interaction and live database behavior remain untested. Both pricing
TSX files use the verified lockfile-pinned Prettier 3.9.9 standalone formatter.
Shared helper/tests remain byte-identical to #493; backend/world/auth/lockfile
remain unchanged. Editing an email after a result resets the old status so a
different typed address does not retain a stale successful-save message.

Independent complete six-file review at `154a9b11542984f2bc9e4aa6978dad800dd27959`
returned PASS with two LOW and two INFO findings. Restore the prior external
GitHub new-tab behavior with explicit opener protection. Keep the field's native
validity and bound live status; marking every transport/storage failure as an
invalid email would misstate the error. Field-specific server400 classification
remains a follow-up shared with #493. INFO concerns describe tested response-body
failure and server-side email normalization, requiring no runtime change.
The stale-result reset is a lead self-review correction beyond those findings.
Current two-file correction review and native CI results are recorded on #276
and draft #494; no result is inferred from the earlier source. Initial preview
`dpl_4AFsuLVpaV5Z44sYk3f1MWzYVoim` was CANCELED at ignored-build despite the GitHub
success status. No extra deployment or settings changes.

Two malformed patch-tool inputs were rejected before any edits
(missing patch wrapper, then duplicate delete/add target). A single-file update
applied successfully; no partial failed patch remained.
One follow-up formatter/diff invocation used the private evidence cwd: static
rendering succeeded, but relative Markdown formatting and Git reads failed.
No staging occurred there; re-run formatting and Git checks from the assigned repo.

## Pricing browser proof, October 3

Source: existing goal and owning #276; draft #494 at 455f815db8352ffb31140694d9a4f9089ff3bc30.
Owner: Codex, existing assigned sparse worktree and pricing branch.
User job: distinguish unapproved plans from available offers, reach the existing
world/library/privacy paths and recover an interest submission without losing
the address or mistaking an uncertain write for a confirmed one.

Four-file follow-up: CI, pricing client, scripts/verify-pricing-capture-browser.cjs
and this record; full draft becomes seven files. Shared submit helper/tests,
API/insert adapter, metadata, lockfile, community #493 and original #403 stay intact.
Acceptance: actual Chromium desktop,375px touch,reduced-motion journeys exercise
proposal prices/no checkout, one shared main, same-tab anchor and world/library/
privacy navigation, native email validity, associated live-status IDs, immediate
pending guard, failed HTTP/nonliteral receipt/reset recovery, real10s timeout and
retry, stale receipt reset and viewport bounds. All writes are intercepted; nine
fixture POSTs retain pricing_founding_circle per mode. Source hashes and actual
built merge/source commits are saved in CI artifact; required checks remain.

Serious alternative: original #403 annotates the old payload and broadly replaces
the newer durable API; this derivative reuses the unchanged #458 insert adapter
and shared request helper, keeping the existing public proposal/interest job.
No paid product/demand/customer success is established by a working form.

Fresh Vercel deployment dpl_5zo55nSdrrzw4FDS2L5MhAVzVLdU is CANCELED at the
ignored-build step, bound to455f815db8; GitHub SUCCESS does not establish preview
availability. No redeploy or setting change. Prefer actual native built browser
evidence until an existing source-matched preview is available.

First native attempt deliberately leaves pricing runtime unchanged to reproduce
its inherited nested main in the actual built app and inspect further behavior.
The verifier reuses the proven community fixture lifecycle atd677479680; no
community source is copied into this proposal. An initial Node input parse failed
before execution; a subsequent sparse missing scripts-directory write failed,
then the explicitly owned path was created. No partial wrong-source edit remains.

Guidance loaded: repository/web/shared instructions, master plan, taste/design,
workspace and outcome/performance contracts. Official Playwright network,
locators and navigation/hydration docs consulted before implementation.
Budget: sequential text/small verification; no local install/build/browser/worker,
no extra agents. Native CI owns the timed server and closes it via EXIT trap.
Full updated seven-file independent review remains pending; earlier six-file
and two-file review do not cover this follow-up. Preserve terminal provider-limit
receipt; do not retry quota-blocked review. No human licence/price/Heart decision,
merge/deploy/live signup/mail, demand or release proof; #408/#427 remain.
Stop on identity/lane changes or failed checks; inspect the same live run until
terminal. Rollback: scoped revert of this follow-up, retain the shared helper.

First native37097095817 at9df829c0642fc35498ce83c9282326816bdb3349 is terminal
FAILURE. Install/Lint/TypeScript pass; Build/CI Status fail. Artifact11264922050
binds builtmerge65576537188f0916bc809f9da9b5b7559b893547 (verified parents main
79f3fb25ca8d34c22eae1210c7c92ae2ebe8ea0b and source9df829c064). Actual Chromium
153.0.8010.12 stops all modes at missing pricing-content container; zero signup
journeys execute. SHA256 10cd2bc392cf9c37c157341b6c3db9e75610577e591a70340de1776f2dcd76e7.
This failure proves the named-container mismatch, not yet the one-main or signup
behavior. Preserve the original artifact and full seven-file source packet.

Source inspection separately confirms the inherited nested pricing main inside
layout main-content. Correction uses a plain pricing-content div in the existing
shared main, a named form with aria-busy during save and an alert role on failures.
The existing readonly pending field, ref guard, required/email/max320 validation,
price proposals, source payload and shared helper remain intact. No design
constants, labels promising availability or backend/storage behavior is changed.
The same fourteen grouped journeys are retained, including one-main assertion.
Resulting-source native browser/checks and exact seven-file independent review
remain required; the earlier static-render/review passes are not extended here.

Second native37097649133 atadf1e0b149 is terminal FAILURE; Install/Lint/TypeScript
pass and Build/CI Status fail. Artifact11265056423 binds builtmerge279bcdbc372471941afaae698bae60c2ad0c87fe
(main79f3fb25 plus sourceadf1e0b149), Chromium153.0.8010.12, JSON SHA256
7ed43f87552083e440af98df36a7dfed0c0720ecd1472e3a782eb23fa40d36b4. All three modes pass the
proposal/single-main and hero interest-anchor groups, then stop at the Worlds
heading hidden from the accessible tree by its real first-visit dialog. No signup
groups execute. Source inspection confirms the Radix Worlds onboarding hides
underlying content and returns focus to worlds-heading when completed.

Verifier correction walks all three existing dialog steps using actual keyboard
or touch, checks dismissal and returned heading focus, then verifies the actual
page heading. No injected onboarded flag, skipped navigation, weakened heading
assertion or Worlds implementation change. Failure diagnostics now retain path,
main count and dialog headings. All fourteen grouped journeys remain required.
The earlier same-source37097601441 was canceled by the PR edited event when the
complete-scope description was updated; not an observation timeout or test verdict.
Both failure artifacts/source packets remain preserved; native proof and current
seven-file independent review remain pending.
