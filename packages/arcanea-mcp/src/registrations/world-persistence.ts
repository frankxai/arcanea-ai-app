import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getGraphNodes,
  getGraphEdges,
  restoreGraph,
} from "../tools/creation-graph.js";
import {
  saveWorldToDisk,
  loadWorldFromDisk,
  listSavedWorlds,
} from "../tools/world-persistence.js";
import {
  exportWorldBundle,
  inspectWorldBundle,
  importWorldBundle,
  WORLD_BUNDLE_HANDOFF,
  MAX_WORLD_BUNDLE_BYTES,
} from "../tools/world-transfer.js";

export function registerWorldPersistenceTools(server: McpServer) {
  server.registerTool(
    "export_world_bundle",
    {
      description:
        "Export a bounded, checksummed local creation graph with metadata and a handoff for another agent. Media bytes and hosted world records are not included. This does not publish or certify canon.",
      inputSchema: z.object({ sessionId: z.string() }),
    },
    async ({ sessionId }) => ({
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            bundleJson: exportWorldBundle(sessionId),
            handoff: WORLD_BUNDLE_HANDOFF,
          }),
        },
      ],
    }),
  );
  server.registerTool(
    "inspect_world_bundle",
    {
      description:
        "Validate a portable creation graph without importing it or fetching its media references. A checksum is not author authentication or canon approval.",
      inputSchema: z.object({
        bundleJson: z.string().max(MAX_WORLD_BUNDLE_BYTES),
      }),
    },
    async ({ bundleJson }) => {
      const bundle = inspectWorldBundle(bundleJson);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              valid: true,
              source: bundle.payload.source,
              policy: bundle.payload.policy,
              payloadHash: bundle.integrity.payloadHash,
              nodeCount: bundle.payload.graph.nodes.length,
              edgeCount: bundle.payload.graph.edges.length,
              handoff: WORLD_BUNDLE_HANDOFF,
            }),
          },
        ],
      };
    },
  );
  server.registerTool(
    "import_world_bundle",
    {
      description:
        "Import a validated local creation graph into a new in-memory session. Refuses to replace an existing session. Use save_world separately for disk persistence. Grants no permissions or canon approval.",
      inputSchema: z.object({
        bundleJson: z.string().max(MAX_WORLD_BUNDLE_BYTES),
        targetSessionId: z.string(),
      }),
    },
    async ({ bundleJson, targetSessionId }) => ({
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(importWorldBundle(bundleJson, targetSessionId)),
        },
      ],
    }),
  );
  // =========================================================================
  // WORLD PERSISTENCE
  // =========================================================================

  server.registerTool(
    "save_world",
    {
      description:
        "Save the current world graph to local disk, replacing any saved snapshot with this session id. Journey memory is not included.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
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
        "Restore a saved world graph into memory, replacing the current graph for that session id. Omit the id to list saved worlds. Journey memory is not restored.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
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
      restoreGraph(sessionId, data.nodes, data.edges);
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
