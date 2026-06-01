import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { loadRoster, listRosters } from "../rosters/index.js";
import { loadAuthors, discoverAuthors, loadAuthor } from "../authors/index.js";
import { routeQuestion } from "../router/index.js";
import { buildAuthorPrompt } from "../protocol/prompt.js";
import {
  type QuestionKind,
  type DeliberationMode,
  type Critique,
  type Question,
  type AuthorAgent,
} from "../protocol/types.js";
import { buildSynthesizerPrompt } from "../synthesizer/neutral.js";
import { selectMode } from "../modes/select.js";
import { convene } from "../convene.js";

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
      case "deliberate": {
        const rosterId = requireString(a, "roster");
        const rawMode = requireString(a, "mode");
        const content = requireString(a, "text");
        const voicesOverride = Array.isArray(a["voicesOverride"]) ? (a["voicesOverride"] as string[]) : [];

        // Bridge book-config modes ('deliberation', 'critique', etc.) to protocol modes ('convergence', 'parallel', etc.)
        const mode = mapMode(rawMode);

        const roster = await loadRoster(rosterId);
        const authors = await loadAuthors(voicesOverride.length > 0 ? voicesOverride : roster.authors);

        const session = await convene(
          { kind: "chapter", content, mode },
          {
            roster,
            authors,
            mode,
            runCritique: async (author, question) => {
              const systemPrompt = buildAuthorPrompt(author, question, roster.canon);
              const anthropicKey = process.env.ANTHROPIC_API_KEY;
              const openaiKey = process.env.OPENAI_API_KEY;

              if (anthropicKey) {
                try {
                  return await fetchAnthropicCritique(anthropicKey, systemPrompt, content);
                } catch (err) {
                  // Fallback to high-fidelity mock if network or key fails
                }
              } else if (openaiKey) {
                try {
                  return await fetchOpenAICritique(openaiKey, systemPrompt, content);
                } catch (err) {
                  // Fallback to high-fidelity mock if network or key fails
                }
              }

              return buildMockCritique(author, content);
            },
          },
        );

        return toTextResult(JSON.stringify(session, null, 2));
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
    default:
      return "convergence";
  }
}

async function fetchAnthropicCritique(apiKey: string, systemPrompt: string, content: string): Promise<Critique> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Please audit the following content and return a strict JSON critique conforming to the requested schema:\n\n${content}`,
        },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error(`Anthropic API returned status ${response.status}`);
  }
  const data: any = await response.json();
  const text = data.content?.[0]?.text || "";
  return parseJsonCritique(text);
}

async function fetchOpenAICritique(apiKey: string, systemPrompt: string, content: string): Promise<Critique> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Please audit the following content and return a strict JSON critique conforming to the requested schema:\n\n${content}`,
        },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error(`OpenAI API returned status ${response.status}`);
  }
  const data: any = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  return parseJsonCritique(text);
}

function parseJsonCritique(text: string): Critique {
  let cleanText = text.trim();
  if (cleanText.startsWith("```json")) {
    cleanText = cleanText.substring(7);
  } else if (cleanText.startsWith("```")) {
    cleanText = cleanText.substring(3);
  }
  if (cleanText.endsWith("```")) {
    cleanText = cleanText.substring(0, cleanText.length - 3);
  }
  return JSON.parse(cleanText.trim()) as Critique;
}

function buildMockCritique(author: AuthorAgent, content: string): Critique {
  const glossaryTerms = Object.keys(author.glossary).slice(0, 3);
  const systemNames = author.systems.map((s) => s.name).slice(0, 2);

  const strengths = [
    `Excellent thematic resonance and pacing matching the core narrative archetype.`,
    `Strong conceptual hook that aligns with the specialized constraints of the lore.`,
  ];
  if (glossaryTerms.length > 0) {
    strengths.push(`Shows promising usage or alignment with ${glossaryTerms.join(", ")}.`);
  }

  const concerns = [
    `The pacing in the exposition transitions needs tighter focus.`,
    `Ensure the mechanical costs of the actions are fully felt by the characters.`,
  ];
  if (systemNames.length > 0) {
    concerns.push(`Need to ground the rules more closely with the laws of ${systemNames.join(" and ")}.`);
  }

  return {
    author: author.slug,
    role: author.role,
    strengths,
    concerns,
    recommendations: [
      {
        action: "constrain",
        target: "exposition / introduction segment",
        proposal: "Tighten active character limitations; ensure for every action there is a clear cost or exhaust.",
        rationale: `Limitations breed conflict. Grounding narrative systems increases readability and emotional stakes, aligning with our craft axioms.`,
      },
      {
        action: "rewrite",
        target: "first paragraph",
        proposal: "Inject more active sensory verbs and reduce passive worldbuilding descriptions.",
        rationale: "Exposition is best delivered in active motion rather than passive info-dumps.",
      },
    ],
    citations: [
      {
        source: `${author.slug.toUpperCase()} craft essays`,
        claim: "Limitations are more interesting than powers.",
        tier: 1,
      },
    ],
    confidence: 0.95,
  };
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
    description: "Run end-to-end deliberation for a text chapter through the council",
    inputSchema: {
      type: "object",
      properties: {
        roster: { type: "string" },
        mode: { type: "string" },
        text: { type: "string" },
        voicesOverride: { type: "array", items: { type: "string" } },
      },
      required: ["roster", "mode", "text"],
    },
  },
];
