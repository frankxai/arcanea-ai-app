# Bounded request-identity caching for Arcanea policies

Scope: the 68 policies flagged by the connected Arcanea performance advisor on 30 October 2026.
Owner: Codex. Owning quality issue: https://github.com/frankxai/arcanea-ai-app/issues/427.
Base: `bff204b254b7358f8db8c64ecbf576c099d1c9bd`.
Branch: `agent/codex/rls-initplans-20261030`.
User job: read and edit owned work without paying for repeated request identity evaluation for every scanned row.
Budget: one bounded database change; no new provider, paid resource or model calls.

## Implementation

The policy snapshot records catalog definitions, not customer rows or tokens.
The migration wraps only zero-argument `auth.uid()` / `auth.role()` calls in scalar SELECTs.
It preserves policy names, target roles, commands, permissive/restrictive mode, USING predicates and explicit/implicit WITH CHECK behavior.
Existing broad policies and overlapping permissive policies retain their existing semantics; this change does not claim to repair them.

The patch locks the affected relations in stable order, checks every recorded definition and fails on drift or lock contention.
Its single DO statement rolls back all preceding edits when any later policy fails its precondition.
It can be applied twice. Rollback restores the exact original predicates under the same drift checks.

The migration filename was created by Supabase CLI 2.122.0 with `supabase migration new cache_request_identity_in_rls`.
The SQL is reproducible with `node scripts/rls-initplans.mjs`.
Rollback SQL: `node scripts/rls-initplans.mjs --rollback`.
Never feed the rollback to production without first reconciling any intervening policy changes.

## Verification

- Five Node tests pass for bounded identities, grant-preserving SQL, duplicate/schema rejection, existing wrappers, null checks and rollback generation.
- The complete generated fixture passes on PostgreSQL 18.6 through scratch-only PGlite 0.5.13. This is local SQL evidence, not the production PostgreSQL 17 version.
- The fixture verifies owner reads/inserts/deletes, denied foreign writes and reassignment, anonymous private reads, public chapter reads and the existing service-role predicate before/after/repeat application/rollback.
- All 68 predicates are compared against the baseline after removing only scalar identity wrappers. Grants and command modes are compared too.
- Missing policies, role drift, WITH CHECK drift and USING drift reject the patch. The late-failure case verifies atomic rollback of earlier edits.
- CI reuses the existing PostgreSQL 17 service with a separate disposable database; no additional job or cloud database is introduced.
- Estate Guard on the materialized changed-file scope: zero critical/high/medium; ten pre-existing low workflow action-pin findings.
- Current official source: https://supabase.com/docs/guides/database/postgres/row-level-security (scalar SELECT request identity pattern).

## Release boundary

State: built and locally checked; receiving CI and independent review pending.
No production migration has been applied by this work. No database latency or customer success improvement is claimed yet.
Acceptance requires PostgreSQL 17 fixture success, required build/lint/type checks on the exact candidate, independent review, and post-migration advisor/catalog verification.
Any mismatch between the snapshot and receiving schema stops release; refresh and review the snapshot rather than weakening the guard.
Do not drop indexes or consolidate policies as part of this patch.

Recovery: execute the reviewed rollback generated from this snapshot; revert the bounded source commit separately.
