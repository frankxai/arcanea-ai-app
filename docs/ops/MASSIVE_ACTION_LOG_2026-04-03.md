# Arcanea Massive Action Log

Date: 2026-04-03
Scope: platform control plane, repo constellation, orchestration, runtime harnesses, billing strategy, project graph, creator graph, and operational conclusions

## Current platform state

- Main control plane repo: [Arcanea](C:/Users/frank/Arcanea)
- Main active branch: `integration/agent-control-plane-unification`
- Current verified commit at time of log: `fc69fa3b7`
- Deep health status:
  - `20 total repos`
  - `19 ok`
  - `1 warn`
  - `0 error`
  - `12 smoke passed`
  - `0 smoke failed`
- Remaining repo warning:
  - `arcanea-ecosystem` only

## Core architectural conclusion

Arcanea should operate as a layered platform, not a single app and not a pile of forks.

- `arcanea`
  - control plane
  - product surfaces
  - ops UI
  - memory and graph visibility
  - billing and entitlements
  - registry, policy, handoffs, recovery
- `arcanea-flow`
  - Arcanea-native orchestration semantics
  - high-level decomposition and routing
  - should support Claude, Codex, OpenCode, Gemini, and future runtimes
- `arcanea-orchestrator`
  - heavy execution substrate
  - worktrees, sessions, fanout, status, review loops
- runtime harnesses
  - `arcanea-code`
  - `oh-my-arcanea`
  - `arcanea-opencode`
  - `claude-arcanea`
  - `codex-arcanea`
  - `gemini-arcanea`

This is better than the older state because it separates:

- visibility from execution
- orchestration semantics from runtime adapters
- platform identity from upstream fork baggage

## Repo constellation

### Platform and orchestration

- `arcanea`
  - main platform monorepo and control plane
  - branch: `integration/agent-control-plane-unification`
  - status: clean
- `arcanea-flow`
  - swarm and multi-agent orchestration engine
  - branch: `main`
  - pushed and reconciled
  - status: clean
- `arcanea-orchestrator`
  - worktree-centric execution substrate based on Composio agent-orchestrator
  - branch: `main`
  - pushed
  - status: clean
- `arcanea-ecosystem`
  - ecosystem docs and portfolio registry
  - branch: `master`
  - still dirty because of legacy submodule model

### Runtime harnesses

- `arcanea-code`
  - Arcanea OpenCode fork
  - branch: `dev`
  - pushed
  - status: clean
- `oh-my-arcanea`
  - Arcanea operator workflow overlay
  - branch: `dev`
  - status: clean
- `arcanea-opencode`
  - Arcanea OpenCode legacy compatibility harness
  - branch: `dev`
  - status: clean
- `claude-arcanea`
  - Claude Code Arcanea harness
  - branch: `master`
  - pushed
  - status: clean
- `codex-arcanea`
  - Codex Arcanea harness
  - branch: `master`
  - status: clean

### Verticals and adjacent products

- `arcanea-infogenius`
  - visual intelligence and infographic systems
  - status: clean
- `arcanea-onchain`
  - economic and onchain layer
  - status: clean
- `arcanea-claw`
  - media engine and creation workflows
  - status: clean
- `arcanea-mobile`
  - mobile surface
  - status: clean

### Embedded workspace modules in main repo

- `arcanea-agents`
- `arcanea-lore`
- `arcanea-records`
- `arcanea-soul`
- `arcanea-companion`
- `arcanea-library-superintelligence`
- `arcanea-game-development`

## Major actions completed

### Command and shell surface

Local shell wrappers and profile routing were established so commands resolve to local repos instead of stale global shims.

Working command surfaces include:

- `arcanea`
- `arcanea-flow`
- `arcanea-flow-mcp`
- `ao`
- `arcanea-orchestrator`
- `oh-my-arcanea`
- `opencode-arcanea`
- `arcanea-opencode`
- `opencode`

### Control plane and visibility

Built and stabilized:

- repo registry
  - [.arcanea/projects/repo-constellation.json](C:/Users/frank/Arcanea/.arcanea/projects/repo-constellation.json)
