import { z } from "zod";

import {
  ELEMENTS,
  GODBEASTS,
  GUARDIANS,
  HOUSES,
  analyzeFactions,
  characterToImagePrompt,
  creatureToImagePrompt,
  generateArtifact,
  generateCharacter,
  generateConflict,
  generateCreature,
  generateLocation,
  generateMagicAbility,
  generateName,
  generateQuest,
  generateStoryPrompt,
  generateWorldReport,
  locationToImagePrompt,
  weaveNarrative,
} from "@arcanea/world-engine";

import { PublicMcpToolError } from "./public-catalog";

export {
  PUBLIC_MCP_TOOLS,
  PUBLIC_MCP_TOOL_DEFINITIONS,
  PublicMcpToolError,
  isPublicMcpTool,
  type PublicMcpToolName,
} from "./public-catalog";

// Arguments arrive from an unauthenticated HTTP caller, so every field is
// parsed before it reaches the world engine. Unknown keys are stripped and
// free text is length-capped; nothing is asserted into a domain type.

const text = (max: number) => z.string().trim().min(1).max(max);
const element = text(40);
const gateLevel = z.number().int().min(1).max(10);
const nameGender = z.enum(["masculine", "feminine", "neutral"]);

const characterOptionsSchema = z.object({
  archetype: text(60).optional(),
  primaryElement: element.optional(),
  gatesOpen: z.number().int().min(0).max(10).optional(),
  house: text(40).optional(),
  nameGender: nameGender.optional(),
});

const magicOptionsSchema = z.object({
  element,
  gateLevel,
  purpose: text(60).optional(),
});

const locationOptionsSchema = z.object({
  type: text(60).optional(),
  dominantElement: element.optional(),
  alignment: z.enum(["light", "dark", "balanced"]).optional(),
});

const creatureOptionsSchema = z.object({
  element: element.optional(),
  size: z.enum(["tiny", "small", "medium", "large", "massive"]).optional(),
  temperament: z.enum(["hostile", "neutral", "friendly", "sacred"]).optional(),
});

const artifactOptionsSchema = z.object({
  type: text(60).optional(),
  element: element.optional(),
  power: z.enum(["minor", "moderate", "major", "legendary"]).optional(),
});

const nameOptionsSchema = z.object({
  element: element.optional(),
  gender: nameGender.optional(),
  type: z.enum(["character", "place", "artifact", "creature"]).optional(),
  count: z.number().int().min(1).max(20).optional(),
});

const storyPromptOptionsSchema = z.object({
  theme: text(60).optional(),
  gate: gateLevel.optional(),
  includeConflict: z.boolean().optional(),
});

const characterBlueprintSchema = z.object({
  name: text(120),
  primaryElement: element,
  secondaryElement: element.optional(),
  house: text(40),
  rank: text(40),
  gatesOpen: z.number().int().min(0).max(10),
  patronGuardian: z
    .object({ name: text(80), domain: text(120) })
    .optional(),
  godbeast: z
    .object({ name: text(80), form: text(120), bond: text(200).optional() })
    .optional(),
  personality: z
    .object({ traits: z.array(text(60)).max(12), flaw: text(200).optional() })
    .optional(),
});

const locationBlueprintSchema = z.object({
  name: text(120),
  dominantElement: element,
  type: text(60),
  alignment: text(40),
});

const creatureBlueprintSchema = z.object({
  name: text(120),
  element,
  size: text(40),
  temperament: text(40),
  species: text(60).optional(),
});

function parseArgs<Schema extends z.ZodTypeAny>(
  tool: string,
  schema: Schema,
  args: Record<string, unknown>,
): z.infer<Schema> {
  const parsed = schema.safeParse(args);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    throw new PublicMcpToolError(`Invalid arguments for ${tool}: ${detail}`);
  }
  return parsed.data;
}

export function executePublicMcpTool(
  tool: string,
  args: Record<string, unknown> = {},
): unknown {
  switch (tool) {
    case "generate_character":
      return generateCharacter(parseArgs(tool, characterOptionsSchema, args));
    case "generate_magic":
      return generateMagicAbility(parseArgs(tool, magicOptionsSchema, args));
    case "generate_location":
      return generateLocation(parseArgs(tool, locationOptionsSchema, args));
    case "generate_creature":
      return generateCreature(parseArgs(tool, creatureOptionsSchema, args));
    case "generate_artifact":
      return generateArtifact(parseArgs(tool, artifactOptionsSchema, args));
    case "generate_name":
      return generateName(parseArgs(tool, nameOptionsSchema, args));
    case "generate_story_prompt":
      return generateStoryPrompt(parseArgs(tool, storyPromptOptionsSchema, args));
    case "world_report":
      return generateWorldReport([], []);
    case "generate_conflict":
      return generateConflict([], []);
    case "weave_narrative":
      return weaveNarrative([], []);
    case "generate_quest":
      return generateQuest([], []);
    case "analyze_factions":
      return analyzeFactions([], []);
    case "visualize_character":
      return characterToImagePrompt(
        parseArgs(tool, characterBlueprintSchema, args),
      );
    case "visualize_location":
      return locationToImagePrompt(
        parseArgs(tool, locationBlueprintSchema, args),
      );
    case "visualize_creature":
      return creatureToImagePrompt(
        parseArgs(tool, creatureBlueprintSchema, args),
      );
    case "get_canon":
      return {
        elements: ELEMENTS,
        houses: HOUSES,
        guardians: GUARDIANS,
        godbeasts: GODBEASTS,
      };
    default:
      throw new PublicMcpToolError(`Unknown tool: ${tool}`);
  }
}
