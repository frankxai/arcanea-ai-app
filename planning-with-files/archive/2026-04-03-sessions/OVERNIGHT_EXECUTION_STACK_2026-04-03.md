# Overnight Execution Stack — 2026-04-03

## Current Truth

The strongest foundation now in place is:

1. Canonical SIS memory substrate
2. Shared Agent OS contract layer
3. Local web AgentDB persistence aligned to canonical SIS

This means the next work should not restart architecture debates. It should compound on the protocol and memory substrate already landed.

## Execution Order

### 1. Agent OS Runtime Adapters

Build:
- handoff file emitters for native harnesses
- task contract bootstrap commands for each runtime
- runtime-specific wrapper docs and examples

Concrete target:
- OpenCode and Claude launcher flows should be able to emit validated handoff packets and consume incoming packets.

Why first:
- this turns the protocol into real runtime behavior

### 2. Shared SIS Contract Package

Build:
- extract SIS schema/validation into a reusable package
- consume it from:
  - `arcanea`
  - `starlight-intelligence-system`
  - later `vibe-os`

Why second:
- prevents protocol drift
- establishes reusable OSS boundary

### 3. Web Memory Boundary Cleanup

Build:
- explicit local/dev vs hosted memory mode rules
- make web memory surfaces more transparent
- add tests for project continuity and memory flows

Why third:
- product continuity becomes easier once the protocol and SIS contracts are stable

## Suggested Concrete Tasks

### Task A

Scope:
- Add `arcanea agent-os create-task` and `arcanea agent-os create-handoff` helpers
- Emit starter JSON from templates

Owner:
- codex / planner

Files:
- `.arcanea/scripts/arcanea.ps1`
- `scripts/agent-os-*.ts`

Verification:
- `cmd /d /s /c "npm run agent-os:check"`

### Task B

Scope:
- Add OpenCode and Claude runtime-facing docs plus packet examples
- Wire packet examples into repo docs

Owner:
- codex / planner

Files:
- `planning-with-files/*`
- `AGENTS.md`
- `.arcanea/CLAUDE.md`
- `.opencode/opencode.json` if needed

Verification:
- manual doc audit + `npm run agent-os:check`

### Task C

Scope:
- Extract SIS schema code into dedicated package

Owner:
- codex / planner

Files:
- `scripts/sis-schema.mjs`
- new shared package
- SIS consumers

Verification:
- `npm run sis:check`

## Principle

Do not build another parallel system.

Prefer:
- one substrate
- one protocol
- many adapters

That is the constraint that keeps the ecosystem from turning into a beautiful mess.
