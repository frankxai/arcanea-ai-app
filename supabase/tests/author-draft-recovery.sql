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
-- Preview clones can omit production's catalog grants. Repair only lookup columns.
create table public.books (id uuid primary key, slug text, description text);
create table public.book_authors (book_id uuid, user_id uuid, role text, author_name text);
\ir ../migrations/20261010133546_author_lookup_read_permissions.sql
\ir ../migrations/20261010133546_author_lookup_read_permissions.sql
set local role authenticated;
select id from public.books where slug='fixture-book';
select role from public.book_authors where book_id='00000000-0000-4000-8000-000000000001' and user_id=auth.uid();
do $$ begin
  begin
    perform description from public.books;
    raise exception 'Catalog repair exposed unrelated metadata';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.books(id,slug) values ('00000000-0000-4000-8000-000000000001','fixture-book');
    raise exception 'Catalog repair granted a write';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
\if :original_first
\ir ../migrations/20260414000001_author_drafts.sql
\endif
\ir ../migrations/20261010000002_author_draft_recovery.sql
-- Reapplying the repair must preserve drafts and policies.
\ir ../migrations/20261010000002_author_draft_recovery.sql
\ir ../migrations/20261010124756_author_draft_recovery_revision_clock.sql
\ir ../migrations/20261010124756_author_draft_recovery_revision_clock.sql
-- Preserve and reapply the exact reviewed SQL under production's actual version.
\ir ../migrations/20261010140429_author_draft_recovery.sql
\ir ../migrations/20261010140429_author_draft_recovery.sql
insert into auth.users values
  ('00000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000002');
-- Reproduce the inherited cross-book invitation bug before applying its repair.
insert into public.books(id,slug) values
  ('00000000-0000-4000-8000-000000000011','fixture-book-one'),
  ('00000000-0000-4000-8000-000000000012','fixture-book-two');
insert into public.book_authors(book_id,user_id,role,author_name) values
  ('00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000001','creator','First fixture creator'),
  ('00000000-0000-4000-8000-000000000012','00000000-0000-4000-8000-000000000002','creator','Second fixture creator');
alter table public.book_authors enable row level security;
create policy "Book authors are publicly readable" on public.book_authors for select using (true);
grant insert(book_id,user_id,role,author_name) on public.book_authors to authenticated;
create policy "Authors can add co-authors to their books" on public.book_authors for insert
  with check (auth.uid() in (
    select user_id from public.book_authors where book_id=book_authors.book_id and role='creator'
  ));
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
insert into public.book_authors(book_id,user_id,role,author_name) values
  ('00000000-0000-4000-8000-000000000012',auth.uid(),'editor','Unexpected cross-book invitation');
reset role;
delete from public.book_authors where author_name='Unexpected cross-book invitation';
\ir ../migrations/20261010142500_author_membership_scope.sql
\ir ../migrations/20261010142500_author_membership_scope.sql
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
-- The legitimate creator can still invite a co-author to their own book.
insert into public.book_authors(book_id,user_id,role,author_name) values
  ('00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000002','editor','Allowed own-book invitation');
do $$ begin
  begin
    insert into public.book_authors(book_id,user_id,role,author_name) values
      ('00000000-0000-4000-8000-000000000012',auth.uid(),'editor','Forbidden cross-book invitation');
    raise exception 'Creator of one book gained access to another book';
  exception when insufficient_privilege then null;
  end;
end $$;
-- A creator elsewhere, who is only an editor here, cannot add this book's authors.
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000002';
do $$ begin
  begin
    insert into public.book_authors(book_id,user_id,role,author_name) values
      ('00000000-0000-4000-8000-000000000011',auth.uid(),'creator','Forbidden editor escalation');
    raise exception 'Editor gained creator invitation authority';
  exception when insufficient_privilege then null;
  end;
end $$;
set local request.jwt.claim.sub = '';
do $$ begin
  begin
    insert into public.book_authors(book_id,user_id,role,author_name) values
      ('00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000002','editor','Forbidden expired invitation');
    raise exception 'Expired session gained invitation authority';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
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
