# Arcanea God Mode Release Package Plan

Generated: 2026-07-05T13:49:36.125Z
Decision: stage-plan-ready
Repo: `C:\Users\frank\starlight\repos\arcanea-ai-app`
Current HEAD: `97d3379b89848bf6b1996b96342f96d215f7a3fe`

## Summary

- Dirty paths: 5
- Included God Mode paths: 0
- Excluded dirty paths: 5
- Unknown dirty paths: 0
- Planned git add targets: 0
- Planner checks: 4 pass, 3 warn, 0 blockers
- Preview/production: still blocked until the release-readiness gate and Vercel project/domain drift are resolved.

## Stage Commands

These commands are generated for a release operator. This script did not run them.

```text
# No scoped staging targets are currently needed.
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
- WARN [release/stage-command-ready] No scoped git add targets are currently needed.
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
