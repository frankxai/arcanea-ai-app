/**
 * Author Council Protocol — Core Types
 *
 * Protocol is MIT. Rosters may be MIT or proprietary.
 * The Arcanea instance is deliberately non-pluggable — that's the moat.
 */

/** Unique slug for an author agent, e.g. "sanderson", "le-guin", "schwartz". */
export type AuthorSlug = string;

/** Where an author voice sits in council topology. */
export type AuthorRole =
  | "systems"
  | "language-myth"
  | "ethics-restraint"
  | "prescience-ecology"
  | "philosophy"
  | "convergence-scale"
  | "divine-layer"
  | "heroic"
  | "mythic-political"
  | "mechanics"
  | "naming-prose"
  | "grimdark-voice"
  | "progression"
  | "operatic-revolution";

/** Deliberation mode determines how critiques combine into synthesis. */
export type DeliberationMode =
  | "parallel"       // Each author audits independently, then synthesis
  | "adversarial"    // Paired authors who disagree structurally, forced resolution
  | "sequential"     // Pipeline: each author owns a stage (plot → prose → system → theology)
  | "convergence";   // Independent threads collapse to one synthesis (Malazan model)

/** What is being critiqued. */
export type QuestionKind =
  | "magic-system"
  | "plot"
  | "prose"
  | "chapter"
  | "glossary"
  | "naming"
  | "worldbuilding"
  | "theology"
  | "progression"
  | "style-transfer"
  | "general";

/** The input to a council session. */
export interface Question {
  kind: QuestionKind;
  /** Target content — draft, premise, passage, system sketch. */
  content: string;
  /** Optional context the council should read first. */
  context?: string;
  /** Optional preferred authors (otherwise router selects). */
  preferAuthors?: AuthorSlug[];
  /** Optional deliberation mode (router decides if unspecified). */
  mode?: DeliberationMode;
  /** Optional canon constraints for locked instances like Arcanea. */
  canon?: CanonContext;
}

export interface CanonContext {
  /** Named canon source, e.g. "arcanea-canon-locked". */
  name: string;
  /** Short canon summary the council must honor. */
  summary: string;
  /** Forbidden terms, anti-patterns, or stylistic no-gos. */
  forbidden?: string[];
}

/** A single author's critique — structured, not freeform. */
export interface Critique {
  author: AuthorSlug;
  role: AuthorRole;
  /** What the author praised. */
  strengths: string[];
  /** What the author would rewrite or reject. */
  concerns: string[];
  /** Concrete actionable edits — the most valuable output. */
  recommendations: Recommendation[];
  /** Quotations from the author's own craft material used to ground critique. */
  citations: Citation[];
  /** Confidence score 0-1; neutral synthesizer weights by this. */
  confidence: number;
}

export interface Recommendation {
  action: "add" | "remove" | "rewrite" | "restructure" | "clarify" | "constrain";
  target: string;        // Where in the content
  proposal: string;      // What to do
  rationale: string;     // Why, tied to author's craft axioms
}

export interface Citation {
  source: string;        // e.g. "Sanderson BYU 2020 lecture 3"
  claim: string;         // What the author asserts
  tier: 1 | 2 | 3 | 4;   // 1 = primary essay/interview, 2 = structural pattern, 3 = fan canon, 4 = inferred
}

/** The synthesizer output — preserves disagreement, does not flatten. */
export interface Synthesis {
  mode: DeliberationMode;
  /** Points where authors agreed. */
  agreements: string[];
  /** Points where authors genuinely disagreed — surfaced, not collapsed. */
  disagreements: Disagreement[];
  /** The synthesized recommendation set, ordered by priority. */
  recommendations: Recommendation[];
  /** Which authors contributed what % of synthesis mass. */
  authorWeights: Record<AuthorSlug, number>;
  /** Overall confidence 0-1. */
  confidence: number;
  /** Synthesizer's closing note. */
  closingNote: string;
}

export interface Disagreement {
  topic: string;
  positions: { author: AuthorSlug; stance: string }[];
  /** Synthesizer's resolution or explicit "preserve tension" if irreducible. */
  resolution: string;
}

/** Full council session record — for eval, replay, and audit trail. */
export interface CouncilSession {
  id: string;
  question: Question;
  roster: AuthorSlug[];
  mode: DeliberationMode;
  critiques: Critique[];
  synthesis: Synthesis;
  timestamp: string;     // ISO8601
  durationMs: number;
}

/** Roster manifest — community can publish their own. */
export interface RosterManifest {
  /** Manifest identifier. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** MIT for protocol forks, Arcanea for the locked instance. */
  license: "MIT" | "Arcanea-Locked" | string;
  /** Author slugs composing this roster. */
  authors: AuthorSlug[];
  /** Whether community can swap/add authors (false = locked instance). */
  pluggable: boolean;
  /** Default synthesizer persona. */
  synthesizer: "neutral" | "lumina" | string;
  /** Default deliberation mode. */
  defaultMode: DeliberationMode;
  /** Optional canon binding for locked instances. */
  canon?: CanonContext;
  /** Version string. */
  version: string;
  /** Short description of the council's domain focus. */
  description: string;
}

/** Author agent anatomy — loaded from authors/{slug}/ at runtime. */
export interface AuthorAgent {
  slug: AuthorSlug;
  role: AuthorRole;
  soul: string;                    // SOUL.md contents
  skills: string;                  // SKILLS.md contents
  patterns: string;                // PATTERNS.md contents
  craft: string;                   // craft.md contents
  glossary: Record<string, string>;
  systems: AuthorSystem[];
  voice: VoiceVector;
  sources: string;                 // sources.md contents — citation trail
}

export interface AuthorSystem {
  name: string;
  kind: "magic" | "political" | "technological" | "theological" | "linguistic" | "ecological";
  laws: string[];
  costs: string[];
  limits: string[];
  examples: string[];
}

/** Quantified style vector — enables blind-test voice fidelity evals. */
export interface VoiceVector {
  sentenceLength: { min: number; median: number; max: number };
  clauseDensity: "sparse" | "moderate" | "dense";
  rhetoricalDevices: {
    anaphora: number;       // Frequency per 1000 words
    chiasmus: number;
    polysyndeton: number;
    asyndeton: number;
    parallelism: number;
  };
  vocabularyTier: "plain" | "mid" | "elevated" | "archaic";
  pacing: "patient" | "measured" | "propulsive";
  pov: ("first" | "close-third" | "omniscient" | "multi-pov")[];
  dialogueRatio: "low" | "balanced" | "high";
  signatureMoves: string[];       // e.g. "interior monologue during action", "glossary in back matter"
}

/** Question-to-author routing result. */
export interface RoutingDecision {
  selectedAuthors: AuthorSlug[];
  mode: DeliberationMode;
  rationale: string;
}
