/**
 * Arc Protocol — Type Definitions
 *
 * The creation genome format for AI-human co-creation.
 */

// ── Core Enums ───────────────────────────────────────────────────────────────

export type ArcType =
  | 'character' | 'world' | 'location' | 'creature' | 'artifact'
  | 'scene' | 'story' | 'image' | 'music' | 'video'
  | 'code' | 'agent' | 'system' | 'collection';

export type ArcStage =
  | 'potential'       // The spark — idea exists but isn't made real yet
  | 'manifestation'   // Made real — generated, written, composed
  | 'experience'      // Shared — others have seen/used/reacted
  | 'dissolution'     // Reflected on — what worked, what didn't
  | 'evolved';        // New seed — the creation spawned something new

export type Relation =
  | 'inhabits' | 'creates' | 'opposes' | 'evolves_from'
  | 'soundtrack' | 'illustrates' | 'teaches' | 'forks'
  | 'collection_of' | 'inspired_by';

export type Palette = 'forge' | 'tide' | 'root' | 'drift' | 'void';

export type NeaType = 'badge' | 'certificate' | 'collectible' | 'license';

// ── APL Block ────────────────────────────────────────────────────────────────

export interface ArcAPL {
  spark: string;
  palette?: Palette;
  palette_secondary?: Palette;
  sharpen?: string[];
}

// ── History Entry ────────────────────────────────────────────────────────────

export interface ArcHistoryEntry {
  stage: ArcStage;
  at: string;           // ISO 8601
  input?: string;       // The prompt or action
  model?: string;       // AI model used
  output?: string;      // File path or content reference
  output_hash?: string; // SHA-256 of output
  quality?: number;     // 0-100 quality score
  note?: string;        // Human note
}

// ── Bond ─────────────────────────────────────────────────────────────────────

export interface ArcBond {
  target: string;       // Target arc ID
  relation: Relation;
  note?: string;
}

// ── Agent Context ────────────────────────────────────────────────────────────

export interface ArcAgent {
  context: string;      // What any AI needs to know to continue this
  instructions?: string;
  next_step?: string;
  constraints?: string[];
}

// ── Provenance ───────────────────────────────────────────────────────────────

export interface ArcProvenance {
  models_used?: Array<{ id: string; role: string }>;
  license?: string;
  chain?: {
    network: string;
    contract?: string;
    token_id?: string;
  };
}

// ── The Arc ──────────────────────────────────────────────────────────────────

export interface Arc {
  arc: '1.0';
  id: string;
  type: ArcType;
  stage: ArcStage;
  created: string;      // ISO 8601
  updated?: string;
  creator: string;

  // APL — the creation's DNA
  apl?: ArcAPL;

  // Lifecycle history
  history?: ArcHistoryEntry[];

  // Connections to other arcs
  bonds?: ArcBond[];

  // Instructions for AI agents
  agent?: ArcAgent;

  // Who made what, with which AI
  provenance?: ArcProvenance;

  // Metadata
  tags?: string[];
  gate?: number;        // 1-10 (Arcanea gate)
  element?: string;     // fire, water, earth, wind, void

  // Markdown body (after frontmatter)
  body?: string;
}

// ── The Nea ──────────────────────────────────────────────────────────────────

export interface Nea {
  nea: '1.0';
  id: string;
  type: NeaType;
  name: string;
  description?: string;
  image?: string;

  criteria?: {
    description: string;
    arcs_required?: number;
    palette?: Palette;
    min_quality?: number;
    gate?: number;
  };

  holder?: {
    id: string;
    earned: string;     // ISO 8601
    arcs?: string[];    // Arc IDs that earned this
  };

  grants?: Array<{
    feature?: string;
    unlock?: string;
  }>;
}
