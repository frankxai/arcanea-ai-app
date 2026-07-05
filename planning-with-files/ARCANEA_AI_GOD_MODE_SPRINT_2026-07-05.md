# Arcanea.ai God Mode Sprint

Date: 2026-07-05
Owner: Codex lead operator with Starlight Queen review lanes
Repo: `C:\Users\frank\starlight\repos\arcanea-ai-app`
Branch: `codex/arcanea-homepage-world-engine`

## Task Contract

Scope:
- Make the public Arcanea.ai experience point to the strongest shipped product loop: Genesis activation, proof artifact, rights-aware creative material, agent workflow, and creator economy path.
- Update homepage entry points, navigation, footer, metadata, and strategic planning artifacts so positioning matches current product reality.
- Create a Queen queue item for deeper council execution across product, growth, engineering, Vercel, workflow, and verification lanes.

Files in scope for this first slice:
- `apps/web/app/layout.tsx`
- `apps/web/app/v3/hero-chat-box.tsx`
- `apps/web/app/v3/hero-showcase.tsx`
- `apps/web/app/studio/image/page.tsx`
- `apps/web/app/status/page.tsx`
- `apps/web/app/method/page.tsx`
- `apps/web/app/v3/artifact-pipeline-panel.tsx`
- `apps/web/app/v3/v3-content.tsx`
- `apps/web/app/genesis/genesis-session.tsx`
- `apps/web/app/atlas/creatures/page.tsx`
- `apps/web/app/atlas/creatures/[slug]/page.tsx`
- `apps/web/components/navigation/navbar.tsx`
- `apps/web/components/navigation/footer.tsx`
- `apps/web/components/landing/cta-section.tsx`
- `apps/web/lib/arcanea/activation.ts`
- `apps/web/lib/genesis/proof.ts`
- `apps/web/lib/analytics/events.ts`
- `apps/web/lib/analytics/__tests__/events-projects.test.ts`
- `apps/web/app/atlas/creatures/[slug]/prompt-actions.tsx`
- `.gitignore`
- `vercel.json`
- `apps/web/vercel.json`
- `scripts/arcanea-durable-workflow-readiness.mjs`
- `scripts/arcanea-release-package-plan.mjs`
- `scripts/arcanea-release-readiness.mjs`
- `scripts/arcanea-success-metrics-audit.mjs`
- `scripts/arcanea-vercel-project-selection.mjs`
- `scripts/arcanea-vercel-remediation.mjs`
- `scripts/arcanea-vercel-remediation-runner.mjs`
- `docs/ARCANEA_GROWTH_METRICS.md`
- `planning-with-files/ARCANEA_COMPETITIVE_SCORECARD_2026-07-05.json`
- `planning-with-files/ARCANEA_ARTIFACT_PIPELINE_SCENE_BRIEF_2026-07-05.md`
- `planning-with-files/ARCANEA_DURABLE_WORKFLOW_READINESS_PACKET_2026-07-05.json`
- `planning-with-files/ARCANEA_DURABLE_WORKFLOW_READINESS_PACKET_2026-07-05.md`
- `planning-with-files/ARCANEA_VERCEL_DOMAIN_AUDIT_2026-07-05.json`
- `planning-with-files/ARCANEA_VERCEL_DOMAIN_AUDIT_2026-07-05.md`
- `planning-with-files/ARCANEA_VERCEL_PROJECT_SELECTION_2026-07-05.json`
- `planning-with-files/ARCANEA_VERCEL_PROJECT_SELECTION_2026-07-05.md`
- `planning-with-files/ARCANEA_GOD_MODE_RELEASE_SCOPE_2026-07-05.json`
- `planning-with-files/ARCANEA_GOD_MODE_RELEASE_PACKAGE_PLAN_2026-07-05.json`
- `planning-with-files/ARCANEA_GOD_MODE_RELEASE_PACKAGE_PLAN_2026-07-05.md`
- `planning-with-files/ARCANEA_VERCEL_REMEDIATION_PACKET_2026-07-05.json`
- `planning-with-files/ARCANEA_VERCEL_REMEDIATION_PACKET_2026-07-05.md`
- `planning-with-files/ARCANEA_VERCEL_REMEDIATION_RUNNER_2026-07-05.json`
- `planning-with-files/ARCANEA_VERCEL_REMEDIATION_RUNNER_2026-07-05.md`
- `planning-with-files/ARCANEA_VERCEL_REMOTE_SNAPSHOT_2026-07-05.json`
- `.visual-qa/design-loop-evidence-arcanea-god-mode-2026-07-05.json`
- `planning-with-files/ARCANEA_DURABLE_WORKFLOW_RELEASE_BRIEF_2026-07-05.md`
- `planning-with-files/ARCANEA_AI_GOD_MODE_SPRINT_2026-07-05.md`
- Queen inbox job: `C:\Users\frank\starlight\queen\inbox\arcanea-ai-god-mode-sprint-2026-07-05.json`

