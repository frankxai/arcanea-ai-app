# Media scanner release — 29 October 2026

## Task contract

Scope: complete the existing PR #690 command-injection fix, preserving Jules ownership of the source change. Owner: Codex release review; issue/code-scanning findings #92/#93. Base: main a42ddc8d3f6a3426feecbf646bc762d863bb77fe; input candidate 34ee3623ba4f1bc1bde0e9eac0e66e763abcbabf. Creator job: scan a local media directory without interpreting its name as shell code.

Files: media-tools source and compiled derivatives, media-tools test, this receipt. Non-goals: package publication, scanning private user directories, new tools/dependencies, model routing, schema or pricing changes. Acceptance: Node and PowerShell are invoked with argument arrays, absolute/NUL validation, source build/typecheck, scoped lint, package tests, distinct reviewer at candidate head, deployment verification. Rollback: revert this bounded release.

## Evidence

Node 24.22.1 and pinned pnpm 11.28.4. Package build (tsc, strict) passed. Scoped ESLint using the repository web config passed after removing unused join import; root had no ESLint config, which was recorded as an initial command failure. All 426 MCP tests pass. The original two-test candidate passed by relying on missing local executables; its replacement asserts executable, individual argv values, no shell, and fallback manifest handling without running a scanner. The same regression suite fails against main's old module with shell calls trapped. No private files or paid services were used.

Review/deployment still pending at this receipt. The package build regenerated unrelated tracked dist files; those were restored and excluded. Existing source-generated media JS matches the rebuilt module.

## Product decision

Repair login, credit settlement, retained artifacts and export before widening premium feature claims. Main has advanced beyond September; PR #454 is not assumed compatible. The requested portfolio Registry AGENT_BRIEF path returned 404 through the authorized connector; no new stack decision was made. Existing dependency/security PRs overlap and require one selected candidate, rather than batch merging conflicting lockfiles. Authentication candidate #681 is the next bounded review.

## Integration refinement (same-day follow-up)

Refreshed input head: `6be874bb0adef43262f000742b95adcb79ab2f78`; preserve its release record and unused-import cleanup. Scope remains this PR, with no model, pricing, canon, storage, registration or credential changes. The additional acceptance condition is that one scan request executes at most one scanner: select an existing Node CLI first, otherwise an existing PowerShell script, and return the primary failure without replay after timeout/nonzero exit. Missing runtime assets produce an explicit unavailable response.

Nine subprocess-boundary cases assert exact executable/argv, explicit `shell: false`, quotes/substitutions/spaces/newlines in both user paths, malformed inputs, missing assets, primary failure, bounded errors, default manifest and the saved-manifest success receipt. The preceding eight-case suite failed five cases against the earlier PR, then passed after repair. An independent reviewer isolated the candidate and demonstrated that changing `shell: false` to `true` fails two tests. Subprocesses are mocked; this does not establish native PowerShell availability or permission to arbitrary filesystem paths.

Verification: Node 24.22.1; clean frozen install with pnpm 11.28.4; MCP strict TypeScript build and no-emit typecheck; rebuilt package suite 432/432; committed media module suite 9/9; scoped ESLint with the repository web config (0 lint errors; config emits root-layout notices), Prettier 3.9.9 and `git diff --check` pass. Unrelated regenerated dist output was restored, retaining only media derivatives. Estate guard on the full checkout: 0 critical, 0 high, 10 medium and 224 low; lower-severity existing findings are not accepted or repaired by this change. No full app/hosted acceptance is implied.

Instruction source actually read in this session: product main `a42ddc8d3f6a3426feecbf646bc762d863bb77fe`; `AGENTS.md` SHA-256 `00207d780ef3d98d7d260fe979b650199a8c1fbaab475ac684d3fa0630307267`; Luminor Engineering Kernel SHA-256 `ce8791a6455dfc6f6f4de13c7925beeb1d07f64dcd194ebdbdb9708b3553634f`. Portfolio policy source `aed9a2df8e92d3a7d0f70539ffc7d6b76522d4b7`. The current session loaded these sources; this is not remote attestation of other agents.

Release remains blocked on required exact-head GitHub checks, independent final-revision acceptance and inspected deployment. The required Lint gate at the refreshed input fails on dependency advisories, independently of this repair; no audit exclusion, branch-protection bypass or production promotion is authorized by this receipt. Media tools are not registered in the current MCP server, and installed-package scanner assets/native Windows execution remain unverified. Production was separately resolved to main `a42ddc8d3f6a3426feecbf646bc762d863bb77fe`, deployment `dpl_E3hH2JfPfDPvEBL9sHLDKrKNA2cb`; that observation does not deploy or accept this candidate.
