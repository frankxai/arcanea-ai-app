-- Email capture tables written by apps/web/app/api/waitlist/route.ts (Founding
-- Circle) and apps/web/app/api/subscribe/route.ts (footer and coming-soon pages).
-- Both routes shipped before their tables existed and reported success while every
-- insert failed; this creates the tables they expect.

CREATE TABLE IF NOT EXISTS public.waitlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL CHECK (length(email) BETWEEN 3 AND 320 AND position('@' in email) > 1),
  source TEXT NOT NULL DEFAULT 'pricing_founding_circle',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email, source)
);

CREATE INDEX IF NOT EXISTS idx_waitlists_source_created_at
  ON public.waitlists (source, created_at DESC);

CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE CHECK (length(email) BETWEEN 3 AND 320 AND position('@' in email) > 1),
  source TEXT NOT NULL DEFAULT 'footer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_created_at
  ON public.subscribers (created_at DESC);

ALTER TABLE public.waitlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Visitors may join; nobody but the service role may read either list.
-- Drops first so the file can be re-run safely in the SQL editor.
DROP POLICY IF EXISTS "Public can join the waitlist" ON public.waitlists;
DROP POLICY IF EXISTS "Public can subscribe" ON public.subscribers;
CREATE POLICY "Public can join the waitlist" ON public.waitlists
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can subscribe" ON public.subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.waitlists TO anon, authenticated;
GRANT INSERT ON public.subscribers TO anon, authenticated;
