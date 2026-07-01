// Creature Atlas — TypeScript types
// Snake_case mirrors SQL columns; matches supabase/migrations/20260701000001_creature_atlas.sql

export type CreatureRightsTier =
  | "original_arcanea"    // Arcanea-native, fully owned — generate freely
  | "public_domain"       // Pre-1927 or explicitly PD
  | "licensed"            // CC-licensed fan use
  | "factual_reference"   // IP-protected — document only, no generated imagery
  | "blocked";            // IP-holder restriction — no use

export type AtlasMonsterTier = "T0" | "T1" | "T2" | "T3" | "T4";
export type AtlasCreatureScale = "tiny" | "small" | "medium" | "large" | "titan" | "world";
export type AtlasRelType = "symbiotic" | "predator" | "prey" | "rival" | "allied" | "offspring" | "ancestor";
export type PromptProvider = "grok-imagine" | "codex-gpt-image-2" | "antigravity-nb2" | "higgsfield";
export type CanonStatus = "staging" | "locked";
export type ReviewStatus = "pending" | "approved" | "rejected";

export interface AtlasUniverse {
  id: string;
  name: string;
  studio: string;
  medium: string;
  rights_tier: CreatureRightsTier;
  active_since: string;
  description: string;
  arcanea_elements: string[] | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface AtlasCreature {
  id: string;
  universe_id: string;
  name: string;
  aliases: string[] | null;
  tier: AtlasMonsterTier;
  scale: AtlasCreatureScale;
  elements: string[] | null;
  habitat: string;
  description: string;
  abilities: string[];
  significance: string;
  rights_tier: CreatureRightsTier;
  promptable: boolean;  // always false for factual_reference | blocked
  canon_sources: string[];
  created_at: string;
  updated_at: string;
}

export interface AtlasCreatureRelationship {
  id: string;
  source_id: string;
  target_id: string;
  rel_type: AtlasRelType;
  description: string | null;
  created_at: string;
}

export interface VariantAbility {
  name: string;
  description: string;
  element?: string;
}

export interface AtlasArcaneaVariant {
  id: string;
  source_creature_id: string;
  name: string;
  arcanea_tier: AtlasMonsterTier;
  elements: string[];
  gate: string | null;
  domain: string;
  description: string;
  appearance: string;
  abilities: VariantAbility[];
  material_correspondence: string | null;
  canon_status: CanonStatus;
  created_at: string;
  updated_at: string;
}

export interface AtlasPromptPack {
  id: string;
  variant_id: string;
  provider: PromptProvider;
  label: string;
  positive: string;
  negative: string;
  style: string | null;
  invocation_note: string | null;
  output_path: string | null;
  created_at: string;
}

export interface AtlasContribution {
  id: string;
  contributor_id: string | null;
  schema_version: string;
  universe_id: string | null;
  payload: unknown;
  review_status: ReviewStatus;
  curator_notes: string | null;
  github_pr_url: string | null;
  created_at: string;
  updated_at: string;
}

// Joined view used by getAtlasCreatureWithContext
export interface AtlasCreatureWithContext extends AtlasCreature {
  universe: AtlasUniverse;
  relationships: (AtlasCreatureRelationship & { target: AtlasCreature })[];
  variants: AtlasArcaneaVariant[];
}
