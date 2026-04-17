# @arcanea/orchestrator

**The Arcanea Orchestrator.** A headless brain that routes, plans, swarms, and (soon) learns across `claude`, `opencode`, `codex`, and `gemini`. Reads the canonical `@arcanea/router-spec` to pick the right model for each task, respects your subscription economics, and dispatches to the right sub-CLI without you thinking about it.

Use this when you want intelligence. Use [`arcanea-code`](https://github.com/frankxai/arcanea-code) (the forthcoming OpenCode fork) when you want a rich TUI on top of it.

## Why

You have Claude Max (unlimited inside Claude Code via `claude -p`), OpenCode Zen (free tier), plus optional BYOK keys for OpenAI Codex and Gemini. Picking the right one for each task by hand is noise. This does it for you — preference-aware, auth-aware, sub-economics-preserving.

## Install

```bash
npm i -g @arcanea/orchestrator
# or
pnpm add -g @arcanea/orchestrator
```

After install, two bin names are available:
- `arcanea-orchestrator` — canonical
- `arco` — short alias

## Use

```bash
# Detect which CLIs are installed + infer auth tier (sub/byok/free)
arcanea-orchestrator doctor

# Set your tier preference once
arcanea-orchestrator config preference sub-first      # Max first (default)
arcanea-orchestrator config preference free-first     # free tier first
arcanea-orchestrator config preference byok-first     # BYOK first
arcanea-orchestrator config preference cheapest       # minimize cost

# Situational awareness (router spec + config + auth + AO + worktrees)
arcanea-orchestrator status

# What models does the router know?
arcanea-orchestrator list-models [--tier sub|free|byok]
arcanea-orchestrator list-tasks

# For a task, show which model+runtime gets picked, and why
arcanea-orchestrator explain world.canon --surface claude-arcanea

# Dispatch a prompt to the routed runtime
arcanea-orchestrator run --task code.debug "find the null-deref in api/auth/route.ts"
arcanea-orchestrator run --task world.canon --surface claude-arcanea "write Forge of Ruin ch5"

# Swarm — plan N workers from a backlog file
arcanea-orchestrator swarm --from backlog.md --tasks 5 --dry-run
arcanea-orchestrator swarm --from backlog.md --tasks 5    # live (requires Composio `ao` running)

# Short alias:
arco doctor
arco run --task code.implement "add tests for auth middleware"
```

## How routing works

1. You declare a task class (e.g. `code.debug`, `world.canon`, `research.deep`).
2. Orchestrator reads `@arcanea/router-spec/models.yaml`.
3. Looks up the surface (defaults to `claude-arcanea` — Claude Code with Max sub).
4. Re-ranks candidates by your tier preference from `~/.arcanea/config.yaml`.
5. Filters out runtimes not installed on your machine.
6. Picks the first valid model. Maps to runtime (`claude -p`, `opencode run -p`, `codex exec`, `gemini -p`).
7. Execs it, streams stdout back to you.

## What it is / is not

| Is | Is not |
|---|---|
| Routing brain (headless) | A TUI or chat app |
| Preference + auth aware | A replacement for any CLI |
| Sub-economics optimizer | A model host or proxy |
| Composable in pipelines | A SaaS product |
| Spec-driven (editable YAML) | Hard-coded decisions |

If you want a rich TUI daily driver, see **[arcanea-code](https://github.com/frankxai/arcanea-code)** (OpenCode fork, separate product).

## Roadmap (incremental, all additive)

| Phase | Capability | Status |
|---|---|---|
| 0 | Router Spec | ✅ shipped (`@arcanea/router-spec`) |
| 1 | Dispatcher CLI (doctor/config/run/explain/list) | ✅ shipped |
| 2 | Overlay manifests across 4 overlay repos | ✅ shipped |
| 3 | Real swarm via Composio `ao batch-spawn` | ✅ wired |
| 4 | `/ops/agents` live web dashboard | ✅ shipped (`apps/web/app/ops/agents`) |
| 5 | **Planner** — `orchestrator plan "build a site"` decomposes to N tasks | next |
| 6 | **Reasoning bank** — learns which model+task combos succeeded | next |
| 7 | **Agent inventory** — orchestrator picks not just model but specific overlay agent | next |

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

## Migration from `@arcanea/arcanea-code`

If you installed `@arcanea/arcanea-code` (the pre-rename name, v0.1.0 / 0.1.1), migrate to `@arcanea/orchestrator@1.0.0`:

```bash
npm uninstall -g @arcanea/arcanea-code
npm install -g @arcanea/orchestrator
```

The CLI is compatible — all commands work identically. Only the package name and bin name changed (`arcanea-code` → `arcanea-orchestrator` / `arco`). The old package is deprecated on npm and will stop receiving updates.
