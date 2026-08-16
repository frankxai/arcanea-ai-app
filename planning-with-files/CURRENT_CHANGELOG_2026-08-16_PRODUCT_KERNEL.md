# Product Kernel Foundation — 2026-08-16

## Task contract

Scope: add a provider-neutral policy/evidence kernel that every branded Arcanea product runtime can consume.

Owner: Arcanea AI / backend architecture.

Files:

- `packages/product-kernel/**`
- this execution receipt

Non-goals:

- no UI or route integration;
- no provider call or agent loop;
- no secret persistence;
- no database migration;
- no production deployment;
- no claim of legal certification or complete release readiness.

Acceptance criteria:

- tenant/user/run envelope validation;
- fail-closed region, ZDR, release-stage, credential-mode and run-budget model selection;
- effect-based tool approval bound to normalized arguments, tool version, expiry, idempotency and signed evidence;
- immutable usage/cost/policy/provenance event validation and deterministic receipt;
- R5 rejection and tenant/run isolation tests;
- dependency-free strict TypeScript package under 500 lines per source file.

Verification:

```bash
pnpm --filter @arcanea/product-kernel type-check
pnpm --filter @arcanea/product-kernel test
pnpm --filter @arcanea/product-kernel build
```

Rollback: remove `packages/product-kernel` and this receipt; no consumer or migration is introduced in this slice.

## Architecture decision

Exactly one runtime owns a run. The Product Kernel is not an orchestrator; it is the shared fail-closed policy and evidence boundary below Vercel AI SDK, OpenAI Agents SDK, Claude Agent SDK, Eve or an external host. Tenant-aware MCP and typed domain functions consume these decisions; Postgres/event storage remains business truth.
