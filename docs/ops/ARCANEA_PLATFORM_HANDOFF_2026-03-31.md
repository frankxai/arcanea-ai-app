# Arcanea Platform Handoff - 2026-03-31

## Purpose

This file is the restart-safe operator handoff for the Arcanea platform, repo constellation, agent orchestration layer, and current build-out strategy.

Use this after reboot to resume Codex, Claude Code, and local repo work without re-discovering context.

## User directives captured

- Build the Arcanea repo constellation into real standalone systems.
- Fix broken local command surfaces and stop relying on stale global shims.
- Make `oh-my-arcanea`, `arcanea-flow`, and `arcanea-orchestrator` genuinely useful on this machine.
- Keep moving with massive execution, not just planning.
- Save prompts, repo state, worktree state, and restart commands into a durable file.
- Improve AI ops, Git ops, software DevOps, and the long-term Arcanea product and lore strategy.

## What was completed in this tranche

### Command surfaces fixed

- `arcanea` now resolves locally instead of failing on a missing script path.
- `oh-my-arcanea`, `opencode-arcanea`, `arcanea-opencode`, `arcanea-flow`, `arcanea-flow-mcp`, `ao`, and `arcanea-orchestrator` now resolve through repo-local PowerShell wrappers.
- `arcanea-flow` now points directly at its repo-local CLI entrypoint instead of a stale `node_modules/.bin` assumption.

### Standalone repos operationalized

- `oh-my-arcanea` cloned and built locally.
- `arcanea-orchestrator` promoted from satellite checkout to a real top-level repo at `C:\Users\frank\Arcanea\arcanea-orchestrator`.
- `arcanea-orchestrator` now has:
  - `origin = frankxai/arcanea-orchestrator`
  - `upstream = ComposioHQ/agent-orchestrator`
- `arcanea-flow` now has:
  - `origin = frankxai/arcanea-flow`
  - `legacy-fork = frankxai/claude-flow`
  - `upstream = ruvnet/claude-flow`

### Arcanea orchestrator layer

- Arcanea-branded the main `ao` CLI/help/config surface.
- Added Arcanea-ready config template and local config:
  - `arcanea-orchestrator/agent-orchestrator.yaml.example`
  - `arcanea-orchestrator/agent-orchestrator.yaml`
- Added a thin bridge from `arcanea-flow` to `ao` so Arcanea Flow can delegate worktree-heavy multi-agent execution instead of competing with it.

### Repo control plane

- Repo constellation is tracked in `.arcanea/projects/repo-constellation.json`.
- Deep smoke checks are wired through `scripts/ops-health-check.js`.
- `arcanea-orchestrator` is now included in the health gate and passes smoke checks.

## Current main repo state

- CWD: `C:\Users\frank\Arcanea`
- Branch: `main`
- Commit: `281cbc36d`
- Main repo working tree is dirty and should be treated as in-progress.

Main repo changes visible from `git status --short --branch`:

- Modified:
  - `.arcanea/projects/repo-constellation.json`
  - `.arcanea/scripts/arcanea-flow-mcp.ps1`
  - `.arcanea/scripts/arcanea-flow.ps1`
  - `book/universe/NAMING_GUIDE.md`
  - `docs/technical/ARCANEA_INTEGRATION_MAP.md`
  - `pnpm-lock.yaml`
- Untracked:
  - `.arcanea/agents/`
  - `.arcanea/scripts/arcanea-orchestrator.ps1`
  - `.tmp/`
  - `apps/web/app/command/agents/page.tsx`
  - `arcanea-orchestrator/`
  - `docs/ops/PROJECT_GRAPH_HANDOFF_2026-03-31.md`
  - `oh-my-arcanea/`
  - `oss/agents/`

## Current worktrees

From `git worktree list`:

- `C:\Users\frank\Arcanea` on `main`
- `C:\Users\frank\Arcanea-integration-review` on `testing/chat-project-workspaces`

### Worktree guidance

- `Arcanea` is the main control plane and platform trunk.
- `Arcanea-integration-review` is the active project-graph/product workspace branch and already has its own handoff:
  - `docs/ops/PROJECT_GRAPH_HANDOFF_2026-03-31.md`
- `Arcanea-integration-review` was repaired on `2026-03-31` as a real attached git worktree after an unrelated orphaned folder was found at that path.
- The orphaned pre-repair contents were preserved at:
  - `C:\Users\frank\Arcanea-integration-review-orphaned-2026-03-31`

## Current repo constellation status

Latest deep health check:

```powershell
node scripts/ops-health-check.js --quick --deep
```

Result summary:

- Overall: `DEGRADED`
- Repos: `20 total`
- Repo status: `9 ok`, `11 warn`, `0 error`
- Smoke commands: `12 passed`, `0 failed`, `11 skipped`
- Missing repos: `0`
- Main issue: dirty working trees across actively edited repos

