/**
 * Claw agent type definitions for the Arcanea Publishing House.
 *
 * These types model the Managed Agents API surface used by
 * the eight Publishing House Claws. Each Claw is channeled by a Guardian
 * from the 16-Luminor hierarchy, rooting functional agents in canon.
 *
 * v0.5.0: Extended from 5 → 8 Claws with Editor (Aiyami), Community (Maylinn), PR (Elara).
 */

/** Valid Claw agent names (8 total: 5 production + 3 amplification) */
export type ClawName =
  | "media-claw"
  | "forge-claw"
  | "herald-claw"
  | "scout-claw"
  | "scribe-claw"
  | "editor-claw"
  | "community-claw"
  | "pr-claw";

/** The 16 Luminors that may channel Claws */
export type Guardian =
  | "Aiyami" | "Alera" | "Draconia" | "Elara"
  | "Ino" | "Ismael" | "Leyla" | "Lumina"
  | "Lyria" | "Lyssandria" | "Maylinn" | "Shinkami"
  | "Kaelith" | "Veloura" | "Laeylinn" | "Kyuro";

/** The Ten Gates + variants the Guardians serve */
export type Gate =
  | "Foundation" | "Flow" | "Fire" | "Heart" | "Voice"
  | "Sight" | "Crown" | "Starweave" | "Unity" | "Source"
  | "Earth" | "Shift";

/** Canonical Claw → Guardian mapping (8 Claws) */
export const CLAW_GUARDIANS: Record<ClawName, { guardian: Guardian; gate: Gate }> = {
  "media-claw":      { guardian: "Lyria",      gate: "Sight"     },
  "forge-claw":      { guardian: "Ismael",     gate: "Fire"      },
  "herald-claw":     { guardian: "Alera",      gate: "Voice"     },
  "scout-claw":      { guardian: "Lyssandria", gate: "Earth"     },
  "scribe-claw":     { guardian: "Shinkami",   gate: "Source"    },
  "editor-claw":     { guardian: "Aiyami",     gate: "Crown"     },
  "community-claw":  { guardian: "Maylinn",    gate: "Heart"     },
  "pr-claw":         { guardian: "Elara",      gate: "Starweave" },
};

/** MCP server connection descriptor */
export interface McpServer {
  name: string;
  type: "url";
  url: string;
}

/** Tool descriptor attached to an agent definition */
export interface AgentTool {
  type: string;
}

/** JSON shape of a Claw agent definition file */
export interface AgentConfig {
  name: string;
  /** The Guardian channeling this Claw */
  guardian: Guardian;
  /** The Gate this Claw serves */
  gate: Gate;
  model: string;
  system: string;
  tools: AgentTool[];
  mcp_servers?: McpServer[];
}

/** Environment configuration for creating a session */
export interface EnvironmentConfig {
  /** Anthropic API key — required for Managed Agents */
  apiKey: string;
  /** Base URL for the Managed Agents API */
  baseUrl?: string;
  /** Optional environment variables forwarded to MCP servers */
  env?: Record<string, string>;
}

/** Active Managed Agent session */
export interface Session {
  /** Unique session identifier */
  sessionId: string;
  /** The agent ID backing this session */
  agentId: string;
  /** Claw name that owns this session */
  clawName: ClawName;
  /** ISO timestamp when the session was created */
  createdAt: string;
}

/** Event types emitted during session streaming */
export type AgentEventType =
  | "message_start"
  | "content_block_start"
  | "content_block_delta"
  | "content_block_stop"
  | "message_delta"
  | "message_stop"
  | "tool_use"
  | "tool_result"
  | "error";

/** A single event from the Managed Agents SSE stream */
export interface AgentEvent {
  type: AgentEventType;
  /** Event payload — shape depends on type */
  data: Record<string, unknown>;
  /** ISO timestamp of event receipt */
  timestamp: string;
}
