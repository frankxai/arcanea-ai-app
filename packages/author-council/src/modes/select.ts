import type { DeliberationMode, Question, QuestionKind } from "../protocol/types.js";

/**
 * Auto-select deliberation mode from question kind when none specified.
 * Heuristic, not absolute — Question.mode overrides.
 */
export function selectMode(question: Question): DeliberationMode {
  if (question.mode) return question.mode;
  return DEFAULT_MODES[question.kind];
}

const DEFAULT_MODES: Record<QuestionKind, DeliberationMode> = {
  "magic-system": "adversarial",     // Sanderson vs Le Guin always yields
  plot: "sequential",                 // Plot → prose → system
  prose: "parallel",                  // Clean independent reads
  chapter: "convergence",             // Long-form split across authors
  glossary: "parallel",
  naming: "parallel",
  worldbuilding: "sequential",
  theology: "adversarial",            // Philosophy vs divine-layer tension
  progression: "sequential",
  "style-transfer": "parallel",
  general: "parallel",
};
