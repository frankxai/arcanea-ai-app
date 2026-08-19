-- Establish the chat session baseline on clean databases, then add the
-- cloud-sync columns expected by existing production installations.

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

alter table public.chat_sessions
  add column if not exists messages jsonb not null default '[]'::jsonb;

alter table public.chat_sessions
  add column if not exists model_id text;

alter table public.chat_sessions
  alter column luminor_id drop not null;

-- Ensure RLS is enabled (idempotent)
alter table public.chat_sessions enable row level security;

-- Create policies only if they don't exist (use DO block for idempotency)
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'chat_sessions' and policyname = 'Users can view their own sessions'
  ) then
    create policy "Users can view their own sessions"
      on public.chat_sessions for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'chat_sessions' and policyname = 'Users can insert their own sessions'
  ) then
    create policy "Users can insert their own sessions"
      on public.chat_sessions for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'chat_sessions' and policyname = 'Users can update their own sessions'
  ) then
    create policy "Users can update their own sessions"
      on public.chat_sessions for update
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'chat_sessions' and policyname = 'Users can delete their own sessions'
  ) then
    create policy "Users can delete their own sessions"
      on public.chat_sessions for delete
      using (auth.uid() = user_id);
  end if;
end $$;

-- Indexes (idempotent)
create index if not exists idx_chat_sessions_user_id on public.chat_sessions(user_id);
create index if not exists idx_chat_sessions_updated_at on public.chat_sessions(updated_at desc);

comment on table public.chat_sessions is
  'Authenticated Arcanea chat sessions; this migration is self-contained for clean preview databases.';
