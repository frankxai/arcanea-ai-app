-- Break worlds -> world_collaborators -> worlds SELECT-policy recursion.
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
drop policy "Collaborators can view worlds" on public.worlds;
create policy "Collaborators can view worlds" on public.worlds
for select using (arcanea_world_access.current_user_collaborates_on_world(id));
