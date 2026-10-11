-- Only the disposable localhost CI service. Never bootstrap production.
\set ON_ERROR_STOP on
select current_database() = 'arcanea_private_imagine_fixture' as safe_fixture \gset
\if :safe_fixture
\else
\echo 'Refusing private asset fixture in another database'
\quit 3
\endif
create role anon;
create role authenticated;
create role service_role bypassrls;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
create function auth.role() returns text language sql stable as $$
  select nullif(current_setting('request.jwt.claim.role',true),'')
$$;
grant usage on schema auth to anon, authenticated, service_role;
\ir ../migrations/20261011000001_private_imagine_assets.sql
insert into auth.users values
 ('11111111-1111-4111-8111-111111111111'),
 ('22222222-2222-4222-8222-222222222222'),
 ('33333333-3333-4333-8333-333333333333');
insert into public.imagine_storage_accounts(user_id,capacity_bytes) values
 ('11111111-1111-4111-8111-111111111111',20),
 ('22222222-2222-4222-8222-222222222222',20);
set role service_role;
set request.jwt.claim.role = 'service_role';
do $$ declare a uuid := '11111111-1111-4111-8111-111111111111';
  id uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  row jsonb;
begin
  row := public.imagine_reserve_private_asset(a,id,10,'image/png',repeat('a',64),repeat('b',64),'private prompt','scene','source-a','fixture');
  if row->>'status' <> 'reserved' then raise exception 'Reservation missing'; end if;
  perform public.imagine_reserve_private_asset(a,id,10,'image/png',repeat('a',64),repeat('b',64),'private prompt','scene','source-a','fixture');
  if (select reserved_bytes from public.imagine_storage_accounts where user_id=a) <> 10 then raise exception 'Retry double-reserved'; end if;
  begin
    perform public.imagine_reserve_private_asset(a,id,10,'image/png',repeat('a',64),repeat('b',64),'changed prompt','scene','source-a','fixture');
    raise exception 'Metadata conflict accepted';
  exception when raise_exception then if sqlerrm <> 'private_asset_conflict' then raise; end if; end;
  begin
    perform public.imagine_reserve_private_asset('33333333-3333-4333-8333-333333333333',gen_random_uuid(),1,'image/png',repeat('a',64),repeat('b',64),'','scene','source','fixture');
    raise exception 'Unconfigured quota defaulted';
  exception when raise_exception then if sqlerrm <> 'private_storage_unconfigured' then raise; end if; end;
  perform public.imagine_reserve_private_asset(a,'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',10,'image/png',repeat('c',64),repeat('d',64),'held','scene','source-b','fixture');
  begin
    perform public.imagine_reserve_private_asset(a,gen_random_uuid(),1,'image/png',repeat('a',64),repeat('b',64),'','scene','source','fixture');
    raise exception 'Quota overflow admitted';
  exception when raise_exception then if sqlerrm <> 'private_storage_full' then raise; end if; end;
  perform public.imagine_complete_private_asset(a,id,repeat('b',64));
  perform public.imagine_complete_private_asset(a,id,repeat('b',64));
  if (select used_bytes from public.imagine_storage_accounts where user_id=a) <> 10
    or (select reserved_bytes from public.imagine_storage_accounts where user_id=a) <> 10 then raise exception 'Completion duplicated or released unknown upload'; end if;
  raise notice 'PASS stable reservation, metadata conflict, unconfigured/full quota, duplicate completion and unknown hold';
