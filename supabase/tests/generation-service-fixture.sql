-- Disposable CI projection ONLY, after real GoTrue and the two actual billing migrations.
-- Pages' persisted row shape is copied from lib/pages/types.ts; not a production migration.
create table public.pages (
  id uuid primary key default gen_random_uuid(), slug text unique not null,
  owner_id uuid not null references auth.users(id), title text not null,
  summary text, cover_image_url text, sections jsonb not null default '[]',
  sources jsonb not null default '[]', source_session_id text,
  visibility text not null default 'private', view_count integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.pages enable row level security;
create policy fixture_page_owner on public.pages for all to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
grant select, insert, update, delete on public.pages to authenticated;
grant all on public.pages to service_role;
