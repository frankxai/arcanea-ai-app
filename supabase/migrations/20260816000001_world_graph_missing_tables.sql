-- World graph: factions, locations, and fork lineage.
--
-- These three tables are read and written by shipped application code —
--   app/api/worlds/[slug]/route.ts, app/api/worlds/[slug]/fork/route.ts,
--   app/api/worlds/generate/route.ts, app/worlds/[slug]/page.tsx,
--   lib/worlds/world-service.ts, lib/worlds/character-prompt.ts, lib/worlds/world-stats.ts
-- — and they appear in the generated database types, but no migration ever created them.
-- They were created directly against the hosted database. The consequence was silent and
-- expensive: forking a world ran three copy queries against tables the committed schema
-- did not define, so a fork lost every faction and location it should have carried, and a
-- fresh environment could not reproduce the feature at all.
--
-- Column definitions are transcribed from lib/database/types/supabase-generated.ts, which
-- was generated from the live database. The intent here is to reproduce production
-- exactly, not to improve it — deliberately no extra CHECK constraints, because with
-- CREATE TABLE IF NOT EXISTS they would apply only to fresh databases and would silently
-- diverge from the hosted one. Tightening belongs in its own migration, applied to both.
--
-- Idempotent throughout: a no-op against the hosted database.

-- ── Factions: the powers that contend within a world ───────────────────────
CREATE TABLE IF NOT EXISTS public.world_factions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  philosophy TEXT,
  history TEXT,
  territory JSONB,
  visual_identity JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_world_factions_world
  ON public.world_factions(world_id);

-- ── Locations: the places a world is made of ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.world_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  region TEXT,
  significance TEXT,
  coordinates JSONB,
  image_url TEXT,
  ambient_music_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_world_locations_world
  ON public.world_locations(world_id);

-- ── Forks: lineage between a world and its descendants ─────────────────────
-- Nullable parent/child/actor columns mirror the generated types: lineage should
-- survive the deletion of either endpoint rather than vanish, so the references are
-- ON DELETE SET NULL.
CREATE TABLE IF NOT EXISTS public.world_forks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_world_id UUID REFERENCES public.worlds(id) ON DELETE SET NULL,
  forked_world_id UUID REFERENCES public.worlds(id) ON DELETE SET NULL,
  -- Plain UUID, deliberately not a FK. supabase-generated.ts lists only the two
  -- world relationships for world_forks, so a profiles FK here would make fresh
  -- databases reject rows production accepts. Reproduce production, do not
  -- redesign it; if this reference should exist it belongs in its own migration
  -- applied to production as well.
  forked_by UUID,
  changes_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_world_forks_parent
  ON public.world_forks(parent_world_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_world_forks_forked
  ON public.world_forks(forked_world_id);

-- ── RLS ────────────────────────────────────────────────────────────────────
-- Same shape as the other world child tables in 20260605000001_genesis_world_graph.sql:
-- readable by anyone who may read the world, writable only by its owner, using the
-- can_read_world() / owns_world() helpers defined there.
ALTER TABLE public.world_factions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_forks     ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'world_factions' AND policyname = 'factions_readable') THEN
    CREATE POLICY "factions_readable" ON public.world_factions
      FOR SELECT USING (public.can_read_world(world_id));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'world_factions' AND policyname = 'factions_owner_write') THEN
    CREATE POLICY "factions_owner_write" ON public.world_factions
      FOR ALL USING (public.owns_world(world_id)) WITH CHECK (public.owns_world(world_id));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'world_locations' AND policyname = 'locations_readable') THEN
    CREATE POLICY "locations_readable" ON public.world_locations
      FOR SELECT USING (public.can_read_world(world_id));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'world_locations' AND policyname = 'locations_owner_write') THEN
    CREATE POLICY "locations_owner_write" ON public.world_locations
      FOR ALL USING (public.owns_world(world_id)) WITH CHECK (public.owns_world(world_id));
  END IF;

  -- Lineage is visible from either end: the parent's forks are public record to anyone
  -- who may read the parent, and a fork's own origin is visible to anyone who may read it.
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'world_forks' AND policyname = 'forks_readable') THEN
    CREATE POLICY "forks_readable" ON public.world_forks
      FOR SELECT USING (
        public.can_read_world(parent_world_id) OR public.can_read_world(forked_world_id)
      );
  END IF;

  -- A fork record may only be written by the user it credits, only for a world they
  -- actually own, and only naming a parent they are allowed to read.
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'world_forks' AND policyname = 'forks_insert_own') THEN
    CREATE POLICY "forks_insert_own" ON public.world_forks
      FOR INSERT WITH CHECK (
        forked_by = auth.uid()
        AND public.owns_world(forked_world_id)
        -- parent_world_id must also be readable by the caller. Without this, owning
        -- any world is enough to attach forged lineage to an arbitrary parent whose
        -- UUID you know; forks_readable then surfaces that row to anyone who can read
        -- either end, and there is no UPDATE/DELETE policy for the real owner to
        -- remove it. NULL stays permitted for a fork with no recorded parent.
        AND (parent_world_id IS NULL OR public.can_read_world(parent_world_id))
      );
  END IF;
END $$;
