-- Arcanea Agent Registry Protocol
-- Migration: 2026-04-10
-- Extends marketplace_agents with multi-tenant registry, semantic search, deployments, revenue
-- This is Arcanea's foundational IP — the "npm of agents"

-- ============================================================
-- 1. Enable pgvector for semantic agent discovery
-- ============================================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- 2. Extend marketplace_agents with registry protocol fields
-- ============================================================
ALTER TABLE public.marketplace_agents
  ADD COLUMN IF NOT EXISTS platform_id TEXT,
  ADD COLUMN IF NOT EXISTS embedding vector(1536),
  ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0',
  ADD COLUMN IF NOT EXISTS license TEXT DEFAULT 'MIT',
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS mcp_endpoint TEXT,
  ADD COLUMN IF NOT EXISTS personality_hash TEXT;

-- ============================================================
-- 3. Platforms — registered consumers of the registry
-- ============================================================
CREATE TABLE IF NOT EXISTS public.platforms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT,
  api_key_hash TEXT NOT NULL,
  allowed_origins TEXT[] DEFAULT '{}',
  fee_override NUMERIC(4,2),
  agent_count INTEGER DEFAULT 0,
  deployment_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. Creators — enriched profiles for agent builders
-- ============================================================
CREATE TABLE IF NOT EXISTS public.creators (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  wallet_address TEXT,
  attribution_score NUMERIC(5,2) DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  agent_count INTEGER DEFAULT 0,
  skill_count INTEGER DEFAULT 0,
  bio TEXT,
  avatar_url TEXT,
  links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. Deployments — who deployed what agent, on which platform
-- ============================================================
CREATE TABLE IF NOT EXISTS public.deployments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES public.marketplace_agents(id) ON DELETE CASCADE,
  platform_id TEXT REFERENCES public.platforms(id) ON DELETE SET NULL,
  deployer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  config JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'revoked')),
  api_keys_ref JSONB DEFAULT '{}',
  last_active_at TIMESTAMPTZ,
  deployed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 6. Usage Events — execution telemetry
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usage_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deployment_id UUID REFERENCES public.deployments(id) ON DELETE SET NULL,
  agent_id TEXT NOT NULL,
  platform_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tokens_used INTEGER DEFAULT 0,
  duration_ms INTEGER DEFAULT 0,
  credits_consumed INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 7. Revenue Events — transparent attribution + splits
