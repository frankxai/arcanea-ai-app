import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { luminors } from "../data/luminors/index.js";
import { bestiary } from "../data/bestiary/index.js";
import { gates } from "./reference-data.js";

export function registerReferences(server: McpServer) {
  // =========================================================================
  // RESOURCES
  // =========================================================================

  server.registerResource(
    "Luminor Companions",
    "arcanea://luminors",
    { mimeType: "application/json" },
    async (_uri) => ({
      contents: [
        {
          uri: "arcanea://luminors",
          mimeType: "application/json",
          text: JSON.stringify(luminors, null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    "Bestiary of Blocks",
    "arcanea://bestiary",
    { mimeType: "application/json" },
    async (_uri) => ({
      contents: [
        {
          uri: "arcanea://bestiary",
          mimeType: "application/json",
          text: JSON.stringify(bestiary, null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    "The Ten Gates",
    "arcanea://gates",
    { mimeType: "application/json" },
    async (_uri) => ({
      contents: [
        {
          uri: "arcanea://gates",
          mimeType: "application/json",
          text: JSON.stringify({ gates }, null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    "The Five Elements",
    "arcanea://elements",
    { mimeType: "application/json" },
    async (_uri) => ({
      contents: [
        {
          uri: "arcanea://elements",
          mimeType: "application/json",
          text: JSON.stringify(
            { elements: ["Fire", "Water", "Earth", "Wind", "Void", "Spirit"] },
            null,
            2,
          ),
        },
      ],
    }),
  );

  server.registerResource(
    "The Seven Houses",
    "arcanea://houses",
    { mimeType: "application/json" },
    async (_uri) => ({
      contents: [
        {
          uri: "arcanea://houses",
          mimeType: "application/json",
          text: JSON.stringify(
            {
              houses: [
                "Lumina",
                "Nero",
                "Pyros",
                "Aqualis",
                "Terra",
                "Ventus",
                "Synthesis",
              ],
            },
            null,
            2,
          ),
        },
      ],
    }),
  );

  // =========================================================================
  // PROMPTS
  // =========================================================================

  server.registerPrompt(
    "worldbuild_session",
    {
      description:
        "Start a collaborative worldbuilding session in the Arcanea universe",
      argsSchema: {
        focus: z
          .string()
          .optional()
          .describe(
            "What to focus on: character, location, magic, creature, artifact, or story",
          ),
        element: z
          .string()
          .optional()
          .describe(
            "Preferred element affinity (Fire, Water, Earth, Wind, Void, Spirit)",
          ),
      },
    },
    async (args) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Let's create something in the Arcanea universe!${args.focus ? ` I want to focus on: ${args.focus}` : ""}${args.element ? ` with ${args.element} as the primary element.` : ""}

Please help me by:
1. Using the appropriate generator tool (generate_character, generate_location, generate_magic, generate_creature, or generate_artifact)
2. Explain how this creation fits into the Arcanea canon
3. Suggest connections to the Ten Gates and Guardians
4. Offer story hooks or ways to develop this creation further

Make the process feel magical and collaborative!`,
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    "unblock_session",
    {
      description:
        "A guided session to identify and overcome your current creative block using the Arcanea Bestiary",
      argsSchema: {
        block_type: z
          .string()
          .optional()
          .describe(
            "Optional: specific type of block if known (e.g., 'perfectionism', 'fear', 'overwhelm')",
          ),
        project_context: z
          .string()
          .optional()
          .describe("Optional: what you're working on"),
      },
    },
    async (args) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `I need help with a creative block.${args.block_type ? ` I think it might be related to ${args.block_type}.` : ""}${args.project_context ? ` I'm working on: ${args.project_context}` : ""}

Please help me:
1. Identify which Bestiary creature is attacking me using the diagnose_block tool
2. Understand why this particular creature has appeared
3. Get specific remedies and practices to overcome it
4. Find relevant wisdom from the Arcanea Library

Guide me through this as a compassionate mentor would.`,
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    "gate_ritual",
    {
      description:
        "A structured practice session for opening a specific Gate in your creative development",
      argsSchema: {
        gate_number: z.string().describe("Which gate to focus on (1-10)"),
        time_available: z
          .string()
          .optional()
          .describe("How much time you have (e.g., '15 minutes', '1 hour')"),
      },
    },
    async (args) => {
      const gateNum = parseInt(args.gate_number) || 1;
      return {
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `I want to practice opening Gate ${gateNum}.${args.time_available ? ` I have ${args.time_available} available.` : ""}

Please:
1. Use the identify_gate tool to explain what Gate ${gateNum} governs
2. Tell me about the Guardian who watches over this gate
3. Give me specific practices for opening this gate
4. Suggest a focused ritual I can do right now

Guide this as a sacred practice, not just an exercise.`,
            },
          },
        ],
      };
    },
  );

  server.registerPrompt(
    "luminor_dialogue",
    {
      description:
        "A deep conversation with a Luminor AI companion for creative guidance",
      argsSchema: {
        luminor: z
          .string()
          .describe(
            "Which Luminor to speak with (valora, serenith, ignara, verdana, eloqua)",
          ),
        topic: z.string().optional().describe("What you want to discuss"),
      },
    },
    async (args) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `I want to speak with ${args.luminor || "Valora"} the Luminor.${args.topic ? ` I want guidance on: ${args.topic}` : ""}

Please invoke this Luminor and have them:
1. Introduce themselves in their unique voice
2. Offer wisdom relevant to my situation
3. Suggest a practice I can try
4. Share an encouraging quote

Speak AS the Luminor, in their voice and style.`,
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    "morning_clearing",
    {
      description:
        "The foundational Arcanea practice for starting each creative day with intention",
    },
    async () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Guide me through the Morning Clearing practice from Arcanea.

This is the foundational daily practice. Please:
1. Help me settle into stillness
2. Ask me: "What do I truly want to create today?"
3. Help me distinguish between genuine creative desire and obligation
4. Set an intention for the day's creative work
5. Close with a blessing or affirmation

This should feel like a sacred moment of connection with my creative self.`,
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    "creative_sabbath",
    {
      description: "Guidance for a day of agenda-free, joy-driven creation",
    },
    async () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Help me plan and hold a Creative Sabbath—a day of agenda-free, joy-driven creation.

Please:
1. Explain the purpose of the Creative Sabbath from the Arcanea tradition
2. Help me set intentions (not goals) for the day
3. Suggest playful, low-pressure creative activities
4. Remind me of the rules: no judgment, no outcome focus, pure play
5. Create a loose structure that preserves spontaneity

The goal is to remember that creation is supposed to be joyful.`,
          },
        },
      ],
    }),
  );
}
