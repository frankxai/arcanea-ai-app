# GitOps Cost Heal — 2026-08-26

## Contract

- Owner: Codex cost-governance lane
- Scope: web deploy, CI/quality workflows, root and `apps/web/` Vercel configs, and this receipt
- Non-goals: application behavior, lore, UI, native Vercel project/domain settings, and removal of merge-quality checks
- Acceptance: one automatic deploy path, no automatic duplicate web validation, ignored-build protection active, configuration parses, and existing CI remains unchanged
- Rollback: revert this change to restore automatic CLI deployment; remove `ignoreCommand` only if Vercel's project-level ignored-build setting replaces it

## Change

Vercel native Git integration remains the automatic preview/production deploy path. The GitHub CLI workflow is now a manual emergency route, so ordinary pushes and pull requests no longer spend roughly eight Actions minutes repeating install, build, Playwright browser installation, and smoke tests before its gated deploy jobs skip.

The repository's existing fail-open ignored-build script is now activated through both possible Vercel project-root configs. It always builds production, skips known bot/backup/docs branches and documentation-only commits, and builds whenever evidence is ambiguous.

The required `Build` context remains in `ci.yml`, but its dependency chain skips draft PR iterations and runs on `ready_for_review`. The separate heavy Quality Gate (E2E, Lighthouse, security, build) now runs once when a non-draft PR opens or a draft becomes ready, with manual reruns available. GitHub branch protection was verified to require `Build`, not the Quality Gate's `Production Build`/`Quality Status` contexts.

## Verification

- Parse `vercel.json` as JSON.
- Parse the workflow with a YAML parser where available and assert only `workflow_dispatch` remains.
- Run `bash scripts/vercel-ignore-build.sh` in a controlled Git context or inspect its existing tests/behavior.
- Confirm `.github/workflows/ci.yml` remains the automatic merge-quality gate.
