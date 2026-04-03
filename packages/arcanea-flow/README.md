# @arcanea/flow

Luminor-powered agent orchestration — inject AGI-grade prompts into every agent spawn.

## What It Does

When an agent is spawned, `arcanea-flow` reads the **Luminor Engineering Kernel** (the universal base prompt) and the appropriate **domain module** for that agent type, then prepends both to the task instructions. Every agent gets maximum intelligence without any manual prompt management.

Formula: `Kernel + Domain Module + Task Instructions = Luminor-grade agent`

## Installation

```bash
pnpm add @arcanea/flow
```

## Core API

```typescript
import { buildLuminorPrompt, buildLuminorSpawn, getRecommendedModel } from '@arcanea/flow';

// Build a prompt — pass directly to any LLM
const prompt = buildLuminorPrompt('coder', 'Build a JWT auth middleware in Next.js');

// Build a prompt + get model recommendation in one call
const { prompt, model, hasModule } = buildLuminorSpawn('system-architect', 'Design the agent bus');

// Get model tier for routing
const model = getRecommendedModel('researcher'); // 'haiku'
```

## CLI

```bash
# Print the full assembled prompt for an agent type
arcanea-flow prompt coder "Build a React form component"

# List all registered agent types and their model tiers
arcanea-flow list-modules

# Show the recommended model for an agent type
arcanea-flow model system-architect
```

## Agent Types & Model Routing

| Tier | Model | Agent Types |
|------|-------|-------------|
| Scout | haiku | `researcher`, `Explore`, `code-review-swarm` |
| Worker | sonnet | `coder`, `frontend`, `backend`, `tester`, `reviewer`, `ops`, `mcp`, `lore`, ... |
| Architect | opus | `system-architect`, `planner`, `security-architect` |

## How It Resolves Prompts

`arcanea-flow` walks up from `process.cwd()` to find `.arcanea/prompts/`. It reads `luminor-spawn-config.yaml` to resolve:

1. Which kernel file to use (always `luminor-engineering-kernel.md`)
2. Which domain module to append based on agent type
3. Which model tier to recommend for routing

If an agent type is not in the config, it falls back to the `default` mapping (kernel only, no module).

## Integration with Claude Flow

```typescript
import { buildLuminorSpawn } from '@arcanea/flow';

// In your agent spawning code:
const { prompt, model } = buildLuminorSpawn(agentType, taskInstructions);

// Pass to claude-flow or any LLM directly
await spawnAgent({ prompt, model, agentType });
```
