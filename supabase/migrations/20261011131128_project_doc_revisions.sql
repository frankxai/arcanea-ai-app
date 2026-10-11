-- Targeted foundation for deployments that never installed the original project
-- graph/docs migrations. Reuses their table shapes; no existing row is removed.
-- Unrelated session/creation/memory graph migrations remain separate.
-- Chat projects and workspace graph
-- Makes projects first-class entities and links sessions, creations, and memories.

create table if not exists public.chat_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text,
  goal text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.chat_projects enable row level security;

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


alter table public.project_docs enable row level security;
alter table public.project_doc_content enable row level security;
alter table public.project_doc_versions enable row level security;
create schema if not exists arcanea_project_documents;
revoke all on schema arcanea_project_documents from public;
create or replace function arcanea_project_documents.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;
revoke all on function arcanea_project_documents.touch_updated_at() from public,anon,authenticated;
do $$ begin
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='chat_projects' and policyname='Users can view their own chat projects') then
    create policy "Users can view their own chat projects" on public.chat_projects for select using (auth.uid() = user_id);
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='chat_projects' and policyname='Users can insert their own chat projects') then
    create policy "Users can insert their own chat projects" on public.chat_projects for insert with check (auth.uid() = user_id);
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='chat_projects' and policyname='Users can update their own chat projects') then
    create policy "Users can update their own chat projects" on public.chat_projects for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='chat_projects' and policyname='Users can delete their own chat projects') then
    create policy "Users can delete their own chat projects" on public.chat_projects for delete using (auth.uid() = user_id);
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='project_docs' and policyname='Users can view own docs') then
    create policy "Users can view own docs" on public.project_docs for select using (auth.uid() = user_id);
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='project_docs' and policyname='Users can insert own docs') then
    create policy "Users can insert own docs" on public.project_docs for insert with check (auth.uid() = user_id);
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='project_docs' and policyname='Users can update own docs') then
    create policy "Users can update own docs" on public.project_docs for update using (auth.uid() = user_id);
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='project_docs' and policyname='Users can delete own docs') then
    create policy "Users can delete own docs" on public.project_docs for delete using (auth.uid() = user_id);
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='project_doc_content' and policyname='Users can view own doc content') then
    create policy "Users can view own doc content" on public.project_doc_content for select using (doc_id in (select id from public.project_docs where user_id = auth.uid()));
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='project_doc_versions' and policyname='Users can view own doc versions') then
    create policy "Users can view own doc versions" on public.project_doc_versions for select using (doc_id in (select id from public.project_docs where user_id = auth.uid()));
  end if;
  if not exists(select 1 from pg_trigger where tgrelid='public.chat_projects'::regclass and tgname='update_chat_projects_updated_at') then
    create trigger update_chat_projects_updated_at before update on public.chat_projects
      for each row execute function arcanea_project_documents.touch_updated_at();
  end if;
  if not exists(select 1 from pg_trigger where tgrelid='public.project_docs'::regclass and tgname='trg_project_docs_updated') then
    create trigger trg_project_docs_updated before update on public.project_docs
      for each row execute function arcanea_project_documents.touch_updated_at();
  end if;
  if not exists(select 1 from pg_trigger where tgrelid='public.project_doc_content'::regclass and tgname='trg_project_doc_content_updated') then
    create trigger trg_project_doc_content_updated before update on public.project_doc_content
      for each row execute function arcanea_project_documents.touch_updated_at();
  end if;
end $$;
create index if not exists idx_chat_projects_user_id on public.chat_projects(user_id,updated_at desc);
revoke all on public.chat_projects,public.project_docs,public.project_doc_content,public.project_doc_versions from anon;
grant select,insert,update,delete on public.chat_projects to authenticated,service_role;
grant select,insert,delete on public.project_docs to authenticated;
grant select on public.project_doc_content,public.project_doc_versions to authenticated;
grant all on public.project_docs,public.project_doc_content,public.project_doc_versions to service_role;
-- A direct client INSERT must own its parent too. Legacy standalone workspace
-- documents retain their nullable project binding and all existing rows/history.
create policy project_doc_parent_insert on public.project_docs as restrictive
  for insert to authenticated with check (project_id is null or exists (
    select 1 from public.chat_projects p where p.id=project_id and p.user_id=(select auth.uid())
  ));

-- Atomic owner-bound edits. Existing history is retained, including old duplicate
-- version numbers; only new operation identities receive a uniqueness constraint.
alter table public.project_docs add column save_revision bigint not null default 0
  check (save_revision between 0 and 2147483647);
update public.project_docs d set save_revision = greatest(0, coalesce(
  (select max(version_number) from public.project_doc_versions v where v.doc_id = d.id), 0
));
alter table public.project_doc_versions add column save_operation_id uuid,
  add column save_patch jsonb, add column save_expected_revision bigint;
create unique index project_doc_version_operation on public.project_doc_versions
  (doc_id, save_operation_id) where save_operation_id is not null;

-- Creation inserts the empty content in the same transaction as the document.
create function public.initialize_project_doc_content()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.project_doc_content(doc_id, content_json, content_text, word_count)
    values (new.id, '{}'::jsonb, '', 0);
  return new;
end $$;
revoke all on function public.initialize_project_doc_content() from public, anon, authenticated;
create trigger initialize_project_doc_content after insert on public.project_docs
  for each row execute function public.initialize_project_doc_content();

