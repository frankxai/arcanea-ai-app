/**
 * Claw agent type definitions for the Arcanea Publishing House.
 *
 * These types model the Managed Agents API surface used by
 * the five Publishing House Claws.
 */

/** Valid Claw agent names */
export type ClawName =
  | "media-claw"
  | "forge-claw"
  | "herald-claw"
  | "scout-claw"
  | "scribe-claw";

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
