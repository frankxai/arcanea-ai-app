-- Creation Engine P1: Assets and Asset Links (Issue #531)

CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('image', 'video', 'model3d', 'audio')),
    storage_bucket TEXT NOT NULL,
    object_key TEXT NOT NULL,
    sha256 TEXT,
    width INTEGER,
    height INTEGER,
    duration_seconds NUMERIC(10, 3),
    model_id TEXT NOT NULL,
    seed BIGINT,
    prompt TEXT NOT NULL,
    enhanced_prompt TEXT,
    parent_asset_id UUID REFERENCES public.assets(id) ON DELETE SET NULL,
    job_id UUID,
    visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'unlisted', 'public')),
    moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.asset_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('world', 'character', 'scene', 'recipe')),
    target_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'reference' CHECK (role IN ('reference', 'keyframe', 'final', 'variant')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assets_owner ON public.assets(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_kind_visibility ON public.assets(kind, visibility, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_asset_links_target ON public.asset_links(target_type, target_id);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assets_owner_select" ON public.assets
    FOR SELECT TO authenticated
    USING (auth.uid() = owner_id);

CREATE POLICY "assets_owner_insert_private_pending" ON public.assets
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = owner_id AND visibility = 'private' AND moderation_status = 'pending');

CREATE POLICY "assets_owner_update_private_pending" ON public.assets
    FOR UPDATE TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id AND visibility = 'private' AND moderation_status = 'pending');

CREATE POLICY "assets_owner_delete" ON public.assets
    FOR DELETE TO authenticated
    USING (auth.uid() = owner_id);

CREATE POLICY "assets_public_read" ON public.assets
    FOR SELECT TO public
    USING (visibility = 'public' AND moderation_status = 'approved');

CREATE POLICY "asset_links_read" ON public.asset_links
    FOR SELECT TO public
    USING (
        EXISTS (
            SELECT 1 FROM public.assets a
            WHERE a.id = asset_links.asset_id
              AND ((a.visibility = 'public' AND a.moderation_status = 'approved') OR a.owner_id = auth.uid())
        )
    );

CREATE POLICY "asset_links_owner_write" ON public.asset_links
    FOR ALL TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.assets a WHERE a.id = asset_links.asset_id AND a.owner_id = auth.uid())
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.assets a WHERE a.id = asset_links.asset_id AND a.owner_id = auth.uid())
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT SELECT ON public.assets TO anon;
GRANT ALL ON public.assets TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.asset_links TO authenticated;
GRANT SELECT ON public.asset_links TO anon;
GRANT ALL ON public.asset_links TO service_role;
