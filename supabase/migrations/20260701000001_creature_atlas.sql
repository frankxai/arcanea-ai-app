-- ============================================================
-- Creature Atlas — six atlas_* tables
-- Migration: 20260701000001_creature_atlas
--
-- Rights boundary rule (enforced at DB level):
--   factual_reference + blocked → promptable MUST be false
-- Atlas tables are curator-owned (no creator_id FK to users/profiles).
-- All tables are public-read; contributions require auth.
-- ============================================================

-- Helper trigger function (shared across atlas tables)
create or replace function touch_atlas_updated_at()
  returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------
-- 1. atlas_universes
-- ----------------------------------------------------------
create table if not exists atlas_universes (
  id             text primary key,             -- kebab-case slug e.g. "avatar-the-last-airbender"
  name           text not null,
  studio         text not null,
  medium         text not null,               -- animation | film | game | book | comic
  rights_tier    text not null,               -- factual_reference | public_domain | licensed | original_arcanea | blocked
  active_since   text not null,               -- ISO year string
  description    text not null,
  arcanea_elements text[],
  tags           text[] not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger atlas_universes_updated_at
  before update on atlas_universes
  for each row execute function touch_atlas_updated_at();

alter table atlas_universes enable row level security;

create policy "atlas_universes_public_read"
  on atlas_universes for select using (true);

create policy "atlas_universes_authenticated_insert"
  on atlas_universes for insert with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------
-- 2. atlas_creatures
-- ----------------------------------------------------------
create table if not exists atlas_creatures (
  id             text primary key,             -- kebab-case slug
  universe_id    text not null references atlas_universes(id) on delete cascade,
  name           text not null,
  aliases        text[],
  tier           text not null,               -- T0 | T1 | T2 | T3 | T4
  scale          text not null,               -- tiny | small | medium | large | titan | world
  elements       text[],
  habitat        text not null,
  description    text not null,
  abilities      text[] not null default '{}',
  significance   text not null,
  rights_tier    text not null,
  promptable     boolean not null default false,
  canon_sources  text[] not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  -- IP boundary: factual_reference and blocked creatures MUST NOT be promptable
  constraint atlas_creatures_rights_promptable check (
    (rights_tier in ('factual_reference', 'blocked') and promptable = false)
    or rights_tier not in ('factual_reference', 'blocked')
  )
);

create index atlas_creatures_universe_id_idx on atlas_creatures(universe_id);
create index atlas_creatures_tier_idx on atlas_creatures(tier);

create trigger atlas_creatures_updated_at
  before update on atlas_creatures
  for each row execute function touch_atlas_updated_at();

alter table atlas_creatures enable row level security;

create policy "atlas_creatures_public_read"
  on atlas_creatures for select using (true);

create policy "atlas_creatures_authenticated_insert"
  on atlas_creatures for insert with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------
-- 3. atlas_creature_relationships
-- ----------------------------------------------------------
create table if not exists atlas_creature_relationships (
  id             uuid primary key default gen_random_uuid(),
  source_id      text not null references atlas_creatures(id) on delete cascade,
  target_id      text not null references atlas_creatures(id) on delete cascade,
  rel_type       text not null,               -- symbiotic | predator | prey | rival | allied | offspring | ancestor
  description    text,
  created_at     timestamptz not null default now()
);

create index atlas_rels_source_idx on atlas_creature_relationships(source_id);
create index atlas_rels_target_idx on atlas_creature_relationships(target_id);

alter table atlas_creature_relationships enable row level security;

create policy "atlas_rels_public_read"
  on atlas_creature_relationships for select using (true);

create policy "atlas_rels_authenticated_insert"
  on atlas_creature_relationships for insert with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------
-- 4. atlas_arcanea_variants
-- ----------------------------------------------------------
create table if not exists atlas_arcanea_variants (
  id                     text primary key,    -- Arcanea-original slug, never the source creature name
  source_creature_id     text not null references atlas_creatures(id) on delete restrict,
  name                   text not null,
  arcanea_tier           text not null,       -- T0 | T1 | T2 | T3 | T4
  elements               text[] not null default '{}',
  gate                   text,                -- null if not gate-bonded
  domain                 text not null,
  description            text not null,
  appearance             text not null,
  abilities              jsonb not null default '[]',  -- [{name, description, element}]
  material_correspondence text,
  canon_status           text not null default 'staging',  -- staging | locked
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index atlas_variants_source_idx on atlas_arcanea_variants(source_creature_id);
create index atlas_variants_status_idx on atlas_arcanea_variants(canon_status);

create trigger atlas_variants_updated_at
  before update on atlas_arcanea_variants
  for each row execute function touch_atlas_updated_at();

alter table atlas_arcanea_variants enable row level security;

create policy "atlas_variants_public_read"
  on atlas_arcanea_variants for select using (true);

create policy "atlas_variants_authenticated_insert"
  on atlas_arcanea_variants for insert with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------
-- 5. atlas_prompt_packs
-- ----------------------------------------------------------
create table if not exists atlas_prompt_packs (
  id             uuid primary key default gen_random_uuid(),
  variant_id     text not null references atlas_arcanea_variants(id) on delete cascade,
  provider       text not null,               -- grok-imagine | codex-gpt-image-2 | antigravity-nb2 | higgsfield
  label          text not null,               -- hero | full-body | nft-1of1 | anatomy-sheet
  positive       text not null,
  negative       text not null,
  style          text,
  invocation_note text,
  output_path    text,                        -- suggested public/ path for the generated asset
  created_at     timestamptz not null default now()
);

create index atlas_prompts_variant_idx on atlas_prompt_packs(variant_id);

alter table atlas_prompt_packs enable row level security;

create policy "atlas_prompts_public_read"
  on atlas_prompt_packs for select using (true);

create policy "atlas_prompts_authenticated_insert"
  on atlas_prompt_packs for insert with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------
-- 6. atlas_contributions  (community World Repo contributions)
-- ----------------------------------------------------------
create table if not exists atlas_contributions (
  id              uuid primary key default gen_random_uuid(),
  contributor_id  uuid references auth.users(id) on delete set null,
  schema_version  text not null default '1.0',
  universe_id     text,                        -- slug of the universe being contributed
  payload         jsonb not null,              -- full WorldRepoContribution JSON
  review_status   text not null default 'pending',  -- pending | approved | rejected
  curator_notes   text,
  github_pr_url   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index atlas_contributions_contributor_idx on atlas_contributions(contributor_id);
create index atlas_contributions_status_idx on atlas_contributions(review_status);

create trigger atlas_contributions_updated_at
  before update on atlas_contributions
  for each row execute function touch_atlas_updated_at();

alter table atlas_contributions enable row level security;

create policy "atlas_contributions_owner_read"
  on atlas_contributions for select using (auth.uid() = contributor_id);

create policy "atlas_contributions_authenticated_insert"
  on atlas_contributions for insert with check (auth.uid() = contributor_id);
