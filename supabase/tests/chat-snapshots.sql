\set ON_ERROR_STOP on
\if :{?chat_disposable}
\else
\echo 'chat_disposable admission is required'
\quit 2
\endif
-- Refuse real Supabase and previously populated databases before any DDL.
do $$ begin
  if to_regnamespace('auth') is not null or to_regclass('public.chat_sessions') is not null
     or to_regclass('public.chat_messages') is not null or to_regclass('public.chat_projects') is not null then
    raise exception 'Chat fixture requires empty disposable PostgreSQL';
  end if;
end $$;
create role anon;
create role authenticated;
create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
grant usage on schema auth to anon,authenticated;
create table public.chat_projects(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id),title text not null);
create table public.chat_sessions(
  id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id),
  luminor_id text not null,title text,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.chat_messages(
  id uuid primary key default gen_random_uuid(),session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role text not null check(role in ('user','assistant','system')),content text not null,
  created_at timestamptz not null default now(),search_vector tsvector
);
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_projects enable row level security;
create policy sessions_select on public.chat_sessions for select to authenticated using(user_id=auth.uid());
create policy sessions_insert on public.chat_sessions for insert to authenticated with check(user_id=auth.uid());
create policy sessions_update on public.chat_sessions for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy sessions_delete on public.chat_sessions for delete to authenticated using(user_id=auth.uid());
create policy projects_owner on public.chat_projects for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy messages_select on public.chat_messages for select to authenticated using(exists(select 1 from public.chat_sessions s where s.id=session_id and s.user_id=auth.uid()));
create policy messages_insert on public.chat_messages for insert to authenticated with check(exists(select 1 from public.chat_sessions s where s.id=session_id and s.user_id=auth.uid()));
create policy messages_delete on public.chat_messages for delete to authenticated using(exists(select 1 from public.chat_sessions s where s.id=session_id and s.user_id=auth.uid()));
grant select,insert,update,delete on public.chat_sessions,public.chat_projects to authenticated;
grant select,insert,delete on public.chat_messages to authenticated;
insert into auth.users values('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
insert into public.chat_projects values('11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Owned'),('22222222-2222-4222-8222-222222222222','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','Foreign');
\ir ../migrations/20261012030707_atomic_chat_snapshots.sql

begin;
set local role authenticated;
set local request.jwt.claim.sub='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
do $$ declare
  r jsonb; retry jsonb; revision text; first_id uuid; first_time timestamptz;
  initial jsonb := '[{"id":"sdk-user","role":"user","content":"Original manuscript","createdAt":"2026-10-01T10:00:00Z"},{"id":"sdk-assistant","role":"assistant","content":"Thoughtful continuation","parts":[{"type":"text","text":"Thoughtful continuation"}]}]';
  edited jsonb := '[{"id":"sdk-user","role":"user","content":"Revised manuscript"},{"id":"sdk-assistant","role":"assistant","content":"Thoughtful continuation","parts":[{"type":"text","text":"Thoughtful continuation"}]}]';
begin
  r:=public.save_chat_snapshot('cccccccc-cccc-4ccc-8ccc-cccccccccccc','chat_old_scoped_id',auth.uid(),null,'My manuscript','lumina','model',null,initial);
  if r->>'id'<>'chat_old_scoped_id' or jsonb_array_length(r->'messages')<>2
     or r->'messages'->0->>'id'<>'sdk-user' or r->'messages'->1->>'content'<>'Thoughtful continuation'
     or r->'messages'->1->'parts'->0->>'text'<>'Thoughtful continuation' then raise exception 'Complete round-trip failed'; end if;
  select id,created_at into first_id,first_time from public.chat_messages where client_id='sdk-user';
  if first_time <> '2026-10-01T10:00:00Z'::timestamptz then raise exception 'Timestamp lost'; end if;
  retry:=public.save_chat_snapshot('cccccccc-cccc-4ccc-8ccc-cccccccccccc','chat_old_scoped_id',auth.uid(),null,'My manuscript','lumina','model',null,initial);
  if retry->>'revision'<>r->>'revision' or retry->>'updated_at'<>r->>'updated_at'
     or (select count(*) from public.chat_messages)<>2 then raise exception 'Replay wrote or duplicated data'; end if;
  revision:=r->>'revision';
  r:=public.save_chat_snapshot('cccccccc-cccc-4ccc-8ccc-cccccccccccc','chat_old_scoped_id',auth.uid(),revision,'My revision','lumina','model','11111111-1111-4111-8111-111111111111',edited);
  if r->>'revision'=revision or r->>'title'<>'My revision' or r->'messages'->0->>'content'<>'Revised manuscript'
     or (select id from public.chat_messages where client_id='sdk-user')<>first_id
     or (select created_at from public.chat_messages where client_id='sdk-user')<>first_time then raise exception 'Edit lost stable identity or original timestamp'; end if;
  begin
    perform public.save_chat_snapshot('cccccccc-cccc-4ccc-8ccc-cccccccccccc','chat_old_scoped_id',auth.uid(),revision,'Stale','lumina',null,null,initial);
    raise exception 'Stale snapshot overwrote work';
  exception when sqlstate 'P0001' then if sqlerrm<>'chat_revision_conflict' then raise; end if; end;
  begin
    perform public.save_chat_snapshot('cccccccc-cccc-4ccc-8ccc-cccccccccccc','chat_old_scoped_id','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',r->>'revision','Wrong actor','lumina',null,null,initial);
    raise exception 'Wrong actor accepted';
  exception when insufficient_privilege then null; end;
  begin
    perform public.save_chat_snapshot('cccccccc-cccc-4ccc-8ccc-cccccccccccc','chat_old_scoped_id',auth.uid(),r->>'revision','Foreign project','lumina',null,'22222222-2222-4222-8222-222222222222',initial);
    raise exception 'Foreign project accepted';
  exception when insufficient_privilege then null; end;
  if (select count(*) from public.load_chat_snapshots(auth.uid()))<>1 then raise exception 'Private load failed'; end if;
  raise notice 'PASS full messages, parts, ordering, UUID identity, original timestamps, replay, edit, stale/actor/project denial';
end $$;
commit;

-- Forced second-message failure must roll back both the metadata and first edit.
alter table public.chat_messages add constraint fixture_fail check(content<>'fixture_force_fail') not valid;
begin;
set local role authenticated;
set local request.jwt.claim.sub='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
do $$ declare r jsonb; after_value jsonb; begin
  r:=public.chat_snapshot_state('cccccccc-cccc-4ccc-8ccc-cccccccccccc',auth.uid());
  begin
    perform public.save_chat_snapshot('cccccccc-cccc-4ccc-8ccc-cccccccccccc','chat_old_scoped_id',auth.uid(),r->>'revision','Failed title','lumina',null,null,
      '[{"id":"sdk-user","role":"user","content":"Failed first edit"},{"id":"sdk-assistant","role":"assistant","content":"fixture_force_fail"}]');
    raise exception 'Failed insert accepted';
  exception when check_violation then null; end;
  after_value:=public.chat_snapshot_state('cccccccc-cccc-4ccc-8ccc-cccccccccccc',auth.uid());
  if after_value is distinct from r then raise exception 'Partial save survived rollback'; end if;
  begin
    perform public.save_chat_snapshot('cccccccc-cccc-4ccc-8ccc-cccccccccccc','chat_old_scoped_id',auth.uid(),r->>'revision','Duplicate','lumina',null,null,
      '[{"id":"same","role":"user","content":"One"},{"id":"same","role":"assistant","content":"Two"}]');
    raise exception 'Duplicate accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.save_chat_snapshot('cccccccc-cccc-4ccc-8ccc-cccccccccccc','chat_old_scoped_id',auth.uid(),r->>'revision','Bad part','lumina',null,null,
      '[{"id":"sdk-user","role":"user","content":"One","parts":[{"type":"text","hidden":"Unrepresentable data"}]}]');
    raise exception 'Unrepresentable part accepted';
  exception when invalid_parameter_value then null; end;
  -- An older normalized service writer must invalidate the content revision too.
  update public.chat_messages set content='Legacy writer edit' where client_id='sdk-user';
  if (public.chat_snapshot_state('cccccccc-cccc-4ccc-8ccc-cccccccccccc',auth.uid())->>'revision')=r->>'revision' then raise exception 'Legacy writer not detected'; end if;
  begin
    perform public.save_chat_snapshot('cccccccc-cccc-4ccc-8ccc-cccccccccccc','chat_old_scoped_id',auth.uid(),r->>'revision','Overwrite','lumina',null,null,r->'messages');
    raise exception 'Legacy edit overwritten';
  exception when sqlstate 'P0001' then if sqlerrm<>'chat_revision_conflict' then raise; end if; end;
  raise notice 'PASS atomic rollback, duplicate/invalid part denial and legacy writer conflict';
