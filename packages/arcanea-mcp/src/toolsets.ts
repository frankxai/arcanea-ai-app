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

/** "core,world" | "all" | undefined or blank (= core) -> enabled tool names. */
export function resolveToolsets(spec: string | undefined): Set<string> {
  const requested = (spec?.trim() || "core")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const groups = requested.includes("all") ? TOOLSET_NAMES : requested;
  const enabled = new Set<string>();
  for (const group of groups) {
    if (!(group in TOOLSETS)) {
      throw new Error(
        `Unknown toolset "${group}". Available: ${TOOLSET_NAMES.join(", ")}, all.`,
      );
    }
    for (const tool of TOOLSETS[group as ToolsetName]) enabled.add(tool);
  }
  return enabled;
}

/**
 * Registration modules keep calling server.registerTool(name, ...); the proxy drops the
 * names that are not enabled, so no module needs to know about toolsets.
 */
export function gateTools(server: McpServer, enabled: Set<string>): McpServer {
  return new Proxy(server, {
    get(target, property, receiver) {
      if (property === "registerTool") {
        return (name: string, ...rest: unknown[]) =>
          enabled.has(name)
            ? (target.registerTool as (...args: unknown[]) => unknown)(
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
