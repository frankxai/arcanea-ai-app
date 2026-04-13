/**
 * Arcanea Publishing House — Editor Claw Types
 *
 * Aiyami (Crown Gate) — developmental, line, and proofread passes.
 * Structured feedback with severity ratings and revision priorities.
 */

import type { WorldContext } from '../../quality/types.js';

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export interface EditorInput {
  content: string;
  title: string;
  author: string;
  collection?: string;
  worldContext?: WorldContext;
  passes?: EditorPassName[];
}

export type EditorPassName = 'developmental' | 'line' | 'proofread';

// ---------------------------------------------------------------------------
// Feedback Items
// ---------------------------------------------------------------------------

export type StructuralCategory =
  | 'plot' | 'pacing' | 'character' | 'canon'
  | 'structure' | 'opening' | 'ending';

export type Severity = 'critical' | 'major' | 'minor' | 'suggestion';

export interface StructuralFeedback {
  category: StructuralCategory;
  severity: Severity;
  location: string;
  issue: string;
  suggestion: string;
}

export type LineCategory =
  | 'rhythm' | 'voice' | 'clarity' | 'redundancy'
  | 'dialogue' | 'description';

export interface LineFeedback {
  category: LineCategory;
  lineRef: string;
  issue: string;
  suggestion: string;
}

export type ProofCategory =
  | 'grammar' | 'punctuation' | 'spelling'
  | 'formatting' | 'consistency';

export interface ProofFeedback {
  category: ProofCategory;
  lineRef: string;
  issue: string;
  correction: string;
}

// ---------------------------------------------------------------------------
// Pass Result
// ---------------------------------------------------------------------------

export interface EditorialPass {
  pass: EditorPassName;
  feedbackCount: number;
  items: (StructuralFeedback | LineFeedback | ProofFeedback)[];
}

// ---------------------------------------------------------------------------
// Final Result
// ---------------------------------------------------------------------------

export interface EditorResult {
  title: string;
  wordCount: number;
  passesRun: EditorPassName[];
  developmental?: EditorialPass;
  line?: EditorialPass;
  proofread?: EditorialPass;
  tasteScore: { total: number; tier: string };
  revisionPriorities: string[];
  overallAssessment: string;
  durationMs: number;
}
