-- Preserve the isolated preview's applied revision-clock repair in source history.
-- This is also safe after the complete fresh-table recovery migration.
create or replace function public.set_book_chapter_draft_updated_at()
returns trigger language plpgsql set search_path = pg_catalog as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end;
$$;

drop trigger if exists author_draft_updated_at on public.book_chapter_drafts;
drop trigger if exists trigger_book_chapter_drafts_updated on public.book_chapter_drafts;
create trigger author_draft_updated_at before update on public.book_chapter_drafts
  for each row execute function public.set_book_chapter_draft_updated_at();