### Repos touched and current state

#### Arcanea Platform

- Path: `C:\Users\frank\Arcanea`
- Branch: `main`
- Commit: `281cbc36d`
- Remotes:
  - `origin = frankxai/arcanea-ai-app`
  - `oss = frankxai/arcanea`
  - `records = frankxai/arcanea-records`
- Status: dirty

#### Arcanea Code

- Path: `C:\Users\frank\Arcanea\arcanea-code`
- Branch: `dev`
- Commit: `7832d1888`
- Remotes:
  - `origin = frankxai/arcanea-code`
  - `upstream = anomalyco/opencode`
- Status: dirty
- Smoke: passes `opencode --help` path from source

#### Oh My Arcanea

- Path: `C:\Users\frank\Arcanea\oh-my-arcanea`
- Branch: `dev`
- Commit: `11724964`
- Remote:
  - `origin = frankxai/oh-my-arcanea`
- Status: dirty
- Smoke: CLI help passes

#### Arcanea OpenCode Legacy Harness

- Path: `C:\Users\frank\Arcanea\arcanea-opencode`
- Branch: `dev`
- Commit: `f8bd506`
- Remote:
  - `origin = frankxai/arcanea-opencode`
- Status: dirty
- Smoke: build passes

#### Claude Arcanea

- Path: `C:\Users\frank\Arcanea\claude-arcanea`
- Branch: `master`
- Commit: `ac8f81e`
- Remote:
  - `origin = frankxai/claude-arcanea`
- Status: dirty
- Smoke: build passes

#### Codex Arcanea

- Path: `C:\Users\frank\Arcanea\codex-arcanea`
- Branch: `master`
- Commit: `c2fb363`
- Remote:
  - `origin = frankxai/codex-arcanea`
- Status: dirty
- Smoke: build passes

#### Arcanea Flow

- Path: `C:\Users\frank\Arcanea\arcanea-flow`
- Branch: `main`
- Commit: `0912ede53`
- Status: behind `origin/main` by 1 commit
- Remotes:
  - `origin = frankxai/arcanea-flow`
  - `legacy-fork = frankxai/claude-flow`
  - `upstream = ruvnet/claude-flow`
- Status: dirty
- Smoke: build passes
- Notes:
  - main CLI/help/config paths are Arcanea-oriented
  - compatibility layer still exists under `v3/@claude-flow`
  - `arcanea-flow ao` bridge works

#### Arcanea Orchestrator

- Path: `C:\Users\frank\Arcanea\arcanea-orchestrator`
- Branch: `main`
- Commit: `281d2c2f`
- Remotes:
  - `origin = frankxai/arcanea-orchestrator`
  - `upstream = ComposioHQ/agent-orchestrator`
- Status: dirty
- Smoke:
  - bootstrap build passes
  - `ao --help` passes
  - `ao doctor --help` passes
  - `ao start --help` passes
- Notes:
  - best used as the worktree-heavy execution substrate under Arcanea
  - not the top-level Arcanea control plane

#### Arcanea Infogenius

- Path: `C:\Users\frank\Arcanea\arcanea-infogenius`
- Branch: `main`
- Commit: `a87460e`
- Remote:
  - `origin = frankxai/arcanea-infogenius`
- Status: dirty
- Smoke: `mcp-server` build passes

#### Arcanea Onchain

- Path: `C:\Users\frank\Arcanea\arcanea-onchain`
- Branch: `main`
- Commit: `e6a2162`
- Remote:
  - `origin = frankxai/arcanea-onchain`
- Status: dirty
- Smoke: build passes

## Local runtime and active-agent caveat

The repo state does not reveal a trustworthy persisted list of the "6 active agents" mentioned before restart.

What is visible locally:

- Arcanea has many agent definition files under `.arcanea/agents/`
- `ao status` from the Arcanea root currently reports no initialized config/session context there
- Running processes show multiple `claude`, `codex`, and `node` processes, but that is not sufficient to safely reconstruct task ownership

Treat runtime agent assignment as non-authoritative after restart unless the relevant orchestrator session state is explicitly recovered.

## Commands to resume after restart

### First restore the PowerShell profile aliases

```powershell
. "C:\Users\frank\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
```

### Codex on the main Arcanea repo

```powershell
Set-Location C:\Users\frank\Arcanea
cda
```

### Claude Code on the main Arcanea repo

```powershell
Set-Location C:\Users\frank\Arcanea
cla
```

### Codex on the project-graph worktree

```powershell
Set-Location C:\Users\frank\Arcanea-integration-review
git checkout testing/chat-project-workspaces
cda
```

### Claude Code on the project-graph worktree

```powershell
Set-Location C:\Users\frank\Arcanea-integration-review
git checkout testing/chat-project-workspaces
cla
```

