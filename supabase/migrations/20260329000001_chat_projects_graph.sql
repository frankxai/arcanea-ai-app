-- Chat projects and workspace graph
-- Makes projects first-class entities and links sessions, creations, and memories.

create table if not exists public.chat_projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text,
  goal text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.chat_projects enable row level security;

alter table public.chat_sessions
  add column if not exists project_id uuid references public.chat_projects(id) on delete set null;

alter table public.creations
  add column if not exists project_id uuid references public.chat_projects(id) on delete set null;

alter table public.creations
  add column if not exists source_session_id text;

create table if not exists public.project_memory_links (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.chat_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  memory_id text not null,
  created_at timestamptz not null default now(),
  unique(project_id, memory_id)
);

alter table public.project_memory_links enable row level security;

create index if not exists idx_chat_projects_user_id
  on public.chat_projects(user_id, updated_at desc);

create index if not exists idx_chat_sessions_project_id
  on public.chat_sessions(project_id, updated_at desc)
  where project_id is not null;

create index if not exists idx_creations_project_id
  on public.creations(project_id, created_at desc)
  where project_id is not null;

create index if not exists idx_creations_source_session_id
  on public.creations(source_session_id)
  where source_session_id is not null;

create index if not exists idx_project_memory_links_project_id
  on public.project_memory_links(project_id, created_at desc);

create index if not exists idx_project_memory_links_user_id
  on public.project_memory_links(user_id, created_at desc);

drop trigger if exists update_chat_projects_updated_at on public.chat_projects;
create trigger update_chat_projects_updated_at
  before update on public.chat_projects
  for each row execute function update_updated_at_column();

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'chat_projects' and policyname = 'Users can view their own chat projects'
  ) then
    create policy "Users can view their own chat projects"
      on public.chat_projects for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'chat_projects' and policyname = 'Users can insert their own chat projects'
  ) then
    create policy "Users can insert their own chat projects"
      on public.chat_projects for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'chat_projects' and policyname = 'Users can update their own chat projects'
  ) then
    create policy "Users can update their own chat projects"
      on public.chat_projects for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'chat_projects' and policyname = 'Users can delete their own chat projects'
  ) then
    create policy "Users can delete their own chat projects"
      on public.chat_projects for delete
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_memory_links' and policyname = 'Users can view their own project memory links'
  ) then
    create policy "Users can view their own project memory links"
      on public.project_memory_links for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_memory_links' and policyname = 'Users can insert their own project memory links'
  ) then
    create policy "Users can insert their own project memory links"
      on public.project_memory_links for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_memory_links' and policyname = 'Users can delete their own project memory links'
  ) then
    create policy "Users can delete their own project memory links"
      on public.project_memory_links for delete
      using (auth.uid() = user_id);
  end if;
end $$;

comment on table public.chat_projects is 'Creator workspaces that group sessions, memories, and creations into one project context.';
comment on table public.project_memory_links is 'Graph edges between a project workspace and saved user memories.';
