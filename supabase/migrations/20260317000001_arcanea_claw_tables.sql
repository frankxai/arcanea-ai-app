-- =====================================================================
-- ARCANEA CLAW — CREATOR OS DATABASE FOUNDATION
-- =====================================================================
-- Version: 1.0.0
-- Date: 2026-03-17
-- Purpose: Core tables for the ArcaneaClaw Creator OS — media asset
--          management, agent registry, social publishing queue, and
--          deployment pipeline. Designed for multi-agent, multi-device,
--          multiverse-ready creative operations.
-- =====================================================================


-- =====================================================================
-- UTILITY: updated_at TRIGGER FUNCTION
-- =====================================================================
-- Reusable trigger function that sets updated_at = now() on every UPDATE.
-- Created with IF NOT EXISTS so it's safe to run alongside other migrations.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_updated_at() IS
  'Generic trigger function: sets updated_at = now() on every row UPDATE.';


-- =====================================================================
-- TABLE 1: asset_metadata
-- Single source of truth for ALL media across all agents
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.asset_metadata (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name         text        NOT NULL,
  file_path         text,
  file_hash         text,
  file_size         bigint,
  mime_type         text,
  width             integer,
  height            integer,
  duration_seconds  numeric,

  -- Arcanea canonical classification
  guardian          text,
  element           text        CHECK (element IN ('Fire', 'Water', 'Earth', 'Wind', 'Void')),
  gate              text        CHECK (gate IN (
                                  'Foundation', 'Flow', 'Fire', 'Heart', 'Voice',
                                  'Sight', 'Crown', 'Starweave', 'Unity', 'Source'
                                )),
  content_type      text        CHECK (content_type IN (
                                  'hero', 'gallery', 'thumbnail', 'social',
                                  'video', 'audio', 'raw'
                                )),
  tags              text[]      DEFAULT '{}',

  -- Quality (TASTE scoring)
  quality_score     numeric(5,2) DEFAULT 0   CHECK (quality_score >= 0 AND quality_score <= 100),
  quality_tier      text        DEFAULT 'unscored'
                                CHECK (quality_tier IN ('hero', 'gallery', 'thumbnail', 'reject', 'unscored')),

  -- Lifecycle
  status            text        DEFAULT 'new'
                                CHECK (status IN (
                                  'new', 'classified', 'processed', 'scored',
                                  'approved', 'rejected', 'published'
                                )),
  source_agent      text,

  -- Storage
  storage_url       text,
  thumbnail_url     text,
  storage_tier      text        CHECK (storage_tier IS NULL OR storage_tier IN (
                                  'vercel_blob', 'supabase', 'r2', 'local'
                                )),

  -- Multiverse
  world_id          text        DEFAULT 'arcanea',
  published_to      text[]      DEFAULT '{}',

  -- Flexible extra data (EXIF, AI generation params, etc.)
  metadata          jsonb       DEFAULT '{}',

  -- Timestamps
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  approved_at       timestamptz,
  approved_by       text
);

COMMENT ON TABLE public.asset_metadata IS
  'Single source of truth for ALL media assets across all agents, devices, and worlds.';
COMMENT ON COLUMN public.asset_metadata.file_hash IS
  'MD5 hash for deduplication.';
COMMENT ON COLUMN public.asset_metadata.guardian IS
  'Canonical Guardian name (e.g. Draconia, Leyla). NULL if unassigned.';
COMMENT ON COLUMN public.asset_metadata.quality_score IS
  'TASTE score 0-100. Determines quality_tier.';
COMMENT ON COLUMN public.asset_metadata.quality_tier IS
  'hero (80+), gallery (60-79), thumbnail (40-59), reject (<40), unscored.';
COMMENT ON COLUMN public.asset_metadata.world_id IS
  'Multiverse support. Default arcanea for the primary world.';
COMMENT ON COLUMN public.asset_metadata.published_to IS
  'Array of targets: website, instagram, linkedin, x, youtube.';
COMMENT ON COLUMN public.asset_metadata.metadata IS
  'Flexible JSONB for EXIF data, AI generation params, processing history, etc.';