end $$;
reset role;
set role authenticated;
set request.jwt.claim.role = 'authenticated';
set request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
do $$ begin
  if jsonb_array_length(public.imagine_private_gallery()) <> 1 then raise exception 'Owner gallery lost completed record or exposed held upload'; end if;
  if public.imagine_read_private_asset('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')->>'prompt' <> 'private prompt' then raise exception 'Owner metadata lost'; end if;
  if public.imagine_private_gallery((select created_at from public.imagine_private_assets limit 1),'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa') <> '[]'::jsonb then raise exception 'Pagination repeated boundary'; end if;
  if public.imagine_read_private_asset('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb') is not null then raise exception 'Unverified upload became readable'; end if;
  begin
    perform public.imagine_complete_private_asset(auth.uid(),'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',repeat('d',64));
    raise exception 'Client completed unverified content';
  exception when insufficient_privilege then null; end;
  begin
    update public.imagine_storage_accounts set capacity_bytes=999999;
    raise exception 'Client changed quota';
  exception when insufficient_privilege then null; end;
  begin
    delete from public.imagine_private_assets;
    raise exception 'Client discarded retained bytes metadata';
  exception when insufficient_privilege then null; end;
  raise notice 'PASS owner gallery/reopen/pagination and denial of client completion/quota/delete';
end $$;
set request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222';
do $$ begin
  if public.imagine_private_gallery() <> '[]'::jsonb or public.imagine_read_private_asset('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa') is not null then raise exception 'Cross-account private image leak'; end if;
  raise notice 'PASS foreign account denied';
end $$;
set request.jwt.claim.sub = '';
do $$ begin
  if public.imagine_private_gallery() <> '[]'::jsonb then raise exception 'Expired auth exposed private assets'; end if;
end $$;
set role anon;
do $$ begin
  begin
    perform public.imagine_read_private_asset('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
    raise exception 'Guest read admitted';
  exception when insufficient_privilege then null; end;
  begin
    perform public.imagine_reserve_private_asset(null,gen_random_uuid(),1,'image/png',repeat('a',64),repeat('b',64),'','scene','source','fixture');
    raise exception 'Guest reservation admitted';
  exception when insufficient_privilege then null; end;
  raise notice 'PASS guest and expired auth denied';
end $$;
reset role;

-- Two actual connections race for 15 bytes each against one 20-byte account.
create extension dblink;
select dblink_connect('one','host=localhost port=5432 dbname=arcanea_private_imagine_fixture user=postgres password=disposable-author-fixture');
select dblink_connect('two','host=localhost port=5432 dbname=arcanea_private_imagine_fixture user=postgres password=disposable-author-fixture');
select dblink_exec('one',$$set role service_role; set request.jwt.claim.role='service_role'$$);
select dblink_exec('two',$$set role service_role; set request.jwt.claim.role='service_role'$$);
select dblink_send_query('one',$$select public.imagine_reserve_private_asset('22222222-2222-4222-8222-222222222222','cccccccc-cccc-4ccc-8ccc-cccccccccccc',15,'image/png',repeat('a',64),repeat('b',64),'one','scene','source-one','fixture') from (select pg_sleep(0.1)) delay$$);
select dblink_send_query('two',$$select public.imagine_reserve_private_asset('22222222-2222-4222-8222-222222222222','dddddddd-dddd-4ddd-8ddd-dddddddddddd',15,'image/png',repeat('a',64),repeat('b',64),'two','scene','source-two','fixture') from (select pg_sleep(0.1)) delay$$);
create temporary table race_results as select result from dblink_get_result('one',false) as response(result jsonb);
insert into race_results select result from dblink_get_result('two',false) as response(result jsonb);
do $$ begin
  if (select count(*) from race_results) <> 1 or (select reserved_bytes from public.imagine_storage_accounts where user_id='22222222-2222-4222-8222-222222222222') <> 15
    or (select count(*) from public.imagine_private_assets where user_id='22222222-2222-4222-8222-222222222222') <> 1 then raise exception 'Concurrent quota admission exceeded capacity'; end if;
  if dblink_error_message('one') not like '%private_storage_full%' and dblink_error_message('two') not like '%private_storage_full%' then raise exception 'Race loser was not quota refusal'; end if;
  raise notice 'PASS actual concurrent account admission: one reservation, one quota denial';
end $$;
select dblink_disconnect('one');
select dblink_disconnect('two');
\echo 'Private image PostgreSQL/RLS/atomic admission fixture passed; no production schema was used.'
