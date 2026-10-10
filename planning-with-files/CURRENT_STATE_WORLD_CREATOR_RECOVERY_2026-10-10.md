# World creator recovery and customer model connection

Scope: repair authenticated world generation, creator edits and private recovery.
Owner: Codex root, sole writer in arcanea-gateway-admission-20261010, branch
`agent/codex/world-creator-recovery-20261010`, origin
`https://github.com/frankxai/arcanea-ai-app.git`.
Base: `123f84ea2d05586f780b89edca68533d7b8d9786`.

Files: generation route and helper, world creation page and two small components,
compiled route/browser tests, disposable service fixture, manual hosted acceptance,
existing independent review rail, this task record. No dependency change.

Acceptance: explicit customer Gemini key; authenticated handler and safe errors;
bounded bytes, output and requests; complete structured draft; creator-applied
edits survive reload; separate account recovery; explicit unknown-owner restoration;
unreadable raw backup preservation; late cancelled results ignored; real password
login and private partial save/retry/reopen without duplicate projections; second
account and anonymous denial; 375px and reduced motion; exact-revision independent
provider review; build/type/lint/CodeQL; normal merge and receiving checks/deployment.

The existing route depended on platform Google/OpenRouter keys; production had
neither configured. Seven actual compiled-handler regression cases failed before
repair and pass with the repair. Their model and auth responses are mocked; they
are not paid creator output or hosted authentication evidence.

Verification: local full build/browser/extra agents are held by PP memory admission.
Run required CI and browser acceptance on existing hosted runners. The earlier
isolated Supabase preview no longer appears in branch inventory; its historical
author proof remains valid at its recorded revision/time, not a current test setup.
Use three owned disposable containers, real GoTrue and PostgREST with generated
temporary credentials, loopback-only bindings and deterministic content for world
save acceptance. No production identities, data, DDL or account access changes.
The SQL file is a narrow projection fixture based on inspected current columns and
owner/public predicates; historical migrations differ from current production and
are not replayed. This fixture is not a complete clone or certification of production
triggers/grants/direct Data API writes. Production metadata confirms all seven
relevant tables use RLS and worlds/creations reference actual auth.users. An initial
additional metadata query used an incorrect remembered project identifier and was
refused; project inventory corrected it before the successful read. No user rows read.

Non-goals/remaining gaps: paid generation usefulness and comparison; portable import
from foreign PR505; pending unapplied editor buffer recovery; full production RLS;
public canon promotion; paid concept art; publishing and commerce. The broad issue276
stays open. MCP public distribution still awaits the existing creative-IP decision.
Foreign PR505 dirty source lane and all older release receipts remain preserved.

Instruction handoff: root AGENTS SHA256
`36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5`;
apps/web/CLAUDE SHA256
`a43b1abc5f46c7cfd82605644f5a017cb7d3e8f34a6147f808416ad29a160a0e`.
WORKFLOW, machine and product-quality policies, TASTE, design, kernel, humanizer,
Emil and Supabase guidance were explicitly read. This is instruction loading,
not a runtime enforcement claim. Routing guard/check passed for named files;
sole ownership was checked separately from routing. No deeper AGENTS in scope.

Rollback: revert the merged app slice through a reviewed PR. No production database
migration is introduced. Preserve every private fixture/failure receipt and user
recovery copy; stop only this runner's owned containers/process groups on exit.

Status: implemented locally; compiled regression cases pass. Hosted service/browser
execution, complete gates, exact-head independent review and deployment are pending.

Candidate `80c94fa297bca236b135c1156a0ab120a885eede`: hosted TypeScript/lint passed.
Hosted service run38076352647 stopped at Auth startup, before any browser test.
GoTrue's initial migration replaces auth.uid(), so the fixture now assigns it to
the migration role and restores the current claims-compatible definition afterward.
Its failed receipt is retained. Independent Gemini review of that head returned
FAIL with one high finding: saved object elements crashed the string-only detail
badge path. The repair normalizes display names, retains valid generated colors
and the complete source document, and accepts legacy string elements. Fresh review
and complete receiving tests are required; the old FAIL is not overwritten.
The compiled browser suite also caught ambiguous textarea label text before its
first edit. Explicit label/control IDs repair the actual editor accessibility;
the test continues to require exact human-readable labels rather than weak selectors.
