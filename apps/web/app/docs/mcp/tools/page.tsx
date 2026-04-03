import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MCP Tool Reference — Arcanea Docs",
  description:
    "Complete reference for all 34 Arcanea MCP tools: worldbuilding generators, creative coaching, world intelligence, creation graph, agent orchestration, memory, canon, and APL.",
  alternates: { canonical: "/docs/mcp/tools" },
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Tool {
  name: string;
  description: string;
  params: Param[];
  example?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  tools: Tool[];
}

/* ------------------------------------------------------------------ */
/*  Tool Data                                                          */
/* ------------------------------------------------------------------ */

const CATEGORIES: Category[] = [
  {
    id: "worldbuilding",
    name: "Worldbuilding Generators",
    description:
      "Generate canon-consistent characters, magic systems, creatures, locations, artifacts, names, and story prompts.",
    tools: [
      {
        name: "generate_character",
        description:
          "Generate a fully realized character with archetype, element affinity, backstory, and hooks.",
        params: [
          { name: "worldId", type: "string", required: false, description: "Target world context" },
          { name: "archetype", type: "string", required: false, description: "Character archetype (mage, guardian, wanderer, etc.)" },
          { name: "element", type: "string", required: false, description: "Element affinity: fire, water, earth, wind, void, spirit" },
          { name: "gatesOpen", type: "number", required: false, description: "Gates opened — determines magic rank (0–10)" },
        ],
        example: `generate_character({ archetype: "guardian", element: "void", gatesOpen: 7 })`,
      },
      {
        name: "generate_magic",
        description:
          "Design a magic system for a world, including source, mechanics, costs, and limitations.",
        params: [
          { name: "worldId", type: "string", required: false, description: "World to scope the magic system to" },
          { name: "element", type: "string", required: false, description: "Primary elemental basis" },
          { name: "style", type: "string", required: false, description: "Hard / soft / structured system style" },
        ],
        example: `generate_magic({ element: "fire", style: "hard" })`,
      },
      {
        name: "generate_creature",
        description: "Create a creature with natural history, abilities, and narrative role.",
        params: [
          { name: "worldId", type: "string", required: false, description: "World context" },
          { name: "element", type: "string", required: false, description: "Element association" },
          { name: "role", type: "string", required: false, description: "Narrative role: companion, antagonist, neutral" },
        ],
        example: `generate_creature({ element: "water", role: "companion" })`,
      },
      {
        name: "generate_location",
        description:
          "Generate a location with geography, atmosphere, history, and narrative hooks.",
        params: [
          { name: "worldId", type: "string", required: false, description: "World context" },
          { name: "biome", type: "string", required: false, description: "Biome or environment type" },
          { name: "gateAffinity", type: "string", required: false, description: "Gate the location resonates with" },
        ],
        example: `generate_location({ biome: "forest", gateAffinity: "heart" })`,
      },
      {
        name: "generate_artifact",
        description: "Design a named artifact with origin, powers, and lore implications.",
        params: [
          { name: "worldId", type: "string", required: false, description: "World context" },
          { name: "element", type: "string", required: false, description: "Element the artifact channels" },
          { name: "tier", type: "string", required: false, description: "Power tier: common, rare, legendary, mythic" },
        ],
        example: `generate_artifact({ element: "spirit", tier: "legendary" })`,
      },
      {
        name: "generate_name",
        description: "Generate culturally coherent names for characters, places, or organizations.",
        params: [
          { name: "type", type: "string", required: true, description: "Name type: character, location, organization, artifact" },
          { name: "culture", type: "string", required: false, description: "Cultural or elemental aesthetic" },
          { name: "count", type: "number", required: false, description: "Number of names to generate (default 5)" },
        ],
        example: `generate_name({ type: "character", culture: "eldrian", count: 3 })`,
      },
      {
        name: "generate_story_prompt",
        description:
          "Generate a story prompt or scene seed rooted in Arcanean narrative structure.",
        params: [
          { name: "worldId", type: "string", required: false, description: "World context" },
          { name: "gate", type: "string", required: false, description: "Gate frequency the story passes through" },
          { name: "tone", type: "string", required: false, description: "Tone: epic, intimate, tragic, comedic" },
        ],
        example: `generate_story_prompt({ gate: "voice", tone: "intimate" })`,
      },
    ],
  },
  {
    id: "coaching",
    name: "Creative Coaching",
    description:
      "Diagnose creative blocks, invoke Luminor guidance, run multi-perspective council sessions, and stage debates between creative philosophies.",
    tools: [
      {
        name: "diagnose_block",
        description:
          "Identify what is causing a creative block and return a structured diagnosis with suggested actions.",
        params: [
          { name: "situation", type: "string", required: true, description: "Description of the creative situation or block" },
          { name: "gate", type: "string", required: false, description: "Gate the work is connected to" },
        ],
        example: `diagnose_block({ situation: "I keep rewriting the opening chapter and nothing feels right" })`,
      },
      {
        name: "invoke_luminor",
        description:
          "Invoke a specific Luminor (named creative archetype) to provide guidance on a question.",
        params: [
          { name: "luminor", type: "string", required: true, description: "Luminor name or archetype to invoke" },
          { name: "question", type: "string", required: true, description: "The question or challenge to bring to this Luminor" },
        ],
        example: `invoke_luminor({ luminor: "Alera", question: "How do I find my authentic voice for this story?" })`,
      },
      {
        name: "deep_diagnosis",
        description:
          "Multi-layer diagnosis that examines structure, emotion, theme, and craft simultaneously.",
        params: [
          { name: "content", type: "string", required: true, description: "The work, passage, or creative problem to diagnose" },
          { name: "intent", type: "string", required: false, description: "What you intended the work to achieve" },
        ],
        example: `deep_diagnosis({ content: "<passage>", intent: "evoke profound loss without melodrama" })`,
      },
      {
        name: "convene_council",
        description:
          "Assemble a council of diverse creative perspectives to evaluate a decision or work.",
        params: [
          { name: "question", type: "string", required: true, description: "The question or work to bring before the council" },
          { name: "perspectives", type: "string[]", required: false, description: "Specific perspectives to include (default: auto-selected)" },
        ],
        example: `convene_council({ question: "Should this world have a morally ambiguous magic system?" })`,
      },
      {
        name: "luminor_debate",
        description:
          "Stage a structured debate between two or more Luminors on a creative or philosophical question.",
        params: [
          { name: "topic", type: "string", required: true, description: "Topic or proposition to debate" },
          { name: "luminors", type: "string[]", required: false, description: "Luminors to include in the debate (2–4)" },
          { name: "rounds", type: "number", required: false, description: "Number of exchange rounds (default 2)" },
        ],
        example: `luminor_debate({ topic: "Should antagonists believe they are right?", luminors: ["Maylinn", "Draconia"] })`,
      },
    ],
  },
  {
    id: "intelligence",
    name: "World Intelligence",
    description:
      "High-level world analysis, conflict generation, and narrative weaving across existing world elements.",
    tools: [
      {
        name: "world_report",
        description:
          "Generate a structured report on a world's current state: factions, tensions, active arcs, and gaps.",
        params: [
          { name: "worldId", type: "string", required: true, description: "World to analyze" },
          { name: "focus", type: "string", required: false, description: "Analysis focus: political, magical, narrative, social" },
        ],
        example: `world_report({ worldId: "arcanea", focus: "political" })`,
      },
      {
        name: "generate_conflict",
        description:
          "Generate a narratively grounded conflict rooted in the world's existing factions, characters, or history.",
        params: [
          { name: "worldId", type: "string", required: true, description: "World context" },
          { name: "scale", type: "string", required: false, description: "Scale: interpersonal, local, regional, cosmic" },
          { name: "type", type: "string", required: false, description: "Conflict type: ideological, resource, identity, power" },
        ],
        example: `generate_conflict({ worldId: "arcanea", scale: "regional", type: "ideological" })`,
      },
      {
        name: "weave_narrative",
        description:
          "Weave existing world elements into a coherent narrative thread or episode structure.",
        params: [
          { name: "worldId", type: "string", required: true, description: "World context" },
          { name: "elements", type: "string[]", required: true, description: "IDs or names of world elements to weave together" },
          { name: "format", type: "string", required: false, description: "Output format: summary, scene, outline" },
        ],
        example: `weave_narrative({ worldId: "arcanea", elements: ["Shinkami", "Source Gate", "Malachar"], format: "outline" })`,
      },
    ],
  },
  {
    id: "graph",
    name: "Creation Graph",
    description:
      "Build and traverse the semantic graph of your world. Link elements, discover relationships, and export structured world data.",
    tools: [
      {
        name: "link_creations",
        description: "Create a typed relationship between two world elements.",
        params: [
          { name: "sourceId", type: "string", required: true, description: "Source element ID" },
          { name: "targetId", type: "string", required: true, description: "Target element ID" },
          { name: "relationship", type: "string", required: true, description: "Relationship type: guards, created, opposes, descended_from, etc." },
        ],
        example: `link_creations({ sourceId: "shinkami", targetId: "source-gate", relationship: "guards" })`,
      },
      {
        name: "get_related",
        description: "Return all elements related to a given world element.",
        params: [
          { name: "elementId", type: "string", required: true, description: "Element to find relations for" },
          { name: "depth", type: "number", required: false, description: "Graph traversal depth (default 1, max 3)" },
          { name: "types", type: "string[]", required: false, description: "Filter by relationship types" },
        ],
        example: `get_related({ elementId: "draconia", depth: 2 })`,
      },
      {
        name: "suggest_connections",
        description:
          "Suggest narratively meaningful connections between existing world elements that are not yet linked.",
        params: [
          { name: "worldId", type: "string", required: true, description: "World to analyze" },
          { name: "limit", type: "number", required: false, description: "Max suggestions (default 5)" },
        ],
        example: `suggest_connections({ worldId: "arcanea", limit: 5 })`,
      },
      {
        name: "get_world_graph",
        description: "Return the full creation graph for a world as structured data.",
        params: [
          { name: "worldId", type: "string", required: true, description: "World to retrieve the graph for" },
          { name: "format", type: "string", required: false, description: "Output format: json, dot, summary" },
        ],
        example: `get_world_graph({ worldId: "arcanea", format: "summary" })`,
      },
      {
        name: "find_path",
        description: "Find the shortest narrative path between two world elements.",
        params: [
          { name: "fromId", type: "string", required: true, description: "Starting element" },
          { name: "toId", type: "string", required: true, description: "Destination element" },
        ],
        example: `find_path({ fromId: "malachar", toId: "shinkami" })`,
      },
      {
        name: "export_world",
        description: "Export a world's complete data as a portable JSON bundle.",
        params: [
          { name: "worldId", type: "string", required: true, description: "World to export" },
          { name: "include", type: "string[]", required: false, description: "Sections to include: graph, lore, characters, locations, all" },
        ],
        example: `export_world({ worldId: "arcanea", include: ["graph", "characters"] })`,
      },
    ],
  },
  {
    id: "orchestration",
    name: "Agent Orchestration",
    description:
      "Spawn and coordinate specialized creative agents, assess world readiness, and manage active agent sessions.",
    tools: [
      {
        name: "orchestrate",
        description:
          "Spawn and coordinate one or more specialized agents to complete a multi-step creative task.",
        params: [
          { name: "task", type: "string", required: true, description: "Task description for the orchestrated agents" },
          { name: "agents", type: "string[]", required: false, description: "Specific agent types to include" },
          { name: "worldId", type: "string", required: false, description: "World context to scope the task" },
        ],
        example: `orchestrate({ task: "Build out the political factions of the northern territories", worldId: "arcanea" })`,
      },
      {
        name: "list_agents",
        description: "List available agent types with their capabilities and current status.",
        params: [
          { name: "filter", type: "string", required: false, description: "Filter by capability: worldbuilding, coaching, writing, analysis" },
        ],
        example: `list_agents({ filter: "worldbuilding" })`,
      },
      {
        name: "assess_world",
        description:
          "Assess a world's readiness for a specific type of work (writing, game, publication, etc.).",
        params: [
          { name: "worldId", type: "string", required: true, description: "World to assess" },
          { name: "purpose", type: "string", required: true, description: "Intended purpose: novel, game, visual, campaign" },
        ],
        example: `assess_world({ worldId: "arcanea", purpose: "novel" })`,
      },
      {
        name: "active_sessions",
        description: "Return all currently active agent sessions.",
        params: [
          { name: "worldId", type: "string", required: false, description: "Filter by world context" },
        ],
        example: `active_sessions({})`,
      },
      {
        name: "agent_info",
        description: "Get detailed information about a specific agent type or active agent instance.",
        params: [
          { name: "agentId", type: "string", required: true, description: "Agent type name or session ID" },
        ],
        example: `agent_info({ agentId: "character-forge" })`,
      },
      {
        name: "match_skill",
        description: "Find the best-matching agent skill for a given creative need.",
        params: [
          { name: "need", type: "string", required: true, description: "Description of what you need to accomplish" },
        ],
        example: `match_skill({ need: "I need to write convincing villain dialogue" })`,
      },
    ],
  },
  {
    id: "memory",
    name: "Memory & Journey",
    description:
      "Track a creator's journey through the Ten Gates and check milestone progress.",
    tools: [
      {
        name: "get_journey",
        description:
          "Return the current state of a creator's journey: gates opened, rank, active challenges, and recent progress.",
        params: [
          { name: "userId", type: "string", required: false, description: "User ID (defaults to authenticated user)" },
        ],
        example: `get_journey({})`,
      },
      {
        name: "check_milestones",
        description:
          "Check milestone completion status for a user or world.",
        params: [
          { name: "userId", type: "string", required: false, description: "User to check milestones for" },
          { name: "worldId", type: "string", required: false, description: "World to check milestones for" },
          { name: "gate", type: "string", required: false, description: "Filter by specific gate" },
        ],
        example: `check_milestones({ gate: "voice" })`,
      },
    ],
  },
  {
    id: "canon",
    name: "Canon & Reference",
    description:
      "Validate content against the Arcanean canon and identify which Gate a theme or work resonates with.",
    tools: [
      {
        name: "validate_canon",
        description:
          "Check whether a piece of content is consistent with established Arcanean canon. Returns issues and suggestions.",
        params: [
          { name: "content", type: "string", required: true, description: "Text or structured data to validate" },
          { name: "strict", type: "boolean", required: false, description: "Strict mode checks minor inconsistencies (default false)" },
        ],
        example: `validate_canon({ content: "Shinkami was created by Nero", strict: true })`,
      },
      {
        name: "identify_gate",
        description:
          "Identify which of the Ten Gates a theme, character, or work most resonates with.",
        params: [
          { name: "input", type: "string", required: true, description: "Theme, character description, or passage to analyze" },
        ],
        example: `identify_gate({ input: "A story about breaking free from inherited beliefs to speak your own truth" })`,
      },
    ],
  },
  {
    id: "apl",
    name: "APL — Arcanean Prompt Language",
    description:
      "Tools for refining AI prompts using Arcanean creative principles: enhance clarity, eliminate generic outputs, and format for specific models.",
    tools: [
      {
        name: "apl_enhance",
        description:
          "Enhance a prompt using APL principles: sharpen specificity, add sensory grounding, and inject creative tension.",
        params: [
          { name: "prompt", type: "string", required: true, description: "Prompt to enhance" },
          { name: "mode", type: "string", required: false, description: "Enhancement mode: subtle, moderate, full (default moderate)" },
        ],
        example: `apl_enhance({ prompt: "Write a dark fantasy scene", mode: "full" })`,
      },
      {
        name: "apl_anti_slop",
        description:
          "Analyze a prompt or output for generic, overused, or low-signal language. Returns specific replacements.",
        params: [
          { name: "content", type: "string", required: true, description: "Prompt or generated content to audit" },
          { name: "domain", type: "string", required: false, description: "Domain context: fantasy, literary, dialogue, description" },
        ],
        example: `apl_anti_slop({ content: "The ancient wizard with piercing eyes spoke in a gravelly voice" })`,
      },
      {
        name: "apl_format",
        description:
          "Format a prompt for optimal performance with a specific AI model or provider.",
        params: [
          { name: "prompt", type: "string", required: true, description: "Prompt to format" },
          { name: "model", type: "string", required: true, description: "Target model: claude, gpt, gemini, llama" },
        ],
        example: `apl_format({ prompt: "Write a character origin story", model: "claude" })`,
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function ParamBadge({ required }: { required: boolean }) {
  return required ? (
    <span className="rounded px-1.5 py-0.5 font-mono text-[10px] text-rose-400 bg-rose-400/10 border border-rose-400/20">
      required
    </span>
  ) : (
    <span className="rounded px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 bg-white/[0.04] border border-white/[0.06]">
      optional
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function McpToolsPage() {
  return (
    <div className="relative min-h-screen bg-[#09090b]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.07),transparent_60%)]" />
      </div>

      <main className="mx-auto max-w-4xl px-5 sm:px-8">
        {/* ---- Breadcrumb ---- */}
        <nav className="pt-8 pb-2">
          <ol className="flex items-center gap-2 text-sm text-zinc-500">
            <li>
              <Link href="/docs" className="hover:text-zinc-300 transition-colors">
                Docs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/docs/mcp" className="hover:text-zinc-300 transition-colors">
                MCP
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[#7fffd4]">Tools</li>
          </ol>
        </nav>

        {/* ---- Header ---- */}
        <section className="pb-10 pt-10">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Tool{" "}
            <span className="bg-gradient-to-r from-[#00bcd4] to-[#7fffd4] bg-clip-text text-transparent">
              Reference
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            All 34 tools across 8 categories. Each tool is available via any
            MCP-compatible client once the server is configured.
          </p>

          {/* Category index */}
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-sm text-zinc-400 hover:border-[#7fffd4]/30 hover:text-[#7fffd4] transition-all"
              >
                {cat.name}
                <span className="ml-1.5 font-mono text-xs text-zinc-600">
                  {cat.tools.length}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ---- Categories ---- */}
        <div className="space-y-14 pb-20">
          {CATEGORIES.map((cat) => (
            <section key={cat.id} id={cat.id}>
              <div className="mb-6 border-b border-white/[0.06] pb-4">
                <h2 className="font-display text-2xl font-semibold text-white">
                  {cat.name}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  {cat.description}
                </p>
              </div>

              <div className="space-y-6">
                {cat.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                  >
                    {/* Tool header */}
                    <div className="flex items-center gap-3 border-b border-white/[0.04] px-5 py-4">
                      <code className="font-mono text-sm font-semibold text-[#7fffd4]">
                        {tool.name}
                      </code>
                    </div>

                    {/* Tool body */}
                    <div className="px-5 py-4 space-y-4">
                      <p className="text-sm leading-relaxed text-zinc-300">
                        {tool.description}
                      </p>

                      {/* Parameters */}
                      {tool.params.length > 0 && (
                        <div>
                          <p className="mb-2.5 font-mono text-xs uppercase tracking-wider text-zinc-500">
                            Parameters
                          </p>
                          <div className="overflow-x-auto rounded-lg border border-white/[0.04]">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-white/[0.02]">
                                  <th className="py-2 px-4 text-left font-mono text-xs text-zinc-600">
                                    Name
                                  </th>
                                  <th className="py-2 px-4 text-left font-mono text-xs text-zinc-600">
                                    Type
                                  </th>
                                  <th className="py-2 px-4 text-left font-mono text-xs text-zinc-600">
                                    Required
                                  </th>
                                  <th className="py-2 px-4 text-left font-mono text-xs text-zinc-600">
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/[0.03]">
                                {tool.params.map((p) => (
                                  <tr key={p.name}>
                                    <td className="py-2.5 px-4">
                                      <code className="font-mono text-xs text-zinc-300">
                                        {p.name}
                                      </code>
                                    </td>
                                    <td className="py-2.5 px-4">
                                      <code className="font-mono text-xs text-[#00bcd4]/80">
                                        {p.type}
                                      </code>
                                    </td>
                                    <td className="py-2.5 px-4">
                                      <ParamBadge required={p.required} />
                                    </td>
                                    <td className="py-2.5 px-4 text-xs text-zinc-500">
                                      {p.description}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Example */}
                      {tool.example && (
                        <div>
                          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-zinc-500">
                            Example
                          </p>
                          <pre className="overflow-x-auto rounded-lg border border-white/[0.04] bg-black/40 px-4 py-3 font-mono text-sm text-zinc-300">
                            <code>{tool.example}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
