-- 20260603_pages.sql
--
-- Perplexity-style "Pages": publish a chat thread as an editable, shareable,
-- SEO-public article. A Page is an ordered set of markdown sections plus
-- preserved source citations, owned by a user, with a short URL slug.
--
-- RLS: owners manage their own pages (incl. private drafts); anyone (including
-- anonymous visitors) may read pages that are 'public' or 'unlisted'
-- (unlisted = link-only, not surfaced in Discover). Service role bypasses RLS
-- for backend writes (create-from-thread runs server-side).

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

create table if not exists public.pages (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  owner_id          uuid references auth.users(id) on delete cascade,
  title             text not null,
  summary           text,
  cover_image_url   text,
  -- Ordered article body: [{ id, heading, markdown, imageUrl? }]
  sections          jsonb not null default '[]'::jsonb,
  -- Preserved citations: [{ title, url, domain }]
  sources           jsonb not null default '[]'::jsonb,
  source_session_id text,
  visibility        text not null default 'unlisted'
                      check (visibility in ('public', 'unlisted', 'private')),
  view_count        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists pages_owner_id_updated_at
  on public.pages(owner_id, updated_at desc);

-- Discover feed: recent public pages
create index if not exists pages_public_created_at
  on public.pages(created_at desc)
  where visibility = 'public';

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_pages_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_pages_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.pages enable row level security;

drop policy if exists "pages_select_public"  on public.pages;
drop policy if exists "pages_select_own"      on public.pages;
drop policy if exists "pages_insert_own"      on public.pages;
drop policy if exists "pages_update_own"      on public.pages;
drop policy if exists "pages_delete_own"      on public.pages;
drop policy if exists "pages_service_all"     on public.pages;

-- Anyone may read public or unlisted pages
create policy "pages_select_public"
  on public.pages
  for select
  to anon, authenticated
  using ( visibility in ('public', 'unlisted') );

-- Owners may read all of their own pages (including private)
create policy "pages_select_own"
  on public.pages
  for select
  to authenticated
  using ( (select auth.uid()) = owner_id );

create policy "pages_insert_own"
  on public.pages
  for insert
  to authenticated
  with check ( (select auth.uid()) = owner_id );

create policy "pages_update_own"
  on public.pages
  for update
  to authenticated
  using ( (select auth.uid()) = owner_id )
  with check ( (select auth.uid()) = owner_id );

create policy "pages_delete_own"
  on public.pages
  for delete
  to authenticated
  using ( (select auth.uid()) = owner_id );

create policy "pages_service_all"
  on public.pages
  for all
  to service_role
  using ( true )
  with check ( true );

-- ---------------------------------------------------------------------------
-- Atomic view-count increment (avoids read-modify-write races)
-- ---------------------------------------------------------------------------

create or replace function public.increment_page_views(p_slug text)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  update public.pages set view_count = view_count + 1 where slug = p_slug;
$$;

comment on function public.increment_page_views is
  'Atomically increments a page''s view_count by slug. Safe to call from public reads.';