Non-goals:
- No database schema changes, auth rewrites, payment changes, or package dependency updates in this slice.
- No production deploy until local gates pass and the current dirty worktree is intentionally staged by Frank or a release operator.
- No claim that Eve or Vercel Workflow is shipped in this app until a dedicated workflow implementation lands.

Rollback:
- Revert the scoped UI/doc/evidence files above.
- Remove the Queen inbox JSON if the council run should be canceled.

## Current Product Truth

Shipped routes verified locally:
- `/genesis`
- `/atlas/creatures`
- `/studio/store`
- `/worlds/create`
- `/create`
- `/agents`
- `/mcp`
- `/design-lab`
- `/creator-economy`

Vercel state observed:
- Project: `arcanea-ai-app`
- Connector snapshot: `planning-with-files/ARCANEA_VERCEL_REMOTE_SNAPSHOT_2026-07-05.json`
- Latest deployment is `BLOCKED` on `backup/claude-snapshots`; connector build-log lookup returned no build log events.
- Latest recorded God Mode branch candidate is `READY` at `97093bf5`, but current God Mode changes are uncommitted, so a fresh preview is still required after release packaging.
- Local Vercel metadata now matches Next.js and Node `22.x`; remote Vercel project settings still report framework `services` and Node `24.x`, while repo config expects Next.js and `.nvmrc` is `22`.
- Vercel project domains currently show Vercel subdomains, not `arcanea.ai` on this project.
- Domain audit confirms `arcanea.ai` is registered under the Starlight Vercel team and served by Vercel, but the inspected release project does not own `arcanea.ai` or `www.arcanea.ai`; the visible custom-domain association is `lobe.arcanea.ai` on `arcanea-lobechat-labs`.
- The project record reports `live: false`.
- Production promotion is blocked until the release-readiness gate passes or Frank explicitly accepts a preview-only exception.
- Release packaging now has a machine-readable scope file at `planning-with-files/ARCANEA_GOD_MODE_RELEASE_SCOPE_2026-07-05.json` plus a non-mutating package plan at `planning-with-files/ARCANEA_GOD_MODE_RELEASE_PACKAGE_PLAN_2026-07-05.md`: current dirty state is 56 included paths, 5 excluded unrelated paths, and 0 unknown paths.
- Project selection audit is captured in `planning-with-files/ARCANEA_VERCEL_PROJECT_SELECTION_2026-07-05.md` and `.json`: it recommends repairing the current linked `arcanea-ai-app` project first instead of relinking to `arcanea-ai-appx`.
- Vercel remediation actions are captured in `planning-with-files/ARCANEA_VERCEL_REMEDIATION_PACKET_2026-07-05.md` and `.json`.
- Production domain ownership/routing evidence is captured in `planning-with-files/ARCANEA_VERCEL_DOMAIN_AUDIT_2026-07-05.md` and `.json`.
- Success metrics audit is captured in `.visual-qa/arcanea-god-mode-2026-07-05/success-metrics-report.json`.

Workflow state:
- The repo has rich workflow surfaces and MCP recipes.
- No `@vercel/workflow` dependency was found in package manifests during this pass.
- Eve should be treated as a future durable workflow lane unless a direct Eve runtime path is introduced and verified.
- Durable Workflow/Eve readiness is packet-ready, not runtime-ready: `.visual-qa/arcanea-god-mode-2026-07-05/durable-workflow-readiness-report.json` reports `runtime-blocked-packet-ready` with 2 passes, 4 warnings, and 0 blockers. The new pass is a dependency-free Genesis proof workflow contract and redaction test that prepares the first durable lane without importing Workflow or Eve runtime packages.

## Competitive Read

