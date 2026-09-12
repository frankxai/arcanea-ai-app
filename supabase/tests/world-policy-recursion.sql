-- Disposable PostgreSQL fixture only. Never run against an application database.
\set ON_ERROR_STOP on
begin;
create role anon;
create role authenticated;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select (nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'sub')::uuid
$$;
grant usage on schema auth to anon, authenticated;
create table public.worlds (
  id uuid primary key,
  creator_id uuid not null references auth.users(id),
  name text not null,
  visibility text not null check (visibility in ('private', 'unlisted', 'public'))
);
create table public.world_collaborators (
  world_id uuid references public.worlds(id),
  user_id uuid references auth.users(id),
  primary key (world_id, user_id)
);
alter table public.worlds enable row level security;
alter table public.world_collaborators enable row level security;
grant select, insert, update, delete on public.worlds, public.world_collaborators to authenticated;
grant select on public.worlds, public.world_collaborators to anon;

-- Exact logical policies observed in production on 2026-09-12.
create policy "Creators manage own worlds" on public.worlds for all using (auth.uid() = creator_id);
create policy "Public worlds are viewable" on public.worlds for select using (visibility = 'public');
create policy "Collaborators can view worlds" on public.worlds for select using (
  exists (select 1 from public.world_collaborators wc where wc.world_id = worlds.id and wc.user_id = auth.uid())
);
create policy "Collaborators can view membership" on public.world_collaborators for select using (
  auth.uid() = user_id or exists (select 1 from public.worlds w where w.id = world_collaborators.world_id and w.creator_id = auth.uid())
);
create policy "World owners manage collaborators" on public.world_collaborators for all using (
  exists (select 1 from public.worlds w where w.id = world_collaborators.world_id and w.creator_id = auth.uid())
);

set local role authenticated;
do $$ begin
  begin
    perform count(*) from public.worlds;
    raise exception 'Fixture did not reproduce policy recursion';
  exception when sqlstate '42P17' then
    raise notice 'Confirmed original worlds policy recursion';
  end;
end $$;
reset role;

\ir ../migrations/20260912120000_world_policy_recursion.sql

insert into auth.users values
  ('00000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000002'),
  ('00000000-0000-4000-8000-000000000003');
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';
insert into public.worlds values
  ('10000000-0000-4000-8000-000000000001', auth.uid(), 'Private draft', 'private'),
  ('10000000-0000-4000-8000-000000000002', auth.uid(), 'Public world', 'public'),
  ('10000000-0000-4000-8000-000000000003', auth.uid(), 'Unlisted world', 'unlisted');
insert into public.world_collaborators values
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002');
do $$ begin
  assert (select count(*) from public.worlds) = 3, 'Owner must read every own world';
  assert (select count(*) from public.world_collaborators) = 1, 'Owner must read membership';
  update public.worlds set name = 'Updated private draft' where visibility = 'private';
  assert found, 'Owner must update own world';
  begin
    update public.worlds set creator_id = '00000000-0000-4000-8000-000000000002' where visibility = 'private';
    raise exception 'Owner transferred ownership without policy permission';
  exception when insufficient_privilege then null;
  end;
end $$;

set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}';
do $$ begin
  assert (select count(*) from public.worlds) = 2, 'Member sees assigned private and public only';
  assert (select count(*) from public.world_collaborators) = 1, 'Member reads own membership';
  assert arcanea_world_access.current_user_collaborates_on_world('10000000-0000-4000-8000-000000000001'), 'Member helper must use current caller';
  update public.worlds set name = 'Unauthorized edit' where visibility = 'private';
  assert not found, 'Read membership must not grant world edits';
  delete from public.world_collaborators;
  assert not found, 'Member must not manage membership';
  begin
    insert into public.world_collaborators values ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003');
    raise exception 'Member granted access to outsider';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.worlds values ('10000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', 'Forged owner', 'private');
    raise exception 'Member inserted a world for another owner';
  exception when insufficient_privilege then null;
  end;
end $$;

set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000003","role":"authenticated"}';
do $$ begin
  assert (select count(*) from public.worlds) = 1, 'Outsider sees public world only';
  assert (select count(*) from public.world_collaborators) = 0, 'Outsider sees no membership';
  assert not arcanea_world_access.current_user_collaborates_on_world('10000000-0000-4000-8000-000000000001'), 'Helper must not disclose another caller membership';
  begin
    insert into public.world_collaborators values ('10000000-0000-4000-8000-000000000001', auth.uid());
    raise exception 'Outsider added own membership';
  exception when insufficient_privilege then null;
  end;
end $$;

set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
do $$ begin
  assert (select count(*) from public.worlds) = 1, 'Anonymous sees public world only';
  assert (select count(*) from public.world_collaborators) = 0, 'Anonymous sees no membership';
  assert not arcanea_world_access.current_user_collaborates_on_world('10000000-0000-4000-8000-000000000001'), 'Anonymous membership must be false';
end $$;

set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';
delete from public.world_collaborators;
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}';
do $$ begin
  assert (select count(*) from public.worlds) = 1, 'Revoked member loses private access';
  assert (select count(*) from public.world_collaborators) = 0, 'Revoked membership disappears';
end $$;
reset role;
do $$ begin
  assert (select bool_and(relrowsecurity) from pg_class where oid in ('public.worlds'::regclass, 'public.world_collaborators'::regclass)), 'RLS must remain enabled';
  assert not has_schema_privilege('anon', 'arcanea_world_access', 'CREATE'), 'API roles must not create helper objects';
  assert not has_schema_privilege('authenticated', 'arcanea_world_access', 'CREATE'), 'API roles must not create helper objects';
end $$;
rollback;
\echo 'PASS: recursion reproduced; owner, member, stranger, anonymous, revocation and RLS boundaries verified'
