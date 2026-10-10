# Branch reconciliation, 11 October 2026

Status: planning proposal. No merge, branch deletion, PR closure, paid rollout or platform migration is authorized by this document.

Scope: Arcanea branch reconciliation and creator-platform release order. The wider nine-repository inventory is private evidence, not copied here. Owner: Codex root, sole writer in the existing arcanea-gateway-admission-20261010 worktree. Origin: https://github.com/frankxai/arcanea-ai-app.git. Planning branch: agent/codex/branch-landing-product-layers-20261011. Base: 4441801b5e003499bd70ca25e141fa7986793e58. Programme: [issue 276](https://github.com/frankxai/arcanea-ai-app/issues/276); quality: [issue 427](https://github.com/frankxai/arcanea-ai-app/issues/427).

Acceptance: every current remote Arcanea branch has a pinned head, main revision, ancestry relation, PR history, proposed disposition and remaining review gate; existing creator work and foreign ownership survive; the next product work has an explicit customer outcome and dependencies. Verification: GitHub branch/pull/compare APIs, current check runs, inspected accepted source, hosted production metadata and bounded anonymous HTTP checks. Rollback: remove only this planning proposal through a reviewed change; no product or database behavior changes.

## What is true

PR561 is merged at base4441801. Vercel production dpl_289Z8sZJhL7T6gXsycdbg8qdzCSb is READY at that exact main revision. The source and merge trees match. The earlier exact-source review and hosted authenticated recovery/live-generation receipts remain revision-bound evidence, not proof of signed-in production onboarding or all programme outcomes. Seven fresh anonymous HTTP checks pass with zero model calls and zero production writes.

The prepared private HTTP verifier used incorrect remembered author paths. The failed404 was a probe error. The corrected verifier checks /studio/author, /api/ai/author-chat, /api/author/create and the actual chapter route. Both the failed attempt and correction remain part of the evidence.

The Arcanea snapshot has148 remote branches,40 open PRs and30 drafts. Its branch manifest is [BRANCH_LANDING_ARCANEA_2026-10-11.csv](BRANCH_LANDING_ARCANEA_2026-10-11.csv). Two non-main branches are ancestors of main; one backup branch has unrelated history;40 branches have open PRs;104 have no open PR at the snapshot. This is structural triage and a landing recommendation, not a source-code approval of every branch.

GitHub compare reports changes introduced since the merge base. Its file list is not a residual diff against today's main, and can truncate at300 files. Squash merging can leave an already-merged source head ahead/diverged in ancestry. A matching merged-PR head is historical evidence; actual residual content still needs comparison before cleanup. An old date or a closed PR does not establish abandonment or integration.

Reader PR560 is currently e6691535358a57c8cfd99552224dbf8e022a1017, with clean mergeability and successful current ordinary checks. Its owner must bind the independent review and acceptance to that revision. An older reader receipt cannot approve a later head. Its real image/managed-credit/storage gates remain separate from synthetic generation acceptance. Preserve its active owner and the foreign dirty PR505 checkout.

## What getting clean means

Main should contain one coherent accepted implementation for each shipped job, with required checks, exact-revision review, recovery evidence and a verified deployment. Historical experiments, backups and unfinished proposals remain traceable. Reducing branch count is a separate, authorized housekeeping step after local work and ownership are checked.

For every candidate:

1. Pin current main, source head, owning issue, source author and active lane owner. Recheck races before writing or promoting.
2. Compare its actual source with the accepted implementation. Identify unique useful behavior, obsolete replacements, conflicting decisions and missing tests.
3. Keep a live owner's branch with that owner. Create a narrow integration candidate from current main only when ownership is resolved. Preserve the donor head and provenance when porting changes.
4. Resolve stacked bases before their dependent PRs. Update against main without force-pushing someone else's work.
5. Run the repository's required scope gates and an independent review at the exact candidate. Treat skipped, canceled and budget-refused jobs according to their actual coverage.
6. Inspect the preview and recovery/denial paths. Land one candidate at a time; bind receiving checks and the production domain to its resulting revision.
7. Record the adopted behavior and any remaining donor value in the owning issue and hub handover. PR closure or remote deletion needs its own explicit authorization and preservation check.

Unrelated histories must remain separate. Do not use allow-unrelated-histories to make a branch inventory look tidy. For a truncated comparison, enumerate the full source tree before source-level disposition.

## Arcanea landing sequence

