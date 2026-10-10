# World creator recovery and customer model connection

Scope: repair authenticated world generation, creator edits and private recovery.
Owner: Codex root, sole writer in arcanea-gateway-admission-20261010, branch
`agent/codex/world-creator-recovery-20261010`, origin
`https://github.com/frankxai/arcanea-ai-app.git`.
Base: `123f84ea2d05586f780b89edca68533d7b8d9786`.

Files: generation route and helper, world creation page and three small components,
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

Non-goals/remaining gaps: portable import
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

Candidate237512c4df: TypeScript/lint and exact-source independent Gemini review
passed. Auth startup and normal password authentication through the real Node
client passed; browser login return timed out. The next fixture captures only
safe origin/path failure diagnostics, masks password screenshots, accepts the
creator route with or without its consumed resume flag, and allows the installed
Supabase client's platform/runtime CORS headers. Browser acceptance remains pending.

Optional manual live generation is off by default. It refuses before generation
unless PR561 has a founder-authored independent PASS receipt for the exact head,
matching changed source hashes, review-text hash and zero blocking findings. The
existing test Gemini key is passed only to the browser acceptance process, never
build/server defaults. One real app draft and one direct same-concept model answer
are bounded to6000 output tokens each, thinking0,45seconds and no automatic retry.
These outputs require inspection for actual usefulness; no superiority or market
advantage follows from a single comparison. No production identities or data touched.

Candidateabb8793505: the fixture hit PostgreSQL's temporary initialization server
and its planned shutdown interrupted schema seeding. TCP-only readiness avoids
that startup race. The app's CSP permits production HTTPS Supabase endpoints and
correctly excludes the disposable HTTP loopback API. This fixture explicitly
bypasses browser CSP to test real Auth/RLS without changing deployed security
headers. It does not certify production CSP/TLS or signed-in production onboarding.
Private page denial requires the actual not-found UI, noindex and absence of private
content from the response, plus empty RLS reads; status is recorded because Next's
streamed not-found response can be200. See the official Next not-found convention.

Candidate8a9d683ac2: full build, three viewport recovery tests, TypeScript, lint,
CodeQL source scan and independent Gemini source review passed. Real browser
password login also passed. The fixture then stopped on a selector matching both
the expected missing-key alert and Next's route announcer, before any world save.
The next revision selects the specific alert and records authentication/writes
only after those operations succeed. The old failed receipt's early true flags
were configuration claims, not completed write evidence; retain it with this correction.
Production metadata confirms authenticated SELECT/INSERT/UPDATE on all five save
tables, schema access and the matching auth.uid definition. No user records read
or written. Disposable fixture acceptance still does not certify production onboarding.

The existing concept-art endpoint needs an absent platform key and returns
generated:false without one. Replace its creator CTA with a working Copy art brief
action; retain the endpoint and complete exported prompt. Browser tests check the
exact clipboard text and zero image requests. Paid image generation remains outside
this slice. Added file: apps/web/components/worlds/world-art-brief.tsx, same sole owner.

PR561's separate CodeQL alert gate reported one high clear-text masking-command
output, one medium generated-test-code interpolation, and two medium remote model
artifact writes. Remove all credential emission and credential-bearing subprocess
output; controlled phases and masked screenshots remain diagnostic evidence. The
offline preload now uses fixed code with fixture data in child environment variables.
Comparison artifacts contain bounded schema-validated final text and typed usage,
not executable source. No alert is hidden, dismissed or waived; fresh scan/review
must assess the exact revision and intended remote artifact retention.

Candidate638e66d9e4: real hosted password login, owner private partial save,
retry without duplicates, reopen, full private source JSON, second-account RLS
read/update denial, browser anonymous/private content denial, account backup/key
isolation, late cancellation and exact clipboard action all pass. Generation is
synthetic;0 creator provider calls and0 production writes. Fresh CodeQL has no
open PR alerts: all four source fixes passed without dismissal or suppression.
TypeScript/lint pass; full build and independent review are tracked in38079537406.
Masked mobile screenshots were inspected. The fixture bypasses CSP only for its
HTTP loopback API; production HTTPS/CSP still requires its own verification.
Final follow-up fixes signed-in helper copy and preserves observed calls/attempts
from a failed browser receipt instead of leaving the service counter at0.

Candidate00bd3881a5: full manual CI38079943764, normal CI38080093538,
CodeQL38079947496, real Auth/private-save fixture and all three compiled recovery
viewports pass. Independent Gemini3.1Pro response85LKat-RGc7E_PUPtKy7yQo STOP
PASS0 blocking findings, all37 complete sources/18 changed sources verified;
formal receipt6101408881. Live run38080599475 failed its Git base lookup before
containers or model calls because checkout's default shallow history omitted
base123f84ea. Set full history for this owned job, retaining persist-credentials:false.
The receipt comment's code fence was separately corrected to the raw JSON required
by the admission parser. The first commentary attributed the failure to formatting
before the job log established the earlier missing-base cause. Preserve both records.
No creator request or production write occurred. This CI-only correction requires
fresh exact-source gates/review before any live-model test; no provider retry claimed.
