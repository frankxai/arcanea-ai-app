-- Extend only the existing disposable CI database. Never replay live DDL.
\set ON_ERROR_STOP on
select current_database() = 'arcanea_private_imagine_fixture'
  and to_regclass('public.imagine_storage_accounts') is not null
  and to_regclass('public.project_docs') is null
  and to_regclass('public.project_doc_media') is null as safe_fixture \gset
\if :safe_fixture
\else
\echo 'Refusing document media fixture outside the expected disposable database'
\quit 3
\endif
\ir ../migrations/20260402000001_project_docs.sql
\ir ../migrations/20261012000001_project_doc_media.sql
grant select,delete on public.project_docs to authenticated;
grant all on public.project_docs to service_role;
insert into auth.users values
 ('44444444-4444-4444-8444-444444444444'),
 ('55555555-5555-4555-8555-555555555555'),
 ('66666666-6666-4666-8666-666666666666');
insert into public.project_docs(id,workspace_id,project_id,user_id,title) values
 ('aaaaaaaa-0000-4000-8000-000000000001','aaaaaaaa-0000-4000-8000-000000000000','aaaaaaaa-0000-4000-8000-000000000000','44444444-4444-4444-8444-444444444444','Originals'),
 ('bbbbbbbb-0000-4000-8000-000000000001','bbbbbbbb-0000-4000-8000-000000000000','bbbbbbbb-0000-4000-8000-000000000000','55555555-5555-4555-8555-555555555555','Foreign');
insert into public.imagine_storage_accounts(user_id,capacity_bytes) values
 ('44444444-4444-4444-8444-444444444444',10485761),
 ('55555555-5555-4555-8555-555555555555',20);
set role service_role;
set request.jwt.claim.role = 'service_role';
do $$ declare
  owner uuid := '44444444-4444-4444-8444-444444444444';
  project uuid := 'aaaaaaaa-0000-4000-8000-000000000000';
  doc uuid := 'aaaaaaaa-0000-4000-8000-000000000001';
  id uuid := 'dddddddd-0000-4000-8000-000000000001';
begin
  perform public.reserve_project_document_media(owner,project,doc,id,10485760,'image/png',repeat('a',64),repeat('b',64),'map.png','A map');
  perform public.reserve_project_document_media(owner,project,doc,id,10485760,'image/png',repeat('a',64),repeat('b',64),'map.png','A map');
  if (select reserved_bytes from public.imagine_storage_accounts where user_id=owner) <> 10485760 then raise exception 'Duplicate original reservation'; end if;
  begin
    perform public.reserve_project_document_media(owner,project,doc,id,10485760,'image/png',repeat('a',64),repeat('b',64),'different.png','A map');
    raise exception 'Changed original metadata accepted';
  exception when raise_exception then if sqlerrm <> 'document_media_conflict' then raise; end if; end;
  begin
    perform public.reserve_project_document_media(owner,project,doc,gen_random_uuid(),10485761,'image/png',repeat('a',64),repeat('b',64),'large.png','Too large');
    raise exception 'Original limit exceeded';
  exception when raise_exception then if sqlerrm <> 'document_media_invalid' then raise; end if; end;
  begin
    perform public.reserve_project_document_media(owner,project,'bbbbbbbb-0000-4000-8000-000000000001',gen_random_uuid(),1,'image/png',repeat('a',64),repeat('b',64),'foreign.png','Wrong document');
    raise exception 'Foreign document admitted';
  exception when raise_exception then if sqlerrm <> 'document_media_missing' then raise; end if; end;
  perform public.reserve_project_document_media(owner,project,doc,'dddddddd-0000-4000-8000-000000000002',1,'image/png',repeat('c',64),repeat('d',64),'held.png','Unconfirmed');
  begin
    perform public.imagine_reserve_private_asset(owner,gen_random_uuid(),1,'image/png',repeat('a',64),repeat('b',64),'','Map','source',null);
    raise exception 'Imagine bypassed document reservation quota';
  exception when raise_exception then if sqlerrm <> 'private_storage_full' then raise; end if; end;
  perform public.complete_project_document_media(owner,project,doc,id,repeat('b',64));
  perform public.complete_project_document_media(owner,project,doc,id,repeat('b',64));
  if (select used_bytes from public.imagine_storage_accounts where user_id=owner) <> 10485760
    or (select reserved_bytes from public.imagine_storage_accounts where user_id=owner) <> 1 then raise exception 'Completion duplicated or released unknown bytes'; end if;
  begin
    perform public.reserve_project_document_media('66666666-6666-4666-8666-666666666666',project,doc,gen_random_uuid(),1,'image/png',repeat('a',64),repeat('b',64),'x.png','Missing capacity');
    raise exception 'Unconfigured storage acquired capacity';
  exception when raise_exception then if sqlerrm <> 'document_media_unconfigured' then raise; end if; end;
  raise notice 'PASS 10MiB, same-ID replay, scope/metadata/limit denial, shared capacity and uncertain reservation';
