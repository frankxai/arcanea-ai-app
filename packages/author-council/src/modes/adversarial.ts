import type { AuthorAgent, Critique, Question } from "../protocol/types.js";
import type { ModeContext } from "./parallel.js";

/**
 * Adversarial mode — pair authors who disagree structurally and force resolution.
 * Canonical pairings encoded: Sanderson (hard-magic) ↔ Le Guin (restraint),
 * Herbert (ecology-political) ↔ Gaiman (mythic-emotional),
 * Sanderson (systemic) ↔ Bakker (philosophical).
 *
 * Each author sees their opponent's first-pass critique and must respond.
 */
export async function adversarialMode(ctx: ModeContext): Promise<Critique[]> {
  const pairings = findAdversarialPairings(ctx.authors);
  const critiques: Critique[] = [];

  for (const [a, b] of pairings) {
    const firstA = await ctx.runCritique(a, ctx.question);
    const firstB = await ctx.runCritique(b, ctx.question);
    // Second pass: each author sees opponent's critique as added context
    const responseA = await ctx.runCritique(a, {
      ...ctx.question,
      context: `${ctx.question.context ?? ""}\n\n## OPPONENT CRITIQUE (${b.slug})\n${JSON.stringify(firstB)}\n\nDefend or concede on points of disagreement.`,
    });
    const responseB = await ctx.runCritique(b, {
      ...ctx.question,
      context: `${ctx.question.context ?? ""}\n\n## OPPONENT CRITIQUE (${a.slug})\n${JSON.stringify(firstA)}\n\nDefend or concede on points of disagreement.`,
    });
    critiques.push(responseA, responseB);
  }

  // Unpaired authors still critique once
  const paired = new Set(pairings.flat().map((a) => a.slug));
  for (const author of ctx.authors) {
    if (!paired.has(author.slug)) {
      critiques.push(await ctx.runCritique(author, ctx.question));
    }
  }

  return critiques;
}

const CANONICAL_PAIRS: [string, string][] = [
  ["sanderson", "le-guin"],
  ["herbert", "gaiman"],
  ["sanderson", "bakker"],
  ["tolkien", "bakker"],
  ["weeks", "le-guin"],
];

function findAdversarialPairings(authors: AuthorAgent[]): [AuthorAgent, AuthorAgent][] {
  const bySlug = new Map(authors.map((a) => [a.slug, a]));
  const used = new Set<string>();
  const pairs: [AuthorAgent, AuthorAgent][] = [];

  for (const [x, y] of CANONICAL_PAIRS) {
    if (used.has(x) || used.has(y)) continue;
    const a = bySlug.get(x);
    const b = bySlug.get(y);
    if (a && b) {
      pairs.push([a, b]);
      used.add(x);
      used.add(y);
    }
  }
  return pairs;
}
