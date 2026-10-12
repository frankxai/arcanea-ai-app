# Authenticated Library reading recovery

A signed-in reader needs confirmed completion to survive reload without exposing
it to another account. This acceptance slice belongs to [release issue 280](https://github.com/frankxai/arcanea-ai-app/issues/280).
The full founder programme remains active.

Current accepted base: `795953011c4fa44e8d1078539182ed7ee66a1cfd`; owner
`codex:01a127b9-5a4e-7b83-ae44-ddc8e8a6a8cb`; branch
`agent/codex/reading-progress-auth-20261012`. Nine explicit files are owned.
Root instructions SHA256:
`36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5`.
Explicit instruction reads do not reload native startup instructions or enforce
policy in other harnesses. Foreign chat, documents, chapter reader and shared CI
files remain unchanged.

The accepted hook/tracker from PR622 already passed controlled lifecycle and real
React leaf checks. Those used synthetic accounts and table transport. The new
mode reuses the existing disposable GoTrue/PostgREST/Postgres runner, ephemeral
password accounts and the compiled application. Its original scene acceptance
mode is preserved. No additional scheduler, service or provider is introduced.

Read-only production metadata on October 12 confirms the selected progress
columns/defaults/constraints/indexes and three owner-based RLS policies. The new
CI-only SQL reproduces that selected DML contract and checks effective non-owner,
non-superuser, non-bypass roles. It is not a production migration. Production
schema lifecycle/triggers, complete grants and deployed web/database binding
remain outside this fixture's proof.

Acceptance requires actual password UI login, the real Library component's
upsert, a committed save with lost acknowledgement, keyboard retry into one row,
reload/fresh-tab/collection-badge recovery, account and anonymous read/write
denial, denied ownership reassignment, real cross-tab sign-in, interrupted load
retry and mobile/signed-out behavior. Same-source desktop/mobile captures carry
immediate sidecars and artifact ledgers; canonical schema conformance remains
unverified. Loopback testing bypasses browser CSP and does not certify production
HTTPS CSP or customer acceptance.

Local verification is limited to syntax and small admission/configuration tests;
the hosted authenticated job, exact-source independent review, normal protected
merge and receiving checks remain required. Local heavy work is still subject to
machine admission. No local browser, server, new worktree or agent was started.
No manuscript text, customer row, live policy, publishing approval, paid model
call or managed API/commercial right is supplied by this slice. The selected
Dragonborne manuscript remains privately held and unapproved for publication.

Initial source `629b1d30cce500d02104e31681d5d05e0916a340` passed hosted
Linux/Windows account/admission checks and the rendered leaf. Real Auth run
`38253886760` verified both GoTrue identities and effective non-bypass database
roles, then failed because the unscoped login selector matched the header and
form Sign In buttons. Native failure receipts and the static PASS0 review are
retained. The refinement selects the login form explicitly; authenticated
recovery and the suspected hidden mobile tracker still need runtime proof.
Cleanup reported no errors and removed the exclusive private configuration.

Refined source `d4a1b8a84754157d5770eb4a1998af802a02134e` in hosted run
`38254912323` verified real form login, committed-save lost-acknowledgement retry
into one row, reload/fresh-tab/collection badge, effective RLS denial and real
cross-tab account retirement. It failed the interrupted-load fixture: one aborted
GET could be recovered by the SDK's automatic idempotent-request retry, so no
user Retry was exposed within the assertion's default five seconds. The installed
PostgREST builder enables GET retries. The refinement keeps the initial transport
interrupted until explicit Retry and permits the hook's existing ten-second
deadline, with a bounded fifteen-second assertion. Original native receipts and
two actually inspected desktop captures remain retained. Mobile acceptance is
still pending; cleanup succeeded without configuration residue.

Source `28f2d5edd4f0ac961c1caf7f538d51ca83e3d227` in run `38255919236`
passed all authenticated desktop/save/load/denial/account checks, then reproduced
the missing mobile Read control. The existing page hid its whole sidebar below
the desktop breakpoint. The refinement keeps one tracker below the article on
mobile, while the existing contents/related/details/back-link blocks retain their
desktop presentation. The real mobile sentinel, lost save acknowledgement,
44px touch retry, one-row recovery and horizontal layout now require verification.

| Before                                                        | After                                                                        | Why                                                     |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| Whole sidebar, including progress, hidden on mobile           | Single existing tracker visible below the article; desktop sidebar preserved | Readers can see confirmation and retry on mobile        |
| One interrupted GET could be transparently retried by the SDK | Transport remains interrupted until the user selects Retry                   | Verify actual recovery without disabling SDK safeguards |

Emil design engineering and existing TASTE/DESIGN instructions are applied to the
responsive change; exact-source hosted captures and fresh independent review are
still required. These policy reads do not establish runtime or customer acceptance.

Source `c275d138f267d997db03d53c41bcebbae582fca6` in run `38256998003`
restored real authenticated mobile Read and retained all earlier desktop/RLS/load
passes. Its added automatic-completion check failed after jumping to the bottom
of the whole document, without establishing visibility of the article boundary.
The refined test scrolls to the actual main-content end and asserts that its
bottom aligns with the viewport before checking the real observer/save/retry.
The native failure, three original captures and this source's strictly bound
static PASS0 review remain retained. Cleanup again removed owned configuration
and reported no errors. Mobile touch-save recovery remains pending.

Source `fe246618ce772c9e3c8c6a4bb63d58b98ea7da69` in run `38258210971`
passed mobile automatic save, lost acknowledgement and touch retry into the same
B row while preserving A. Its final anonymous-page check exposed two
`main-content` IDs and nested main landmarks. Inspection also showed that the
tracker selected the app-wide main region, so that run's automatic completion
proved visibility at the document boundary rather than the article end.
The refinement gives the article its own unique target, removes the nested main
region, and updates both browser fixtures to use that article. Actual login and
guest checks now require one main landmark and one skip-link target. Diagnostic
receipts track the current browser page separately from scenario execution.
All native failed sources, captures and cleanup receipts are retained.
That run recorded a 571px layout width in a 375px browser viewport. Its original
overflow assertion compared document width with that expanded width and did not
prove a 375px layout. The refined check compares document and client width with
the configured viewport and records bounded offending element geometry.

Source `b20c2a58718fadcbae8e5985eb6fe0a65f40b280` in run `38260986718`
passed the unique main checks, actual article-end automatic completion and mobile
touch retry, then failed the stronger overflow assertion: client width 375px,
document width 571px. Long equation blocks are given bounded horizontal scrolling
and keyboard focus; original equation text remains unchanged. The fresh check
also records each code block's viewport/content width and scrolling behavior.
The full supplied 21-file independent static review passed with exact source
binding and reported zero cost. It did not prove this later refinement.

The normal expected-head GitHub base update raced another accepted change.
The parent assertion stopped at that mismatch; recovery verified both accepted
PR523 and PR624, all nine unchanged owned files and all six incoming file hashes
before a clean fast-forward. The incoming review router and MCP package files
were preserved without claiming them or invoking publication. Fresh source
review and native hosted acceptance are required on the resulting candidate.

Source `91abd5584dd71313ed8af9813ff6df048652b2d6` passed local 29-case
verification, exact 21-file static review and native CodeQL. Hosted run
`38262607275` failed waiting for desktop save retry before any captures. With the
correct article target, scrolling the tall sticky sidebar's button into view can
also trigger automatic completion. The fixture now records the actual visible
article-end trigger and leaves that first observer save pending without clicking
a second time. The retry assertion also respects the existing ten-second save
deadline with a bounded fifteen-second wait. Exact request counts, commit and
one-row keyboard retry remain required. Cleanup succeeded. The new source still
requires fresh review and hosted proof; no earlier PASS approves it.

The received Review Router could not start its Claude job. GitHub's actual
annotation names `anthropics/claude-code-action@v1` as forbidden by the selected
action policy (GitHub-owned actions and `pnpm/action-setup@*`). This slice preserves
that policy, workflow and failure. The separate exact-source review is retained;
activation of the native Claude workflow remains unresolved. The legacy
AI Exact-Head Review workflow is manually disabled and is not claimed as passed.

The exact-head Dots review reported a P1 about stale pages, lost diagnostics and
continued execution after failure. Its source quote bound correctly; inspection
shows that the catch preserves the original error and stage, throws immediately,
and closes each context once. The page-path diagnostic could refer to an earlier
tab and is refined here. A second free review failed the complete-file coverage
contract and is unaccepted. Neither review establishes runtime or creative quality.

Full CI on `fe246618` also failed changed-file formatting for the legacy reader
page. The touched page and leaf fixture are formatted with the pinned existing
formatter; the check remains enabled. A prior local pnpm shim unexpectedly began
dependency setup and was interrupted; its evidence is retained. Direct Node
formatter calls avoid that launcher. No local browser or app server was started.

Rollback is a normal revert of the nine named page/fixture/workflow/pickup files;
customer data, production RLS and manuscript/publication approvals are unchanged.
