# Legacy memory-to-canon boundary

Scope: block the World SDK's direct memory-to-public-canon evolution under
issue #283, programme #276. Creator job: retain private memories and draft scenes
without treating an agent's accumulated experience as permission to change public
characters or lore. The accepted source-linked scene workflow remains the
private revision/export path. This slice does not implement signed promotion,
the realm graph, tenant authorization or the full creator product.

Owner: Codex thread 01a127b9-5a4e-7b83-ae44-ddc8e8a6a8cb. Checkout:
arcanea-narrative-routing-20261011. Origin:
https://github.com/frankxai/arcanea-ai-app.git. Branch:
agent/codex/memory-canon-boundary-20261012. Exact base:
8936b1400844f1b48e93bc679e1d0af3e74f9e7e. Owned files:
packages/world-sdk/src/evolution.mjs, packages/world-sdk/bin/cli.mjs,
packages/world-sdk/README.md, packages/world-sdk/tests/world-sdk.e2e.test.mjs
and this record. The previous scene branch is preserved. Separate ownership
inspection found only this thread's closed lease in the checkout; native adoption
claims these five paths. Foreign library, world-editor and chat scopes stay with
their owners. Location guard and explicit-file routing check passed.

Acceptance: both public API exports and the actual CLI refuse before accessing
caller paths/options; a forged approval flag cannot enable promotion. All world
and memory bytes, public content hash and current public index stay unchanged
after refusal. Private memory, scene revision and export behavior still pass.
Existing hosted Linux/Windows SDK and application build/type/lint/security checks,
exact-revision independent review and receiving checks are required for promotion.
Provider calls and paid calls during the functional tests are zero.

Diagnosis used the installed diagnosing-bugs skill. Three new tests failed on
the exact base: exported API and CLI calls succeeded, and options were read
before any refusal. A separate actual API reproducer confirmed both helpers
changed the character, added public lore and moved the public hash. The direct
writer was unconditional; the wrapper distilled memories then invoked that
writer; the CLI invoked the wrapper without a separate approval boundary.

Both exports now always reject with
ERR_ARCANEA_HUMAN_PROMOTION_REQUIRED before reading their arguments or accessing
the filesystem. The CLI exits with status 1 and an actionable message. The old
public writer and its success messages are removed. Existing API names remain
available for an explicit compatibility error; no approval flag or receipt-shaped
object grants authority. README examples direct the creator to private scenes.

Alternative considered: introduce an evolution candidate plus a new approval
receipt verifier. That would add an unproven promotion contract. Issue #283
explicitly permits blocking the unsafe path, and the existing scene workflow
already retains private revisions and exports for review. General world-writing
helpers and signed human promotion remain separate open work.

Local verification: Node 24.16.0 Windows, all 22 SDK tests pass, zero failures,
skips or cancellations. The three new cases exercise public package exports,
world/memory byte preservation, forged approvals, missing/malformed inputs and
the actual child-process CLI. The complete scene suite also runs. Red output and
the original unsafe-writer reproducer are preserved privately alongside the green
result. These are behavior checks, not literary or customer acceptance.

Machine: the latest browser-qa admission remains HOLD; no local build, browser,
renderer, additional agent or model server was launched. Ordinary source edits
and small Node tests run locally; required application checks run in hosted CI.
This slice's storage observation was 85,908,987,904 bytes free. Fresh browser-qa
preflight remains HOLD: 4,035 MB free versus 8,192 MB required, CPU 81%, 27 task
runtimes versus eight, and parallelism one. The current-edition print render
remains unrun.

First disclosed candidate dda5a578d90484035588e9015f74fbd4d0f2bad1 passed all 22
SDK cases on hosted Linux and Windows in run 38185771247. Independent Nemotron
Ultra source review returned PASS with zero findings; the normal strict verifier
bound all fourteen supplied full-file hashes and the complete five-file delta.
Reported review cost was zero; no caller credential or private artifact was
supplied. The upstream payer is unverified. Static review cannot establish
customer, literary, tenant or publication acceptance.

Its application lint job 114607810345 failed Prettier's changed-file check on
README, evolution and SDK test formatting. The raw failure is preserved; types
passed. Those files are now formatted with installed Prettier 3.9.9; all five
owned files pass the format check and all 22 local SDK cases pass again. A
pnpm-exec version lookup unexpectedly started dependency resolution. That owned
session was stopped with Ctrl+C; its last output reported zero downloads and 26
cached additions. No lockfile or out-of-scope tracked change appeared. The actual
formatter was invoked directly through Node. The old review is retained as prior
revision evidence; fresh exact-source review and hosted checks remain required
for this formatted follow-up before promotion.

Instruction sources unchanged and loaded during this ongoing goal:
AGENTS.md SHA256 36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5;
.arcanea/CLAUDE.md 83ea5b289cdfcf89abd2195111846cda5aa942daccb8a0ed2dec4d30f960ac94;
.arcanea/MASTER_PLAN.md 5c9b74df1bddc980b2d2235b25f398380fd42356d8ff36743b8a6cc51a3aa4f6;
.arcanea/lore/CANON_LOCKED.md 58c9c86fd3b540e274d478b91096523031132388b7b18b2fa1d67dee676bf54f.
Root instructions and relevant current records, workspace workflow, machine and
product-quality policies were read; no deeper instructions govern these five
paths. These reads and routing checks are not universal runtime enforcement.

Limits: issue #283's graph projection, tracked/source-declared hashing, general
world-write containment, exact Git staging, commit-failure handling, extension
validation and signed human promotion remain open. No provider ranking,
subscription entitlement, tenant experiment permission or commercial release is
established. Dragonborne remains ARC-REL-001; human publication/canon/rights
approval and its current-edition print/device gates remain pending.

Rollback: use a reviewed PR against these five files; do not restore the unsafe
automatic public writer as routine recovery. Keep creator memories, private
revisions and exported artifacts. This change migrates no live data and leaves
locked lore unchanged. Stop condition: a supported behavior/review/security
failure blocks promotion; the broader founder goal remains open.
