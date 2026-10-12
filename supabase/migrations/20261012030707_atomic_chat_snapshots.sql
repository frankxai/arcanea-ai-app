-- Generated with Supabase CLI 2.120.0. Candidate only: activation is gated.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

do $$ begin
  if to_regclass('public.chat_sessions') is null or to_regclass('public.chat_messages') is null
     or to_regclass('public.chat_projects') is null then
    raise exception 'Existing normalized chat tables are required';
  end if;
  if not (select relrowsecurity from pg_class where oid='public.chat_sessions'::regclass)
     or not (select relrowsecurity from pg_class where oid='public.chat_messages'::regclass)
     or not (select relrowsecurity from pg_class where oid='public.chat_projects'::regclass) then
    raise exception 'Existing owner RLS is required';
  end if;
end $$;

alter table public.chat_sessions
  add column if not exists client_session_id text,
  add column if not exists model_id text,
  add column if not exists project_id uuid references public.chat_projects(id) on delete set null;
alter table public.chat_messages
  add column if not exists client_id text,
  add column if not exists position integer,
  add column if not exists parts jsonb not null default '[]'::jsonb;
create unique index if not exists chat_messages_client_identity
  on public.chat_messages(session_id,client_id) where client_id is not null;

-- Update retained rows rather than deleting/reinserting them: existing message
-- UUIDs and references remain intact. Authorization stays under caller RLS.
drop policy if exists chat_snapshot_message_update on public.chat_messages;
create policy chat_snapshot_message_update on public.chat_messages for update to authenticated
  using (exists(select 1 from public.chat_sessions s where s.id=session_id and s.user_id=(select auth.uid())))
  with check (exists(select 1 from public.chat_sessions s where s.id=session_id and s.user_id=(select auth.uid())));
grant update on public.chat_messages to authenticated;

create or replace function public.chat_snapshot_revision(p_payload jsonb)
returns text language sql immutable security invoker set search_path='' as $$
  select pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(
    jsonb_build_object(
      'title',p_payload->'title','luminor_id',p_payload->'luminor_id',
      'model_id',p_payload->'model_id','project_id',p_payload->'project_id',
      'messages',coalesce((select jsonb_agg(m.value-'createdAt' order by m.ordinality)
        from jsonb_array_elements(p_payload->'messages') with ordinality m),'[]'::jsonb)
    )::text,'UTF8')),'hex')
$$;

create or replace function public.chat_snapshot_state(p_session_id uuid,p_expected_user_id uuid)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare v_payload jsonb;
begin
  if auth.uid() is null or auth.uid() is distinct from p_expected_user_id then
    raise exception using errcode='42501',message='chat_actor_mismatch';
  end if;
  select jsonb_build_object(
    'id',coalesce(s.client_session_id,s.id::text),'cloud_id',s.id,
    'title',coalesce(s.title,'New Chat'),'luminor_id',s.luminor_id,
    'model_id',s.model_id,'project_id',s.project_id,
    'created_at',s.created_at,'updated_at',s.updated_at,
    'messages',coalesce((select jsonb_agg(jsonb_build_object(
      'id',coalesce(m.client_id,m.id::text),'role',m.role,'content',m.content,
      'parts',m.parts,'createdAt',m.created_at
    ) order by m.position asc nulls last,m.created_at,m.id)
      from public.chat_messages m where m.session_id=s.id),'[]'::jsonb)
  ) into v_payload from public.chat_sessions s
    where s.id=p_session_id and s.user_id=p_expected_user_id;
  if v_payload is null then return null; end if;
  return v_payload || jsonb_build_object('revision',public.chat_snapshot_revision(v_payload));
end $$;

