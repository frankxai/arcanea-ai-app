-- Arcanea Media Fabric Registry
-- Canonical metadata and authorization layer for R2-backed assets.
-- Object bytes remain in R2; Supabase stores identity, ownership, provenance,
-- lifecycle, and where an asset is used.

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  brand text not null check (brand in ('arcanea', 'frankx', 'starlight')),
  owner_id uuid references auth.users(id) on delete set null,
  asset_type text not null check (asset_type ~ '^[a-z0-9_-]{1,48}$'),
  visibility text not null default 'private' check (visibility in ('private', 'unlisted', 'public')),
  lifecycle text not null default 'draft' check (lifecycle in ('draft', 'stored', 'enriched', 'review', 'published', 'archived', 'deleted')),
  original_bucket text not null,
  original_key text not null,
  content_type text not null,
  byte_size bigint not null default 0 check (byte_size >= 0),
  sha256 text check (sha256 is null or sha256 ~ '^[A-Fa-f0-9]{64}$'),
  metadata jsonb not null default '{}'::jsonb,
  rights jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create unique index if not exists media_assets_original_location_key
  on public.media_assets (original_bucket, original_key);
create index if not exists media_assets_owner_created_idx
  on public.media_assets (owner_id, created_at desc);
create index if not exists media_assets_brand_lifecycle_idx
  on public.media_assets (brand, lifecycle, created_at desc);
create index if not exists media_assets_metadata_gin_idx
  on public.media_assets using gin (metadata);

create table if not exists public.media_asset_renditions (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.media_assets(id) on delete cascade,
  kind text not null check (kind ~ '^[a-z0-9_-]{1,48}$'),
  version integer not null default 1 check (version > 0),
  bucket text not null,
  object_key text not null,
  content_type text not null,
  byte_size bigint not null default 0 check (byte_size >= 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  duration_ms integer check (duration_ms is null or duration_ms > 0),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  unique (asset_id, kind, version),
  unique (bucket, object_key)
);

create index if not exists media_asset_renditions_asset_idx
  on public.media_asset_renditions (asset_id, created_at desc);

create table if not exists public.media_asset_links (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.media_assets(id) on delete cascade,
  target_type text not null check (target_type ~ '^[a-z0-9_-]{1,48}$'),
  target_id text not null,
  placement text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (asset_id, target_type, target_id, placement)
);

create index if not exists media_asset_links_target_idx
  on public.media_asset_links (target_type, target_id, sort_order);

create table if not exists public.media_agent_reviews (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.media_assets(id) on delete cascade,
  agent_id text not null check (agent_id ~ '^[a-z0-9._:-]{1,128}$'),
  task_type text not null check (task_type ~ '^[a-z0-9_-]{1,48}$'),
  status text not null default 'proposed' check (status in ('proposed', 'approved', 'rejected', 'superseded')),
  confidence numeric(4,3) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  output jsonb not null default '{}'::jsonb,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists media_agent_reviews_asset_idx
  on public.media_agent_reviews (asset_id, status, created_at desc);

create or replace function public.media_fabric_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists media_assets_set_updated_at on public.media_assets;
create trigger media_assets_set_updated_at
before update on public.media_assets
for each row execute function public.media_fabric_set_updated_at();

alter table public.media_assets enable row level security;
alter table public.media_asset_renditions enable row level security;
alter table public.media_asset_links enable row level security;
alter table public.media_agent_reviews enable row level security;

revoke all on public.media_assets from anon;
revoke all on public.media_asset_renditions from anon;
revoke all on public.media_asset_links from anon;
revoke all on public.media_agent_reviews from anon;

grant select on public.media_assets to authenticated;
grant select on public.media_asset_renditions to authenticated;
grant select on public.media_asset_links to authenticated;
grant select on public.media_agent_reviews to authenticated;

create policy "media asset owners can read their assets"
on public.media_assets
for select
to authenticated
using (owner_id = (select auth.uid()));

create policy "media rendition owners can read their assets"
on public.media_asset_renditions
for select
to authenticated
using (
  exists (
    select 1
    from public.media_assets asset
    where asset.id = media_asset_renditions.asset_id
      and asset.owner_id = (select auth.uid())
  )
);

create policy "media link owners can read their assets"
on public.media_asset_links
for select
to authenticated
using (
  exists (
    select 1
    from public.media_assets asset
    where asset.id = media_asset_links.asset_id
      and asset.owner_id = (select auth.uid())
  )
);

create policy "media review owners can read their assets"
on public.media_agent_reviews
for select
to authenticated
using (
  exists (
    select 1
    from public.media_assets asset
    where asset.id = media_agent_reviews.asset_id
      and asset.owner_id = (select auth.uid())
  )
);

comment on table public.media_assets is
  'Canonical DAM asset registry. Object bytes live in R2, not Supabase Storage.';
comment on table public.media_asset_renditions is
  'Derived public or private media renditions for a canonical asset.';
comment on table public.media_asset_links is
  'Explicit references from assets to worlds, products, pages, scenes, and campaigns.';
comment on table public.media_agent_reviews is
  'Agentic enrichment and review proposals; publication remains policy-controlled.';
