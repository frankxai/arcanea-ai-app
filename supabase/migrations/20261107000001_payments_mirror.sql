-- Payments mirror (Stripe)
-- Local read model of Stripe customers, catalog and subscriptions, plus the
-- webhook idempotency ledger. Mirrors are eventually consistent: no foreign
-- keys between Stripe ids, because event delivery order is not guaranteed.
--
-- Access: server-only. These rows are written by the Stripe webhook under the
-- service role. No browser policy is created; anon and authenticated are
-- revoked. Profile-level entitlement stays in public.profiles.

-- ─── Customers ────────────────────────────────────────────────────────────────

create table if not exists public.stripe_customers (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  name text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.stripe_customers is
  'Stripe customer mirror; user_id links a Stripe customer to an Arcanea account when checkout metadata proves it';

create index if not exists idx_stripe_customers_user
  on public.stripe_customers(user_id)
  where user_id is not null;

-- ─── Products ─────────────────────────────────────────────────────────────────

create table if not exists public.stripe_products (
  id text primary key,
  active boolean not null default true,
  name text,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.stripe_products is 'Stripe product mirror';

-- ─── Prices ───────────────────────────────────────────────────────────────────

create table if not exists public.stripe_prices (
  id text primary key,
  product_id text,
  active boolean not null default true,
  currency text,
  type text,
  unit_amount integer,
  recurring_interval text,
  recurring_interval_count integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.stripe_prices is
  'Stripe price mirror; unit_amount is in the currency minor unit, as Stripe reports it';

create index if not exists idx_stripe_prices_product
  on public.stripe_prices(product_id);

-- ─── Subscriptions ────────────────────────────────────────────────────────────

create table if not exists public.stripe_subscriptions (
  id text primary key,
  customer_id text,
  status text not null,
  price_id text,
  quantity integer,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  cancel_at timestamptz,
  canceled_at timestamptz,
  ended_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.stripe_subscriptions is
  'Stripe subscription mirror; period bounds come from the subscription item (API 2025-03-31 removed them from the subscription root)';

create index if not exists idx_stripe_subscriptions_customer
  on public.stripe_subscriptions(customer_id);

create index if not exists idx_stripe_subscriptions_status
  on public.stripe_subscriptions(status);

-- ─── Webhook idempotency ledger ───────────────────────────────────────────────

create table if not exists public.stripe_processed_events (
  id text primary key,
  type text not null,
  livemode boolean,
  api_version text,
  processed_at timestamptz not null default now()
);

comment on table public.stripe_processed_events is
  'Stripe event ids that finished processing. Written after the mirror writes succeed so a failed delivery is retried, not swallowed';

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Payment mirrors are not browser-readable. A dedicated read model for the
-- account UI, if wanted, becomes its own reviewed surface.

alter table public.stripe_customers enable row level security;
alter table public.stripe_products enable row level security;
alter table public.stripe_prices enable row level security;
alter table public.stripe_subscriptions enable row level security;
alter table public.stripe_processed_events enable row level security;

revoke all on table public.stripe_customers from anon, authenticated;
revoke all on table public.stripe_products from anon, authenticated;
revoke all on table public.stripe_prices from anon, authenticated;
revoke all on table public.stripe_subscriptions from anon, authenticated;
revoke all on table public.stripe_processed_events from anon, authenticated;

grant select, insert, update, delete on table public.stripe_customers to service_role;
grant select, insert, update, delete on table public.stripe_products to service_role;
grant select, insert, update, delete on table public.stripe_prices to service_role;
grant select, insert, update, delete on table public.stripe_subscriptions to service_role;
grant select, insert, update, delete on table public.stripe_processed_events to service_role;
