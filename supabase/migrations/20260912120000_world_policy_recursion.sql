-- Break worlds -> world_collaborators -> worlds SELECT-policy recursion.
-- Production has this table, but its creation was absent from migration history.
-- Reconstruct that verified contract only for fresh databases. Existing tables,
-- rows, grants and membership-management policies are left untouched.
do $$ begin
  if to_regclass('public.world_collaborators') is null then
    create table public.world_collaborators (
      world_id uuid not null references public.worlds(id) on delete cascade,
      user_id uuid not null references auth.users(id) on delete cascade,
      role text default 'editor' check (role in ('viewer', 'editor', 'admin')),
      invited_at timestamptz default now(),
      primary key (world_id, user_id)
    );
    create index world_collaborators_user_id_idx on public.world_collaborators(user_id);
    alter table public.world_collaborators enable row level security;
    grant select on public.world_collaborators to anon;
    grant select, insert, update, delete on public.world_collaborators to authenticated;
    grant all on public.world_collaborators to service_role;
    create policy "Collaborators can view membership" on public.world_collaborators
      for select using (auth.uid() = user_id or exists (
        select 1 from public.worlds w
        where w.id = world_collaborators.world_id and w.creator_id = auth.uid()
      ));
    create policy "World owners manage collaborators" on public.world_collaborators
      for all using (exists (
        select 1 from public.worlds w
        where w.id = world_collaborators.world_id and w.creator_id = auth.uid()
      ));
  end if;
end $$;

-- Keep this schema outside the Supabase Data API exposed schemas.
create schema if not exists arcanea_world_access authorization postgres;
revoke all on schema arcanea_world_access from public;
grant usage on schema arcanea_world_access to anon, authenticated;

-- Only answers whether the current JWT subject belongs to this world. There is
-- deliberately no user-id argument and no world or membership data is returned.
create or replace function arcanea_world_access.current_user_collaborates_on_world(target_world uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.world_collaborators wc
    where wc.world_id = target_world and wc.user_id = auth.uid()
  );
$$;

alter function arcanea_world_access.current_user_collaborates_on_world(uuid) owner to postgres;
revoke all on function arcanea_world_access.current_user_collaborates_on_world(uuid) from public;
grant execute on function arcanea_world_access.current_user_collaborates_on_world(uuid) to anon, authenticated;

-- Owner, public-world and membership-management policies remain in force.
drop policy if exists "Collaborators can view worlds" on public.worlds;
create policy "Collaborators can view worlds" on public.worlds
for select using (arcanea_world_access.current_user_collaborates_on_world(id));
