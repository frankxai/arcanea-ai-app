# Preview deployment range repair

Scope: prevent a documentation checkpoint from hiding pending code changes in
the Vercel ignored-build decision.

Owner: capability delivery task, `codex/arcanea-preview-range-20260909`.

Files: `scripts/vercel-ignore-build.sh`, its Git-history regression tests,
the CI test step and this record.

The prior script compared only `HEAD^..HEAD`. A final docs-only integration commit
therefore cancelled the MCP package preview even though the preceding commit
contained code not present in the last successful deployment. The new comparison
uses `VERCEL_GIT_PREVIOUS_SHA`, documented as the last successful deployment for
the project and branch. Missing, malformed or unavailable commit history builds.

Existing production, branch and explicit checkpoint policies remain. This does
not repair or certify the existing documentation path exclusions, force a preview,
alter Vercel settings, publish an MCP package or change application behavior.

Acceptance criteria: code followed by documentation builds; a complete docs-only
delta skips; unknown history builds; production/checkpoint/branch precedence and
source deletion detection remain correct. CI runs the real Git fixture tests.

Verification: `node --test scripts/tests/vercel-ignore-build.test.mjs`, changed-file
formatting, whitespace and secret checks, full repository CI and independent review
before merge. All 13 Git fixture tests pass with Node 22 and Git Bash. The same suite on the
unchanged script fails six behavior checks, including the observed code-then-docs
case; no baseline failure is merely a changed log message. Changed-file formatting
and whitespace checks pass. Independent review and repository CI remain pending.

Rollback: revert this scoped change; this restores the previous comparison and
its known skipped-code failure. No environment, secret or dependency changes.

Provider contract: [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables#vercel_git_previous_sha).
