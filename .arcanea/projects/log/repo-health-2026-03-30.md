# Repo Health Report

Date: 2026-03-30
Source:
- `node scripts/ops-health-check.js --quick`
- `node scripts/ops-health-check.js --quick --deep`

## Summary

- Ops health script now distinguishes standalone local clones from workspace modules inside the main `Arcanea` repo.
- Registry source of truth: `.arcanea/projects/repo-constellation.json`
- Overall system status: `DEGRADED`
- Repo constellation status: `19 total`, `9 ok`, `10 warn`, `0 error`
- Deep smoke status: `8 passed`, `0 failed`, `11 skipped`

## Healthy

- `arcanea-agents` as workspace module
- `arcanea-lore` as workspace module
- `arcanea-records` as workspace module
- `arcanea-soul` as workspace module
- `arcanea-companion` as workspace module
- `arcanea-library-superintelligence` as workspace module
- `arcanea-game-development` as workspace module
- `arcanea-claw` standalone clone
- `arcanea-mobile` standalone clone

## Current Warnings

- `arcanea`: dirty worktree
- `arcanea-code`: dirty worktree
- `oh-my-arcanea`: dirty worktree
- `arcanea-opencode`: dirty worktree
- `claude-arcanea`: dirty worktree
- `codex-arcanea`: dirty worktree
- `arcanea-ecosystem`: dirty worktree
- `arcanea-infogenius`: dirty worktree
- `arcanea-onchain`: dirty worktree
- `arcanea-flow`: dirty worktree, one commit behind `origin/main`, and still carries legacy `Claude Flow` wording in parts of the shipped CLI
- `arcanea-flow`: standalone build and CLI smoke now pass, but command help still contains legacy `Claude Flow` wording

## Deep Smoke Coverage

- `arcanea-code`: `bun run --cwd packages/opencode --conditions=browser src/index.ts --help`
- `oh-my-arcanea`: `bun run src/cli/index.ts --help`
- `arcanea-opencode`: `bun run build`
- `claude-arcanea`: `npm run build`
- `codex-arcanea`: `npm run build`
- `arcanea-flow`: `npm run build`
- `arcanea-onchain`: `npm run build`
- `arcanea-infogenius`: `npm --prefix mcp-server run build`

Deep smoke results on 2026-03-30:
- Passed: `arcanea-code`, `oh-my-arcanea`, `arcanea-opencode`, `claude-arcanea`, `codex-arcanea`, `arcanea-flow`, `arcanea-onchain`, `arcanea-infogenius`

## Meaning

- Most warnings are not breakage. They indicate local modifications or active development.
- The repo registry now prevents workspace modules from being misclassified as missing standalone clones.
- The main structural drift still exposed by the control plane is `arcanea-flow`, which now tracks the Arcanea repo correctly and builds as a standalone workspace, but still carries legacy `Claude Flow` identity in parts of the shipped command copy.

## Next Execution Targets

1. Complete the shipped `arcanea-flow` branding sweep so CLI help and command copy stop referring to `Claude Flow`.
2. Normalize dirty worktrees by repo: separate intentional local work from untracked setup/build residue.
3. Promote `ops:health:deep` / `ops:release-gate` into CI so the local control plane also gates merges and releases.
4. Feed this registry into future dashboards, eval reports, and release readiness checks.
