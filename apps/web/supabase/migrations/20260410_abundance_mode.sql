-- Arcanea Agent Registry — Abundance Mode
-- Migration: 2026-04-10
-- Pivots registry from monetized marketplace to pure open protocol.
-- Rationale: legal/ops overhead of revenue splits (DAC7, VAT, KYC, disputes)
-- outweighs the 15% cut. Revenue flows to adjacent products instead.

-- 1. Rename revenue_events → attribution_events
ALTER TABLE public.revenue_events RENAME TO attribution_events;

-- 2. Drop money columns from critical path
ALTER TABLE public.attribution_events
  DROP COLUMN IF EXISTS platform_fee,
  DROP COLUMN IF EXISTS creator_payout,
  DROP COLUMN IF EXISTS affiliate_payout;

-- 3. Rename gross_amount → tip_amount (voluntary, optional feature)
ALTER TABLE public.attribution_events RENAME COLUMN gross_amount TO tip_amount;
ALTER TABLE public.attribution_events ALTER COLUMN tip_amount SET DEFAULT 0;
ALTER TABLE public.attribution_events ALTER COLUMN tip_amount DROP NOT NULL;

-- 4. Update event types for abundance model
ALTER TABLE public.attribution_events DROP CONSTRAINT IF EXISTS revenue_events_event_type_check;
ALTER TABLE public.attribution_events
  ADD CONSTRAINT attribution_events_event_type_check
  CHECK (event_type IN ('deploy', 'usage', 'mention', 'tip', 'fork'));

-- 5. Default all agents to open
UPDATE public.marketplace_agents SET is_open = true WHERE is_open IS NULL;
ALTER TABLE public.marketplace_agents ALTER COLUMN is_open SET DEFAULT true;
ALTER TABLE public.marketplace_agents ALTER COLUMN is_open SET NOT NULL;
ALTER TABLE public.marketplace_agents ALTER COLUMN price_credits SET DEFAULT 0;

-- 6. Drop obsolete revenue split function
DROP FUNCTION IF EXISTS calculate_revenue_split(INTEGER, TEXT);

-- 7. Rename indexes
ALTER INDEX IF EXISTS idx_revenue_creator RENAME TO idx_attribution_creator;
ALTER INDEX IF EXISTS idx_revenue_agent RENAME TO idx_attribution_agent;

-- 8. RLS — attribution is public by design (transparency is a feature)
DROP POLICY IF EXISTS revenue_select ON public.attribution_events;
CREATE POLICY attribution_select ON public.attribution_events FOR SELECT USING (true);
CREATE POLICY attribution_insert ON public.attribution_events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
