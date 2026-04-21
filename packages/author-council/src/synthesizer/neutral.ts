import type {
  Critique,
  Disagreement,
  Recommendation,
  Synthesis,
  DeliberationMode,
  AuthorSlug,
} from "../protocol/types.js";

const MAX_AUTHOR_MASS = 0.25; // No single author exceeds 25% of synthesis mass

export interface SynthesisOptions {
  /** Synthesizer persona: "neutral" for generic councils, "lumina" for Arcanea instance. */
  persona: "neutral" | "lumina" | string;
  /** Cap any single author's share (default 0.25). */
  maxAuthorMass?: number;
  /** Require at least one dissent logged (anti-groupthink guardrail). */
  requireDissent?: boolean;
}

/**
 * Deterministic synthesis — collapses critiques into a single structured Synthesis.
 * Preserves genuine disagreements rather than flattening them.
 *
 * For LLM-driven synthesis use `buildSynthesizerPrompt` instead and post-process.
 */
export function synthesize(
  critiques: Critique[],
  mode: DeliberationMode,
  options: SynthesisOptions,
): Synthesis {
  if (critiques.length === 0) {
    throw new Error("Cannot synthesize 0 critiques");
  }

  const maxMass = options.maxAuthorMass ?? MAX_AUTHOR_MASS;

  // 1. Extract agreements — recommendations where ≥2 authors converge on the same target+action
  const agreements = extractAgreements(critiques);

  // 2. Extract disagreements — contradictory recommendations on same target
  const disagreements = extractDisagreements(critiques);

  if (options.requireDissent && disagreements.length === 0 && critiques.length >= 3) {
    // Synthesizer must ALWAYS surface at least one tension when 3+ authors present
    // to prevent the council from becoming an echo chamber.
    disagreements.push({
      topic: "UNCHALLENGED ASSUMPTION",
      positions: critiques.slice(0, 2).map((c) => ({
        author: c.author,
        stance: "agreed without stated reservation",
      })),
      resolution:
        "No dissent logged — synthesizer flags this as suspicious. Re-run in adversarial mode to verify.",
    });
  }

  // 3. Author weights — proportional to (confidence × recommendation count), capped
  const rawWeights: Record<AuthorSlug, number> = {};
  for (const c of critiques) {
    rawWeights[c.author] = c.confidence * Math.max(1, c.recommendations.length);
  }
  const weights = normalizeAndCap(rawWeights, maxMass);

  // 4. Merge recommendations, deduped by (target, action), ordered by combined author weight
  const recommendations = mergeRecommendations(critiques, weights);

  // 5. Overall confidence — harmonic mean (penalizes low-confidence critiques)
  const confidence = harmonicMean(critiques.map((c) => c.confidence));

  return {
    mode,
    agreements,
    disagreements,
    recommendations,
    authorWeights: weights,
    confidence,
    closingNote: buildClosingNote(options.persona, critiques, disagreements),
  };
}

function extractAgreements(critiques: Critique[]): string[] {
  const byKey = new Map<string, { count: number; rec: Recommendation }>();
  for (const c of critiques) {
    for (const r of c.recommendations) {
      const key = `${r.target}::${r.action}`;
      const existing = byKey.get(key);
      if (existing) {
        existing.count++;
      } else {
        byKey.set(key, { count: 1, rec: r });
      }
    }
  }
  const agreements: string[] = [];
  for (const { count, rec } of byKey.values()) {
    if (count >= 2) {
      agreements.push(`${rec.action} @ ${rec.target}: ${rec.proposal}`);
    }
  }
  return agreements;
}

function extractDisagreements(critiques: Critique[]): Disagreement[] {
  // Same target, contradictory actions (e.g. "add" vs "remove", "constrain" vs "rewrite")
  const byTarget = new Map<string, { author: AuthorSlug; rec: Recommendation }[]>();
  for (const c of critiques) {
    for (const r of c.recommendations) {
      const entry = byTarget.get(r.target) ?? [];
      entry.push({ author: c.author, rec: r });
      byTarget.set(r.target, entry);
    }
  }
  const disagreements: Disagreement[] = [];
  for (const [target, entries] of byTarget) {
    const actions = new Set(entries.map((e) => e.rec.action));
    if (actions.size >= 2 && entries.length >= 2 && isContradictory(actions)) {
      disagreements.push({
        topic: target,
        positions: entries.map((e) => ({ author: e.author, stance: `${e.rec.action}: ${e.rec.proposal}` })),
        resolution: "Tension preserved — no synthesizer override. Author-divergence is signal, not noise.",
      });
    }
  }
  return disagreements;
}

const CONTRADICTORY_PAIRS: Array<[string, string]> = [
  ["add", "remove"],
  ["constrain", "rewrite"],
  ["rewrite", "clarify"],
  ["restructure", "constrain"],
];

function isContradictory(actions: Set<string>): boolean {
  for (const [a, b] of CONTRADICTORY_PAIRS) {
    if (actions.has(a) && actions.has(b)) return true;
  }
  return false;
}

