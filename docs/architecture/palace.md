# Palace Architecture

Generated: 2026-06-12
Status: product architecture, not decorative lore

## Summary

The palace is Arcanea's spatial interface model for memory, projects, creations,
agents, and verticals. It should help creators and agents navigate the workspace
as a coherent place rather than a pile of pages.

The palace is valid only when each room maps to real data and action.

## Room Model

| Palace Room     | Product Surface            | Data It Must Show                         | Actions                     |
| :-------------- | :------------------------- | :---------------------------------------- | :-------------------------- |
| Hall            | Command center / dashboard | active projects, recent work, blockers    | resume, triage, dispatch    |
| Library         | books, docs, research      | authored texts, references, reading state | read, cite, continue        |
| Studio          | creation tools             | images, text, media, prompts, models      | create, revise, publish     |
| Memory Vault    | SIS memory                 | decisions, feedback, references, archives | search, promote, decay      |
| Graph Room      | project graph              | relationships, provenance, dependencies   | inspect, connect, activate  |
| Council Chamber | agents and workflows       | agents, task contracts, runs, reviews     | summon, assign, verify      |
| Marketplace     | skills, MCPs, plugins      | installable primitives and adapters       | browse, install, contribute |

## Product Rules

- A palace room is not a marketing page unless it performs a workspace action.
- Rooms must expose state, next action, and provenance.
- The same data should be available to agents through docs, MCP, or structured APIs.
- Visual style must follow `DESIGN.md`, `TASTE.md`, and `@arcanea/design-system`.
- Spatial metaphors must reduce navigation complexity, not hide it.

## Data Flow

```text
SIS memory + project graph + creations + docs
  -> Arcanea OS workspace services
  -> palace room views
  -> user actions and agent workflows
  -> provenance and memory writes
```

## Acceptance Criteria

The palace is ready for buildout when:

- every room has a data owner
- every room has at least one concrete action
- every action records provenance or updates project state
- the agent-readable map in `llms.txt` matches the user-facing structure
