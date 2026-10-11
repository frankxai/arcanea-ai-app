-- Only an empty disposable CI PostgreSQL service. Production has auth already
-- and fails this guard before any DDL, even if a caller sets the fixture flag.
\set ON_ERROR_STOP on
\if :{?doc_disposable}
\else
\echo 'doc_disposable admission is required'
\quit 2
\endif
do $$ begin
  if to_regnamespace('auth') is not null or to_regclass('public.project_docs') is not null then
    raise exception 'Document fixture requires empty disposable PostgreSQL';
  end if;
end $$;
begin;
create role anon;
create role authenticated;
create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
 select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
grant usage on schema auth to anon,authenticated;
\ir ../migrations/20260402000001_project_docs.sql
grant select,insert,update,delete on public.project_docs,public.project_doc_content,public.project_doc_versions to anon,authenticated;
insert into auth.users values
 ('40000000-0000-4000-8000-000000000004'),
 ('50000000-0000-4000-8000-000000000005');
insert into public.project_docs(id,workspace_id,project_id,user_id,title) values
 ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000004','Original'),
 ('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000004','Race'),
 ('20000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000005','Foreign');
insert into public.project_doc_content(doc_id,content_text) values
 ('20000000-0000-4000-8000-000000000002','Retained legacy content');
insert into public.project_doc_versions(doc_id,version_number,content_text) values
 ('20000000-0000-4000-8000-000000000002',5,'First old revision'),
 ('20000000-0000-4000-8000-000000000002',5,'Second old revision');
\ir ../migrations/20261011131128_project_doc_revisions.sql
create extension dblink;
create function public.document_fixture_race(p_operation uuid) returns text language plpgsql as $$
begin
  perform public.save_project_document('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000003',0,p_operation,'{"content_text":"Concurrent retained edit"}');
  return 'committed';
exception when sqlstate 'P0001' then
  if sqlerrm = 'document_revision_conflict' then return 'conflict'; end if;
  raise;
end $$;
commit;

begin;
set local role authenticated;
set local request.jwt.claim.sub='40000000-0000-4000-8000-000000000004';
do $$ declare r jsonb; before_count bigint; begin
  if (select count(*) from public.project_doc_versions where version_number=5) <> 2 then
    raise exception 'Legacy history was discarded';
  end if;
  r := public.save_project_document('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',5,'30000000-0000-4000-8000-000000000003','{"title":"New metadata","content_text":"Retained revised content"}');
  if (r->>'revision')::bigint <> 6 then raise exception 'Legacy revision was not retained'; end if;
  select count(*) into before_count from public.project_doc_versions;
  perform public.save_project_document('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',5,'30000000-0000-4000-8000-000000000003','{"content_text":"Retained revised content","title":"New metadata"}');
  if (select count(*) from public.project_doc_versions) <> before_count then raise exception 'Replay duplicated history'; end if;
  begin
    perform public.save_project_document('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',5,'30000000-0000-4000-8000-000000000004','{"content_text":"Stale overwrite"}');
    raise exception 'Stale revision overwrote content';
  exception when sqlstate 'P0001' then if sqlerrm <> 'document_revision_conflict' then raise; end if; end;
  begin
    perform public.save_project_document('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',5,'30000000-0000-4000-8000-000000000003','{"content_text":"Altered replay"}');
    raise exception 'Changed replay overwrote content';
  exception when sqlstate 'P0001' then if sqlerrm <> 'document_operation_conflict' then raise; end if; end;
  begin
    perform public.save_project_document('10000000-0000-4000-8000-000000000099','20000000-0000-4000-8000-000000000002',6,'30000000-0000-4000-8000-000000000004','{"content_text":"Wrong parent"}');
    raise exception 'Wrong parent changed content';
  exception when sqlstate 'P0001' then if sqlerrm <> 'document_not_found' then raise; end if; end;
  begin
    perform public.save_project_document('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000005',0,'30000000-0000-4000-8000-000000000004','{"content_text":"Foreign owner"}');
    raise exception 'Foreign owner changed content';
  exception when sqlstate 'P0001' then if sqlerrm <> 'document_not_found' then raise; end if; end;
  begin
    update public.project_doc_content set content_text='Direct overwrite' where doc_id='20000000-0000-4000-8000-000000000002';
    raise exception 'Direct content update remained enabled';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.project_doc_versions(doc_id,version_number,content_text) values('20000000-0000-4000-8000-000000000002',7,'Forged history');
    raise exception 'Direct history insert remained enabled';
  exception when insufficient_privilege then null; end;
