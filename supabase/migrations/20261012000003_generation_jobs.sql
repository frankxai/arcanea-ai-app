-- Generation jobs table for durable video workflow tracking
begin;

create table if not exists public.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'video',
  model text not null,
  inputs jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued', 'admitted', 'debited', 'generating', 'storing', 'completed', 'failed', 'refunded')),
  steps jsonb not null default '[]'::jsonb,
  cost numeric not null default 0 check (cost >= 0),
  debit_id text,
  error text,
  asset_id text,
  video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists generation_jobs_user_status_idx on public.generation_jobs (user_id, status, created_at desc);

alter table public.generation_jobs enable row level security;

create policy generation_jobs_owner_select on public.generation_jobs
  for select to authenticated using (user_id = (select auth.uid()));

revoke all on public.generation_jobs from public, anon, authenticated;
grant select on public.generation_jobs to authenticated;
grant all on public.generation_jobs to service_role;

commit;
