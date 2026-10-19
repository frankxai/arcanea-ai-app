import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const APL_PALETTES = ["forge", "tide", "root", "drift", "void"] as const;

export function registerVisualStyleTools(server: McpServer) {
  // =========================================================================
  // APL — ARCANEAN PROMPT LANGUAGE
  // =========================================================================

  server.registerTool(
    "apl_enhance",
    {
      description:
        "Analyze a prompt using SPARK.SHAPE.SHARPEN and get quality score, slop detection, palette suggestions, and improvement tips",
      inputSchema: {
        prompt: z.string().describe("The prompt to analyze and enhance"),
        palette: z
          .enum(APL_PALETTES)
          .optional()
          .describe("Force a specific sensory palette"),
      },
    },
    async (args) => {
      const { prompt, palette } = args;
      const slopPatterns = [
        {
          id: "opener",
          name: "The Opener",
          re: /\bin a world where\b/i,
          fix: "Start in the middle.",
        },
        {
          id: "avalanche",
          name: "The Avalanche",
          re: /\bhauntingly beautiful\b/i,
          fix: "One strong word beats five weak ones.",
        },
        {
          id: "slop",
          name: "The Slop",
          re: /\bi'?d be happy to help\b/i,
          fix: "Respond AS the thing, not ABOUT the thing.",
        },
        {
          id: "slop2",
          name: "The Slop",
          re: /\bgreat question\b/i,
          fix: "Just answer.",
        },
        {
          id: "safety",
          name: "The Safety",
          re: /\ba (?:beautiful|stunning) (?:landscape|sunset)\b/i,
          fix: "If it doesn't make you feel something, it's not done.",
        },
      ];
      const slopMatches = slopPatterns
        .filter((p) => p.re.test(prompt))
        .map((p) => ({ name: p.name, fix: p.fix }));
      const hasSpecific =
        /\b(?:every night|always|never fails|the way she|his habit)\b/i.test(
          prompt,
        );
      const hasSensory =
        /\b(?:smell|taste|feel|sound|texture|heat|cold|weight|echo)\b/i.test(
          prompt,
        );
      const hasNegation =
        /\b(?:not|never|no|without|avoid|don't|must not)\b/i.test(prompt);
      const suggestions: string[] = [];
      if (!hasSpecific)
        suggestions.push(
          "SPARK: Add one specific, surprising detail — the thing only YOU would think of.",
        );
      if (!hasSensory)
        suggestions.push(
          "SHAPE: Add sensory language — what does this feel/smell/sound like?" +
            (palette ? ` Use the ${palette.toUpperCase()} palette.` : ""),
        );
      if (!hasNegation)
        suggestions.push(
          "SHARPEN: Tell the AI what to AVOID — what must this NOT be?",
        );
      slopMatches.forEach((m) =>
        suggestions.push(`Cut slop: ${m.name} → ${m.fix}`),
      );
      const quality =
        hasSpecific && hasSensory && hasNegation && slopMatches.length === 0
          ? "resonant"
          : hasSpecific && hasSensory
            ? "vivid"
            : hasSpecific
              ? "clear"
              : "generic";
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                quality,
                slopMatches,
                suggestions,
                sparkPresent: hasSpecific,
                shapePresent: hasSensory,
                sharpenPresent: hasNegation,
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
    "apl_anti_slop",
    {
      description:
        "Scan text for AI slop patterns (The Opener, The Avalanche, The Slop, etc.) and get specific fixes",
      inputSchema: {
        text: z.string().describe("Text to scan for slop patterns"),
      },
    },
    async (args) => {
      const { text } = args;
      const patterns = [
        {
          name: "The Opener",
          re: /\bin a world where\b/gi,
          fix: "Start in the middle.",
        },
        {
          name: "The Avalanche",
          re: /\b(?:hauntingly|breathtakingly|stunningly)\s+\w+/gi,
          fix: "One strong word beats five.",
        },
        {
          name: "The Slop",
          re: /\b(?:i'd be happy to|great question|certainly!|absolutely!|dive (?:deep )?into|unpack this)/gi,
          fix: "Respond AS the thing.",
        },
        {
          name: "The Explanation",
          re: /\bthis (?:metaphor|symbol) (?:represents|means)\b/gi,
          fix: "Trust the reader.",
        },
        {
          name: "The Safety",
          re: /\ba (?:beautiful|stunning|brave|epic) (?:landscape|warrior|adventure|journey)\b/gi,
          fix: "Make them feel something specific.",
        },
      ];
      const matches: Array<{ name: string; match: string; fix: string }> = [];
      for (const p of patterns) {
        let m;
        while ((m = p.re.exec(text)) !== null) {
          matches.push({ name: p.name, match: m[0], fix: p.fix });
        }
      }
      const words = text.split(/\s+/).length;
      const score = Math.min(matches.length / Math.max(words / 50, 1), 1);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                slopScore: Math.round(score * 100) / 100,
                matchCount: matches.length,
                wordCount: words,
                matches,
                verdict:
                  score === 0
                    ? "CLEAN"
                    : score < 0.3
                      ? "MILD"
                      : score < 0.6
                        ? "SLOPPY"
                        : "MAXIMUM SLOP",
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
    "apl_format",
    {
      description:
        "Format a prompt using the SPARK.SHAPE.SHARPEN structure for maximum AI output quality",
      inputSchema: {
        spark: z
          .string()
          .describe("The one unique detail that makes this yours"),
        palette: z.enum(APL_PALETTES).optional().describe("Sensory palette"),
        paletteDescription: z
          .string()
          .optional()
          .describe("What the world feels/sounds/looks like"),
        sharpen: z
          .array(z.string())
          .optional()
          .describe("List of things it must NOT be"),
        prompt: z.string().describe("The main prompt in plain language"),
      },
    },
    async (args) => {
      const { spark, palette, paletteDescription, sharpen, prompt } = args;
      const parts: string[] = [];
      parts.push(`SPARK: ${spark}`);
      if (palette)
        parts.push(
          `SHAPE: ${palette.toUpperCase()}${paletteDescription ? ` — ${paletteDescription}` : ""}`,
        );
      if (sharpen && sharpen.length > 0)
        parts.push(`SHARPEN: ${sharpen.map((s) => `NOT ${s}`).join(". ")}.`);
      parts.push("", prompt);
      return { content: [{ type: "text" as const, text: parts.join("\n") }] };
    },
  );
}
