# Arcanea God Mode Release Package Plan

Generated: 2026-07-05T07:07:00.318Z
Decision: stage-plan-ready
Repo: `C:\Users\frank\starlight\repos\arcanea-ai-app`
Current HEAD: `97093bf51ee9944ad9ea68d1fa81492d1b35e08f`

## Summary

- Dirty paths: 61
- Included God Mode paths: 56
- Excluded dirty paths: 5
- Unknown dirty paths: 0
- Planned git add targets: 56
- Planner checks: 5 pass, 2 warn, 0 blockers
- Preview/production: still blocked until the release-readiness gate and Vercel project/domain drift are resolved.

## Stage Commands

These commands are generated for a release operator. This script did not run them.

```text
git add -- '.gitignore' '.visual-qa/arcanea-god-mode-2026-07-05/' '.visual-qa/design-loop-evidence-arcanea-god-mode-2026-07-05.json' 'apps/web/app/atlas/creatures/[slug]/page.tsx' 'apps/web/app/atlas/creatures/[slug]/prompt-actions.tsx' 'apps/web/app/atlas/creatures/page.tsx' 'apps/web/app/genesis/genesis-session.tsx' 'apps/web/app/layout.tsx' 'apps/web/app/method/' 'apps/web/app/status/'
git add -- 'apps/web/app/studio/image/page.tsx' 'apps/web/app/studio/store/page.tsx' 'apps/web/app/v3/hero-chat-box.tsx' 'apps/web/app/v3/hero-showcase.tsx' 'apps/web/app/v3/artifact-pipeline-panel.tsx' 'apps/web/app/v3/v3-content.tsx' 'apps/web/components/landing/cta-section.tsx' 'apps/web/components/navigation/footer.tsx' 'apps/web/components/navigation/navbar.tsx' 'apps/web/lib/analytics/__tests__/events-projects.test.ts'
git add -- 'apps/web/lib/analytics/events.ts' 'apps/web/lib/arcanea/activation.ts' 'apps/web/lib/genesis/__tests__/' 'apps/web/lib/genesis/proof.ts' 'apps/web/lib/genesis/workflow-contract.ts' 'apps/web/vercel.json' 'docs/ARCANEA_GROWTH_METRICS.md' 'docs/ARCANEA_FIRST_SESSION_PRD.md' 'planning-with-files/ARCANEA_AI_GOD_MODE_SPRINT_2026-07-05.md' 'planning-with-files/ARCANEA_ARTIFACT_PIPELINE_SCENE_BRIEF_2026-07-05.md'
git add -- 'planning-with-files/ARCANEA_COMPETITIVE_SCORECARD_2026-07-05.json' 'planning-with-files/ARCANEA_DURABLE_WORKFLOW_RELEASE_BRIEF_2026-07-05.md' 'planning-with-files/ARCANEA_DURABLE_WORKFLOW_READINESS_PACKET_2026-07-05.json' 'planning-with-files/ARCANEA_DURABLE_WORKFLOW_READINESS_PACKET_2026-07-05.md' 'planning-with-files/ARCANEA_VERCEL_DOMAIN_AUDIT_2026-07-05.json' 'planning-with-files/ARCANEA_VERCEL_DOMAIN_AUDIT_2026-07-05.md' 'planning-with-files/ARCANEA_GOD_MODE_RELEASE_SCOPE_2026-07-05.json' 'planning-with-files/ARCANEA_GOD_MODE_RELEASE_PACKAGE_PLAN_2026-07-05.json' 'planning-with-files/ARCANEA_GOD_MODE_RELEASE_PACKAGE_PLAN_2026-07-05.md' 'planning-with-files/ARCANEA_VERCEL_REMOTE_SNAPSHOT_2026-07-05.json'
git add -- 'planning-with-files/ARCANEA_VERCEL_PROJECT_SELECTION_2026-07-05.json' 'planning-with-files/ARCANEA_VERCEL_PROJECT_SELECTION_2026-07-05.md' 'planning-with-files/ARCANEA_VERCEL_REMEDIATION_PACKET_2026-07-05.json' 'planning-with-files/ARCANEA_VERCEL_REMEDIATION_PACKET_2026-07-05.md' 'planning-with-files/ARCANEA_VERCEL_REMEDIATION_RUNNER_2026-07-05.json' 'planning-with-files/ARCANEA_VERCEL_REMEDIATION_RUNNER_2026-07-05.md' 'scripts/arcanea-durable-workflow-readiness.mjs' 'scripts/arcanea-release-package-plan.mjs' 'scripts/arcanea-release-readiness.mjs' 'scripts/arcanea-success-metrics-audit.mjs'
git add -- 'scripts/arcanea-vercel-project-selection.mjs' 'scripts/arcanea-vercel-remediation.mjs' 'scripts/arcanea-vercel-remediation-runner.mjs' 'scripts/nft-scale-test.js' 'scripts/nft-v5-sacred-gear.js' 'vercel.json'
```

## Excluded Dirty Paths

- `data/campaign-loop-state.json`
- `package.json`
- `packages/arc-protocol/package.json`
- `pnpm-lock.yaml`
- `docs/strategy/ARCANEA_BUSINESS_STRATEGY.md`

## Unknown Dirty Paths

- None

## Checks

- PASS [safety/release-scope-loaded] Release scope manifest loaded.
- PASS [safety/unknown-dirty-paths] No dirty paths are outside the release scope classification.
- PASS [safety/excluded-paths-preserved] The staging plan does not cover excluded dirty paths.
- PASS [safety/included-paths-covered] Every included dirty path is covered by a planned git add target.
- WARN [safety/excluded-dirty-work] 5 excluded dirty paths remain and must stay out of the God Mode PR.
- PASS [release/stage-command-ready] 56 scoped git add targets are ready for a release operator.
- WARN [vercel-release/release-readiness-context] Latest release-readiness report decision is blocked.

## Stop Conditions

- Do not run any staging command if unknownDirtyCount is greater than 0.
- Do not stage excludedDirtyPaths unless Frank explicitly expands the release scope.
- Do not push or open a ready PR until local app gates pass after staging.
- Do not create or promote a production deployment until Vercel framework, Node runtime, domain, and live-state blockers are resolved.
- Do not add Workflow or Eve runtime code in this package without installed dependencies and bundled docs.

## After Staging

```text
git diff --cached --name-only
git status --short
corepack pnpm --dir apps/web type-check
corepack pnpm --dir apps/web test:projects
corepack pnpm --dir apps/web build
node scripts/arcanea-success-metrics-audit.mjs --strict
node scripts/arcanea-durable-workflow-readiness.mjs --strict
node scripts/arcanea-release-readiness.mjs --strict
```

## Queen Handoff

- Lane: Vercel/Product Engineer.
- Objective: create one draft PR from the scoped God Mode slice, then verify exactly one preview after Vercel project settings are repaired or a preview-only exception is approved.
- Risk gate: excluded package/lock/campaign files remain dirty and must stay out of this release unless Frank expands scope.
- Handoff format: attach this plan, the release-readiness report, and the Vercel remediation packet.