end $$;
-- New document creation still works, with content initialized atomically.
insert into public.project_docs(id,workspace_id,project_id,user_id) values
 ('20000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',auth.uid());
do $$ begin
  if not exists(select 1 from public.project_doc_content where doc_id='20000000-0000-4000-8000-000000000006' and content_text='') then raise exception 'New document lacks atomic content'; end if;
end $$;
reset role;
alter table public.project_doc_versions add constraint fixture_history_failure check(content_text <> 'force_failure') not valid;
set local role authenticated;
do $$ begin
  begin
    perform public.save_project_document('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',6,'30000000-0000-4000-8000-000000000007','{"title":"Failed title","content_text":"force_failure"}');
    raise exception 'Failed history save was accepted';
  exception when check_violation then null; end;
  if (select content_text from public.project_doc_content where doc_id='20000000-0000-4000-8000-000000000002') <> 'Retained revised content'
    or (select save_revision from public.project_docs where id='20000000-0000-4000-8000-000000000002') <> 6
    or (select title from public.project_docs where id='20000000-0000-4000-8000-000000000002') <> 'New metadata' then
    raise exception 'Failed history insert did not roll back the complete edit';
  end if;
end $$;
set local request.jwt.claim.sub='';
do $$ begin
  begin
    perform public.save_project_document('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',6,'30000000-0000-4000-8000-000000000008','{"content_text":"No actor"}');
    raise exception 'Null actor saved content';
  exception when sqlstate 'P0001' then if sqlerrm <> 'document_not_found' then raise; end if; end;
end $$;
reset role;
set local role anon;
do $$ begin
  begin
    perform public.save_project_document('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',6,'30000000-0000-4000-8000-000000000008','{"content_text":"Anonymous"}');
    raise exception 'Anonymous RPC execute remained enabled';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;

select dblink_connect('doc_one','host=localhost user=postgres dbname=postgres password=disposable-author-fixture');
select dblink_connect('doc_two','host=localhost user=postgres dbname=postgres password=disposable-author-fixture');
select dblink_exec('doc_one','set role authenticated; set request.jwt.claim.sub=''40000000-0000-4000-8000-000000000004''');
select dblink_exec('doc_two','set role authenticated; set request.jwt.claim.sub=''40000000-0000-4000-8000-000000000004''');
select dblink_send_query('doc_one','select public.document_fixture_race(''30000000-0000-4000-8000-000000000011'')');
select dblink_send_query('doc_two','select public.document_fixture_race(''30000000-0000-4000-8000-000000000012'')');
create temporary table doc_race_results(outcome text);
insert into doc_race_results select * from dblink_get_result('doc_one') as r(outcome text);
insert into doc_race_results select * from dblink_get_result('doc_two') as r(outcome text);
do $$ begin
  if (select count(*) from doc_race_results where outcome='committed') <> 1
    or (select count(*) from doc_race_results where outcome='conflict') <> 1
    or (select save_revision from public.project_docs where id='20000000-0000-4000-8000-000000000003') <> 1 then
    raise exception 'Two concurrent edits did not yield one commit and one conflict';
  end if;
end $$;
select dblink_disconnect('doc_one');
select dblink_disconnect('doc_two');
-- Remove only objects created in this initially empty disposable service.
begin;
drop function public.document_fixture_race(uuid),public.save_project_document(uuid,uuid,bigint,uuid,jsonb);
drop table public.project_doc_versions,public.project_doc_content,public.project_docs;
drop function public.initialize_project_doc_content(),public.set_updated_at();
drop schema auth cascade;
drop role anon,authenticated;
drop extension dblink;
commit;
\echo 'PASS: owner/parent isolation, atomic history rollback, operation replay, retained legacy history and actual two-connection CAS race'