create function public.save_project_document(
  p_project uuid, p_doc uuid, p_revision bigint, p_operation uuid, p_patch jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  d public.project_docs%rowtype;
  c public.project_doc_content%rowtype;
  prior public.project_doc_versions%rowtype;
  next_json jsonb; next_text text; next_words integer;
begin
  if auth.uid() is null then raise exception 'document_not_found' using errcode='P0001'; end if;
  if p_operation is null or p_revision is null or p_revision < 0 or p_revision >= 2147483647
    or p_patch is null or jsonb_typeof(p_patch) <> 'object' or p_patch = '{}'::jsonb
    or octet_length(p_patch::text) > 1048576 then
    raise exception 'document_invalid' using errcode='P0001';
  end if;
  if exists(select 1 from jsonb_object_keys(p_patch) k
    where k not in ('title','doc_type','status','icon','content_json','content_text','word_count')) then
    raise exception 'document_invalid' using errcode='P0001';
  end if;
  if (p_patch ? 'title' and (jsonb_typeof(p_patch->'title') <> 'string' or length(p_patch->>'title') > 500))
    or (p_patch ? 'doc_type' and coalesce(p_patch->>'doc_type','') not in ('note','brief','outline','lore','research','prompt_book','spec','journal'))
    or (p_patch ? 'status' and coalesce(p_patch->>'status','') not in ('draft','active','archived','published'))
    or (p_patch ? 'icon' and p_patch->'icon' <> 'null'::jsonb and (jsonb_typeof(p_patch->'icon') <> 'string' or length(p_patch->>'icon') > 100))
    or (p_patch ? 'content_json' and jsonb_typeof(p_patch->'content_json') <> 'object')
    or (p_patch ? 'content_text' and (jsonb_typeof(p_patch->'content_text') <> 'string' or length(p_patch->>'content_text') > 200000))
    or (p_patch ? 'word_count' and (jsonb_typeof(p_patch->'word_count') <> 'number' or (p_patch->>'word_count') !~ '^[0-9]+$' or (p_patch->>'word_count')::numeric > 200000)) then
    raise exception 'document_invalid' using errcode='P0001';
  end if;
  -- Lock the owner's actual project before its document; a foreign/missing
  -- project cannot receive content through this privileged RPC.
  perform 1 from public.chat_projects where id=p_project and user_id=(select auth.uid()) for share;
  if not found then raise exception 'document_not_found' using errcode='P0001'; end if;
  -- Ownership and requested parent are checked before any read, replay or mutation.
  select * into d from public.project_docs
    where id=p_doc and project_id=p_project and user_id=(select auth.uid()) for update;
  if not found then raise exception 'document_not_found' using errcode='P0001'; end if;
  select * into prior from public.project_doc_versions
    where doc_id=d.id and save_operation_id=p_operation;
  if found then
    if prior.save_patch is distinct from p_patch or prior.save_expected_revision is distinct from p_revision then
      raise exception 'document_operation_conflict' using errcode='P0001';
    end if;
    return jsonb_build_object('doc_id',d.id,'project_id',d.project_id,'user_id',d.user_id,
      'operation_id',p_operation,'revision',prior.version_number);
  end if;
  if d.save_revision <> p_revision then raise exception 'document_revision_conflict' using errcode='P0001'; end if;
  select * into c from public.project_doc_content where doc_id=d.id;
  -- Preserve pre-contract content before its first edit, even if history was absent.
  if not exists(select 1 from public.project_doc_versions where doc_id=d.id) then
    insert into public.project_doc_versions(doc_id,version_number,editor_type,author_user_id,content_json,content_text,change_summary)
      values(d.id,0,'human',d.user_id,coalesce(c.content_json,'{}'::jsonb),coalesce(c.content_text,''),'Retained pre-revision content');
  end if;
  next_json := case when p_patch ? 'content_json' then p_patch->'content_json' else coalesce(c.content_json,'{}'::jsonb) end;
  next_text := case when p_patch ? 'content_text' then p_patch->>'content_text' else coalesce(c.content_text,'') end;
  next_words := case when p_patch ? 'word_count' then (p_patch->>'word_count')::integer else coalesce(c.word_count,0) end;
  insert into public.project_doc_content(doc_id,content_json,content_text,word_count,reading_time_minutes)
    values(d.id,next_json,next_text,next_words,greatest(1,round(next_words/200.0)::integer))
    on conflict(doc_id) do update set content_json=excluded.content_json,content_text=excluded.content_text,
      word_count=excluded.word_count,reading_time_minutes=excluded.reading_time_minutes;
  update public.project_docs set
    title=case when p_patch ? 'title' then p_patch->>'title' else title end,
    doc_type=case when p_patch ? 'doc_type' then p_patch->>'doc_type' else doc_type end,
    status=case when p_patch ? 'status' then p_patch->>'status' else status end,
    icon=case when p_patch ? 'icon' then p_patch->>'icon' else icon end,
    save_revision=save_revision+1,last_edited_at=now()
    where id=d.id returning * into d;
  -- A failure here rolls back content, metadata, revision and initial history.
  insert into public.project_doc_versions(doc_id,version_number,editor_type,author_user_id,
    content_json,content_text,save_operation_id,save_patch,save_expected_revision)
    values(d.id,d.save_revision,'human',d.user_id,next_json,next_text,p_operation,p_patch,p_revision);
  return jsonb_build_object('doc_id',d.id,'project_id',d.project_id,'user_id',d.user_id,
    'operation_id',p_operation,'revision',d.save_revision);
end $$;
revoke all on function public.save_project_document(uuid,uuid,bigint,uuid,jsonb) from public, anon;
grant execute on function public.save_project_document(uuid,uuid,bigint,uuid,jsonb) to authenticated;
-- Owner clients can create/delete documents, but edits and history require the RPC.
revoke update on public.project_docs from anon, authenticated;
revoke insert, update, delete on public.project_doc_content, public.project_doc_versions from anon, authenticated;
