create table if not exists public.project_runs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.chat_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  trace_run_id text not null,
  kind text not null,
  status text not null default 'queued',
  runtime text not null default 'arcanea-flow',
  provider text,
  repo_id text not null,
  repo_path text not null,
  command_name text not null,
  command_preview text not null,
  execution_mode text not null default 'delegated',
  billing_mode text not null default 'included',
  estimated_credits integer,
  estimated_usd numeric(10,2),
  byok_eligible boolean not null default false,
  source_trace_path text,
  source_doc_id uuid,
  source_creation_id uuid,
  source_collection_id uuid,
  source_prompt_id uuid,
  source_prompt_collection_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  duration_ms integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, user_id, trace_run_id)
);

alter table public.project_runs enable row level security;

create table if not exists public.project_run_events (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid not null references public.project_runs(id) on delete cascade,
  project_id uuid not null references public.chat_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  phase text,
  status text,
  message text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.project_run_events enable row level security;

create index if not exists idx_project_runs_project_started
  on public.project_runs(project_id, started_at desc);

create index if not exists idx_project_runs_user_started
  on public.project_runs(user_id, started_at desc);

create index if not exists idx_project_runs_trace
  on public.project_runs(project_id, trace_run_id);

create index if not exists idx_project_run_events_run_created
  on public.project_run_events(run_id, created_at asc);

create index if not exists idx_project_run_events_project_created
  on public.project_run_events(project_id, created_at desc);

drop trigger if exists update_project_runs_updated_at on public.project_runs;
create trigger update_project_runs_updated_at
  before update on public.project_runs
  for each row execute function update_updated_at_column();

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_runs' and policyname = 'Users can view their own project runs'
  ) then
    create policy "Users can view their own project runs"
      on public.project_runs for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_runs' and policyname = 'Users can insert their own project runs'
  ) then
    create policy "Users can insert their own project runs"
      on public.project_runs for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_runs' and policyname = 'Users can update their own project runs'
  ) then
    create policy "Users can update their own project runs"
      on public.project_runs for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_run_events' and policyname = 'Users can view their own project run events'
  ) then
    create policy "Users can view their own project run events"
      on public.project_run_events for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_run_events' and policyname = 'Users can insert their own project run events'
  ) then
    create policy "Users can insert their own project run events"
      on public.project_run_events for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_run_events' and policyname = 'Users can delete their own project run events'
  ) then
    create policy "Users can delete their own project run events"
      on public.project_run_events for delete
      using (auth.uid() = user_id);
  end if;
end $$;

comment on table public.project_runs is 'Durable project-linked execution records for Arcanea Flow and other orchestrated runtimes.';
comment on table public.project_run_events is 'Timeline events for persisted project runs, including status transitions and artifacts.';
