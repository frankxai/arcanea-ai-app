# Current Branch Audit - 2026-06-12

Generated from local refs after `git fetch --all --prune`.
Base for integration: `origin/main` at `c7af7cab`.

## Policy

Do not merge stale branch heads wholesale. Salvage intent by cherry-picking
small, reviewed commits onto a fresh branch from `origin/main`.

## Already Integrated In This Pass

| Branch                  | Commit     | Disposition                                         |
| :---------------------- | :--------- | :-------------------------------------------------- |
| `chore/models-opus-4-7` | `b5b580fa` | Cherry-picked one-line orchestrator CLI version fix |

The older model update commit on that branch was not cherry-picked because
`origin/main` already contains newer model-refresh work.

## Merged Or Duplicate Local Branches

These are reported as merged into `origin/main` or duplicate current main state.
They should not be re-merged.

| Branch                                        | Disposition                                                    |
| :-------------------------------------------- | :------------------------------------------------------------- |
| `main`                                        | Local branch is behind `origin/main`; update after integration |
| `chore/site-excellence-autonomous-2026-05-12` | Merged into current main; skip                                 |
| `worktree-agent-a655583c199bc0a3d`            | Merged into current main; skip                                 |

## Origin Branches To Treat As Follow-Up PRs

| Branch                                            | Last Subject                        | Disposition                                                               |
| :------------------------------------------------ | :---------------------------------- | :------------------------------------------------------------------------ |
| `origin/chore/ecosystem-weekly-refresh`           | weekly auto-refresh of derived.ts   | Inspect in a separate chore PR                                            |
| `origin/claude/chat-experience-enhancement-NJM8l` | chat retry/callback/preview fixes   | Likely superseded by later chat work; inspect before cherry-pick          |
| `origin/claude/ci-lighthouse-permissions`         | minimal GitHub token permissions    | Inspect against current action files                                      |
| `origin/claude/las-tierras-chapters-fix-gGgnZ`    | Las Tierras description/routes      | Inspect against current book routes                                       |
| `origin/claude/terras-luz-mature-version-gGgnZ`   | review cleanup                      | Inspect against current forge/book state                                  |
| `origin/feat/ecosystem-foundation`                | ecosystem foundation                | Likely already re-landed in `origin/main`; skip unless diff proves unique |
| `origin/fix/deploy-skip-without-vercel-token`     | same ecosystem commit as foundation | Duplicate; skip                                                           |
| `origin/fix/vercel-buildcommand-2026-05-07`       | Vercel buildCommand fix             | Inspect against current Vercel config                                     |
| `origin/staging/madrid-2026-05-25`                | staged WIP                          | Do not merge wholesale; audit file-by-file                                |

## Dependabot Branches

| Branch                                                               | Disposition                                                             |
| :------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| `origin/dependabot/github_actions/github/codeql-action-4`            | Superseded by current actions v5 work unless CodeQL diff remains unique |
| `origin/dependabot/github_actions/peter-evans/create-pull-request-8` | Superseded or handle through dependency PR flow                         |
| `origin/dependabot/npm_and_yarn/dev-patches-5d52197678`              | Handle through dependency PR flow                                       |
| `origin/dependabot/npm_and_yarn/production-minors-4cc8d0ee7b`        | Handle through dependency PR flow                                       |
| `origin/dependabot/npm_and_yarn/production-patches-126f1244fd`       | Handle through dependency PR flow                                       |

## Local Stale Branches To Audit Before Archive

These local branches are older than the current main integration window. They
may contain useful intent, but should not be merged directly.

| Group            | Branches                                                                                                                                                                       | Disposition                                                       |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| Voice/cognition  | `backup/chore-second-brain-pre-canonical`, `backup/voice-dashboard-2.0-pre-canonical`, `feat/cockpit-2026-05-05`, `feat/cognition-bridge-room`, `feat/jarvis-tools-2026-05-05` | Compare against current voice/SIS architecture before porting     |
| Skills/agents    | `chore/skill-registry-cleanup-2026-04-21`, `feat/ao-meta-dispatcher-2026-04-21`, `feat/library-os-fantasy`, `feat/multi-luminor-sprint`                                        | Salvage docs/scripts only if still aligned with AGENTS.md         |
| Author/books     | `feat/author-council-2026-04-21`, `feat/author-council-wiring`, `feat/author-taste-gate-2026-04-19`, `feat/las-tierras-*`, `feat/publish-taste-gate-2026-04-19`                | Inspect by book/package; avoid overwriting later book work        |
| CI/deploy        | `ci/safety-gates-2026-05-07`, `fix/ci-*`, `fix/vercel-*`, `ops/ci-typecheck-blocking`                                                                                          | Compare against current workflows after actions v5 bump           |
| Type/build fixes | `fix/transpile-publishing-house-2026-04-19`, `fix/ts-errors-*`                                                                                                                 | Likely superseded; cherry-pick only if current verification fails |
| Docs/handoffs    | `docs/*`, `docs/overnight-audit-extras-2026-05-07`                                                                                                                             | Convert valuable conclusions into planning files, not code merges |
| Design           | `feat/design-excellence`, `worktree-design-evolution`                                                                                                                          | Requires DESIGN.md/TASTE.md review before porting                 |
| Staging          | `staging/madrid-2026-05-25`                                                                                                                                                    | WIP branch; audit file-by-file only                               |

## OSS Remote Branches

The `oss/*` remote is a separate public/open-source lineage. Do not merge it
into the private product main without a dedicated reconciliation plan.

Notable refs:

- `oss/main`
- `oss/master`
- `oss/local-work-sync`
- `oss/feature/acos-ultraworld`
- `oss/wave4-runtime-intelligence`
- `oss/cursor/critical-bug-investigation-defb`
- `oss/cursor/setup-dev-environment-64b8`

## Next Actions

1. Finish verification on `integrate/agent-native-main-2026-06-12`.
2. Update local `main` only after the integration branch is green.
3. For each follow-up branch, run:

```bash
git diff --name-status origin/main...<branch>
git log --oneline origin/main..<branch>
```

4. Open narrow PRs by subsystem instead of stacking all branch salvage into one
   merge.
