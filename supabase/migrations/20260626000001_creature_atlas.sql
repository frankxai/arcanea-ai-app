-- Creature Atlas - derived index for repo-canonical creature entries.
-- Canonical source remains the world repo/content pack via content.creatures.

DO $$
BEGIN
  CREATE TYPE public.creature_rights_tier AS ENUM (
    'original_arcanea',
    'public_domain',
    'licensed',
    'factual_reference_only',
    'blocked'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE public.creature_atlas_status AS ENUM (
    'seed',
    'draft',
    'review',
    'approved',
    'blocked'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE public.creature_media_status AS ENUM (
    'prompt_ready',
    'generated',
    'approved',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE public.creature_contribution_status AS ENUM (
    'submitted',
    'rights_review',
    'canon_review',
    'visual_review',
    'accepted',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.creature_worlds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE CHECK (char_length(slug) BETWEEN 2 AND 120),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 160),
  owner TEXT,
  official_url TEXT,
  rights_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.creature_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE CHECK (char_length(slug) BETWEEN 2 AND 160),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 160),
  source_world_id UUID REFERENCES public.creature_worlds(id) ON DELETE SET NULL,
  source_work TEXT NOT NULL,
  source_creature_name TEXT,
  reference_mode TEXT NOT NULL CHECK (reference_mode IN ('original', 'public_domain_adaptation', 'factual_reference')),
  rights_tier public.creature_rights_tier NOT NULL DEFAULT 'factual_reference_only',
  status public.creature_atlas_status NOT NULL DEFAULT 'draft',
  short_description TEXT NOT NULL CHECK (char_length(short_description) <= 1200),
  taxonomy JSONB NOT NULL DEFAULT '[]'::jsonb,
  habitats JSONB NOT NULL DEFAULT '[]'::jsonb,
  abilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  citations JSONB NOT NULL DEFAULT '[]'::jsonb,
  arcanea_variant JSONB NOT NULL DEFAULT '{}'::jsonb,
  prompt_pack JSONB NOT NULL DEFAULT '{}'::jsonb,
  steward TEXT,
  repo_path TEXT,
  last_indexed_sha TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creature_entries_source_world ON public.creature_entries(source_world_id);
CREATE INDEX IF NOT EXISTS idx_creature_entries_rights_status ON public.creature_entries(rights_tier, status);
CREATE INDEX IF NOT EXISTS idx_creature_entries_taxonomy ON public.creature_entries USING gin (taxonomy);
CREATE INDEX IF NOT EXISTS idx_creature_entries_variant ON public.creature_entries USING gin (arcanea_variant);

CREATE TABLE IF NOT EXISTS public.creature_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_entry_id UUID NOT NULL REFERENCES public.creature_entries(id) ON DELETE CASCADE,
  target_entry_id UUID NOT NULL REFERENCES public.creature_entries(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  strength REAL NOT NULL DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
  citation_label TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_entry_id, target_entry_id, type)
);

CREATE INDEX IF NOT EXISTS idx_creature_relationships_source ON public.creature_relationships(source_entry_id);
CREATE INDEX IF NOT EXISTS idx_creature_relationships_target ON public.creature_relationships(target_entry_id);

CREATE TABLE IF NOT EXISTS public.creature_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creature_entry_id UUID NOT NULL REFERENCES public.creature_entries(id) ON DELETE CASCADE,
  world_creation_id UUID,
  status public.creature_media_status NOT NULL DEFAULT 'prompt_ready',
  provider TEXT,
  model TEXT,
  url TEXT,
  prompt TEXT,
  negative_prompt TEXT,
  params JSONB NOT NULL DEFAULT '{}'::jsonb,
  qa_score INT CHECK (qa_score IS NULL OR (qa_score >= 0 AND qa_score <= 30)),
  evidence_path TEXT,
  license_notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creature_media_entry ON public.creature_media(creature_entry_id);
CREATE INDEX IF NOT EXISTS idx_creature_media_status ON public.creature_media(status);

CREATE TABLE IF NOT EXISTS public.creature_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID,
  contributor_label TEXT,
  payload JSONB NOT NULL,
  status public.creature_contribution_status NOT NULL DEFAULT 'submitted',
  review_notes TEXT,
  linked_issue_url TEXT,
  linked_pr_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creature_contributions_status ON public.creature_contributions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_creature_contributions_contributor ON public.creature_contributions(contributor_id);

ALTER TABLE public.creature_worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creature_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creature_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creature_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creature_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "creature_worlds_public_read" ON public.creature_worlds
  FOR SELECT USING (true);

CREATE POLICY "creature_entries_public_read" ON public.creature_entries
  FOR SELECT USING (status IN ('seed', 'review', 'approved'));

CREATE POLICY "creature_relationships_public_read" ON public.creature_relationships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.creature_entries e
      WHERE e.id = source_entry_id AND e.status IN ('seed', 'review', 'approved')
    )
  );

CREATE POLICY "creature_media_public_read" ON public.creature_media
  FOR SELECT USING (
    status IN ('prompt_ready', 'approved')
    AND EXISTS (
      SELECT 1 FROM public.creature_entries e
      WHERE e.id = creature_entry_id AND e.status IN ('seed', 'review', 'approved')
    )
  );

CREATE POLICY "creature_contributions_insert" ON public.creature_contributions
  FOR INSERT WITH CHECK (contributor_id IS NULL OR contributor_id = auth.uid());

CREATE POLICY "creature_contributions_owner_read" ON public.creature_contributions
  FOR SELECT USING (contributor_id = auth.uid());
