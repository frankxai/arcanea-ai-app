import { createRuntimeIdentifier } from "../runtime-identifiers.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  generateCharacter,
  generateMagicAbility,
  generateLocation,
  generateCreature,
  generateArtifact,
  generateName,
  generateStoryPrompt,
} from "../tools/generators.js";
import { recordCreation } from "../memory/index.js";
import { addCreationToGraph } from "../tools/creation-graph.js";
import { toolResult } from "./tool-result.js";

const ELEMENTS = ["Fire", "Water", "Earth", "Wind", "Void", "Spirit"] as const;

const HOUSES = [
  "Lumina",
  "Nero",
  "Pyros",
  "Aqualis",
  "Terra",
  "Ventus",
  "Synthesis",
] as const;

export function registerGeneratorTools(server: McpServer) {
  // =========================================================================
  // WORLDBUILDING GENERATORS
  // =========================================================================

  server.registerTool(
    "generate_character",
    {
      description:
        "Create a character for the Arcanea universe with Gates, Elements, House, and backstory",
      inputSchema: {
        archetype: z.string().optional(),
        primaryElement: z.enum(ELEMENTS).optional(),
        gatesOpen: z.number().int().min(1).max(10).optional(),
        house: z.enum(HOUSES).optional(),
        nameGender: z.enum(["masculine", "feminine", "neutral"]).optional(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const result = await generateCharacter(args as any);
      const parsed = JSON.parse(result.content[0].text);
      const creation = {
        id: createRuntimeIdentifier("creation"),
        type: "character" as const,
        name: parsed.name,
        element: parsed.primaryElement,
        gate: parsed.gatesOpen,
        createdAt: new Date(),
        summary: `${parsed.rank} of ${parsed.house}`,
      };
      recordCreation(sessionId, creation);
      addCreationToGraph(sessionId, creation, parsed);
      return toolResult(result);
    },
  );

  server.registerTool(
    "generate_magic",
    {
      description: "Design a magical ability based on the Arcanea magic system",
      inputSchema: {
        element: z.enum(ELEMENTS),
        gateLevel: z.number().int().min(1).max(10),
        purpose: z.string().optional(),
      },
    },
    async (args) => toolResult(await generateMagicAbility(args as any)),
  );

  server.registerTool(
    "generate_location",
    {
      description: "Create a location in Arcanea with elemental alignment",
      inputSchema: {
        type: z.string().optional(),
        dominantElement: z.enum(ELEMENTS).optional(),
        alignment: z.enum(["light", "dark", "balanced"]).optional(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const result = await generateLocation(args as any);
      const parsed = JSON.parse(result.content[0].text);
      const creation = {
        id: createRuntimeIdentifier("creation"),
        type: "location" as const,
        name: parsed.name,
        element: parsed.dominantElement,
        createdAt: new Date(),
        summary: parsed.type,
      };
      recordCreation(sessionId, creation);
      addCreationToGraph(sessionId, creation, parsed);
      return toolResult(result);
    },
  );

  server.registerTool(
    "generate_creature",
    {
      description: "Design a magical creature for the Arcanea world",
      inputSchema: {
        element: z.enum(ELEMENTS).optional(),
        size: z
          .enum(["tiny", "small", "medium", "large", "massive"])
          .optional(),
        temperament: z
          .enum(["hostile", "neutral", "friendly", "sacred"])
          .optional(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const result = await generateCreature(args as any);
      const parsed = JSON.parse(result.content[0].text);
      const creation = {
        id: createRuntimeIdentifier("creation"),
        type: "creature" as const,
        name: parsed.name,
        element: parsed.element,
        createdAt: new Date(),
        summary: parsed.species,
      };
      recordCreation(sessionId, creation);
      addCreationToGraph(sessionId, creation, parsed);
      return toolResult(result);
    },
  );

  server.registerTool(
    "generate_artifact",
    {
      description: "Create a magical artifact with history and powers",
      inputSchema: {
        type: z.string().optional(),
        element: z.enum(ELEMENTS).optional(),
        power: z.enum(["minor", "moderate", "major", "legendary"]).optional(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const result = await generateArtifact(args as any);
      const parsed = JSON.parse(result.content[0].text);
      const creation = {
        id: createRuntimeIdentifier("creation"),
        type: "artifact" as const,
        name: parsed.name,
        element: parsed.element,
        createdAt: new Date(),
        summary: parsed.type,
      };
      recordCreation(sessionId, creation);
      addCreationToGraph(sessionId, creation, parsed);
      return toolResult(result);
    },
  );

  server.registerTool(
    "generate_name",
    {
      description: "Generate Arcanean names following the language system",
      inputSchema: {
        element: z.string().optional(),
        gender: z.enum(["masculine", "feminine", "neutral"]).optional(),
        type: z.enum(["character", "place", "artifact", "creature"]).optional(),
        count: z.number().min(1).max(20).optional(),
      },
    },
    async (args) => toolResult(await generateName(args as any)),
  );

  server.registerTool(
    "generate_story_prompt",
    {
      description: "Create an inspiring story prompt set in Arcanea",
      inputSchema: {
        theme: z.string().optional(),
        gate: z.number().int().min(1).max(10).optional(),
        includeConflict: z.boolean().optional(),
      },
    },
    async (args) => toolResult(await generateStoryPrompt(args as any)),
  );
}