Current competitor jobs to beat:
- ChatGPT Canvas: side-by-side writing/coding workspace and GPT creation flow. Source: https://help.openai.com/en/articles/9930697-what-is-the-canvas-feature-in-chatgpt-and-how-do-i-use-it and https://help.openai.com/en/articles/8554397-creating-and-editing-gpts
- Claude Artifacts and Projects: persistent workspaces, artifact rendering, shareable outputs, and project context. Source: https://support.anthropic.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them and https://www.anthropic.com/news/projects
- Runway Gen-4 and Gen-4.5: high-fidelity cinematic image/video consistency and media workflows. Source: https://runwayml.com/research/introducing-runway-gen-4 and https://runwayml.com/research/introducing-runway-gen-4.5
- World Anvil: mature worldbuilding database, templates, maps, timelines, and RPG/novel tooling. Source: https://www.worldanvil.com/

Arcanea advantage to sharpen:
- Not only chat, artifacts, or media generation.
- Arcanea should become a creator-owned intelligence workspace where each session produces named proof, memory, provenance, rights boundaries, and a next workflow.
- The first-session promise is: name the Drift, issue a Gift, set Right Use, complete a proof-sized Trial, then save/export the result.

## Page Spec - Arcanea Method

Route:
- `/method`

Audience:
- AI-native creators, founders, worldbuilders, operators, and studio leads comparing Arcanea against modern creative AI workspace expectations.

First read:
- Arcanea is not a single chat, canvas, media generator, or lore database. It is a proof engine where a creative call becomes a named artifact, memory, provenance, rights boundary, and next workflow.

Scene brief:
- Hero: "The Arcanea Method" with a concrete five-step proof chain visible in the first viewport.
- Market pressure: neutral category language for editable workspaces, shareable artifacts, project memory, consistent media, and worldbuilding systems; no competitor names in public ad copy.
- Arcanea response: turn each pressure into Genesis, Atlas, Studio, Worlds, MCP/Agents, Store, and Status surfaces.
- Demo rail: show the user's path from Drift to Proof without claiming unshipped durable workflow, payment, or production-domain status.
- Release posture: link to `/status` for what is live, beta, preview, and roadmap.

Asset tier:
- Tier C system-authored interface/diagram. No external or generated media is required for this slice.

Competitor source notes:
- OpenAI Help: Canvas/writing blocks/projects show the market expectation for editable workspaces and project context.
- Anthropic Help: Artifacts/Projects show shareable standalone outputs and workspace memory expectations.
- Runway Gen-4/Gen-4.5 docs show the media bar for prompt adherence, fidelity, motion, and reference continuity.
- World Anvil docs show the maturity bar for templates, maps, timelines, and long-lived world databases.

## Success Metrics

Activation:
- `homepage_genesis_cta_click`
- `genesis_prompt_prefill_used`
- `genesis_proof_export`
- `atlas_creature_prompt_copy`
- `studio_store_package_click`

Product quality:
- First viewport communicates what Arcanea does within 5 seconds.
- Primary CTA leads to Genesis proof, not a generic empty chat.
- Navigation exposes Genesis, Atlas, Store, Agents, MCP, and Creator Economy without dead links.
- All premium hero/showcase media are existing inspected assets, not decorative filler.

Engineering:
- Type check passes: `pnpm --dir apps/web type-check`
- Build attempted after type gate when time allows: `pnpm --dir apps/web build`
- Local dev server is stopped before handoff if used.
- No unrelated dirty files are modified or reverted.

Vercel:
- Use one preview deployment per coherent change set when ready.
- Verify preview URL visually before production promotion.
- Use Vercel project/deployment inspection before claiming a live domain.
- Use frozen lockfile installs for Vercel builds; no deploy should resolve opportunistic dependency drift.
- Run `node scripts/arcanea-release-readiness.mjs --strict` before preview/production promotion; nonzero means stop.

## Executed This Pass

