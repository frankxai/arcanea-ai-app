# Arcanea Durable Workflow And Release Brief

Date: 2026-07-05
Repo: `C:\Users\frank\starlight\repos\arcanea-ai-app`
Branch: `codex/arcanea-homepage-world-engine`

## Purpose

Turn the God Mode sprint into a reliable release lane for Arcanea.ai without inventing unsupported durable workflow code.

This brief covers:

- Vercel preview and production discipline.
- Eve and Vercel Workflow readiness gates.
- The durable execution shape Arcanea should implement next.
- The exact validation evidence needed before production promotion.

## Current State

Verified in this pass:

- `node_modules/workflow/docs` is not present.
- `node_modules/eve/docs` is not present.
- `node_modules/@workflow/ai/docs` is not present.
- `node_modules/@workflow/next/docs` is not present.
- Package search did not find `@vercel/workflow`, `workflow`, `@workflow/*`, or `eve` as installed app dependencies.
- `apps/web/package.json` already includes the analytics test file in `test:projects`.
- Root `vercel.json` and `apps/web/vercel.json` now use frozen lockfile installs.
- Vercel connector snapshot is recorded at `planning-with-files/ARCANEA_VERCEL_REMOTE_SNAPSHOT_2026-07-05.json`.
- `scripts/arcanea-release-readiness.mjs` now checks Vercel/project/domain/runtime posture, proof-loop routes, visual evidence, analytics sinks, Eve/Workflow doc readiness, and dirty release packaging.
- Release scope manifest is recorded at `planning-with-files/ARCANEA_GOD_MODE_RELEASE_SCOPE_2026-07-05.json`.
- Release package plan is recorded at `planning-with-files/ARCANEA_GOD_MODE_RELEASE_PACKAGE_PLAN_2026-07-05.md` and `.json`; it emits exact non-mutating staging commands and refuses unknown dirty paths.
- Vercel remediation packet is recorded at `planning-with-files/ARCANEA_VERCEL_REMEDIATION_PACKET_2026-07-05.md` and `.json`.
- Guarded Vercel remediation runner is recorded at `planning-with-files/ARCANEA_VERCEL_REMEDIATION_RUNNER_2026-07-05.md` and `.json`; it is dry-run by default and requires `VERCEL_TOKEN` plus explicit project/domain confirmation flags before remote mutation.
- Vercel domain ownership/routing audit is recorded at `planning-with-files/ARCANEA_VERCEL_DOMAIN_AUDIT_2026-07-05.md` and `.json`.
- Vercel project selection audit is recorded at `planning-with-files/ARCANEA_VERCEL_PROJECT_SELECTION_2026-07-05.md` and `.json`; current decision is `fix-current-linked-project-first`.
- Durable Workflow/Eve readiness packet is recorded at `planning-with-files/ARCANEA_DURABLE_WORKFLOW_READINESS_PACKET_2026-07-05.md` and `.json`.
- Current durable workflow readiness report is `.visual-qa/arcanea-god-mode-2026-07-05/durable-workflow-readiness-report.json`: 2 passes, 4 warnings, 0 blockers, decision `runtime-blocked-packet-ready`.
- `apps/web/lib/genesis/workflow-contract.ts` and `apps/web/lib/genesis/__tests__/workflow-contract.test.ts` now provide the dependency-free contract boundary for `genesisProofRun`: serializable input, six explicit steps, redacted metrics, repo export proof packet, and a closed runtime gate.
- Current release-readiness report is `.visual-qa/arcanea-god-mode-2026-07-05/release-readiness-report.json`: 18 passes, 4 warnings, 4 blockers.

Implication:

- Do not add Vercel Workflow or Eve runtime code in this slice.
- The next workflow implementation must first add the package intentionally, read the bundled docs that match the installed version, and then build a minimal test-backed workflow.
- Do not deploy or promote until the release-readiness gate passes or Frank explicitly chooses a preview-only exception.

## Release Readiness Gate

Command:

```text
node scripts/arcanea-release-readiness.mjs --strict
```

Default report:

```text
node scripts/arcanea-release-readiness.mjs
node scripts/arcanea-release-readiness.mjs --json
```

Current blockers:

- Remote Vercel project framework is `services`; expected `nextjs`. Local Vercel metadata has been aligned to `nextjs`.
- Remote Vercel Node runtime is `24.x`; repo `.nvmrc` is `22`. Local Vercel metadata has been aligned to `22.x`.
- `arcanea.ai` is not attached to the inspected Vercel project.
- Vercel connector reports `live: false`.
- Project selection audit recommends repairing `arcanea-ai-app` first; `arcanea-ai-appx` remains an alternate only if a human accepts relinking, command migration, preview-history, and domain-risk work.

Current warnings:

- Eve/Vercel Workflow dependencies and bundled docs are absent, so durable workflow code remains roadmap-only.
- Latest Vercel deployment is BLOCKED on `backup/claude-snapshots`, which is tracked as backup-branch noise because the recorded God Mode candidate preview is READY.
- The recorded God Mode candidate preview matches local HEAD, but current God Mode files are dirty and undeployed, so a fresh preview is required after packaging.
- `arcanea.ai` is registered under the Starlight Vercel team and served by Vercel, but it is not attached to `arcanea-ai-app`; the visible custom-domain association is `lobe.arcanea.ai` on `arcanea-lobechat-labs`.
- The worktree contains 56 included God Mode paths and 5 excluded unrelated dirty paths. The release scope manifest has 0 unknown paths; `scripts/arcanea-release-package-plan.mjs --strict` is stage-ready and records 56 scoped `git add -- ...` targets without running them.

Durable readiness packet:

- `node scripts/arcanea-durable-workflow-readiness.mjs --write`
- Produces exact operator guardrails for:
  - keeping `genesisProofRun` as the first durable workflow target
  - using Vercel Workflow first and Eve as an internal/operator lane second
  - installing dependencies only in an explicit follow-up slice
  - reading bundled docs before writing runtime code
  - keeping raw prompts, secrets, wallets, transaction hashes, and proof bodies out of workflow metrics

Remediation packet:

- `node scripts/arcanea-vercel-remediation.mjs --write`
- Produces exact operator commands for:
  - Confirming `arcanea-ai-app` is the selected release project before repair.
  - PATCHing the Vercel project framework to `nextjs` and Node runtime to `.nvmrc` major.
  - Adding `arcanea.ai` to the inspected project or forcing an explicit production-project decision.
  - Refreshing connector/readiness evidence.
  - Running the official preview-then-promote sequence only after strict gate success.

Release package plan:

- `node scripts/arcanea-release-package-plan.mjs --write`
- Produces exact operator commands for:
  - staging only God Mode release-scope paths
  - preserving excluded package/lock/campaign dirty files
  - blocking unknown dirty paths before preview
  - handing off a Queen report with objective, risk gate, validation evidence, and stop conditions

Guarded remediation runner:

- `node scripts/arcanea-vercel-remediation-runner.mjs --write --strict`
- Dry-run safe by default; emits `planning-with-files/ARCANEA_VERCEL_REMEDIATION_RUNNER_2026-07-05.md` plus `.json`.
- Remote verification requires `--verify-remote --confirm-project=arcanea-ai-app` plus `VERCEL_TOKEN`.
- Remote project settings mutation requires `--apply-project-settings --confirm-project=arcanea-ai-app` plus `VERCEL_TOKEN`.
- Domain attachment requires `--apply-domain --confirm-project=arcanea-ai-app --confirm-domain=arcanea.ai` plus `VERCEL_TOKEN`.
- Token values are never printed; production promotion remains blocked until the strict release gate passes after connector evidence refresh.

## Release Lane

Use this path for the current Arcanea.ai sprint:

1. Run local gates:
   - `corepack pnpm --dir apps/web type-check`
   - `corepack pnpm --dir apps/web build`
   - `corepack pnpm --dir apps/web test:projects`
   - scoped gitleaks on touched source and planning paths
2. Use one draft PR for the coherent change set.
3. Let Vercel create one preview from that PR or branch.
4. Verify preview URL before production:
   - `/`
   - `/genesis?prompt=Build%20a%20rights-aware%20world&source=preview_check`
   - `/atlas/creatures`
   - `/atlas/creatures/aeralith-sky-grazer`
   - `/studio/store`
   - `/api/health`
5. Inspect Vercel project settings before claiming `arcanea.ai`:
   - project framework preset
   - Node runtime
   - root directory
   - domains
   - latest preview deployment logs
   - whether Git integration or CLI deploy is the single deploy path
