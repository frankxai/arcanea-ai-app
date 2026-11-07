-- Arcanea P0 security remediation.
--
-- 1. Every public SECURITY DEFINER function without a pinned search_path gets
--    one. The loop uses the function identity signature, so it covers every
--    overload and any function added before this migration runs. Extension-owned
--    functions are excluded.
-- 2. Anonymous callers lose table-level SELECT on profiles, which exposed
--    stripe_customer_id, subscription_status and other private columns through
--    the public-profile policy. A safe projection is granted instead.
--    audit: public-view public_profiles
--
-- Intentional anonymous grants kept unchanged:
--   * luminors SELECT: public lore catalogue, policy requires is_public.
--   * arcanea_applications INSERT: public application form, write-only.

begin;

do $$
declare
  routine record;
begin
  for routine in
    select
      n.nspname as schema_name,
      p.proname as function_name,
      pg_get_function_identity_arguments(p.oid) as identity_args
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
      and not exists (
        select 1
        from unnest(coalesce(p.proconfig, '{}'::text[])) as config
        where config like 'search_path=%'
      )
      and not exists (
        select 1
        from pg_depend d
        where d.objid = p.oid and d.deptype = 'e'
      )
  loop
    execute format(
      'alter function %I.%I(%s) set search_path = pg_catalog, public',
      routine.schema_name,
      routine.function_name,
      routine.identity_args
    );
  end loop;
end;
$$;

revoke select on table public.profiles from anon;

create or replace view public.public_profiles as
select
  p.id,
  to_jsonb(p) ->> 'username' as username,
  to_jsonb(p) ->> 'display_name' as display_name,
  to_jsonb(p) ->> 'avatar_url' as avatar_url,
  to_jsonb(p) ->> 'bio' as bio,
  to_jsonb(p) ->> 'arcanean_id' as arcanean_id,
  to_jsonb(p) ->> 'tier' as tier,
  to_jsonb(p) ->> 'magic_rank' as magic_rank,
  (to_jsonb(p) ->> 'gates_open')::integer as gates_open,
  to_jsonb(p) ->> 'active_gate' as active_gate,
  to_jsonb(p) ->> 'guardian' as guardian,
  to_jsonb(p) ->> 'academy_house' as academy_house,
  (to_jsonb(p) ->> 'xp')::integer as xp,
  (to_jsonb(p) ->> 'level')::integer as level,
  (to_jsonb(p) ->> 'streak_days')::integer as streak_days,
  (to_jsonb(p) ->> 'creation_count')::integer as creation_count,
  (to_jsonb(p) ->> 'follower_count')::integer as follower_count,
  (to_jsonb(p) ->> 'following_count')::integer as following_count,
  (to_jsonb(p) ->> 'is_verified')::boolean as is_verified,
  (to_jsonb(p) ->> 'created_at')::timestamptz as created_at
from public.profiles p
where coalesce((to_jsonb(p) ->> 'is_active')::boolean, true);

revoke all on public.public_profiles from public, anon, authenticated;
grant select on public.public_profiles to anon, authenticated;

comment on view public.public_profiles is
  'Allowlisted public profile fields. Anonymous clients read this view; the profiles table remains closed to them.';

commit;