### Orchestrator quick check

```powershell
Set-Location C:\Users\frank\Arcanea\arcanea-orchestrator
ao --help
ao config-help
```

### Arcanea Flow to Orchestrator delegation check

```powershell
Set-Location C:\Users\frank\Arcanea
arcanea-flow ao --dry-run status
arcanea-flow bridge --dry-run start arcanea-code
```

## Prompt pickup commands

### Codex pickup

```powershell
Set-Location C:\Users\frank\Arcanea
cda "Read docs/ops/ARCANEA_PLATFORM_HANDOFF_2026-03-31.md and docs/ops/PROJECT_GRAPH_HANDOFF_2026-03-31.md. Reconstruct current repo constellation, worktree state, and next execution tranche. Priorities: 1. normalize dirty repos into intentional slices, 2. keep arcanea-flow and arcanea-orchestrator integration real, 3. preserve project-graph work in Arcanea-integration-review."
```

### Claude pickup

```powershell
Set-Location C:\Users\frank\Arcanea
cla "Read docs/ops/ARCANEA_PLATFORM_HANDOFF_2026-03-31.md and docs/ops/PROJECT_GRAPH_HANDOFF_2026-03-31.md. Resume the next highest-value execution tranche without redoing completed work."
```

## Recommended next execution tranche

### 1. Git hygiene and tranche discipline

- Separate intentional platform edits from generated output and local residue.
- Commit in slices:
  - repo-control-plane and wrappers
  - `arcanea-flow` bridge and shell entrypoints
  - `arcanea-orchestrator` branding and config
  - project-graph workspace work from the separate worktree
- Do not dump all dirty state into one giant commit.

### 2. AI ops

- Treat `arcanea-flow` as the Arcanea-native control plane.
- Treat `ao` as the execution substrate for:
  - batch agent spawn
  - project-targeted worktrees
  - review/status loops
  - session routing
- Add a standard operator pattern:
  - plan in Arcanea
  - delegate worktree-heavy execution to `ao`
  - record outputs back into `arcanea-records`

### 3. Git ops

- Promote health-check output into a commit/release gate, but only after dirty worktrees are normalized.
- Create a clean rule for each standalone repo:
  - canonical remote
  - upstream remote if forked
  - branch strategy
  - smoke command
- Avoid blind pulls from upstream forks with high divergence. Use selective import and explicit review.

### 4. Software DevOps

- Keep local wrapper-first execution for CLIs so the machine runs repo code, not stale global packages.
- Finish Windows terminal toolchain work for `arcanea-orchestrator` so `node-pty` functionality is reliable.
- Add a machine bootstrap check that validates:
  - Node, pnpm, npm, bun
  - profile aliases
  - CLI wrappers
  - MCP server availability
  - worktree readiness

### 5. Product and platform direction

- Arcanea should evolve as:
  - a creator-facing AI platform
  - a system of operator-quality agent tools
  - a lore-rich world and academy where agents learn and collaborate
- The strongest business strategy is not copying single-purpose AI apps. It is offering:
  - premium workflows
  - branded operator tools
  - agent templates and orchestration
  - creative worldbuilding and companion systems
  - community contribution paths across tools, lore, and assets

## Lore, story, and worldbuilding direction

Arcanea should not treat lore as decorative skin over tooling. The stronger approach is:

- the product system and the world model should reinforce each other
- guardian agents, academy flows, records, and rituals should map to real platform behavior
- naming should be consistent, memorable, and expandable across:
  - agents
  - guardians
  - tools
  - schools
  - protocols
  - economic systems

### Inspiration from Bethesda and Skyrim

What to absorb:

- world coherence over isolated gimmicks
- strong faction and place naming
- artifact, ritual, and institution layering
- systems that create player stories instead of only presenting authored lore

What not to absorb:

- generic fantasy naming without a product-system reason
- sprawling content without canonical governance

Best application for Arcanea:

- academy structure for agent learning paths
- factions or orders for operator specializations
- named artifacts for workflows, guardians, and protocols
- persistent records and history so actions feel canonical

## What success looks like next

- repo constellation is green except for intentional active feature branches
- `arcanea-flow` delegates to `ao` in a stable, repeatable way
- project workspaces remain real and verified in the integration-review worktree
- dirty state is converted into explicit reviewed slices
- Arcanea lore and product naming become one coherent expandable system instead of parallel tracks

## Minimal verification commands

```powershell
Set-Location C:\Users\frank\Arcanea
npm run ops:machine
node scripts/ops-health-check.js --quick --deep

Set-Location C:\Users\frank\Arcanea\arcanea-orchestrator
ao --help
ao config-help

Set-Location C:\Users\frank\Arcanea
arcanea-flow ao --dry-run status
```
