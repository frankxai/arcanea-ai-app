-- Repair the missing Author Studio draft store.
-- Supports both an absent table and the existing 20260414 schema.
-- Production application requires an explicit migration approval.
BEGIN;

CREATE TABLE IF NOT EXISTS public.book_chapter_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_slug TEXT NOT NULL,
  chapter_slug TEXT NOT NULL,
  author_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_json JSONB,
  word_count INT NOT NULL DEFAULT 0,
  yjs_state BYTEA,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (book_slug, chapter_slug, author_user_id)
);

-- Fail on incompatible legacy rows instead of deleting or inventing ownership.
ALTER TABLE public.book_chapter_drafts
  ALTER COLUMN author_user_id SET NOT NULL,
  ALTER COLUMN updated_at SET NOT NULL,
  ALTER COLUMN created_at SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_book_chapter_drafts_lookup
  ON public.book_chapter_drafts(book_slug, chapter_slug, author_user_id);
CREATE INDEX IF NOT EXISTS idx_book_chapter_drafts_updated
  ON public.book_chapter_drafts(author_user_id, updated_at DESC);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'book_chapter_drafts'
      AND policyname NOT IN (
        'authors_read_own_drafts', 'authors_insert_own_drafts',
        'authors_update_own_drafts', 'authors_delete_own_drafts'
      )
  ) THEN
    RAISE EXCEPTION 'Unexpected draft policy: review existing permissions before migration';
  END IF;
END;
$$;

ALTER TABLE public.book_chapter_drafts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.book_chapter_drafts FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_chapter_drafts TO authenticated;

DROP POLICY IF EXISTS authors_read_own_drafts ON public.book_chapter_drafts;
CREATE POLICY authors_read_own_drafts ON public.book_chapter_drafts
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = author_user_id);

DROP POLICY IF EXISTS authors_insert_own_drafts ON public.book_chapter_drafts;
CREATE POLICY authors_insert_own_drafts ON public.book_chapter_drafts
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = author_user_id);

DROP POLICY IF EXISTS authors_update_own_drafts ON public.book_chapter_drafts;
CREATE POLICY authors_update_own_drafts ON public.book_chapter_drafts
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = author_user_id)
  WITH CHECK ((SELECT auth.uid()) = author_user_id);

DROP POLICY IF EXISTS authors_delete_own_drafts ON public.book_chapter_drafts;
CREATE POLICY authors_delete_own_drafts ON public.book_chapter_drafts
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) = author_user_id);

CREATE OR REPLACE FUNCTION public.set_author_draft_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_author_draft_updated_at() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trigger_book_chapter_drafts_updated ON public.book_chapter_drafts;
CREATE TRIGGER trigger_book_chapter_drafts_updated
  BEFORE UPDATE ON public.book_chapter_drafts
  FOR EACH ROW EXECUTE FUNCTION public.set_author_draft_updated_at();

COMMIT;
