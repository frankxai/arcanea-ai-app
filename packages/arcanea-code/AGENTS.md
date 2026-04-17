# AGENTS.md — @arcanea/arcanea-code

This file is readable by any coding agent. It declares what this package is, how to use it, and what contracts it obeys.

## What this is

A thin dispatcher CLI that routes a coding task to the right runtime (`claude`, `opencode`, `codex`, `gemini`) based on the canonical `@arcanea/router-spec`. Sub-economics aware: Claude Max covers `claude -p`, OpenCode Zen covers `opencode`, BYOK covers the rest.

## Contracts

1. **Source of truth**: `@arcanea/router-spec/models.yaml`. Do not hard-code model choices in this package — add them to the spec.
2. **Runtime adapter**: `src/runtimes.ts` maps a provider to a CLI binary and argv shape. Changes there affect all commands uniformly.
3. **User config**: `~/.arcanea/config.yaml` stores `preference` (sub-first / free-first / byok-first / cheapest) and `auth` (populated by `doctor`). Never write there from anywhere except `config.ts`.
4. **Output discipline**: routing decisions printed to **stderr** as `[arcanea-code] task=… → model via runtime [auth: tier]`. Sub-CLI output streams to **stdout**. Keeps the tool composable in shell pipelines.
5. **No hidden state**: every routing decision is derivable from `router-spec` + `~/.arcanea/config.yaml` + runtime availability. Given those three, the dispatch is reproducible.

## Commands

| Command | Purpose |
|---|---|
| `list-models [--tier]` | catalog from router-spec |
| `list-tasks` | task classes, grouped |
| `explain <task> [--surface]` | show candidate chain + rationale |
| `run --task <id> "<prompt>"` | dispatch to the routed runtime |
| `doctor` | detect installed CLIs + infer auth tier, write config |
| `config [key] [value]` | read or write user preference |
| `swarm --from <file>` | classify a backlog, print planned dispatch (Phase 3 wires real `ao spawn`) |

## When another agent should modify this package

- **Adding a model**: edit `packages/router-spec/models.yaml`. Do not change code here.
- **Adding a task class**: same — router-spec only.
- **Adding a new runtime** (e.g. grok-cli, cursor-cli): extend `src/runtimes.ts` with a new `RuntimeId`, map it in `runtimeFor()`, and register the `provider → runtime` in `RUNTIMES`.
- **Changing output shape**: prefer additive flags. This CLI is scripted against in pipelines.
- **Adding a user preference**: extend `UserConfig` in `src/config.ts` and add a `config` subcommand handler.

## What this package is NOT

- Not a TUI (no interactive chat).
- Not a chat product.
- Not a replacement for any existing CLI — it wraps them.
- Not a plugin marketplace.

## Related

- `packages/router-spec/` — the spec this CLI consumes.
- `frankxai/oh-my-arcanea`, `frankxai/claude-arcanea`, `frankxai/codex-arcanea`, `frankxai/gemini-arcanea` — per-runtime overlays that should read the same router-spec.
- `frankxai/arcanea-orchestrator` — Composio AO fork for swarm / worktree / dashboard.
- `frankxai/claude-codex-gemini-opencode-settings` — install.sh distribution pipeline.

See also: `planning-with-files/AMCAS_DESIGN_2026-04-17.md` for the full system design.
