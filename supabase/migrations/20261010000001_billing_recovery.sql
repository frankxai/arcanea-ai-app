-- Recovery for the draft billing kernel. Apply after 20261005000001 only.
-- No production application is implied by checking this migration into Git.
alter table public.billing_accounts add column if not exists polar_event_at timestamptz;
alter function public.billing_account_json(uuid) set search_path = '';
alter function public.billing_ensure_account(uuid,integer) set search_path = '';
alter function public.billing_set_plan(uuid,text,text,text,text,text,timestamptz,boolean) set search_path = '';
create table if not exists public.billing_operations (
  reference text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  fingerprint text not null,
  state text not null check (state in ('running', 'result_ready', 'refund_pending', 'completed', 'failed')),
  result jsonb,
  charged integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.billing_operations enable row level security;
revoke all on public.billing_operations from public, anon, authenticated;
-- Image results and prompts are private; only trusted RPCs access this table.
grant all on public.billing_operations to service_role;

-- This function only exists after the recovery migration commits.
create or replace function public.billing_recovery_ready()
returns boolean language sql security definer set search_path = '' as $$ select true $$;
revoke all on function public.billing_recovery_ready() from public,anon,authenticated;
grant execute on function public.billing_recovery_ready() to service_role;

-- The ledger reference owns welcome idempotency even on an existing account.
create or replace function public.billing_ensure_account(p_user uuid,p_welcome integer default 0)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  insert into public.billing_accounts(user_id) values(p_user) on conflict do nothing;
  if p_welcome > 0 then
    perform public.billing_grant_credits(p_user,p_welcome,'grant','welcome:' || p_user::text,
      jsonb_build_object('reason','welcome'));
  end if;
  return public.billing_account_json(p_user);
end $$;

create or replace function public.billing_operation_json(p_user uuid, p_reference text)
returns jsonb language sql security definer set search_path = '' as $$
  select public.billing_account_json(p_user) || coalesce((
    select jsonb_build_object('state', state, 'result', result, 'charged', charged)
      from public.billing_operations where reference = p_reference and user_id = p_user
  ), '{}'::jsonb);
$$;

-- Serialize before the existence test. Duplicate calls never race the unique key.
create or replace function public.billing_grant_credits(
  p_user uuid, p_amount integer, p_kind text, p_reference text, p_metadata jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_bal integer; v_res integer; v_existing public.credit_ledger;
begin
  if p_amount is null or p_amount <= 0 or p_kind not in ('grant','purchase','refund','adjust') or p_reference is null then
    raise exception 'invalid grant' using errcode = '22023';
  end if;
  insert into public.billing_accounts(user_id) values(p_user) on conflict do nothing;
  perform 1 from public.billing_accounts where user_id = p_user for update;
  select * into v_existing from public.credit_ledger where kind = p_kind and reference = p_reference;
  if found then
    if v_existing.user_id <> p_user or v_existing.amount <> p_amount then
      raise exception 'grant reference conflict' using errcode = '22023';
    end if;
    return public.billing_account_json(p_user) || jsonb_build_object('applied',false);
  end if;
  update public.billing_accounts set balance = balance + p_amount where user_id = p_user
    returning balance,reserved into v_bal,v_res;
  insert into public.credit_ledger(user_id,kind,amount,balance_after,reserved_after,reference,metadata)
    values(p_user,p_kind,p_amount,v_bal,v_res,p_reference,p_metadata);
  return public.billing_account_json(p_user) || jsonb_build_object('applied',true);
end $$;

create or replace function public.billing_reserve_credits(
  p_user uuid, p_amount integer, p_action text, p_reference text, p_metadata jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_bal integer; v_res integer; v_existing public.credit_ledger;
begin
  if p_amount is null or p_amount < 0 or p_reference is null or length(p_reference) > 200 then
    raise exception 'invalid reservation' using errcode = '22023';
  end if;
  insert into public.billing_accounts(user_id) values(p_user) on conflict do nothing;
  select balance,reserved into v_bal,v_res from public.billing_accounts where user_id = p_user for update;
  select * into v_existing from public.credit_ledger where kind = 'reserve' and reference = p_reference;
  if found then
    if v_existing.user_id <> p_user or -v_existing.amount <> p_amount or v_existing.action <> p_action
      or coalesce(v_existing.metadata->>'fingerprint','') <> coalesce(p_metadata->>'fingerprint','') then
      return public.billing_account_json(p_user) || jsonb_build_object('ok',false,'reason','request_conflict');
    end if;
    return public.billing_operation_json(p_user,p_reference) || jsonb_build_object('ok',true,'idempotent',true);
  end if;
  if v_bal < p_amount then
    return public.billing_account_json(p_user) || jsonb_build_object('ok',false,'reason','insufficient_credits','required',p_amount);
  end if;
  update public.billing_accounts set balance = balance-p_amount,reserved = reserved+p_amount where user_id = p_user
    returning balance,reserved into v_bal,v_res;
  insert into public.credit_ledger(user_id,kind,amount,balance_after,reserved_after,action,reference,metadata)
    values(p_user,'reserve',-p_amount,v_bal,v_res,p_action,p_reference,p_metadata);
  insert into public.billing_operations(reference,user_id,fingerprint,state)
    values(p_reference,p_user,coalesce(p_metadata->>'fingerprint',''),'running');
  return public.billing_operation_json(p_user,p_reference) || jsonb_build_object('ok',true,'idempotent',false);
end $$;

-- All terminal transitions take the same account lock BEFORE checking terminal state.
create or replace function public.billing_settle_reservation(
  p_user uuid,p_reference text,p_actual integer,p_metadata jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_amount integer; v_refund integer; v_bal integer; v_res integer;
begin
  perform 1 from public.billing_accounts where user_id = p_user for update;
  select -amount into v_amount from public.credit_ledger where kind = 'reserve' and reference = p_reference and user_id = p_user;
  if not found then raise exception 'unknown reservation' using errcode = 'P0002'; end if;
  if exists(select 1 from public.credit_ledger where kind in ('settle','release') and reference = p_reference and user_id = p_user) then
    return public.billing_operation_json(p_user,p_reference) || jsonb_build_object('ok',true,'idempotent',true);
  end if;
  if p_actual is null or p_actual < 0 or p_actual > v_amount then raise exception 'invalid settlement' using errcode = '22023'; end if;
  if not exists(select 1 from public.billing_operations where reference=p_reference and user_id=p_user
    and state='result_ready' and result is not null and charged=p_actual) then
    raise exception 'cannot settle without staged result' using errcode='22023';
  end if;
  v_refund := v_amount-p_actual;
  update public.billing_accounts set reserved = reserved-v_amount,balance = balance+v_refund where user_id = p_user
    returning balance,reserved into v_bal,v_res;
  insert into public.credit_ledger(user_id,kind,amount,balance_after,reserved_after,reference,metadata)
    values(p_user,'settle',v_refund,v_bal,v_res,p_reference,p_metadata || jsonb_build_object('charged',p_actual));
  update public.billing_operations set state='completed',charged=p_actual,updated_at=now() where reference=p_reference and user_id=p_user;
  return public.billing_operation_json(p_user,p_reference) || jsonb_build_object('ok',true,'idempotent',false);
end $$;

create or replace function public.billing_release_reservation(
  p_user uuid,p_reference text,p_metadata jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_amount integer; v_bal integer; v_res integer;
begin
  perform 1 from public.billing_accounts where user_id = p_user for update;
  select -amount into v_amount from public.credit_ledger where kind='reserve' and reference=p_reference and user_id=p_user;
  if not found then raise exception 'unknown reservation' using errcode='P0002'; end if;
  if exists(select 1 from public.credit_ledger where kind in ('settle','release') and reference=p_reference and user_id=p_user) then
    return public.billing_operation_json(p_user,p_reference) || jsonb_build_object('ok',true,'idempotent',true);
  end if;
  if not exists(select 1 from public.billing_operations where reference=p_reference and user_id=p_user
    and state in ('running','refund_pending')) then
    raise exception 'cannot release staged result' using errcode='22023';
  end if;
  update public.billing_accounts set reserved=reserved-v_amount,balance=balance+v_amount where user_id=p_user
    returning balance,reserved into v_bal,v_res;
  insert into public.credit_ledger(user_id,kind,amount,balance_after,reserved_after,reference,metadata)
    values(p_user,'release',v_amount,v_bal,v_res,p_reference,p_metadata);
  update public.billing_operations set state='failed',charged=0,updated_at=now() where reference=p_reference and user_id=p_user;
  return public.billing_operation_json(p_user,p_reference) || jsonb_build_object('ok',true,'idempotent',false);
end $$;

-- Persist refund intent separately so a failed release can be resumed by the same request.
create or replace function public.billing_request_release(p_user uuid,p_reference text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform 1 from public.billing_accounts where user_id=p_user for update;
  update public.billing_operations set state='refund_pending',updated_at=now()
    where reference=p_reference and user_id=p_user and state in ('running','refund_pending');
end $$;

-- Stage the output before settlement so an uncertain financial acknowledgement
-- can recover the actual artifact without invoking the provider a second time.
create or replace function public.billing_stage_result(p_user uuid,p_reference text,p_actual integer,p_result jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare v_op public.billing_operations; v_amount integer;
begin
  perform 1 from public.billing_accounts where user_id=p_user for update;
  select * into v_op from public.billing_operations where reference=p_reference and user_id=p_user;
  if not found then raise exception 'unknown operation' using errcode='P0002'; end if;
  select -amount into v_amount from public.credit_ledger where reference=p_reference and user_id=p_user and kind='reserve';
  if v_op.state in ('result_ready','completed') then
    if v_op.result <> p_result or v_op.charged <> p_actual then raise exception 'result conflict' using errcode='22023'; end if;
    return;
  end if;
  if v_op.state <> 'running' or p_result is null or p_actual is null or p_actual < 0 or p_actual > v_amount
    or octet_length(p_result::text)>33554432 then raise exception 'invalid result' using errcode='22023'; end if;
  update public.billing_operations set state='result_ready',result=p_result,charged=p_actual,updated_at=now()
    where reference=p_reference and user_id=p_user;
end $$;

-- Result and financial settlement commit together, and replay never calls a provider.
create or replace function public.billing_complete_operation(p_user uuid,p_reference text,p_actual integer,p_result jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_state text;
begin
  perform 1 from public.billing_accounts where user_id=p_user for update;
  select state into v_state from public.billing_operations where reference=p_reference and user_id=p_user;
  if not found then raise exception 'unknown operation' using errcode='P0002'; end if;
  if v_state='completed' then return public.billing_operation_json(p_user,p_reference) || jsonb_build_object('ok',true,'idempotent',true); end if;
  if v_state <> 'result_ready' or p_result is null or octet_length(p_result::text) > 33554432 then
    raise exception 'invalid operation completion' using errcode='22023';
  end if;
  if not exists(select 1 from public.billing_operations where reference=p_reference and user_id=p_user
    and result=p_result and charged=p_actual) then raise exception 'result conflict' using errcode='22023'; end if;
  perform public.billing_settle_reservation(p_user,p_reference,p_actual);
  update public.billing_operations set result=p_result where reference=p_reference and user_id=p_user;
  return public.billing_operation_json(p_user,p_reference) || jsonb_build_object('ok',true,'idempotent',false);
end $$;

-- Signed-event receipt, every intent, and processed_at share a single transaction.
create or replace function public.billing_apply_event(p_id text,p_type text,p_payload jsonb,p_intents jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_event public.billing_events; v_intent jsonb; v_count integer := 0;
  v_user uuid; v_at timestamptz; v_account public.billing_accounts;
begin
  if p_id is null or length(p_id)=0 or length(p_id)>200 or p_intents is null or jsonb_typeof(p_intents) <> 'array' then
    raise exception 'invalid event' using errcode='22023';
  end if;
  if (p_type='order.paid' or p_type like 'subscription.%') and jsonb_array_length(p_intents)=0 then
    raise exception 'required fulfillment intent missing' using errcode='22023';
  end if;
  if p_type='order.refunded' then raise exception 'refund reconciliation required' using errcode='22023'; end if;
  insert into public.billing_events(id,type,payload) values(p_id,p_type,p_payload) on conflict do nothing;
  select * into v_event from public.billing_events where id=p_id for update;
  if v_event.type <> p_type or v_event.payload <> p_payload then raise exception 'event identity conflict' using errcode='22023'; end if;
  if v_event.processed_at is not null and v_event.error is null then return jsonb_build_object('duplicate',true,'applied',0); end if;
  for v_intent in select value from jsonb_array_elements(p_intents) loop
    if v_intent->>'kind'='grant' then
      perform public.billing_grant_credits((v_intent->>'userId')::uuid,(v_intent->>'amount')::integer,
        v_intent->>'grantKind',v_intent->>'reference',coalesce(v_intent->'metadata','{}'::jsonb));
    elsif v_intent->>'kind'='setPlan' then
      v_user := (v_intent->>'userId')::uuid;
      v_at := (v_intent->>'occurredAt')::timestamptz;
      if v_at is null then raise exception 'event version missing' using errcode='22023'; end if;
      insert into public.billing_accounts(user_id) values(v_user) on conflict do nothing;
      select * into v_account from public.billing_accounts where user_id=v_user for update;
      if v_account.polar_event_at is not null and v_at <= v_account.polar_event_at then continue; end if;
      if v_account.polar_subscription_id is not null and v_account.polar_subscription_id <> v_intent->>'polarSubscriptionId' then
        raise exception 'subscription identity requires reconciliation' using errcode='22023';
      end if;
      perform public.billing_set_plan((v_intent->>'userId')::uuid,v_intent->>'plan',v_intent->>'status',
        v_intent->>'polarCustomerId',v_intent->>'polarSubscriptionId',v_intent->>'polarProductId',
        (v_intent->>'currentPeriodEnd')::timestamptz,coalesce((v_intent->>'cancelAtPeriodEnd')::boolean,false));
      update public.billing_accounts set polar_event_at=v_at where user_id=v_user;
    else raise exception 'unknown intent' using errcode='22023'; end if;
    v_count := v_count+1;
  end loop;
  update public.billing_events set processed_at=now(),error=null where id=p_id;
  return jsonb_build_object('duplicate',false,'applied',v_count);
end $$;

revoke all on function public.billing_operation_json(uuid,text) from public,anon,authenticated;
revoke all on function public.billing_request_release(uuid,text) from public,anon,authenticated;
revoke all on function public.billing_stage_result(uuid,text,integer,jsonb) from public,anon,authenticated;
revoke all on function public.billing_complete_operation(uuid,text,integer,jsonb) from public,anon,authenticated;
revoke all on function public.billing_apply_event(text,text,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.billing_operation_json(uuid,text),public.billing_request_release(uuid,text),
  public.billing_stage_result(uuid,text,integer,jsonb),public.billing_complete_operation(uuid,text,integer,jsonb),public.billing_apply_event(text,text,jsonb,jsonb),
  public.billing_ensure_account(uuid,integer),public.billing_account_json(uuid),
  public.billing_grant_credits(uuid,integer,text,text,jsonb),public.billing_reserve_credits(uuid,integer,text,text,jsonb),
  public.billing_settle_reservation(uuid,text,integer,jsonb),public.billing_release_reservation(uuid,text,jsonb),
  public.billing_set_plan(uuid,text,text,text,text,text,timestamptz,boolean) to service_role;
