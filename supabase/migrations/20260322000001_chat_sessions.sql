-- Add cloud sync columns to existing chat_sessions table
-- The table already exists with: id, user_id, title, luminor_id, created_at, updated_at
-- We add: messages (jsonb), model_id (text), and relax luminor_id to nullable

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
