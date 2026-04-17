# @arcanea/arcanea-code

Thin multi-CLI dispatcher. Routes a coding task to the right agent runtime (`claude`, `opencode`, `codex`, `gemini`) based on the canonical `@arcanea/router-spec`.

## Why

You have Claude Max ($200/mo sub, unlimited inside Claude Code), OpenCode Zen (free models), plus BYOK keys for OpenAI Codex and Gemini. Picking the right one for each task by hand is noise. This does it for you.

## Install

```bash
pnpm add -g @arcanea/arcanea-code
# or from workspace:
pnpm --filter @arcanea/arcanea-code build
```

## Use

```bash
# what models are available?
arcanea-code list-models

# what task-classes does the router know?
arcanea-code list-tasks

# for a given task, which models/CLIs get picked, and why?
arcanea-code explain world.canon --surface claude-arcanea

# actually run a task
arcanea-code run --task code.debug "find the null-deref in api/auth/route.ts"

# swarm mode (stub — Phase 3 wires Composio AO)
arcanea-code swarm --from planning-with-files/CURRENT_BACKLOG_2026-04-13.md
```

## How routing works

1. You declare a task class (e.g. `code.debug`, `world.canon`, `research.deep`).
2. Dispatcher reads `@arcanea/router-spec/models.yaml`.
3. Looks up the surface (defaults to `claude-arcanea` — i.e. Claude Code with Max sub).
4. Picks first non-deprecated model whose tier is available to that surface.
5. Maps model → runtime (`claude -p`, `opencode run -p`, `codex -p`, `gemini -p`).
6. Execs it, streams stdout back to you.

## Principle

This is not a TUI. It is not a chat app. It is a **5-line-what-to-run** decision encoded as a CLI. Keep it under 500 LOC.

## Status

Phase 1a (2026-04-17) — dispatcher skeleton, `run` / `list-models` / `list-tasks` / `explain` / `doctor` / `config` / `status` / `swarm`.

See `planning-with-files/AMCAS_DESIGN_2026-04-17.md` for the full design and phase plan.

## Legal / disclaimer

**This package is a thin wrapper.** It does not process model requests itself — it shells out to CLIs you install and authenticate yourself (`claude`, `opencode`, `codex`, `gemini`). Everything that flows through those sub-CLIs is governed by the vendor's terms.

- **MIT licensed, provided "AS IS"**, without warranty of any kind. See `LICENSE`.
- **Not affiliated with** Anthropic, OpenAI, Google, Alibaba, MiniMax, Zhipu, Moonshot, NVIDIA, Xiaomi, or any other model provider. All trademarks belong to their respective owners.
- **You are responsible** for your own provider authentication, API key safety, token consumption, billing, and compliance with each provider's Terms of Service and Acceptable Use Policy.
- **No usage data is collected** by this package. Your prompts never touch Arcanea infrastructure — they go directly from your shell to the CLI you invoked.
- **Model metadata** (SWE-Bench scores, context windows, tier classifications) is aggregated from public benchmarks and vendor announcements. Accuracy is best-effort and not guaranteed. Verify claims independently before making business decisions.
- **The routing heuristics are opinionated**, not optimal. Override with `--model` at any time. The Router Spec is a suggestion, not authority.
- **Rate limits, quota exhaustion, content filtering, and any other runtime behavior** are the sole responsibility of the underlying provider CLI. This package surfaces their errors but does not modify their behavior.

If a vendor discontinues or renames a model, this package will not automatically adapt — edit `@arcanea/router-spec` or override with `--model`.
