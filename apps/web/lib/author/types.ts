/**
 * Arcanea Author OS — Core Domain Types
 * Defines data contracts for Manuscripts, Series, Chapters, Beats,
 * Character Diamonds, Lore Entities, Graph Nodes, and Multi-Agent Swarms.
 */

export type BookStatus = 'idea' | 'outlined' | 'in-progress' | 'drafted' | 'edited' | 'canon-verified' | 'complete';
export type ChapterStatus = 'idea' | 'outlined' | 'drafting' | 'review' | 'polished' | 'canon-verified';
export type GateResonance =
  | 'Foundation'
  | 'Flow'
  | 'Fire'
  | 'Heart'
  | 'Voice'
  | 'Sight'
  | 'Crown'
  | 'Starweave'
  | 'Source'
  | 'Unity';

export interface CharacterDiamond {
  id: string;
  name: string;
  aliases: string[];
  originClass:
    | 'Arcan'
    | 'Gate-Touched'
    | 'Awakened'
    | 'Synth'
    | 'Bonded'
    | 'Celestial'
    | 'Voidtouched'
    | 'Architect';
  primaryGate: GateResonance;
  desire: string; // What they consciously want
  wound: string;  // Formative psychological trauma
  mask: string;   // Persona shown to the world
  truth: string;  // What they must learn for arc resolution
  signatureDialogue?: string;
  voiceSwatch?: string;
  avatarUrl?: string;
  faction?: string;
  colorCode?: string;
}

export interface LoreEntity {
  id: string;
  name: string;
  category: 'character' | 'location' | 'faction' | 'magic-system' | 'artifact' | 'event';
  summary: string;
  gateResonance?: GateResonance;
  tags: string[];
  canonSource?: string;
}

export interface SceneBeat {
  id: string;
  title: string;
  targetWordCount: number;
  currentWordCount: number;
  povCharacter?: string;
  tensionLevel: number; // 1 to 10
  sensoryAnchor?: string;
  summary: string;
  completed: boolean;
}

export interface BeatTemplateItem {
  id: string;
  beatName: string;
  act: string;
  targetPercent: number; // 0 to 100% of book
  description: string;
  guidingQuestion: string;
  examples: string;
}

export interface NarrativeStructure {
  id: 'save-the-cat' | 'ten-gates' | 'heros-journey' | 'story-circle' | 'three-act';
  name: string;
  description: string;
  beats: BeatTemplateItem[];
}

export interface ChapterMetadata {
  id: string;
  slug: string;
  chapterNumber: number;
  title: string;
  act?: string;
  povCharacter?: string;
  setting?: string;
  timelineDate?: string;
  wordCountTarget?: number;
  wordCount: number;
  status: ChapterStatus;
  tensionRating?: number;
  keyCharacters?: string[];
  gateResonance?: GateResonance;
  sensoryAnchor?: string;
  coverImage?: string;
  beats?: SceneBeat[];
  order: number;
}

export interface BookManifest {
  slug: string;
  title: string;
  subtitle?: string;
  seriesSlug?: string;
  seriesOrder?: number;
  blurb?: string;
  coverImage?: string;
  status: BookStatus;
  tier: 'featured' | 'core' | 'community';
  tags: string[];
  totalWordTarget?: number;
  totalWords: number;
  chapterCount: number;
  chapters: ChapterMetadata[];
  structure?: NarrativeStructure['id'];
}

export interface SeriesManifest {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  gateFocus: GateResonance;
  books: Array<{
    slug: string;
    title: string;
    order: number;
    status: BookStatus;
  }>;
}

// Graph Canvas Types
export interface EntityGraphNode {
  id: string;
  type: 'character' | 'location' | 'faction' | 'beat' | 'gate';
  data: {
    label: string;
    category?: string;
    gate?: GateResonance;
    status?: string;
    avatarUrl?: string;
    diamond?: Partial<CharacterDiamond>;
    description?: string;
  };
  position: { x: number; y: number };
}

export interface EntityGraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: Record<string, any>;
  data?: {
    relationshipType: 'ally' | 'rival' | 'mentor' | 'kin' | 'loyalist' | 'adversary' | 'resonance';
    notes?: string;
  };
}

// Sensory Expansion Model
export interface SensoryBreakdown {
  sight: string[];
  sound: string[];
  smell: string[];
  touch: string[];
  taste: string[];
  atmosphere: string[];
}

// Multi-Agent Council Verdict
export interface AgentReviewVerdict {
  agentName: string;
  gate: GateResonance;
  guardian: string;
  score: number; // 1 to 10
  praise: string[];
  critique: string[];
  actionableEdits: Array<{
    originalText?: string;
    suggestedText: string;
    reason: string;
  }>;
}

export interface CouncilFullVerdict {
  timestamp: string;
  overallScore: number;
  verdicts: AgentReviewVerdict[];
  humanizerPassed: boolean;
  flaggedTells: string[];
  continuityStatus: 'passed' | 'warning' | 'conflict';
  continuityNotes: string[];
  synthesisVerdict: string;
}

// Publishing & Export Formats
export interface ExportConfig {
  format: 'kdp-pdf' | 'epub3' | 'wattpad-md' | 'royal-road-md' | 'substack-html' | 'clean-markdown';
  trimSize?: '6x9' | '5.5x8.5' | '5x8';
  includeDropCaps?: boolean;
  includeChapterArt?: boolean;
  includeCharacterRoster?: boolean;
  typographyStyle?: 'classical' | 'modern-serif' | 'arcanean-editorial';
}
