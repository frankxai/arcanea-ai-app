import type { ApolloAgent } from "../types/pantheon";

export class Apollo implements ApolloAgent {
  id = "apollo";
  name = "Apollo";
  role = "Revision and Editing Agent";
  description =
    "Handles line edits, grammatical polishing, and pronoun/name reconciliation audits.";

  async editProse(text: string, constraints: string[]): Promise<string> {
    let edited = text;

    for (const c of constraints) {
      if (c.toLowerCase().includes("remove wordiness")) {
        edited = edited
          .replace(/\bby the use of\b/gi, "by")
          .replace(/\bin order to\b/gi, "to")
          .replace(/\ba large number of\b/gi, "many")
          .replace(/\bat this point in time\b/gi, "now");
      }
    }

    return edited;
  }

  async auditNamesAndPronouns(
    text: string,
    registry: Record<string, string>,
  ): Promise<{ corrected: string; changes: string[] }> {
    let corrected = text;
    const changes: string[] = [];

    const oldProtagonist =
      Object.keys(registry).find((k) => registry[k] === "Ariona") || "Kael";
    const oldMera =
      Object.keys(registry).find((k) => registry[k] === "Mera") || "Mira";
    const oldEmilia =
      Object.keys(registry).find((k) => registry[k] === "Emilia") || "Emily";

    // Replace institutions
    const institutions = [
      ["Luminari Academy", "The Luminary"],
      ["Draconis Forge", "Draconian Forge"],
      ["Atlantean Depths", "Atlantis Depths"],
      ["Thal'Maris", "Talassara"],
      ["Thalassara", "Talassara"],
    ];

    for (const [oldName, newName] of institutions) {
      const regex = new RegExp(`\\b${oldName}\\b`, "g");
      if (regex.test(corrected)) {
        corrected = corrected.replace(regex, newName);
        changes.push(`Replaced institution: "${oldName}" -> "${newName}"`);
      }
    }

    // Direct character replacements
    const characterMappings = [
      [oldMera, "Mera"],
      [oldEmilia, "Emilia"],
    ];

    for (const [oldName, newName] of characterMappings) {
      const regex = new RegExp(`\\b${oldName}\\b`, "g");
      if (regex.test(corrected)) {
        corrected = corrected.replace(regex, newName);
        changes.push(`Replaced character name: "${oldName}" -> "${newName}"`);
      }
    }

    // Protagonist replacement requires pronoun shifting (he/him -> she/her)
    const protagonistRegex = new RegExp(`\\b${oldProtagonist}\\b`, "g");
    if (protagonistRegex.test(corrected)) {
      corrected = corrected.replace(protagonistRegex, "Ariona");
      changes.push(
        `Replaced protagonist name: "${oldProtagonist}" -> "Ariona"`,
      );

      const lines = corrected.split("\n");
      const updatedLines = lines.map((line) => {
        if (line.includes("Ariona")) {
          let updated = line;
          const pronounReplacements = [
            [/\bhe was\b/gi, "she was"],
            [/\bhe had\b/gi, "she had"],
            [/\bhe is\b/gi, "she is"],
            [/\bhimself\b/gi, "herself"],
            [/\bhis own\b/gi, "her own"],
            [/\bto him\b/gi, "to her"],
            [/\bfor him\b/gi, "for her"],
            [/\bwith him\b/gi, "with her"],
          ] as const;

          for (const [pattern, rep] of pronounReplacements) {
            if (pattern.test(updated)) {
              updated = updated.replace(pattern, rep);
              changes.push(
                `Aligned pronoun in context: "${pattern.source}" -> "${rep}"`,
              );
            }
          }
          return updated;
        }
        return line;
      });
      corrected = updatedLines.join("\n");
    }

    return {
      corrected,
      changes,
    };
  }
}
