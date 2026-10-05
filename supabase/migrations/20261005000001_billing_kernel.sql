-- =============================================================================
-- Arcanea Billing Kernel — one account, one ledger, one webhook inbox.
--
-- Replaces the three divergent credit models (credit_balances, credits,
-- user_credits) with a single private billing boundary. Those tables are left
-- in place untouched; no code path reads them after this migration lands and
-- they can be dropped in a later, explicitly approved slice.
--
-- Invariants enforced here, not in application code:
--   * available balance and reserved amount never go negative
--   * every balance change is an append-only ledger row
--   * every ledger kind + reference pair is unique, so retries are idempotent
--   * every webhook delivery is recorded once by its provider id
--   * users can read their own account and ledger; only the service role writes
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.billing_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'spark'
    check (plan in ('spark', 'creator', 'studio')),
  plan_status text not null default 'none'
    check (plan_status in ('none', 'active', 'trialing', 'past_due', 'canceled', 'revoked', 'paused')),
  polar_customer_id text unique,
  polar_subscription_id text unique,
  polar_product_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  balance integer not null default 0 check (balance >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.billing_accounts is
  'Private billing boundary. Plan, Polar ids and credit balance per user. Service-role writes only.';

create table if not exists public.credit_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null
    check (kind in ('grant', 'purchase', 'reserve', 'settle', 'release', 'refund', 'adjust')),
  -- Signed delta applied to the available balance by this row.
  amount integer not null,
  balance_after integer not null,
  reserved_after integer not null,
  action text,
  reference text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (kind, reference)
);

comment on table public.credit_ledger is
  'Append-only credit history. (kind, reference) is unique so every grant, reservation and settlement is idempotent.';

create index if not exists credit_ledger_user_created_idx
  on public.credit_ledger (user_id, created_at desc);

create table if not exists public.billing_events (
  id text primary key,
  provider text not null default 'polar',
  type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error text
);

comment on table public.billing_events is
  'Webhook inbox keyed by the provider delivery id. A delivery is processed at most once.';

-- ---------------------------------------------------------------------------
-- Row level security: owners read, nobody but the service role writes.
-- ---------------------------------------------------------------------------

alter table public.billing_accounts enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.billing_events enable row level security;

drop policy if exists billing_accounts_select_own on public.billing_accounts;
create policy billing_accounts_select_own on public.billing_accounts
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists credit_ledger_select_own on public.credit_ledger;
create policy credit_ledger_select_own on public.credit_ledger
  for select to authenticated using (auth.uid() = user_id);

revoke all on public.billing_accounts from anon, authenticated;
revoke all on public.credit_ledger from anon, authenticated;
revoke all on public.billing_events from anon, authenticated;
grant select on public.billing_accounts to authenticated;
grant select on public.credit_ledger to authenticated;

-- ---------------------------------------------------------------------------
-- Functions. All are security definer and executable by the service role only.
-- They return jsonb so the application gets balance, reserved and plan in one
-- round trip without casting through generated types.
-- ---------------------------------------------------------------------------

create or replace function public.billing_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists billing_accounts_touch on public.billing_accounts;
create trigger billing_accounts_touch
  before update on public.billing_accounts
  for each row execute function public.billing_touch();

create or replace function public.billing_account_json(p_user uuid)
returns jsonb language sql security definer set search_path = public as $$
  select coalesce(
    (select jsonb_build_object(
        'userId', a.user_id,
        'plan', a.plan,
        'planStatus', a.plan_status,
        'balance', a.balance,
        'reserved', a.reserved,
        'currentPeriodEnd', a.current_period_end,
        'cancelAtPeriodEnd', a.cancel_at_period_end,
        'polarCustomerId', a.polar_customer_id,
        'polarSubscriptionId', a.polar_subscription_id)
     from public.billing_accounts a where a.user_id = p_user),
    jsonb_build_object('userId', p_user, 'plan', 'spark', 'planStatus', 'none',
      'balance', 0, 'reserved', 0, 'currentPeriodEnd', null,
      'cancelAtPeriodEnd', false, 'polarCustomerId', null, 'polarSubscriptionId', null));
$$;

