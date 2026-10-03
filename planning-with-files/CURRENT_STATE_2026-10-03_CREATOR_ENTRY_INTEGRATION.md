# Creator entry integration, 3 October 2026

## Task contract

Scope: combine the existing app entry drafts into one coherent candidate on accepted main `79f3fb25ca8d34c22eae1210c7c92ae2ebe8ea0b`. A reader can reach existing public prose, a world builder can inspect/edit/carry/reopen a complete draft, and creators/developers can follow truthful community, pricing and MCP routes with recoverable interest signup.

Owner: Codex, session `01a0f74f-8bad-7db1-ab06-fd89b5faec84`, branch `agent/codex/arcanea-creator-entry-integration-20261003`, issue [#276](https://github.com/frankxai/arcanea-ai-app/issues/276). Exclusive files are listed below. No subagents or new repository/worktree/dependencies.

Inputs: the six open drafts below, revalidated against GitHub before integration. Changes to other branches are preserved. Their historical task records remain source evidence, not acceptance of this new composition.

| Draft                                   | Pinned source                              |
| --------------------------------------- | ------------------------------------------ |
| #490 reading                            | `a2cb83194a6e84ba8df6f33ad57f11459ad015f5` |
| #496 homepage and complete world drafts | `76d1a92856f1ea20018bc26482d3a7133512deb6` |
| #493 community                          | `d67747968036cb9f58ac945ed8516d0caa61e876` |
| #494 pricing                            | `5af1f59949ba14e1cab9b9982b551290ae0dd18d` |
| #497 footer                             | `b5bf8e5713c898a6473161e96409022e5feb2366` |
| #498 public reader setup                | `5e4b5be8bd58afc9f6832e320b55574a471d8752` |

Alternative: retain six independent main-targeted drafts. That leaves six conflicting workflow replacements and four copies of the same signup helper. This integration reuses their accepted-for-review implementations, reconciles three shared files, and verifies them against a single built candidate. It establishes no measured creator repair-time, cost, demand or revenue advantage.

Non-goals: manuscript/canon selection, licence choice, prices, bundles/skill ready status, public reader deployment, live mail/signup/payment, game engine/runtime choice, repository archive/rename, history rewrite, merge or production deployment. Preserve #487, #500, #501, #502 and shared AuthorOS/World Repo/SIS/Studio/runtime/media owners.

Acceptance: preserve main and source behavior outside the scoped deltas; verify current revision with frozen native Install, Lint, TypeScript, Build and CI Status; run every inherited relevant reader/homepage/world-draft/community/pricing/footer/MCP browser assertion on the same built app, with fixtures intercepting mutations. Require exact-source hashes where implemented. Preserve mobile, touch, keyboard, reduced-motion, forced-color, timeout, invalid-response, storage-interruption, export/import and recovery coverage. Required independent review and human/value/release acceptance remain separate.

Verification: scoped three-way deltas from each source merge-base, rather than replacing newer main files; identical #497/#498 shared helper/tests selected after byte comparison. The helper recognizes explicit invalid-email responses and keeps its abort timer active through response-body reading. Backend persistence/RLS routes are inherited without edits. Unit suites retain main's existing checks and add reader catalog, complete-draft portability and shared submit coverage.

One Chromium installation and one owned Next server process group serve seven serial entry suites. Any suite failure blocks Build while later suites still collect evidence. Each suite has a 180-second process bound, the browser step 15 minutes, and Build 25 minutes for the combined scope. Existing gallery/starter release checks remain on non-draft PRs/pushes; world-draft coverage runs once with the entry group. No constituent green check or scoped review is transferred to this revision.

Budget: one capable lead; small text edits and small checks locally. C: free space is about 14.1%, BOUNDED. No local install/build/browser, new node_modules/.next/worktree/media/model or parallel workers. Native Actions provides full build/browser verification. No paid generation, model-winner or customer-demand claim.

Rollback: the original six branches remain available; close/revise this draft without touching them or main. If eventually approved/merged, revert its scoped integration commit under #408/#427. Export/import failure behavior remains visible and will be evaluated in the actual browser suites.

Stop condition: a reviewable, verified integration candidate and source-bound evidence, followed by issue #276 and agentic-ops-hub handover. Keep draft. Full independent review, creator acceptance, stable-domain source binding and #408/#427 remain pending; native CI does not approve release or establish useful paid output.

## Current evidence and limits

The six unique source deltas applied cleanly with three-way Git reconciliation. No parent files outside the exclusive list were staged. The two selected shared files are byte-identical across #497/#498. Original manuscript/canon, frozen prices and package/lock files are unchanged.

Native verification for this integration is pending at this assembly checkpoint. Exact final-head results and failures belong in the integration PR and issue #276. Full source-bound independent review is pending; individual earlier reviews cover their recorded scopes only. The earlier #498 native run 36968084342 and its scoped correction review already passed at 5e4b5be8; that does not approve this integration.

The complete world-draft browser uses synthetic generation/save fixtures. It proves recoverable editing/export/import of that fixture, not an actual model generation or live account save. Reading checks use existing public manuscripts and preserve the saga default-deny release gate. Pricing remains an interest proposal with existing amounts, without checkout or approval. Public MCP documentation retains the observed published reader's limits; the private reader-canon integration is unmerged and undeployed.

Policy loaded in this session: workspace routing contract, repository AGENTS/.arcanea guidance, product-outcome quality, machine/storage policy, TASTE/DESIGN and app guidance. Execution evidence is scoped routing/lane checks and source reconciliation so far; loading prose is not universal enforcement.

## Exclusive files

- `.github/workflows/ci.yml`
- `apps/web/app/books/[bookId]/[chapterId]/page.tsx`
- `apps/web/app/books/[bookId]/page.tsx`
- `apps/web/app/books/books-data.ts`
- `apps/web/app/community/community-data.ts`
- `apps/web/app/community/community-overview.tsx`
- `apps/web/app/community/page.tsx`
- `apps/web/app/docs/mcp/install/page.tsx`
- `apps/web/app/docs/mcp/page.tsx`
- `apps/web/app/docs/mcp/tools/page.tsx`
- `apps/web/app/home-experience.tsx`
- `apps/web/app/home.module.css`
- `apps/web/app/mcp/mcp-command-center.tsx`
- `apps/web/app/mcp/page.tsx`
- `apps/web/app/page.tsx`
- `apps/web/app/pricing/page.tsx`
- `apps/web/app/pricing/pricing-client.tsx`
- `apps/web/app/worlds/create/page.tsx`
- `apps/web/components/community/newsletter-form.tsx`
- `apps/web/components/navigation/footer.tsx`
- `apps/web/components/worlds/world-workbench.module.css`
- `apps/web/components/worlds/world-workbench.tsx`
- `apps/web/lib/mcp/__tests__/fixtures/reader-tools.json`
- `apps/web/lib/mcp/__tests__/reader-catalog.test.ts`
- `apps/web/lib/mcp/reader-catalog.ts`
- `apps/web/lib/saga/__tests__/chapter-files.test.ts`
- `apps/web/lib/saga/__tests__/series-entry.test.ts`
- `apps/web/lib/saga/chapter-files.ts`
- `apps/web/lib/saga/loader.ts`
- `apps/web/lib/waitlist/__tests__/submit.test.ts`
- `apps/web/lib/waitlist/submit.ts`
- `apps/web/lib/worlds/__tests__/draft-portability.test.ts`
- `apps/web/lib/worlds/draft-portability.ts`
- `docs/strategy/arcanea-world-draft-portability-2026-10-03.md`
- `planning-with-files/CURRENT_STATE_2026-10-01_READER_ENTRY.md`
- `planning-with-files/CURRENT_STATE_2026-10-02_COMMUNITY_CAPTURE.md`
- `planning-with-files/CURRENT_STATE_2026-10-02_FOOTER_CAPTURE.md`
- `planning-with-files/CURRENT_STATE_2026-10-02_HOMEPAGE_WORKBENCH.md`
- `planning-with-files/CURRENT_STATE_2026-10-02_MCP_READER_ENTRY.md`
- `planning-with-files/CURRENT_STATE_2026-10-02_PRICING_DEMAND.md`
- `planning-with-files/CURRENT_STATE_2026-10-03_WORLD_DRAFT_PORTABILITY.md`
- `scripts/verify-community-capture-browser.cjs`
- `scripts/verify-footer-built-app.cjs`
- `scripts/verify-homepage-built-app.cjs`
- `scripts/verify-mcp-reader-browser.cjs`
- `scripts/verify-pricing-capture-browser.cjs`
- `scripts/verify-reader-entry-browser.cjs`
- `scripts/verify-world-draft-browser.cjs`
- `scripts/verify-world-workbench-browser.cjs`
- `planning-with-files/CURRENT_STATE_2026-10-03_CREATOR_ENTRY_INTEGRATION.md`
