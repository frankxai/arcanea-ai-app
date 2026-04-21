import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { loadRoster, listRosters } from "../rosters/index.js";
import { loadAuthors, discoverAuthors } from "../authors/index.js";
import { routeQuestion } from "../router/index.js";
import { buildAuthorPrompt, type QuestionKind } from "../protocol/index.js";
import { buildSynthesizerPrompt } from "../synthesizer/neutral.js";
import { selectMode } from "../modes/select.js";

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
        return toTextResult(JSON.stringify([...(await discoverAuthors())], null, 2));
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
        const context = typeof a["context"] === "string" ? (a["context"] as string) : undefined;
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

function toTextResult(text: string): { content: Array<{ type: "text"; text: string }> } {
  return { content: [{ type: "text", text }] };
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
];
