\set ON_ERROR_STOP on

-- This fixture is for an isolated CI database, never a Supabase project.
DO $$
BEGIN
  IF current_database() <> 'arcanea_author_draft_test' THEN
    RAISE EXCEPTION 'Refusing to run outside the isolated author draft test database';
  END IF;
END;
$$;

CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE SCHEMA auth;
CREATE TABLE auth.users (id UUID PRIMARY KEY);
INSERT INTO auth.users VALUES
  ('00000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000002'),
  ('00000000-0000-4000-8000-000000000003');
CREATE FUNCTION auth.uid() RETURNS UUID LANGUAGE SQL STABLE
  AS $$ SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::UUID $$;
GRANT USAGE ON SCHEMA public, auth TO authenticated, anon;
GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated, anon;

-- Reproduce broad defaults present for a production schema-creating role.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;

-- Fresh restoration and safe reapplication.
\ir ../../../supabase/migrations/20260909000001_restore_author_drafts.sql
\ir ../../../supabase/migrations/20260909000001_restore_author_drafts.sql

DO $$
BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.book_chapter_drafts'::regclass) THEN
    RAISE EXCEPTION 'Draft RLS is disabled';
  END IF;
  IF has_table_privilege('anon', 'public.book_chapter_drafts', 'SELECT')
      OR has_table_privilege('anon', 'public.book_chapter_drafts', 'INSERT')
      OR has_table_privilege('authenticated', 'public.book_chapter_drafts', 'TRUNCATE')
      OR has_table_privilege('authenticated', 'public.book_chapter_drafts', 'REFERENCES')
      OR has_table_privilege('authenticated', 'public.book_chapter_drafts', 'TRIGGER') THEN
    RAISE EXCEPTION 'Unexpected draft grants';
  END IF;
END;
$$;

SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', false);
DO $$
BEGIN
  BEGIN
    TRUNCATE public.book_chapter_drafts;
    RAISE EXCEPTION 'An authenticated account could truncate all drafts';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;
INSERT INTO public.book_chapter_drafts (book_slug, chapter_slug, author_user_id, content, content_json, updated_at)
VALUES ('sample', 'chapter-1', auth.uid(), 'Saved words',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Saved words","marks":[{"type":"bold"}]}]}]}',
  '2000-01-01T00:00:00Z');

DO $$
BEGIN
  IF (SELECT content_json #>> '{content,0,content,0,marks,0,type}' FROM public.book_chapter_drafts) IS DISTINCT FROM 'bold' THEN
    RAISE EXCEPTION 'Rich content did not survive storage';
  END IF;
  BEGIN
    UPDATE public.book_chapter_drafts SET author_user_id = '00000000-0000-4000-8000-000000000003';
    RAISE EXCEPTION 'Ownership transfer was permitted';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;

-- The save endpoint uses UPSERT; an empty chapter must be durable too.
INSERT INTO public.book_chapter_drafts (book_slug, chapter_slug, author_user_id, content, content_json, word_count)
VALUES ('sample', 'chapter-1', auth.uid(), '', '{"type":"doc","content":[{"type":"paragraph"}]}', 0)
ON CONFLICT (book_slug, chapter_slug, author_user_id) DO UPDATE
SET content = EXCLUDED.content, content_json = EXCLUDED.content_json, word_count = EXCLUDED.word_count;
DO $$
BEGIN
  IF (SELECT count(*) FROM public.book_chapter_drafts) <> 1
      OR (SELECT content FROM public.book_chapter_drafts) <> ''
      OR (SELECT updated_at FROM public.book_chapter_drafts) <= '2000-01-01T00:00:00Z' THEN
    RAISE EXCEPTION 'Empty draft upsert or timestamp update failed';
  END IF;
END;
$$;

SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', false);
DO $$
DECLARE changed INT;
BEGIN
  IF (SELECT count(*) FROM public.book_chapter_drafts) <> 0 THEN
    RAISE EXCEPTION 'Another account could read a draft';
  END IF;
  UPDATE public.book_chapter_drafts SET content = 'Unauthorized';
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 0 THEN RAISE EXCEPTION 'Another account could update a draft'; END IF;
  DELETE FROM public.book_chapter_drafts;
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 0 THEN RAISE EXCEPTION 'Another account could delete a draft'; END IF;
  BEGIN
    INSERT INTO public.book_chapter_drafts (book_slug, chapter_slug, author_user_id, content)
    VALUES ('sample', 'chapter-2', '00000000-0000-4000-8000-000000000001', 'Unauthorized');
    RAISE EXCEPTION 'Another account could insert a draft for its owner';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;
INSERT INTO public.book_chapter_drafts (book_slug, chapter_slug, author_user_id, content)
VALUES ('sample', 'chapter-1', auth.uid(), 'Independent private draft');
DELETE FROM public.book_chapter_drafts WHERE author_user_id = auth.uid();

RESET ROLE;
-- Legacy upgrade must preserve valid manuscripts and strengthen the old schema.
DROP TABLE public.book_chapter_drafts;
\ir ../../../supabase/migrations/20260414000001_author_drafts.sql
INSERT INTO public.book_chapter_drafts (id, book_slug, chapter_slug, author_user_id, content)
VALUES ('00000000-0000-4000-8000-000000000010', 'legacy', 'chapter-1',
  '00000000-0000-4000-8000-000000000001', 'Legacy manuscript remains');
\ir ../../../supabase/migrations/20260909000001_restore_author_drafts.sql
DO $$
BEGIN
  IF (SELECT content FROM public.book_chapter_drafts WHERE id = '00000000-0000-4000-8000-000000000010') IS DISTINCT FROM 'Legacy manuscript remains' THEN
    RAISE EXCEPTION 'Migration changed legacy content';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'book_chapter_drafts'
      AND column_name = 'author_user_id' AND is_nullable <> 'NO') THEN
    RAISE EXCEPTION 'Legacy ownership remains nullable';
  END IF;
  IF has_table_privilege('authenticated', 'public.book_chapter_drafts', 'TRUNCATE') THEN
    RAISE EXCEPTION 'Legacy broad grants survived migration';
  END IF;
END;
$$;
\echo 'Author draft database contract passed'
