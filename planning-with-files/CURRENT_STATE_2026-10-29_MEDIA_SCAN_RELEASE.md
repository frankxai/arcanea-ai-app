# Media scanner release — 29 October 2026

## Task contract

Scope: complete the existing PR #690 command-injection fix, preserving Jules ownership of the source change. Owner: Codex release review; issue/code-scanning findings #92/#93. Base: main a42ddc8d3f6a3426feecbf646bc762d863bb77fe; input candidate 34ee3623ba4f1bc1bde0e9eac0e66e763abcbabf. Creator job: scan a local media directory without interpreting its name as shell code.

Files: media-tools source and compiled derivatives, media-tools test, this receipt. Non-goals: package publication, scanning private user directories, new tools/dependencies, model routing, schema or pricing changes. Acceptance: Node and PowerShell are invoked with argument arrays, absolute/NUL validation, source build/typecheck, scoped lint, package tests, distinct reviewer at candidate head, deployment verification. Rollback: revert this bounded release.

## Evidence

Node 24.22.1 and pinned pnpm 11.28.4. Package build (tsc, strict) passed. Scoped ESLint using the repository web config passed after removing unused join import; root had no ESLint config, which was recorded as an initial command failure. All 426 MCP tests pass. The original two-test candidate passed by relying on missing local executables; its replacement asserts executable, individual argv values, no shell, and fallback manifest handling without running a scanner. The same regression suite fails against main's old module with shell calls trapped. No private files or paid services were used.

Review/deployment still pending at this receipt. The package build regenerated unrelated tracked dist files; those were restored and excluded. Existing source-generated media JS matches the rebuilt module.

## Product decision

Repair login, credit settlement, retained artifacts and export before widening premium feature claims. Main has advanced beyond September; PR #454 is not assumed compatible. The requested portfolio Registry AGENT_BRIEF path returned 404 through the authorized connector; no new stack decision was made. Existing dependency/security PRs overlap and require one selected candidate, rather than batch merging conflicting lockfiles. Authentication candidate #681 is the next bounded review.