-- Create the account on first contact and give the welcome grant exactly once.
create or replace function public.billing_ensure_account(p_user uuid, p_welcome integer default 0)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_inserted boolean := false;
begin
  insert into public.billing_accounts (user_id) values (p_user)
  on conflict (user_id) do nothing;
  get diagnostics v_inserted = row_count;

  if v_inserted and p_welcome > 0 then
    perform public.billing_grant_credits(p_user, p_welcome, 'grant', 'welcome:' || p_user::text,
      jsonb_build_object('reason', 'welcome'));
  end if;

  return public.billing_account_json(p_user);
end $$;

-- Idempotent credit grant (welcome, monthly plan grant, purchase, refund, adjust).
create or replace function public.billing_grant_credits(
  p_user uuid, p_amount integer, p_kind text, p_reference text, p_metadata jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_bal integer;
  v_res integer;
begin
  if p_amount <= 0 then
    raise exception 'grant amount must be positive' using errcode = '22023';
  end if;
  if p_kind not in ('grant', 'purchase', 'refund', 'adjust') then
    raise exception 'invalid grant kind %', p_kind using errcode = '22023';
  end if;

  insert into public.billing_accounts (user_id) values (p_user)
  on conflict (user_id) do nothing;

  -- Already applied: return current state without a second credit.
  if exists (select 1 from public.credit_ledger where kind = p_kind and reference = p_reference) then
    return public.billing_account_json(p_user) || jsonb_build_object('applied', false);
  end if;

  update public.billing_accounts
     set balance = balance + p_amount
   where user_id = p_user
  returning balance, reserved into v_bal, v_res;

  insert into public.credit_ledger (user_id, kind, amount, balance_after, reserved_after, reference, metadata)
  values (p_user, p_kind, p_amount, v_bal, v_res, p_reference, p_metadata);

  return public.billing_account_json(p_user) || jsonb_build_object('applied', true);
end $$;

-- Atomic admission. Moves credits from available to reserved under a row lock.
-- Returns {ok:true,...} or {ok:false, reason:'insufficient_credits', ...}.
create or replace function public.billing_reserve_credits(
  p_user uuid, p_amount integer, p_action text, p_reference text, p_metadata jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_bal integer;
  v_res integer;
begin
  if p_amount < 0 then
    raise exception 'reserve amount must not be negative' using errcode = '22023';
  end if;

  insert into public.billing_accounts (user_id) values (p_user)
  on conflict (user_id) do nothing;

  if exists (select 1 from public.credit_ledger where kind = 'reserve' and reference = p_reference) then
    return public.billing_account_json(p_user) || jsonb_build_object('ok', true, 'idempotent', true);
  end if;

  select balance, reserved into v_bal, v_res
    from public.billing_accounts where user_id = p_user for update;

  if v_bal < p_amount then
    return public.billing_account_json(p_user)
      || jsonb_build_object('ok', false, 'reason', 'insufficient_credits', 'required', p_amount);
  end if;

  update public.billing_accounts
     set balance = balance - p_amount, reserved = reserved + p_amount
   where user_id = p_user
  returning balance, reserved into v_bal, v_res;

  insert into public.credit_ledger (user_id, kind, amount, balance_after, reserved_after, action, reference, metadata)
  values (p_user, 'reserve', -p_amount, v_bal, v_res, p_action, p_reference, p_metadata);

  return public.billing_account_json(p_user) || jsonb_build_object('ok', true, 'idempotent', false);
end $$;

-- Settle a reservation at its actual cost. Any unused part returns to balance.
create or replace function public.billing_settle_reservation(
  p_user uuid, p_reference text, p_actual integer, p_metadata jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_reserved_amount integer;
  v_refund integer;
  v_bal integer;
  v_res integer;
begin
  if exists (select 1 from public.credit_ledger
              where kind in ('settle', 'release') and reference = p_reference) then
    return public.billing_account_json(p_user) || jsonb_build_object('ok', true, 'idempotent', true);
  end if;

  select -amount into v_reserved_amount
    from public.credit_ledger
   where kind = 'reserve' and reference = p_reference and user_id = p_user;

  if v_reserved_amount is null then
    raise exception 'unknown reservation %', p_reference using errcode = 'P0002';
  end if;

  v_refund := greatest(v_reserved_amount - greatest(coalesce(p_actual, v_reserved_amount), 0), 0);

  perform 1 from public.billing_accounts where user_id = p_user for update;

  update public.billing_accounts
     set reserved = reserved - v_reserved_amount, balance = balance + v_refund
   where user_id = p_user
  returning balance, reserved into v_bal, v_res;

  insert into public.credit_ledger (user_id, kind, amount, balance_after, reserved_after, reference, metadata)
  values (p_user, 'settle', v_refund, v_bal, v_res, p_reference,
          p_metadata || jsonb_build_object('reserved', v_reserved_amount, 'charged', v_reserved_amount - v_refund));

  return public.billing_account_json(p_user)
    || jsonb_build_object('ok', true, 'idempotent', false, 'charged', v_reserved_amount - v_refund);
end $$;

-- Release a reservation in full (generation failed before any cost was incurred).
create or replace function public.billing_release_reservation(
  p_user uuid, p_reference text, p_metadata jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_reserved_amount integer;
  v_bal integer;
  v_res integer;
begin
  if exists (select 1 from public.credit_ledger
              where kind in ('settle', 'release') and reference = p_reference) then
    return public.billing_account_json(p_user) || jsonb_build_object('ok', true, 'idempotent', true);
  end if;

  select -amount into v_reserved_amount
    from public.credit_ledger
   where kind = 'reserve' and reference = p_reference and user_id = p_user;

  if v_reserved_amount is null then
    raise exception 'unknown reservation %', p_reference using errcode = 'P0002';
  end if;

  perform 1 from public.billing_accounts where user_id = p_user for update;

  update public.billing_accounts
     set reserved = reserved - v_reserved_amount, balance = balance + v_reserved_amount
   where user_id = p_user
  returning balance, reserved into v_bal, v_res;

  insert into public.credit_ledger (user_id, kind, amount, balance_after, reserved_after, reference, metadata)
  values (p_user, 'release', v_reserved_amount, v_bal, v_res, p_reference, p_metadata);

  return public.billing_account_json(p_user) || jsonb_build_object('ok', true, 'idempotent', false);
end $$;

-- Subscription state from the payment provider. Pure upsert; grants happen separately.
create or replace function public.billing_set_plan(
  p_user uuid, p_plan text, p_status text,
  p_polar_customer_id text default null, p_polar_subscription_id text default null,
  p_polar_product_id text default null, p_period_end timestamptz default null,
  p_cancel_at_period_end boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.billing_accounts (user_id) values (p_user)
  on conflict (user_id) do nothing;

  update public.billing_accounts
     set plan = p_plan,
         plan_status = p_status,
         polar_customer_id = coalesce(p_polar_customer_id, polar_customer_id),
         polar_subscription_id = coalesce(p_polar_subscription_id, polar_subscription_id),
         polar_product_id = coalesce(p_polar_product_id, polar_product_id),
         current_period_end = coalesce(p_period_end, current_period_end),
         cancel_at_period_end = p_cancel_at_period_end
   where user_id = p_user;

  return public.billing_account_json(p_user);
end $$;

-- Record a webhook delivery. Returns true when this is the first time we see it.
create or replace function public.billing_record_event(p_id text, p_type text, p_payload jsonb)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  insert into public.billing_events (id, type, payload) values (p_id, p_type, p_payload)
  on conflict (id) do nothing;
  return found;
end $$;

create or replace function public.billing_mark_event(p_id text, p_error text default null)
returns void language sql security definer set search_path = public as $$
  update public.billing_events set processed_at = now(), error = p_error where id = p_id;
$$;

-- Service role only. These functions bypass RLS by design.
revoke all on function public.billing_account_json(uuid) from public, anon, authenticated;
revoke all on function public.billing_ensure_account(uuid, integer) from public, anon, authenticated;
revoke all on function public.billing_grant_credits(uuid, integer, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.billing_reserve_credits(uuid, integer, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.billing_settle_reservation(uuid, text, integer, jsonb) from public, anon, authenticated;
revoke all on function public.billing_release_reservation(uuid, text, jsonb) from public, anon, authenticated;
revoke all on function public.billing_set_plan(uuid, text, text, text, text, text, timestamptz, boolean) from public, anon, authenticated;
revoke all on function public.billing_record_event(text, text, jsonb) from public, anon, authenticated;
revoke all on function public.billing_mark_event(text, text) from public, anon, authenticated;