end $$;
commit;

begin;
set local role authenticated;
set local request.jwt.claim.sub='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
do $$ begin
  if exists(select 1 from public.chat_sessions) or exists(select 1 from public.chat_messages)
     or exists(select 1 from public.load_chat_snapshots(auth.uid())) then raise exception 'Foreign history exposed'; end if;
  if public.chat_snapshot_state('cccccccc-cccc-4ccc-8ccc-cccccccccccc',auth.uid()) is not null then raise exception 'Foreign single session exposed'; end if;
  begin
    perform public.save_chat_snapshot('cccccccc-cccc-4ccc-8ccc-cccccccccccc','chat_old_scoped_id',auth.uid(),null,'Foreign overwrite','lumina',null,null,'[]');
    raise exception 'Foreign ID overwritten';
  exception when unique_violation then null; end;
  update public.chat_messages set content='Foreign edit';
  if found then raise exception 'Foreign update allowed'; end if;
  set local request.jwt.claim.sub='';
  begin
    perform public.load_chat_snapshots('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
    raise exception 'Missing actor accepted';
  exception when insufficient_privilege then null; end;
  raise notice 'PASS foreign RLS read/write and absent actor denial';
end $$;
set local role anon;
do $$ begin
  begin
    perform public.load_chat_snapshots('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
    raise exception 'Anon function execution allowed';
  exception when insufficient_privilege then null; end;
end $$;
commit;

-- Two real connections compete for the same base; exactly one must commit.
create extension dblink;
create function public.chat_fixture_race(p_revision text,p_content text) returns text language plpgsql as $$ begin
  perform public.save_chat_snapshot('dddddddd-dddd-4ddd-8ddd-dddddddddddd','race-fixture',auth.uid(),p_revision,'Race','lumina',null,null,
    jsonb_build_array(jsonb_build_object('id','race-message','role','user','content',p_content)));
  return 'committed';
exception when sqlstate 'P0001' then if sqlerrm='chat_revision_conflict' then return 'conflict'; end if; raise;
end $$;
begin;
set local role authenticated;
set local request.jwt.claim.sub='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
select public.save_chat_snapshot('dddddddd-dddd-4ddd-8ddd-dddddddddddd','race-fixture',auth.uid(),null,'Race','lumina',null,null,'[{"id":"race-message","role":"user","content":"Base"}]');
commit;
do $$ declare base text; results text[]; dsn text; begin
  perform set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true);
  base:=public.chat_snapshot_state('dddddddd-dddd-4ddd-8ddd-dddddddddddd','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')->>'revision';
  dsn:=format('host=127.0.0.1 port=%s dbname=%I user=postgres password=chat_fixture',current_setting('port'),current_database());
  perform dblink_connect('chat-a',dsn); perform dblink_connect('chat-b',dsn);
  perform dblink_exec('chat-a','set role authenticated; set request.jwt.claim.sub=''aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa''');
  perform dblink_exec('chat-b','set role authenticated; set request.jwt.claim.sub=''aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa''');
  perform dblink_send_query('chat-a',format('select public.chat_fixture_race(%L,%L)',base,'Writer A'));
  perform dblink_send_query('chat-b',format('select public.chat_fixture_race(%L,%L)',base,'Writer B'));
  select array_agg(result) into results from (
    select result from dblink_get_result('chat-a') as a(result text)
    union all select result from dblink_get_result('chat-b') as b(result text)
  ) combined;
  perform dblink_disconnect('chat-a'); perform dblink_disconnect('chat-b');
  if not (results @> array['committed','conflict']) or array_length(results,1)<>2 then raise exception 'Concurrent writers did not conflict: %',results; end if;
  raise notice 'PASS actual two-connection compare-and-save race: %',results;
end $$;
select 'PASS disposable chat snapshot rehearsal' as result,version() as postgres;
