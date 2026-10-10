-- Disposable PostgreSQL fixture. Never run against the product database.
\set ON_ERROR_STOP on
create role anon;
create role authenticated;
create role service_role bypassrls;
create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
grant usage on schema auth to anon,authenticated,service_role;
insert into auth.users values('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002');
\ir ../migrations/20261005000001_billing_kernel.sql
\ir ../migrations/20261010000001_billing_recovery.sql

do $$
declare u uuid := '00000000-0000-0000-0000-000000000001'; r jsonb; intents jsonb;
begin
  -- Welcome grant survives account creation and is applied exactly once.
  r := public.billing_ensure_account(u,25);
  if (r->>'balance')::integer <> 25 then raise exception 'welcome missing'; end if;
  r := public.billing_ensure_account(u,25);
  if (r->>'balance')::integer <> 25 then raise exception 'welcome duplicated'; end if;
  perform public.billing_grant_credits(u,975,'grant','fixture:fuel');
  r := public.billing_reserve_credits(u,10,'image.standard','fixture:operation','{"fingerprint":"draft-a"}');
  if r->>'state' <> 'running' then raise exception 'not running'; end if;
  r := public.billing_reserve_credits(u,10,'image.standard','fixture:operation','{"fingerprint":"draft-a"}');
  if not (r->>'idempotent')::boolean then raise exception 'reserve not idempotent'; end if;
  r := public.billing_reserve_credits(u,10,'image.standard','fixture:operation','{"fingerprint":"draft-b"}');
  if r->>'reason' <> 'request_conflict' then raise exception 'fingerprint conflict missing'; end if;
  perform public.billing_stage_result(u,'fixture:operation',6,'{"images":[{"url":"fixture-image"}]}');
  r := public.billing_complete_operation(u,'fixture:operation',6,'{"images":[{"url":"fixture-image"}]}');
  if r->>'state' <> 'completed' or (r->>'balance')::integer <> 994 or (r->>'charged')::integer <> 6 then raise exception 'settlement incorrect'; end if;
  perform public.billing_release_reservation(u,'fixture:operation');
  r := public.billing_reserve_credits(u,10,'image.standard','fixture:operation','{"fingerprint":"draft-a"}');
  if r->'result'->'images'->0->>'url' <> 'fixture-image' then raise exception 'replay artifact missing'; end if;
  if (r->>'balance')::integer <> 994 then raise exception 'release after settle refunded'; end if;
  perform public.billing_reserve_credits(u,20,'image.standard','fixture:failed');
  perform public.billing_request_release(u,'fixture:failed');
  r := public.billing_reserve_credits(u,20,'image.standard','fixture:failed');
  if r->>'state' <> 'refund_pending' then raise exception 'refund intent missing'; end if;
  perform public.billing_release_reservation(u,'fixture:failed');
  r := public.billing_release_reservation(u,'fixture:failed');
  if (r->>'balance')::integer <> 994 or not (r->>'idempotent')::boolean then raise exception 'refund not idempotent'; end if;
  intents := jsonb_build_array(jsonb_build_object('kind','grant','userId',u,'amount',500,'grantKind','purchase','reference','fixture:order','metadata','{}'::jsonb),
    jsonb_build_object('kind','grant','userId',u,'amount',0,'grantKind','purchase','reference','fixture:bad-order'));
  begin
    perform public.billing_apply_event('fixture:delivery','order.paid','{}',intents);
    raise exception 'invalid intent unexpectedly accepted';
  exception when sqlstate '22023' then null; end;
  if exists(select 1 from public.billing_events where id='fixture:delivery') or exists(select 1 from public.credit_ledger where reference='fixture:order') then raise exception 'partial event committed'; end if;
  r := public.billing_apply_event('fixture:delivery','order.paid','{}',jsonb_build_array(intents->0));
  r := public.billing_apply_event('fixture:delivery','order.paid','{}',jsonb_build_array(intents->0));
  if not (r->>'duplicate')::boolean then raise exception 'webhook retry not idempotent'; end if;
  if (select balance from public.billing_accounts where user_id=u) <> 1494 then raise exception 'purchase duplicated'; end if;
  if has_function_privilege('authenticated','public.billing_complete_operation(uuid,text,integer,jsonb)','EXECUTE') or has_function_privilege('anon','public.billing_apply_event(text,text,jsonb,jsonb)','EXECUTE') then raise exception 'RPC privilege leak'; end if;
  if not has_function_privilege('service_role','public.billing_apply_event(text,text,jsonb,jsonb)','EXECUTE') then raise exception 'service role cannot process'; end if;
end $$;
-- Set up separate operations for deterministic contention tests.
select public.billing_reserve_credits('00000000-0000-0000-0000-000000000001',20,'image.standard','race:target');
select public.billing_reserve_credits('00000000-0000-0000-0000-000000000001',30,'image.standard','race:other');
