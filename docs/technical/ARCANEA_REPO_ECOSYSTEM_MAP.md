# Arcanea Repo Ecosystem Map

Last updated: 2026-03-27

## Canonical Control Plane

This repository is the control plane for Arcanea.

It owns:

- creator platform direction
- shared package architecture
- public messaging canon
- workflow governance
- ecosystem mapping

## Known Git Remotes In This Workspace

### `origin`

- URL: `https://github.com/frankxai/arcanea-ai-app.git`
- Likely role: product-facing app history or deployment-oriented repo
- Current guidance: treat as product-adjacent, not the architectural control plane unless explicitly declared elsewhere

### `oss`

- URL: `https://github.com/frankxai/arcanea.git`
- Likely role: public ecosystem monorepo and canonical developer entrypoint
- Current guidance: this should remain the most legible public control-plane surface

### `records`

- URL: `https://github.com/frankxai/arcanea-records.git`
- Likely role: records/media/community or product-adjacent satellite
- Current guidance: mark its sync relationship explicitly before automating against it

## Repo Strategy

Arcanea is using a many-focused-repos model, but the model currently risks split-brain.

The intended operating rule should be:

- this monorepo defines shared architecture and public platform story
- satellite repos exist for focused distribution, deployment, or packaging
- no satellite repo should imply it is canonical unless documented as such

## Required Metadata For Every Satellite Repo

Every public or active satellite repo should declare:

- audience
- purpose
- source of truth
- sync direction
- publish target
- owner
- status: active, mirrored, experimental, deprecated

## Package Groups In This Monorepo

### Core creator platform

- `apps/web`
- packages directly needed by the creator-facing experience

### Ecosystem/runtime packages

- AI, memory, protocol, auth, orchestration, and content packages

### Developer distribution surfaces

- MCP server
- CLI
- VS Code and overlay packages

### Experimental or archive candidates

- anything without a clear consumer, owner, or current build/release path

## Current Structural Risks

- 42 packages with uneven public purpose clarity
- public README and website story not fully aligned
- workflows reference apps and package names that do not match today’s workspace reality
- ecosystem sync logic exists without a fully documented canonical map

## Governance Rule

No workflow should sync, publish, or deploy a repo or package unless the ecosystem map explicitly lists:

- what it is
- why it exists
- where it ships
- who owns it
- what source controls truth
