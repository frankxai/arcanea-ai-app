# World Context Gateway v1 execution contract

Date: 2026-08-25

Owner: Arcanea platform / `arcanea-ai-app`

Integration base: `origin/main` at `9fc53dc0e5f75357c812837e0de9424c8c4a3861`

Branch: `codex/arcanea-world-context-gateway-v1`

## Outcome

Land the first trustworthy Arcanea Gateway vertical slice: a fresh, stateless
MCP server exposing only `arcanea_get_world_context`, backed by a transport-
neutral, deterministic World Context domain boundary and an explicitly gated
Supabase owner/source compatibility adapter.

## Owned files

- `packages/arcanea-mcp/src/gateway/**`
- `packages/arcanea-mcp/tests/world-context-gateway.test.mjs`
- `packages/arcanea-mcp/package.json`
- `apps/web/lib/mcp/**`
- `apps/web/app/api/mcp/route.ts`
- `apps/web/package.json`
- the corresponding `pnpm-lock.yaml` importer updates
- this execution contract and bounded architecture/runbook evidence

## Non-goals

- no database migration or live-schema mutation;
- no collaborator, tenant, or non-owner role claim;
- no claim of durable rate-window, classification, provenance-ledger, or canon-
  conflict authority;
- no mutation, provider/model routing, media spend, marketplace, Studio, or
  publishing action;
- no OpenAI Apps SDK UI, Agents SDK orchestration, Google ADK/A2A topology, or
  legacy 54-tool MCP exposure;
- no Vercel project/runtime/DNS/secret/permission mutation and no direct
  production promotion.

## Acceptance

1. A fresh server factory registers exactly one read-only tool.
2. Missing/invalid bearer identity fails closed before request-body handling.
3. World reads use immutable UUID plus verified actor, explicit owner binding,
   user-scoped Supabase/RLS, allowlisted fields, and indistinguishable absent /
   unauthorized results.
4. Normalization is NFKC/lowercase/collapsed whitespace and request/snapshot
   hashes use RFC 8785 JSON Canonicalization Scheme plus SHA-256.
5. Query text never expands selection; at least one exact entity or source ID
   is required; inventory requests and unavailable canon states fail closed.
6. Full authorized snapshot revision is stable under row reordering, changes
   when any full allowlisted source content changes (including beyond response
   truncation), is independent of query filtering, and fails closed above the
   compatibility source code-unit/byte/depth/node bounds before
   canonicalization.
7. Every returned entity resolves to matching provenance, all bounds are
   deterministic, structured output stays within a 1,000,000-byte UTF-8 budget
   without duplicating it into text content, and logs contain no token, raw
   query, or private payload.
8. Streamable HTTP is POST-only, stateless, JSON-response, fresh per request,
   same-origin/no-Origin checked, body-bounded, protected by a world-independent
   per-actor admission window before repository work, and does not expose
   sessions or legacy tools.
9. Compatibility mode is disabled by default and is named honestly when
   explicitly enabled for protected preview verification.

## Verification

- package build and targeted Node tests;
- real raw JSON-RPC initialize, tools/list, and tools/call requests;
- concurrent actor/world isolation test;
- targeted web adapter/route tests and ESLint;
- web type-check and bounded workspace build under the machine preflight;
- dependency/security scan and independent code review;
- PR preview inspection only when existing Vercel protection permits a safe
  authenticated test path.

## Rollback

The runtime is off unless `ARCANEA_WORLD_CONTEXT_GATEWAY_MODE` is exactly
`compatibility-preview`. Operational rollback is therefore deleting or
unsetting that value. Code rollback is the single feature commit/PR revert;
there is no schema or data rollback.

## Human gates retained

Supabase OAuth Server enablement, consent UI, scopes/audience policy, live
schema introspection/regeneration, database authority tables, secrets, Vercel
runtime reconciliation, production promotion, and public connector publication
all require separate approval/evidence.
