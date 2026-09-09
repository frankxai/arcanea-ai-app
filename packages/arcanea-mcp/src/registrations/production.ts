import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  planWorld,
  planBook,
  planGame,
  planMusicProject,
  planCinematicScene,
  generateAssetBrief,
  exportProjectContext,
  listArcaneaStudios,
  getWorkflowRecipe,
} from "../tools/production-planning.js";

const ASSET_KINDS = [
  "character",
  "location",
  "cover",
  "poster",
  "trailer",
  "sprite",
  "album_art",
  "brand_pack",
  "ui",
] as const;

const WORKFLOW_RECIPE_IDS = [
  "book_to_publish",
  "world_to_game",
  "artist_release",
  "cinematic_trailer",
  "campaign_pack",
] as const;

export function registerProductionTools(server: McpServer) {
  // =========================================================================
  // CREATIVE PRODUCTION LAYER
  // Broad studio planning tools for writers, game teams, music/video studios,
  // founders, and agent-native creative teams.
  // =========================================================================

  server.registerTool(
    "plan_world",
    {
      description:
        "Turn an idea into a world production packet: canon, factions, locations, visuals, audio palette, and agent next actions.",
      inputSchema: z.object({
        idea: z.string().min(3).max(1000),
        audience: z.string().max(240).optional(),
        tone: z.string().max(240).optional(),
        scope: z.string().max(160).optional(),
      }),
    },
    async (args) => planWorld(args),
  );

  server.registerTool(
    "plan_book",
    {
      description:
        "Turn an idea into a book production packet: reader promise, bible, chapter spine, sample direction, cover brief, and publish checklist.",
      inputSchema: z.object({
        idea: z.string().min(3).max(1000),
        audience: z.string().max(240).optional(),
        format: z.string().max(160).optional(),
        voice: z.string().max(240).optional(),
      }),
    },
    async (args) => planBook(args),
  );

  server.registerTool(
    "plan_game",
    {
      description:
        "Turn an idea or world bible into a game design packet: player promise, core loop, mechanics, levels, asset kit, and prototype handoff.",
      inputSchema: z.object({
        idea: z.string().min(3).max(1000),
        audience: z.string().max(240).optional(),
        engine: z.string().max(160).optional(),
        playStyle: z.string().max(240).optional(),
      }),
    },
    async (args) => planGame(args),
  );

  server.registerTool(
    "plan_music_project",
    {
      description:
        "Turn an artist, song, or album idea into a music production packet: lore, sonic motifs, cover brief, visualizer plan, and release copy.",
      inputSchema: z.object({
        idea: z.string().min(3).max(1000),
        audience: z.string().max(240).optional(),
        genre: z.string().max(160).optional(),
        releaseType: z.string().max(160).optional(),
      }),
    },
    async (args) => planMusicProject(args),
  );

  server.registerTool(
    "plan_cinematic_scene",
    {
      description:
        "Turn a scene or trailer idea into a cinematic packet: hook, shot list, camera language, references, audio direction, and render prompts.",
      inputSchema: z.object({
        idea: z.string().min(3).max(1000),
        audience: z.string().max(240).optional(),
        duration: z.string().max(80).optional(),
        format: z.string().max(160).optional(),
      }),
    },
    async (args) => planCinematicScene(args),
  );

  server.registerTool(
    "generate_asset_brief",
    {
      description:
        "Create a portable visual or media asset brief for image/video/music tools with style, references, aspect ratio, and production notes.",
      inputSchema: z.object({
        kind: z.enum(ASSET_KINDS),
        subject: z.string().min(3).max(1000),
        style: z.string().max(300).optional(),
        references: z.array(z.string().max(200)).max(12).optional(),
        aspectRatio: z.string().max(40).optional(),
      }),
    },
    async (args) => generateAssetBrief(args),
  );

  server.registerTool(
    "export_project_context",
    {
      description:
        "Package an Arcanea project into a Claude, Codex, Cursor, or generic agent handoff with assets, constraints, and acceptance criteria.",
      inputSchema: z.object({
        projectName: z.string().min(2).max(160),
        goal: z.string().min(3).max(1200),
        targetAgent: z
          .enum(["claude", "codex", "cursor", "generic"])
          .optional(),
        assets: z.array(z.string().max(300)).max(30).optional(),
        constraints: z.array(z.string().max(240)).max(20).optional(),
      }),
    },
    async (args) => exportProjectContext(args),
  );

  server.registerTool(
    "list_arcanea_studios",
    {
      description:
        "List Arcanea studio surfaces, routes, outcomes, and recommended MCP tools.",
      inputSchema: z.object({}),
    },
    async () => listArcaneaStudios(),
  );

  server.registerTool(
    "get_workflow_recipe",
    {
      description:
        "Return a reusable workflow recipe for books, games, artist releases, cinematic trailers, or campaign packs.",
      inputSchema: z.object({
        recipe: z.enum(WORKFLOW_RECIPE_IDS),
      }),
    },
    async (args) => getWorkflowRecipe(args),
  );
}
