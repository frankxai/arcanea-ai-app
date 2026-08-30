export const PUBLIC_MCP_TOOLS = [
  "generate_character",
  "generate_magic",
  "generate_location",
  "generate_creature",
  "generate_artifact",
  "generate_name",
  "generate_story_prompt",
  "world_report",
  "generate_conflict",
  "weave_narrative",
  "generate_quest",
  "analyze_factions",
  "visualize_character",
  "visualize_location",
  "visualize_creature",
  "get_canon",
] as const;

export type PublicMcpToolName = (typeof PUBLIC_MCP_TOOLS)[number];

const TOOL_SET = new Set<string>(PUBLIC_MCP_TOOLS);

export function isPublicMcpTool(name: string): name is PublicMcpToolName {
  return TOOL_SET.has(name);
}

export class PublicMcpToolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicMcpToolError";
  }
}

export const PUBLIC_MCP_TOOL_DEFINITIONS = [
  {
    name: "generate_character",
    description:
      "Generate an Arcanea character with elemental affinity, house, and Ten Gates rank.",
  },
  {
    name: "generate_magic",
    description: "Design a magical ability grounded in the Ten Gates.",
  },
  {
    name: "generate_location",
    description: "Create a location with elemental alignment and atmosphere.",
  },
  {
    name: "generate_creature",
    description: "Craft a creature from sprite to godbeast scale.",
  },
  {
    name: "generate_artifact",
    description: "Forge a legendary item with history and powers.",
  },
  {
    name: "generate_name",
    description: "Generate a lore-appropriate Arcanean name.",
  },
  {
    name: "generate_story_prompt",
    description: "Return a story prompt inside the Arcanea universe.",
  },
  {
    name: "world_report",
    description: "Summarize an empty or starter world report template.",
  },
  {
    name: "generate_conflict",
    description: "Sketch a faction or character conflict seed.",
  },
  {
    name: "weave_narrative",
    description: "Weave a short narrative seed from world state.",
  },
  {
    name: "generate_quest",
    description: "Generate a quest seed.",
  },
  {
    name: "analyze_factions",
    description: "Analyze faction relationships from current world state.",
  },
  {
    name: "visualize_character",
    description: "Turn a character object into an image prompt.",
  },
  {
    name: "visualize_location",
    description: "Turn a location object into an image prompt.",
  },
  {
    name: "visualize_creature",
    description: "Turn a creature object into an image prompt.",
  },
  {
    name: "get_canon",
    description:
      "Return locked public canon lists: elements, houses, guardians, godbeasts.",
  },
].map((tool) => ({
  ...tool,
  inputSchema: {
    type: "object",
    additionalProperties: true,
    properties: {
      primaryElement: { type: "string" },
    },
  },
}));
