import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  searchArcaneaVault,
  saveToArcaneaVault,
  listArcaneaWorlds,
  getArcaneaBridgeStatus,
} from "../tools/arcanea-web-vault.js";

const VAULT_CLASSIFICATIONS = [
  "character",
  "location",
  "magic",
  "scene",
  "lore",
  "reference",
  "chapter",
  "note",
] as const;

export function registerWebVaultTools(server: McpServer) {
  server.registerTool(
    "search_arcanea_vault",
    {
      description:
        "Search the creator's Arcanea Studio vault — their ingested characters, locations, magic, scenes, lore, chapters, and notes. Semantic search; returns top matches with snippets. Requires ARCANEA_WEB_URL + ARCANEA_SESSION_TOKEN env.",
      inputSchema: {
        query: z.string().min(2).max(400),
        limit: z.number().int().min(1).max(32).optional(),
        worldId: z.string().uuid().optional(),
        classification: z.enum(VAULT_CLASSIFICATIONS).optional(),
      },
    },
    async (args) =>
      searchArcaneaVault(
        args as {
          query: string;
          limit?: number;
          worldId?: string;
          classification?: string;
        },
      ),
  );

  server.registerTool(
    "save_to_arcanea_vault",
    {
      description:
        "Save a piece of creative content to the creator's Arcanea Studio vault. Becomes part of their world graph and retrievable by future chats. Requires ARCANEA_WEB_URL + ARCANEA_SESSION_TOKEN env.",
      inputSchema: {
        title: z.string().min(2).max(180),
        content: z.string().min(10).max(60000),
        classification: z.enum(VAULT_CLASSIFICATIONS),
        tags: z.array(z.string().max(32)).max(10).optional(),
        worldId: z.string().uuid().optional(),
      },
    },
    async (args) =>
      saveToArcaneaVault(
        args as {
          title: string;
          content: string;
          classification: (typeof VAULT_CLASSIFICATIONS)[number];
          tags?: string[];
          worldId?: string;
        },
      ),
  );

  server.registerTool(
    "list_arcanea_worlds",
    {
      description:
        "List the creator's Arcanea Worlds so vault saves can be scoped to a specific world. Requires ARCANEA_WEB_URL + ARCANEA_SESSION_TOKEN env.",
      inputSchema: {},
    },
    async () => listArcaneaWorlds(),
  );

  server.registerTool(
    "get_arcanea_bridge_status",
    {
      description:
        "Check whether the Arcanea web bridge is configured (reads env vars only; it does not contact the server). Use this first before trying the vault tools.",
      inputSchema: {},
    },
    async () => getArcaneaBridgeStatus(),
  );
}
