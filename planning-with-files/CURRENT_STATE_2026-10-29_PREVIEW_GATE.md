# Preview build policy repair — 29 October 2026

Status: implementation candidate for existing PR #680; no merge or production claim.

## Task contract

Owner: Codex release integration. Scope: repair #680's failing repository regression suite and parse GitHub PR state structurally. Base: main a42ddc8d3f6a3426feecbf646bc762d863bb77fe; input PR head 85e91ff8808aeb23742ed8a098c9c885605c9f13. User job: obtain a requested review preview without paying for every intermediate agent push. Files: scripts/vercel-ignore-build.sh, scripts/tests/vercel-ignore-build.test.mjs and this receipt. Non-goals: runtime/provider changes, production releases, dependency overrides and a new preview policy. Acceptance: existing history cases retained under the owner-approved opt-in policy, deterministic offline API fixtures, malformed/API failure coverage, production always builds, explicit preview overrides, scoped syntax/format/security checks and independent exact-head review. Rollback: revert this follow-up and then the original policy candidate if needed.

## Findings and implementation

The 22 October Lint log fails in the preview regression tests before reaching the audit step. The original PR supplied a separate uncommitted harness but left the repository's previous policy expectations unchanged. This change keeps the history/recovery cases and updates the policy-specific assertions. All API traffic in the tests goes to a local fake curl. The fake executable lives inside the disposable fixture's Git metadata so it neither changes the compared tree nor disappears when testing divergent histories.

GitHub responses now use JSON parsing of top-level draft and state fields. Nested fields, title/body text, malformed JSON, missing fields and unsuccessful curl exit codes cannot confer readiness. Branch query parameters are URL-encoded. Production/main/unknown refs and explicit preview opt-ins keep their precedence. API uncertainty holds agent previews; non-agent branches retain the Git comparison fallback. The script still controls preview builds only and is not a security or production-approval boundary.

## Verification

Node 24.22.1; repository-pinned pnpm 11.28.4 through Corepack. Frozen dependency installation passed with lifecycle scripts disabled. Bash syntax, changed-file formatting and 23 dependency-free preview tests pass. The original PR script against main's existing suite failed 14 of 15 cases. Web ESLint passes with zero warnings. Whole-app type checking first stopped at the default V8 heap limit after 8 of 9 tasks; a sequential retry with NODE_OPTIONS=--max-old-space-size=6144 passed all 9 tasks. The full build passed its eight dependency tasks but failed to fetch Instrument Serif and JetBrains Mono from Google Fonts in this environment. No full-build PASS is claimed or network protection disabled. Estate guard scanned the tracked repository with zero critical/high findings; unrelated medium/low findings remain.

An actual audit against the unchanged public main lockfile reports ten high and zero critical findings, matching the current #690 CI audit failure. The first local audit request was rejected under an incorrect private-repository premise; GitHub subsequently verified private=false/visibility=public and unchanged public manifests before the successful audit. No private dependency tree or credentials were supplied. No advisory was ignored by this change. #685 remains the comprehensive dependency candidate and still needs a real Zod migration/mitigation decision plus current systeminformation coverage and fresh required checks.

## Integration decisions

Four overlapping dependency PRs (#673, #679, #686, #677) were closed with source commits and survivor pointers retained in their descriptions; branches were preserved. #678 remains the smaller patch candidate and #685 the broader survivor. This does not imply either is merged. The newest #690 head advanced to 6be874bb0adef43262f000742b95adcb79ab2f78 during this session with its own MCP argument-isolation tests; its active writer's changes were preserved without competing writes. #681 addresses the observed sign-in profile-bootstrap error and should follow dependency/release recovery. #675 is the existing AI Gateway migration candidate; do not create a competing provider abstraction.

Production was observed READY at a42ddc8 on deployment dpl_E3hH2JfPfDPvEBL9sHLDKrKNA2cb, before this change. Authenticated Vercel fetches of www.arcanea.ai confirmed that deployment ID in the homepage document, HTTP 200 for /chat, /library, /pricing and /auth/login, HTTP 404 for an unknown path, and /health reporting publicData readiness. These HTTP checks do not establish signed-in creator acceptance. An auth/callback error was counted in the latest one-hour production log window. Cloudflare already has an arcanea-reader worker; its existence is not proof of source, authorization or durable workflow acceptance. No new Cloudflare infrastructure, paid generation, subscription activation or beta-runtime promotion was performed.

Next gate: independent review of the committed follow-up and current CI, then owner-authorized merge and exact deployment/domain smoke evidence. Keep the required security audit enabled. Prior green checks from 21 October do not cover advisories published later.
