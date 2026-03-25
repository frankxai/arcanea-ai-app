-- Living Lore: Progress tracking and crew bonds
-- Supports the interactive narrative journey through the Ten Gates

-- Episode/encounter completion tracking
CREATE TABLE IF NOT EXISTS living_lore_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('episode', 'encounter')),
  content_slug TEXT NOT NULL,
  act_number INTEGER NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  choices JSONB DEFAULT '{}',
  xp_awarded INTEGER DEFAULT 0,
  UNIQUE(user_id, content_slug)
);

-- Crew member relationship bonds
CREATE TABLE IF NOT EXISTS crew_bonds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crew_member_id TEXT NOT NULL,
  bond_level INTEGER DEFAULT 0 CHECK (bond_level >= 0 AND bond_level <= 100),
  conversations INTEGER DEFAULT 0,
  encounters_shared INTEGER DEFAULT 0,
  last_interaction TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, crew_member_id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_living_lore_progress_user ON living_lore_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_living_lore_progress_act ON living_lore_progress(act_number);
CREATE INDEX IF NOT EXISTS idx_crew_bonds_user ON crew_bonds(user_id);

-- RLS policies
ALTER TABLE living_lore_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_bonds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON living_lore_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON living_lore_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON living_lore_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own bonds"
  ON crew_bonds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bonds"
  ON crew_bonds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bonds"
  ON crew_bonds FOR UPDATE
  USING (auth.uid() = user_id);

-- XP increment function (if not already exists)
CREATE OR REPLACE FUNCTION increment_xp(user_id_input UUID, xp_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET xp = COALESCE(xp, 0) + xp_amount
  WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