- Routed homepage freeform and proof CTAs into Genesis proof creation, with Image Studio receiving seeded prompts instead of dropping context.
- Reframed the proof strip around shipped surfaces: Genesis Proof, Creature Atlas, Living World, Claw Store, MCP Bridge, and Creator Economy.
- Exposed Genesis, Creature Atlas, Claw Store, Agents, MCP, and Creator Economy in navigation/footer paths.
- Tightened Genesis copy from vague gift/save language toward proof packet, proof ID, export, and persistence-safe wording.
- Labeled Atlas visuals as schematics/provenance schematics so the page does not imply unapproved final creature art.
- Updated Vercel install commands to `--frozen-lockfile` in both config surfaces and verified the current lockfile satisfies frozen resolution.
- Captured desktop/mobile visual QA screenshots for `/`, `/genesis`, `/atlas/creatures`, and `/atlas/creatures/aeralith-sky-grazer`; validated the premium evidence manifest.
- Added privacy-conscious activation telemetry for the five sprint metrics through Vercel Analytics plus optional PostHog-compatible capture, without sending raw prompts, wallet addresses, API keys, transaction hashes, or generated proof content.
- Moved homepage-to-Genesis/Image prompt handoff off raw prompt URLs and into client-local handoff storage, with legacy prompt URLs scrubbed after consumption.
- Added the durable workflow/release brief for the Eve and Vercel Workflow lane, including package-doc gates, release checklist, and the next safe implementation shape.
- Verified the activation funnel with Playwright against a production `next start`: homepage-to-Genesis, starter-card-to-Image-Studio, Atlas prompt copy, Studio Store package intent, safe analytics payloads, and mobile screenshots.
- Fixed Atlas detail mobile overflow by wrapping prompt blocks and adding grid width guards; final Playwright width checks report 390px document width on a 390px viewport.
- Updated the premium evidence manifest with activation screenshots/report and revalidated it with the design evidence validator.
- Added `/status` as a public product status and experience map, linked from top-level navigation and footer, with live/beta/preview/private beta/roadmap labels, activation signals, release gates, and a market-pressure response that avoids overclaiming unfinished Eve or workflow runtime work.
- Verified `/status` through production `next start` captures at 1440px desktop, 1024px tablet, and 390px mobile; screenshots and `status-playwright-report.json` are recorded in the premium evidence manifest.
- Added `/method` as the public Arcanea Method page that translates competitor pressure into Arcanea-owned proof, memory, provenance, rights, and workflow language without naming competitors in ad copy.
- Linked `/method` from the Learn menu, footer, and `/status`; verified it through production `next start` captures at 1440px desktop, 1024px tablet, and 390px mobile with public competitor-name exclusion checks.
- Added `scripts/arcanea-release-readiness.mjs`, a dependency-free gate that checks local/remote Vercel posture, Node/runtime drift, frozen installs, proof-loop route files, visual evidence, analytics sinks, Eve/Workflow doc readiness, and dirty release packaging.
- Captured the sanitized Vercel connector snapshot in `planning-with-files/ARCANEA_VERCEL_REMOTE_SNAPSHOT_2026-07-05.json` and the machine report in `.visual-qa/arcanea-god-mode-2026-07-05/release-readiness-report.json`.
- Added `planning-with-files/ARCANEA_GOD_MODE_RELEASE_SCOPE_2026-07-05.json` so the release gate can distinguish included God Mode files from unrelated dirty package/lock/campaign files.
- Added `scripts/arcanea-release-package-plan.mjs` and generated `planning-with-files/ARCANEA_GOD_MODE_RELEASE_PACKAGE_PLAN_2026-07-05.md` plus `.json`, giving the release operator exact scoped `git add -- ...` chunks, excluded-path warnings, unknown-path blockers, and stop conditions without staging anything.
- Added `scripts/arcanea-vercel-remediation.mjs`, which generates a reviewed Vercel remediation packet from the connector snapshot and release-readiness report without mutating Vercel state or storing secrets.
- Added `scripts/arcanea-vercel-remediation-runner.mjs`, a guarded Vercel remediation runner that is dry-run by default, never prints token values, and requires `VERCEL_TOKEN` plus explicit project/domain confirmations before any remote project settings or domain requests.
- Removed hardcoded Gemini/Google API keys from legacy NFT generation scripts and replaced them with `GOOGLE_GENERATIVE_AI_API_KEY` / `GEMINI_API_KEY` environment-variable guards so the broad scripts secret scan passes.
- Added `scripts/arcanea-success-metrics-audit.mjs`, updated `docs/ARCANEA_GROWTH_METRICS.md`, and added `planning-with-files/ARCANEA_COMPETITIVE_SCORECARD_2026-07-05.json` so activation metrics are audited against implementation, tests, docs, privacy posture, dashboard views, and competitor pressure.
- Added `scripts/arcanea-durable-workflow-readiness.mjs`, generated the durable Workflow/Eve readiness packet, and wired it into the release gate as a pass for implementation discipline while keeping runtime code blocked until dependencies and bundled docs are present.
- Added `apps/web/lib/genesis/workflow-contract.ts` and `apps/web/lib/genesis/__tests__/workflow-contract.test.ts` as a dependency-free durable workflow contract: it builds a serializable Genesis proof packet, emits redacted metrics, records the six-step run boundary, and keeps runtime code disabled until installed Workflow/Eve docs are present and read.
- Added `scripts/arcanea-vercel-project-selection.mjs` and generated the project selection packet so Vercel remediation starts by confirming the current linked release project before any framework/runtime/domain action.
- Promoted the artifact pipeline from a below-hero proof strip into a reusable `ArtifactPipelinePanel`, with a compact first-viewport version under the homepage prompt and the full proof-ledger version in `HeroShowcase`.
- Current success metrics audit result: metrics-ready with 6 passes, 0 warnings, and 0 blockers.
- Current durable workflow readiness result: runtime-blocked-packet-ready with 2 passes, 4 warnings, and 0 blockers.
- Current project selection result: fix-current-linked-project-first; `arcanea-ai-app` scores 7/14 versus `arcanea-ai-appx` at 4/14 because it is linked, pnpm/frozen-command aligned, and has recorded God Mode preview evidence.
- Current release-readiness result: blocked with 18 passes, 4 warnings, and 4 blockers. Remaining blockers are remote Vercel framework/runtime drift, production-domain mapping, and remote live-state. Warnings cover backup-branch deployment noise, undeployed current God Mode changes, intentionally blocked Eve/Workflow runtime, and dirty release packaging with 0 unknown paths; the package planner itself is stage-ready with 56 scoped targets and the Vercel remediation runner is dry-run ready.

