# World access policy repair

Status: proposed; production migration requires Frank's approval after review and tests.

The live database rejected an authenticated rollback-only world save with SQLSTATE
42P17: infinite recursion detected in policy for relation `worlds`. Its collaborator
SELECT policy reads `world_collaborators`, whose owner policies read `worlds` again.
The failed transaction left zero synthetic users and zero synthetic worlds.

The migration replaces only that collaborator lookup with a security-definer boolean
function in a schema outside the Data API. It checks the current JWT subject, accepts
no user ID, returns no world content, pins an empty search path and is owned by postgres.
It preserves owner management, public reads, member reads and membership revocation.
RLS stays enabled. Do not add `arcanea_world_access` to exposed API schemas.

The PostgreSQL 16 CI fixture reproduces the original error before applying the real
migration. It then checks owner writes, collaborator reads without edits, forbidden
ownership changes, outsider/anonymous isolation, unlisted isolation and revocation.
The fixture is disposable and must never be run on an application database.

After approval, apply only `20260912120000_world_policy_recursion.sql` to the verified
Arcanea app Supabase project. Repeat the rollback-only five-table save/reopen test,
including anonymous isolation and zero remaining fixtures. Database-role coverage
does not substitute for a signed-in browser save/reopen check.

Rollback, only if a new regression requires it: in one transaction replace the
`Collaborators can view worlds` policy with its original `EXISTS` membership query,
then drop `arcanea_world_access.current_user_collaborates_on_world(uuid)`. Do not drop
the schema if anything else now uses it. The old policy is known to recurse, so this
rollback restores the prior defect and should not be automatic.

Reference: [Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security)
and [security-definer functions in policies](https://supabase.com/docs/guides/troubleshooting/do-i-need-to-expose-security-definer-functions-in-row-level-security-policies-iI0uOw).
