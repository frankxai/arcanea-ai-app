import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  generateWorldReport,
  generateConflict,
  weaveNarrative,
  generateQuest,
  analyzeFactions,
} from "../tools/world-intelligence.js";

export function registerWorldIntelligenceTools(server: McpServer) {
  // =========================================================================
  // WORLD INTELLIGENCE — The Brain of Arcanea
  // =========================================================================

  server.registerTool(
    "world_report",
    {
      description:
        "Deep analysis of your world's health, gaps, and next steps. Tells you what to build next and why. The most important tool in the system — use it after every few creations.",
      inputSchema: z.object({
        sessionId: z.string().optional().describe("Session to analyze"),
      }),
    },
    async ({ sessionId }) => {
      const sid = sessionId || "default";
      const report = generateWorldReport(sid);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                ...report,
                message: `World Health: ${report.health}/100 (${report.grade}). ${report.gaps.length} gaps found. ${report.nextActions.length} recommended actions.`,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "generate_conflict",
    {
      description:
        "Analyze your characters and generate a morally complex conflict with stakes, escalation, and multiple possible resolutions. Creates real narrative tension, not generic 'good vs evil'.",
      inputSchema: z.object({
        sessionId: z
          .string()
          .optional()
          .describe("Session with characters to analyze"),
      }),
    },
    async ({ sessionId }) => {
      const sid = sessionId || "default";
      const conflict = generateConflict(sid);
      if (!conflict) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error:
                  "Need at least 2 characters to generate conflict. Create some characters first.",
                suggestion:
                  "Use generate_character to create 2-3 characters with different elements.",
              }),
            },
          ],
        };
      }
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(conflict, null, 2) },
        ],
      };
    },
  );

  server.registerTool(
    "weave_narrative",
    {
      description:
        "Generate a complete multi-act story arc from your existing world state. Analyzes your characters, locations, and artifacts to create a plot with acts, stakes, themes, and key events.",
      inputSchema: z.object({
        sessionId: z
          .string()
          .optional()
          .describe("Session with world to narrate"),
      }),
    },
    async ({ sessionId }) => {
      const sid = sessionId || "default";
      const arc = weaveNarrative(sid);
      if (!arc) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error:
                  "Need at least 2 characters to weave a narrative. Build your cast first.",
                suggestion:
                  "Create a protagonist and an antagonist, then call weave_narrative again.",
              }),
            },
          ],
        };
      }
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(arc, null, 2) },
        ],
      };
    },
  );

  server.registerTool(
    "generate_quest",
    {
      description:
        "Generate a quest from your world state — hooks, objectives, complications, and rewards based on your existing characters, locations, and artifacts.",
      inputSchema: z.object({ sessionId: z.string().optional() }),
    },
    async ({ sessionId }) => {
      const sid = sessionId || "default";
      const quest = generateQuest(sid);
      if (!quest)
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: "Need at least 2 creations to generate a quest.",
              }),
            },
          ],
        };
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(quest, null, 2) },
        ],
      };
    },
  );

  server.registerTool(
    "analyze_factions",
    {
      description:
        "Analyze faction dynamics in your world — groups by element, power balance, tensions, and predictions for conflict or stability.",
      inputSchema: z.object({ sessionId: z.string().optional() }),
    },
    async ({ sessionId }) => {
      const sid = sessionId || "default";
      const report = analyzeFactions(sid);
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(report, null, 2) },
        ],
      };
    },
  );
}
