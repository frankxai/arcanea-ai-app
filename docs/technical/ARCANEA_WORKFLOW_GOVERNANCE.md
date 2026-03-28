# Arcanea Workflow Governance

Last updated: 2026-03-27

## Goal

Workflows should reflect the real workspace, not historical intent.

## Active Workflow Categories

Arcanea should converge on five workflow categories only:

- platform quality gate
- packages CI
- release and publish
- deployment
- cross-repo sync

Current canonical workflows in this workspace:

- `quality-gate.yml` for the `apps/web` release gate
- `packages-ci.yml` for package validation
- `deploy-web.yml` for Vercel deployment of `apps/web`

## Governance Rules

### 1. Reality over aspiration

If a workflow references an app, package, or repo that is not active in the workspace, quarantine it instead of letting it run automatically.

### 2. Canonical ownership first

No sync workflow should run unless the source repo, destination repo, and sync direction are documented in the repo ecosystem map.

### 3. Fail loudly on critical automation

Critical sync and publish paths should not hide behind broad `continue-on-error` defaults.

### 4. One workflow per responsibility

Avoid overlapping workflows that all lint, build, or deploy the same surface with different assumptions.

## Current Quarantined Workflows

- `deploy-apps.yml`
- `cross-repo-sync.yml`
- `sync-packages.yml`
- `mvp-deploy.yml`
- `test.yml`

Why:

- `deploy-apps.yml`, `cross-repo-sync.yml`, and `sync-packages.yml` reference historical multi-app or multi-repo assumptions that do not line up with the current workspace and package naming.
- `mvp-deploy.yml` mixed quality checks, deployment, rollback, and incident creation in one legacy path with assumptions that diverged from the canonical `apps/web` gate.
- `test.yml` overlapped with `packages-ci.yml` and created a second package-validation path with different assumptions and filters.

## Re-enable Checklist

Before any quarantined workflow is reactivated:

- confirm target app or package exists
- confirm package names and filters are current
- confirm destination repo still exists and is intended
- confirm secrets and deployment targets are valid
- add an owner and purpose note at the top of the workflow
