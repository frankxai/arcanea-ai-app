# @arcanea/router-spec

Canonical model routing for the Arcanea ecosystem. Single source of truth.

## Why this exists

Before this package, routing decisions (which model handles which task) lived in three places:
- `~/.config/opencode/oh-my-opencode.json` for OpenCode
- `claude-arcanea` agent frontmatter for Claude Code
- `apps/web/lib/models-data.ts` for the public `/models` page
- Plus the blog post, plus Frank's head

They drifted. This package collapses them into one file (`models.yaml`) that every surface reads.

## What it contains

- **Model catalog** — every model we use, with tier (free / sub / byok), context, benchmarks, and strengths.
- **Task classes** — every task we route (orchestrate, code.implement, world.canon, etc.) with primary + fallback candidates.
- **Surface bindings** — how each harness (claude-arcanea, oh-my-arcanea, arcanea-flow, arcanea-mcp) consumes the spec, including per-surface overrides.
- **Delegation topology** — when Opus 4.7 in Claude Code delegates to external CLIs (codex, gemini, opencode, ao) via Bash, which tasks go where.

## Consuming the spec

```ts
import { loadSpec, resolveTask, pickModel } from '@arcanea/router-spec';

const candidates = resolveTask('code.debug', 'claude-arcanea');
// → ['claude-opus-4-7', 'claude-sonnet-4-6', 'minimax-m2.5-free']

const model = pickModel(candidates);
// → 'claude-opus-4-7'
```

## Tier semantics

| Tier | Meaning |
|---|---|
| `free` | OpenCode Zen free models. $0 tokens but usage data may be collected. |
| `sub` | Covered by a subscription (Claude Max). Unlimited inside the harness. |
| `byok` | User provides API key. Metered at provider price. |
| `premium` | Paid, metered (used internally by Arcanea for paying users). |

## Updating the spec

1. Edit `models.yaml`.
2. Bump `version` (semver) and update `lastUpdated`.
3. Run `pnpm --filter @arcanea/router-spec validate`.
4. Surfaces pick up changes on next build / restart.

## Surfaces that read this

- `claude-arcanea` — Claude Code overlay
- `oh-my-arcanea` — OpenCode overlay
- `arcanea-flow` — workflow engine
- `arcanea-mcp` — MCP tool server
- `apps/web/app/models/` — public arena page (auto-generated)
- `apps/web/app/blog/ai-model-arena-free-models-guide/` — blog post (section auto-generated)

## Principle

Memory is historical. Config is authoritative. If this file disagrees with a surface's local config, this file wins — fix the surface.
