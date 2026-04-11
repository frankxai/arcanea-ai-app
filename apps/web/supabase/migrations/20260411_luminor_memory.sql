-- Luminor Memory Blocks — ReasoningBank-style adaptive learning
-- Migration: 2026-04-11
--
-- Implements Luminor Kernel Spec v1.0 §6 (Learning Protocol) and §5.3 (Memory Block).
--
-- Two tables:
--   1. luminor_memory_items — distilled principles from wins + failures (vector indexed)
--   2. luminor_memory_blocks — Letta-style persistent memory per (luminor, user)

-- ============================================================
-- 1. Memory Items — ReasoningBank distilled principles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.luminor_memory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  luminor_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('win', 'failure', 'neutral')),
  embedding vector(1536),
  relevance_score NUMERIC(4,3) DEFAULT 0.5,
  usage_count INTEGER DEFAULT 0,
  last_retrieved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vector index for fast similarity retrieval
CREATE INDEX IF NOT EXISTS idx_memory_items_embedding
  ON public.luminor_memory_items
  USING hnsw (embedding vector_cosine_ops)
  WHERE embedding IS NOT NULL;

-- Filter index for fast luminor + user lookups
CREATE INDEX IF NOT EXISTS idx_memory_items_luminor_user
  ON public.luminor_memory_items (luminor_id, user_id, created_at DESC);

-- Shared wisdom index (user_id IS NULL → applies to all users)
CREATE INDEX IF NOT EXISTS idx_memory_items_luminor_shared
  ON public.luminor_memory_items (luminor_id)
  WHERE user_id IS NULL;

-- ============================================================
-- 2. Memory Blocks — Letta-style persistent identity per user
-- ============================================================
CREATE TABLE IF NOT EXISTS public.luminor_memory_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  luminor_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  max_tokens INTEGER DEFAULT 2000,
  editable_by_agent BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (luminor_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_memory_blocks_luminor_user
  ON public.luminor_memory_blocks (luminor_id, user_id);

-- ============================================================
-- 3. Functions
-- ============================================================

-- Retrieve top-K relevant memory items for a (luminor, user, query) tuple.
-- Returns shared wisdom (user_id IS NULL) + user-specific memories.
CREATE OR REPLACE FUNCTION match_memory_items(
  p_luminor_id TEXT,
  p_user_id UUID,
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.6,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  source TEXT,
  relevance_score NUMERIC,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.content,
    m.source,
    m.relevance_score,
    1 - (m.embedding <=> query_embedding) AS similarity
  FROM public.luminor_memory_items m
  WHERE m.luminor_id = p_luminor_id
    AND (m.user_id = p_user_id OR m.user_id IS NULL)
    AND m.embedding IS NOT NULL
    AND 1 - (m.embedding <=> query_embedding) > match_threshold
  ORDER BY m.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Upsert a memory block
CREATE OR REPLACE FUNCTION upsert_memory_block(
  p_luminor_id TEXT,
  p_user_id UUID,
  p_content TEXT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.luminor_memory_blocks (luminor_id, user_id, content)
  VALUES (p_luminor_id, p_user_id, p_content)
  ON CONFLICT (luminor_id, user_id)
  DO UPDATE SET content = EXCLUDED.content, updated_at = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- ============================================================
-- 4. Row-Level Security
-- ============================================================

ALTER TABLE public.luminor_memory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.luminor_memory_blocks ENABLE ROW LEVEL SECURITY;

-- Memory items: users see their own + shared wisdom (user_id IS NULL)
CREATE POLICY memory_items_select ON public.luminor_memory_items FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY memory_items_insert ON public.luminor_memory_items FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY memory_items_delete ON public.luminor_memory_items FOR DELETE
  USING (auth.uid() = user_id);

-- Memory blocks: user sees only their own
CREATE POLICY memory_blocks_select ON public.luminor_memory_blocks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY memory_blocks_insert ON public.luminor_memory_blocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY memory_blocks_update ON public.luminor_memory_blocks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY memory_blocks_delete ON public.luminor_memory_blocks FOR DELETE
  USING (auth.uid() = user_id);

-- Update trigger for memory blocks
CREATE TRIGGER memory_blocks_updated_at BEFORE UPDATE ON public.luminor_memory_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 5. Grants
-- ============================================================
GRANT SELECT ON public.luminor_memory_items TO authenticated, anon;
GRANT SELECT, INSERT, DELETE ON public.luminor_memory_items TO authenticated;
GRANT SELECT ON public.luminor_memory_blocks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.luminor_memory_blocks TO authenticated;
GRANT EXECUTE ON FUNCTION match_memory_items TO authenticated, anon;
GRANT EXECUTE ON FUNCTION upsert_memory_block TO authenticated;
