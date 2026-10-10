-- Disposable empty PostgreSQL fixture only. Never run this bootstrap on production.
\set ON_ERROR_STOP on
begin;
create role anon;
create role authenticated;
create role service_role bypassrls;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to anon, authenticated;
\if :original_first
\ir ../migrations/20260414000001_author_drafts.sql
\endif
\ir ../migrations/20261010000002_author_draft_recovery.sql
-- Reapplying the repair must preserve drafts and policies.
\ir ../migrations/20261010000002_author_draft_recovery.sql
\ir ../migrations/20261010124756_author_draft_recovery_revision_clock.sql
\ir ../migrations/20261010124756_author_draft_recovery_revision_clock.sql
insert into auth.users values
  ('00000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000002');
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
insert into public.book_chapter_drafts(book_slug,chapter_slug,author_user_id,content,content_json)
values ('fixture-book','one',auth.uid(),'first revision','{"type":"doc","content":[]}');
update public.book_chapter_drafts set content='latest revision' where book_slug='fixture-book';
-- Two editors starting at the same revision cannot both acknowledge a save.
do $$ declare previous timestamptz; changed integer; begin
  select updated_at into previous from public.book_chapter_drafts where book_slug='fixture-book';
  update public.book_chapter_drafts set content='winning editor' where book_slug='fixture-book' and updated_at=previous;
  get diagnostics changed = row_count;
  if changed <> 1 then raise exception 'First editor was not acknowledged'; end if;
  update public.book_chapter_drafts set content='stale editor' where book_slug='fixture-book' and updated_at=previous;
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Stale editor overwrote acknowledged revision'; end if;
  update public.book_chapter_drafts set content='latest revision' where book_slug='fixture-book';
end $$;
do $$ begin
  if (select count(*) from public.book_chapter_drafts where content='latest revision') <> 1 then
    raise exception 'Owner save/reopen failed';
  end if;
  begin
    update public.book_chapter_drafts set author_user_id='00000000-0000-4000-8000-000000000002';
    raise exception 'Owner transfer incorrectly admitted';
  exception when insufficient_privilege then null;
  end;
end $$;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000002';
do $$ begin
  if (select count(*) from public.book_chapter_drafts) <> 0 then raise exception 'Cross-account read leak'; end if;
  update public.book_chapter_drafts set content='wrong account';
  if found then raise exception 'Cross-account update admitted'; end if;
  delete from public.book_chapter_drafts;
  if found then raise exception 'Cross-account delete admitted'; end if;
  begin
    insert into public.book_chapter_drafts(book_slug,chapter_slug,author_user_id,content)
    values ('fixture-book','two','00000000-0000-4000-8000-000000000001','wrong owner');
    raise exception 'Cross-account insert admitted';
  exception when insufficient_privilege then null;
  end;
end $$;
set local request.jwt.claim.sub = '';
do $$ begin
  if (select count(*) from public.book_chapter_drafts) <> 0 then raise exception 'Expired session read leak'; end if;
end $$;
set local role anon;
do $$ begin
  begin
    perform count(*) from public.book_chapter_drafts;
    raise exception 'Anonymous draft read admitted';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
rollback;
