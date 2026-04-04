# Vibe OS Architecture Plan

Date: 2026-04-02
Owner: FrankX / Arcanea ecosystem
Status: Recommended direction

## Decision

Build `Vibe OS` as a standalone browser-based product in its own repo and app surface.

Do not build it:
- as a subfeature inside `ACOS`
- as a subfeature inside `Arcanea`
- as another parallel memory system

Use:
- `SIS / Starlight` as the canonical memory and intelligence substrate
- `ACOS` as the operator/admin workflow layer
- `Arcanea` as an optional thematic world, premium mode pack, and creative agent surface

## Why

`Vibe OS` is a user-facing behavioral operating system. Its core job is helping a person regulate state, choose the right mode, plan the day, and enter the right flow for a project. That is a distinct product boundary.

If it lives inside `ACOS`, the product becomes too operator-centric.

If it lives inside `Arcanea`, the product becomes too mythic and brand-specific at the foundation.

If it invents its own memory stack, the ecosystem becomes fragmented and harder to maintain.

The clean architecture is:

```text
SIS / Starlight
  Canonical memory, evals, vaults, personal patterns

ACOS
  Admin workflows, prompt operations, agent coordination, content operations

Arcanea
  Mythic mode pack, themed agents, premium identity layer

Vibe OS
  Standalone app for state planning, rituals, modes, and project-specific operating systems
```

## Product Thesis

Vibe OS is not a todo app with aesthetics.

It is:
- a state-based planner
- a ritual and mode engine
- a project-aware daily operating system
- a memory-backed recommendation system
- a personal flow-state interface

Core idea:
- help Frank choose the right state
- for the right time of day
- for the right project
- using the right ritual, prompts, music, and environment

## Core Objects

The domain model should start with these objects:

1. `State`
- energy state
- mood state
- focus state
- social state
- recovery state

2. `Mode`
- morning
- focus
- training
- admin
- chill
- night
- travel
- recovery

3. `Ritual`
- startup routine
- shutdown routine
- deep work ignition
- workout prep
- music creation prep
- reflection / journaling

4. `Project OS`
- Arcanea Music Vibe OS
- GenCreator Vibe OS
- FrankX Website Vibe OS
- Health / Training Vibe OS

5. `Session`
- planned session
- active session
- completed session
- reflection and learnings

6. `Prompt Pack`
- prompts by mode
- prompts by project
- prompts by state transition

7. `Library Asset`
- music references
- songs
- playlists
- visuals
- links
- notes

## SIS / Starlight Integration

Use `~/.starlight` as canonical memory.

Do not create a new Vibe OS-specific memory backend if SIS already owns the persistence layer.

Recommended vault usage:

- `strategic`
  - long-term goals
  - weekly priorities
  - project operating rules
  - life direction decisions

- `operational`
  - daily check-ins
  - current energy and readiness
  - session logs
  - what worked today
  - state transition observations

- `creative`
  - music mood boards
  - prompt packs
  - aesthetic recipes
  - flow and writing rituals
  - Arcanea Music and GenCreator patterns

- `wisdom`
  - distilled truths about what actually works for Frank
  - anti-patterns
  - best practices by mode and season

- `horizon`
  - identity commitments
  - human values
  - long-range vision
  - life operating principles

## Dedicated Vibe OS Data Layers

On top of SIS, Vibe OS should maintain app-native structured entities:

- `modes`
- `rituals`
- `state-presets`
- `project-os-presets`
- `prompt-packs`
- `session-templates`
- `asset-links`

These can be stored in app data, but their durable learnings should still write back into SIS.

## Song Library And Prompt System

Your song library being in markdown today is fine as source material, but it should not remain the long-term application model.

Recommended migration path:

1. Treat existing markdown song library files as import sources.
2. Parse them into normalized entities:
   - song
   - project
   - mood
   - sonic palette
   - lyrical concept
   - prompt references
3. Store the normalized catalog in Vibe OS.
4. Write durable creative learnings back to SIS `creative` and `wisdom`.

The same applies to prompt spreadsheets and Excel-style catalogs:
- keep spreadsheet import/export support
- but move the primary runtime model to structured app entities

## Agent Model

Vibe OS should not start with a giant swarm.

Start with a minimal council:

1. `Planner`
- day planning
- sequencing
- priorities

2. `State Coach`
- mode selection
- state diagnosis
- transition support

3. `Creative Director`
- music / prompt / aesthetic flow
- project-specific vibe systems

4. `Archivist`
- vault writes
- reflection capture
- pattern extraction

5. `Operator`
- import/export
- spreadsheet links
- system sync

Arcanea-themed agents can later wrap or skin these roles.

## UX Direction

The UX should revolve around state and mode first, not tasks first.

Main surfaces:

1. `Today`
- current state
- desired state
- top 1-3 outcomes
- recommended mode blocks

2. `Modes`
- morning
- focus
- training
- chill
- night
- custom project modes

3. `Projects`
- project-specific operating systems
- associated rituals, prompts, and assets

4. `Library`
- songs
- references
- prompts
- routines

5. `Reflection`
- what worked
- what drained energy
- what should be remembered

## Recommended Build Strategy

Phase 1:
- standalone web app
- manual mode and ritual planning
- SIS read integration
- simple reflection writeback

Phase 2:
- project-specific operating systems
- prompt library and song library imports
- state recommendations from SIS patterns

Phase 3:
- Arcanea mode packs
- agent support
- stronger automations
- personalized weekly adaptation

## Repo Boundary Recommendation

Create or use:
- `frankxai/vibe-os` as the product repo

Keep responsibilities separate:

- `vibe-os`
  - product UI
  - structured app entities
  - state engine
  - planning UX

- `starlight-intelligence-system`
  - memory
  - vaults
  - evals
  - pattern consolidation

- `Arcanea`
  - thematic overlays
  - premium experience
  - world and guardian surfaces

- `ACOS`
  - operator workflows
  - content admin
  - prompt and process management

## Next Implementation Step

Before building, inspect `frankxai/vibe-os` and answer:

1. Is it already positioned as product repo rather than note dump?
2. What stack is it using now?
3. Can it consume SIS via MCP or local bridge cleanly?
4. What should be imported first:
   - song library
   - prompt library
   - ritual presets
   - project modes

## Recommended First MVP

Build this first:

- web app
- login optional at start
- mode presets
- daily planner
- reflection capture
- SIS summary sidebar
- project-specific presets
- import from markdown for song library and prompt packs

That is enough to prove the product without overbuilding.
