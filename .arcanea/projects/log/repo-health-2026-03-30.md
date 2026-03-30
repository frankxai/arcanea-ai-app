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
- Deep smoke status: `6 passed`, `2 failed`, `11 skipped`

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
- `arcanea-flow`: dirty worktree and remote drift (`origin` still points to `frankxai/claude-flow.git`)
- `arcanea-flow`: deep build currently fails
- `arcanea-infogenius`: deep MCP server build currently fails

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
- Passed: `arcanea-code`, `oh-my-arcanea`, `arcanea-opencode`, `claude-arcanea`, `codex-arcanea`, `arcanea-onchain`
- Failed: `arcanea-flow`, `arcanea-infogenius`

## Meaning

- Most warnings are not breakage. They indicate local modifications or active development.
- The repo registry now prevents workspace modules from being misclassified as missing standalone clones.
- The only structural drift exposed by the control plane is `arcanea-flow`, which still carries upstream `claude-flow` identity across git remote and internal references.

## Next Execution Targets

1. Decide whether `arcanea-flow` remains a branded fork of `claude-flow` or becomes a fully renamed Arcanea distribution.
2. Add an optional `--deep` mode to `scripts/ops-health-check.js` for smoke commands on key repos.
3. Normalize dirty worktrees by repo: separate intentional local work from untracked setup/build residue.
4. Feed this registry into future dashboards, eval reports, and release readiness checks.
