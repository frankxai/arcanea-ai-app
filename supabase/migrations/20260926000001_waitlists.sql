-- Founding Circle waitlist written by apps/web/app/api/waitlist/route.ts.
-- The route shipped before this table existed and reported success while every
-- insert failed; this creates the table it expects.

CREATE TABLE IF NOT EXISTS public.waitlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL CHECK (length(email) BETWEEN 3 AND 320 AND position('@' in email) > 1),
  source TEXT NOT NULL DEFAULT 'pricing_founding_circle',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email, source)
);

CREATE INDEX IF NOT EXISTS idx_waitlists_source_created_at
  ON public.waitlists (source, created_at DESC);

ALTER TABLE public.waitlists ENABLE ROW LEVEL SECURITY;

-- Visitors may join; nobody but the service role may read the list.
CREATE POLICY "Public can join the waitlist" ON public.waitlists
  FOR INSERT TO anon, authenticated WITH CHECK (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.waitlists TO anon, authenticated;