end $$;
reset role;
set role authenticated;
set request.jwt.claim.role = 'authenticated';
set request.jwt.claim.sub = '44444444-4444-4444-8444-444444444444';
do $$ begin
  if (select count(*) from public.project_doc_media) <> 1 then raise exception 'Owner cannot read ready original or can read pending original'; end if;
  begin
    perform public.complete_project_document_media(auth.uid(),'aaaaaaaa-0000-4000-8000-000000000000','aaaaaaaa-0000-4000-8000-000000000001','dddddddd-0000-4000-8000-000000000002',repeat('d',64));
    raise exception 'Client could complete unverified bytes';
  exception when insufficient_privilege then null; end;
  begin
    delete from public.project_doc_media;
    raise exception 'Client discarded media accounting';
  exception when insufficient_privilege then null; end;
end $$;
set request.jwt.claim.sub = '55555555-5555-4555-8555-555555555555';
do $$ begin
  if exists(select 1 from public.project_doc_media) then raise exception 'Foreign original exposed'; end if;
end $$;
reset role;
set role anon;
do $$ begin
  begin perform 1 from public.project_doc_media; raise exception 'Anonymous original metadata exposed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

-- Real connections race an Imagine image against a document original, using
-- the same pre-existing account row lock and capacity.
select dblink_connect('doc_media_one','host=localhost port=5432 dbname=arcanea_private_imagine_fixture user=postgres password=disposable-author-fixture');
select dblink_connect('doc_media_two','host=localhost port=5432 dbname=arcanea_private_imagine_fixture user=postgres password=disposable-author-fixture');
select dblink_exec('doc_media_one',$$set role service_role; set request.jwt.claim.role='service_role'$$);
select dblink_exec('doc_media_two',$$set role service_role; set request.jwt.claim.role='service_role'$$);
select dblink_send_query('doc_media_one',$$select public.reserve_project_document_media('55555555-5555-4555-8555-555555555555','bbbbbbbb-0000-4000-8000-000000000000','bbbbbbbb-0000-4000-8000-000000000001','eeeeeeee-0000-4000-8000-000000000001',15,'image/png',repeat('a',64),repeat('b',64),'race.png','Race') from (select pg_sleep(0.1)) delay$$);
select dblink_send_query('doc_media_two',$$select public.imagine_reserve_private_asset('55555555-5555-4555-8555-555555555555','eeeeeeee-0000-4000-8000-000000000002',15,'image/png',repeat('a',64),repeat('b',64),'','Race','source',null) from (select pg_sleep(0.1)) delay$$);
create temporary table media_race_results as select result from dblink_get_result('doc_media_one',false) as response(result jsonb);
insert into media_race_results select result from dblink_get_result('doc_media_two',false) as response(result jsonb);
do $$ begin
  if (select count(*) from media_race_results) <> 1 or (select reserved_bytes from public.imagine_storage_accounts where user_id='55555555-5555-4555-8555-555555555555') <> 15 then raise exception 'Cross-product quota race exceeded capacity'; end if;
  if dblink_error_message('doc_media_one') not like '%document_media_full%' and dblink_error_message('doc_media_two') not like '%private_storage_full%' then raise exception 'Race loser was not denied by capacity'; end if;
  raise notice 'PASS actual concurrent Imagine/document admission: one reservation, one denial';
end $$;
select dblink_disconnect('doc_media_one');
select dblink_disconnect('doc_media_two');
set role authenticated;
set request.jwt.claim.role = 'authenticated';
set request.jwt.claim.sub = '44444444-4444-4444-8444-444444444444';
delete from public.project_docs where id='aaaaaaaa-0000-4000-8000-000000000001';
do $$ begin
  if exists(select 1 from public.project_doc_media) then raise exception 'Deleted document still exposes original bytes metadata'; end if;
end $$;
reset role;
do $$ begin
  if (select count(*) from public.project_doc_media where user_id='44444444-4444-4444-8444-444444444444') <> 2
    or (select used_bytes from public.imagine_storage_accounts where user_id='44444444-4444-4444-8444-444444444444') <> 10485760
    or (select reserved_bytes from public.imagine_storage_accounts where user_id='44444444-4444-4444-8444-444444444444') <> 1 then raise exception 'Document deletion silently discarded reservations or byte records'; end if;
end $$;
\echo 'Document media SQL/RLS/shared-capacity fixture passed; no production schema was used.'
