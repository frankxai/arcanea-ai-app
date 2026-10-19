import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  linkCreations,
  getRelatedCreations,
  suggestConnections,
  getGraphSummary,
  exportGraph,
  findPath,
  type RelationshipType,
} from "../tools/creation-graph.js";

const RELATIONSHIP_TYPES = [
  "created_by",
  "mentored_by",
  "located_at",
  "wields",
  "inhabits",
  "guards",
  "opposes",
  "allies_with",
  "transforms_into",
  "derived_from",
  "part_of",
  "same_element",
  "same_house",
  "same_gate",
] as const;

export function registerWorldGraphTools(server: McpServer) {
  // =========================================================================
  // CREATION GRAPH (Relationship Network)
  // =========================================================================

  server.registerTool(
    "link_creations",
    {
      description: "Create a relationship between two creations in your world",
      inputSchema: {
        sourceId: z.string(),
        targetId: z.string(),
        relationship: z.enum(RELATIONSHIP_TYPES),
        strength: z.number().min(0).max(1).optional(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const edge = linkCreations(
        sessionId,
        args.sourceId,
        args.targetId,
        args.relationship as RelationshipType,
        args.strength ?? 0.5,
      );
      if (!edge) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error:
                  "One or both creations not found in the graph. Make sure to generate them first.",
              }),
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                success: true,
                edge,
                message: `Linked creations with '${edge.relationship}' relationship.`,
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
    "get_related",
    {
      description: "Find all creations related to a specific creation",
      inputSchema: {
        creationId: z.string(),
        relationship: z.enum(RELATIONSHIP_TYPES).optional(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const related = getRelatedCreations(
        sessionId,
        args.creationId,
        args.relationship as RelationshipType | undefined,
      );
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                creationId: args.creationId,
                relatedCount: related.length,
                related: related.map((r) => ({
                  name: r.node.name,
                  type: r.node.type,
                  relationship: r.relationship,
                  strength: r.strength,
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

  server.registerTool(
    "suggest_connections",
    {
      description: "Get AI-suggested relationships for a creation",
      inputSchema: {
        creationId: z.string(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const suggestions = suggestConnections(sessionId, args.creationId);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                creationId: args.creationId,
                suggestions: suggestions.map((s) => ({
                  targetName: s.target.name,
                  targetType: s.target.type,
                  suggestedRelationship: s.suggestedRelationship,
                  reason: s.reason,
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

  server.registerTool(
    "get_world_graph",
    {
      description: "Get a summary of your entire created world network",
      inputSchema: {
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const summary = getGraphSummary(sessionId);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                worldSummary: summary,
                description: `Your world contains ${summary.nodeCount} creations connected by ${summary.edgeCount} relationships.`,
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
    "find_path",
    {
      description: "Find the connection path between two creations",
      inputSchema: {
        sourceId: z.string(),
        targetId: z.string(),
        maxDepth: z.number().min(1).max(10).optional(),
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const path = findPath(
        sessionId,
        args.sourceId,
        args.targetId,
        args.maxDepth ?? 5,
      );
      if (!path) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                found: false,
                message: "No connection path found between these creations.",
              }),
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { found: true, pathLength: path.length, path },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "export_world",
    {
      description: "Export your entire world graph for visualization",
      inputSchema: {
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const graph = exportGraph(sessionId);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                exportedAt: new Date().toISOString(),
                nodeCount: graph.nodes.length,
                edgeCount: graph.edges.length,
                graph,
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
