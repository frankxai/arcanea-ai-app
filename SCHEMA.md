# Arcanea schema boundaries

The product owns its data schemas and migrations. Cross-estate interfaces adapt
to product data; they do not create a shared database or grant access to a user's
workspace. Read [AGENTS.md](AGENTS.md) and [SYSTEM.md](SYSTEM.md) before changing
those boundaries.

## Existing contract vocabulary

| Contract                         | Scope                                       |
| -------------------------------- | ------------------------------------------- |
| `starlight.repo_profile.v2`      | Repository identity and ownership           |
| `starlight.team_profile.v2`      | Team responsibility                         |
| `starlight.product_event.v1`     | Product/funnel events when emitted          |
| `starlight.entitlement.v1`       | Product access when granted                 |
| `starlight.operation_receipt.v1` | Delivery, verification and release evidence |
| `starlight.run_receipt.v1`       | Bounded agent work                          |

These names are recovered interface contracts. Listing them is not proof that
every product route emits or validates them. PII and private prompts must stay
out of product analytics events. Verify actual emitters and consumers before
asserting runtime adoption.

## Product sources

- `packages/schemas/src/world-graph.ts`: product world-graph schema source.
- `apps/web/lib/projects/`: project context and retrieval behavior.
- `packages/arcanea-mcp/src/gateway/schema.ts`: MCP gateway input contracts.
- `packages/arcanea-mcp/src/tools/graph-validation.ts`: MCP graph validation.
- `apps/web/lib/supabase/` and `supabase/`: database access and migration sources.

The live database and historical migrations may differ. An enabled-RLS flag or
synthetic schema fixture does not prove real account isolation. Verify ordinary
authenticated reads/writes, second-account and anonymous denial, partial saves,
retries, reopening and production grants/triggers through the owning lane.

## Proposed mission and creation interfaces

The [delivery-team proposal](docs/architecture/ARCANEA_DELIVERY_TEAM.md) calls for
mission inputs to identify the owning issue, actor, project, source revision/hash,
allowed files/tools, budget, acceptance and cancellation. Creation lineage should
retain the source passage/version, interpretation, provider/model, request identity,
rights, edits and authorized export references. User credentials and raw private
transcripts are excluded from portable receipts.

These are proposed adapter requirements. Edge-payload validation, durable mission
state, dollar enforcement and public HTTP authorization still need implementation
and owner acceptance. User-supplied actor/project IDs never replace server-side
authorization. Canon promotion and a community share require separate decisions.

Restore or undo this documentation without changing database policies, rows or
migrations. Historical source: `b4c990e5d4639f230f6d59b82c949aa386af45ed`.
