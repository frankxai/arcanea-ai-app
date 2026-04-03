# AgentDB Tranche Review - 2026-04-03

This review covers the newer memory and `agentdb`-related work currently visible on `integration/agent-control-plane-unification`.

It is intentionally limited to:

- `apps/web/app/api/memory/**`
- `apps/web/lib/agentdb/**`
- `packages/agent-registry/**`
- `scripts/agent-os-check.ts`
- relevant package script changes

It does not cover:

- docs-graph retrieval work
- voice / buddy / Luminor planning
- live Supabase activation

## Findings

### 1. The Starlight-backed memory backend is the strongest part

The most coherent change in this tranche is the move from pure in-memory fallback to a Starlight-backed local persistence layer:

- [store.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/lib/agentdb/store.ts)
- [starlight-store.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/lib/agentdb/starlight-store.ts)
- [store.test.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/lib/agentdb/__tests__/store.test.ts)

Directionally, this is good because it:

- aligns local development with the canonical `~/.starlight` memory substrate
- preserves a memory fallback for hosted environments
- adds a real test for CRUD/search/stats behavior

### 2. The memory route changes are small and low-risk

The route changes under:

- [route.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/app/api/memory/route.ts)
- [route.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/app/api/memory/[key]/route.ts)
- [route.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/app/api/memory/search/route.ts)
- [route.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/app/api/memory/stats/route.ts)

mostly add backend labeling metadata (`starlight` vs `memory`). That is reasonable and useful for observability.

### 3. The new Agent OS framework layer is not ready for blind promotion

The following files introduce a broader framework contract, not a narrow product fix:

- [package.json](C:/Users/frank/Arcanea-agent-control-promote/package.json)
- [package.json](C:/Users/frank/Arcanea-agent-control-promote/apps/web/package.json)
- [agent-os-check.ts](C:/Users/frank/Arcanea-agent-control-promote/scripts/agent-os-check.ts)
- [index.ts](C:/Users/frank/Arcanea-agent-control-promote/packages/agent-registry/src/index.ts)

This is not inherently bad, but it is wider than the memory backend change and appears to depend on additional config and runtime conventions that are not yet established as canonical product infrastructure.

### 4. The branch is still mixed

The tranche is currently sitting inside a broader mixed integration branch. That means even good work inside it should be extracted into its own clean promotion slice rather than merged from the parent branch.

## Safe Promotion Candidate

The safest promotable subset is:

- [store.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/lib/agentdb/store.ts)
- [starlight-store.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/lib/agentdb/starlight-store.ts)
- [store.test.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/lib/agentdb/__tests__/store.test.ts)
- [route.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/app/api/memory/route.ts)
- [route.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/app/api/memory/[key]/route.ts)
- [route.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/app/api/memory/search/route.ts)
- [route.ts](C:/Users/frank/Arcanea-agent-control-promote/apps/web/app/api/memory/stats/route.ts)
- the narrow package-script addition:
  - [package.json](C:/Users/frank/Arcanea-agent-control-promote/apps/web/package.json) only for `test:agentdb`

This should be treated as a dedicated `agentdb-starlight-backend` promotion slice.

## Hold / Experimental

These should stay out of `main` until reviewed and verified independently:

- [package.json](C:/Users/frank/Arcanea-agent-control-promote/package.json) Agent OS script additions
- [agent-os-check.ts](C:/Users/frank/Arcanea-agent-control-promote/scripts/agent-os-check.ts)
- [index.ts](C:/Users/frank/Arcanea-agent-control-promote/packages/agent-registry/src/index.ts)
- any untracked runtime config required by those scripts

Reason:

- they define a broader framework layer
- they are not yet proven as the canonical execution substrate
- they create more coupling than the narrow memory backend slice

## Verification Gap

This tranche still needs clean verification in an isolated branch/worktree:

- `pnpm --dir apps/web exec tsc --noEmit`
- `pnpm --dir apps/web test:agentdb`
- `pnpm --dir apps/web build`

Only after those pass should the safe subset move toward `main`.

## Recommendation

1. Do not merge `integration/agent-control-plane-unification` wholesale.
2. Split the Starlight-backed `agentdb` backend into its own clean promotion branch.
3. Leave `packages/agent-registry` and Agent OS contract work experimental until there is a dedicated review and stronger runtime proof.
