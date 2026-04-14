-- Author Studio v3: Persistent chapter drafts
-- Drafts live in Supabase; git remains canonical for published chapters

CREATE TABLE IF NOT EXISTS public.book_chapter_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_slug TEXT NOT NULL,
  chapter_slug TEXT NOT NULL,
  author_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_json JSONB,
  word_count INT NOT NULL DEFAULT 0,
  yjs_state BYTEA,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (book_slug, chapter_slug, author_user_id)
);

CREATE INDEX idx_book_chapter_drafts_lookup
  ON public.book_chapter_drafts(book_slug, chapter_slug, author_user_id);

CREATE INDEX idx_book_chapter_drafts_updated
  ON public.book_chapter_drafts(author_user_id, updated_at DESC);

ALTER TABLE public.book_chapter_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authors_read_own_drafts" ON public.book_chapter_drafts
  FOR SELECT USING (auth.uid() = author_user_id);

CREATE POLICY "authors_insert_own_drafts" ON public.book_chapter_drafts
  FOR INSERT WITH CHECK (auth.uid() = author_user_id);

CREATE POLICY "authors_update_own_drafts" ON public.book_chapter_drafts
  FOR UPDATE USING (auth.uid() = author_user_id);

CREATE POLICY "authors_delete_own_drafts" ON public.book_chapter_drafts
  FOR DELETE USING (auth.uid() = author_user_id);

-- Auto-update updated_at on any change
CREATE OR REPLACE FUNCTION update_draft_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_book_chapter_drafts_updated
  BEFORE UPDATE ON public.book_chapter_drafts
  FOR EACH ROW EXECUTE FUNCTION update_draft_timestamp();
