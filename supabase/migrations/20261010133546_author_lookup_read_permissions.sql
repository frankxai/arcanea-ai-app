-- Match the existing production author lookup permissions without exposing manuscript metadata.
grant select (id, slug) on public.books to authenticated;
grant select (book_id, user_id, role) on public.book_authors to authenticated;
