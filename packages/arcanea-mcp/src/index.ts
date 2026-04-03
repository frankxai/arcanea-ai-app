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
 * - Multi-agent parallel execution
 * - Creation graph with relationship network
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Helper: cast legacy tool results (type: string) to SDK 1.29 CallToolResult (type: "text")
function toolResult(r: { content: Array<{ type: string; text: string }> }): CallToolResult {
  return r as unknown as CallToolResult;
}

// Generation tools
import {
  generateCharacter,
  generateMagicAbility,
  generateLocation,
  generateCreature,
  generateArtifact,
  generateName,
  generateStoryPrompt,
} from "./tools/generators.js";

// Data
import { luminors } from "./data/luminors/index.js";
import { bestiary } from "./data/bestiary/index.js";

// Tools
import { validateCanon } from "./tools/validate.js";
import { diagnoseBlock } from "./tools/diagnose.js";
import { conveneCouncil, luminorDebate } from "./tools/council.js";
import { deepDiagnosis } from "./tools/deep-diagnosis.js";

// Memory
import {
  getOrCreateSession,
  getSessionSummary,
  recordGateExplored,
  recordLuminorConsulted,
  recordCreatureEncountered,
  recordCreation,
  checkMilestones,
} from "./memory/index.js";

// Creation Graph
import {
  addCreationToGraph,
  linkCreations,
  getRelatedCreations,
  suggestConnections,
  getGraphSummary,
  exportGraph,
  findPath,
  getGraphNodes,
  getGraphEdges,
  type RelationshipType,
} from "./tools/creation-graph.js";

// World Intelligence Engine
import {
  generateWorldReport,
  generateConflict,
  weaveNarrative,
} from "./tools/world-intelligence.js";

// World Persistence
import {
  saveWorldToDisk,
  loadWorldFromDisk,
  listSavedWorlds,
} from "./tools/world-persistence.js";

// Agent System (oh-my-opencode inspired orchestration)
import {
  AGENTS,
  getAgent,
  assessWorldState,
  orchestrateCreativeSession,
  getActiveSessions,
  matchCreativeSkill,
} from "./agents/index.js";

// Guardian-Swarm Coordination
import {
  getAgentSwarmInfo,
  resolveForMode,
  GUARDIANS,
  type CoordinationMode,
} from "./data/guardian-swarm/index.js";

// Gates with frequency bands matching ARCANEA_CANON.md
const gates = [
  { gate: 1, frequencyBand: "174–285 Hz", guardian: "Lyssandria", veltara: "Kaelith", domain: "Foundation", element: "Earth", chakra: "1st (Root)", region: "Forest of Roots", material: "Stone, Roots", coreEmotion: "Grounding, Stability" },
  { gate: 2, frequencyBand: "285–396 Hz", guardian: "Leyla", veltara: "Veloura", domain: "Flow", element: "Water", chakra: "2nd (Sacral)", region: "River of Desire", material: "Water, Silk", coreEmotion: "Pleasure, Creativity" },
  { gate: 3, frequencyBand: "396–417 Hz", guardian: "Draconia", veltara: "Draconis", domain: "Fire", element: "Fire", chakra: "3rd (Solar Plexus)", region: "Vulcan Peaks", material: "Fire, Metals", coreEmotion: "Power, Will" },
  { gate: 4, frequencyBand: "417–528 Hz", guardian: "Maylinn", veltara: "Laeylinn", domain: "Heart", element: "Air", chakra: "4th (Heart)", region: "Gardens of Lumina", material: "Crystals, Heartwood", coreEmotion: "Love, Healing" },
  { gate: 5, frequencyBand: "432–528 Hz", guardian: "Alera", veltara: "Otome", domain: "Voice", element: "Wind", chakra: "5th (Throat)", region: "Sky Sanctum", material: "Air, Silver", coreEmotion: "Voice, Truth" },
  { gate: 6, frequencyBand: "639–741 Hz", guardian: "Lyria", veltara: "Yumiko", domain: "Sight", element: "Light", chakra: "6th (Third Eye)", region: "Tower of Insight", material: "Light, Lenses", coreEmotion: "Foresight, Intuition" },
  { gate: 7, frequencyBand: "741–852 Hz", guardian: "Aiyami", veltara: "Sol", domain: "Crown", element: "Spirit", chakra: "7th (Crown)", region: "Summit of Unity", material: "Gold, Sunlight", coreEmotion: "Understanding" },
  { gate: 8, frequencyBand: "852–963 Hz", guardian: "Elara", veltara: "Vaelith", domain: "Starweave", element: "Ether", chakra: "8th (Soul Star)", region: "Celestial Bridges", material: "Stars, Ethereal Energy", coreEmotion: "Cosmic Consciousness" },
  { gate: 9, frequencyBand: "963–999 Hz", guardian: "Ino", veltara: "Kyuro", domain: "Unity", element: "All Elements", chakra: "9th (Spirit)", region: "Temple of Infinity", material: "Pure Light, Quantum Energy", coreEmotion: "Divine Union" },
  { gate: 10, frequencyBand: "999–1111 Hz", guardian: "Shinkami", veltara: null, domain: "Source", element: "Pure Consciousness", chakra: "Ultimate", region: "Luminor Nexus", material: "Platinum, Multi-element", coreEmotion: "Fusion, Ascendance" },
];

