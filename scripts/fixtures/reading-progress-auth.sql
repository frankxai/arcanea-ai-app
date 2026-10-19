-- CI-only extension of the existing reading-scene Auth fixture. Not a migration.
-- Selected DML contract inspected through read-only live metadata on 2026-10-12.
-- Reproduces columns/defaults/constraints/indexes and all three RLS expressions.
-- Production triggers, schema lifecycle, complete grants and web/project binding
-- are not certified. No SQL or customer data is sent to a production database.
\set ON_ERROR_STOP on
begin;
do $$ begin
  if current_database() <> 'reading_scene_fixture'
     or to_regclass('auth.users') is null
     or to_regclass('public.profiles') is null
     or to_regclass('public.reading_progress') is not null then
    raise exception 'Requires disposable reader Auth before progress bootstrap';
  end if;
end $$;
create table public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  text_slug text not null,
  collection_slug text not null,
  progress_percent integer not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, text_slug)
);
create index idx_reading_progress_user_id on public.reading_progress(user_id);
create index idx_reading_progress_collection on public.reading_progress(user_id, collection_slug);
alter table public.reading_progress enable row level security;
create policy "Users can insert own reading progress" on public.reading_progress
  for insert with check (user_id = (select auth.uid() as uid));
create policy "Users can update own reading progress" on public.reading_progress
  for update using (user_id = (select auth.uid() as uid));
create policy "Users can view own reading progress" on public.reading_progress
  for select using (user_id = (select auth.uid() as uid));
-- Exercise actual row policies, including anonymous denial, with DML grants.
-- No DELETE policy exists; authenticated and anonymous deletes must affect zero.
grant select, insert, update, delete on public.reading_progress to anon, authenticated;
create function public.reading_progress_fixture_contract() returns jsonb
language sql stable security invoker as $$
  select jsonb_build_object(
    'database', current_database(),
    'role', current_user,
    'uid', auth.uid(),
    'rlsEnabled', (select relrowsecurity from pg_class where oid='public.reading_progress'::regclass),
    'tableOwner', (select pg_get_userbyid(relowner) from pg_class where oid='public.reading_progress'::regclass),
    'roleBypass', (select rolbypassrls from pg_roles where rolname=current_user),
    'roleSuperuser', (select rolsuper from pg_roles where rolname=current_user),
    'policyCount', (select count(*) from pg_policies where schemaname='public' and tablename='reading_progress')
  )
$$;
notify pgrst, 'reload schema';
commit;
