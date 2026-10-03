import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { luminors } from "../data/luminors/index.js";
import { validateCanon } from "../tools/validate.js";
import { diagnoseBlock } from "../tools/diagnose.js";
import { conveneCouncil, luminorDebate } from "../tools/council.js";
import { deepDiagnosis } from "../tools/deep-diagnosis.js";
import {
  getOrCreateSession,
  getSessionSummary,
  recordGateExplored,
  recordLuminorConsulted,
  recordCreatureEncountered,
  checkMilestones,
} from "../memory/index.js";
import { toolResult } from "./tool-result.js";
import { gates } from "./reference-data.js";

const LUMINOR_IDS = [
  "valora",
  "serenith",
  "ignara",
  "verdana",
  "eloqua",
] as const;

export function registerGuidanceTools(server: McpServer) {
  // =========================================================================
  // CREATIVE COACHING (BASIC)
  // =========================================================================

  server.registerTool(
    "diagnose_block",
    {
      description: "Quick identification of your creative block",
      inputSchema: {
        symptoms: z.string(),
        context: z.string().optional(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const result = await diagnoseBlock(args.symptoms, args.context);
      const parsed = JSON.parse(result.content[0].text);
      if (parsed.creature?.name)
        recordCreatureEncountered(sessionId, parsed.creature.name);
      return toolResult(result);
    },
  );

  server.registerTool(
    "invoke_luminor",
    {
      description: "Call upon a single Luminor companion for guidance",
      inputSchema: {
        luminor: z.enum(LUMINOR_IDS),
        situation: z.string().optional(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const l = luminors[args.luminor.toLowerCase()];
      if (!l) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Unknown Luminor: ${args.luminor}. Available: valora, serenith, ignara, verdana, eloqua`,
            },
          ],
        };
      }
      recordLuminorConsulted(sessionId, l.name);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                luminor: l.name,
                title: l.title,
                element: l.element,
                greeting: l.personality.approach,
                bestFor: l.guidance.bestFor,
                practice:
                  l.guidance.practices[
                    Math.floor(Math.random() * l.guidance.practices.length)
                  ],
                wisdom:
                  l.guidance.quotes[
                    Math.floor(Math.random() * l.guidance.quotes.length)
                  ],
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // =========================================================================
  // CREATIVE COACHING (ADVANCED)
  // =========================================================================

  server.registerTool(
    "deep_diagnosis",
    {
      description:
        "Multi-step analysis of a complex creative block using sequential thinking",
      inputSchema: {
        symptoms: z.string(),
        context: z.string().optional(),
        history: z.string().optional(),
        depth: z.enum(["quick", "standard", "deep"]).optional(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const result = await deepDiagnosis(
        args.symptoms,
        args.context,
        args.history,
        (args.depth as "quick" | "standard" | "deep") || "standard",
      );
      const parsed = JSON.parse(result.content[0].text);
      if (parsed.primaryCreature?.name)
        recordCreatureEncountered(sessionId, parsed.primaryCreature.name);
      return toolResult(result);
    },
  );

  server.registerTool(
    "convene_council",
    {
      description: "Gather multiple Luminors for complex creative guidance",
      inputSchema: {
        lead: z.enum(LUMINOR_IDS),
        support: z.array(z.string()).optional(),
        topic: z.string(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const result = await conveneCouncil(
        args.lead,
        args.support ?? [],
        args.topic,
      );
      const parsed = JSON.parse(result.content[0].text);
      if (parsed.lead?.luminor)
        recordLuminorConsulted(sessionId, parsed.lead.luminor);
      parsed.supporting?.forEach((s: any) =>
        recordLuminorConsulted(sessionId, s.luminor),
      );
      return toolResult(result);
    },
  );

  server.registerTool(
    "luminor_debate",
    {
      description:
        "Two Luminors explore a question from different perspectives",
      inputSchema: {
        luminor1: z.enum(LUMINOR_IDS),
        luminor2: z.enum(LUMINOR_IDS),
        question: z.string(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const result = await luminorDebate(
        args.luminor1,
        args.luminor2,
        args.question,
      );
      recordLuminorConsulted(sessionId, args.luminor1);
      recordLuminorConsulted(sessionId, args.luminor2);
      return toolResult(result);
    },
  );

  // =========================================================================
  // MEMORY & JOURNEY
  // =========================================================================

  server.registerTool(
    "get_journey",
    {
      description: "Recall your creative journey, progress, and milestones",
      inputSchema: {
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const summary = getSessionSummary(sessionId);
      const session = getOrCreateSession(sessionId);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                journey: summary,
                gatesExplored: session.gatesExplored,
                luminorsConsulted: session.luminorsConsulted,
                creaturesEncountered: session.creaturesEncountered,
                creations: session.creations.slice(-10),
                preferences: session.preferences,
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
    "check_milestones",
    {
      description: "See what creative milestones you've achieved",
      inputSchema: {
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const milestones = checkMilestones(sessionId);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                achieved: milestones,
                message:
                  milestones.length > 0
                    ? `Congratulations! You've achieved ${milestones.length} milestone(s) on your creative journey.`
                    : "Keep creating! Milestones await you on the path ahead.",
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}

export function registerCanonTools(server: McpServer) {
  // =========================================================================
  // CANON & REFERENCE
  // =========================================================================

  server.registerTool(
    "validate_canon",
    {
      description: "Check content for Arcanea canon compliance",
      inputSchema: {
        content: z.string(),
        contentType: z.enum(["story", "character", "general"]).optional(),
      },
    },
    async (args) =>
      toolResult(await validateCanon(args.content, args.contentType)),
  );

  server.registerTool(
    "identify_gate",
    {
      description:
        "Get detailed information about a specific Gate, Guardian, and Godbeast",
      inputSchema: {
        gateNumber: z.number().min(1).max(10),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const g = gates[args.gateNumber - 1];
      if (!g)
        return {
          content: [
            { type: "text" as const, text: "Invalid gate number. Use 1-10." },
          ],
        };
      recordGateExplored(sessionId, args.gateNumber);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                ...g,
                description: `The ${g.domain} Gate, guarded by ${g.guardian}, resonates at ${g.frequencyBand}. It governs ${g.domain.toLowerCase()} and is aligned with ${g.element}.`,
                godbeastDescription: g.veltara
                  ? `${g.veltara} is the Godbeast companion of ${g.guardian}.`
                  : "Shinkami has no Godbeast - they are the Source itself.",
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}