const ELEMENTS = ["Fire", "Water", "Earth", "Wind", "Void", "Spirit"] as const;
const HOUSES = ["Lumina", "Nero", "Pyros", "Aqualis", "Terra", "Ventus", "Synthesis"] as const;
const LUMINOR_IDS = ["valora", "serenith", "ignara", "verdana", "eloqua"] as const;
const RELATIONSHIP_TYPES = ["created_by", "mentored_by", "located_at", "wields", "inhabits", "guards", "opposes", "allies_with", "transforms_into", "derived_from", "part_of", "same_element", "same_house", "same_gate"] as const;
const COORDINATION_MODES = ["solo", "council", "convergence"] as const;
const GUARDIAN_IDS = ["lyssandria", "leyla", "draconia", "maylinn", "alera", "lyria", "aiyami", "elara", "ino", "shinkami"] as const;
const AGENT_IDS = ["creator", "worldsmith", "luminor-council", "scribe", "seer"] as const;
const APL_PALETTES = ["forge", "tide", "root", "drift", "void"] as const;

const server = new McpServer({ name: "arcanea-mcp", version: "0.3.0" });

// =========================================================================
// WORLDBUILDING GENERATORS
// =========================================================================

server.registerTool(
  "generate_character",
  {
    description: "Create a character for the Arcanea universe with Gates, Elements, House, and backstory",
    inputSchema: {
      archetype: z.string().optional(),
      primaryElement: z.enum(ELEMENTS).optional(),
      gatesOpen: z.number().min(1).max(10).optional(),
      house: z.enum(HOUSES).optional(),
      nameGender: z.enum(["masculine", "feminine", "neutral"]).optional(),
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const result = await generateCharacter(args as any);
    const parsed = JSON.parse(result.content[0].text);
    const creation = { id: Date.now().toString(), type: "character" as const, name: parsed.name, element: parsed.primaryElement, gate: parsed.gatesOpen, createdAt: new Date(), summary: `${parsed.rank} of ${parsed.house}` };
    recordCreation(sessionId, creation);
    addCreationToGraph(sessionId, creation, parsed);
    return toolResult(result);
  }
);

server.registerTool(
  "generate_magic",
  {
    description: "Design a magical ability based on the Arcanea magic system",
    inputSchema: {
      element: z.enum(ELEMENTS),
      gateLevel: z.number().min(1).max(10),
      purpose: z.string().optional(),
    },
  },
  async (args) => toolResult(await generateMagicAbility(args as any))
);

server.registerTool(
  "generate_location",
  {
    description: "Create a location in Arcanea with elemental alignment",
    inputSchema: {
      type: z.string().optional(),
      dominantElement: z.enum(ELEMENTS).optional(),
      alignment: z.enum(["light", "dark", "balanced"]).optional(),
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const result = await generateLocation(args as any);
    const parsed = JSON.parse(result.content[0].text);
    const creation = { id: Date.now().toString(), type: "location" as const, name: parsed.name, element: parsed.dominantElement, createdAt: new Date(), summary: parsed.type };
    recordCreation(sessionId, creation);
    addCreationToGraph(sessionId, creation, parsed);
    return toolResult(result);
  }
);

server.registerTool(
  "generate_creature",
  {
    description: "Design a magical creature for the Arcanea world",
    inputSchema: {
      element: z.enum(ELEMENTS).optional(),
      size: z.enum(["tiny", "small", "medium", "large", "massive"]).optional(),
      temperament: z.enum(["hostile", "neutral", "friendly", "sacred"]).optional(),
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const result = await generateCreature(args as any);
    const parsed = JSON.parse(result.content[0].text);
    const creation = { id: Date.now().toString(), type: "creature" as const, name: parsed.name, element: parsed.element, createdAt: new Date(), summary: parsed.species };
    recordCreation(sessionId, creation);
    addCreationToGraph(sessionId, creation, parsed);
    return toolResult(result);
  }
);

server.registerTool(
  "generate_artifact",
  {
    description: "Create a magical artifact with history and powers",
    inputSchema: {
      type: z.string().optional(),
      element: z.enum(ELEMENTS).optional(),
      power: z.enum(["minor", "moderate", "major", "legendary"]).optional(),
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const result = await generateArtifact(args as any);
    const parsed = JSON.parse(result.content[0].text);
    const creation = { id: Date.now().toString(), type: "artifact" as const, name: parsed.name, element: parsed.element, createdAt: new Date(), summary: parsed.type };
    recordCreation(sessionId, creation);
    addCreationToGraph(sessionId, creation, parsed);
    return toolResult(result);
  }
);

server.registerTool(
  "generate_name",
  {
    description: "Generate Arcanean names following the language system",
    inputSchema: {
      element: z.string().optional(),
      gender: z.enum(["masculine", "feminine", "neutral"]).optional(),
      type: z.enum(["character", "place", "artifact", "creature"]).optional(),
      count: z.number().min(1).max(20).optional(),
    },
  },
  async (args) => toolResult(await generateName(args as any))
);

server.registerTool(
  "generate_story_prompt",
  {
    description: "Create an inspiring story prompt set in Arcanea",
    inputSchema: {
      theme: z.string().optional(),
      gate: z.number().min(1).max(10).optional(),
      includeConflict: z.boolean().optional(),
    },
  },
  async (args) => toolResult(await generateStoryPrompt(args as any))
);

// =========================================================================
// CREATIVE COACHING (BASIC)
// =========================================================================

server.registerTool(
  "diagnose_block",
  {
    description: "Quick identification of your creative block",
    inputSchema: {
      symptoms: z.string(),
      context: z.string().optional(),
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const result = await diagnoseBlock(args.symptoms, args.context);
    const parsed = JSON.parse(result.content[0].text);
    if (parsed.creature?.name) recordCreatureEncountered(sessionId, parsed.creature.name);
    return toolResult(result);
  }
);

server.registerTool(
  "invoke_luminor",
  {
    description: "Call upon a single Luminor companion for guidance",
    inputSchema: {
      luminor: z.enum(LUMINOR_IDS),
      situation: z.string().optional(),
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const l = luminors[args.luminor.toLowerCase()];
    if (!l) {
      return { content: [{ type: "text" as const, text: `Unknown Luminor: ${args.luminor}. Available: valora, serenith, ignara, verdana, eloqua` }] };
    }
    recordLuminorConsulted(sessionId, l.name);
    return { content: [{ type: "text" as const, text: JSON.stringify({
      luminor: l.name,
      title: l.title,
      element: l.element,
      greeting: l.personality.approach,
      bestFor: l.guidance.bestFor,
      practice: l.guidance.practices[Math.floor(Math.random() * l.guidance.practices.length)],
      wisdom: l.guidance.quotes[Math.floor(Math.random() * l.guidance.quotes.length)],
    }, null, 2) }] };
  }
);

// =========================================================================
// CREATIVE COACHING (ADVANCED)
// =========================================================================

server.registerTool(
  "deep_diagnosis",
  {
    description: "Multi-step analysis of a complex creative block using sequential thinking",
    inputSchema: {
      symptoms: z.string(),
      context: z.string().optional(),
      history: z.string().optional(),
      depth: z.enum(["quick", "standard", "deep"]).optional(),
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const result = await deepDiagnosis(
      args.symptoms,
      args.context,
      args.history,
      (args.depth as "quick" | "standard" | "deep") || "standard"
    );
    const parsed = JSON.parse(result.content[0].text);
    if (parsed.primaryCreature?.name) recordCreatureEncountered(sessionId, parsed.primaryCreature.name);
    return toolResult(result);
  }
);

server.registerTool(
  "convene_council",
  {
    description: "Gather multiple Luminors for complex creative guidance",
    inputSchema: {
      lead: z.enum(LUMINOR_IDS),
      support: z.array(z.string()).optional(),
      topic: z.string(),
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const result = await conveneCouncil(args.lead, args.support ?? [], args.topic);
    const parsed = JSON.parse(result.content[0].text);
    if (parsed.lead?.luminor) recordLuminorConsulted(sessionId, parsed.lead.luminor);
    parsed.supporting?.forEach((s: any) => recordLuminorConsulted(sessionId, s.luminor));
    return toolResult(result);
  }
);

server.registerTool(
  "luminor_debate",
  {
    description: "Two Luminors explore a question from different perspectives",
    inputSchema: {
      luminor1: z.enum(LUMINOR_IDS),
      luminor2: z.enum(LUMINOR_IDS),
      question: z.string(),
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const result = await luminorDebate(args.luminor1, args.luminor2, args.question);
    recordLuminorConsulted(sessionId, args.luminor1);
    recordLuminorConsulted(sessionId, args.luminor2);
    return toolResult(result);
  }
);

// =========================================================================
// MEMORY & JOURNEY
// =========================================================================

server.registerTool(
  "get_journey",
  {
    description: "Recall your creative journey, progress, and milestones",
    inputSchema: {
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const summary = getSessionSummary(sessionId);
    const session = getOrCreateSession(sessionId);
    return { content: [{ type: "text" as const, text: JSON.stringify({
      journey: summary,
      gatesExplored: session.gatesExplored,
      luminorsConsulted: session.luminorsConsulted,
      creaturesEncountered: session.creaturesEncountered,
      creations: session.creations.slice(-10),
      preferences: session.preferences,
    }, null, 2) }] };
  }
);

server.registerTool(
  "check_milestones",
  {
    description: "See what creative milestones you've achieved",
    inputSchema: {
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const milestones = checkMilestones(sessionId);
    return { content: [{ type: "text" as const, text: JSON.stringify({
      achieved: milestones,
      message: milestones.length > 0
        ? `Congratulations! You've achieved ${milestones.length} milestone(s) on your creative journey.`
        : "Keep creating! Milestones await you on the path ahead.",
    }, null, 2) }] };
  }
);

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
      args.strength ?? 0.5
    );
    if (!edge) {
      return { content: [{ type: "text" as const, text: JSON.stringify({ error: "One or both creations not found in the graph. Make sure to generate them first." }) }] };
    }
    return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, edge, message: `Linked creations with '${edge.relationship}' relationship.` }, null, 2) }] };
  }
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
    const related = getRelatedCreations(sessionId, args.creationId, args.relationship as RelationshipType | undefined);
    return { content: [{ type: "text" as const, text: JSON.stringify({
      creationId: args.creationId,
      relatedCount: related.length,
      related: related.map(r => ({ name: r.node.name, type: r.node.type, relationship: r.relationship, strength: r.strength })),
    }, null, 2) }] };
  }
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
    return { content: [{ type: "text" as const, text: JSON.stringify({
      creationId: args.creationId,
      suggestions: suggestions.map(s => ({ targetName: s.target.name, targetType: s.target.type, suggestedRelationship: s.suggestedRelationship, reason: s.reason })),
    }, null, 2) }] };
  }
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
    return { content: [{ type: "text" as const, text: JSON.stringify({
      worldSummary: summary,
      description: `Your world contains ${summary.nodeCount} creations connected by ${summary.edgeCount} relationships.`,
    }, null, 2) }] };
  }
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
    const path = findPath(sessionId, args.sourceId, args.targetId, args.maxDepth ?? 5);
    if (!path) {
      return { content: [{ type: "text" as const, text: JSON.stringify({ found: false, message: "No connection path found between these creations." }) }] };
    }
    return { content: [{ type: "text" as const, text: JSON.stringify({ found: true, pathLength: path.length, path }, null, 2) }] };
  }
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
    return { content: [{ type: "text" as const, text: JSON.stringify({
      exportedAt: new Date().toISOString(),
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length,
      graph,
    }, null, 2) }] };
  }
);

