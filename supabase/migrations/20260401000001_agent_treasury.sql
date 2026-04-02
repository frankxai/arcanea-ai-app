-- Agent Treasury & Records System
-- Enables autonomous agent-to-agent billing and linked production ledger

-- ─── Agent Wallets ──────────────────────────────────────────────────────────

create table if not exists public.agent_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_id text not null,                     -- Links to @arcanea/agent-registry ID
  balance integer not null default 0,          -- Balance in Credits
  total_spent integer not null default 0,
  is_active boolean not null default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, agent_id)
);

comment on table public.agent_wallets is 'Per-agent budget allocation for autonomous creative swarms';

-- ─── Agent Production Ledger (Records Label) ──────────────────────────────────

create table if not exists public.agent_production_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_name text not null,
  track_id text,                              -- Optional: ID for Arcanea Records tracks
  agent_id text not null,                     -- The 'Lead' agent for this record
  task_type text not null,                    -- 'music_mastering', 'story_draft', 'image_manifest'
  cost integer not null,
  status text not null check (status in ('drafting', 'producing', 'signed', 'failed')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.agent_production_ledger is 'The ledger for Arcanea Records production, linking agent work to creative output';

-- ─── RLS Policies ────────────────────────────────────────────────────────────

alter table public.agent_wallets enable row level security;
alter table public.agent_production_ledger enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'agent_wallets' and policyname = 'Users manage own agent wallets'
  ) then
    create policy "Users manage own agent wallets"
      on public.agent_wallets for all
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'agent_production_ledger' and policyname = 'Users view own production'
  ) then
    create policy "Users view own production"
      on public.agent_production_ledger for select
      using (auth.uid() = user_id);
  end if;
end $$;

-- ─── Update Triggers ──────────────────────────────────────────────────────────

create or replace function public.handle_agent_wallets_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_agent_wallets_updated_at'
  ) then
    create trigger set_agent_wallets_updated_at
      before update on public.agent_wallets
      for each row execute function public.handle_agent_wallets_updated_at();
  end if;
end $$;
