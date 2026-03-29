-- Project graph enrichment tables
-- Adds durable summaries and typed graph edges on top of chat_projects.

create table if not exists public.project_graph_summaries (
  project_id uuid primary key references public.chat_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  summary text not null default '',
  tags text[] not null default '{}',
  facts jsonb not null default '[]'::jsonb,
  score integer not null default 0,
  checks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_graph_summaries enable row level security;

create table if not exists public.project_graph_edges (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.chat_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null,
  source_id text not null,
  target_type text not null,
  target_id text not null,
  relation text not null,
  weight numeric not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, source_type, source_id, target_type, target_id, relation)
);

alter table public.project_graph_edges enable row level security;

create index if not exists idx_project_graph_edges_project
  on public.project_graph_edges(project_id, updated_at desc);

create index if not exists idx_project_graph_edges_target
  on public.project_graph_edges(project_id, target_type, target_id);

drop trigger if exists update_project_graph_summaries_updated_at on public.project_graph_summaries;
create trigger update_project_graph_summaries_updated_at
  before update on public.project_graph_summaries
  for each row execute function update_updated_at_column();

drop trigger if exists update_project_graph_edges_updated_at on public.project_graph_edges;
create trigger update_project_graph_edges_updated_at
  before update on public.project_graph_edges
  for each row execute function update_updated_at_column();

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_graph_summaries' and policyname = 'Users can view their own project graph summaries'
  ) then
    create policy "Users can view their own project graph summaries"
      on public.project_graph_summaries for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_graph_summaries' and policyname = 'Users can insert their own project graph summaries'
  ) then
    create policy "Users can insert their own project graph summaries"
      on public.project_graph_summaries for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_graph_summaries' and policyname = 'Users can update their own project graph summaries'
  ) then
    create policy "Users can update their own project graph summaries"
      on public.project_graph_summaries for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_graph_edges' and policyname = 'Users can view their own project graph edges'
  ) then
    create policy "Users can view their own project graph edges"
      on public.project_graph_edges for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_graph_edges' and policyname = 'Users can insert their own project graph edges'
  ) then
    create policy "Users can insert their own project graph edges"
      on public.project_graph_edges for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_graph_edges' and policyname = 'Users can update their own project graph edges'
  ) then
    create policy "Users can update their own project graph edges"
      on public.project_graph_edges for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_graph_edges' and policyname = 'Users can delete their own project graph edges'
  ) then
    create policy "Users can delete their own project graph edges"
      on public.project_graph_edges for delete
      using (auth.uid() = user_id);
  end if;
end $$;

comment on table public.project_graph_summaries is 'Derived summaries, tags, facts, and eval checks for each chat project.';
comment on table public.project_graph_edges is 'Typed project graph edges linking projects to chats, creations, and memories.';
