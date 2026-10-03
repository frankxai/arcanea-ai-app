import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  AGENTS,
  getAgent,
  assessWorldState,
  orchestrateCreativeSession,
  getActiveSessions,
  matchCreativeSkill,
} from "../agents/index.js";
import {
  getAgentSwarmInfo,
  resolveForMode,
  GUARDIANS,
  type CoordinationMode,
} from "../data/guardian-swarm/index.js";

const COORDINATION_MODES = ["solo", "council", "convergence"] as const;

const GUARDIAN_IDS = [
  "lyssandria",
  "leyla",
  "draconia",
  "maylinn",
  "alera",
  "lyria",
  "aiyami",
  "elara",
  "ino",
  "shinkami",
] as const;

const AGENT_IDS = [
  "creator",
  "worldsmith",
  "luminor-council",
  "scribe",
  "seer",
] as const;

export function registerOrchestrationTools(server: McpServer) {
  // =========================================================================
  // AGENT ORCHESTRATION (oh-my-opencode inspired)
  // =========================================================================

  server.registerTool(
    "orchestrate",
    {
      description:
        "Run a full creative session with multi-agent coordination and Guardian-swarm awareness",
      inputSchema: {
        request: z.string().describe("What you want to create or explore"),
        sessionId: z.string().optional(),
        coordinationMode: z
          .enum(COORDINATION_MODES)
          .optional()
          .describe(
            "How Lumina coordinates: solo (one Guardian leads), council (2-3 Guardians collaborate), convergence (Shinkami mode, broad blend)",
          ),
        guardian: z
          .enum(GUARDIAN_IDS)
          .optional()
          .describe("Primary Guardian to lead the session (optional)"),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const requestedMode =
        (args.coordinationMode as CoordinationMode) || undefined;
      const requestedGuardian = args.guardian;
      const { session, result } = await orchestrateCreativeSession(
        args.request,
        sessionId,
      );

      const swarmResult = requestedMode
        ? resolveForMode(requestedMode, requestedGuardian)
        : resolveForMode("council", requestedGuardian);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                sessionId: session.id,
                goal: session.goal,
                state: session.state,
                agentsUsed: session.agents,
                taskCount: session.tasks.length,
                result,
                swarm: {
                  coordinationMode: swarmResult.coordinationMode,
                  leadGuardian: swarmResult.leadGuardian,
                  activeGuardians: swarmResult.activeGuardians.map((slug) => {
                    const g = GUARDIANS.find((guard) => guard.slug === slug);
                    return g
                      ? {
                          name: g.displayName,
                          gate: g.gate,
                          domain: g.domain,
                          element: g.element,
                        }
                      : { name: slug };
                  }),
                  activeLuminors: swarmResult.activeLuminors.map((l) => ({
                    id: l.id,
                    team: l.team,
                    relevance: l.relevance,
                    hint: l.hint,
                    parentGuardian: l.parentGuardian,
                  })),
                },
                message: `Creative session completed with ${session.agents.length} agent(s) under ${swarmResult.coordinationMode} coordination.`,
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
    "list_agents",
    {
      description:
        "List all available creative agents and their Guardian-swarm affinities",
      inputSchema: {},
    },
    async () => {
      const agentList = Object.values(AGENTS).map((a) => {
        const swarmInfo = getAgentSwarmInfo(a.id);
        return {
          id: a.id,
          name: a.displayName,
          role: a.role,
          model: a.model,
          capabilities: a.capabilities.map((c: any) => c.name),
          canParallelize: a.canParallelize,
          guardian: swarmInfo.primaryGuardian
            ? {
                name: swarmInfo.primaryGuardian.displayName,
                domain: swarmInfo.primaryGuardian.domain,
              }
            : null,
        };
      });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                agents: agentList,
                totalAgents: agentList.length,
                coordinationModes: ["solo", "council", "convergence"],
                message:
                  "Available creative agents in the Arcanea system with Guardian affinities.",
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
    "agent_info",
    {
      description:
        "Get detailed information about a specific agent including its Guardian hierarchy and Luminor team",
      inputSchema: {
        agentId: z.enum(AGENT_IDS),
      },
    },
    async (args) => {
      const agent = getAgent(args.agentId);
      if (!agent) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: `Unknown agent: ${args.agentId}` }),
            },
          ],
        };
      }
      const swarmInfo = getAgentSwarmInfo(agent.id);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                ...agent,
                description: `${agent.displayName} is a ${agent.role} agent using ${agent.model}.`,
                swarm: {
                  guardianHierarchy: {
                    primary: swarmInfo.primaryGuardian
                      ? {
                          name: swarmInfo.primaryGuardian.displayName,
                          gate: swarmInfo.primaryGuardian.gate,
                          domain: swarmInfo.primaryGuardian.domain,
                          element: swarmInfo.primaryGuardian.element,
                          godbeast: swarmInfo.primaryGuardian.godbeast,
                        }
                      : null,
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
    "assess_world",
    {
      description:
        "Analyze your world's maturity and get strategic suggestions",
      inputSchema: {
        sessionId: z.string().optional(),
      },
    },
    async (args) => {
      const sessionId = args.sessionId ?? "default";
      const worldState = assessWorldState(sessionId);
      const suggestions: string[] = [];
      switch (worldState.maturity) {
        case "virgin":
          suggestions.push(
            "Start by creating a founding character and their home location.",
          );
          break;
        case "emerging":
          suggestions.push(
            "Connect your creations with relationships. Try linking characters to locations.",
          );
          break;
        case "developing":
          suggestions.push(
            "Develop narrative threads. Consider what conflicts or alliances exist.",
          );
          break;
        case "rich":
          suggestions.push(
            "Document your world's history. Create artifacts that tie characters together.",
          );
          break;
        case "epic":
          suggestions.push(
            "Your world is vast! Consider creating an epic narrative that spans your creations.",
          );
          break;
      }
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                worldState,
                suggestions,
                message: `World maturity: ${worldState.maturity} (${worldState.creationCount} creations, ${worldState.connectionCount} connections)`,
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
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                matched: false,
                message:
                  "No specific skill matched. The Creator orchestrator will analyze and delegate.",
                suggestedAgent: "creator",
              }),
            },
          ],
        };
      }
      const agent = getAgent(skill.agent);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                matched: true,
                skill: skill.name,
                agent: skill.agent,
                agentName: agent?.displayName,
                triggers: skill.triggers,
                message: `Matched skill "${skill.name}" - routing to ${agent?.displayName}.`,
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
    "active_sessions",
    {
      description: "List all currently running creative sessions",
      inputSchema: {},
    },
    async () => {
      const sessions = getActiveSessions();
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                activeSessions: sessions.map((s: any) => ({
                  id: s.id,
                  goal: s.goal,
                  state: s.state,
                  agents: s.agents,
                  startedAt: s.startedAt,
                })),
                count: sessions.length,
                message:
                  sessions.length > 0
                    ? `${sessions.length} session(s) currently running.`
                    : "No active sessions.",
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