6. Run `node scripts/arcanea-vercel-project-selection.mjs --write` if connector inspection shows multiple plausible Arcanea projects.
7. Run `node scripts/arcanea-release-readiness.mjs --strict`.
8. Promote a verified preview only after the domain/project mapping is resolved and the readiness gate passes.

## Durable Workflow Candidate

Name: `genesisProofRun`

Job:

Take a user intent from Genesis and run a crash-safe proof workflow:

1. Intake:
   - receive intent, drift face, mission lane, source route
   - reject empty or unsafe payloads
2. Gift step:
   - generate bounded Gift Object
   - persist step output
3. World seed step:
   - generate laws, characters, visual DNA, first proof
   - persist step output
4. Right-use review step:
   - check source, commercial, and canon boundaries
   - fail permanently for invalid rights states
5. Artifact/export step:
   - produce Markdown/JSON export packet
   - write SIS/project memory when the backing store is chosen
6. Metrics step:
   - emit safe activation events without prompt text

## Vercel Workflow Implementation Gate

Before writing workflow code:

1. Intentionally add the workflow dependency with pnpm.
2. Keep `apps/web/lib/genesis/workflow-contract.ts` as the stable boundary for payload, step order, redacted metrics, and proof export expectations.
3. Read the installed docs:
   - `node_modules/workflow/docs/README.md`
   - relevant Next.js setup doc under `node_modules/workflow/docs/getting-started/`
   - workflow/step foundation docs
   - API `start()` docs
   - AI docs if `DurableAgent` is used
4. Use the current directive style:
   - `"use workflow"` for orchestration only
   - `"use step"` for Node/npm/model calls
5. Start workflows from API routes with `start()` from `workflow/api`.
6. Do not call workflow functions directly from UI or server actions.
7. Add integration tests using the installed workflow test harness before enabling production.
8. Use AI Gateway/OIDC or an approved provider route for AI calls; do not put raw provider keys in workflow scope.

## Eve Implementation Gate

Before writing Eve code:

1. Intentionally install or scaffold Eve.
2. Read `node_modules/eve/docs/README.md` and the relevant agent/tool/schedule docs.
3. Treat the Eve agent directory as source of truth:
   - instructions
   - skills
   - tools
   - connections
   - channels
   - schedules
   - subagents
4. Keep Eve out of the public app runtime until the agent process, secrets, persistence, and deployment boundary are explicit.
5. Start with an offline or internal operator agent for Queen review before exposing user-facing actions.

## Product Metrics Now Wired

The current app now emits these safe activation events through `apps/web/lib/analytics/events.ts`:

- `homepage_genesis_cta_click`
- `genesis_prompt_prefill_used`
- `genesis_proof_export`
- `atlas_creature_prompt_copy`
- `studio_store_package_click`

Privacy rules:

- Do not send raw prompt text.
- Do not pass user-entered prompt text through URLs for homepage-to-Genesis or homepage-to-Image handoff; use client-local handoff storage and scrub legacy `?prompt=` links.
- Do not send API keys.
- Do not send wallet addresses.
- Do not send transaction hashes.
- Do not send generated proof body content.

Sink rules:

- Vercel Analytics is the active installed sink through `@vercel/analytics`.
- PostHog-compatible capture remains supported when `window.posthog` exists, but it is not required for these events to leave the browser on Vercel.

## Open Release Risks

- Vercel connector/project settings previously reported framework/runtime/domain drift. Resolve before production promotion.
- The executable release-readiness gate currently confirms the Vercel drift and blocks promotion.
- Root package and lock files were already dirty before this slice and are excluded by the release scope manifest. Do not stage them into the God Mode PR unless Frank explicitly chooses to include them.
- Repo-wide secret scan has existing generated-cache/worktree findings; touched source paths must stay clean.
- The public `docs/VERCEL_DEPLOYMENT_GUIDE.md` appears stale relative to the current `apps/web` deployment and should be replaced in a separate release-doc pass.

## Next Patch Recommendation

Implement a minimal durable workflow only after dependency/docs installation is approved:

- `apps/web/lib/workflows/genesis-proof-run.ts`
- `apps/web/app/api/genesis/workflow/route.ts`
- workflow integration test
- Vercel preview verification using workflow health tools

Until then, keep Genesis deterministic and synchronous, and use the new analytics events to measure whether the proof loop earns deeper backend investment.
