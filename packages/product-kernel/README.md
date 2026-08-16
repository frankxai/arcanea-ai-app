# @arcanea/product-kernel

Provider-neutral contracts and fail-closed policy functions for every Arcanea product run.

This package is intentionally smaller than an agent framework. It does not own a model loop, database, provider credential, UI or business state. A Vercel AI SDK, OpenAI Agents SDK, Claude Agent SDK, Eve or external host adapter may own a run; each consumes the same kernel decisions and tenant-aware tools.

## Guarantees

- validates a tenant/user/run envelope before inference;
- selects only a provider/model fallback that satisfies allowlists, region, ZDR, GA/preview, credential mode, currency and worst-case run budget;
- authorizes tool effects outside prompts, with fail-closed R5, effect-based approvals, normalized argument hashes, tool versions, expiry, signed evidence and idempotency;
- validates append-only usage, cost, policy and provenance events without storing raw prompts;
- produces a deterministic per-run receipt suitable for a Postgres event-ledger adapter.

## Non-guarantees

This is a code primitive, not legal certification or a complete product release gate. Tenant authentication, RLS, secret encryption, cumulative entitlement limits, provider dispatch, database persistence, deletion fan-out, evals and regulatory release receipts must be supplied by their owning adapters.

```bash
pnpm --filter @arcanea/product-kernel type-check
pnpm --filter @arcanea/product-kernel test
pnpm --filter @arcanea/product-kernel build
```

