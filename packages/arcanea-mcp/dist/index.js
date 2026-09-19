#!/usr/bin/env node
/**
 * Arcanea MCP Server v3
 * A worldbuilding toolkit for the Arcanea universe.
 * Making magic through AI-human co-creation.
 *
 * Features:
 * - Worldbuilding generators (characters, magic, locations, creatures, artifacts)
 * - Luminor AI companions with Council mode
 * - Bestiary of creative blocks with deep diagnosis
 * - Memory layer for persistent creative journeys
 * - Canon validation and Ten Gates system
 * - Agent orchestration system (inspired by oh-my-opencode)
 * - Creation graph with relationship network
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateCharacter, generateMagicAbility, generateLocation, generateCreature, generateArtifact, generateName, generateStoryPrompt, } from "./tools/generators.js";
import { recordCreation } from "./memory/index.js";
import { addCreationToGraph, linkCreations, getRelatedCreations, suggestConnections, getGraphSummary, exportGraph, findPath, getGraphNodes, getGraphEdges, } from "./tools/creation-graph.js";
import { generateWorldReport, generateConflict, weaveNarrative, generateQuest, analyzeFactions, } from "./tools/world-intelligence.js";
import { saveWorldToDisk, loadWorldFromDisk, listSavedWorlds, } from "./tools/world-persistence.js";
import { characterToImagePrompt, locationToImagePrompt, creatureToImagePrompt, } from "./tools/visual-prompts.js";
import { toolResult } from "./registrations/tool-result.js";
import { registerGuidanceTools, registerCanonTools, } from "./registrations/guidance.js";
import { registerOrchestrationTools } from "./registrations/orchestration.js";
import { registerVisualStyleTools } from "./registrations/visual-style.js";
import { registerProductionTools } from "./registrations/production.js";
import { registerReferences } from "./registrations/references.js";
import { registerWebVaultTools } from "./registrations/web-vault.js";
const ELEMENTS = ["Fire", "Water", "Earth", "Wind", "Void", "Spirit"];
const HOUSES = [
    "Lumina",
    "Nero",
    "Pyros",
    "Aqualis",
    "Terra",
    "Ventus",
    "Synthesis",
];
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
];
const server = new McpServer({ name: "arcanea-mcp", version: "0.3.0" });
// =========================================================================
// WORLDBUILDING GENERATORS
// =========================================================================
server.registerTool("generate_character", {
    description: "Create a character for the Arcanea universe with Gates, Elements, House, and backstory",
    inputSchema: {
        archetype: z.string().optional(),
        primaryElement: z.enum(ELEMENTS).optional(),
        gatesOpen: z.number().min(1).max(10).optional(),
        house: z.enum(HOUSES).optional(),
        nameGender: z.enum(["masculine", "feminine", "neutral"]).optional(),
        sessionId: z.string().optional(),
    },
}, async (args) => {
    const sessionId = args.sessionId ?? "default";
    const result = await generateCharacter(args);
    const parsed = JSON.parse(result.content[0].text);
    const creation = {
        id: Date.now().toString(),
        type: "character",
        name: parsed.name,
        element: parsed.primaryElement,
        gate: parsed.gatesOpen,
        createdAt: new Date(),
        summary: `${parsed.rank} of ${parsed.house}`,
    };
    recordCreation(sessionId, creation);
    addCreationToGraph(sessionId, creation, parsed);
    return toolResult(result);
});
server.registerTool("generate_magic", {
    description: "Design a magical ability based on the Arcanea magic system",
    inputSchema: {
        element: z.enum(ELEMENTS),
        gateLevel: z.number().min(1).max(10),
        purpose: z.string().optional(),
    },
}, async (args) => toolResult(await generateMagicAbility(args)));
server.registerTool("generate_location", {
    description: "Create a location in Arcanea with elemental alignment",
    inputSchema: {
        type: z.string().optional(),
        dominantElement: z.enum(ELEMENTS).optional(),
        alignment: z.enum(["light", "dark", "balanced"]).optional(),
        sessionId: z.string().optional(),
    },
}, async (args) => {
    const sessionId = args.sessionId ?? "default";
    const result = await generateLocation(args);
    const parsed = JSON.parse(result.content[0].text);
    const creation = {
        id: Date.now().toString(),
        type: "location",
        name: parsed.name,
        element: parsed.dominantElement,
        createdAt: new Date(),
        summary: parsed.type,
    };
    recordCreation(sessionId, creation);
    addCreationToGraph(sessionId, creation, parsed);
    return toolResult(result);
});
server.registerTool("generate_creature", {
    description: "Design a magical creature for the Arcanea world",
    inputSchema: {
        element: z.enum(ELEMENTS).optional(),
        size: z.enum(["tiny", "small", "medium", "large", "massive"]).optional(),
        temperament: z
            .enum(["hostile", "neutral", "friendly", "sacred"])
            .optional(),
        sessionId: z.string().optional(),
    },
}, async (args) => {
    const sessionId = args.sessionId ?? "default";
    const result = await generateCreature(args);
    const parsed = JSON.parse(result.content[0].text);
    const creation = {
        id: Date.now().toString(),
        type: "creature",
        name: parsed.name,
        element: parsed.element,
        createdAt: new Date(),
        summary: parsed.species,
    };
    recordCreation(sessionId, creation);
    addCreationToGraph(sessionId, creation, parsed);
    return toolResult(result);
});
server.registerTool("generate_artifact", {
    description: "Create a magical artifact with history and powers",
    inputSchema: {
        type: z.string().optional(),
        element: z.enum(ELEMENTS).optional(),
        power: z.enum(["minor", "moderate", "major", "legendary"]).optional(),
        sessionId: z.string().optional(),
    },
}, async (args) => {
    const sessionId = args.sessionId ?? "default";
    const result = await generateArtifact(args);
    const parsed = JSON.parse(result.content[0].text);
    const creation = {
        id: Date.now().toString(),
        type: "artifact",
        name: parsed.name,
        element: parsed.element,
        createdAt: new Date(),
        summary: parsed.type,
    };
    recordCreation(sessionId, creation);
    addCreationToGraph(sessionId, creation, parsed);
    return toolResult(result);
});
server.registerTool("generate_name", {
    description: "Generate Arcanean names following the language system",
    inputSchema: {
        element: z.string().optional(),
        gender: z.enum(["masculine", "feminine", "neutral"]).optional(),
        type: z.enum(["character", "place", "artifact", "creature"]).optional(),
        count: z.number().min(1).max(20).optional(),
    },
}, async (args) => toolResult(await generateName(args)));
server.registerTool("generate_story_prompt", {
    description: "Create an inspiring story prompt set in Arcanea",
    inputSchema: {
        theme: z.string().optional(),
        gate: z.number().min(1).max(10).optional(),
        includeConflict: z.boolean().optional(),
    },
}, async (args) => toolResult(await generateStoryPrompt(args)));
registerGuidanceTools(server);
// =========================================================================
// CREATION GRAPH (Relationship Network)
// =========================================================================
server.registerTool("link_creations", {
    description: "Create a relationship between two creations in your world",
    inputSchema: {
        sourceId: z.string(),
        targetId: z.string(),
        relationship: z.enum(RELATIONSHIP_TYPES),
        strength: z.number().min(0).max(1).optional(),
        sessionId: z.string().optional(),
    },
}, async (args) => {
    const sessionId = args.sessionId ?? "default";
    const edge = linkCreations(sessionId, args.sourceId, args.targetId, args.relationship, args.strength ?? 0.5);
    if (!edge) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        error: "One or both creations not found in the graph. Make sure to generate them first.",
                    }),
                },
            ],
        };
    }
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    success: true,
                    edge,
                    message: `Linked creations with '${edge.relationship}' relationship.`,
                }, null, 2),
            },
        ],
    };
});
server.registerTool("get_related", {
    description: "Find all creations related to a specific creation",
    inputSchema: {
        creationId: z.string(),
        relationship: z.enum(RELATIONSHIP_TYPES).optional(),
        sessionId: z.string().optional(),
    },
}, async (args) => {
    const sessionId = args.sessionId ?? "default";
    const related = getRelatedCreations(sessionId, args.creationId, args.relationship);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    creationId: args.creationId,
                    relatedCount: related.length,
                    related: related.map((r) => ({
                        name: r.node.name,
                        type: r.node.type,
                        relationship: r.relationship,
                        strength: r.strength,
                    })),
                }, null, 2),
            },
        ],
    };
});
server.registerTool("suggest_connections", {
    description: "Get AI-suggested relationships for a creation",
    inputSchema: {
        creationId: z.string(),
        sessionId: z.string().optional(),
    },
}, async (args) => {
    const sessionId = args.sessionId ?? "default";
    const suggestions = suggestConnections(sessionId, args.creationId);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    creationId: args.creationId,
                    suggestions: suggestions.map((s) => ({
                        targetName: s.target.name,
                        targetType: s.target.type,
                        suggestedRelationship: s.suggestedRelationship,
                        reason: s.reason,
                    })),
                }, null, 2),
            },
        ],
    };
});
server.registerTool("get_world_graph", {
    description: "Get a summary of your entire created world network",
    inputSchema: {
        sessionId: z.string().optional(),
    },
}, async (args) => {
    const sessionId = args.sessionId ?? "default";
    const summary = getGraphSummary(sessionId);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    worldSummary: summary,
                    description: `Your world contains ${summary.nodeCount} creations connected by ${summary.edgeCount} relationships.`,
                }, null, 2),
            },
        ],
    };
});
server.registerTool("find_path", {
    description: "Find the connection path between two creations",
    inputSchema: {
        sourceId: z.string(),
        targetId: z.string(),
        maxDepth: z.number().min(1).max(10).optional(),
        sessionId: z.string().optional(),
    },
}, async (args) => {
    const sessionId = args.sessionId ?? "default";
    const path = findPath(sessionId, args.sourceId, args.targetId, args.maxDepth ?? 5);
    if (!path) {
        return {
            content: [
                {
                    type: "text",
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
                type: "text",
                text: JSON.stringify({ found: true, pathLength: path.length, path }, null, 2),
            },
        ],
    };
});
server.registerTool("export_world", {
    description: "Export your entire world graph for visualization",
    inputSchema: {
        sessionId: z.string().optional(),
    },
}, async (args) => {
    const sessionId = args.sessionId ?? "default";
    const graph = exportGraph(sessionId);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    exportedAt: new Date().toISOString(),
                    nodeCount: graph.nodes.length,
                    edgeCount: graph.edges.length,
                    graph,
                }, null, 2),
            },
        ],
    };
});
registerOrchestrationTools(server);
registerCanonTools(server);
registerVisualStyleTools(server);
// =========================================================================
// WORLD INTELLIGENCE — The Brain of Arcanea
// =========================================================================
server.registerTool("world_report", {
    description: "Deep analysis of your world's health, gaps, and next steps. Tells you what to build next and why. The most important tool in the system — use it after every few creations.",
    inputSchema: z.object({
        sessionId: z.string().optional().describe("Session to analyze"),
    }),
}, async ({ sessionId }) => {
    const sid = sessionId || "default";
    const report = generateWorldReport(sid);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    ...report,
                    message: `World Health: ${report.health}/100 (${report.grade}). ${report.gaps.length} gaps found. ${report.nextActions.length} recommended actions.`,
                }, null, 2),
            },
        ],
    };
});
server.registerTool("generate_conflict", {
    description: "Analyze your characters and generate a morally complex conflict with stakes, escalation, and multiple possible resolutions. Creates real narrative tension, not generic 'good vs evil'.",
    inputSchema: z.object({
        sessionId: z
            .string()
            .optional()
            .describe("Session with characters to analyze"),
    }),
}, async ({ sessionId }) => {
    const sid = sessionId || "default";
    const conflict = generateConflict(sid);
    if (!conflict) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        error: "Need at least 2 characters to generate conflict. Create some characters first.",
                        suggestion: "Use generate_character to create 2-3 characters with different elements.",
                    }),
                },
            ],
        };
    }
    return {
        content: [
            { type: "text", text: JSON.stringify(conflict, null, 2) },
        ],
    };
});
server.registerTool("weave_narrative", {
    description: "Generate a complete multi-act story arc from your existing world state. Analyzes your characters, locations, and artifacts to create a plot with acts, stakes, themes, and key events.",
    inputSchema: z.object({
        sessionId: z
            .string()
            .optional()
            .describe("Session with world to narrate"),
    }),
}, async ({ sessionId }) => {
    const sid = sessionId || "default";
    const arc = weaveNarrative(sid);
    if (!arc) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        error: "Need at least 2 characters to weave a narrative. Build your cast first.",
                        suggestion: "Create a protagonist and an antagonist, then call weave_narrative again.",
                    }),
                },
            ],
        };
    }
    return {
        content: [{ type: "text", text: JSON.stringify(arc, null, 2) }],
    };
});
server.registerTool("generate_quest", {
    description: "Generate a quest from your world state — hooks, objectives, complications, and rewards based on your existing characters, locations, and artifacts.",
    inputSchema: z.object({ sessionId: z.string().optional() }),
}, async ({ sessionId }) => {
    const sid = sessionId || "default";
    const quest = generateQuest(sid);
    if (!quest)
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        error: "Need at least 2 creations to generate a quest.",
                    }),
                },
            ],
        };
    return {
        content: [
            { type: "text", text: JSON.stringify(quest, null, 2) },
        ],
    };
});
server.registerTool("analyze_factions", {
    description: "Analyze faction dynamics in your world — groups by element, power balance, tensions, and predictions for conflict or stability.",
    inputSchema: z.object({ sessionId: z.string().optional() }),
}, async ({ sessionId }) => {
    const sid = sessionId || "default";
    const report = analyzeFactions(sid);
    return {
        content: [
            { type: "text", text: JSON.stringify(report, null, 2) },
        ],
    };
});
// =========================================================================
// WORLD PERSISTENCE
// =========================================================================
server.registerTool("save_world", {
    description: "Save your current world to disk so it persists across sessions.",
    inputSchema: z.object({ sessionId: z.string().optional() }),
}, async ({ sessionId }) => {
    const sid = sessionId || "default";
    const nodes = getGraphNodes(sid);
    const edges = getGraphEdges(sid);
    saveWorldToDisk(sid, nodes, edges);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    saved: true,
                    sessionId: sid,
                    nodeCount: nodes.length,
                    edgeCount: edges.length,
                }, null, 2),
            },
        ],
    };
});
server.registerTool("load_world", {
    description: "Load a previously saved world, or list available worlds if no session specified.",
    inputSchema: z.object({ sessionId: z.string().optional() }),
}, async ({ sessionId }) => {
    if (!sessionId) {
        const worlds = listSavedWorlds();
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ availableWorlds: worlds, count: worlds.length }, null, 2),
                },
            ],
        };
    }
    const data = loadWorldFromDisk(sessionId);
    if (!data)
        return {
            content: [
                {
                    type: "text",
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
                type: "text",
                text: JSON.stringify({
                    loaded: true,
                    sessionId,
                    nodeCount: data.nodes.length,
                    edgeCount: data.edges.length,
                    nodes: data.nodes.map((n) => ({
                        name: n.name,
                        type: n.type,
                        element: n.element,
                    })),
                }, null, 2),
            },
        ],
    };
});
// =========================================================================
// VISUAL BRIDGE — Creation → Image Prompt
// =========================================================================
server.registerTool("visualize_character", {
    description: "Generate an image generation prompt from a character blueprint. Output is ready for ComfyUI, Midjourney, DALL-E, or Canva. Creates a visual identity for your character based on their element, rank, house, and personality.",
    inputSchema: z.object({
        name: z.string().describe("Character name"),
        primaryElement: z
            .string()
            .describe("Primary element: Fire, Water, Earth, Wind, Void, Spirit"),
        secondaryElement: z.string().optional(),
        house: z.string().describe("Academy house"),
        rank: z
            .string()
            .describe("Magic rank: Apprentice, Mage, Master, Archmage, Luminor"),
        gatesOpen: z.number().optional(),
        patronGuardian: z
            .object({ name: z.string(), domain: z.string() })
            .optional(),
        godbeast: z.object({ name: z.string(), form: z.string() }).optional(),
        traits: z.array(z.string()).optional(),
        style: z
            .string()
            .optional()
            .describe("Art style override: e.g. 'anime', 'oil painting', 'watercolor'"),
    }),
}, async (args) => {
    const result = characterToImagePrompt({
        name: args.name,
        primaryElement: args.primaryElement,
        secondaryElement: args.secondaryElement,
        house: args.house,
        rank: args.rank,
        gatesOpen: args.gatesOpen || 1,
        patronGuardian: args.patronGuardian,
        godbeast: args.godbeast,
        personality: args.traits ? { traits: args.traits } : undefined,
    }, args.style);
    return { content: [{ type: "text", text: result }] };
});
server.registerTool("visualize_location", {
    description: "Generate an image prompt for a location scene. Output is ready for any image generation tool.",
    inputSchema: z.object({
        name: z.string(),
        dominantElement: z.string(),
        type: z
            .string()
            .describe("Location type: academy, sanctuary, ruins, village, fortress, etc."),
        alignment: z.enum(["light", "dark", "balanced"]).optional(),
        style: z.string().optional(),
    }),
}, async (args) => {
    const result = locationToImagePrompt({
        name: args.name,
        dominantElement: args.dominantElement,
        type: args.type,
        alignment: args.alignment || "balanced",
    }, args.style);
    return { content: [{ type: "text", text: result }] };
});
server.registerTool("visualize_creature", {
    description: "Generate an image prompt for a creature illustration. Output is ready for any image generation tool.",
    inputSchema: z.object({
        name: z.string(),
        element: z.string(),
        size: z.enum(["tiny", "small", "medium", "large", "massive"]).optional(),
        temperament: z
            .enum(["hostile", "neutral", "friendly", "sacred"])
            .optional(),
        species: z.string().optional(),
        style: z.string().optional(),
    }),
}, async (args) => {
    const result = creatureToImagePrompt({
        name: args.name,
        element: args.element,
        size: args.size || "medium",
        temperament: args.temperament || "neutral",
        species: args.species,
    }, args.style);
    return { content: [{ type: "text", text: result }] };
});
registerProductionTools(server);
registerReferences(server);
registerWebVaultTools(server);
// =========================================================================
// EXPORTS
// =========================================================================
export { server };
export function createServer() {
    return server;
}
//# sourceMappingURL=index.js.map