| Wave                               | Candidates and donor branches                              | Result and required gate                                                                                                                                                                                                                                                |
| ---------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| W0: money and release safety       | 449,494,333; CI/review donors488,508,509,506,523           | Reconcile with accepted PR525 billing and PR559 review rail. Inspect actual route references, grants and release controls. New commerce stays gated. Keep useful unique donor behavior; do not replace accepted ledgers or suppress checks.                             |
| W1: creator continuity             | 403,505,487,500,447,470;513 actor isolation;537 navigation | Continue accepted PR561 worlds and PR556 author saves. Join one private project, world and chapter workflow; preserve unapplied edits, source imports and revisions. Cross-account denial, reload, conflicts and retry must pass.                                       |
| W2: reader and governed media      | 560 current owner;472,448,454,490 as reconciled donors     | Selected passage becomes an editable private scene linked to an exact source revision. First resolve reader-owned source/review gates, then private asset lifecycle and any paid generation. Never merge every historical reader implementation.                        |
| W3: portable tools                 | 553,498,499,501;388,421,393 as MCP donors                  | Reuse accepted PR558 runtime integration. Prove scoped cloud authorization, portable local recovery, packed consumers and equivalent operations. Resolve public package/IP boundaries before publishing.393 has a non-main base and needs explicit dependency handling. |
| W4: authored experiences           | 502,372,378,512,526,486                                    | Separate software repairs from canon, illustration and publication decisions. Preserve human canon gates, inspect actual creative work and review visual changes against TASTE.378 has a stacked book base.                                                             |
| W5: acquisition and truthful entry | 466,493,497,496,552,540;494 pricing donor                  | After the primary journey works, make every entry/capture route lead to a real result. Derive copy from observed availability; retain unlaunched demand capture.                                                                                                        |

Each wave is a proposed grouping, not a giant merge. Safety repairs may precede reader release; independent owner progress may continue without overlapping writes. Open PR checks were sampled at all40 current Arcanea heads. The manifest still requires source review and receipt inspection before any promotion.

## Findings that change the plan

- The billing catalog is present, but advertised team seats, API keys, hosted MCP writes, publication and storage need enforcement/acceptance before sale. Legacy /api/credits/spend still ignores some database failures and is called by imagine/animate. Reuse runReservedOperation and its durable recovery rather than introduce another wallet. No financial incident or activated paid rail was observed in this audit.
- Catalog prices remain proposed: Creator€19 with1500 monthly credits, Studio€79 with8000, packs500/2500/8000 at€5/€19/€49. A prior summary mentioning2500 as a plan grant was incorrect. The source is catalog.ts.
- The comment that one credit is approximately€0.01 of provider cost conflicts with an8000-credit pack priced€49: that interpretation implies€80 provider cost before fees. The claimed50% margin is unverified. Use actual rated costs, failed attempts, storage/delivery and support before ratifying grants or prices.
- packages/cli and packages/arcanea-cli both declare the arcanea executable. Resolve supported command ownership and compatibility before recommending a global install. Package existence and README examples do not prove a fresh registry consumer works.
- apps currently contains web only. Mobile and desktop are proposed clients; their release status cannot be inferred from strategy documents or responsive pages.
- Older harness strategy includes broad fork, archive and superiority assertions that have no current acceptance evidence. Preserve those documents as history; this proposal does not adopt their deletion instructions or competitive claims.
- The primary README still frames Arcanea as prompts making models feel magical. The release plan should explain the useful creation workflow and its actual limits. Canon and creative-IP licensing remain authoritative human decisions.

## Authority and remaining review

The private Registry was resolved at b4b82e3d1430846d62707973a66584de4f2e4776. Applicable accepted decisions include architecture_experience_plane, architecture_durable_execution_boundary, architecture_media_fabric_v2, architecture_agent_credentials_and_tools and architecture_portability_contract. This proposal does not mutate that authority. The current media decision prefers Vercel Blob for new web binaries; the older R2-default data/asset decision is explicitly superseded.

Root AGENTS SHA256:36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5. TASTE:f92102020196807734aff83838bbdb5d22241e918e90aea6b67f9d31a352b344. DESIGN:dbbb7acbb5f211e300ea764518f1ce42ad1f7acfa792661b050bc64cf4d2baba. Repo instructions, accepted-source records, workflow, machine and product-quality policies were read; routing guard/check and ownership were checked separately. Two referenced config guides, capability-loading.md and progressive-skill-gateway.md, were absent both locally and from the inspected config main tree. The available accepted Registry/platform policies were loaded instead; missing guide coverage remains explicit.

The neutral two-pixel semantic blockquote border in doc-editor.tsx predates this release. The supplied design-hook finding was narrowly suppressed in the local .impeccable configuration as a false positive; no UI change or broad hook disable was made. That existing untracked configuration is excluded from this planning commit.

This planning candidate needs independent critique before adoption as a release direction. Existing production receipts do not approve this new document. Machine admission permits bounded interactive work and pauses new swarms; no new local agent fleet, server, watcher, model call or spend was started.
