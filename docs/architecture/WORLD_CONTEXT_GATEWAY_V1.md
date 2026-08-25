# Arcanea World Context Gateway v1

Date: 2026-08-25

Runtime owner: `arcanea-ai-app`

Public contract owner: `arcanea-agent-skills` 0.3.0

Current status: code-complete compatibility preview; disabled by default;
production authority not connected

## Product position

Arcanea should be one creator operating system with several delivery surfaces,
not several competing runtimes:

| Layer                     | Owns                                                                                                   | Does not own                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Arcanea plugin and skills | discovery, creator language, guided workflows, taste, canon discipline, portable draft work            | identity, durable private state, rate/spend authority, publication |
| Arcanea Gateway (MCP)     | stable outcome-level tools, authenticated world access, policy, revisions, provenance, receipts        | model-specific orchestration or a proprietary chat shell           |
| MCP App UI                | compact interactive review/approval experiences inside capable hosts                                   | the canonical datastore or business policy                         |
| OpenAI Agents SDK         | optional OpenAI-native orchestration, tracing, handoffs, and long-running workers behind Gateway tools | Arcanea's public product boundary                                  |
| Google ADK/A2A            | optional Gemini/Google orchestration and agent-to-agent topology behind Gateway tools                  | Arcanea's public product boundary                                  |

The stable moat is a provenance-rich world graph plus creator taste signals,
canon lineage, Guild trust, evals, and release receipts. Prompt/skill quantity,
SDK lock-in, and a large ungoverned MCP tool inventory are not defensible moats.

## First vertical slice

`arcanea_get_world_context` is the only hosted tool in this slice. It is:

- read-only and idempotent;
- addressed by immutable world UUID;
- authenticated before body parsing;
- owner-bound through a user-scoped Supabase client and RLS;
- selector-bounded: query text cannot widen retrieval;
- source-only in compatibility mode;
- hashed from the full allowlisted source record before bounded response
  truncation;
- revisioned with RFC 8785/JCS plus SHA-256;
- provenance-linked at every returned entity;
- capped at 1,000,000 serialized UTF-8 bytes for structured content, with a
  concise non-duplicating text result and explicit `coverage.truncated`;
- stateless Streamable HTTP over POST with a fresh server and transport per
  request; and
- isolated from the legacy 54-tool singleton MCP server.

```text
MCP client
  -> POST /api/mcp
  -> mode + method + same-origin/no-Origin gate
  -> Supabase bearer validation
  -> bounded single JSON-RPC request
  -> per-actor preview admission window
  -> user-scoped RLS client
  -> owner + immutable world UUID decision
  -> allowlisted source snapshot
  -> JCS snapshot revision
  -> exact selector + state + visibility checks
  -> preview authority binding/rate window
  -> one structured World Context result
```

GET, DELETE, and OPTIONS return 405. The slice has no SSE stream, sessions,
notifications, Redis requirement, legacy tool discovery, or browser UI.
Cross-origin browser CORS is intentionally unsupported: an Origin header must
exactly match the endpoint origin, while backend MCP clients normally omit it.

## Compatibility data surface

The current committed migrations and generated/live types disagree. Therefore
the preview reads only columns present in the generated live types and committed
application surface:

- `worlds`;
- `world_characters`, excluding agent system prompts, model configuration, and
  agent memory namespaces;
- `world_factions`; and
- `world_locations`.

It excludes memories, prompts, events, creations, lore/assets missing from the
generated type surface, project documents without a world foreign key, and all
collaborator-role claims. Every child query is exact-column, owner-scoped via
the verified client, deterministically ordered, exact-count checked, and fails
closed when the full bounded result cannot be proven.

Compatibility snapshots are limited to 100 rows per child entity type,
2,000,000 aggregate string/key UTF-16 code units, a non-allocating conservative
2,000,000-byte canonical UTF-8 preflight, an exact canonical byte check, depth
32, and 50,000 traversed JSON nodes before record hashing. These post-fetch
checks prevent unbounded canonicalization, hashing, and response work. They
cannot stop PostgREST from transferring one unusually wide unconstrained
TEXT/JSONB row into the isolate first, so preview activation must remain
protected; production requires database-side field constraints or a stored
digest/revision authority.

DB visibility maps as follows:

- `private` -> `private`;
- `unlisted` -> `restricted`;
- `public` -> `public`.

`public-only` against a private or restricted world is denied. It never turns
an unlisted world into public content.

## Runtime activation

The route returns `503 adapter-required` unless:

```text
ARCANEA_WORLD_CONTEXT_GATEWAY_MODE=compatibility-preview
```

No environment value is added or changed by this release. Enabling the preview
is an operator decision. The required Supabase public URL and anon key must be
real; placeholder/missing configuration fails closed. A service-role key is
never accepted by this boundary.

The mode name is deliberate. Its personal tenant ID, deterministic owner grant,
per-isolate actor admission window, actor+world authority window,
classification record, and provenance are compatibility-derived. The actor
admission window runs before repository work and cannot be bypassed by cycling
world IDs. These controls prove binding behavior but are not durable multi-node
authorities.

Response fitting preserves the relevance-sorted entity prefix first and uses
remaining bytes for conflicts. Compatibility mode has no conflict index, so
this policy currently affects source entities only; production conflict
prioritization remains part of the durable canon adapter gate.

## Production authority gate

Do not rename this runtime to `connected` or publish it as an OAuth connector
until all of the following exist and have isolated integration tests:

1. Live schema introspection and regenerated committed Supabase types.
2. Tenant/world memberships with constrained Gateway roles, durable grant IDs,
   active/revoked lifecycle, and RLS.
3. Atomic canonical snapshot/revision authority covering the declared world
   source surface, with database-side stored digests or enforced source
   byte/depth constraints so the runtime never downloads unbounded rows.
4. Immutable source/provenance ledger plus explicit canon-state and conflict
   indexes.
5. Transactional 20/min tenant+actor+world rate windows and durable bounded-
   query classification/context-authority records with retention/deletion
   policy.
6. Duplicate-member-safe I-JSON parsing before JCS hashing.
7. Supabase OAuth 2.1 Server enablement, consent experience, protected-resource
   metadata, explicit scopes such as `worlds:read`, and resource/audience
   validation. Tokens may not be passed through to downstream services.
8. Node runtime reconciliation across repository policy (20), `.nvmrc` (22),
   and current Vercel project configuration (24).
9. Protected Vercel preview verification with a real test creator/world, runtime
   log inspection, and no token/query/private-payload leakage.

Schema changes, OAuth/dashboard configuration, secrets, runtime changes, DNS,
production promotion, and public connector publication remain human-gated.

## Verification and rollback

Blocking local/CI gates:

```text
pnpm --dir packages/arcanea-mcp test:gateway
pnpm --dir apps/web test:mcp-world-context
pnpm --dir apps/web type-check
pnpm --dir apps/web exec eslint app/api/mcp/route.ts lib/mcp --max-warnings=0
pnpm turbo run build --filter=@arcanea/web
```

Operational rollback is unsetting `ARCANEA_WORLD_CONTEXT_GATEWAY_MODE`. Code
rollback is a feature-commit revert; the slice writes no schema or creator data.
