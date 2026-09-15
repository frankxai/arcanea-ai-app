# Release candidate snapshot · 2026-09-12, 12:31 UTC

Frank authorized reviewed application changes to reach production. Production database migrations remain separately human-gated under the supplied repository contract; approval for the concrete repair has been requested. Do not infer approval from elapsed time.

The release is divided into [database access #412](https://github.com/frankxai/arcanea-ai-app/pull/412), [account return #414](https://github.com/frankxai/arcanea-ai-app/pull/414), [complete creator drafts #413](https://github.com/frankxai/arcanea-ai-app/pull/413) and [homepage/capture #403](https://github.com/frankxai/arcanea-ai-app/pull/403). Each must receive its own exact-head review within the existing review-size cap. No gate is waived. This snapshot is not a production-release receipt.

The combined candidate passes 25 local behavior checks. Grok's skeptical-buyer critique drove draft recovery, complete inspection, canonical response handling and refinement improvements. Gemini approved the policy repair and corrected auth code; fresh final creator/homepage review remains required after their dependencies land. The corrected account return validates password-login, signup and OAuth callback destinations. Regression cases include external schemes, network-path URLs, backslashes and encoded separators.

The policy repair reproduced production SQLSTATE 42P17, then passed real PostgreSQL owner/member/outsider/anonymous/revocation tests against both the existing recursive policy shape and a fresh missing-membership-table shape. Supabase preview and all PR #412 checks passed at this snapshot. No production migration has been applied. The initial rollback-only live test left zero synthetic users and zero synthetic worlds.

Fresh Supabase previews replay an older world schema: several columns differ and world_creations is absent. Their migration PASS proves the policy can apply; it does not establish application schema parity or a complete save/reopen journey. The full app integration check must use the verified target schema. Broader schema reconciliation remains open and is not hidden by a green preview label.

Cloud browser evidence verified complete desktop draft rendering, exact JSON export, start-over cancellation/recovery and full-storage protection. The first run stopped at an ambiguous alert selector; the selector now targets the storage message rather than Next.js's route announcer. Desktop/mobile/reduced-motion checks are running again on the combined candidate. A genuine signed-in save/reopen test remains pending user sign-in and the approved production policy repair.

All earlier research, route inventories and implementation snapshots below are retained as historical provenance. Their older authorization and verification statements are superseded by this dated release snapshot.

---

# Earlier implementation snapshot · 2026-09-12

Frank authorized continued implementation with Premium Web OS in the original task. This supersedes the audit-only scope below. The referenced ChatGPT conversation was subsequently retrieved; its earlier unavailable status is historical.

The assigned worktree and branch are unchanged. Updated base: deployed `d90904a1f8f03191d52ff79f0db5f954f617eb63`. Named-file routing passes. Runtime scope and acceptance are recorded in [the implementation brief](../docs/design/product-review-2026-09-11/implementation.md): homepage, generated-draft validation/save/recovery, authentication return links and shared waitlist failure fidelity.

Completed: implementation commit `21edbc0347309b295e0aa46c8938eb17e460aa76`, draft PR #403, 24 behavior tests, local gates and all required remote CI on the first commit. Desktop/mobile browser checks prompted panel/heading refinements; live API probes exposed the waitlist middleware block and the need for explicit generation sign-in. The second commit fixes these integration findings and preserves the approved auth return target. Fresh preview verification is next. Production promotion remains gated by Frank's explicit approval. Second-provider critique is incomplete because both configured external review clients failed authentication/eligibility.

Rollback: revert the bounded implementation commit; no migrations or production-data writes were made. Preserve other agents' lanes and existing PRs #320 and #336. Earlier concept, inventory and skill research remain private audit artifacts and are not claimed as shipped application features.

The original audit packet is retained below for provenance; its proposed paths and unavailable gates describe the earlier phase.

---

# Arcanea product design review

Source: current user request about `https://www.arcanea.ai/`, plus referenced ChatGPT task `6aa313b7-00d0-83ed-bfaf-90264773805c` (contents unavailable).

Intent: examine homepage and whole-product engineering against strong worldbuilding and design references; discover and apply relevant local design skills, including Refero, Impeccable, Design AI Department and Emil/Apple guidance.

Scope: production-source and anonymous HTTP audit; all-page inventory; interactive concept; proposed recurring design-review workflow.

Owner: Codex, current task. Accountable product owner: Frank.

Repository: `frankxai/arcanea-ai-app`; worktree `C:/Users/frank/starlight/worktrees/arcanea-product-design-review-20260911`; branch `codex/arcanea-product-design-review-20260911`; base `24d90ad15db8e2110648e390eac988def179efdf`. Routing check passed for named files. Sparse checkout preserves other agents' working changes and avoids a build/dependency tree.

Files: `docs/design/product-review-2026-09-11/{README.md,design-skills.md,route-inventory.json,department.json,preview.html}` and this task record.

Artifacts: [audit](../docs/design/product-review-2026-09-11/README.md), [interactive concept](../docs/design/product-review-2026-09-11/preview.html), [inventory](../docs/design/product-review-2026-09-11/route-inventory.json), [skills](../docs/design/product-review-2026-09-11/design-skills.md), [department](../docs/design/product-review-2026-09-11/department.json).

Non-goals: production redesign or promotion in this audit slice, generated media, paid generation, database migrations, brand identity changes, new global MCPs, unrelated dirty code changes, or a claim that every route passed browser testing.

Acceptance: every tracked production page is represented; key findings distinguish live evidence, source paths and inference; major design decisions have sources; concept demonstrates editing, conflict review, undo and local persistence/export; all unavailable checks stay explicit.

Verification: GitHub/Vercel source identity checked; 239 page modules inventoried; 25 anonymous HTTP probes (24 completed including sign-in redirects, one timeout); JSON, HTML/JavaScript and artifact integrity checks recorded in final handoff. Source heuristics require contextual review.

Independent verifier verdict: not run. Machine preflight held browser QA and new parallel agents; no second provider was available through the active tools. Self-review is not recorded as independent verification.

Risks: visual quality and browser behavior of concept remain unverified; authenticated generation/save was not exercised; pricing and hosted data-boundary claims need product reconciliation; the interactive fixture is not an implemented AI/world backend.

Approvals: no public release requested by this packet; none performed. Department remains `human_review_requested` and `not-admitted`.

Rollback: this additive documentation/concept slice has no runtime effect. Remove only its named files or revert its eventual bounded commit, preserving all other work.

Next bounded action: implement and test exact-draft persistence, child-write failure handling and canonical slug return; then connect the selected homepage concept to the verified first-session workflow. Browser and independent review must pass before release.

## Production continuation - 2026-09-12

Frank explicitly requested v-swarm review, improvement and production release. The owned worktree remains this task's one-writer lane. Latest production/main `0dd9a2d122e7944b9c0f5a3268c1001214a24c96` was integrated in local merge `0f390b40558359c5548ec572b163b0bacc7ed028`; incoming routes and other agents' work are preserved.

Grok 4.6 supplied a source-based skeptical-buyer review. Findings drive recoverable start-over, previous text draft restoration, explicit resume/new-concept choice, full preview content, canonical response normalization, preserved art/concept on failed refinement and reduced-motion/contrast refinements. The current draft is unchanged by a failed request. Auth-only formatting noise was reduced with a canonical-formatter equality check.

A rollback-only test on live Supabase found SQLSTATE 42P17: worlds collaborator SELECT policy and membership policies recurse. No synthetic user or world persisted (both verified zero). This is an existing production blocker. Prepare a separate migration and PostgreSQL regression test, preserve current owner/collaborator/public access, obtain independent review and the migration approval required by estate rules before application. Do not disable RLS.

Release plan: policy repair first; complete world workflow next; homepage and waitlist integration after their dependency is verified. Keep each independent review within the repository's real diff-size limit. The user was asked to sign in to the preview for a genuine private synthetic save/reopen test. No password or account credential is requested in chat.

Admission: PP bounded; no additional parallel agents; one writer; 90-minute workload ceiling from approximately 11:10 UTC. Browser loop bounded to 30 minutes from approximately 11:30 UTC, with user sign-in tab retained only as a handoff. Cloud runners provide fresh build/browser evidence.
