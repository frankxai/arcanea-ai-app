# Dependency and validation release — 29 October 2026

## Task contract

Scope: complete existing security PR #685 from input `6483aab2724f60b06334463de3db443125ff6b94`, based on product main `a42ddc8d3f6a3426feecbf646bc762d863bb77fe`. Owner: Codex integration with a separate validation/security reviewer. Creator job: malformed requests return useful errors while world saves, project updates and paid-operation recovery remain usable. Shared required CI must retain its dependency-security gate.

Files: existing dependency manifests and lockfile; Zod consumers in API routes, environment validation and world generation; focused validation/world/project fixtures; one CI test-command extension; unused Zod import in the context loader; this receipt. No UI, canon, pricing, credentials, schema migrations, model routing, actual generation, orders, publication or deployment settings. Rollback: revert this bounded release through normal reviewed history. Stop on a failed required check, unresolved review finding or moved candidate.

## Changes

- Preserve the original advisory fixes. Add `systeminformation` 5.33.16 for GHSA-3f7j-7jwc-fxfj, published after the original dependency candidate.
- Move the actual Zod consumers (web app and shared schemas) to `^4.6.6`; the lockfile resolves 4.6.7. Remove unused direct Zod dependencies from ai-core, database, content-api and starlight-runtime. Remove the unused 0.0.9 Anthropic SDK from the context loader, which otherwise retains a Zod 3 peer constraint. No provider adapter is rewritten or enabled.
- Replace Zod 3 `.errors` reads with `.issues`. Preserve the API's top-level error code, `details.errors` key and status. Individual library issue codes/messages follow Zod 4; no Zod 3 issue-format compatibility is claimed.
- Supply explicit string key schemas for records. Preserve optional patch fields and world defaults.
- Add body/query/malformed-JSON regression tests; strengthen project validation-details and omitted-field checks; verify minimal world defaults and nested personality defaults. Wire the new helper fixture into the existing CI validation step.

## Evidence

Session toolchain: Node 24.22.1, pnpm 11.28.4, TypeScript 5.9.3 and Prettier 3.9.9.

- Baseline audit: 10 high findings. Original #685 on the current advisory feed: 2 high (Zod and systeminformation).
- Final frozen install passes. Final audit: 0 high, 0 critical, 8 moderate, 3 low. No new advisory exclusions or severity downgrades. Existing owner-approved braces exception is preserved.
- `pnpm peers check`: no peer dependency issues.
- Initial Zod-only range upgrade reproduced 25 TypeScript errors. Body/query regression fixtures reproduced two real throws before `.issues` repair; malformed JSON remained a recoverable 400.
- Full web typecheck via Turbo: 9/9 tasks pass. All four additional changed-manifest packages build. No public SDK/helper compatibility is inferred merely from dependency installation.
- World/validation/account-return suite: 31/31; project API contracts: 5/5; billing/image/author recovery: 83/83; offline world-generation/save/admission: 52/52; rebuilt MCP package: 423/423; context loader: 23/23. These are fixture results, not live customer or paid-provider acceptance. The shared-schema package has no independently counted native tests; its strict build and consuming fixtures are the relevant proof.
- Scoped ESLint, formatting and whitespace pass. Full estate guard reports 0 critical/high; existing medium/low findings remain outside scope.
- Ordinary Turbo web build first failed to fetch Google Fonts in this environment. The unmodified Next.js production build passes with `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1`; real fonts were fetched, not replaced with fixtures. It compiled, completed TypeScript and generated 684 static pages. Hosted required Build remains an independent gate.
- Broad whole-file formatting follows the repository changed-file formatter. Unrelated compiler outputs and generated next-env were restored and excluded.

## Sources and release state

Primary migration/advisory sources inspected this session: `https://zod.dev/v4/changelog`, `https://github.com/advisories/GHSA-mrhx-c7xc-m3w5`, `https://github.com/advisories/GHSA-3f7j-7jwc-fxfj`. Portfolio policy source `aed9a2df8e92d3a7d0f70539ffc7d6b76522d4b7`; product instructions loaded from main `a42ddc8d3f6a3426feecbf646bc762d863bb77fe`. Product AGENTS SHA-256 `00207d780ef3d98d7d260fe979b650199a8c1fbaab475ac684d3fa0630307267`; Luminor Engineering Kernel SHA-256 `ce8791a6455dfc6f6f4de13c7925beeb1d07f64dcd194ebdbdb9708b3553634f`. This records current-session loading, not adoption by every harness.

IN_PROGRESS until the final immutable tree receives independent review and hosted checks. Required Build/Lint/TypeScript/CI Status, exact preview/deployment binding and authorized serial integration remain mandatory. No branch protection was bypassed. No merge, production release, sale or customer acceptance is implied by this file. After this dependency change lands and other PRs refresh their receiving base, #690 owns the independently reviewed media subprocess repair; #681 still owns sign-in profile recovery and its outstanding privacy review finding.
