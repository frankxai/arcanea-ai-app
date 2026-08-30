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

export function executePublicMcpTool(
  tool: string,
  args: Record<string, unknown> = {},
): unknown {
  switch (tool) {
    case "generate_character":
      return generateCharacter(args as Parameters<typeof generateCharacter>[0]);
    case "generate_magic":
      return generateMagicAbility(args as Parameters<typeof generateMagicAbility>[0]);
    case "generate_location":
      return generateLocation(args as Parameters<typeof generateLocation>[0]);
    case "generate_creature":
      return generateCreature(args as Parameters<typeof generateCreature>[0]);
    case "generate_artifact":
      return generateArtifact(args as Parameters<typeof generateArtifact>[0]);
    case "generate_name":
      return generateName(args as Parameters<typeof generateName>[0]);
    case "generate_story_prompt":
      return generateStoryPrompt(args as Parameters<typeof generateStoryPrompt>[0]);
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
      return characterToImagePrompt(args as Parameters<typeof characterToImagePrompt>[0]);
    case "visualize_location":
      return locationToImagePrompt(args as Parameters<typeof locationToImagePrompt>[0]);
    case "visualize_creature":
      return creatureToImagePrompt(args as Parameters<typeof creatureToImagePrompt>[0]);
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
