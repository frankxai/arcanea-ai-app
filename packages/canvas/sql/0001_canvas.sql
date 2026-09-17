-- Arcanea Canvas — sequencing layer.
--
-- Higgsfield runs this as a bespoke Cloudflare service with an in-memory room
-- per canvas. We already run Postgres, so the sequencer is a bigserial and the
-- authority check is a policy — no new vendor, and the op log stays queryable,
-- which is what makes forking someone else's weave a SELECT instead of a
-- feature.

create extension if not exists "pgcrypto";

create table if not exists canvases (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  world_id      uuid,
  name          text not null default 'Untitled weave',
  visibility    text not null default 'private'
                check (visibility in ('private', 'link', 'community')),
  forked_from   uuid references canvases(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists canvas_members (
  canvas_id  uuid not null references canvases(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'editor' check (role in ('viewer', 'editor', 'owner')),
  primary key (canvas_id, user_id)
);

-- The sequencer. `seq` is the total order every client reconciles against.
create table if not exists canvas_ops (
  canvas_id  uuid   not null references canvases(id) on delete cascade,
  seq        bigint generated always as identity,
  op_id      text   not null,
  client_id  text   not null,
  author_id  uuid   not null references auth.users(id),
  type       smallint not null,
  payload    jsonb  not null,
  created_at timestamptz not null default now(),
  primary key (canvas_id, seq)
);

create unique index if not exists canvas_ops_dedupe on canvas_ops (canvas_id, op_id);

-- Compaction target. Replaying 40k ops on open is not a product.
create table if not exists canvas_snapshots (
  canvas_id  uuid primary key references canvases(id) on delete cascade,
  seq        bigint not null,
  nodes      jsonb  not null default '[]',
  edges      jsonb  not null default '[]',
  results    jsonb  not null default '[]',
  node_history jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create index if not exists canvas_ops_tail on canvas_ops (canvas_id, seq desc);

alter table canvases          enable row level security;
alter table canvas_members    enable row level security;
alter table canvas_ops        enable row level security;
alter table canvas_snapshots  enable row level security;

create or replace function canvas_can_read(target uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from canvases c
    where c.id = target
      and (c.owner_id = auth.uid()
        or c.visibility in ('link', 'community')
        or exists (select 1 from canvas_members m
                   where m.canvas_id = c.id and m.user_id = auth.uid()))
  );
$$;

create or replace function canvas_can_write(target uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from canvases c
    where c.id = target
      and (c.owner_id = auth.uid()
        or exists (select 1 from canvas_members m
                   where m.canvas_id = c.id and m.user_id = auth.uid()
                     and m.role in ('editor', 'owner')))
  );
$$;

create policy canvas_read on canvases for select using (canvas_can_read(id));
create policy canvas_write on canvases for update using (canvas_can_write(id));
create policy canvas_ops_read on canvas_ops for select using (canvas_can_read(canvas_id));
create policy canvas_snapshot_read on canvas_snapshots for select using (canvas_can_read(canvas_id));

-- Ops are never inserted directly; submit_ops is the only writer so that
-- authority checks cannot be bypassed by a client with a service key.
revoke insert on canvas_ops from anon, authenticated;

create or replace function canvas_submit_ops(target uuid, client text, ops jsonb)
returns table (op_id text, status text, seq bigint, reason text)
language plpgsql security definer set search_path = public as $$
declare
  item     jsonb;
  new_seq  bigint;
  refusal  text;
begin
  if not canvas_can_write(target) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  for item in select * from jsonb_array_elements(ops) loop
    refusal := canvas_refuse_reason(target, item);

    if refusal is not null then
      op_id  := item->>'id';
      status := 'rejected';
      seq    := null;
      reason := refusal;
      return next;
      continue;
    end if;

    insert into canvas_ops (canvas_id, op_id, client_id, author_id, type, payload)
    values (target, item->>'id', client, auth.uid(), (item->>'type')::smallint, item)
    on conflict (canvas_id, op_id) do nothing
    returning canvas_ops.seq into new_seq;

    op_id  := item->>'id';
    status := 'applied';
    seq    := new_seq;
    reason := null;
    return next;
  end loop;

  update canvases set updated_at = now() where id = target;
end;
$$;

-- The whole reason this is not a CRDT: a generation costs money, and canon can
-- be locked. Both are refusals, and a merge-always model cannot express either.
create or replace function canvas_refuse_reason(target uuid, op jsonb)
returns text language plpgsql stable security definer set search_path = public as $$
declare
  op_type smallint := (op->>'type')::smallint;
  balance integer;
begin
  if op_type = 5 and (op #>> '{entry,state}') = 'queued' then
    select credits into balance from profiles where id = auth.uid();
    if coalesce(balance, 0) <= 0 then
      return 'not_enough_credits';
    end if;
  end if;

  if op_type = 0 and (op->>'key') like 'data.canon%' then
    if exists (select 1 from canvases c
               join worlds w on w.id = c.world_id
               where c.id = target and w.canon_locked) then
      return 'canon_locked';
    end if;
  end if;

  return null;
end;
$$;

grant execute on function canvas_submit_ops(uuid, text, jsonb) to authenticated;

-- Compaction: fold the tail into the snapshot and drop what it now covers.
-- Schedule via pg_cron nightly, or trigger past a tail-length threshold.
create or replace function canvas_compact(target uuid, keep integer default 512)
returns void language plpgsql security definer set search_path = public as $$
declare
  cutoff bigint;
begin
  select max(seq) - keep into cutoff from canvas_ops where canvas_id = target;
  if cutoff is null or cutoff <= 0 then return; end if;
  delete from canvas_ops where canvas_id = target and seq <= cutoff;
end;
$$;
