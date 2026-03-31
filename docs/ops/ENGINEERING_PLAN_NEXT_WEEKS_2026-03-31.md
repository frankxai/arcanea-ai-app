# Engineering Plan - Next Weeks - 2026-03-31

## Purpose

This plan turns the current Arcanea codebase constellation into an engineering program for the next 2 to 4 weeks.

It is grounded in:

- the current repo map in `docs/technical/ARCANEA_INTEGRATION_MAP.md`
- the live repo registry in `.arcanea/projects/repo-constellation.json`
- the repaired machine/workspace state
- the current slice discipline in `docs/ops/REPO_SLICE_PLAN_2026-03-31.md`

## Strategic objective

Build Arcanea as a coherent engineering platform with four connected layers:

1. Platform control plane
2. Multi-agent orchestration and execution
3. Product surfaces and community-facing UX
4. Lore, records, and canonical world continuity

The mistake to avoid is treating these as separate projects. They should share one operating model.

## Operating model

### Layer 1: Control plane

Owned in:

- `C:\Users\frank\Arcanea`

Responsibilities:

- repo health
- machine readiness
- handoff and recovery
- platform docs
- integration map
- MCP and hook configuration

### Layer 2: Orchestration

Owned in:

- `C:\Users\frank\Arcanea\arcanea-flow`
- `C:\Users\frank\Arcanea\arcanea-orchestrator`

Responsibilities:

- deciding how work should be delegated
- spawning and tracking multi-agent work
- worktree isolation
- review/status/send/verify loops

### Layer 3: Coding runtimes and harnesses

Owned in:

- `C:\Users\frank\Arcanea\arcanea-code`
- `C:\Users\frank\Arcanea\oh-my-arcanea`
- `C:\Users\frank\Arcanea\claude-arcanea`
- `C:\Users\frank\Arcanea\codex-arcanea`

Responsibilities:

- actual coding runtime behavior
- overlays, hooks, prompt discipline
- runtime-specific UX

### Layer 4: Product and world system

Owned in:

- `C:\Users\frank\Arcanea`
- `C:\Users\frank\Arcanea\arcanea-infogenius`
- `C:\Users\frank\Arcanea\arcanea-onchain`
- workspace modules for lore, records, soul, companion, library

Responsibilities:

- user-facing value
- visual systems
- records and memory
- worldbuilding continuity
- monetizable assets and experiences

## Principles for the next weeks

1. Do not let repo sprawl outrun control-plane quality.
2. Every standalone repo must have a clear product role or compatibility role.
3. Every orchestration layer must have a clear boundary:
   - `arcanea-flow` decides
   - `ao` executes
4. Lore must map to real product structure, not decorative naming only.
5. Commit and ship in slices, never giant mixed-state dumps.

## Week 1: Stabilize the engineering substrate

### Goal

Make the system restartable, inspectable, and delegatable without relying on memory.

### Workstreams

#### A. Control-plane slice cleanup

Main repo:

- commit Slice 1 from `docs/ops/REPO_SLICE_PLAN_2026-03-31.md`
- keep out unrelated web UI work
- leave `.tmp/` and session residue uncommitted

Acceptance:

- `npm run ops:machine`
- `node scripts/ops-health-check.js --quick --deep`

#### B. Arcanea Orchestrator operational readiness

Repo:

- `arcanea-orchestrator`

Deliver:

- keep current Arcanea CLI/help/config surface
- add one Arcanea-specific quickstart section to README
- make it obvious where config must live and how to start a project
- verify `ao doctor`, `ao start`, `ao status`, `ao dashboard`

Acceptance:

- `pnpm run build:bootstrap`
- `node packages/cli/dist/index.js --help`
- `node packages/cli/dist/index.js doctor --help`

#### C. Arcanea Flow delegation discipline

Repo:

- `arcanea-flow`

Deliver:

- keep `ao` bridge clean and stable
- ensure help examples are Arcanea-oriented
- avoid broad upstream sync in this week

Acceptance:

- `npm run build`
- `arcanea-flow ao --dry-run status`

### Expected output

- restart-safe machine
- working orchestrator backend
- working flow-to-orchestrator delegation
- first clean commit slices landed

## Week 2: Build the visual ops surface

### Goal

Create a visual control view of repo health, active work, worktrees, and orchestration state.

### Why this matters

Right now the system is real but cognitively expensive. You can operate it, but you cannot see it at a glance.

