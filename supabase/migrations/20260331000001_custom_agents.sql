-- Custom Agents — The Forge
-- Enables community-created AI agents alongside built-in Luminors

CREATE TABLE IF NOT EXISTS public.custom_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 40),
  slug TEXT NOT NULL,
  description TEXT CHECK (char_length(description) <= 200),
  avatar_emoji TEXT DEFAULT '🤖',
  avatar_url TEXT,
  system_prompt TEXT NOT NULL CHECK (char_length(system_prompt) BETWEEN 10 AND 8000),
  personality_tags TEXT[] DEFAULT '{}',
  base_luminor_id TEXT,
  preferred_tools TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('development', 'creative', 'writing', 'research', 'general', 'roleplay', 'productivity')),
  visibility TEXT NOT NULL DEFAULT 'private'
    CHECK (visibility IN ('private', 'unlisted', 'public')),
  use_count INT DEFAULT 0,
  fork_count INT DEFAULT 0,
  forked_from UUID REFERENCES public.custom_agents(id) ON DELETE SET NULL,
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (creator_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_custom_agents_creator ON public.custom_agents(creator_id);
CREATE INDEX IF NOT EXISTS idx_custom_agents_public ON public.custom_agents(visibility, use_count DESC) WHERE visibility = 'public';
CREATE INDEX IF NOT EXISTS idx_custom_agents_category ON public.custom_agents(category) WHERE visibility = 'public';

-- RLS
ALTER TABLE public.custom_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners_full_access" ON public.custom_agents
  FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "public_agents_readable" ON public.custom_agents
  FOR SELECT USING (visibility IN ('public', 'unlisted'));

-- Usage tracking
CREATE TABLE IF NOT EXISTS public.agent_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.custom_agents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_uses_agent ON public.agent_uses(agent_id);
ALTER TABLE public.agent_uses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_track_own_usage" ON public.agent_uses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_view_own_usage" ON public.agent_uses
  FOR SELECT USING (auth.uid() = user_id);

-- Add agent_id to chat_sessions for agent tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_sessions' AND column_name = 'agent_id'
  ) THEN
    ALTER TABLE public.chat_sessions ADD COLUMN agent_id UUID REFERENCES public.custom_agents(id) ON DELETE SET NULL;
  END IF;
END $$;
