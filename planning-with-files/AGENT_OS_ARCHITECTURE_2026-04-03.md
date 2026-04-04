# Arcanea Agent OS Architecture — 2026-04-03

## Goal

Create a real multi-agent operating system across:

- Codex
- OpenCode / `oh-my-arcanea`
- Claude / `arcanea-flow`
- Gemini
- Arcanea-Orchestrator

without forcing them into one brittle harness.

## Core Decision

Do **not** make `Arcanea-Orchestrator` from the Composio-derived conductor the primary control plane yet.

Use:

- native harness per runtime for execution
- shared Arcanea protocol above them for interoperability

That means:

- `oh-my-arcanea` remains the native OpenCode harness
- `arcanea-flow` remains the native Claude harness
- Codex and Gemini use thin Arcanea adapters and repo instructions
- `Arcanea-Orchestrator` stays a conductor/orchestration layer that consumes the shared contract

This is the correct sequencing because the missing piece was not “another orchestrator.” The missing piece was a shared language.

## What Landed

### Shared package

`packages/agent-registry`

Now contains:

- agent registry
- runtime definitions
- task contract types
- handoff packet types
- repo route types
- Agent OS config validation helpers

Key file:

- `packages/agent-registry/src/index.ts`

### Canonical Agent OS config

`/.arcanea/config/agent-os.json`

Defines:

- canonical SIS home
- runtime inventory
- repo routing rules
- memory conventions
- required preflight rules

### Operator templates

- `.arcanea/agents/task-contract.template.md`
- `.arcanea/agents/handoff-packet.template.json`

### Validation command

- `npm run agent-os:check`

Backed by:

- `scripts/agent-os-check.ts`

## Why This Is Valuable

Before this, Arcanea had:

- multiple harnesses
- multiple strong plans
- runtime-specific habits
- partial memory wiring

but not one disciplined protocol for cross-runtime work.

This contract layer gives:

- explicit ownership
- stable handoffs
- repo-aware runtime selection
- shared memory expectations
- verifiable task boundaries

That is the minimum required for a real agent operating system.

## Runtime Model

### Codex

Best for:

- repo surgery
- verification-heavy coding
- tool-rich, local, deterministic implementation

Memory:

- read/write canonical SIS through MCP

### OpenCode / `oh-my-arcanea`

Best for:

- Arcanea coding workflows
- multi-model local execution
- user-facing coding CLI work

Memory:

- read/write canonical SIS through MCP

### Claude / `arcanea-flow`

Best for:

- agent swarms
- higher-order orchestration
- synthesis and parallel task structures

Memory:

- reads canonical SIS
- can still write through legacy compatibility where needed

### Gemini

Best for:

- long-context synthesis
- multimodal/context-heavy reasoning
- Google model surfaces

Memory:

- should consume the same canonical SIS contract

### Arcanea-Orchestrator

Best for:

- later-stage coordination
- worktree/session control
- swarm monitoring and dispatch

Not best for:

- becoming the first source of truth for contracts or memory

It should consume the protocol, not define it.

## Repo Routing Model

Current explicit routes:

- `arcanea` -> primary runtime `codex`
- `arcanea-code` -> primary runtime `opencode`
- `oh-my-arcanea` -> primary runtime `claude`
- `starlight-intelligence-system` -> primary runtime `codex`
- `vibe-os` -> primary runtime `codex`

This does not mean exclusivity.

It means:

- default owner/runtime choice
- reduced ambiguity
- better handoff discipline

## Memory Protocol

Canonical memory is:

- `C:/Users/frank/.starlight`

Rules:

1. read canonical SIS before assuming context is absent
2. write durable learnings into canonical SIS
3. use typed records where possible
4. keep legacy memory as compatibility only

This is what lets multiple harnesses share continuity without sharing one process runtime.

## Task Contract Shape

Every substantial task should carry:

- scope
- owner
- files
- non-goals
- acceptance criteria
- verification
- rollback

This is intentionally simple because:

- simple contracts are more likely to be used
- complex contracts decay into theater

## Handoff Packet Shape

Every cross-runtime handoff should carry:

- contract id
- source runtime
- target runtime
- summary
- changed files
- decisions
- blockers
- verification run
- next action
- memory writes

This is the bridge between harness-native execution and ecosystem-level continuity.

## Why Native Harnesses Still Matter

Because they solve different problems well:

- Codex has excellent tool and repo execution
- OpenCode has local coding and model-routing strengths
- Claude Flow has strong swarm semantics
- Gemini has long-context and multimodal strengths

Trying to collapse them into one early abstraction would reduce capability and create hidden failure modes.

The right move is:

- shared protocol
- native execution
- explicit routing

## How This Connects To SIS And Web Memory

Agent OS sits above SIS and below task execution.

Relationship:

- SIS = canonical durable memory substrate
- Agent OS = protocol for who does what, where, and how handoffs happen
- Native harnesses = actual executors
- Web continuity = product/user memory layer, partly separate

This order matters:

1. Agent OS protocol
2. SIS productization
3. Web memory unification

## Best Next Steps

1. Add real example task contracts and handoff packets for live repo work.
2. Wire native harness launchers to emit/consume handoff packet files.
3. Add repo-specific runtime dispatch helpers in CLI/operator commands.
4. Move shared protocol package into any external repos that need it.
5. Then continue with SIS shared package extraction.

## Bottom Line

Arcanea should not be “one orchestrator to rule them all.”

It should be:

- one canonical memory substrate
- one shared agent protocol
- many native harnesses
- explicit routing and handoff rules

That is stronger engineering, more OSS-friendly, and more likely to survive real use.
