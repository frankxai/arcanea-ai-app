import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Every tool belongs to exactly one toolset. Agents load `core` by default, because every
 * served tool schema costs context on every turn; the rest are opt-in.
 */
export const TOOLSETS = {
  core: [
    "generate_character",
    "generate_location",
    "generate_story_prompt",
    "world_report",
    "validate_canon",
    "identify_gate",
    "plan_world",
    "plan_book",
    "save_world",
    "load_world",
    "search_arcanea_vault",
    "get_workflow_recipe",
  ],
  world: [
    "generate_magic",
    "generate_creature",
    "generate_artifact",
    "generate_name",
    "link_creations",
    "get_related",
    "suggest_connections",
    "get_world_graph",
    "find_path",
    "export_world",
    "generate_conflict",
    "weave_narrative",
    "generate_quest",
    "analyze_factions",
  ],
  coaching: [
    "diagnose_block",
    "invoke_luminor",
    "deep_diagnosis",
    "convene_council",
    "luminor_debate",
    "get_journey",
    "check_milestones",
  ],
  agents: [
    "orchestrate",
    "list_agents",
    "agent_info",
    "assess_world",
    "match_skill",
    "active_sessions",
  ],
  production: [
    "plan_game",
    "plan_music_project",
    "plan_cinematic_scene",
    "generate_asset_brief",
    "export_project_context",
    "list_arcanea_studios",
  ],
  visuals: [
    "visualize_character",
    "visualize_location",
    "visualize_creature",
    "apl_enhance",
    "apl_anti_slop",
    "apl_format",
  ],
  vault: [
    "save_to_arcanea_vault",
    "list_arcanea_worlds",
    "get_arcanea_bridge_status",
  ],
  library: ["search_sovereign_depths", "search_weight_of_wonders"],
} as const satisfies Record<string, readonly string[]>;

export type ToolsetName = keyof typeof TOOLSETS;
const TOOLSET_NAMES = Object.keys(TOOLSETS) as ToolsetName[];

/**
 * Tools each prompt tells the agent to call. A prompt loads only when all of them are
 * enabled, so a session never receives instructions for tools it cannot see.
 */
export const PROMPT_TOOLS: Readonly<Record<string, readonly string[]>> = {
  worldbuild_session: [
    "generate_character",
    "generate_location",
    "generate_magic",
    "generate_creature",
    "generate_artifact",
  ],
  unblock_session: ["diagnose_block"],
  gate_ritual: ["identify_gate"],
};

/** "core,world" | "all" | undefined or blank (= core) -> enabled tool names. */
export function resolveToolsets(spec: string | undefined): Set<string> {
  const trimmed = spec?.trim();
  const requested = (trimmed || "core").split(",").map((part) => part.trim());
  if (requested.some((part) => !part)) {
    throw new Error(`Empty toolset name in "${spec}".`);
  }
  for (const group of requested) {
    if (group !== "all" && !(group in TOOLSETS)) {
      throw new Error(
        `Unknown toolset "${group}". Available: ${TOOLSET_NAMES.join(", ")}, all.`,
      );
    }
  }
  const groups = requested.includes("all")
    ? TOOLSET_NAMES
    : (requested as ToolsetName[]);
  return new Set(groups.flatMap((group) => [...TOOLSETS[group]]));
}

export interface ToolHints {
  readOnly: boolean;
  destructive: boolean;
  idempotent: boolean;
  openWorld: boolean;
}

const READ: ToolHints = {
  readOnly: true,
  destructive: false,
  idempotent: true,
  openWorld: false,
};
const READ_REMOTE: ToolHints = { ...READ, openWorld: true };
/** Adds a new node, session or record on every call (fresh ids). */
const APPEND: ToolHints = {
  readOnly: false,
  destructive: false,
  idempotent: false,
  openWorld: false,
};
/** Records into the in-process session journey, deduplicated. */
const RECORD: ToolHints = {
  readOnly: false,
  destructive: false,
  idempotent: true,
  openWorld: false,
};
/** Replaces existing state with the same key. */
const REPLACE: ToolHints = {
  readOnly: false,
  destructive: true,
  idempotent: true,
  openWorld: false,
};

