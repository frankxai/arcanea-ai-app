-- Base table for chat_sessions.
--
-- Why this file exists, and why its timestamp is 20260322000000:
-- `20260322000001_chat_sessions.sql` runs `ALTER TABLE public.chat_sessions` and its
-- own header notes "The table already exists". It did exist — in the hosted database,
-- created out-of-band and never captured as a migration. So the committed history could
-- not reproduce the schema: a fresh `supabase db reset` failed on that ALTER, which
-- meant no new contributor and no recovery environment could stand the database up.
--
-- This migration is ordered one tick before the ALTER so the sequence is coherent from
-- empty. It is CREATE TABLE IF NOT EXISTS, so against the existing hosted database it
-- is a no-op and changes nothing.
--
-- Column set is taken from the generated types (lib/database/types/supabase-generated.ts),
-- which were generated from the live database — this reproduces production rather than
-- redesigning it. luminor_id is NOT NULL here because the following migration explicitly
-- relaxes it with `alter column luminor_id drop not null`.

CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  luminor_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user
  ON public.chat_sessions(user_id, updated_at DESC);
