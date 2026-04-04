-- Worlds — The Multiverse
-- User-created worlds with elements, characters, and lore

CREATE TABLE IF NOT EXISTS public.worlds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  slug TEXT NOT NULL,
  tagline TEXT CHECK (char_length(tagline) <= 200),
  description TEXT CHECK (char_length(description) <= 5000),
  mood TEXT NOT NULL DEFAULT 'fantasy'
    CHECK (mood IN ('fantasy', 'sci-fi', 'horror', 'steampunk', 'mythological', 'cosmic', 'other')),
  elements JSONB DEFAULT '[]'::jsonb,
  gradient TEXT DEFAULT 'linear-gradient(135deg, #00bcd4, #7c3aed, #ffd700)',
  cover_url TEXT,
  visibility TEXT NOT NULL DEFAULT 'private'
    CHECK (visibility IN ('private', 'unlisted', 'public')),
  star_count INT DEFAULT 0,
  fork_count INT DEFAULT 0,
  character_count INT DEFAULT 0,
  forked_from UUID REFERENCES public.worlds(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (creator_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_worlds_creator ON public.worlds(creator_id);
CREATE INDEX IF NOT EXISTS idx_worlds_public ON public.worlds(visibility, star_count DESC) WHERE visibility = 'public';
CREATE INDEX IF NOT EXISTS idx_worlds_mood ON public.worlds(mood) WHERE visibility = 'public';
CREATE INDEX IF NOT EXISTS idx_worlds_slug ON public.worlds(slug);

-- RLS
ALTER TABLE public.worlds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners_full_access" ON public.worlds
  FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "public_worlds_readable" ON public.worlds
  FOR SELECT USING (visibility = 'public');

-- World Stars (many-to-many)
CREATE TABLE IF NOT EXISTS public.world_stars (
  world_id UUID NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (world_id, user_id)
);

ALTER TABLE public.world_stars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_stars" ON public.world_stars
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "stars_readable" ON public.world_stars
  FOR SELECT USING (true);

-- Updated-at trigger
CREATE OR REPLACE FUNCTION update_worlds_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER worlds_updated_at
  BEFORE UPDATE ON public.worlds
  FOR EACH ROW EXECUTE FUNCTION update_worlds_updated_at();
