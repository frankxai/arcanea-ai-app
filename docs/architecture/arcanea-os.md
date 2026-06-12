# Arcanea OS Architecture

Generated: 2026-06-12
Status: current execution map

## Summary

Arcanea OS is the product shell that turns creative work into persistent,
auditable systems. It coordinates projects, docs, creations, memory, provenance,
project graph context, workflows, and agent execution.

SIS is the continuity substrate. Arcanea OS is the workspace layer above it.

## Layer Model

| Layer            | Owner                                                                      | Purpose                                                                     |
| :--------------- | :------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| Public app       | `apps/web`                                                                 | Creator-facing workspace, pages, chat, media, library, and product surfaces |
| OS packages      | `packages/os`, `packages/orchestrator`, `packages/flow-engine`             | Workflows, routing, execution, and operating primitives                     |
| Agent layer      | `.arcanea/agents`, `packages/agent-registry`, `packages/swarm-coordinator` | Specialist agents, model routing, dispatch, and verification contracts      |
| Continuity       | SIS bridge scripts and memory packages                                     | Session memory, decisions, handoffs, context bridges, and durable state     |
| Design authority | `DESIGN.md`, `TASTE.md`, `packages/design-system`                          | Visual tokens, brand kits, motion, and curatorial quality                   |

## Canonical Capabilities

- Projects: named work contexts with docs, creations, history, and graph links.
- Docs: durable planning, specs, research, architecture, and operating records.
- Creations: generated or authored artifacts with source, model, and workflow context.
- Memory: decision, feedback, reference, and project records with decay rules.
- Provenance: traceable source inputs, generation settings, ownership, and revision history.
- Project graph: typed relationships between people, projects, artifacts, agents, and workflows.
- Workflow orchestration: repeatable task contracts, model routing, verification, and rollback.

## Interfaces

- Public README: human and agent orientation.
- `AGENTS.md`: operational law for coding agents.
- `llms.txt`: agent-readable repository map.
- MCP packages: tool, prompt, and resource surfaces for external clients.
- SIS scripts: context sync, memory writes, schema checks, and contract checks.
- Planning files: execution control plane and current state.

## Implementation Rules

- SIS owns continuity. New memory work must integrate with SIS or document why it is legacy.
- App UI starts from `@arcanea/design-system` tokens and brand kits.
- Public product language should lead with workspace value before lore.
- Lore and palace vocabulary must map to real product behavior.
- Every substantial slice needs a task contract and verification command.

## Acceptance Criteria

Arcanea OS is healthy when:

- a project can be resumed with memory, docs, creations, and graph context intact
- an agent can read `AGENTS.md` and `llms.txt` and find the correct work surface
- a workflow records what happened, why, who/what executed it, and how to verify it
- public docs describe actual capabilities without overclaiming unfinished layers