create or replace function public.load_chat_snapshots(p_expected_user_id uuid)
returns setof jsonb language plpgsql security invoker set search_path='' as $$
begin
  if auth.uid() is null or auth.uid() is distinct from p_expected_user_id then
    raise exception using errcode='42501',message='chat_actor_mismatch';
  end if;
  return query select public.chat_snapshot_state(s.id,p_expected_user_id)
    from public.chat_sessions s where s.user_id=p_expected_user_id
    order by s.updated_at desc,s.id limit 50;
end $$;

create or replace function public.save_chat_snapshot(
  p_session_id uuid,p_client_session_id text,p_expected_user_id uuid,
  p_expected_revision text,p_title text,p_luminor_id text,p_model_id text,
  p_project_id uuid,p_messages jsonb
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  v_current jsonb; v_desired jsonb; v_ids jsonb; v_times jsonb;
  v_message jsonb; v_part jsonb; v_position bigint; v_exists boolean;
begin
  if auth.uid() is null or auth.uid() is distinct from p_expected_user_id then
    raise exception using errcode='42501',message='chat_actor_mismatch';
  end if;
  if p_session_id is null or p_client_session_id is null or length(p_client_session_id) not between 1 and 200
     or p_title is null or length(p_title) not between 1 and 120
     or p_luminor_id is null or length(p_luminor_id) not between 1 and 200
     or (p_model_id is not null and length(p_model_id)>200)
     or (p_expected_revision is not null and p_expected_revision !~ '^[0-9a-f]{64}$')
     or jsonb_typeof(p_messages) is distinct from 'array'
     or jsonb_array_length(p_messages)>1000 or octet_length(p_messages::text)>1048576 then
    raise exception using errcode='22023',message='chat_invalid_snapshot';
  end if;
  for v_message in select value from jsonb_array_elements(p_messages) loop
    if jsonb_typeof(v_message) is distinct from 'object'
       or jsonb_typeof(v_message->'id') is distinct from 'string'
       or length(v_message->>'id') not between 1 and 200
       or (v_message->>'role') is null or v_message->>'role' not in ('user','assistant')
       or jsonb_typeof(v_message->'content') is distinct from 'string'
       or jsonb_typeof(coalesce(v_message->'parts','[]'::jsonb)) is distinct from 'array' then
      raise exception using errcode='22023',message='chat_invalid_message';
    end if;
    if v_message ? 'createdAt' then perform (v_message->>'createdAt')::timestamptz; end if;
    for v_part in select value from jsonb_array_elements(coalesce(v_message->'parts','[]'::jsonb)) loop
      if jsonb_typeof(v_part) is distinct from 'object' or jsonb_typeof(v_part->'type') is distinct from 'string'
         or (v_part ? 'text' and jsonb_typeof(v_part->'text') is distinct from 'string')
         or exists(select 1 from jsonb_object_keys(v_part) k where k not in ('type','text')) then
        raise exception using errcode='22023',message='chat_invalid_part';
      end if;
    end loop;
  end loop;
  if (select count(*) <> count(distinct value->>'id') from jsonb_array_elements(p_messages)) then
    raise exception using errcode='22023',message='chat_duplicate_message';
  end if;
  if p_project_id is not null and not exists(select 1 from public.chat_projects
    where id=p_project_id and user_id=p_expected_user_id) then
    raise exception using errcode='42501',message='chat_project_unavailable';
  end if;

  -- Serialize first creation too. The actor namespace prevents a different
  -- account from acquiring the same application's advisory lock.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_expected_user_id::text||':'||p_session_id::text,0));
  perform 1 from public.chat_sessions where id=p_session_id and user_id=p_expected_user_id for update;
  v_exists := found;
  if v_exists then
    perform 1 from public.chat_messages where session_id=p_session_id order by id for update;
    v_current := public.chat_snapshot_state(p_session_id,p_expected_user_id);
    if v_current->>'id' is distinct from p_client_session_id then
      raise exception using errcode='22023',message='chat_session_identity_conflict';
    end if;
  end if;
  v_desired := jsonb_build_object('title',p_title,'luminor_id',p_luminor_id,
    'model_id',p_model_id,'project_id',p_project_id,
    'messages',coalesce((select jsonb_agg(jsonb_build_object(
      'id',m.value->>'id','role',m.value->>'role','content',m.value->>'content',
      'parts',coalesce(m.value->'parts','[]'::jsonb)
    ) order by m.ordinality) from jsonb_array_elements(p_messages) with ordinality m),'[]'::jsonb));

  -- An identical replay acknowledges an uncertain commit without writing again.
  -- A content fingerprint also detects older service writers which do not know
  -- about a new revision counter. They remain one normalized storage authority.
  if v_current is not null and v_current->>'revision'=public.chat_snapshot_revision(v_desired) then return v_current; end if;
  if (v_current is not null and p_expected_revision is distinct from v_current->>'revision')
     or (v_current is null and p_expected_revision is not null) then
    raise exception using errcode='P0001',message='chat_revision_conflict';
  end if;
  if exists(select 1 from public.chat_messages where session_id=p_session_id and role='system') then
    -- The browser history cannot represent hidden server system messages.
    -- Refuse conversion rather than silently deleting that existing work.
    raise exception using errcode='22023',message='chat_unsupported_session';
  end if;
  select coalesce(jsonb_object_agg(coalesce(client_id,id::text),id::text),'{}'::jsonb),
    coalesce(jsonb_object_agg(coalesce(client_id,id::text),created_at),'{}'::jsonb)
    into v_ids,v_times from public.chat_messages where session_id=p_session_id;
  if not v_exists then
    insert into public.chat_sessions(id,user_id,luminor_id,title,model_id,project_id,client_session_id)
      values(p_session_id,p_expected_user_id,p_luminor_id,p_title,p_model_id,p_project_id,p_client_session_id);
  else
    update public.chat_sessions set title=p_title,luminor_id=p_luminor_id,model_id=p_model_id,
      project_id=p_project_id,client_session_id=p_client_session_id,updated_at=clock_timestamp()
      where id=p_session_id and user_id=p_expected_user_id;
  end if;
  delete from public.chat_messages where session_id=p_session_id
    and coalesce(client_id,id::text) not in (select value->>'id' from jsonb_array_elements(p_messages));
  for v_message,v_position in select value,ordinality from jsonb_array_elements(p_messages) with ordinality loop
    insert into public.chat_messages(id,session_id,role,content,client_id,position,parts,created_at)
      values(coalesce((v_ids->>(v_message->>'id'))::uuid,gen_random_uuid()),p_session_id,
        v_message->>'role',v_message->>'content',v_message->>'id',v_position::integer,
        coalesce(v_message->'parts','[]'::jsonb),coalesce((v_message->>'createdAt')::timestamptz,
          (v_times->>(v_message->>'id'))::timestamptz,clock_timestamp()))
      on conflict(id) do update set role=excluded.role,content=excluded.content,client_id=excluded.client_id,
        position=excluded.position,parts=excluded.parts,created_at=excluded.created_at
      where public.chat_messages.session_id=excluded.session_id;
  end loop;
  return public.chat_snapshot_state(p_session_id,p_expected_user_id);
end $$;

revoke all on function public.chat_snapshot_revision(jsonb) from public,anon;
revoke all on function public.chat_snapshot_state(uuid,uuid) from public,anon;
revoke all on function public.load_chat_snapshots(uuid) from public,anon;
revoke all on function public.save_chat_snapshot(uuid,text,uuid,text,text,text,text,uuid,jsonb) from public,anon;
grant execute on function public.chat_snapshot_revision(jsonb) to authenticated;
grant execute on function public.chat_snapshot_state(uuid,uuid) to authenticated;
grant execute on function public.load_chat_snapshots(uuid) to authenticated;
grant execute on function public.save_chat_snapshot(uuid,text,uuid,text,text,text,text,uuid,jsonb) to authenticated;
commit;
