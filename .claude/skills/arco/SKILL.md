---
description: Activate the Arcanea Orchestrator — the multi-CLI routing brain. Shows status, routes tasks to best model (claude/opencode/codex/gemini), runs plans and workflows, and delegates to sub-CLIs via Bash. Distinct from /ao (Composio session manager).
---

# /arco — Arcanea Orchestrator

You are now operating with the Arcanea Orchestrator active. The orchestrator is a native CLI (`arcanea-orchestrator` or short `arco`) installed globally on this machine via `@arcanea/orchestrator` on npm. It is **not** a Claude Code skill — it's a real program that execs real CLIs. This skill teaches you how to use it from within a Claude Code session.

## Three distinct "orchestrators" — don't confuse them

| Name | Type | What |
|---|---|---|
| `/ao` | Claude Code skill | Promotion workflow + digest + cleanup (in this chat) |
| `ao` | Terminal CLI | Composio's session spawner at :4200 (outside this chat) |
| `arcanea-orchestrator` / `arco` | Terminal CLI | **Arcanea's routing brain, v1.x on npm** |

`/arco` (this skill) is a wrapper that helps you invoke `arcanea-orchestrator` correctly from inside Claude Code via Bash.

## When to invoke `/arco`

- Need to dispatch a task to the *best* model for that task class without manual model selection
- Want to decompose a high-level goal into sub-tasks (`plan`)
- Want to see what routing would happen (`explain`, `learn`)
- Want to check system state (`status`, `doctor`, `stats`, `history`)
- Want to load a reusable workflow template (`workflow`)
- Want to delegate the current task to codex or gemini for a second opinion

## Core operations

Always run via Bash tool. Use `arco` (short alias) unless scripts need the long name.

```bash
# Situational awareness first
arco status

# Before dispatching, check what will happen
arco explain world.canon --surface claude-arcanea
arco learn world.canon         # baseline vs adaptive ranking with your history

# Dispatch one task
arco run --task code.debug "find the null-deref in api/auth/route.ts"

# Plan then dispatch
arco plan "add a /pricing page with 3 tiers" --out /tmp/plan.json
# Then read /tmp/plan.json and dispatch each task sequentially via `arco run`

# Workflow templates (batteries-included compositions)
arco workflow list
arco workflow show build-landing-page
arco workflow run build-landing-page --var page=/features --var pitch="..."

# Data
arco history --limit 20
arco stats
```

## Delegating to other CLIs (the novel bit)

Inside a Claude Code session, you can delegate a sub-task to codex or gemini via Bash. Their output streams back as Bash tool output.

```bash
# Get GPT-5's independent review of the current diff
arco run --task code.review --surface codex-arcanea --model gpt-5 "<prompt>"

# Use Gemini 2M context for a long-doc summarization
arco run --task research.deep --surface gemini-arcanea "<prompt about long document>"

# Free-tier fallback when Max-sub usage matters
arco run --task code.implement --surface oh-my-arcanea "<prompt>"
```

Each call uses that sub-CLI's own auth (claude → Max sub, codex → OpenAI BYOK, gemini → Google BYOK, opencode → Zen free). Your prompts never touch Arcanea infrastructure — they go directly to the vendor.

## Protocol when using `/arco`

1. **Start with `arco status`** if the user's intent is ambiguous. Shows what CLIs are available + config + history.
2. **Use `arco explain <task>`** before running a non-obvious task to preview the routing decision.
3. **Use `arco plan`** for goals >3 steps. Produces a JSON plan you can then dispatch task-by-task.
4. **Use `arco workflow`** for common recipes instead of inventing from scratch.
5. **After running**, optionally `arco stats` to see if the new data moved the adaptive ranking.
6. **Don't replace local Claude Code work** — if you're already in Claude Code, you have Opus 4.7. Only invoke `arco run` via `claude-arcanea` if you want the log event + consistent routing across future sessions.

## Common recipes

### Full feature end-to-end (6 sub-tasks)
```bash
arco workflow run add-feature-end-to-end \
  --var feature=favorites \
  --var model=user_favorites \
  --var surface=/dashboard
```
Emits a 6-task plan. Execute each task's prompt via `arco run` (or hand to a swarm).

### Landing page
```bash
arco workflow run build-landing-page \
  --var page=/pricing \
  --var pitch="3-tier pricing for the Arcanea Creator Suite"
```

### Second opinion
```bash
# The diff is in your working tree. Get GPT-5's review:
arco run --task code.review --surface codex-arcanea "review the current diff"
```

## Output discipline

- Routing decisions print to **stderr** as `[arcanea] task=… → model via runtime`.
- Sub-CLI output streams through **stdout**.
- Commands are pipe-friendly — `arco plan ... | jq`, `arco history --json | jq`.

## Fail gracefully

- If a sub-CLI isn't installed: orchestrator prints an install hint, exits non-zero.
- If AO daemon (Composio) isn't running: `swarm` degrades to dry-run + hint.
- If `~/.arcanea/history.jsonl` is missing: history/stats show empty state.

## Your job when this skill is active

- Interpret the user's intent and map it to the right `arco` subcommand.
- Run via Bash. Relay the orchestrator's output (routing decision + sub-CLI stream).
- If routing looks wrong, say so — user can override with `--model`.
- Don't duplicate work: if Claude Code can do the task directly (and you're already in Claude Code with Opus), just do it. Use `arco` when you want: routing analytics, cross-CLI delegation, plan decomposition, or workflow templates.

## Where the data lives

- Config: `~/.arcanea/config.yaml` (preferences, detected auth)
- History: `~/.arcanea/history.jsonl` (every `run` event)
- Spec: bundled in `@arcanea/router-spec` npm package

## Related

- `/ao` — the OTHER orchestrator skill (promotion workflow, don't confuse)
- `/status` — repo-level status (different scope)
- `/handover` — session handover (separate concern)
- Terminal: `arcanea-orchestrator --help` lists every subcommand
