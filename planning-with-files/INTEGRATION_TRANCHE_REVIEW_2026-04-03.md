# Integration Tranche Review - 2026-04-03

## Goal

Classify the remaining work on `integration/agent-control-plane-unification` into the next safe promotion tranche versus work that should stay isolated.

## Promote Next

### 1. Docs + project graph workflow

- branch: `feat/docs-graph-retrieval`
- why:
  - directly reinforces the main product spine: projects, continuity, docs, retrieval, provenance
  - user-facing and compounding
  - isolated to `apps/web` plus planning state
- verification:
  - `pnpm --dir apps/web test:projects`
  - `pnpm --dir apps/web type-check`

### 2. Control-plane contract + execution law

- commits:
  - `b583466b3` `docs(ops): unify agent control plane and capture review state`
  - `c51fd72e9` `enforce: execution law in AGENTS.md + .nvmrc pin Node 20`
  - `a67552f47` `enforce(ci): npm rejection, .nvmrc check, typecheck as real gate`
- why:
  - repo-wide safety and consistency
  - low product risk
  - makes every later promotion safer
- verification:
  - file review
  - CI config review

### 3. Small runtime/supportive cleanup

- commits:
  - `37b05d7c3` `fix(runtime): make SIS launcher commands powershell-safe`
  - `824555459` `docs(ops): quarantine experimental agent research artifacts`
  - `fc911ef34` `docs(ops): refresh docs slice review and changelog`
- why:
  - narrow, understandable, and low-risk
  - reduces operator friction without dragging in the larger SIS runtime expansion

## Hold For Separate Review

### SIS runtime expansion

- commits:
  - `1b6031a7b`
  - `d205d5ee6`
- reason:
  - too much script/runtime surface in one move
  - needs independent verification under Node 20 and Windows shell paths

### Prompt/module library expansion

- commits:
  - `61201ce6a`
- reason:
  - useful, but not on the critical path to the product spine
  - can follow the control-plane tranche

### Security dependency sweep

- commits:
  - `47e5b1117`
- reason:
  - probably worth promoting, but only after dedicated repo-wide verification
  - broad lockfile churn should not be bundled with the docs slice

## Hold / Archive

### Not product-spine work

- commits:
  - `51d11b399` voice capture
  - `9aa06a99b` NFT forge
  - `73078a322` flow orchestration
  - `ea3ed9405`, `fe65ec199`, `67e87347b`, `40a01b95f` MCP/package/cloud transport work
  - `3cb5be767` agenthub visuals + treasury engine
  - `5af9b7e07` ops traces
- reason:
  - these are either experimental, adjacent platform work, or too large for the next promotion slice
  - none of them should block strengthening the main product loop

## Recommendation

1. Promote the docs/project-graph workflow slice first.
2. Follow immediately with the control-plane + execution-law tranche.
3. Review the security dependency sweep on its own.
4. Keep voice, NFT, MCP/cloud transport, and larger SIS runtime changes out of the next mainline promotion.
