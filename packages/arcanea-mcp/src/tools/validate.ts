// Canon Validation Tool

interface ValidationIssue {
  type: "error" | "warning";
  message: string;
  suggestion?: string;
  evidence?: { start: number; end: number };
}

const canonicalNames = {
  guardians: ["Lyssandria", "Leyla", "Draconia", "Maylinn", "Alera", "Lyria", "Aiyami", "Elara", "Ino", "Shinkami"],
  godbeasts: ["Kaelith", "Veloura", "Draconis", "Laeylinn", "Otome", "Yumiko", "Sol", "Vaelith", "Kyuro"],
  elements: ["Fire", "Water", "Earth", "Wind", "Void", "Spirit"],
  houses: ["Lumina", "Nero", "Pyros", "Aqualis", "Terra", "Ventus", "Synthesis"],
};

const incorrectTerms: Record<string, string> = {
  "light element": "Fire's creation aspect (Light is not a separate element)",
  "shadow element": "Corrupted Void (Shadow is Void without Spirit)",
  "darkness is evil": "Nero is NOT evil - Shadow is the Dark Lord's perversion of Void",
  "dark side": "Consider using 'Shadow' or 'Corrupted Void' for evil aspects",
};

const guardianGateMap: Record<string, number> = {
  lyssandria: 1, leyla: 2, draconia: 3, maylinn: 4, alera: 5,
  lyria: 6, aiyami: 7, elara: 8, ino: 9, shinkami: 10,
};

export async function validateCanon(
  content: string,
  contentType?: string,
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const issues: ValidationIssue[] = [];
  const suggestions: string[] = [];
  const lowerContent = content.toLowerCase();
  let checkedAssociations = 0;

  // Check for incorrect terms
  for (const [incorrect, correct] of Object.entries(incorrectTerms)) {
    if (lowerContent.includes(incorrect)) {
      issues.push({
        type: "warning",
        message: `Found potentially incorrect term: "${incorrect}"`,
        suggestion: correct,
      });
    }
  }

  // Only screen explicit positive declarations. Co-occurrence with a villain,
  // visits to another Gate and negated statements do not assert these roles.
  const neroDeclaration =
    /\bnero\b\s+(?:is|was|became)\s+(?:(?:an?|the)\s+)?(?:evil|villain)\b/gi;
  for (const match of content.matchAll(neroDeclaration)) {
    const start = match.index ?? 0;
    issues.push({
      type: "error",
      message:
        "The explicit Nero declaration conflicts with the configured balance rule",
      suggestion:
        "Nero is the Primordial Darkness, necessary and balanced. Review the declaration in context.",
      evidence: { start, end: start + match[0].length },
    });
  }

  const guardianNames = Object.keys(guardianGateMap).join("|");
  const forward = new RegExp(
    `\\b(${guardianNames})\\b(?:\\s*,\\s*|\\s+)(?:(?:is|was|serves\\s+as)\\s+)?(?:the\\s+)?guardian\\s+of\\s+(?:the\\s+)?(?:gate\\s+(\\d{1,3})\\b|(\\d{1,3})(?:st|nd|rd|th)\\s+gate\\b)`,
    "gi",
  );
  const reverse = new RegExp(
    `\\bgate\\s+(\\d{1,3})\\b\\s+(?:(?:is|was)\\s+)?guarded\\s+by\\s+(${guardianNames})\\b`,
    "gi",
  );
  const checkAssociation = (
    guardian: string,
    observed: number,
    match: RegExpMatchArray,
  ) => {
    checkedAssociations += 1;
    const expected = guardianGateMap[guardian.toLowerCase()];
    if (observed !== expected) {
      const start = match.index ?? 0;
      issues.push({
        type: "error",
        message: `${guardian.charAt(0).toUpperCase() + guardian.slice(1).toLowerCase()} declaration assigns Gate ${observed}; the configured association is Gate ${expected}`,
        evidence: { start, end: start + match[0].length },
      });
    }
  };
  for (const match of content.matchAll(forward)) {
    checkAssociation(match[1], Number(match[2] ?? match[3]), match);
  }
  for (const match of content.matchAll(reverse)) {
    checkAssociation(match[2], Number(match[1]), match);
  }

  // Content-type specific suggestions
  if (contentType === "story") {
    suggestions.push(
      "Use 'the Song' or 'the Arcane' for formal magic references",
      "Show magic through effect, not technical description",
      "Reference the Arc for cycles of creation and destruction",
    );
  } else if (contentType === "character") {
    suggestions.push(
      "Check that any Guardian/Godbeast names are spelled correctly",
      "Ensure elemental affiliations are from the Five Elements",
      "Verify magic rank matches Gates opened (0-2: Apprentice, 3-4: Mage, etc.)",
    );
  }

  const isValid = issues.filter((i) => i.type === "error").length === 0;

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            valid: isValid,
            issueCount: issues.length,
            issues,
            suggestions,
            checkedAssociations,
            validationScope:
              "configured-term-and-explicit-association-heuristics",
            canonApproval: false,
            humanReviewRequired: true,
            summary: isValid
              ? "No configured screening errors found. Human canon review remains required."
              : `Found ${issues.filter((i) => i.type === "error").length} configured screening errors. Review the evidence spans in context.`,
          },
          null,
          2,
        ),
      },
    ],
  };
}
