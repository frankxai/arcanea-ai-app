# World SDK write containment

Scope: issue #283, programme #276. Creator job: write and revise a selected
world, retain private memories and export source-linked scenes without a caller
path or pre-existing filesystem redirect changing a file outside that world.
Reuse the accepted SDK rather than introducing another runtime or scheduler.
This is a local creator safeguard; hosted tenant authorization and signed human
canon promotion remain separate requirements.

Owner: codex:01a127b9-5a4e-7b83-ae44-ddc8e8a6a8cb, branch
agent/codex/world-write-containment-20261012 in the existing isolated narrative
worktree. Exact base: 680901563775853b51df3aa58ae658c23d632ec6. Owned files:
packages/world-sdk/src/fs-world.mjs, packages/world-sdk/src/evolution.mjs,
packages/world-sdk/index.d.ts, packages/world-sdk/tests/world-writes.test.mjs,
packages/world-sdk/README.md and this record. Location guard, explicit-file
routing and separate lease inspection passed; native adoption claims these six
paths. The earlier reviewed branches and foreign app/editor/library scopes are
preserved.

Acceptance: reject unsafe portable paths and pre-existing filesystem redirects
before batch mutation. World and outside file bytes stay unchanged on those
rejections. Private memory capture uses the same checked writer and retains
exclusive creation. Ordinary world creation, overwrite, memory capture, source
capture, scene revision and export remain usable. Exact-source independent
review and required hosted candidate/receiving checks precede merge.

Diagnosis uses the installed diagnosing-bugs skill. The accepted writer joined
caller paths without lexical or filesystem containment. Three ranked hypotheses
were presented before testing: traversal escapes the selected root; a directory
redirect defeats otherwise ordinary paths; and memory capture bypasses the
general writer. Eleven initial regression cases on the exact base produced ten
failures and one ordinary-workflow pass. They exercise the public package API,
harness adapter, manifest writes, private memory writes, untouched outside
sentinels and batch behavior. The complete red output is preserved privately.

The writer now prepares all relative paths and byte payloads before mutation,
checks the existing batch destinations, refuses redirected directories and
non-regular or multiply linked files, and checks an opened file before
truncation. New/exclusive files use exclusive creation. Manifest and memory
writes share that implementation; the type surface exposes the optional
exclusive write mode. The legacy evolution refusal remains intact.

Alternative considered: reuse the scene workflow's narrower confinement helper
by refactoring both modules. That would change the accepted scene publication
and recovery implementation, whose reads and immutable hard-link publication
have a different contract. This change keeps that implementation intact and
limits the new helper to the general writer and its existing callers.

Initial local verification on Node 24.16.0 Windows passed all 33 SDK tests with
zero failures or skips, including the complete source-linked scene suite. The
expanded run added file-symlink and internal-batch-conflict cases. File-symlink
fixture creation failed with Windows EPERM before exercising the writer; its
raw failing output is preserved. The fixture now skips only that Windows EPERM
condition. Linux must execute the case; directory-junction and hard-link cases
still run on Windows. The corrected expanded run has 35 cases: 34 pass, zero
failures and one explicit Windows file-symlink fixture skip. Hosted Linux/Windows
tests, application build/type/lint/security and exact-source independent review
remain pending. There are no provider calls in the functional tests.

First candidate 8be342abcf53704784d2260f1a86c27754ca90e2 passed all 35 hosted
SDK cases on both Linux and Windows, with zero skips, including file symlinks.
Independent Nemotron Ultra public-source review returned PASS with zero findings;
the normal strict verifier bound all eighteen complete supplied files and the
full six-file delta. Reported cost was zero, no caller credential or private
artifact was supplied, and the upstream payer is unverified.

The CodeQL analysis workflow passed, but its separate Advanced Security check
114625329632 failed with one high-severity potential filesystem-race annotation
at test helper line 48. The helper inspected a path with lstat before reading
that path again. It now checks and reads a regular file through the same open
handle. The first review and alert are retained as actual prior-source evidence;
neither approves the corrected revision. Fresh exact-source review, full SDK
tests and the independent CodeQL check remain required. The initial draft CI was
cancelled by the ready-for-review event, not counted as a passing run.

Machine: fresh browser-qa admission at 02:57 Europe/Amsterdam was HOLD, with
5,207 MB free versus 8,192 MB required, 27 task runtimes versus eight and
parallelism one. No local renderer, application build, additional agent or model
server was launched. Ordinary source edits and small Node tests continue. The
current Dragonborne v8 print proof remains unrun; publication, manuscript,
canon, rights and device/customer acceptance remain open.

Instruction sources were loaded and their hashes revalidated:
AGENTS.md 36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5;
.arcanea/CLAUDE.md 83ea5b289cdfcf89abd2195111846cda5aa942daccb8a0ed2dec4d30f960ac94;
.arcanea/MASTER_PLAN.md 5c9b74df1bddc980b2d2235b25f398380fd42356d8ff36743b8a6cc51a3aa4f6.
The workspace workflow and current machine/product-quality policies were read.
No deeper instructions govern these six files. These reads, the lease and
routing records do not establish universal runtime enforcement.

Limits: the selected root and filesystem writer must be trusted. A hostile local
process can race directory replacement or hard-link creation; portable Node path
checks are not an OS sandbox. A disk error can partially complete a batch. General
APIs still edit public world documents and do not grant canon approval. Tracked
hashing, Git staging/failure behavior, extension validation, graph projection,
signed promotion, tenant isolation and managed subscriptions remain open. No
competitive advantage, literary acceptance or customer demand is claimed.

Rollback: revert only this reviewed slice through a PR; preserve creator data,
private scenes, exports and the accepted evolution block. No live data migration
or locked-canon change is included. Stop condition: a failed containment,
workflow, review or required hosted check blocks promotion. The full founder
goal remains active.