- health gate
  - [scripts/ops-health-check.js](C:/Users/frank/Arcanea/scripts/ops-health-check.js)
- machine readiness gate
  - [scripts/machine-readiness-check.js](C:/Users/frank/Arcanea/scripts/machine-readiness-check.js)
- internal ops UI
  - [apps/web/app/ops/page.tsx](C:/Users/frank/Arcanea/apps/web/app/ops/page.tsx)
  - [apps/web/app/api/ops/internal/route.ts](C:/Users/frank/Arcanea/apps/web/app/api/ops/internal/route.ts)
  - [apps/web/lib/ops/internal-dashboard.ts](C:/Users/frank/Arcanea/apps/web/lib/ops/internal-dashboard.ts)
- command nav entry
  - [apps/web/app/command/sidebar.tsx](C:/Users/frank/Arcanea/apps/web/app/command/sidebar.tsx)

### Arcanea Flow productization

Completed high-value import and cleanup slices so `arcanea-flow` is not just a dirty fork but a more coherent Arcanea-native orchestration repo.

Imported or normalized:

- `claims`
- `memory`
- `hooks`
- `shared`
- `mcp`
- `providers`
- `swarm`
- `security`

Also completed:

- remote normalization
- local shell launchers
- `ao` delegation bridge
- push and reconciliation to `origin/main`

### Arcanea Orchestrator productization

Promoted from satellite to real top-level managed repo.

Completed:

- local shell wrappers
- config template
- Arcanea-shaped CLI/help/config surface
- integration into deep health checks
- generated dashboard server output ignored cleanly in git

### SIS and canonical memory layer

Built and verified a real canonical memory path instead of loose notes and stale compatibility shims.

Completed:

- schema definition
  - [scripts/sis-schema.mjs](C:/Users/frank/Arcanea/scripts/sis-schema.mjs)
- schema validation
  - [scripts/sis-schema-check.mjs](C:/Users/frank/Arcanea/scripts/sis-schema-check.mjs)
- write path
  - [scripts/sis-write.mjs](C:/Users/frank/Arcanea/scripts/sis-write.mjs)
- contract check
  - [scripts/sis-contract-check.mjs](C:/Users/frank/Arcanea/scripts/sis-contract-check.mjs)
- legacy export
  - [scripts/sis-legacy-export.mjs](C:/Users/frank/Arcanea/scripts/sis-legacy-export.mjs)
- compatibility MCP
  - [scripts/arcanea-memory-compat-mcp.mjs](C:/Users/frank/Arcanea/scripts/arcanea-memory-compat-mcp.mjs)
- server extension
  - [scripts/sis-mcp-server.mjs](C:/Users/frank/Arcanea/scripts/sis-mcp-server.mjs)
- launcher surface
  - [.arcanea/scripts/arcanea.ps1](C:/Users/frank/Arcanea/.arcanea/scripts/arcanea.ps1)
  - [.arcanea/scripts/sis-bootstrap.ps1](C:/Users/frank/Arcanea/.arcanea/scripts/sis-bootstrap.ps1)

Validation now passes:

- `npm run sis:check`
- `arcanea sis stats-json`

Also repaired one malformed JSON line in the canonical operational SIS vault to make the stricter schema checks truthful and useful.

### Canon and test repair

Previously red baseline tests were fixed so the main repo no longer had a fake production blocker.

Repaired:

- mythology constant mismatches
- MCP memory contract gaps
- stale canon expectations in tests

Result:

- `npm run test:quick`
  - `664 passed`
  - `0 failed`

## Strategic conclusions

### Arcanea Flow should not be Claude-only

`arcanea-flow` should be runtime-agnostic and usable by:

- Claude Code
- Codex
- OpenCode
- Gemini
- future internal or external agents

To support that fully, `arcanea-flow` still needs:

- stable CLI contracts
- machine-readable JSON output
- explicit run IDs
- deterministic delegation to `ao`
- traces persisted back into the control plane

### Billing strategy

Best conclusion:

- short-term if pre-BV monetization is needed:
  - `LemonSqueezy`