## Queen Board

Lane 1 - Product Doctrine:
- Validate the Genesis proof loop against `docs/ARCANEA_OPERATING_SYSTEM.md`, `docs/ARCANEA_FIRST_SESSION_PRD.md`, and the Arcanea brand pack.
- Reject fantasy-game copy where the correct frame is AI-lab premium creative intelligence.

Lane 2 - UX Growth:
- Measure the homepage path from first viewport to Genesis proof.
- Define dashboard events and funnel decisions for activation, proof save, Atlas reuse, and Store intent.
- Use `scripts/arcanea-success-metrics-audit.mjs --strict` as the metrics go/no-go gate.

Lane 3 - AI Engineering:
- Map Chat, Genesis, MCP tools, Atlas, project memory, and Store packages into one clear workflow graph.
- Identify where Vercel Workflow, Eve, or the existing voice/workflow engine should handle durable runs.
- Use `scripts/arcanea-durable-workflow-readiness.mjs --strict` as the blocker-free packet gate, and do not write runtime code until installed docs are read.

Lane 4 - Vercel/Release:
- Confirm Node/runtime/project settings, build command, preview domain, production domain, and deployment logs.
- Prevent double-build or production churn.
- Use `scripts/arcanea-release-readiness.mjs` as the board's repeatable go/no-go gate.
- Use `scripts/arcanea-vercel-project-selection.mjs --write` before Vercel remediation when multiple Arcanea Vercel projects look plausible.
- Use `scripts/arcanea-vercel-remediation.mjs --write` to regenerate the project-setting/domain/promotion remediation packet after connector state changes.
- Use `planning-with-files/ARCANEA_VERCEL_DOMAIN_AUDIT_2026-07-05.md` before any domain move; do not force-attach `arcanea.ai` until the current production owner and rollback path are explicit.

Lane 5 - Premium QA:
- Run visual QA desktop/mobile.
- Score the first viewport and proof strip with the 30-point gate.
- File screenshot paths, asset provenance, reduced-motion notes, and unresolved risks.

## Execution Sprint

P0:
- Update homepage CTA path so first creation starts with Genesis proof.
- Replace proof strip examples with shipped surfaces: Genesis Proof, Creature Atlas, Claw Store, Worlds, MCP, Creator Economy.
- Update nav/footer copy and links to make the product map visible.
- Update global metadata and structured data to sovereign creative intelligence, proof, memory, provenance, and rights-aware workflows.

P1:
- Add privacy-conscious event helper and fire the activation events listed above.
- Add a Vercel preview verification checklist tied to one coherent PR. Done as executable gates in `scripts/arcanea-release-readiness.mjs` and `scripts/arcanea-release-package-plan.mjs`; rerun after Vercel settings and release packaging are cleaned up.
- Create a workflow implementation brief for Eve/Vercel durable execution.

P2:
- Consolidate older fantasy/worldbuilding claims into product truth pages.
- Add a public status map for live, beta, private beta, and roadmap surfaces. Done for the first public slice at `/status`; keep it current as routes move between states.
- Build comparative demo pages versus Canvas, Artifacts, Runway, and World Anvil without naming competitors in ad copy. First implementation is `/method`, using category language for editable workspaces, shareable artifacts, persistent projects, consistent media, world databases, and production confidence.
