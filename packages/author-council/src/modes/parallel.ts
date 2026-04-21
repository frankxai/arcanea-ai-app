import type { AuthorAgent, Critique, Question } from "../protocol/types.js";

export interface ModeContext {
  question: Question;
  authors: AuthorAgent[];
  /**
   * Critique runner provided by the host (MCP server or slash command).
   * Given an author + question, returns a structured Critique.
   */
  runCritique: (author: AuthorAgent, question: Question) => Promise<Critique>;
}

/**
 * Parallel critique — each author audits independently, no cross-contamination.
 * This is the default mode: cleanest signal, least synthesizer-bias.
 */
export async function parallelMode(ctx: ModeContext): Promise<Critique[]> {
  const results = await Promise.all(
    ctx.authors.map((a) => ctx.runCritique(a, ctx.question)),
  );
  return results;
}
