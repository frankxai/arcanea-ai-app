-- A bounded, idempotent reservation for reader illustrations. Only the server
-- service role can call these functions; user-owned creations retain their RLS.
create table if not exists public.reader_illustration_requests (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'completed', 'refunded')),
  creation_id uuid references public.creations(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists reader_illustration_requests_user_created
  on public.reader_illustration_requests (user_id, created_at desc);
alter table public.reader_illustration_requests enable row level security;
revoke all on public.reader_illustration_requests from anon, authenticated;
grant select, insert, update on public.reader_illustration_requests to service_role;

create or replace function public.reserve_reader_illustration(p_user_id uuid, p_request_id uuid)
returns text language plpgsql security invoker set search_path = '' as $$
declare v_balance integer; v_status text;
begin
  if p_user_id is null or p_request_id is null then raise exception 'Missing reservation identity'; end if;
  insert into public.user_credits (user_id) values (p_user_id)
    on conflict (user_id) do nothing;
  select balance into v_balance from public.user_credits
    where user_id = p_user_id for update;
  select status into v_status from public.reader_illustration_requests
    where id = p_request_id and user_id = p_user_id;
  if v_status is not null then return v_status; end if;
  if coalesce(v_balance, 0) < 1 then return 'insufficient'; end if;
  update public.user_credits set balance = balance - 1,
    total_spent = coalesce(total_spent, 0) + 1, updated_at = now()
    where user_id = p_user_id;
  insert into public.reader_illustration_requests (id, user_id)
    values (p_request_id, p_user_id);
  return 'reserved';
end $$;

create or replace function public.settle_reader_illustration(
  p_user_id uuid, p_request_id uuid, p_creation_id uuid default null
) returns text language plpgsql security invoker set search_path = '' as $$
declare v_status text;
begin
  select status into v_status from public.reader_illustration_requests
    where id = p_request_id and user_id = p_user_id for update;
  if v_status is null then return 'missing'; end if;
  if v_status <> 'pending' then return v_status; end if;
  if p_creation_id is null then
    update public.user_credits set balance = balance + 1,
      total_spent = greatest(coalesce(total_spent, 0) - 1, 0), updated_at = now()
      where user_id = p_user_id;
    update public.reader_illustration_requests set status = 'refunded'
      where id = p_request_id;
    return 'refunded';
  end if;
  if not exists (select 1 from public.creations where id = p_creation_id and user_id = p_user_id) then
    raise exception 'Creation does not belong to reader';
  end if;
  update public.reader_illustration_requests
    set status = 'completed', creation_id = p_creation_id where id = p_request_id;
  return 'completed';
end $$;

revoke all on function public.reserve_reader_illustration(uuid, uuid) from public, anon, authenticated;
revoke all on function public.settle_reader_illustration(uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function public.reserve_reader_illustration(uuid, uuid) to service_role;
grant execute on function public.settle_reader_illustration(uuid, uuid, uuid) to service_role;

-- One durable, private graph per reader. Positions may be any finite canvas
-- coordinates; the UI saves intentionally and protects against stale tabs.
create table if not exists public.personal_canvases (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nodes jsonb not null default '[]'::jsonb check (jsonb_typeof(nodes) = 'array'),
  edges jsonb not null default '[]'::jsonb check (jsonb_typeof(edges) = 'array'),
  revision integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.personal_canvases enable row level security;
revoke all on public.personal_canvases from anon, authenticated;
grant select, insert, update on public.personal_canvases to authenticated;
create policy "Readers see their own canvas" on public.personal_canvases
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Readers create their own canvas" on public.personal_canvases
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Readers edit their own canvas" on public.personal_canvases
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
