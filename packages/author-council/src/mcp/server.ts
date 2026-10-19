import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { loadRoster, listRosters } from "../rosters/index.js";
import { loadAuthors, discoverAuthors } from "../authors/index.js";
import { routeQuestion } from "../router/index.js";
import { buildAuthorPrompt } from "../protocol/prompt.js";
import { type QuestionKind, type DeliberationMode } from "../protocol/types.js";
import { buildSynthesizerPrompt } from "../synthesizer/neutral.js";
import { selectMode } from "../modes/select.js";
import { convene } from "../convene.js";
import { createHash } from "node:crypto";
import {
  CouncilExecutionError,
  createCritiqueRunner,
  readCritiqueConfig,
} from "./critique-runner.js";

export async function createMcpServer(): Promise<Server> {
  const server = new Server(
    {
      name: "@arcanea/author-council",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const a = (args ?? {}) as Record<string, unknown>;
    switch (name) {
      case "list_rosters":
        return toTextResult(JSON.stringify(await listRosters(), null, 2));
      case "list_authors":
        return toTextResult(
          JSON.stringify([...(await discoverAuthors())], null, 2),
        );
      case "get_roster": {
        const id = requireString(a, "id");
        const roster = await loadRoster(id);
        return toTextResult(JSON.stringify(roster, null, 2));
      }
      case "route_question": {
        const kind = requireString(a, "kind") as QuestionKind;
        const rosterId = requireString(a, "roster");
        const roster = await loadRoster(rosterId);
        const decision = routeQuestion(
          { kind, content: requireString(a, "content") },
          { roster: roster.authors },
        );
        return toTextResult(JSON.stringify(decision, null, 2));
      }
      case "build_author_prompts": {
        const rosterId = requireString(a, "roster");
        const kind = requireString(a, "kind") as QuestionKind;
        const content = requireString(a, "content");
        const context =
          typeof a["context"] === "string"
            ? (a["context"] as string)
            : undefined;
        const roster = await loadRoster(rosterId);
        const selected = routeQuestion(
          { kind, content, ...(context !== undefined ? { context } : {}) },
          { roster: roster.authors },
        );
        const authors = await loadAuthors(selected.selectedAuthors);
        const prompts = authors.map((author) => ({
          author: author.slug,
          role: author.role,
          systemPrompt: buildAuthorPrompt(
            author,
            { kind, content, ...(context !== undefined ? { context } : {}) },
            roster.canon,
          ),
        }));
        return toTextResult(
          JSON.stringify(
            {
              routing: selected,
              mode: selected.mode,
              synthesizer: roster.synthesizer,
              prompts,
            },
            null,
            2,
          ),
        );
      }
      case "build_synthesizer_prompt": {
        const critiques = a["critiques"];
        const mode = requireString(a, "mode");
        const persona = requireString(a, "persona");
        if (!Array.isArray(critiques)) {
          throw new Error("critiques must be an array");
        }
        // @ts-expect-error — runtime validation of critique shape left to host
        const prompt = buildSynthesizerPrompt(critiques, mode, persona);
        return toTextResult(prompt);
      }
      case "select_mode": {
        const kind = requireString(a, "kind") as QuestionKind;
        const mode = selectMode({ kind, content: "" });
        return toTextResult(JSON.stringify({ kind, mode }));
      }
      case "deliberate": {
        const rosterId = requireString(a, "roster");
        const rawMode = requireString(a, "mode");
        const content = requireString(a, "text");
        const voicesOverride = Array.isArray(a?.voicesOverride)
          ? (a.voicesOverride as string[])
          : [];

        // Bridge book-config modes ('deliberation', 'critique', etc.) to protocol modes ('convergence', 'parallel', etc.)
        const mode = mapMode(rawMode);

        const roster = await loadRoster(rosterId);
        if (
          voicesOverride.some(
            (slug) =>
              typeof slug !== "string" || !roster.authors.includes(slug),
          ) ||
          new Set(voicesOverride).size !== voicesOverride.length
        ) {
          throw new CouncilExecutionError(
            "Voice overrides must be distinct seats in the selected roster",
          );
        }
        const authors = await loadAuthors(
          voicesOverride.length > 0 ? voicesOverride : roster.authors,
        );

        let runner: ReturnType<typeof createCritiqueRunner> | undefined;
        const chapterSha256 = createHash("sha256")
          .update(content)
          .digest("hex");
        try {
          runner = createCritiqueRunner(readCritiqueConfig(), roster.canon);
          const session = await convene(
            {
              kind: "chapter",
              content,
              mode,
              ...(voicesOverride.length
                ? { preferAuthors: voicesOverride }
                : {}),
            },
            {
              roster,
              authors,
              mode,
              runCritique: runner.run,
              ...(voicesOverride.length
                ? {
                    maxAuthors: voicesOverride.length,
                    minAuthors: voicesOverride.length,
                  }
                : {}),
            },
          );

          return toTextResult(
            JSON.stringify(
              {
                ...session,
                execution: {
                  ...runner.snapshot(),
                  chapterSha256,
                  status: "complete",
                },
              },
              null,
              2,
            ),
          );
        } catch (error) {
          await runner?.settle();
          return {
            isError: true,
            ...toTextResult(
              JSON.stringify(
                {
                  status: runner ? "failed" : "refused",
                  error:
                    error instanceof CouncilExecutionError
                      ? error.code
                      : "Council execution failed; no approval produced",
                  execution: {
                    ...(runner?.snapshot() ?? {
                      attempts: [],
                      critiques: [],
                      humanReviewRequired: true,
                      publicationAllowed: false,
                      fallbackAttempted: false,
                    }),
                    chapterSha256,
                  },
                },
                null,
                2,
              ),
            ),
          };
        }
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  return server;
}

function requireString(args: Record<string, unknown>, key: string): string {
  const v = args[key];
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`Missing required string argument: ${key}`);
  }
  return v;
}

function toTextResult(text: string): {
  content: Array<{ type: "text"; text: string }>;
} {
  return { content: [{ type: "text", text }] };
}

function mapMode(mode: string): DeliberationMode {
  switch (mode) {
    case "critique":
    case "parallel":
      return "parallel";
    case "debate":
    case "adversarial":
      return "adversarial";
    case "synthesis":
    case "sequential":
      return "sequential";
    case "deliberation":
    case "convergence":
      return "convergence";
    default:
      throw new CouncilExecutionError("Unknown council mode");
  }
}

const TOOLS = [
  {
    name: "list_rosters",
    description: "List all available council rosters",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_authors",
    description: "List all available author agents",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_roster",
    description: "Get a specific roster manifest",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "route_question",
    description: "Route a question to the best subset of authors in a roster",
    inputSchema: {
      type: "object",
      properties: {
        roster: { type: "string" },
        kind: { type: "string" },
        content: { type: "string" },
      },
      required: ["roster", "kind", "content"],
    },
  },
  {
    name: "build_author_prompts",
    description:
      "Build the set of per-author LLM system prompts for a question. Host runs the LLM calls and returns critiques.",
    inputSchema: {
      type: "object",
      properties: {
        roster: { type: "string" },
        kind: { type: "string" },
        content: { type: "string" },
        context: { type: "string" },
      },
      required: ["roster", "kind", "content"],
    },
  },
  {
    name: "build_synthesizer_prompt",
    description: "Build the synthesizer LLM prompt from a set of critiques",
    inputSchema: {
      type: "object",
      properties: {
        critiques: { type: "array" },
        mode: { type: "string" },
        persona: { type: "string" },
      },
      required: ["critiques", "mode", "persona"],
    },
  },
  {
    name: "select_mode",
    description: "Auto-select deliberation mode from question kind",
    inputSchema: {
      type: "object",
      properties: { kind: { type: "string" } },
      required: ["kind"],
    },
  },
  {
    name: "deliberate",
    description:
      "Run a configured-provider council review candidate. Requires explicit provider/model/output/call caps; never grants publication or canon approval.",
    inputSchema: {
      type: "object",
      properties: {
        roster: { type: "string" },
        mode: {
          type: "string",
          enum: [
            "deliberation",
            "critique",
            "synthesis",
            "debate",
            "parallel",
            "sequential",
            "adversarial",
            "convergence",
          ],
        },
        text: { type: "string" },
        voicesOverride: { type: "array", items: { type: "string" } },
      },
      required: ["roster", "mode", "text"],
    },
  },
];