/**
 * Side effects of every tool, verified against its handler (2026-09-26 audit).
 * Lazy creation of an empty session or graph on first read is not counted as a write:
 * no tool can observe it.
 */
export const TOOL_CATALOG: Readonly<Record<string, ToolHints>> = {
  generate_character: APPEND,
  generate_location: APPEND,
  generate_creature: APPEND,
  generate_artifact: APPEND,
  generate_magic: READ,
  generate_name: READ,
  generate_story_prompt: READ,
  world_report: READ,
  generate_conflict: READ,
  weave_narrative: READ,
  generate_quest: READ,
  analyze_factions: READ,
  save_world: REPLACE,
  load_world: REPLACE,
  link_creations: REPLACE,
  get_related: READ,
  suggest_connections: READ,
  get_world_graph: READ,
  find_path: READ,
  export_world: READ,
  diagnose_block: RECORD,
  invoke_luminor: RECORD,
  deep_diagnosis: RECORD,
  convene_council: RECORD,
  luminor_debate: RECORD,
  identify_gate: RECORD,
  get_journey: READ,
  check_milestones: READ,
  validate_canon: READ,
  orchestrate: APPEND,
  list_agents: READ,
  agent_info: READ,
  assess_world: READ,
  match_skill: READ,
  active_sessions: READ,
  plan_world: READ,
  plan_book: READ,
  plan_game: READ,
  plan_music_project: READ,
  plan_cinematic_scene: READ,
  generate_asset_brief: READ,
  export_project_context: READ,
  list_arcanea_studios: READ,
  get_workflow_recipe: READ,
  visualize_character: READ,
  visualize_location: READ,
  visualize_creature: READ,
  apl_enhance: READ,
  apl_anti_slop: READ,
  apl_format: READ,
  search_arcanea_vault: READ_REMOTE,
  save_to_arcanea_vault: {
    readOnly: false,
    destructive: false,
    idempotent: false,
    openWorld: true,
  },
  list_arcanea_worlds: READ_REMOTE,
  get_arcanea_bridge_status: READ,
  search_sovereign_depths: READ_REMOTE,
  search_weight_of_wonders: READ_REMOTE,
};

/** "generate_character" -> "Generate character" (sentence case). */
export function titleFor(name: string): string {
  const words = name.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function annotationsFor(name: string): Record<string, boolean> {
  const hints = TOOL_CATALOG[name];
  if (!hints) return {};
  // destructive and idempotent only carry meaning for tools that change something (MCP spec).
  return hints.readOnly
    ? { readOnlyHint: true, openWorldHint: hints.openWorld }
    : {
        readOnlyHint: false,
        destructiveHint: hints.destructive,
        idempotentHint: hints.idempotent,
        openWorldHint: hints.openWorld,
      };
}

/**
 * Registration modules keep calling server.registerTool / registerPrompt unchanged. The proxy
 * fills each tool's title and safety annotations from the catalog (values a module sets win)
 * and, when `enabled` is given, drops disabled tools and the prompts that depend on them.
 */
export function catalogServer(
  server: McpServer,
  enabled: Set<string> | null,
): McpServer {
  const isEnabled = (tool: string) => enabled === null || enabled.has(tool);
  return new Proxy(server, {
    get(target, property, receiver) {
      if (property === "registerTool") {
        return (
          name: string,
          config: { title?: string; annotations?: Record<string, unknown> },
          ...rest: unknown[]
        ) =>
          isEnabled(name)
            ? (target.registerTool as (...args: unknown[]) => unknown)(
                name,
                {
                  ...config,
                  title: config.title ?? titleFor(name),
                  annotations: {
                    ...annotationsFor(name),
                    ...config.annotations,
                  },
                },
                ...rest,
              )
            : undefined;
      }
      if (property === "registerPrompt") {
        return (name: string, ...rest: unknown[]) =>
          (PROMPT_TOOLS[name] ?? []).every(isEnabled)
            ? (target.registerPrompt as (...args: unknown[]) => unknown)(
                name,
                ...rest,
              )
            : undefined;
      }
      const value = Reflect.get(target, property, receiver);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}
