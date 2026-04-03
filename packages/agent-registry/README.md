# @arcanea/agent-registry

Shared Arcanea Agent OS contract package.

This package defines the protocol layer that sits above runtime-specific harnesses such as:

- Codex
- OpenCode / `oh-my-arcanea`
- Claude / `arcanea-flow`
- Gemini
- Arcanea-Orchestrator

It provides:

- agent registry definitions
- runtime definitions
- task contract schema helpers
- handoff packet schema helpers
- repo routing validation helpers

It does **not** implement orchestration itself. It defines the common language that all orchestrators and harness adapters should speak.

## Design intent

Use native harnesses for execution.

Use this package for:

- planning and delegation contracts
- cross-runtime handoffs
- repo-aware routing policy
- memory conventions and preflight expectations

## Example

```ts
import { validateTaskContract, getRuntime, AGENT_REGISTRY } from '@arcanea/agent-registry';

const errors = validateTaskContract({
  id: 'task-001',
  title: 'Build shared agent protocol',
  scope: 'Create the contract layer for multi-runtime Arcanea agents.',
  ownerRuntime: 'codex',
  ownerAgent: 'planner',
  files: ['packages/agent-registry/src/index.ts'],
  nonGoals: ['Implement full orchestrator runtime'],
  acceptanceCriteria: ['Contracts validate cleanly'],
  verification: ['pnpm --dir packages/agent-registry type-check'],
  rollback: ['Revert package files'],
  priority: 'high',
  verificationMode: 'standard',
  memoryReadBeforeWrite: true,
});

if (errors.length > 0) {
  throw new Error(errors.join('\n'));
}
```
