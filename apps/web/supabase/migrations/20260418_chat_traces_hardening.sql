-- 20260418_chat_traces_hardening.sql
--
-- Follow-up to 20260418_chat_traces.sql. Addresses the Supabase security
-- advisor ERROR (SECURITY DEFINER view) and WARN (mutable function
-- search_path) on the freshly-shipped swarm objects.
--
-- Also lands the missing FK indexes on luminor_memory_* that were surfaced
-- by the performance advisor.

-- ---------------------------------------------------------------------------
-- 1. recent_chat_traces view — must run under security_invoker so chat_traces
--    RLS applies to the caller, not the view owner.
-- ---------------------------------------------------------------------------
drop view if exists public.recent_chat_traces;
create view public.recent_chat_traces
with (security_invoker = true)
as
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

comment on view public.recent_chat_traces is
  'Recent swarm traces — runs under security_invoker so chat_traces RLS applies to the caller.';

-- ---------------------------------------------------------------------------
-- 2. prune_anonymous_chat_traces — drop SECURITY DEFINER (service_role
--    already bypasses RLS via the chat_traces_service_all policy, so elevated
--    privilege is not required).
-- ---------------------------------------------------------------------------
drop function if exists public.prune_anonymous_chat_traces();
create or replace function public.prune_anonymous_chat_traces()
returns integer
language plpgsql
security invoker
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
  'Deletes anonymous swarm trace rows older than 30 days. Safe to run on a daily cron as service_role.';

-- ---------------------------------------------------------------------------
-- 3. match_memory_items / upsert_memory_block — ensure explicit search_path
--    (was flagged as mutable on the pre-existing 20260411_luminor_memory
--    migration). Swap to SECURITY INVOKER for principle-of-least-privilege.
-- ---------------------------------------------------------------------------
create or replace function public.match_memory_items(
  p_luminor_id text,
  p_user_id uuid,
  query_embedding extensions.vector(1536),
  match_threshold float default 0.6,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  source text,
  relevance_score numeric,
  similarity float
)
language plpgsql
stable
security invoker
set search_path = public, extensions, pg_temp
as $$
begin
  return query
  select
    m.id,
    m.content,
    m.source,
    m.relevance_score,
    1 - (m.embedding <=> query_embedding) as similarity
  from public.luminor_memory_items m
  where m.luminor_id = p_luminor_id
    and (m.user_id = p_user_id or m.user_id is null)
    and m.embedding is not null
    and 1 - (m.embedding <=> query_embedding) > match_threshold
  order by m.embedding <=> query_embedding
  limit match_count;
end;
$$;

create or replace function public.upsert_memory_block(
  p_luminor_id text,
  p_user_id uuid,
  p_content text
)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  insert into public.luminor_memory_blocks (luminor_id, user_id, content)
  values (p_luminor_id, p_user_id, p_content)
  on conflict (luminor_id, user_id)
  do update set content = excluded.content, updated_at = now()
  returning id into v_id;
  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. FK indexes on luminor_memory_* — the existing indexes lead with
--    luminor_id, which doesn't cover the user_id FK. Add narrow user_id
--    indexes so ON DELETE CASCADE doesn't full-scan.
-- ---------------------------------------------------------------------------
create index if not exists idx_memory_items_user_id
  on public.luminor_memory_items(user_id)
  where user_id is not null;

create index if not exists idx_memory_blocks_user_id
  on public.luminor_memory_blocks(user_id);
