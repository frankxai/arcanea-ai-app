# SIS Session Review And Community Experience - 2026-04-03

## What SIS Is

SIS is the local-first intelligence substrate behind Arcanea and related systems.

At its best, SIS gives you:

- durable memory across sessions
- one canonical place for agent memory
- typed records instead of only loose notes
- a repairable, inspectable filesystem-based substrate
- portability across tools and runtimes

Today the canonical home is:

- `C:\Users\frank\.starlight`

That is the source of truth.

Arcanea uses it.
OpenCode uses it.
Codex and Gemini can read it through MCP/configured integrations.
Legacy Arcanea memory surfaces can mirror it without owning truth.

## What We Have Built

### Canonical data layer

- JSONL vaults in `~/.starlight/vaults`
- typed entry families
- validation rules
- duplicate-id protection
- canonical append/read/stat helpers

### Runtime and protocol layer

- SIS bridge
- SIS MCP server
- legacy compatibility MCP
- validation and smoke checks
- Agent OS control-plane contracts

### Package layer

- reusable canonical SIS package surface in `starlight-intelligence-system`
- reusable MCP helpers
- CLI operator flows for canonical SIS

## Why It Is Valuable

Without SIS:

- local agent memory collapses back to process lifetime
- each tool tends to invent its own memory story
- continuity becomes fragile and duplicated
- operators lose trust because memory behavior feels random

With SIS:

- continuity survives process restarts
- multiple runtimes can converge on one substrate
- system behavior becomes inspectable and repairable
- memory can compound into a real operating advantage

## Engineering Judgment

The strongest engineering choices so far were:

1. Keep memory local-first and inspectable
2. Make `~/.starlight` canonical
3. Extract reusable substrate code into `starlight-intelligence-system`
4. Keep Arcanea as integration/adapters/operator surface
5. Use compatibility layers only where needed

The weaker alternatives would have been:

- making Supabase the only truth for every memory use case
- keeping old Arcanea local memory as canonical
- burying SIS inside one app repo forever
- forcing every runtime through one brittle orchestrator before the contracts were ready

## What The Community Experience Should Feel Like

For the community, SIS should feel:

- clear
- local-first
- empowering
- composable
- not over-engineered

The ideal flow for a community user is:

1. install the package
2. initialize a local Starlight home
3. validate that the vaults are healthy
4. append a few typed memories
5. inspect them through CLI or MCP
6. connect their editor/runtime of choice

They should understand:

- where the data lives
- how to back it up
- how to validate it
- how to migrate it
- how to connect it to a tool

## What Community Still Needs

### Docs

- a true getting-started guide
- a canonical vault protocol reference
- examples for coding agents, creator workflows, and personal systems
- migration guides from simpler note/memory setups

### Tooling

- thin wrappers for common runtimes
- better CLI ergonomics around filtering and typed writes
- importers for markdown and creator assets
- publishable package workflow

### Productization

- clearer boundaries between:
  - local operator memory
  - product/user memory
  - hosted continuity
- better bridges between SIS and Arcanea product surfaces

## What Future Agents Should Know

### Source of truth

- canonical SIS truth is `~/.starlight`
- package truth belongs in `starlight-intelligence-system`
- Arcanea should not become the permanent home of duplicated SIS internals

### Working rule

If a change is reusable and substrate-level, it probably belongs in:

- `starlight-intelligence-system`

If a change is machine-specific, launcher-specific, or app-integration-specific, it probably belongs in:

- `arcanea`

### Next highest-leverage work

1. make Arcanea SIS scripts thin adapters over the Starlight package
2. publish or prepare the package for broader use
3. build importers for creative and project knowledge
4. continue Vibe OS on top of typed SIS concepts

## What We Want This To Become

We are building more than a memory layer.

We are building:

- a creator intelligence substrate
- a continuity engine for human + agent work
- a protocol that can carry identity, memory, and purpose across tools
- a foundation for better community software, not just internal tooling

That means SIS should eventually support:

- individuals
- teams
- creators
- coding agents
- planning systems
- community rituals and knowledge flows

The system should feel like a calm, compounding layer beneath many experiences, not another noisy app demanding attention.