### Build target

Inside the main repo:

- create an internal ops dashboard page
- display:
  - repo constellation from `.arcanea/projects/repo-constellation.json`
  - machine readiness from `scripts/machine-readiness-check.js`
  - deep health status from `scripts/ops-health-check.js`
  - worktrees and branch state
  - `ao` session and project status if available

### Product shape

Sections:

- Repos
- Worktrees
- Sessions
- Smoke checks
- Dirty state
- Priority slices

### Acceptance

- one internal page renders real local or cached status
- it is usable as the default operator overview

## Week 3: Rationalize the runtime portfolio

### Goal

Clean the product boundaries between runtime repos.

### Focus

#### Arcanea runtime family

- `arcanea-code`
- `oh-my-arcanea`
- `arcanea-opencode`
- `claude-arcanea`
- `codex-arcanea`

### Questions to settle

- which repo is a product
- which repo is a compatibility layer
- which repo owns which command surface
- which repo should publish or stay internal

### Engineering actions

- remove cross-product command confusion
- reduce duplicate branding paths
- decide whether `codex-arcanea` remains a library-style harness or grows into a stronger CLI
- keep `arcanea-opencode` explicitly legacy if retained

### Acceptance

- one short architecture decision note per runtime repo
- clearer packaging boundaries
- reduced overlap in commands and README claims

## Week 4: Product value and world continuity

### Goal

Connect platform engineering to what users eventually buy, use, and remember.

### Streams

#### A. Arcanea Academy and agents

- define how agents learn
- define what “academy” means in product UX
- map guardian and academy structure to real workflows

#### B. Infogenius and Claw

- turn visual intelligence into reusable product capability
- use for operator dashboards, explainers, and premium artifacts

#### C. Records and lore continuity

- make records canonical and machine-readable
- ensure world naming and product naming evolve together

#### D. Economic layer

- keep `arcanea-onchain` practical
- use it only where it adds real product leverage

## Specific engineering backlogs by repo

### Main Arcanea repo

Backlog:

- commit control-plane recovery slice
- add internal ops dashboard
- keep project-graph work isolated in `Arcanea-integration-review`
- avoid mixing product work with control-plane work

### arcanea-orchestrator

Backlog:

- finish Arcanea quickstart docs
- solve Windows terminal stack
- determine whether to keep upstream package names internally for now
- expose clearer project/session dashboard usage

### arcanea-flow

Backlog:

- keep `ao` bridge stable
- sweep remaining visible legacy copy
- decide how much of `@claude-flow` stays as compatibility layer

### oh-my-arcanea

Backlog:

- complete branding/doctor/installer cleanup
- keep operator ergonomics strong

### arcanea-code

Backlog:

- keep flagship engine buildable
- clarify product naming vs `opencode`
- preserve clean upstream sync strategy

### arcanea-infogenius

Backlog:

- use as the visual systems engine for ops and product explainers

### arcanea-onchain

Backlog:

- only continue features that connect to real product value

## Suggested weekly cadence

### Monday

- machine and repo checks
- pick the week’s slices
- verify orchestrator readiness

### Tuesday to Thursday

- execute 1 to 2 slices only
- keep runtime and product work separate
- verify each slice before moving on

### Friday

- run deep health
- update handoff
- update records
- decide next week from actual state, not ambition alone

## Commands to anchor the cadence

### Start of week

```powershell
Set-Location C:\Users\frank\Arcanea
npm run ops:machine
node scripts/ops-health-check.js --quick --deep
```

### Orchestration layer

```powershell
Set-Location C:\Users\frank\Arcanea\arcanea-orchestrator
ao doctor
ao status
```

### Flow delegation

```powershell
Set-Location C:\Users\frank\Arcanea
arcanea-flow ao --dry-run status
```

### Project branch

```powershell
Set-Location C:\Users\frank\Arcanea-integration-review
git status --short --branch
```

## Recommended immediate sequence

1. Commit control-plane Slice 1 in the main repo.
2. Commit Arcanea Orchestrator productization in its own repo.
3. Commit Arcanea Flow delegation changes in its own repo.
4. Build the internal visual ops page in the main repo.
5. Then rationalize runtime repo boundaries.

## Final standard

Success over the next weeks means:

- the repo constellation is visible and understandable
- multi-agent orchestration is real and repeatable
- restart and recovery are not fragile
- lore and engineering reinforce each other
- product work is not swallowed by ops chaos
