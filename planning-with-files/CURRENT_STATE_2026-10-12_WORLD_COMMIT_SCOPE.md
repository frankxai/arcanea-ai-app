# World SDK scoped commit boundary

Issue #283, programme #276. Creator outcome: keep a harness-authored world change
in local history without committing the creator's unrelated notes or staged
work. Reuse the accepted SDK and preserve its source-linked scene workflow,
legacy evolution refusal and contained writer. No locked canon, remote push,
manuscript, subscription or hosted authorization change is included.

Owner: codex:01a127b9-5a4e-7b83-ae44-ddc8e8a6a8cb. Branch:
agent/codex/world-commit-scope-20261012. Base:
33b437e71b0b945dc4b8cfa3f48df7a7aa6144aa. Owned files:
packages/world-sdk/src/harness.mjs, packages/world-sdk/src/fs-world.mjs,
packages/world-sdk/index.d.ts, packages/world-sdk/README.md,
packages/world-sdk/tests/world-commits.test.mjs and this record. The existing
isolated worktree is reused. Location guard, explicit routing and native verified
claim passed; earlier closure/history and foreign lanes are preserved.

Before this change, commitWorld staged the whole repository with git add -A,
committed the complete index, and returned null for every Git failure. The new
contract requires exact direct paths and tracks successful context writes.
Overlapping selected staging refuses before mutation; unrelated staging remains.
Literal pathspecs, exact-root validation and contained existing-file checks
precede intent-to-add and a partial commit. Hooks/signing remain operative.
Errors expose a code/operation/exit code, with private command output omitted.
Contexts serialize tool calls and retain pending paths after failure.

Alternative considered: build a temporary index, commit it, then reconcile the
real index. That adds index ownership and cleanup recovery. Git's documented
commit --only already preserves unrelated staging. Intent-to-add admits new
files without staging their bytes and remains retryable after hook failure.
Selected pre-existing staging is deliberately refused rather than overwritten.
Official sources consulted: https://git-scm.com/docs/git-commit and
https://git-scm.com/docs/git for --only and --literal-pathspecs.

Regression evidence: the first test setup failed on an incorrect fixture import;
the corrected fixture then failed before testing because the installed estate
hook requires repository identity and an existing HEAD. Both outputs are kept.
Fixture history now uses local Git plumbing and an identity-only example origin,
with no network operations. Commits under test retain installed secret/ownership
hooks. The rejection fixture chains the inherited hook before its test policy.
On the exact accepted base, the admitted 14-case run failed 13 cases and skipped
one unborn-branch fixture because the local hook requires HEAD. The first repaired
run passed 13 cases with zero failures and the same explicit skip. The expanded
complete SDK run has 52 cases: 50 pass, zero failures and two explicit local
skips. The second skip is the accepted Windows file-symlink fixture denied with
EPERM before exercising the writer. New cases cover ignored files, concurrent
context calls and inherited index routing. Hosted Linux/Windows execution,
application gates and independent exact-source review remain pending; neither
local skip establishes the deferred behavior.

Final local verification after adding hidden-index-flag refusal passed 51 of 53
cases with zero failures and the same two explicit skips. Both assume-unchanged
and skip-worktree flags are preserved on refusal. No Git commit caller outside
this SDK was found in the inspected packages, apps and scripts sources.

Acceptance: exact path commits preserve other staged and working bytes, scope and
filesystem rejections precede Git mutation, failed hooks/locks retain drafts and
permit recovery, and no-context-write/unchanged/non-Git cases have explicit
receipts. Hosted tests must execute the unborn-branch case. Required candidate
and receiving checks plus reconciled independent review precede merge.

Instruction hashes are recorded in private lane evidence. AGENTS.md,
.arcanea/CLAUDE.md and .arcanea/MASTER_PLAN.md match the previous inspected
sources; no deeper AGENTS governs these six paths. Native startup remains at
home with explicit repository reads, not an automatic instruction reload.
Ordinary edits and small Node tests use the existing job; no new agents, browser,
server, model process, dependency install or worktree was launched.

Limits: trusted hooks/configuration and one filesystem writer are required.
Intent-to-add entries can remain after a failed attempt; draft bytes stay intact.
Receipt failure after a successful Git commit requires checking local history.
This is not an OS sandbox, tenant proof or literary approval. Source-declared
hashing, extension validation, private memory-read confinement, graph projection,
signed human canon promotion and production creator/commercial evidence remain
open. Dragonborne remains a private manuscript/release candidate.

Rollback: revert only this slice through a reviewed PR; retain creator files and
accepted scene/evolution safeguards. Stop promotion on a failing scope,
recovery, independent review or required hosted check. The full goal stays active.
