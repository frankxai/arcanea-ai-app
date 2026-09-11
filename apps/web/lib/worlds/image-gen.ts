/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * World Image Generation — Gemini-powered visual creation
 *
 * Takes visualize_* output from arcanea-mcp and generates actual images
 * using Google Gemini Pro via Vercel AI SDK.
 *
 * Flow: MCP visualize_character → prompt JSON → this module → Gemini → image URL
 *
 * This is the bridge between "I have a character blueprint" and "I can see my character."
 */

// Type for visualize_* MCP tool output
export interface VisualPromptOutput {
  prompt: string;
  negativePrompt: string;
  suggestedModels: string[];
  suggestedSize: string;
  suggestedSteps: number;
  tags: string[];
}

/**
 * Generate a character portrait using Gemini
 * Called from: /api/worlds/generate-image route
 */
export async function generateCharacterPortrait(
  visualPrompt: VisualPromptOutput,
  options?: {
    style?: "realistic" | "anime" | "painterly" | "concept-art";
    aspectRatio?: "portrait" | "square" | "landscape";
  }
): Promise<{ imageUrl: string; prompt: string }> {
  const style = options?.style || "concept-art";
  const aspectRatio = options?.aspectRatio || "portrait";

  // Enhance prompt for Gemini's image generation
  const enhancedPrompt = [
    `Style: ${style}, high quality, detailed`,
    visualPrompt.prompt,
    `Aspect ratio: ${aspectRatio}`,
    `NOT: ${visualPrompt.negativePrompt}`,
  ].join(". ");

  // This will be called via the API route which has access to the AI SDK
  return {
    imageUrl: "", // Filled by API route
    prompt: enhancedPrompt,
  };
}

/**
 * Arcanean art direction system
 * Maps element + rank to observable rendering language without named imitation
 */
export const ART_DIRECTION: Record<string, {
  palette: string;
  mood: string;
  reference: string;
}> = {
  "Fire-Apprentice": {
    palette: "warm amber and soft orange, small flame accents",
    mood: "young, eager, slightly overwhelmed by their power",
    reference: "hand-painted animation warmth, rounded readable shapes, ember-lit material detail",
  },
  "Fire-Master": {
    palette: "deep crimson and molten gold, controlled flame aura",
    mood: "confident, battle-tested, quiet intensity",
    reference: "elongated editorial fantasy linework, severe value contrast, weathered ceremonial texture",
  },
  "Fire-Luminor": {
    palette: "white-hot core with prismatic flame corona",
    mood: "transcendent, beyond mortal, fire made conscious",
    reference: "ethereal ink-and-gouache fantasy plate, calligraphic silhouette, radiant negative space",
  },
  "Water-Apprentice": {
    palette: "soft teal and seafoam, water droplets in hair",
    mood: "curious, fluid, emotionally open",
    reference: "cinematic rain-lit animation, luminous water refraction, delicate atmospheric perspective",
  },
  "Water-Master": {
    palette: "deep ocean blue and silver, water armor/robes",
    mood: "serene power, tidal force under calm surface",
    reference: "disciplined kinetic water arcs, ceremonial high-fantasy portraiture, calm directional flow",
  },
  "Earth-Apprentice": {
    palette: "mossy green and warm brown, stone fragments floating",
    mood: "grounded but growing, roots breaking through",
    reference: "hand-painted ecological fantasy, tactile moss and stone, sturdy rounded forms",
  },
  "Earth-Master": {
    palette: "deep forest green and granite, crystal accents",
    mood: "immovable, ancient patience, connected to deep earth",
    reference: "monumental arboreal silhouette, mineral facets, grounded painterly mass",
  },
  "Void-Master": {
    palette: "deep purple and starfield black, reality distortion",
    mood: "unsettling calm, seeing between worlds",
    reference: "sacred geometric alien form, restrained biomechanical tension, beautiful unease",
  },
  "Spirit-Luminor": {
    palette: "pure white gold, prismatic, transcendent glow",
    mood: "beyond form, light itself has become a person",
    reference: "ornamental gold-leaf patterning, flattened luminous shapes, cosmic negative space",
  },
};

/**
 * Get art direction for a character based on element + rank
 */
export function getArtDirection(element: string, rank: string): {
  palette: string;
  mood: string;
  reference: string;
} {
  const key = `${element}-${rank}`;
  return ART_DIRECTION[key] || {
    palette: "elemental colors appropriate to the character",
    mood: "determined, growing, on a journey",
    reference: "high fantasy concept art, painterly style",
  };
}

/**
 * Build the complete Gemini prompt for character portrait generation
 */
export function buildGeminiCharacterPrompt(
  mcpBlueprint: {
    name: string;
    primaryElement: string;
    rank: string;
    house: string;
    personality?: { traits?: string[]; flaw?: string };
    godbeast?: { name: string; form: string };
  }
): string {
  const artDir = getArtDirection(mcpBlueprint.primaryElement, mcpBlueprint.rank);

  const sections = [
    `Create a stunning fantasy character portrait of ${mcpBlueprint.name}.`,
    `They are a ${mcpBlueprint.rank}-rank ${mcpBlueprint.primaryElement} mage from the ${mcpBlueprint.house} Academy.`,
    `Observable rendering language: ${artDir.reference}`,
    `Color palette: ${artDir.palette}`,
    `Emotional tone: ${artDir.mood}`,
  ];

  if (mcpBlueprint.personality?.traits) {
    sections.push(`Their expression shows: ${mcpBlueprint.personality.traits.join(", ")}`);
  }

  if (mcpBlueprint.personality?.flaw) {
    sections.push(`Subtle hint of their inner conflict: ${mcpBlueprint.personality.flaw}`);
  }

  if (mcpBlueprint.godbeast) {
    sections.push(`Their companion, ${mcpBlueprint.godbeast.name} (a ${mcpBlueprint.godbeast.form}), is faintly visible in the background.`);
  }

  sections.push(
    "Style: digital painting, concept art, fantasy portrait, high detail.",
    "Dark background with element-colored lighting.",
    "No text, no watermarks, no UI elements.",
  );

  return sections.join(" ");
}
