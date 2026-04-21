import type { AuthorAgent, Question, CanonContext } from "./types.js";

/**
 * Build the LLM system prompt that channels a specific author voice.
 * Used by the council runtime (slash command or MCP host) to produce structured critiques.
 */
export function buildAuthorPrompt(
  author: AuthorAgent,
  question: Question,
  canon?: CanonContext,
): string {
  const systemsBlock = author.systems
    .map(
      (s) =>
        `- ${s.name} (${s.kind}):\n  Laws: ${s.laws.join("; ")}\n  Costs: ${s.costs.join("; ")}\n  Limits: ${s.limits.join("; ")}`,
    )
    .join("\n");

  const glossaryBlock = Object.entries(author.glossary)
    .slice(0, 20)
    .map(([term, def]) => `- ${term}: ${def}`)
    .join("\n");

  const canonBlock = canon
    ? `\n\n## CANON BINDING (non-negotiable)\n${canon.summary}\n\n**Forbidden:** ${(canon.forbidden ?? []).join(", ") || "none specified"}`
    : "";

  const voice = author.voice;
  const voiceBlock = `Sentence length: ${voice.sentenceLength.min}–${voice.sentenceLength.max} (median ${voice.sentenceLength.median}). Clause density: ${voice.clauseDensity}. Pacing: ${voice.pacing}. Vocabulary: ${voice.vocabularyTier}. POV preference: ${voice.pov.join(", ")}. Signature moves: ${voice.signatureMoves.join("; ")}.`;

  return `You are channeling the craft sensibility of ${author.slug.toUpperCase()} on the Author Council.

## SEAT
Role: ${author.role}

## SOUL — voice fingerprint, obsessions, craft axioms
${author.soul}

## CRAFT RULES — explicit, mined from public essays/interviews/lectures
${author.craft}

## PATTERNS — structural patterns you apply to stories you read
${author.patterns}

## YOUR FORMALIZED SYSTEMS
${systemsBlock || "(none)"}

## YOUR COINED TERMS / GLOSSARY
${glossaryBlock || "(none)"}

## YOUR VOICE SIGNATURE
${voiceBlock}

## SOURCE DISCIPLINE
${author.sources}${canonBlock}

---

## TASK
You are auditing a ${question.kind}. Produce a structured critique in the author's sensibility. You MUST cite your own craft material for every non-trivial claim (tier 1 = essay/interview, tier 2 = structural pattern from work, tier 3 = fan canon, tier 4 = inference).

Do NOT pastiche prose. Critique as an author, not an impersonator.

${question.context ? `### Context\n${question.context}\n` : ""}
### Content under critique
${question.content}

## OUTPUT — STRICT JSON
{
  "author": "${author.slug}",
  "role": "${author.role}",
  "strengths": ["..."],
  "concerns": ["..."],
  "recommendations": [
    {
      "action": "add|remove|rewrite|restructure|clarify|constrain",
      "target": "where in the content",
      "proposal": "what to do",
      "rationale": "why, tied to your craft axioms"
    }
  ],
  "citations": [
    { "source": "...", "claim": "...", "tier": 1 }
  ],
  "confidence": 0.0
}
`;
}
