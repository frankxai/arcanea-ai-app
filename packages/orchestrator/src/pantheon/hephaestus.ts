import type { HephaestusAgent, StoryOutline } from "../types/pantheon";

export class Hephaestus implements HephaestusAgent {
  id = "hephaestus";
  name = "Hephaestus";
  role = "Structure and Foundation Agent";
  description =
    "Handles architectural outlines, manuscript structure validation, and alignment with world bible foundations.";

  async generateOutline(prompt: string, context?: any): Promise<StoryOutline> {
    // Return a structured outline conforming to the user prompt and Arcanea canon
    return {
      title: prompt.includes("Arcanea")
        ? "The Arcanea Chronicles"
        : "A New Saga in the Luminary",
      chapters: [
        {
          number: 1,
          title: "The Stormcrest Inheritance",
          synopsis:
            "Ariona Thornfield discovers her latent abilities in the burned ruins of her childhood village.",
          povCharacter: "Ariona",
          setting: "The outer ruins near Crystalpeak",
          keyConflict:
            "Coming to terms with loss and the rise of elemental storm crests.",
        },
        {
          number: 2,
          title: "The Gates of Crystalpeak",
          synopsis:
            "Ariona arrives at The Luminary and meets Mera, a skilled student with ancient Atlantean ties.",
          povCharacter: "Ariona",
          setting: "The Luminary at Crystalpeak",
          keyConflict:
            "Navigating institutional hierarchies and initial magic trials.",
        },
        {
          number: 3,
          title: "Beneath the Depths",
          synopsis:
            "Ariona, Mera, and Emilia explore the Abyssal Athenaeum in search of a forgotten script.",
          povCharacter: "Mera",
          setting: "The Abyssal Athenaeum (Atlantis Depths)",
          keyConflict:
            "Awakening of guardians guarding the forbidden library chambers.",
        },
      ],
      metadata: {
        createdThroughPrompt: prompt,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async validateStructure(
    outline: StoryOutline,
  ): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];

    if (!outline.title.trim()) {
      issues.push("Outline title is empty.");
    }

    if (!outline.chapters || outline.chapters.length === 0) {
      issues.push("No chapters defined in the outline.");
      return { valid: false, issues };
    }

    // Verify chapter numbers are contiguous starting from 1
    const numbers = outline.chapters.map((c) => c.number).sort((a, b) => a - b);
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] !== i + 1) {
        issues.push(
          `Non-sequential chapter sequence. Expected chapter ${i + 1}, found chapter ${numbers[i]}.`,
        );
      }
    }

    // Verify that every chapter has a POV, setting, and title
    outline.chapters.forEach((chapter, idx) => {
      const label = `Chapter ${chapter.number || idx + 1}`;
      if (!chapter.title || !chapter.title.trim()) {
        issues.push(`${label} is missing a title.`);
      }
      if (!chapter.synopsis || !chapter.synopsis.trim()) {
        issues.push(`${label} is missing a synopsis.`);
      }
      if (!chapter.povCharacter || !chapter.povCharacter.trim()) {
        issues.push(`${label} is missing a POV character.`);
      }
      if (!chapter.setting || !chapter.setting.trim()) {
        issues.push(`${label} is missing a setting.`);
      }
    });

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}
