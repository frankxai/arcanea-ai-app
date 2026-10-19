-- CI-only Auth extension of reading-scene-postgrest.sql; never a migration.
\set ON_ERROR_STOP on
\getenv fixture_password READING_SCENE_FIXTURE_PASSWORD
begin;
do $$ begin
  if current_database() <> 'reading_scene_fixture'
     or to_regclass('public.creations') is null
     or to_regclass('auth.users') is not null
     or not exists (select 1 from pg_class where oid = 'public.creations'::regclass and relrowsecurity) then
    raise exception 'Requires the disposable reader fixture before Auth bootstrap';
  end if;
end $$;
create role supabase_auth_admin login password :'fixture_password';
alter schema auth owner to supabase_auth_admin;
alter function auth.uid() owner to supabase_auth_admin;
alter role supabase_auth_admin set search_path = auth, public;
grant create on database reading_scene_fixture to supabase_auth_admin;
-- Minimal account projection for the real app session/profile queries.
-- This does not reproduce production profile provisioning or triggers.
alter table public.profiles add column username text;
alter table public.profiles add column full_name text;
alter table public.profiles add column avatar_url text;
alter table public.profiles add column role text default 'user';
alter table public.profiles add column gates_open integer default 1;
alter table public.profiles add column metadata jsonb default '{"onboardingComplete":true}';
alter table public.profiles enable row level security;
create policy "Fixture users read own profile" on public.profiles for select using (id = auth.uid());
grant select on public.profiles to anon, authenticated;
notify pgrst, 'reload schema';
commit;