-- ============================================================
CREATE TABLE IF NOT EXISTS public.revenue_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id TEXT NOT NULL,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_id TEXT,
  deployment_id UUID REFERENCES public.deployments(id) ON DELETE SET NULL,
  gross_amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL DEFAULT 0,
  creator_payout INTEGER NOT NULL DEFAULT 0,
  affiliate_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  affiliate_payout INTEGER DEFAULT 0,
  event_type TEXT NOT NULL CHECK (event_type IN ('deploy', 'usage', 'affiliate', 'tip')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 8. Skill Registry — independently published skills
-- ============================================================
CREATE TABLE IF NOT EXISTS public.skill_registry (
  id TEXT PRIMARY KEY,
  agent_id TEXT REFERENCES public.marketplace_agents(id) ON DELETE SET NULL,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  description TEXT NOT NULL,
  capabilities TEXT[] DEFAULT '{}',
  input_schema JSONB,
  output_schema JSONB,
  guardian_affinity TEXT[] DEFAULT '{}',
  embedding vector(1536),
  is_published BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 9. Platform API Keys — scoped access management
-- ============================================================
CREATE TABLE IF NOT EXISTS public.platform_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_id TEXT NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  label TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{read}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 10. Indexes
-- ============================================================

-- Semantic search (HNSW for fast ANN on embeddings)
CREATE INDEX IF NOT EXISTS idx_agents_embedding ON public.marketplace_agents
  USING hnsw (embedding vector_cosine_ops) WHERE embedding IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_skills_embedding ON public.skill_registry
  USING hnsw (embedding vector_cosine_ops) WHERE embedding IS NOT NULL;

-- Tags (GIN for array containment queries)
CREATE INDEX IF NOT EXISTS idx_agents_tags ON public.marketplace_agents USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_skills_capabilities ON public.skill_registry USING gin (capabilities);

-- Deployments
CREATE INDEX IF NOT EXISTS idx_deployments_platform ON public.deployments(platform_id, agent_id);
CREATE INDEX IF NOT EXISTS idx_deployments_deployer ON public.deployments(deployer_id, deployed_at DESC);
CREATE INDEX IF NOT EXISTS idx_deployments_agent ON public.deployments(agent_id) WHERE status = 'active';

-- Usage & Revenue
CREATE INDEX IF NOT EXISTS idx_usage_deployment ON public.usage_events(deployment_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_agent ON public.usage_events(agent_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_creator ON public.revenue_events(creator_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_agent ON public.revenue_events(agent_id, created_at DESC);

-- Platform keys
CREATE INDEX IF NOT EXISTS idx_platform_keys ON public.platform_api_keys(platform_id) WHERE is_active = true;

-- ============================================================
-- 11. Row-Level Security
-- ============================================================

ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_api_keys ENABLE ROW LEVEL SECURITY;

-- Platforms: owner manages, anyone reads active
CREATE POLICY platforms_select ON public.platforms FOR SELECT USING (is_active = true);
CREATE POLICY platforms_insert ON public.platforms FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY platforms_update ON public.platforms FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY platforms_delete ON public.platforms FOR DELETE USING (auth.uid() = owner_id);

-- Creators: public read, user manages own
CREATE POLICY creators_select ON public.creators FOR SELECT USING (true);
CREATE POLICY creators_insert ON public.creators FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY creators_update ON public.creators FOR UPDATE USING (auth.uid() = user_id);

-- Deployments: deployer sees own, platform owner sees platform's
CREATE POLICY deployments_select ON public.deployments FOR SELECT
  USING (auth.uid() = deployer_id OR
         platform_id IN (SELECT id FROM public.platforms WHERE owner_id = auth.uid()));
CREATE POLICY deployments_insert ON public.deployments FOR INSERT WITH CHECK (auth.uid() = deployer_id);
CREATE POLICY deployments_update ON public.deployments FOR UPDATE
  USING (auth.uid() = deployer_id OR
         platform_id IN (SELECT id FROM public.platforms WHERE owner_id = auth.uid()));

-- Usage events: deployer sees own deployments', platform owner sees platform's
CREATE POLICY usage_select ON public.usage_events FOR SELECT
  USING (auth.uid() = user_id OR
         deployment_id IN (SELECT id FROM public.deployments WHERE deployer_id = auth.uid()) OR
         platform_id IN (SELECT id FROM public.platforms WHERE owner_id = auth.uid()));
CREATE POLICY usage_insert ON public.usage_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Revenue events: creator sees own, platform owner sees platform's
CREATE POLICY revenue_select ON public.revenue_events FOR SELECT
  USING (auth.uid() = creator_id OR auth.uid() = affiliate_id OR
         platform_id IN (SELECT id FROM public.platforms WHERE owner_id = auth.uid()));

-- Skills: anyone reads published, creator manages own
CREATE POLICY skills_select ON public.skill_registry FOR SELECT USING (is_published = true);
CREATE POLICY skills_insert ON public.skill_registry FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY skills_update ON public.skill_registry FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY skills_delete ON public.skill_registry FOR DELETE USING (auth.uid() = creator_id);

-- Platform API keys: platform owner only
CREATE POLICY keys_select ON public.platform_api_keys FOR SELECT
  USING (platform_id IN (SELECT id FROM public.platforms WHERE owner_id = auth.uid()));
CREATE POLICY keys_insert ON public.platform_api_keys FOR INSERT
  WITH CHECK (platform_id IN (SELECT id FROM public.platforms WHERE owner_id = auth.uid()));
CREATE POLICY keys_update ON public.platform_api_keys FOR UPDATE
  USING (platform_id IN (SELECT id FROM public.platforms WHERE owner_id = auth.uid()));

-- ============================================================
-- 12. Functions
-- ============================================================

-- Semantic agent search via pgvector
CREATE OR REPLACE FUNCTION match_agents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  title TEXT,
  description TEXT,
  category TEXT,
  capabilities TEXT[],
  tags TEXT[],
  creator_id UUID,
  price_credits INTEGER,
  is_open BOOLEAN,
  rating NUMERIC,
  usage_count INTEGER,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ma.id, ma.name, ma.title, ma.description, ma.category,
    ma.capabilities, ma.tags, ma.creator_id, ma.price_credits,
    ma.is_open, ma.rating, ma.usage_count,
    1 - (ma.embedding <=> query_embedding) AS similarity
  FROM public.marketplace_agents ma
  WHERE ma.is_published = true
    AND ma.embedding IS NOT NULL
    AND 1 - (ma.embedding <=> query_embedding) > match_threshold
  ORDER BY ma.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Calculate revenue split (15% platform, 85% creator by default)
CREATE OR REPLACE FUNCTION calculate_revenue_split(
  p_gross INTEGER,
  p_platform_id TEXT DEFAULT NULL
)
RETURNS TABLE (platform_fee INTEGER, creator_payout INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
  fee_rate NUMERIC(4,2) := 0.15;
BEGIN
  IF p_platform_id IS NOT NULL THEN
    SELECT COALESCE(p.fee_override, 0.15) INTO fee_rate
    FROM public.platforms p WHERE p.id = p_platform_id;
  END IF;

  platform_fee := FLOOR(p_gross * fee_rate);
  creator_payout := p_gross - platform_fee;
  RETURN NEXT;
END;
$$;

-- Update triggers (reuses update_updated_at from 20260330 migration)
CREATE TRIGGER platforms_updated_at BEFORE UPDATE ON public.platforms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER creators_updated_at BEFORE UPDATE ON public.creators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER deployments_updated_at BEFORE UPDATE ON public.deployments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER skill_registry_updated_at BEFORE UPDATE ON public.skill_registry
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
