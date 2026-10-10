-- Disposable PostgreSQL fixture, not a migration. Never run on production.
-- Column/constraint/RLS contract inspected read-only on 2026-10-10 in the
-- production database. The repository's January initial schema differs from it.
-- profiles is a minimal FK stand-in; production triggers, grants, auth delivery
-- and session creation are not reproduced. This does not certify live accounts.
\set ON_ERROR_STOP on
\getenv fixture_password READING_SCENE_FIXTURE_PASSWORD
begin;
do $$ begin
  if current_database() <> 'reading_scene_fixture'
     or to_regclass('public.creations') is not null then
    raise exception 'Requires an empty disposable reading_scene_fixture database';
  end if;
end $$;
create role anon nologin nobypassrls;
create role authenticated nologin nobypassrls;
create role authenticator login noinherit nobypassrls password :'fixture_password';
grant anon, authenticated to authenticator;
create schema auth;
-- Exact inspected auth.uid() body, including PostgREST's JSON claims path.
create function auth.uid() returns uuid language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;
grant usage on schema auth, public to anon, authenticated;
create table public.profiles (id uuid primary key);
insert into public.profiles values
  ('00000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000002');
create table public.creations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text default ''::text,
  content jsonb default '{}'::jsonb,
  type text not null default 'text'::text,
  status text not null default 'draft'::text,
  visibility text not null default 'private'::text,
  element text,
  gate text,
  guardian text,
  tags text[] default '{}'::text[],
  thumbnail_url text,
  view_count integer not null default 0,
  like_count integer not null default 0,
  ai_model text,
  ai_prompt text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector,
  constraint creations_element_check check (element = any(array['Fire','Water','Earth','Wind','Void','Spirit']::text[])),
  constraint creations_gate_check check (gate = any(array['Foundation','Flow','Fire','Heart','Voice','Sight','Crown','Shift','Unity','Source']::text[])),
  constraint creations_guardian_check check (guardian = any(array['Lyssandria','Leyla','Draconia','Maylinn','Alera','Lyria','Aiyami','Elara','Ino','Shinkami']::text[])),
  constraint creations_status_check check (status = any(array['draft','published','archived']::text[])),
  constraint creations_type_check check (type = any(array['text','image','video','audio','code','mixed']::text[])),
  constraint creations_visibility_check check (visibility = any(array['private','unlisted','public']::text[]))
);
alter table public.creations enable row level security;
-- Exact inspected expressions. RLS is exercised as non-owner, non-bypass roles.
create policy "Public creations are viewable by everyone" on public.creations
  for select using ((visibility = 'public'::text) or (user_id = (select auth.uid() as uid)));
create policy "Users can create own creations" on public.creations
  for insert with check ((select auth.uid() as uid) = user_id);
create policy "Users can delete own creations" on public.creations
  for delete using ((select auth.uid() as uid) = user_id);
create policy "Users can update own creations" on public.creations
  for update using ((select auth.uid() as uid) = user_id)
  with check ((select auth.uid() as uid) = user_id);
grant select, insert, update, delete on public.creations to anon, authenticated;
-- Fixture-only diagnostic, security invoker. No service-role credential exists.
create function public.reading_scene_fixture_contract() returns jsonb
language sql stable security invoker as $$
  select jsonb_build_object(
    'database', current_database(),
    'role', current_user,
    'uid', auth.uid(),
    'rlsEnabled', (select relrowsecurity from pg_class where oid='public.creations'::regclass),
    'tableOwner', (select pg_get_userbyid(relowner) from pg_class where oid='public.creations'::regclass),
    'roleBypass', (select rolbypassrls from pg_roles where rolname=current_user),
    'roleSuperuser', (select rolsuper from pg_roles where rolname=current_user),
    'policyCount', (select count(*) from pg_policies where schemaname='public' and tablename='creations')
  )
$$;
notify pgrst, 'reload schema';
commit;
