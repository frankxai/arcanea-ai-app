-- Genesis World Graph — the Living Universe Engine
-- HYBRID MODEL: the world REPO is the canonical source of truth. This schema is the
-- derived INDEX + render cache, rebuilt from the repo on push/webhook. Genesis
-- scaffolds a world repo, then indexes it here. The one place we hold a working copy
-- is paid hosted/private worlds. Free/public worlds live in the user's own repo.
-- Embeddings are vector(768) to match Gemini text-embedding-004 (see 20250109000000).

-- ── Extend worlds with Genesis fields + the canonical repo pointer ──────────
ALTER TABLE public.worlds
  ADD COLUMN IF NOT EXISTS premise TEXT CHECK (char_length(premise) <= 2000),
  ADD COLUMN IF NOT EXISTS laws JSONB DEFAULT '[]'::jsonb,            -- the 3 world laws
  ADD COLUMN IF NOT EXISTS visual_dna JSONB DEFAULT '{}'::jsonb,      -- palette, style, motifs
  ADD COLUMN IF NOT EXISTS theme_audio_url TEXT,                      -- the soundtrack
  ADD COLUMN IF NOT EXISTS canon_image_url TEXT,                      -- the key-frame
  ADD COLUMN IF NOT EXISTS genesis_prompt TEXT,                       -- the original sentence
  ADD COLUMN IF NOT EXISTS genesis_status TEXT NOT NULL DEFAULT 'seeded'
    CHECK (genesis_status IN ('seeding', 'seeded', 'failed')),
  -- canonical repo pointer (the source of truth this row is indexed from)
  ADD COLUMN IF NOT EXISTS repo_url TEXT,
  ADD COLUMN IF NOT EXISTS repo_provider TEXT DEFAULT 'github'
    CHECK (repo_provider IN ('github', 'gitlab', 'other')),
  ADD COLUMN IF NOT EXISTS repo_managed BOOLEAN DEFAULT false,        -- true = Arcanea-created under user's account
  ADD COLUMN IF NOT EXISTS hosting_tier TEXT NOT NULL DEFAULT 'repo'  -- where the working copy lives
    CHECK (hosting_tier IN ('repo', 'hosted_private', 'hosted_public')),
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_indexed_sha TEXT,
  ADD COLUMN IF NOT EXISTS visit_count INT DEFAULT 0;

-- ── Characters: the living cast ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.world_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  persona TEXT NOT NULL,                                              -- system prompt seed
  backstory TEXT,
  portrait_url TEXT,
  voice_id TEXT,                                                      -- TTS voice (later)
  evolution_state JSONB DEFAULT '{}'::jsonb,                          -- distilled, changes over time
  evolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_world_characters_world ON public.world_characters(world_id);

-- ── Memories: never forgets (vector-retrieved per turn) ─────────────────────
CREATE TABLE IF NOT EXISTS public.world_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES public.world_characters(id) ON DELETE CASCADE,
  world_id UUID NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(768),
  salience REAL DEFAULT 0.5,                                          -- 0..1, drives retention/evolution
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_world_memories_character ON public.world_memories(character_id);
CREATE INDEX IF NOT EXISTS idx_world_memories_embedding
  ON public.world_memories USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ── Lore: deepening canon ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.world_lore (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  embedding vector(768),
  canon_level INT DEFAULT 1,                                          -- 1 founding .. higher = emergent
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_world_lore_world ON public.world_lore(world_id);
CREATE INDEX IF NOT EXISTS idx_world_lore_embedding
  ON public.world_lore USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ── Assets: the multimodal canon ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.world_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'audio', 'video', '3d')),
  url TEXT NOT NULL,
  prompt TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_world_assets_world ON public.world_assets(world_id);

-- ── Events: the living timeline (visitor actions leave traces) ──────────────
CREATE TABLE IF NOT EXISTS public.world_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,    -- null = anonymous visitor
  type TEXT NOT NULL,                                                 -- e.g. 'visit', 'message', 'choice'
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_world_events_world ON public.world_events(world_id, created_at DESC);

-- ── RLS: child rows inherit the world's visibility ─────────────────────────
ALTER TABLE public.world_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_memories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_lore      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_assets    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_events    ENABLE ROW LEVEL SECURITY;

-- Helper: is the calling user allowed to read this world (owner or public/unlisted)?
CREATE OR REPLACE FUNCTION public.can_read_world(w UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = w
      AND (creator_id = auth.uid() OR visibility IN ('public', 'unlisted'))
  );
$$;

-- Helper: does the calling user own this world?
CREATE OR REPLACE FUNCTION public.owns_world(w UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM public.worlds WHERE id = w AND creator_id = auth.uid());
$$;

CREATE POLICY "characters_readable" ON public.world_characters
  FOR SELECT USING (public.can_read_world(world_id));
CREATE POLICY "characters_owner_write" ON public.world_characters
  FOR ALL USING (public.owns_world(world_id)) WITH CHECK (public.owns_world(world_id));

CREATE POLICY "lore_readable" ON public.world_lore
  FOR SELECT USING (public.can_read_world(world_id));
CREATE POLICY "lore_owner_write" ON public.world_lore
  FOR ALL USING (public.owns_world(world_id)) WITH CHECK (public.owns_world(world_id));

CREATE POLICY "assets_readable" ON public.world_assets
  FOR SELECT USING (public.can_read_world(world_id));
CREATE POLICY "assets_owner_write" ON public.world_assets
  FOR ALL USING (public.owns_world(world_id)) WITH CHECK (public.owns_world(world_id));

-- Memories: readable by anyone who can read the world (so visitors get continuity);
-- writes happen server-side (service role) during chat, so no client write policy.
CREATE POLICY "memories_readable" ON public.world_memories
  FOR SELECT USING (public.can_read_world(world_id));

-- Events: append-only. Anyone who can read the world may log an event (a visit/message).
CREATE POLICY "events_readable" ON public.world_events
  FOR SELECT USING (public.can_read_world(world_id));
CREATE POLICY "events_insert" ON public.world_events
  FOR INSERT WITH CHECK (public.can_read_world(world_id));

-- ── Retrieval: top-k memories for a character, by semantic similarity ───────
CREATE OR REPLACE FUNCTION public.match_character_memories(
  p_character_id UUID,
  query_embedding vector(768),
  match_count INT DEFAULT 8,
  match_threshold REAL DEFAULT 0.5
)
RETURNS TABLE (id UUID, content TEXT, salience REAL, similarity REAL)
LANGUAGE sql STABLE AS $$
  SELECT m.id, m.content, m.salience,
         1 - (m.embedding <=> query_embedding) AS similarity
  FROM public.world_memories m
  WHERE m.character_id = p_character_id
    AND m.embedding IS NOT NULL
    AND 1 - (m.embedding <=> query_embedding) > match_threshold
  ORDER BY m.embedding <=> query_embedding
  LIMIT match_count;
$$;
