-- Disposable CI ONLY. This is a read/write projection fixture, not a migration
-- or a full production clone. Relevant columns and owner/public policy predicates
-- were inspected on 2026-10-10. Billing, triggers, grants and other products are
-- deliberately outside this fixture's evidence. Never apply to a hosted project.
create schema if not exists auth;
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create role authenticator login noinherit password :'fixture_password';
create role supabase_auth_admin login password :'fixture_password';
alter schema auth owner to supabase_auth_admin;
grant create on database postgres to supabase_auth_admin;
grant anon, authenticated, service_role to authenticator;
create function auth.uid() returns uuid language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'))::uuid
$$;
-- GoTrue's initial migration replaces uid(); it must own that function. Its
-- legacy definition is refreshed to the inspected claims-compatible form after
-- Auth migrations finish, before any app or PostgREST request is accepted.
alter function auth.uid() owner to supabase_auth_admin;
alter role supabase_auth_admin set search_path = auth, public;
grant usage on schema public, auth to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;

create table public.profiles (
  id uuid primary key, username text, full_name text, avatar_url text,
  onboarding_completed boolean default true, role text default 'user'
);
alter table public.profiles enable row level security;
create policy fixture_profile_owner on public.profiles for all using (id = auth.uid());
create table public.worlds (
  id uuid primary key default gen_random_uuid(), creator_id uuid not null,
  slug text unique not null, name text not null, tagline text, description text,
  elements jsonb default '[]', laws jsonb default '[]', systems jsonb default '[]',
  palette jsonb default '{}', mood text, hero_image_url text,
  visibility text default 'private' check (visibility in ('private','unlisted','public')),
  license text default 'personal' check (license in ('personal','cc-by','commercial','open')), version text default '0.1.0',
  character_count integer default 0, creation_count integer default 0,
  star_count integer default 0, fork_count integer default 0,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table public.world_collaborators (
  world_id uuid references public.worlds(id), user_id uuid not null,
  role text check (role in ('viewer','editor','admin')), primary key(world_id,user_id)
);
create schema arcanea_world_access;
create function arcanea_world_access.current_user_collaborates_on_world(target_world uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.world_collaborators wc
    where wc.world_id = target_world and wc.user_id = auth.uid());
$$;
revoke all on schema arcanea_world_access from public;
revoke all on function arcanea_world_access.current_user_collaborates_on_world(uuid) from public;
grant usage on schema arcanea_world_access to anon, authenticated;
grant execute on function arcanea_world_access.current_user_collaborates_on_world(uuid) to anon, authenticated;
alter table public.worlds enable row level security;
alter table public.world_collaborators enable row level security;
create policy "Creators manage own worlds" on public.worlds for all using (auth.uid() = creator_id);
create policy "Public worlds are viewable" on public.worlds for select using (visibility = 'public');
create policy "Collaborators can view worlds" on public.worlds for select using (arcanea_world_access.current_user_collaborates_on_world(id));
create policy "Collaborators can view membership" on public.world_collaborators for select using
  (auth.uid() = user_id or exists (select 1 from public.worlds w where w.id = world_id and w.creator_id = auth.uid()));
create policy "World owners manage collaborators" on public.world_collaborators for all using
  (exists (select 1 from public.worlds w where w.id = world_id and w.creator_id = auth.uid()));
create table public.world_characters (
  id uuid primary key, world_id uuid not null references public.worlds(id), name text not null,
  title text, origin_class text, backstory text, motivation text, personality jsonb not null default '{}',
  portrait_url text, is_agent boolean default false, element text, gate integer check(gate >= 1 and gate <= 10)
);
create table public.world_locations (
  id uuid primary key, world_id uuid not null references public.worlds(id), name text not null,
  description text, region text, significance text, image_url text, coordinates jsonb
);
create table public.world_events (
  id uuid primary key, world_id uuid not null references public.worlds(id), title text not null,
  description text, era text, date_in_world text, consequences text, sort_order integer default 0,
  location_id uuid, characters_involved uuid[] default '{}'
);
create table public.world_creations (
  id uuid primary key, world_id uuid not null references public.worlds(id), creator_id uuid not null,
  type text not null check (type in ('text','image','music','code','document')),
  title text not null, content text, prompt text, is_public boolean default false
);
create table public.world_factions (
  id uuid primary key, world_id uuid references public.worlds(id), name text,
  history text, philosophy text, territory text
);
alter table public.world_characters enable row level security;
alter table public.world_locations enable row level security;
alter table public.world_events enable row level security;
alter table public.world_creations enable row level security;
alter table public.world_factions enable row level security;
create policy "Creators manage own characters" on public.world_characters for all using
  (exists (select 1 from public.worlds w where w.id = world_id and w.creator_id = auth.uid()));
create policy "Characters follow world visibility" on public.world_characters for select using
  (exists (select 1 from public.worlds w where w.id = world_id and (w.visibility = 'public' or w.creator_id = auth.uid())));
create policy "Creators manage own locations" on public.world_locations for all using
  (exists (select 1 from public.worlds w where w.id = world_id and w.creator_id = auth.uid()));
create policy "Locations follow world visibility" on public.world_locations for select using
  (exists (select 1 from public.worlds w where w.id = world_id and (w.visibility = 'public' or w.creator_id = auth.uid())));
create policy "Creators manage own events" on public.world_events for all using
  (exists (select 1 from public.worlds w where w.id = world_id and w.creator_id = auth.uid()));
create policy "Events follow world visibility" on public.world_events for select using
  (exists (select 1 from public.worlds w where w.id = world_id and (w.visibility = 'public' or w.creator_id = auth.uid())));
-- Preserve the inspected source policy; this fixture does not certify arbitrary
-- direct Data API writes that associate a creation with another owner's world.
create policy "Creators manage own creations" on public.world_creations for all using (auth.uid() = creator_id);
create policy "Public creations viewable" on public.world_creations for select using (is_public = true);
-- Empty compatibility table only: faction authorization is not certified here.
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant all on all tables in schema public to service_role;
