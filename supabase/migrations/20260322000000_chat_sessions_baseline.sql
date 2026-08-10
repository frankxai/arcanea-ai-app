-- Establish the chat session baseline before the historical cloud-sync
-- migration alters it. Production databases that already have the table are
-- unchanged; clean Supabase preview branches receive the missing prerequisite.

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  luminor_id text,
  messages jsonb not null default '[]'::jsonb,
  model_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.chat_sessions is
  'Authenticated Arcanea chat sessions; created here so clean preview databases can replay migration history.';
