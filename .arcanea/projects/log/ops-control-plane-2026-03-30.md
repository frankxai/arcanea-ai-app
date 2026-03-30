# Arcanea Ops Control Plane

Date: 2026-03-30
Owner: Arcanea core
Status: Active execution model

## Purpose

Arcanea is no longer a single app. It is a product plane, multiple execution planes, a package surface, an agent fabric, and a future community contribution economy. The control problem is no longer "build features" but "coordinate a living system without fragmentation."

This document defines the operating model that keeps the system coherent.

## Control Plane

The control plane lives in the main monorepo:

- `.arcanea/MASTER_PLAN.md` is the single source of truth for strategic state.
- `docs/technical/ARCANEA_INTEGRATION_MAP.md` is the topology map for repos, packages, and runtime relationships.
- `.arcanea/projects/log/` records operational decisions and audits.
- `.arcanea/projects/milestones/` carries milestone-level execution state.

Nothing else should become a competing source of truth. Other repos may carry local docs, but the canonical system map and execution priorities stay here.

## System Planes

### 1. Product Plane

This repo, `Arcanea`, is the product plane.

- Owns the web product, packages, docs, lore, strategy, and command center.
- Defines the public Arcanea experience and system architecture.
- Publishes the canonical standards for design, agentic engineering, MCPs, and community contribution.

### 2. Execution Planes

Execution planes are the coding surfaces and harnesses:

- `arcanea-code`: primary Arcanea coding CLI and OpenCode-derived execution surface
- `oh-my-arcanea`: Arcanea overlay and multi-agent harness for OpenCode
- `claude-arcanea`: Claude-specific Arcanea execution surface
- `codex-arcanea`: Codex-specific Arcanea execution surface
- `arcanea-opencode`: Arcanea Intelligence OS command layer and Guardian interface

These repos should not each invent their own worldview. They consume the control plane and specialize execution.

### 3. Distribution Plane

The distribution plane is what outside users and outside agents install:

- `@arcanea/*` npm packages
- MCP servers such as `arcanea-mcp` and `memory-mcp`
- skill packages and `.arcanea/skills/`
- future Academy certification assets

### 4. Learning Plane

Arcanea Academy must be dual-use:

- humans learn world-building, systems thinking, creative AI practice, and contribution paths
- agents learn execution standards, tool use, eval expectations, and specialization

The Academy becomes the evaluation and certification layer for both.

## Repo Interconnection Rules

1. The product plane defines standards.
2. Execution planes import standards and state. They do not fork them.
3. Shared state should flow through stable artifacts:
   - `.arcanea/*`
   - `docs/technical/ARCANEA_INTEGRATION_MAP.md`
   - shared package interfaces
   - stable runtime state files such as `/tmp/arcanea-*` where needed
4. Cross-repo changes should be driven by explicit task contracts and generated backlog, not ad hoc memory.

## Agent Ops Standard

Arcanea agents need the same rigor as software systems.

Every substantial agent task should have:

- scope
- owner
- files or modules
- non-goals
- acceptance criteria
- verification command

Every agent output should be scored on:

- correctness
- completeness
- quality
- efficiency
- safety

This must feed a learning loop:

- corrections become patterns
- patterns update prompts, skills, and guards
- Academy certifications reflect proven capability, not claimed capability

## GitOps Standard

GitOps at Arcanea scale needs four layers:

### 1. Repo Registry

Maintain an authoritative list of active repos, owners, remotes, health, and release role.

### 2. Shared Quality Gate

Every active repo should converge on a minimal gate:

- install succeeds
- build succeeds
- typecheck succeeds
- key command help or smoke test succeeds

### 3. Dependency Awareness

Shared packages and harness repos should not silently drift. Changes to common interfaces should trigger downstream verification.

### 4. Release Train

Product releases, harness releases, and package releases should be visible from one dashboard instead of being scattered across repos.

## Command Surface

The local command surface should be deterministic and repo-backed:

- `arcanea` -> control plane and status entry
- `opencode` -> local `arcanea-code` source-backed entry
- `oh-my-arcanea` and `opencode-arcanea` -> local `oh-my-arcanea` CLI
- `arcanea-opencode` -> local `arcanea-opencode` CLI

The principle is simple: local commands should prefer local repos over stale global shims.

## Contribution and Community Model

Community scale only works if contribution is structured.

The future flow:

1. Discover Arcanea through product, docs, or Academy
2. Learn through Academy tracks
3. Use commands, skills, packages, and MCPs
4. Customize worlds, skills, overlays, or agents
5. Contribute through gated PR and evaluation flow
6. Publish to marketplace or package surfaces
7. Monetize through premium skills, worlds, templates, or certified services

This only works if internal quality standards are already strong. Community amplifies system quality or system chaos. Nothing in between.

## Overnight Execution Backlog

### Track 1. Command Reliability

- keep repo-backed PowerShell launchers as the default
- remove stale reliance on `%AppData%\\npm` behavior
- add smoke tests for `arcanea`, `opencode`, `oh-my-arcanea`, `opencode-arcanea`, and `arcanea-opencode`

### Track 2. Repo Health

- audit install/build/typecheck for key execution repos
- fix workspace and package-name mismatches
- log repo health centrally

### Track 3. Shared Ops Artifacts

- formalize repo registry
- formalize active backlog generation
- formalize evaluation scorecards for agents and repos

### Track 4. Academy and Agent Eval

- define agent certification rubric
- map Gate progression to human and agent skill levels
- connect Academy progression to contribution privileges

### Track 5. Distribution

- identify what becomes package, what becomes MCP, what remains monorepo-only
- reduce duplication between repo docs and control-plane docs

## Immediate Next Files To Strengthen

- `.arcanea/MASTER_PLAN.md`
- `docs/technical/ARCANEA_INTEGRATION_MAP.md`
- `.arcanea/projects/log/`
- `scripts/` for repo-health and smoke checks
- future `arcanea-ops` registry artifact if split into its own repo later

## Principle

Arcanea should operate like a coherent intelligence system:

- one control plane
- many execution surfaces
- shared standards
- measurable learning
- deterministic commands
- publishable tools
- scalable contribution paths

That is the path from "many repos" to "one system."
