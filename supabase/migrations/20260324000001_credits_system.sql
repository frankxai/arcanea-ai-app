-- Credits System
-- Unified credits for all creation operations: Free (5/day), Credits (pay-per-create), Forge (unlimited).
-- Schema aligned with apps/web/lib/types/credits.ts

-- ─── Credit Balances ──────────────────────────────────────────────────────────

create table if not exists public.credit_balances (
  user_id uuid references auth.users(id) on delete cascade primary key,
  purchased_credits integer not null default 0,
  daily_credits_remaining integer not null default 5,
  daily_credits_reset_at timestamptz not null default now(),
  is_forge_subscriber boolean not null default false,
  forge_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.credit_balances is 'Per-user credit balance tracking for the Arcanea credits system';

-- ─── Credit Transactions (Ledger) ─────────────────────────────────────────────

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('purchase', 'daily_grant', 'creation', 'refund', 'admin_grant', 'promo')),
  amount integer not null,                    -- positive = credit, negative = debit
  balance_after integer not null,
  creation_type text,                         -- 'image', 'music', 'story', 'character', 'world', 'lore'
  creation_id uuid,                           -- FK to the resulting creation, if applicable
  stripe_payment_id text,                     -- Stripe PaymentIntent ID for purchases
  pack_id text,                               -- Credit pack ID for purchases
  description text not null default '',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.credit_transactions is 'Immutable ledger of all credit changes (purchases, spends, refunds, grants)';

-- ─── Forge Subscriptions ──────────────────────────────────────────────────────

create table if not exists public.forge_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id text not null unique,
  stripe_customer_id text not null,
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.forge_subscriptions is 'Forge (unlimited) subscription state synced from Stripe webhooks';

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists idx_credit_transactions_user
  on public.credit_transactions(user_id, created_at desc);

create index if not exists idx_credit_transactions_stripe
  on public.credit_transactions(stripe_payment_id)
  where stripe_payment_id is not null;

create index if not exists idx_forge_subscriptions_user
  on public.forge_subscriptions(user_id);

create index if not exists idx_forge_subscriptions_stripe
  on public.forge_subscriptions(stripe_subscription_id);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.credit_balances enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.forge_subscriptions enable row level security;

-- Policies wrapped in DO block for idempotency (matching project conventions)
do $$
begin
  -- credit_balances: users read own, service_role writes
  if not exists (
    select 1 from pg_policies where tablename = 'credit_balances' and policyname = 'Users read own balance'
  ) then
    create policy "Users read own balance"
      on public.credit_balances for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'credit_balances' and policyname = 'Service role manages balances'
  ) then
    create policy "Service role manages balances"
      on public.credit_balances for all
      using (auth.role() = 'service_role');
  end if;

  -- credit_transactions: users read own, service_role writes
  if not exists (
    select 1 from pg_policies where tablename = 'credit_transactions' and policyname = 'Users read own transactions'
  ) then
    create policy "Users read own transactions"
      on public.credit_transactions for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'credit_transactions' and policyname = 'Service role manages transactions'
  ) then
    create policy "Service role manages transactions"
      on public.credit_transactions for all
      using (auth.role() = 'service_role');
  end if;

  -- forge_subscriptions: users read own, service_role writes
  if not exists (
    select 1 from pg_policies where tablename = 'forge_subscriptions' and policyname = 'Users read own subscriptions'
  ) then
    create policy "Users read own subscriptions"
      on public.forge_subscriptions for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'forge_subscriptions' and policyname = 'Service role manages subscriptions'
  ) then
    create policy "Service role manages subscriptions"
      on public.forge_subscriptions for all
      using (auth.role() = 'service_role');
  end if;
end $$;

-- ─── Helper Functions ─────────────────────────────────────────────────────────

-- Reset daily credits for users whose 24-hour window has elapsed.
-- Intended to be called by a pg_cron job or Supabase Edge Function on a schedule.
create or replace function public.reset_daily_credits()
returns void as $$
  update public.credit_balances
  set daily_credits_remaining = 5,
      daily_credits_reset_at = now(),
      updated_at = now()
  where daily_credits_reset_at < now() - interval '24 hours';
$$ language sql security definer;

-- Auto-update the updated_at timestamp on row modification.
create or replace function public.handle_credits_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Attach updated_at triggers
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_credit_balances_updated_at'
  ) then
    create trigger set_credit_balances_updated_at
      before update on public.credit_balances
      for each row execute function public.handle_credits_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_forge_subscriptions_updated_at'
  ) then
    create trigger set_forge_subscriptions_updated_at
      before update on public.forge_subscriptions
      for each row execute function public.handle_credits_updated_at();
  end if;
end $$;