-- updated_at trigger
CREATE TRIGGER asset_metadata_updated_at
  BEFORE UPDATE ON public.asset_metadata
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- =====================================================================
-- TABLE 2: agent_registry
-- All connected agents across all devices
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.agent_registry (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id          text        UNIQUE NOT NULL,
  agent_type        text        NOT NULL
                                CHECK (agent_type IN (
                                  'arcanea-claw', 'claude-code', 'mobile-capture',
                                  'cloud-gemini', 'cloud-suno'
                                )),
  agent_name        text,
  hostname          text,
  ip_address        text,
  capabilities      text[]      DEFAULT '{}',
  status            text        DEFAULT 'offline'
                                CHECK (status IN ('online', 'busy', 'idle', 'offline', 'error')),
  current_task      text,
  items_processed   integer     DEFAULT 0   CHECK (items_processed >= 0),
  items_today       integer     DEFAULT 0   CHECK (items_today >= 0),
  last_heartbeat    timestamptz DEFAULT now(),
  last_error        text,
  config            jsonb       DEFAULT '{}',
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

COMMENT ON TABLE public.agent_registry IS
  'Registry of all ArcaneaClaw agents across devices, clouds, and local machines.';
COMMENT ON COLUMN public.agent_registry.agent_id IS
  'Unique identifier, e.g. arcanea-claw-laptop-001.';
COMMENT ON COLUMN public.agent_registry.capabilities IS
  'Array of capabilities: scan, classify, process, upload, generate.';
COMMENT ON COLUMN public.agent_registry.last_heartbeat IS
  'Last time the agent reported in. Used for liveness checks.';
COMMENT ON COLUMN public.agent_registry.config IS
  'Agent-specific configuration (scan paths, thresholds, etc.).';

-- updated_at trigger
CREATE TRIGGER agent_registry_updated_at
  BEFORE UPDATE ON public.agent_registry
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- =====================================================================
-- TABLE 3: social_queue
-- Cross-platform social media scheduling
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.social_queue (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  platform          text        NOT NULL
                                CHECK (platform IN (
                                  'instagram', 'linkedin', 'x', 'youtube', 'tiktok'
                                )),
  account_id        text,
  content_text      text,
  media_ids         uuid[]      DEFAULT '{}',
  media_urls        text[]      DEFAULT '{}',
  hashtags          text[]      DEFAULT '{}',
  scheduled_at      timestamptz,
  published_at      timestamptz,
  published_url     text,
  status            text        DEFAULT 'draft'
                                CHECK (status IN (
                                  'draft', 'ready', 'approved', 'scheduled',
                                  'publishing', 'published', 'failed'
                                )),
  approved_by       text,
  approved_at       timestamptz,
  engagement        jsonb       DEFAULT '{}',
  error_message     text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

COMMENT ON TABLE public.social_queue IS
  'Cross-platform social media scheduling and tracking.';
COMMENT ON COLUMN public.social_queue.media_ids IS
  'References asset_metadata.id — resolved at publish time.';
COMMENT ON COLUMN public.social_queue.engagement IS
  'Post-publish metrics: {likes, comments, shares, impressions}.';

-- updated_at trigger
CREATE TRIGGER social_queue_updated_at
  BEFORE UPDATE ON public.social_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- =====================================================================
-- TABLE 4: publish_pipeline
-- Track deployments to all targets
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.publish_pipeline (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  target            text        NOT NULL
                                CHECK (target IN (
                                  'website', 'social', 'nft', 'book', 'music_platform'
                                )),
  asset_ids         uuid[]      DEFAULT '{}',
  action            text        NOT NULL
                                CHECK (action IN (
                                  'deploy_hero', 'deploy_gallery', 'update_og_image',
                                  'mint_nft', 'publish_track'
                                )),
  status            text        DEFAULT 'pending'
                                CHECK (status IN (
                                  'pending', 'in_progress', 'completed', 'failed', 'rolled_back'
                                )),
  triggered_by      text,
  deployed_url      text,
  deploy_log        text,
  started_at        timestamptz,
  completed_at      timestamptz,
  error_message     text,
  created_at        timestamptz DEFAULT now()
);

COMMENT ON TABLE public.publish_pipeline IS
  'Tracks every deployment action to any target (website, social, NFT, book, music).';
COMMENT ON COLUMN public.publish_pipeline.asset_ids IS
  'References asset_metadata.id — the assets being deployed.';
COMMENT ON COLUMN public.publish_pipeline.triggered_by IS
  'Which agent or interface triggered this: arcanea-claw, command-center, manual.';


-- =====================================================================
-- INDEXES
-- =====================================================================

-- asset_metadata
CREATE INDEX IF NOT EXISTS idx_asset_metadata_tags
  ON public.asset_metadata USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_asset_metadata_guardian
  ON public.asset_metadata (guardian);

CREATE INDEX IF NOT EXISTS idx_asset_metadata_status
  ON public.asset_metadata (status);

CREATE INDEX IF NOT EXISTS idx_asset_metadata_quality_tier
  ON public.asset_metadata (quality_tier);

CREATE INDEX IF NOT EXISTS idx_asset_metadata_file_hash
  ON public.asset_metadata (file_hash);

CREATE INDEX IF NOT EXISTS idx_asset_metadata_world_id
  ON public.asset_metadata (world_id);

-- agent_registry
CREATE INDEX IF NOT EXISTS idx_agent_registry_agent_id
  ON public.agent_registry (agent_id);

CREATE INDEX IF NOT EXISTS idx_agent_registry_status
  ON public.agent_registry (status);

-- social_queue
CREATE INDEX IF NOT EXISTS idx_social_queue_status
  ON public.social_queue (status);

CREATE INDEX IF NOT EXISTS idx_social_queue_scheduled_at
  ON public.social_queue (scheduled_at);

CREATE INDEX IF NOT EXISTS idx_social_queue_platform_status
  ON public.social_queue (platform, status);

-- publish_pipeline
CREATE INDEX IF NOT EXISTS idx_publish_pipeline_status
  ON public.publish_pipeline (status);

CREATE INDEX IF NOT EXISTS idx_publish_pipeline_target
  ON public.publish_pipeline (target);


-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

-- Enable RLS on all four tables
ALTER TABLE public.asset_metadata   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_registry   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_queue     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publish_pipeline ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------
-- asset_metadata policies
-- -----------------------------------------------------------------

-- Anonymous users can read published/approved assets (public gallery)
CREATE POLICY "asset_metadata_anon_select"
  ON public.asset_metadata
  FOR SELECT
  TO anon
  USING (status IN ('approved', 'published'));

-- Authenticated users: full read access
CREATE POLICY "asset_metadata_auth_select"
  ON public.asset_metadata
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users: insert
CREATE POLICY "asset_metadata_auth_insert"
  ON public.asset_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users: update
CREATE POLICY "asset_metadata_auth_update"
  ON public.asset_metadata
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users: delete
CREATE POLICY "asset_metadata_auth_delete"
  ON public.asset_metadata
  FOR DELETE
  TO authenticated
  USING (true);

-- Service role: full unrestricted access
CREATE POLICY "asset_metadata_service_all"
  ON public.asset_metadata
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- -----------------------------------------------------------------
-- agent_registry policies
-- -----------------------------------------------------------------

CREATE POLICY "agent_registry_auth_select"
  ON public.agent_registry
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "agent_registry_auth_insert"
  ON public.agent_registry
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "agent_registry_auth_update"
  ON public.agent_registry
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "agent_registry_auth_delete"
  ON public.agent_registry
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "agent_registry_service_all"
  ON public.agent_registry
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- -----------------------------------------------------------------
-- social_queue policies
-- -----------------------------------------------------------------

CREATE POLICY "social_queue_auth_select"
  ON public.social_queue
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "social_queue_auth_insert"
  ON public.social_queue
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "social_queue_auth_update"
  ON public.social_queue
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "social_queue_auth_delete"
  ON public.social_queue
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "social_queue_service_all"
  ON public.social_queue
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- -----------------------------------------------------------------
-- publish_pipeline policies
-- -----------------------------------------------------------------

CREATE POLICY "publish_pipeline_auth_select"
  ON public.publish_pipeline
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "publish_pipeline_auth_insert"
  ON public.publish_pipeline
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "publish_pipeline_auth_update"
  ON public.publish_pipeline
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "publish_pipeline_auth_delete"
  ON public.publish_pipeline
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "publish_pipeline_service_all"
  ON public.publish_pipeline
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- =====================================================================
-- DONE
-- =====================================================================
-- Tables created: asset_metadata, agent_registry, social_queue, publish_pipeline
-- Trigger function: set_updated_at() (applied to asset_metadata, agent_registry, social_queue)
-- Indexes: 12 total (GIN on tags, B-tree on status/guardian/quality/hash/world/agent/platform/scheduled)
-- RLS: enabled on all 4 tables, 22 policies total
-- =====================================================================
