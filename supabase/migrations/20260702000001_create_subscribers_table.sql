create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'footer',
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

create policy "subscribers_insert_only"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (true);
