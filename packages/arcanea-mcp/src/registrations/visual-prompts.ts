import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  characterToImagePrompt,
  locationToImagePrompt,
  creatureToImagePrompt,
} from "../tools/visual-prompts.js";

export function registerVisualPromptTools(server: McpServer) {
  // =========================================================================
  // VISUAL BRIDGE — Creation → Image Prompt
  // =========================================================================

  server.registerTool(
    "visualize_character",
    {
      description:
        "Generate an image generation prompt from a character blueprint. Output is ready for ComfyUI, Midjourney, DALL-E, or Canva. Creates a visual identity for your character based on their element, rank, house, and personality.",
      inputSchema: z.object({
        name: z.string().describe("Character name"),
        primaryElement: z
          .string()
          .describe("Primary element: Fire, Water, Earth, Wind, Void, Spirit"),
        secondaryElement: z.string().optional(),
        house: z.string().describe("Academy house"),
        rank: z
          .string()
          .describe("Magic rank: Apprentice, Mage, Master, Archmage, Luminor"),
        gatesOpen: z.number().optional(),
        patronGuardian: z
          .object({ name: z.string(), domain: z.string() })
          .optional(),
        godbeast: z.object({ name: z.string(), form: z.string() }).optional(),
        traits: z.array(z.string()).optional(),
        style: z
          .string()
          .optional()
          .describe(
            "Art style override: e.g. 'anime', 'oil painting', 'watercolor'",
          ),
      }),
    },
    async (args) => {
      const result = characterToImagePrompt(
        {
          name: args.name,
          primaryElement: args.primaryElement,
          secondaryElement: args.secondaryElement,
          house: args.house,
          rank: args.rank,
          gatesOpen: args.gatesOpen || 1,
          patronGuardian: args.patronGuardian,
          godbeast: args.godbeast,
          personality: args.traits ? { traits: args.traits } : undefined,
        },
        args.style,
      );
      return { content: [{ type: "text" as const, text: result }] };
    },
  );

  server.registerTool(
    "visualize_location",
    {
      description:
        "Generate an image prompt for a location scene. Output is ready for any image generation tool.",
      inputSchema: z.object({
        name: z.string(),
        dominantElement: z.string(),
        type: z
          .string()
          .describe(
            "Location type: academy, sanctuary, ruins, village, fortress, etc.",
          ),
        alignment: z.enum(["light", "dark", "balanced"]).optional(),
        style: z.string().optional(),
      }),
    },
    async (args) => {
      const result = locationToImagePrompt(
        {
          name: args.name,
          dominantElement: args.dominantElement,
          type: args.type,
          alignment: args.alignment || "balanced",
        },
        args.style,
      );
      return { content: [{ type: "text" as const, text: result }] };
    },
  );

  server.registerTool(
    "visualize_creature",
    {
      description:
        "Generate an image prompt for a creature illustration. Output is ready for any image generation tool.",
      inputSchema: z.object({
        name: z.string(),
        element: z.string(),
        size: z
          .enum(["tiny", "small", "medium", "large", "massive"])
          .optional(),
        temperament: z
          .enum(["hostile", "neutral", "friendly", "sacred"])
          .optional(),
        species: z.string().optional(),
        style: z.string().optional(),
      }),
    },
    async (args) => {
      const result = creatureToImagePrompt(
        {
          name: args.name,
          element: args.element,
          size: args.size || "medium",
          temperament: args.temperament || "neutral",
          species: args.species,
        },
        args.style,
      );
      return { content: [{ type: "text" as const, text: result }] };
    },
  );
}
