-- Digital Asset Management (DAM)
-- DB-backed source of truth for generated Arcanea assets, replacing the
-- hardcoded TypeScript registry (apps/web/lib/media/image-registry.ts) over time.
-- The registry's ImageRecord type stays the contract; this table becomes the
-- queryable, workflowable store. Docs: apps/web/docs/DAM.md.

-- ── assets: one row per managed asset ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category TEXT NOT NULL
    CHECK (category IN ('guardians', 'godbeasts', 'leviathans', 'gallery', 'luminors', 'nft')),
  -- Canonical subject links (at most one is set, per category)
  guardian TEXT,
  godbeast TEXT,
  leviathan TEXT,
  CONSTRAINT check_single_subject CHECK (
    (CASE WHEN guardian  IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN godbeast  IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN leviathan IS NOT NULL THEN 1 ELSE 0 END) <= 1
  ),
  version TEXT NOT NULL DEFAULT 'v1',
  url TEXT NOT NULL,
  storage_path TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'review', 'approved', 'published')),
  -- Which generation harness produced it
  harness TEXT
    CHECK (harness IS NULL OR harness IN ('grok-imagine', 'gpt-image-2', 'nano-banana-pro', 'nano-banana-2', 'higgsfield')),
  prompt TEXT,
  width INT,
  height INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assets_category ON public.assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_leviathan ON public.assets(leviathan) WHERE leviathan IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_assets_published ON public.assets(category, status) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_assets_tags ON public.assets USING GIN (tags);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Owners manage their own assets; approved/published assets are publicly readable.
CREATE POLICY "owners_full_access" ON public.assets
  FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "public_assets_readable" ON public.assets
  FOR SELECT USING (status IN ('approved', 'published'));

-- ── asset_generations: append-only audit of every generation + chain action ──
CREATE TABLE IF NOT EXISTS public.asset_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL
    CHECK (action IN ('generate', 'regenerate', 'approve', 'publish', 'ipfs-pin', 'mint', 'ip-register')),
  harness TEXT,
  prompt TEXT,
  -- Free-form result payload: ipfs cid, tx hash, ipa address, council verdict, etc.
  result JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_generations_asset ON public.asset_generations(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_generations_action ON public.asset_generations(action);

ALTER TABLE public.asset_generations ENABLE ROW LEVEL SECURITY;

-- The asset owner can read the full audit trail (incl. entries written by a
-- council/system actor with a different creator_id); the actor can read theirs.
CREATE POLICY "owners_read_own_generations" ON public.asset_generations
  FOR SELECT USING (
    auth.uid() = creator_id
    OR EXISTS (SELECT 1 FROM public.assets a WHERE a.id = asset_id AND a.creator_id = auth.uid())
  );

-- Must be the acting user AND own the referenced asset — prevents forging audit
-- rows (fake approvals/mints) against another user's asset.
CREATE POLICY "owners_insert_own_generations" ON public.asset_generations
  FOR INSERT WITH CHECK (
    auth.uid() = creator_id
    AND EXISTS (SELECT 1 FROM public.assets a WHERE a.id = asset_id AND a.creator_id = auth.uid())
  );

-- ── updated_at trigger for assets ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_assets_updated_at ON public.assets;
CREATE TRIGGER trg_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION update_assets_updated_at();
