-- 20260418_chat_traces.sql
--
-- Trace persistence for the multi-Luminor swarm. Every /api/chat/swarm
-- invocation writes a row so creators can replay what their swarm did:
-- the plan, each contribution, tool calls, and the final synthesis.
--
-- Short-TTL by default — 30 days for anonymous, indefinite for owned traces.
-- RLS: users see only their own; service role has full access.

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

create table if not exists public.chat_traces (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete cascade,
  chat_session_id     text,
  mode                text not null check (mode in ('solo', 'swarm')),
  planner_source      text not null check (planner_source in ('llm', 'heuristic', 'fallback')),
  plan_ms             integer,
  total_ms            integer,
  total_tokens        integer,
  input               text not null,
  -- Structured payloads (one JSON blob per row keeps replay cheap)
  plan_luminors       jsonb not null default '[]'::jsonb, -- [{id, name, reason}]
  rationale           text,
  contributions       jsonb not null default '[]'::jsonb, -- [{id,name,text,toolCalls,tokensIn,tokensOut,durationMs}]
  synthesis           text,
  error               text,
  created_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists chat_traces_user_id_created_at
  on public.chat_traces(user_id, created_at desc);

create index if not exists chat_traces_mode
  on public.chat_traces(mode);

create index if not exists chat_traces_chat_session_id
  on public.chat_traces(chat_session_id)
  where chat_session_id is not null;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.chat_traces enable row level security;

drop policy if exists "chat_traces_select_own"     on public.chat_traces;
drop policy if exists "chat_traces_insert_own"     on public.chat_traces;
drop policy if exists "chat_traces_delete_own"     on public.chat_traces;
drop policy if exists "chat_traces_service_all"    on public.chat_traces;

-- Users can read only their own traces (or anonymous traces with null user_id are private to service role)
create policy "chat_traces_select_own"
  on public.chat_traces
  for select
  to authenticated
  using ( (select auth.uid()) = user_id );

-- Users can insert rows for themselves; anonymous rows are service-role only
create policy "chat_traces_insert_own"
  on public.chat_traces
  for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

-- Users can delete their own traces
create policy "chat_traces_delete_own"
  on public.chat_traces
  for delete
  to authenticated
  using ( (select auth.uid()) = user_id );

-- Service role bypass for backend writes
create policy "chat_traces_service_all"
  on public.chat_traces
  for all
  to service_role
  using ( true )
  with check ( true );

-- ---------------------------------------------------------------------------
-- TTL helper (free tier: 30 days for anonymous rows)
-- ---------------------------------------------------------------------------

create or replace function public.prune_anonymous_chat_traces()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  deleted_count integer;
begin
  with del as (
    delete from public.chat_traces
    where user_id is null
      and created_at < now() - interval '30 days'
    returning id
  )
  select count(*) into deleted_count from del;
  return deleted_count;
end;
$$;

comment on function public.prune_anonymous_chat_traces is
  'Deletes anonymous swarm trace rows older than 30 days. Safe to run on a daily cron.';

-- ---------------------------------------------------------------------------
-- Helper view for "my recent traces"
-- ---------------------------------------------------------------------------

create or replace view public.recent_chat_traces as
select
  id,
  user_id,
  mode,
  planner_source,
  jsonb_array_length(plan_luminors) as luminor_count,
  total_ms,
  total_tokens,
  left(input, 240) as input_preview,
  left(coalesce(synthesis, ''), 240) as synthesis_preview,
  created_at
from public.chat_traces
order by created_at desc;

comment on table public.chat_traces is
  'Multi-Luminor swarm run traces. One row per /api/chat/swarm invocation.';
