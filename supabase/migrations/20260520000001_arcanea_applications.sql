-- Arcanea retreats & intensives application intake
-- Table schema for applications submitted via arcanea.ai/apply

CREATE TABLE IF NOT EXISTS public.arcanea_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  work TEXT NOT NULL,
  why TEXT NOT NULL,
  format TEXT,
  preferences TEXT,
  other TEXT,
  "submittedAt" TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'arcanea.ai/apply',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for chronological listing in Admin dashboards
CREATE INDEX IF NOT EXISTS idx_arcanea_applications_submitted_at
  ON public.arcanea_applications("submittedAt" DESC);

-- Enable Row Level Security
ALTER TABLE public.arcanea_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to submit applications (Write-Only)
CREATE POLICY "Enable public insert for applications" ON public.arcanea_applications
  FOR INSERT WITH CHECK (true);

-- No public select, update, or delete. Admins bypass RLS.
-- Grant explicit permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.arcanea_applications TO anon, authenticated;
