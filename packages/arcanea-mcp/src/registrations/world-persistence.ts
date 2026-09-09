import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getGraphNodes, getGraphEdges } from "../tools/creation-graph.js";
import {
  saveWorldToDisk,
  loadWorldFromDisk,
  listSavedWorlds,
} from "../tools/world-persistence.js";

export function registerWorldPersistenceTools(server: McpServer) {
  // =========================================================================
  // WORLD PERSISTENCE
  // =========================================================================

  server.registerTool(
    "save_world",
    {
      description:
        "Save your current world to disk so it persists across sessions.",
      inputSchema: z.object({ sessionId: z.string().optional() }),
    },
    async ({ sessionId }) => {
      const sid = sessionId || "default";
      const nodes = getGraphNodes(sid);
      const edges = getGraphEdges(sid);
      saveWorldToDisk(sid, nodes, edges);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                saved: true,
                sessionId: sid,
                nodeCount: nodes.length,
                edgeCount: edges.length,
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
    "load_world",
    {
      description:
        "Load a previously saved world, or list available worlds if no session specified.",
      inputSchema: z.object({ sessionId: z.string().optional() }),
    },
    async ({ sessionId }) => {
      if (!sessionId) {
        const worlds = listSavedWorlds();
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { availableWorlds: worlds, count: worlds.length },
                null,
                2,
              ),
            },
          ],
        };
      }
      const data = loadWorldFromDisk(sessionId);
      if (!data)
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: `No world "${sessionId}" found`,
                available: listSavedWorlds().map((w) => w.sessionId),
              }),
            },
          ],
        };
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                loaded: true,
                sessionId,
                nodeCount: data.nodes.length,
                edgeCount: data.edges.length,
                nodes: data.nodes.map((n) => ({
                  name: n.name,
                  type: n.type,
                  element: n.element,
                })),
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
