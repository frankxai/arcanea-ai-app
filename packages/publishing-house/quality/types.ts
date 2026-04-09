/**
 * Arcanea Publishing House — TASTE Quality Gate Types
 *
 * Types for the 5D scoring system:
 * T = Technical Fit
 * A = Aesthetic/Design Compliance
 * S = Story/Canon Alignment
 * T = Transformative/Emotional Impact
 * E = Experiential Uniqueness
 */

// ---------------------------------------------------------------------------
// Input Types
// ---------------------------------------------------------------------------

export interface ContentMeta {
  title: string;
  author: string;
  collection?: string;
  language: string;
  wordCount?: number;
}

export interface WorldContext {
  characters: string[];
  factions: string[];
  locations: string[];
  timeline?: string;
}

export interface AssetRef {
  path: string;
  type: 'cover' | 'illustration' | 'banner';
  dimensions?: { w: number; h: number };
}

export interface ScoreInput {
  content: string;
  metadata: ContentMeta;
  assets?: AssetRef[];
  worldContext?: WorldContext;
}

// ---------------------------------------------------------------------------
// Dimension Scores
// ---------------------------------------------------------------------------

export interface TechnicalScore {
  score: number;
  headingHierarchyValid: boolean;
  wordCount: number;
  readabilityGrade: number;
  brokenLinks: string[];
  feedback: string[];
}

export interface DesignScore {
  score: number;
  missingAltText: string[];
  undersizedAssets: string[];
  feedback: string[];
}

export interface CanonScore {
  score: number;
  unknownCharacters: string[];
  unknownFactions: string[];
  unknownLocations: string[];
  feedback: string[];
}

export interface ImpactScore {
  score: number;
  hookStrength: number;
  pacingVariance: number;
  dialoguePresence: boolean;
  sensoryDensity: number;
  feedback: string[];
}

export interface UniquenessScore {
  score: number;
  slopPatternsFound: SlopMatch[];
  typeTokenRatio: number;
  clicheDensity: number;
  feedback: string[];
}

export interface SlopMatch {
  pattern: string;
  count: number;
  category: 'metaphor' | 'filler' | 'corporate' | 'ai-identity' | 'transition';
}

// ---------------------------------------------------------------------------
// Result Types
// ---------------------------------------------------------------------------

export type TasteTier = 'hero' | 'gallery' | 'thumbnail' | 'reject';

export interface TasteResult {
  technical: number;
  aesthetic: number;
  canon: number;
  impact: number;
  uniqueness: number;
  total: number;
  tier: TasteTier;
  feedback: string[];
  passesGate: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const TIER_THRESHOLDS = {
  hero: 80,
  gallery: 60,
  thumbnail: 40,
} as const;

export const GATE_PASS_THRESHOLD = 60;
