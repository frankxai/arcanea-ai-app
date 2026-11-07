# Arcanea P0 security remediation: definer search paths and anonymous profiles

- Date: 7 November 2026
- Author: OpenCode build lane
- Base revision: `0bc84365469` (`origin/main`, 7 November 2026)
- Migration: `supabase/migrations/20261107000001_arcanea_p0_security.sql`
- Status: built; not applied to any database

## Finding

The estate audit of `supabase/migrations` (23 files) reported 69 high findings. Two of them
are exploitable by an anonymous visitor:

1. **25 `SECURITY DEFINER` functions without `search_path`.** With a writable schema earlier in
   `search_path`, a definer function can be pointed at an attacker-controlled object and run with
   the owner's privileges. The legacy policy functions and every trigger helper are in this set.
2. **`GRANT SELECT ON profiles TO anon`.** The policy `"Public profiles are viewable by everyone"`
   allows public read, but the table grant also exposes `stripe_customer_id`,
   `subscription_status`, `subscription_tier`, `location`, `website`, `preferences` and
   `metadata`. Row visibility was intended; column visibility was not.

The other three anon grants are intentional and stay: `luminors` SELECT (public lore catalogue,
gated by `is_public`), `arcanea_applications` INSERT (public application form, write-only), and
schema USAGE.

## What the migration does

| Step                          | Mechanism                                                                                                                                                                                                                                              | Why this shape                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Pin `search_path`             | one `DO` block that reads `pg_proc` for `prosecdef`, skips functions that already have `search_path`, skips extension-owned functions, and executes `ALTER FUNCTION … SET search_path = pg_catalog, public` using `pg_get_function_identity_arguments` | Covers every overload and any function created before the migration runs, without a hand-maintained list that drifts |
| Revoke anonymous profile read | `REVOKE SELECT ON public.profiles FROM anon`                                                                                                                                                                                                           | The table stays readable for `authenticated` and for server code using the service role                              |
| Provide the public projection | `CREATE OR REPLACE VIEW public.public_profiles` with an explicit column allowlist, `WHERE coalesce(is_active, true)`, granted to `anon, authenticated`                                                                                                 | Public profile pages keep working without exposing billing or contact columns                                        |
| Keep intentional surfaces     | no change to `luminors` or `arcanea_applications` grants, documented in the file header                                                                                                                                                                | A P0 slice should not change product behaviour it was not asked to change                                            |

The view projects through `to_jsonb(p) ->> 'column'` so it survives the schema drift between the
committed migrations and the live database (the generated types carry `magic_rank`, `gates_open`,
`guardian`, `academy_house`, `xp`, `level`, `streak_days` and `subscription_tier`, none of which
exist in the initial migration).

## Application changes

Anonymous readers moved from `profiles` to `public_profiles`:

- `apps/web/app/api/profiles/[username]/route.ts`
- `apps/web/app/api/books/[slug]/ratings/route.ts`
- `apps/web/app/api/community/stats/route.ts`
- `apps/web/components/books/ReviewList.tsx`

Authenticated readers were left alone: they still read `profiles` under the existing policies.

## Verification

**Static contract test** (`scripts/tests/p0-security-migration-contract.test.mjs`, 4 cases):
the DO block reads `prosecdef`, uses identity arguments, skips extension members, sets the path;
anon loses the table grant and gains only the view; the view allowlist excludes billing, contact,
preference, metadata and email columns; intentional grants are documented and no table is dropped.

**Runtime test** (`scripts/tests/p0-security-migration-runtime.test.mjs`, 5 cases) applies the
real migration to PGlite with Supabase-shaped roles and stubbed tables, then switches role:

- the migration applies twice (idempotent);
- all four definer functions, including two `touch_profile` overloads, end up with a pinned path;
- `SET ROLE anon; SELECT * FROM profiles` fails with `permission denied`, while the view returns
  one row and no billing, subscription, contact or preference column;
- `luminors` read and `arcanea_applications` insert still work for anon; the applications table
  still denies SELECT;
- dropping the view is a complete rollback and leaves the table grant revoked.

Both run in CI as `pnpm run test:security`, together with the baseline-aware auditor.

**Auditor ratchet** (`scripts/audit-migrations.mjs` + `scripts/migration-audit-baseline.json`):
82 findings over 42 SQL files are baselined by fingerprint; a new high-severity finding fails CI.
The baseline is expected to shrink as the remaining 26 permissive policies, 11 tables without
same-file RLS and 2 destructive statements are reviewed in later slices.

## Rollout

1. Review and merge. CI must pass.
2. Apply with the Supabase CLI or dashboard SQL editor, on a database where the `profiles` view
   columns match the allowlist. Both production and any branch.
3. After apply, confirm: `has_table_privilege('anon','public.profiles','select')` is false;
   `select count(*) from public.public_profiles` succeeds as `anon`; an anonymous profile page
   renders.
4. Deploy the app change immediately after the migration. Before the migration, the new view does
   not exist and the profile API returns 404/503; after it, `profiles` is closed, so deploying the
   app first would break anonymous profile reads.

## Rollback

```sql
drop view if exists public.public_profiles;
grant select on table public.profiles to anon;
-- search_path changes are additive and safe to keep; to undo a specific function:
-- alter function public.<name>(<args>) reset search_path;
```

Reverting the app commit restores the previous readers.

## Remaining P0/P1 queue after this slice

- 26 permissive policies (`using (true)`): classify public-read versus write, then narrow.
- 11 tables without same-file RLS: confirm the DO-block loop covers them at runtime, then add
  explicit enables.
- 2 destructive statements: review for intent and reversibility.
- 2 anon policies: confirm the `arcanea_claw_tables` policy at line 314 is read-only.
