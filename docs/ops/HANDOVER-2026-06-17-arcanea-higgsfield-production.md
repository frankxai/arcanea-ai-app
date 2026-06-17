# Arcanea Higgsfield-Grade Production Handover

Date: 2026-06-17
Branch: `codex/arcanea-higgsfield-production`
Primary repo: `arcanea-ai-app`

## Intention

Ship Arcanea as a broad creative operating platform for writers, founders, game studios, music and video studios, worldbuilders, and agent-powered teams. The flagship promise should emerge through action: ask what someone is making, route them into a studio, and produce a connected artifact or workflow.

This release is not a Higgsfield clone. It absorbs the strongest product architecture patterns from the Higgsfield teardown and translates them into Arcanea's identity: living worlds, agent orchestration, IP systems, books, games, music, visuals, and MCP workflows.

## Implemented

- Added a shared studio platform shell for media-first studio experiences across games, music, cinema, canvas, and agent/MCP workflows.
- Added or upgraded route-level experiences for `/create`, `/games`, `/music-studio`, `/cinema-studio`, `/canvas`, `/apps`, and `/mcp`.
- Expanded homepage/navigation surfaces so the platform map is visible from the primary web experience.
- Added Canvas Flow Lab: recipe graph, studio lanes, model routing, workflow cards, and MCP export path.
- Added Apps production stacks: game prototype sprint, music release room, cinema trailer bench, and agent build system.
- Upgraded `@arcanea/mcp-server` from worldbuilding toolkit toward creative production layer with tools for worlds, books, games, music projects, cinematic scenes, asset briefs, context export, studios, and workflow recipes.
- Updated MCP docs and command-center UI for Claude, Codex, Cursor, and local MCP users.
- Expanded smoke tests for studio navigation, universal create modes, media/proof sections, Canvas graph, MCP command center, Canvas Flow Lab, and Apps production stacks.

## Higgsfield Patterns Absorbed

- Media-first cards and preview-led surfaces.
- Visual generation controls with visible production/cost language.
- `@asset` reference language for prompt workflows.
- History/community affordances as expected generation UI primitives.
- Canvas/node workflow framing for multi-model creative production.
- Apps/workflow directory structure instead of a loose tool list.
- MCP/CLI developer command center with direct copyable setup paths.

## Current Verification

- Local web proof has been run on `http://localhost:3001`.
- Type-check passed for `@arcanea/web`.
- Production build passed for `@arcanea/web` with placeholder public Supabase envs.
- MCP package build passed after adding production tools.
- MCP tests passed: 354 tests, 0 failures.
- Playwright smoke suite contains 13 smoke tests. Local execution was blocked because the Windows Playwright cache was missing the Chromium headless-shell executable and `playwright install chromium` timed out locally, but the GitHub `E2E Smoke` job passed on PR #164.
- Browser verification passed for `/`, `/create`, `/studio`, `/worlds`, `/games`, `/music-studio`, `/cinema-studio`, `/canvas`, `/apps`, and `/mcp`, including expected text, no error boundary, and no failed loaded images.
- Vercel preview deployment completed on PR #164.
- Security audit high/critical gate was fixed by moving pnpm override settings into `pnpm-workspace.yaml`, updating the existing package override block, and refreshing `pnpm-lock.yaml`; remaining low/moderate advisories are informational under the current CI gate.

## Production Path

Localhost is not production. These changes become the Vercel site only after the branch is pushed, the PR is opened against `main`, CI passes, and the repo's Vercel integration deploys the merged commit to `arcanea.ai`.

Known production constraints:

- This checkout is not locally linked to Vercel; `.vercel/project.json` is absent.
- Vercel CLI is not installed on PATH locally.
- `.github/workflows/deploy-web.yml` already validates web changes and can deploy through Vercel when repo variables/secrets are configured.
- CLI-driven Vercel deploy requires `VERCEL_TOKEN` and `HAS_VERCEL_TOKEN=true`; otherwise deployment depends on the Vercel GitHub integration.

## Remaining Work

- PR #164 is open against `main` and marked ready for review.
- CodeQL currently fails because repository code scanning is not enabled or lacks the required GitHub `security-events` permission; this is a repo configuration blocker, not an application failure from this release.
- Wait for rerun CI after the security/empty-catch fix commit, then merge only after required checks and production readiness are clear.
- After merge, verify `https://arcanea.ai`, `/create`, `/apps`, `/canvas`, `/mcp`, and `/api/health`.

## Second-Wave Repo Reconciliation

After `arcanea-ai-app` is safely live, reconcile supporting Arcanea repos with their own PRs:

- `arcanea-agent-skills`: dirty `skills/arcanea-world-build/SKILL.md` on `codex/world-engine-docs`.
- `arcanea-claw`: dirty `README.md` on `codex/world-engine-docs`.
- `arcanea-orchestrator`: dirty `README.md` plus local `.worktrees/` on `codex/world-engine-docs`.
- `arcanea-studio`: dirty `README.md` on `codex/world-engine-docs`.
- `arcanea-ecosystem`: dirty `design.md`, `.worktrees/`, and `HANDOVER-SESSION.md` on `master`.

## Product Guardrails

- Keep the platform broad; do not collapse it into a founder-only cockpit.
- Avoid live support, legal-advice, or done-for-you operations promises.
- Prefer self-serve docs, examples, async issue channels, MCP workflows, and gated hosted automation.
- Keep the experience beautiful, but make it useful first: route people into making worlds, books, games, music, video, campaigns, canvases, and agent workflows.