- long-term primary rail:
  - `Stripe`

Reason:

- Stripe is better for the final Arcanea shape:
  - subscriptions
  - credits
  - team/org billing
  - premium execution
  - future marketplace or payouts
- LemonSqueezy is better for early merchant-of-record simplicity before business setup is ready

Most important billing principle:

- payment provider should not be the product truth
- `Supabase` should hold:
  - entitlements
  - credits
  - usage ledger
  - project graph
  - creator graph
  - run state

### Product graph and creator graph

High-value product direction:

- finish real Supabase project graph
- typed schema and migrations
- explicit cost-before-execution
- live run status pages
- creator graph across:
  - prompt books
  - collections
  - follows
  - challenges
  - reputation

This gives a product loop:

- work
- memory
- graph
- social proof
- monetization
- compounding value

## Why this strategy is better

It creates clearer economic and technical leverage:

- one place for visibility
- one place for orchestration semantics
- one place for multi-agent execution
- separate runtime adapters
- persistent memory and graph as a defensible asset
- creator and team workflows that can compound instead of resetting every session

This is stronger than “just another AI app” and stronger than “just another agent runner.”

## Money and value model

Arcanea should make money from leverage, not only from token resale.

Revenue layers:

- subscriptions
  - workspace graph
  - memory
  - orchestration
  - advanced control surfaces
  - creator features
- credits
  - expensive research
  - media generation
  - large swarm runs
  - premium providers
- BYOK power tier
  - advanced users bring their own keys
  - lowers Arcanea cost exposure
- team/studio plans
  - multi-agent repo ops
  - review workflows
  - shared memory and visibility
- marketplace and academy later
  - prompt books
  - workflow packs
  - agent packs
  - community extensions
  - learning products

## Remaining unresolved issues

### Primary remaining repo warning

- `arcanea-ecosystem`
  - still dirty because it is a legacy submodule meta-repo while the actual portfolio evolved into a mixed direct-repo plus registry model
  - this is now a product/repo-model decision, not random drift

### Main control plane branch

- current main repo branch is clean
- branch remains `integration/agent-control-plane-unification`
- promotion into `main` still needs intentional review/merge, not blind fast-forwarding

## Recommended next actions

1. Decide the future of `arcanea-ecosystem`
- keep as legacy submodule meta-repo and accept that it will be noisy
- or convert it into a pure portfolio registry repo and stop tracking stale submodule pointers

2. Add machine-readable orchestration output to `arcanea-flow`
- `--json` or equivalent
- run IDs
- delegated command preview
- repo/workspace metadata

3. Advance Supabase product graph execution
- apply migrations
- regenerate types
- expose project-aware retrieval and run graph

4. Build user-facing run visibility
- live run status pages
- cost-before-execution
- execution traces

5. Unify creator graph
- prompt books
- collections
- follows
- challenge reputation

## Latest execution tranche

### Arcanea Flow machine-readable delegation

- implemented `ao --json` in `arcanea-flow`
- added a stable run envelope with:
  - `schemaVersion`
  - `kind`
  - `runId`
  - `timestamp`
  - `finishedAt`
  - `durationMs`
  - `mode`
  - `repo`
  - `ao`
  - `execution`
  - optional `output`
- persisted traces to:
  - `.arcanea/runtime/flow-runs.jsonl`

### Control-plane visibility

- updated `/ops` internal surface to read and display recent `arcanea-flow` traces
- added a new “Recent Flow Runs” section so orchestration is visible from the main control plane

### Runtime bootstrap conclusion

- the compiled `arcanea-flow` CLI output in repo-root `dist` is a library module, not a self-executing binary
- local wrappers now use a dedicated bootstrap script:
  - `.arcanea/scripts/arcanea-flow-bootstrap.mjs`
- `arcanea-flow` works through the bootstrap and can emit JSON traces locally
- `arcanea-flow ao --json --dry-run status` now succeeds and seeds the runtime trace log

## Important operational note

This log is meant to preserve not only what was changed, but the reasons and strategic conclusions behind the changes, so future agents can continue without re-deriving the same architecture from scratch.
