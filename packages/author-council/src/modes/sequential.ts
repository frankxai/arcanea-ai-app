import type { AuthorAgent, Critique, Question, AuthorRole } from "../protocol/types.js";
import type { ModeContext } from "./parallel.js";

/**
 * Sequential pipeline — each author owns a stage.
 * Canonical order: plot → prose → system → theology.
 * Each stage receives prior critiques as context, so later stages build on earlier.
 */
export async function sequentialMode(ctx: ModeContext): Promise<Critique[]> {
  const ordered = orderByPipelineStage(ctx.authors);
  const critiques: Critique[] = [];
  let accumulatedContext = ctx.question.context ?? "";

  for (const author of ordered) {
    const critique = await ctx.runCritique(author, {
      ...ctx.question,
      context: accumulatedContext,
    });
    critiques.push(critique);
    accumulatedContext = `${accumulatedContext}\n\n## PRIOR STAGE — ${author.slug} (${author.role})\n${JSON.stringify(critique, null, 2)}`;
  }

  return critiques;
}

/** Priority order: who critiques first in a pipeline. */
const ROLE_ORDER: AuthorRole[] = [
  "convergence-scale",   // Structure first
  "heroic",              // Plot arc
  "systems",             // Magic-system formalization
  "prescience-ecology",  // Ecological/political grounding
  "philosophy",          // Philosophical stakes
  "ethics-restraint",    // Restraint check
  "language-myth",       // Naming + constructed language
  "divine-layer",        // Theology
  "naming-prose",        // Prose polish
  "mythic-political",    // Mythic-political layer
  "mechanics",           // Mechanical polish
  "grimdark-voice",      // Voice/tone
  "progression",         // Progression pacing
  "operatic-revolution", // Operatic scale check
];

function orderByPipelineStage(authors: AuthorAgent[]): AuthorAgent[] {
  return [...authors].sort((a, b) => {
    const ai = ROLE_ORDER.indexOf(a.role);
    const bi = ROLE_ORDER.indexOf(b.role);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}
