-- Studio Ingestion — Universal creator memory layer
-- Migration: 2026-04-17
--
-- Implements the "drop anything in" surface from /studio. Stores ingested
-- content (text, URLs, files, Google Drive docs, Obsidian notes, Syncthing
-- folders) as portable markdown + JSONML, with pgvector embeddings for
-- semantic search and Luminor retrieval.
--
-- Design principles:
--   - Open formats: every row has a canonical markdown_content field
--   - Portable: full export to .md + .json via /api/studio/export (later)
--   - Sovereign: RLS gates everything to auth.uid()
--   - Searchable: HNSW vector index on 1536-dim embeddings
--   - Linkable: world_id optional reference connects a doc to a world graph
--   - Auditable: source_type + source_uri tracks where content came from

-- ============================================================
-- Table: ingested_documents
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ingested_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  world_id UUID REFERENCES public.worlds(id) ON DELETE SET NULL,

  -- Content — what was actually ingested
  title TEXT NOT NULL,
  markdown_content TEXT NOT NULL,
  jsonml_content JSONB,
  -- Raw original for provenance (file bytes live in Storage)
  storage_path TEXT,

  -- Classification — what the ingestion layer decided this is
  -- character / location / magic / scene / lore / reference / chapter / note
  classification TEXT NOT NULL DEFAULT 'reference',
  -- Confidence 0..1 from the classifier
  classification_confidence NUMERIC(4,3) DEFAULT 0.5,

  -- Source — where it came from
  source_type TEXT NOT NULL DEFAULT 'paste'
    CHECK (source_type IN ('paste','url','file','drive','obsidian','syncthing','github','notion','chat')),
  source_uri TEXT,
  source_metadata JSONB DEFAULT '{}'::jsonb,

  -- Semantic — pgvector embedding for HNSW search
  embedding vector(1536),

  -- Stats
  word_count INTEGER DEFAULT 0,
  token_estimate INTEGER DEFAULT 0,

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Tags for additional structure
  tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- ============================================================
-- Indexes
-- ============================================================

-- HNSW vector index — the semantic search backbone
CREATE INDEX IF NOT EXISTS idx_ingested_docs_embedding
  ON public.ingested_documents
  USING hnsw (embedding vector_cosine_ops)
  WHERE embedding IS NOT NULL;

-- Per-user list / filter queries
CREATE INDEX IF NOT EXISTS idx_ingested_docs_user_created
  ON public.ingested_documents (user_id, created_at DESC);

-- Classification filter (e.g. show all my characters)
CREATE INDEX IF NOT EXISTS idx_ingested_docs_user_classification
  ON public.ingested_documents (user_id, classification, created_at DESC);

-- World linkage — fast lookup of all docs attached to a world
CREATE INDEX IF NOT EXISTS idx_ingested_docs_world
  ON public.ingested_documents (world_id, created_at DESC)
  WHERE world_id IS NOT NULL;

-- Source filter (e.g. pull everything ingested from Google Drive)
CREATE INDEX IF NOT EXISTS idx_ingested_docs_source
  ON public.ingested_documents (user_id, source_type);

-- Tag search via GIN
CREATE INDEX IF NOT EXISTS idx_ingested_docs_tags
  ON public.ingested_documents
  USING gin (tags);

-- ============================================================
-- Row Level Security — sovereignty guaranteed
-- ============================================================
ALTER TABLE public.ingested_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own ingested docs"
  ON public.ingested_documents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users insert own ingested docs"
  ON public.ingested_documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own ingested docs"
  ON public.ingested_documents
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "users delete own ingested docs"
  ON public.ingested_documents
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.touch_ingested_docs()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_ingested_docs_touch ON public.ingested_documents;
CREATE TRIGGER tr_ingested_docs_touch
  BEFORE UPDATE ON public.ingested_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_ingested_docs();

-- ============================================================
-- RPC: match_ingested_documents(query_embedding, match_count, p_user_id, p_world_id)
-- Returns semantically similar documents for a given user
-- ============================================================
CREATE OR REPLACE FUNCTION public.match_ingested_documents(
  query_embedding vector(1536),
  match_count INT DEFAULT 8,
  p_user_id UUID DEFAULT NULL,
  p_world_id UUID DEFAULT NULL,
  p_classification TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  markdown_content TEXT,
  classification TEXT,
  source_type TEXT,
  world_id UUID,
  tags TEXT[],
  created_at TIMESTAMPTZ,
  similarity NUMERIC
)
LANGUAGE SQL STABLE AS $$
  SELECT
    d.id,
    d.title,
    d.markdown_content,
    d.classification,
    d.source_type,
    d.world_id,
    d.tags,
    d.created_at,
    (1 - (d.embedding <=> query_embedding))::NUMERIC AS similarity
  FROM public.ingested_documents d
  WHERE d.embedding IS NOT NULL
    AND (p_user_id IS NULL OR d.user_id = p_user_id)
    AND (p_world_id IS NULL OR d.world_id = p_world_id)
    AND (p_classification IS NULL OR d.classification = p_classification)
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ============================================================
-- Table: user_oauth_tokens — for Google Drive, Notion, etc.
-- ============================================================
-- Supabase Auth handles the OAuth flow for providers configured in the dash.
-- This table stores the access/refresh tokens returned by providers like
-- Google where we need drive.readonly scope beyond basic identity.
CREATE TABLE IF NOT EXISTS public.user_oauth_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google','notion','github','linear','obsidian','syncthing')),
  scopes TEXT[] DEFAULT ARRAY[]::TEXT[],
  access_token_enc TEXT NOT NULL, -- encrypted at rest
  refresh_token_enc TEXT,
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);

ALTER TABLE public.user_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Only service role touches this table — users never read tokens directly
CREATE POLICY "service role only"
  ON public.user_oauth_tokens
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_user_oauth_tokens_user_provider
  ON public.user_oauth_tokens (user_id, provider);

-- Apply same touch trigger
DROP TRIGGER IF EXISTS tr_oauth_tokens_touch ON public.user_oauth_tokens;
CREATE TRIGGER tr_oauth_tokens_touch
  BEFORE UPDATE ON public.user_oauth_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_ingested_docs();

-- ============================================================
-- Grants
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ingested_documents TO authenticated;
GRANT EXECUTE ON FUNCTION public.match_ingested_documents(vector, INT, UUID, UUID, TEXT) TO authenticated;

-- user_oauth_tokens: no direct grants, service role only (RLS enforces)

-- ============================================================
-- Comments — documentation for future maintainers
-- ============================================================
COMMENT ON TABLE public.ingested_documents IS
  'Studio universal ingestion layer. Stores content from /studio DropZone as portable markdown + JSONML with pgvector embeddings for semantic Luminor retrieval.';

COMMENT ON COLUMN public.ingested_documents.classification IS
  'Auto-detected content type: character/location/magic/scene/lore/reference/chapter/note. Classifier is cheap LLM (Haiku-class) run at ingest time.';

COMMENT ON COLUMN public.ingested_documents.source_type IS
  'Origin of ingestion: paste | url | file | drive | obsidian | syncthing | github | notion | chat. Used for filtering and sync triggers.';

COMMENT ON TABLE public.user_oauth_tokens IS
  'Encrypted OAuth tokens for connected sources (Google Drive drive.readonly, Notion, GitHub, etc.). Never exposed to clients — service-role reads only.';
