import type {
  AuthorSlug,
  DeliberationMode,
  Question,
  QuestionKind,
  RoutingDecision,
} from "../protocol/types.js";
import { selectMode } from "../modes/select.js";

/**
 * Question-taxonomy router.
 * Maps question kind to preferred author subset. Deterministic.
 * Picks top-K (default 5) that exist in the current roster.
 */
export const QUESTION_TAXONOMY: Record<QuestionKind, AuthorSlug[]> = {
  "magic-system": ["sanderson", "le-guin", "weeks", "herbert", "rothfuss"],
  plot: ["erikson", "paolini", "sanderson", "schwartz", "brown"],
  prose: ["le-guin", "gaiman", "rothfuss", "mccarthy", "erikson"],
  chapter: ["le-guin", "gaiman", "rothfuss", "erikson", "sanderson"],
  glossary: ["tolkien", "herbert", "sanderson", "erikson", "rothfuss"],
  naming: ["tolkien", "le-guin", "rothfuss", "herbert", "gaiman"],
  worldbuilding: ["tolkien", "herbert", "erikson", "jordan", "sanderson"],
  theology: ["gaiman", "bakker", "herbert", "le-guin", "erikson"],
  progression: ["wight", "shirtaloon", "dinniman", "rowe", "weeks"],
  "style-transfer": ["le-guin", "gaiman", "rothfuss", "mccarthy", "abercrombie"],
  general: ["sanderson", "le-guin", "tolkien", "gaiman", "herbert"],
};

export interface RouteOptions {
  roster: AuthorSlug[];
  maxAuthors?: number;    // Default 5
  minAuthors?: number;    // Default 3
}

export function routeQuestion(
  question: Question,
  options: RouteOptions,
): RoutingDecision {
  const maxAuthors = options.maxAuthors ?? 5;
  const minAuthors = options.minAuthors ?? 3;

  const preferred = question.preferAuthors && question.preferAuthors.length > 0
    ? question.preferAuthors
    : QUESTION_TAXONOMY[question.kind];

  const rosterSet = new Set(options.roster);
  // First pass: preferred ∩ roster, ordered as preferred
  const picks: AuthorSlug[] = [];
  for (const a of preferred) {
    if (rosterSet.has(a) && picks.length < maxAuthors) {
      picks.push(a);
    }
  }

  // If below min, fill from the rest of the roster
  if (picks.length < minAuthors) {
    for (const a of options.roster) {
      if (picks.length >= minAuthors) break;
      if (!picks.includes(a)) picks.push(a);
    }
  }

  const mode = selectMode(question);
  const rationale = buildRationale(question, picks, mode);

  return { selectedAuthors: picks, mode, rationale };
}

function buildRationale(
  question: Question,
  authors: AuthorSlug[],
  mode: DeliberationMode,
): string {
  return `Routed ${question.kind} → [${authors.join(", ")}] in ${mode} mode. ${MODE_RATIONALE[mode]}`;
}

const MODE_RATIONALE: Record<DeliberationMode, string> = {
  parallel: "Clean independent reads — no cross-contamination until synthesis.",
  adversarial: "Structural disagreement among authors is expected; resolution is forced.",
  sequential: "Stages build on each other; earlier critiques become context for later.",
  convergence: "Long-form content split across authors; threads collapse in synthesis.",
};