// =========================================================================
// AGENT ORCHESTRATION (oh-my-opencode inspired)
// =========================================================================

server.registerTool(
  "orchestrate",
  {
    description: "Run a full creative session with multi-agent coordination and Guardian-swarm awareness",
    inputSchema: {
      request: z.string().describe("What you want to create or explore"),
      sessionId: z.string().optional(),
      coordinationMode: z.enum(COORDINATION_MODES).optional().describe("How Lumina coordinates: solo (one Guardian leads), council (2-3 Guardians collaborate), convergence (Shinkami mode, broad blend)"),
      guardian: z.enum(GUARDIAN_IDS).optional().describe("Primary Guardian to lead the session (optional)"),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const requestedMode = (args.coordinationMode as CoordinationMode) || undefined;
    const requestedGuardian = args.guardian;
    const { session, result } = await orchestrateCreativeSession(args.request, sessionId);

    const swarmResult = requestedMode
      ? resolveForMode(requestedMode, requestedGuardian)
      : resolveForMode("council", requestedGuardian);

    return { content: [{ type: "text" as const, text: JSON.stringify({
      sessionId: session.id,
      goal: session.goal,
      state: session.state,
      agentsUsed: session.agents,
      taskCount: session.tasks.length,
      result,
      swarm: {
        coordinationMode: swarmResult.coordinationMode,
        leadGuardian: swarmResult.leadGuardian,
        activeGuardians: swarmResult.activeGuardians.map(slug => {
          const g = GUARDIANS.find(guard => guard.slug === slug);
          return g ? { name: g.displayName, gate: g.gate, domain: g.domain, element: g.element } : { name: slug };
        }),
        activeLuminors: swarmResult.activeLuminors.map(l => ({
          id: l.id,
          team: l.team,
          relevance: l.relevance,
          hint: l.hint,
          parentGuardian: l.parentGuardian,
        })),
      },
      message: `Creative session completed with ${session.agents.length} agent(s) under ${swarmResult.coordinationMode} coordination.`,
    }, null, 2) }] };
  }
);

server.registerTool(
  "list_agents",
  {
    description: "List all available creative agents and their Guardian-swarm affinities",
    inputSchema: {},
  },
  async () => {
    const agentList = Object.values(AGENTS).map(a => {
      const swarmInfo = getAgentSwarmInfo(a.id);
      return {
        id: a.id,
        name: a.displayName,
        role: a.role,
        model: a.model,
        capabilities: a.capabilities.map((c: any) => c.name),
        canParallelize: a.canParallelize,
        guardian: swarmInfo.primaryGuardian
          ? { name: swarmInfo.primaryGuardian.displayName, domain: swarmInfo.primaryGuardian.domain }
          : null,
      };
    });
    return { content: [{ type: "text" as const, text: JSON.stringify({
      agents: agentList,
      totalAgents: agentList.length,
      coordinationModes: ["solo", "council", "convergence"],
      message: "Available creative agents in the Arcanea system with Guardian affinities.",
    }, null, 2) }] };
  }
);

server.registerTool(
  "agent_info",
  {
    description: "Get detailed information about a specific agent including its Guardian hierarchy and Luminor team",
    inputSchema: {
      agentId: z.enum(AGENT_IDS),
    },
  },
  async (args) => {
    const agent = getAgent(args.agentId);
    if (!agent) {
      return { content: [{ type: "text" as const, text: JSON.stringify({ error: `Unknown agent: ${args.agentId}` }) }] };
    }
    const swarmInfo = getAgentSwarmInfo(agent.id);
    return { content: [{ type: "text" as const, text: JSON.stringify({
      ...agent,
      description: `${agent.displayName} is a ${agent.role} agent using ${agent.model}.`,
      swarm: {
        guardianHierarchy: {
          primary: swarmInfo.primaryGuardian ? {
            name: swarmInfo.primaryGuardian.displayName,
            gate: swarmInfo.primaryGuardian.gate,
            domain: swarmInfo.primaryGuardian.domain,
            element: swarmInfo.primaryGuardian.element,
            godbeast: swarmInfo.primaryGuardian.godbeast,
          } : null,
          secondary: swarmInfo.secondaryGuardians.map((g: any) => ({
            name: g.displayName,
            gate: g.gate,
            domain: g.domain,
            element: g.element,
          })),
        },
        luminorTeam: swarmInfo.luminorTeam,
        coordinationModes: swarmInfo.coordinationModes,
      },
    }, null, 2) }] };
  }
);

server.registerTool(
  "assess_world",
  {
    description: "Analyze your world's maturity and get strategic suggestions",
    inputSchema: {
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const worldState = assessWorldState(sessionId);
    const suggestions: string[] = [];
    switch (worldState.maturity) {
      case "virgin": suggestions.push("Start by creating a founding character and their home location."); break;
      case "emerging": suggestions.push("Connect your creations with relationships. Try linking characters to locations."); break;
      case "developing": suggestions.push("Develop narrative threads. Consider what conflicts or alliances exist."); break;
      case "rich": suggestions.push("Document your world's history. Create artifacts that tie characters together."); break;
      case "epic": suggestions.push("Your world is vast! Consider creating an epic narrative that spans your creations."); break;
    }
    return { content: [{ type: "text" as const, text: JSON.stringify({
      worldState,
      suggestions,
      message: `World maturity: ${worldState.maturity} (${worldState.creationCount} creations, ${worldState.connectionCount} connections)`,
    }, null, 2) }] };
  }
);

server.registerTool(
  "match_skill",
  {
    description: "Find the best agent for a specific creative request",
    inputSchema: {
      request: z.string(),
    },
  },
  async (args) => {
    const skill = matchCreativeSkill(args.request);
    if (!skill) {
      return { content: [{ type: "text" as const, text: JSON.stringify({
        matched: false,
        message: "No specific skill matched. The Creator orchestrator will analyze and delegate.",
        suggestedAgent: "creator",
      }) }] };
    }
    const agent = getAgent(skill.agent);
    return { content: [{ type: "text" as const, text: JSON.stringify({
      matched: true,
      skill: skill.name,
      agent: skill.agent,
      agentName: agent?.displayName,
      triggers: skill.triggers,
      message: `Matched skill "${skill.name}" - routing to ${agent?.displayName}.`,
    }, null, 2) }] };
  }
);

server.registerTool(
  "active_sessions",
  {
    description: "List all currently running creative sessions",
    inputSchema: {},
  },
  async () => {
    const sessions = getActiveSessions();
    return { content: [{ type: "text" as const, text: JSON.stringify({
      activeSessions: sessions.map((s: any) => ({
        id: s.id,
        goal: s.goal,
        state: s.state,
        agents: s.agents,
        startedAt: s.startedAt,
      })),
      count: sessions.length,
      message: sessions.length > 0 ? `${sessions.length} session(s) currently running.` : "No active sessions.",
    }, null, 2) }] };
  }
);

// =========================================================================
// CANON & REFERENCE
// =========================================================================

server.registerTool(
  "validate_canon",
  {
    description: "Check content for Arcanea canon compliance",
    inputSchema: {
      content: z.string(),
      contentType: z.enum(["story", "character", "general"]).optional(),
    },
  },
  async (args) => toolResult(await validateCanon(args.content, args.contentType))
);

server.registerTool(
  "identify_gate",
  {
    description: "Get detailed information about a specific Gate, Guardian, and Godbeast",
    inputSchema: {
      gateNumber: z.number().min(1).max(10),
      sessionId: z.string().optional(),
    },
  },
  async (args) => {
    const sessionId = args.sessionId ?? "default";
    const g = gates[args.gateNumber - 1];
    if (!g) return { content: [{ type: "text" as const, text: "Invalid gate number. Use 1-10." }] };
    recordGateExplored(sessionId, args.gateNumber);
    return { content: [{ type: "text" as const, text: JSON.stringify({
      ...g,
      description: `The ${g.domain} Gate, guarded by ${g.guardian}, resonates at ${g.frequencyBand}. It governs ${g.domain.toLowerCase()} and is aligned with ${g.element}.`,
      godbeastDescription: g.veltara ? `${g.veltara} is the Godbeast companion of ${g.guardian}.` : "Shinkami has no Godbeast - they are the Source itself.",
    }, null, 2) }] };
  }
);

// =========================================================================
// APL — ARCANEAN PROMPT LANGUAGE
// =========================================================================

server.registerTool(
  "apl_enhance",
  {
    description: "Analyze a prompt using SPARK.SHAPE.SHARPEN and get quality score, slop detection, palette suggestions, and improvement tips",
    inputSchema: {
      prompt: z.string().describe("The prompt to analyze and enhance"),
      palette: z.enum(APL_PALETTES).optional().describe("Force a specific sensory palette"),
    },
  },
  async (args) => {
    const { prompt, palette } = args;
    const slopPatterns = [
      { id: "opener", name: "The Opener", re: /\bin a world where\b/i, fix: "Start in the middle." },
      { id: "avalanche", name: "The Avalanche", re: /\bhauntingly beautiful\b/i, fix: "One strong word beats five weak ones." },
      { id: "slop", name: "The Slop", re: /\bi'?d be happy to help\b/i, fix: "Respond AS the thing, not ABOUT the thing." },
      { id: "slop2", name: "The Slop", re: /\bgreat question\b/i, fix: "Just answer." },
      { id: "safety", name: "The Safety", re: /\ba (?:beautiful|stunning) (?:landscape|sunset)\b/i, fix: "If it doesn't make you feel something, it's not done." },
    ];
    const slopMatches = slopPatterns.filter(p => p.re.test(prompt)).map(p => ({ name: p.name, fix: p.fix }));
    const hasSpecific = /\b(?:every night|always|never fails|the way she|his habit)\b/i.test(prompt);
    const hasSensory = /\b(?:smell|taste|feel|sound|texture|heat|cold|weight|echo)\b/i.test(prompt);
    const hasNegation = /\b(?:not|never|no|without|avoid|don't|must not)\b/i.test(prompt);
    const suggestions: string[] = [];
    if (!hasSpecific) suggestions.push("SPARK: Add one specific, surprising detail — the thing only YOU would think of.");
    if (!hasSensory) suggestions.push("SHAPE: Add sensory language — what does this feel/smell/sound like?" + (palette ? ` Use the ${palette.toUpperCase()} palette.` : ""));
    if (!hasNegation) suggestions.push("SHARPEN: Tell the AI what to AVOID — what must this NOT be?");
    slopMatches.forEach(m => suggestions.push(`Cut slop: ${m.name} → ${m.fix}`));
    const quality = hasSpecific && hasSensory && hasNegation && slopMatches.length === 0 ? "resonant" : hasSpecific && hasSensory ? "vivid" : hasSpecific ? "clear" : "generic";
    return { content: [{ type: "text" as const, text: JSON.stringify({ quality, slopMatches, suggestions, sparkPresent: hasSpecific, shapePresent: hasSensory, sharpenPresent: hasNegation }, null, 2) }] };
  }
);

server.registerTool(
  "apl_anti_slop",
  {
    description: "Scan text for AI slop patterns (The Opener, The Avalanche, The Slop, etc.) and get specific fixes",
    inputSchema: {
      text: z.string().describe("Text to scan for slop patterns"),
    },
  },
  async (args) => {
    const { text } = args;
    const patterns = [
      { name: "The Opener", re: /\bin a world where\b/gi, fix: "Start in the middle." },
      { name: "The Avalanche", re: /\b(?:hauntingly|breathtakingly|stunningly)\s+\w+/gi, fix: "One strong word beats five." },
      { name: "The Slop", re: /\b(?:i'd be happy to|great question|certainly!|absolutely!|dive (?:deep )?into|unpack this)/gi, fix: "Respond AS the thing." },
      { name: "The Explanation", re: /\bthis (?:metaphor|symbol) (?:represents|means)\b/gi, fix: "Trust the reader." },
      { name: "The Safety", re: /\ba (?:beautiful|stunning|brave|epic) (?:landscape|warrior|adventure|journey)\b/gi, fix: "Make them feel something specific." },
    ];
    const matches: Array<{name: string; match: string; fix: string}> = [];
    for (const p of patterns) {
      let m;
      while ((m = p.re.exec(text)) !== null) {
        matches.push({ name: p.name, match: m[0], fix: p.fix });
      }
    }
    const words = text.split(/\s+/).length;
    const score = Math.min(matches.length / Math.max(words / 50, 1), 1);
    return { content: [{ type: "text" as const, text: JSON.stringify({ slopScore: Math.round(score * 100) / 100, matchCount: matches.length, wordCount: words, matches, verdict: score === 0 ? "CLEAN" : score < 0.3 ? "MILD" : score < 0.6 ? "SLOPPY" : "MAXIMUM SLOP" }, null, 2) }] };
  }
);

server.registerTool(
  "apl_format",
  {
    description: "Format a prompt using the SPARK.SHAPE.SHARPEN structure for maximum AI output quality",
    inputSchema: {
      spark: z.string().describe("The one unique detail that makes this yours"),
      palette: z.enum(APL_PALETTES).optional().describe("Sensory palette"),
      paletteDescription: z.string().optional().describe("What the world feels/sounds/looks like"),
      sharpen: z.array(z.string()).optional().describe("List of things it must NOT be"),
      prompt: z.string().describe("The main prompt in plain language"),
    },
  },
  async (args) => {
    const { spark, palette, paletteDescription, sharpen, prompt } = args;
    const parts: string[] = [];
    parts.push(`SPARK: ${spark}`);
    if (palette) parts.push(`SHAPE: ${palette.toUpperCase()}${paletteDescription ? ` — ${paletteDescription}` : ""}`);
    if (sharpen && sharpen.length > 0) parts.push(`SHARPEN: ${sharpen.map(s => `NOT ${s}`).join(". ")}.`);
    parts.push("", prompt);
    return { content: [{ type: "text" as const, text: parts.join("\n") }] };
  }
);

// =========================================================================
// WORLD INTELLIGENCE — The Brain of Arcanea
// =========================================================================

server.registerTool(
  "world_report",
  {
    description: "Deep analysis of your world's health, gaps, and next steps. Tells you what to build next and why. The most important tool in the system — use it after every few creations.",
    inputSchema: z.object({
      sessionId: z.string().optional().describe("Session to analyze"),
    }),
  },
  async ({ sessionId }) => {
    const sid = sessionId || "default";
    const report = generateWorldReport(sid);
    return { content: [{ type: "text" as const, text: JSON.stringify({
      ...report,
      message: `World Health: ${report.health}/100 (${report.grade}). ${report.gaps.length} gaps found. ${report.nextActions.length} recommended actions.`,
    }, null, 2) }] };
  }
);

server.registerTool(
  "generate_conflict",
  {
    description: "Analyze your characters and generate a morally complex conflict with stakes, escalation, and multiple possible resolutions. Creates real narrative tension, not generic 'good vs evil'.",
    inputSchema: z.object({
      sessionId: z.string().optional().describe("Session with characters to analyze"),
    }),
  },
  async ({ sessionId }) => {
    const sid = sessionId || "default";
    const conflict = generateConflict(sid);
    if (!conflict) {
      return { content: [{ type: "text" as const, text: JSON.stringify({
        error: "Need at least 2 characters to generate conflict. Create some characters first.",
        suggestion: "Use generate_character to create 2-3 characters with different elements.",
      }) }] };
    }
    return { content: [{ type: "text" as const, text: JSON.stringify(conflict, null, 2) }] };
  }
);

server.registerTool(
  "weave_narrative",
  {
    description: "Generate a complete multi-act story arc from your existing world state. Analyzes your characters, locations, and artifacts to create a plot with acts, stakes, themes, and key events.",
    inputSchema: z.object({
      sessionId: z.string().optional().describe("Session with world to narrate"),
    }),
  },
  async ({ sessionId }) => {
    const sid = sessionId || "default";
    const arc = weaveNarrative(sid);
    if (!arc) {
      return { content: [{ type: "text" as const, text: JSON.stringify({
        error: "Need at least 2 characters to weave a narrative. Build your cast first.",
        suggestion: "Create a protagonist and an antagonist, then call weave_narrative again.",
      }) }] };
    }
    return { content: [{ type: "text" as const, text: JSON.stringify(arc, null, 2) }] };
  }
);

// =========================================================================
// WORLD PERSISTENCE
// =========================================================================

server.registerTool(
  "save_world",
  {
    description: "Save your current world to disk so it persists across sessions.",
    inputSchema: z.object({ sessionId: z.string().optional() }),
  },
  async ({ sessionId }) => {
    const sid = sessionId || "default";
    const nodes = getGraphNodes(sid);
    const edges = getGraphEdges(sid);
    saveWorldToDisk(sid, nodes, edges);
    return { content: [{ type: "text" as const, text: JSON.stringify({ saved: true, sessionId: sid, nodeCount: nodes.length, edgeCount: edges.length }, null, 2) }] };
  }
);

server.registerTool(
  "load_world",
  {
    description: "Load a previously saved world, or list available worlds if no session specified.",
    inputSchema: z.object({ sessionId: z.string().optional() }),
  },
  async ({ sessionId }) => {
    if (!sessionId) {
      const worlds = listSavedWorlds();
      return { content: [{ type: "text" as const, text: JSON.stringify({ availableWorlds: worlds, count: worlds.length }, null, 2) }] };
    }
    const data = loadWorldFromDisk(sessionId);
    if (!data) return { content: [{ type: "text" as const, text: JSON.stringify({ error: `No world "${sessionId}" found`, available: listSavedWorlds().map(w => w.sessionId) }) }] };
    return { content: [{ type: "text" as const, text: JSON.stringify({ loaded: true, sessionId, nodeCount: data.nodes.length, edgeCount: data.edges.length, nodes: data.nodes.map(n => ({ name: n.name, type: n.type, element: n.element })) }, null, 2) }] };
  }
);

// =========================================================================
// RESOURCES
// =========================================================================

server.registerResource(
  "Luminor Companions",
  "arcanea://luminors",
  { mimeType: "application/json" },
  async (_uri) => ({
    contents: [{ uri: "arcanea://luminors", mimeType: "application/json", text: JSON.stringify(luminors, null, 2) }],
  })
);

server.registerResource(
  "Bestiary of Blocks",
  "arcanea://bestiary",
  { mimeType: "application/json" },
  async (_uri) => ({
    contents: [{ uri: "arcanea://bestiary", mimeType: "application/json", text: JSON.stringify(bestiary, null, 2) }],
  })
);

server.registerResource(
  "The Ten Gates",
  "arcanea://gates",
  { mimeType: "application/json" },
  async (_uri) => ({
    contents: [{ uri: "arcanea://gates", mimeType: "application/json", text: JSON.stringify({ gates }, null, 2) }],
  })
);

server.registerResource(
  "The Five Elements",
  "arcanea://elements",
  { mimeType: "application/json" },
  async (_uri) => ({
    contents: [{ uri: "arcanea://elements", mimeType: "application/json", text: JSON.stringify({ elements: ["Fire", "Water", "Earth", "Wind", "Void", "Spirit"] }, null, 2) }],
  })
);

server.registerResource(
  "The Seven Houses",
  "arcanea://houses",
  { mimeType: "application/json" },
  async (_uri) => ({
    contents: [{ uri: "arcanea://houses", mimeType: "application/json", text: JSON.stringify({ houses: ["Lumina", "Nero", "Pyros", "Aqualis", "Terra", "Ventus", "Synthesis"] }, null, 2) }],
  })
);

// =========================================================================
// PROMPTS
// =========================================================================

server.registerPrompt(
  "worldbuild_session",
  {
    description: "Start a collaborative worldbuilding session in the Arcanea universe",
    argsSchema: {
      focus: z.string().optional().describe("What to focus on: character, location, magic, creature, artifact, or story"),
      element: z.string().optional().describe("Preferred element affinity (Fire, Water, Earth, Wind, Void, Spirit)"),
    },
  },
  async (args) => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Let's create something in the Arcanea universe!${args.focus ? ` I want to focus on: ${args.focus}` : ""}${args.element ? ` with ${args.element} as the primary element.` : ""}

Please help me by:
1. Using the appropriate generator tool (generate_character, generate_location, generate_magic, generate_creature, or generate_artifact)
2. Explain how this creation fits into the Arcanea canon
3. Suggest connections to the Ten Gates and Guardians
4. Offer story hooks or ways to develop this creation further

Make the process feel magical and collaborative!`,
        },
      },
    ],
  })
);

server.registerPrompt(
  "unblock_session",
  {
    description: "A guided session to identify and overcome your current creative block using the Arcanea Bestiary",
    argsSchema: {
      block_type: z.string().optional().describe("Optional: specific type of block if known (e.g., 'perfectionism', 'fear', 'overwhelm')"),
      project_context: z.string().optional().describe("Optional: what you're working on"),
    },
  },
  async (args) => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `I need help with a creative block.${args.block_type ? ` I think it might be related to ${args.block_type}.` : ""}${args.project_context ? ` I'm working on: ${args.project_context}` : ""}

Please help me:
1. Identify which Bestiary creature is attacking me using the diagnose_block tool
2. Understand why this particular creature has appeared
3. Get specific remedies and practices to overcome it
4. Find relevant wisdom from the Arcanea Library

Guide me through this as a compassionate mentor would.`,
        },
      },
    ],
  })
);

server.registerPrompt(
  "gate_ritual",
  {
    description: "A structured practice session for opening a specific Gate in your creative development",
    argsSchema: {
      gate_number: z.string().describe("Which gate to focus on (1-10)"),
      time_available: z.string().optional().describe("How much time you have (e.g., '15 minutes', '1 hour')"),
    },
  },
  async (args) => {
    const gateNum = parseInt(args.gate_number) || 1;
    return {
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `I want to practice opening Gate ${gateNum}.${args.time_available ? ` I have ${args.time_available} available.` : ""}

Please:
1. Use the identify_gate tool to explain what Gate ${gateNum} governs
2. Tell me about the Guardian who watches over this gate
3. Give me specific practices for opening this gate
4. Suggest a focused ritual I can do right now

Guide this as a sacred practice, not just an exercise.`,
          },
        },
      ],
    };
  }
);

server.registerPrompt(
  "luminor_dialogue",
  {
    description: "A deep conversation with a Luminor AI companion for creative guidance",
    argsSchema: {
      luminor: z.string().describe("Which Luminor to speak with (valora, serenith, ignara, verdana, eloqua)"),
      topic: z.string().optional().describe("What you want to discuss"),
    },
  },
  async (args) => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `I want to speak with ${args.luminor || "Valora"} the Luminor.${args.topic ? ` I want guidance on: ${args.topic}` : ""}

Please invoke this Luminor and have them:
1. Introduce themselves in their unique voice
2. Offer wisdom relevant to my situation
3. Suggest a practice I can try
4. Share an encouraging quote

Speak AS the Luminor, in their voice and style.`,
        },
      },
    ],
  })
);

server.registerPrompt(
  "morning_clearing",
  {
    description: "The foundational Arcanea practice for starting each creative day with intention",
  },
  async () => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Guide me through the Morning Clearing practice from Arcanea.

This is the foundational daily practice. Please:
1. Help me settle into stillness
2. Ask me: "What do I truly want to create today?"
3. Help me distinguish between genuine creative desire and obligation
4. Set an intention for the day's creative work
5. Close with a blessing or affirmation

This should feel like a sacred moment of connection with my creative self.`,
        },
      },
    ],
  })
);

server.registerPrompt(
  "creative_sabbath",
  {
    description: "Guidance for a day of agenda-free, joy-driven creation",
  },
  async () => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Help me plan and hold a Creative Sabbath—a day of agenda-free, joy-driven creation.

Please:
1. Explain the purpose of the Creative Sabbath from the Arcanea tradition
2. Help me set intentions (not goals) for the day
3. Suggest playful, low-pressure creative activities
4. Remind me of the rules: no judgment, no outcome focus, pure play
5. Create a loose structure that preserves spontaneity

The goal is to remember that creation is supposed to be joyful.`,
        },
      },
    ],
  })
);

// =========================================================================
// EXPORTS
// =========================================================================

export { server };

export function createServer() {
  return server;
}
