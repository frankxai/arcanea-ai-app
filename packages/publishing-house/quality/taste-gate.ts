/**
 * TASTE 5D Quality Gate — Main Orchestrator
 *
 * Runs all 5 evaluators and returns a composite score with tier classification.
 * Fully deterministic — no API calls, works offline for the free tier.
 *
 * Dimensions (20% each):
 *   T — Technical Fit (formatting, structure, readability)
 *   A — Aesthetic/Design Compliance (visual quality, typography)
 *   S — Story/Canon Alignment (World Graph consistency)
 *   T — Transformative/Emotional Impact (depth, resonance)
 *   E — Experiential Uniqueness (originality, anti-slop)
 */

import type { ScoreInput, TasteResult, TasteTier } from './types.js';
import { GATE_PASS_THRESHOLD, TIER_THRESHOLDS } from './types.js';
import { evaluateTechnical } from './evaluators/technical.js';
import { evaluateDesign } from './evaluators/design.js';
import { evaluateCanon } from './evaluators/canon.js';
import { evaluateImpact } from './evaluators/impact.js';
import { evaluateUniqueness } from './evaluators/uniqueness.js';

// Re-export evaluators for convenience
export { evaluateTechnical } from './evaluators/technical.js';
export { evaluateDesign } from './evaluators/design.js';
export { evaluateCanon } from './evaluators/canon.js';
export { evaluateImpact } from './evaluators/impact.js';
export { evaluateUniqueness } from './evaluators/uniqueness.js';

/**
 * Determine the quality tier from a total score.
 */
function determineTier(total: number): TasteTier {
  if (total >= TIER_THRESHOLDS.hero) return 'hero';
  if (total >= TIER_THRESHOLDS.gallery) return 'gallery';
  if (total >= TIER_THRESHOLDS.thumbnail) return 'thumbnail';
  return 'reject';
}

/**
 * Run the full TASTE 5D Quality Gate.
 *
 * Returns composite score, tier classification, gate pass/fail,
 * and aggregated feedback across all 5 dimensions.
 */
export async function scoreTASTE(input: ScoreInput): Promise<TasteResult> {
  const { content, metadata, assets = [], worldContext } = input;

  // Run all 5 evaluators
  const technical = evaluateTechnical(content, metadata);
  const design = evaluateDesign(content, assets);
  const canon = worldContext
    ? evaluateCanon(content, worldContext)
    : {
        score: 70,
        unknownCharacters: [],
        unknownFactions: [],
        unknownLocations: [],
        feedback: ['No world context provided. Canon scored at baseline.'],
      };
  const impact = evaluateImpact(content);
  const uniqueness = evaluateUniqueness(content);

  // Weighted average: equal weights (20% each)
  const total = Math.round(
    (technical.score + design.score + canon.score + impact.score + uniqueness.score) / 5
  );

  const tier = determineTier(total);
  const passesGate = total >= GATE_PASS_THRESHOLD;

  // Aggregate feedback with dimension prefix for clarity
  const feedback: string[] = [];
  if (technical.feedback.length > 0) {
    feedback.push(`[Technical] ${technical.feedback.join(' ')}`);
  }
  if (design.feedback.length > 0) {
    feedback.push(`[Design] ${design.feedback.join(' ')}`);
  }
  if (canon.feedback.length > 0) {
    feedback.push(`[Canon] ${canon.feedback.join(' ')}`);
  }
  if (impact.feedback.length > 0) {
    feedback.push(`[Impact] ${impact.feedback.join(' ')}`);
  }
  if (uniqueness.feedback.length > 0) {
    feedback.push(`[Uniqueness] ${uniqueness.feedback.join(' ')}`);
  }

  return {
    technical: technical.score,
    aesthetic: design.score,
    canon: canon.score,
    impact: impact.score,
    uniqueness: uniqueness.score,
    total,
    tier,
    feedback,
    passesGate,
  };
}