function normalizeAndCap(raw: Record<string, number>, maxMass: number): Record<string, number> {
  const total = Object.values(raw).reduce((s, v) => s + v, 0);
  if (total === 0) return raw;

  const normalized: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) normalized[k] = v / total;

  // Iterative cap-and-redistribute — cap any author > maxMass, redistribute
  // excess among uncapped authors proportionally, repeat until stable.
  const capped = new Set<string>();
  for (let pass = 0; pass < 10; pass++) {
    const over = Object.entries(normalized).filter(([k, v]) => !capped.has(k) && v > maxMass);
    if (over.length === 0) break;

    let excess = 0;
    for (const [k] of over) {
      excess += (normalized[k] ?? 0) - maxMass;
      normalized[k] = maxMass;
      capped.add(k);
    }

    const uncapped = Object.keys(normalized).filter((k) => !capped.has(k));
    if (uncapped.length === 0) break;

    const uncappedMass = uncapped.reduce((s, k) => s + (normalized[k] ?? 0), 0);
    if (uncappedMass === 0) {
      for (const k of uncapped) normalized[k] = (normalized[k] ?? 0) + excess / uncapped.length;
    } else {
      for (const k of uncapped) {
        const share = (normalized[k] ?? 0) / uncappedMass;
        normalized[k] = (normalized[k] ?? 0) + excess * share;
      }
    }
  }

  return normalized;
}

function mergeRecommendations(
  critiques: Critique[],
  weights: Record<string, number>,
): Recommendation[] {
  const scored: Array<{ rec: Recommendation; score: number }> = [];
  for (const c of critiques) {
    const weight = weights[c.author] ?? 0;
    for (const r of c.recommendations) {
      scored.push({ rec: r, score: weight * c.confidence });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  // Dedupe by (target, action)
  const seen = new Set<string>();
  const out: Recommendation[] = [];
  for (const { rec } of scored) {
    const key = `${rec.target}::${rec.action}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(rec);
  }
  return out;
}

function harmonicMean(nums: number[]): number {
  if (nums.length === 0) return 0;
  const nonZero = nums.filter((n) => n > 0);
  if (nonZero.length === 0) return 0;
  const sum = nonZero.reduce((s, n) => s + 1 / n, 0);
  return nonZero.length / sum;
}

function buildClosingNote(
  persona: string,
  critiques: Critique[],
  disagreements: Disagreement[],
): string {
  const authors = critiques.map((c) => c.author).join(", ");
  const disagreementCount = disagreements.length;
  if (persona === "lumina") {
    return `The council has spoken through ${authors}. ${disagreementCount > 0 ? `${disagreementCount} tensions preserved — these are the edges where the work lives.` : "Rare convergence. Proceed with calibrated confidence."} — Lumina`;
  }
  return `Council of ${authors}. ${disagreementCount} unresolved disagreement${disagreementCount === 1 ? "" : "s"} surfaced. Synthesis ordered by weighted recommendation priority; no author's share exceeded cap.`;
}

export const NEUTRAL_SYSTEM_PROMPT = `You are the Neutral Moderator of an Author Council.

ANTI-DOMINANCE RULES (non-negotiable):
1. No single author's critique may exceed 25% of synthesis mass.
2. Genuine disagreements MUST be surfaced, not collapsed.
3. You may not synthesize without at least one dissent logged when 3+ authors present.
4. You never favor "harder" systems or "softer" restraint — you preserve both voices.
5. You cite each author's contribution in the final synthesis.

Your job is to produce a JSON Synthesis object that:
- lists agreements where ≥2 authors converge
- lists disagreements where authors contradict on the same target
- orders recommendations by priority, capping any single author's share
- reports confidence as the harmonic mean of author confidences
- closes with a neutral note that does not take sides`;

export const LUMINA_SYSTEM_PROMPT = `You are Lumina, synthesizer of the Arcanea Author Council.

You speak in a calm, mythic register. You honor the Guardian/Luminor canon.
You still obey the anti-dominance rules — no author exceeds 25% share — but your
closing note threads the council's findings through Arcanea's Hz resonance and
the Ten Gates when the work calls for it.

You preserve tension. Disagreement is signal. You do not resolve what should remain
unresolved. Your gift is synthesis without flattening.`;

export function buildSynthesizerPrompt(
  critiques: Critique[],
  mode: DeliberationMode,
  persona: "neutral" | "lumina" | string,
): string {
  const system = persona === "lumina" ? LUMINA_SYSTEM_PROMPT : NEUTRAL_SYSTEM_PROMPT;
  return `${system}

## MODE
${mode}

## CRITIQUES
${JSON.stringify(critiques, null, 2)}

## OUTPUT — STRICT JSON SYNTHESIS OBJECT
Shape: { mode, agreements, disagreements, recommendations, authorWeights, confidence, closingNote }`;
}
