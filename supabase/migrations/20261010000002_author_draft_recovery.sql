-- Production was missing the 20260414 draft table. Preserve published Git content.
-- This additive repair also works when the original migration was already applied.
create table if not exists public.book_chapter_drafts (
  id uuid primary key default gen_random_uuid(),
  book_slug text not null,
  chapter_slug text not null,
  author_user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  content_json jsonb,
  word_count integer not null default 0,
  yjs_state bytea,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (book_slug, chapter_slug, author_user_id)
);

create index if not exists idx_book_chapter_drafts_lookup
  on public.book_chapter_drafts (book_slug, chapter_slug, author_user_id);
create index if not exists idx_book_chapter_drafts_updated
  on public.book_chapter_drafts (author_user_id, updated_at desc);

alter table public.book_chapter_drafts enable row level security;
revoke all on public.book_chapter_drafts from public, anon;
grant select, insert, update, delete on public.book_chapter_drafts to authenticated;
grant all on public.book_chapter_drafts to service_role;

drop policy if exists author_draft_owner on public.book_chapter_drafts;
create policy author_draft_owner on public.book_chapter_drafts
  for all to authenticated
  using ((select auth.uid()) = author_user_id)
  with check ((select auth.uid()) = author_user_id);

create or replace function public.set_book_chapter_draft_updated_at()
returns trigger language plpgsql set search_path = pg_catalog as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists author_draft_updated_at on public.book_chapter_drafts;
create trigger author_draft_updated_at before update on public.book_chapter_drafts
  for each row execute function public.set_book_chapter_draft_updated_at();
