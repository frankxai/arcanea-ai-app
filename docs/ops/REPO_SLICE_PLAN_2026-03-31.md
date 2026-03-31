# Repo Slice Plan - 2026-03-31

## Purpose

Convert the current dirty Arcanea repo constellation into intentional commit slices instead of leaving the control plane in an ambiguous degraded state.

## Current condition

- Machine readiness: `READY`
- Deep repo health: smoke green, but control plane still degraded by dirty worktrees
- Repaired workspace:
  - `C:\Users\frank\Arcanea-integration-review`
- Preserved orphaned folder:
  - `C:\Users\frank\Arcanea-integration-review-orphaned-2026-03-31`

## Recommended commit order

### Slice 1: Machine and control-plane recovery

Scope:

- restart handoff docs
- machine readiness checker
- repo registry and integration map
- local PowerShell wrappers

Main repo paths:

- `.arcanea/projects/repo-constellation.json`
- `.arcanea/scripts/arcanea-flow.ps1`
- `.arcanea/scripts/arcanea-flow-mcp.ps1`
- `.arcanea/scripts/arcanea-orchestrator.ps1`
- `docs/ops/ARCANEA_PLATFORM_HANDOFF_2026-03-31.md`
- `docs/ops/REPO_SLICE_PLAN_2026-03-31.md`
- `scripts/machine-readiness-check.js`
- `package.json`
- `docs/technical/ARCANEA_INTEGRATION_MAP.md`

Keep out of this slice:

- unrelated web app work
- `.tmp/`
- session dump files unless intentionally publishing them

### Slice 2: Arcanea Orchestrator productization

Repo:

- `arcanea-orchestrator`

Paths:

- `agent-orchestrator.yaml.example`
- `package.json`
- `packages/cli/src/index.ts`
- `packages/cli/src/lib/config-instruction.ts`

Keep out:

- `packages/web/dist-server/` generated output unless intentionally needed
- local-only `agent-orchestrator.yaml`

### Slice 3: Arcanea Flow delegation layer

Repo:

- `arcanea-flow`

Focus:

- local CLI entrypoint and shell behavior
- `ao` bridge
- Arcanea-facing help/config paths

Keep out:

- broad upstream sync work
- any speculative `@claude-flow` retirement unless separately reviewed

### Slice 4: Oh My Arcanea operator layer

Repo:

- `oh-my-arcanea`

Focus:

- Arcanea branding
- installer/doctor/version/run path cleanup

### Slice 5: Harness repo cleanup

Repos:

- `arcanea-code`
- `arcanea-opencode`
- `claude-arcanea`
- `codex-arcanea`

Focus:

- packaging boundaries
- CLI naming and role clarity
- remove obvious product overlap

### Slice 6: Domain verticals

Repos:

- `arcanea-infogenius`
- `arcanea-onchain`

Focus:

- buildable state
- intentional feature deltas only

## Do not mix these together

- `apps/web` product work from the `Arcanea` main repo
- `Arcanea-integration-review` project-graph branch work
- generated build output
- local-only session notes
- orphaned recovered workspace contents

## Suggested verification per slice

### Control plane

```powershell
Set-Location C:\Users\frank\Arcanea
npm run ops:machine
node scripts/ops-health-check.js --quick --deep
```

### Arcanea Orchestrator

```powershell
Set-Location C:\Users\frank\Arcanea\arcanea-orchestrator
pnpm run build:bootstrap
node packages/cli/dist/index.js --help
node packages/cli/dist/index.js doctor --help
```

### Arcanea Flow

```powershell
Set-Location C:\Users\frank\Arcanea\arcanea-flow
npm run build
Set-Location C:\Users\frank\Arcanea
arcanea-flow ao --dry-run status
```

### Oh My Arcanea

```powershell
Set-Location C:\Users\frank\Arcanea\oh-my-arcanea
bun run src/cli/index.ts --help
```

## Immediate next action

Take Slice 1 first. It is the highest-leverage tranche because it preserves restartability, verifies the machine, and stabilizes the control plane before further repo cleanup.
