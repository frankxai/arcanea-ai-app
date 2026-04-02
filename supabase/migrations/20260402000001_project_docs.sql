-- Project Docs System
-- Three tables: project_docs, project_doc_content, project_doc_versions

create table if not exists public.project_docs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  project_id uuid,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled',
  slug text,
  icon text,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft','active','archived','published')),
  doc_type text not null default 'note' check (doc_type in ('note','brief','outline','lore','research','prompt_book','spec','journal')),
  source_thread_id uuid,
  parent_doc_id uuid references public.project_docs(id) on delete set null,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_edited_at timestamptz default now(),
  last_ai_touched_at timestamptz,
  metadata jsonb default '{}'::jsonb
);

create table if not exists public.project_doc_content (
  doc_id uuid primary key references public.project_docs(id) on delete cascade,
  content_json jsonb default '{}'::jsonb,
  content_text text default '',
  word_count integer default 0,
  outline_json jsonb,
  reading_time_minutes integer default 0,
  updated_at timestamptz default now()
);

create table if not exists public.project_doc_versions (
  id uuid primary key default gen_random_uuid(),
  doc_id uuid not null references public.project_docs(id) on delete cascade,
  version_number integer not null,
  editor_type text default 'human' check (editor_type in ('human','ai','import','agent')),
  author_user_id uuid references auth.users(id),
  content_json jsonb,
  content_text text,
  change_summary text,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_project_docs_workspace on public.project_docs(workspace_id);
create index if not exists idx_project_docs_user on public.project_docs(user_id);
create index if not exists idx_project_doc_versions_doc on public.project_doc_versions(doc_id, version_number);

-- RLS
alter table public.project_docs enable row level security;
alter table public.project_doc_content enable row level security;
alter table public.project_doc_versions enable row level security;

create policy "Users can view own docs" on public.project_docs for select using (auth.uid() = user_id);
create policy "Users can insert own docs" on public.project_docs for insert with check (auth.uid() = user_id);
create policy "Users can update own docs" on public.project_docs for update using (auth.uid() = user_id);
create policy "Users can delete own docs" on public.project_docs for delete using (auth.uid() = user_id);

create policy "Users can view own doc content" on public.project_doc_content for select using (doc_id in (select id from public.project_docs where user_id = auth.uid()));
create policy "Users can insert own doc content" on public.project_doc_content for insert with check (doc_id in (select id from public.project_docs where user_id = auth.uid()));
create policy "Users can update own doc content" on public.project_doc_content for update using (doc_id in (select id from public.project_docs where user_id = auth.uid()));
create policy "Users can delete own doc content" on public.project_doc_content for delete using (doc_id in (select id from public.project_docs where user_id = auth.uid()));

create policy "Users can view own doc versions" on public.project_doc_versions for select using (doc_id in (select id from public.project_docs where user_id = auth.uid()));
create policy "Users can insert own doc versions" on public.project_doc_versions for insert with check (doc_id in (select id from public.project_docs where user_id = auth.uid()));

-- Updated-at triggers
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_project_docs_updated before update on public.project_docs for each row execute function public.set_updated_at();
create trigger trg_project_doc_content_updated before update on public.project_doc_content for each row execute function public.set_updated_at();
