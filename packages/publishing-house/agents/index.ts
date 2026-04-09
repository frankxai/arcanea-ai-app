/**
 * Arcanea Publishing House — Agent Loader & Session Manager
 *
 * Loads Claw agent definitions from JSON and creates Managed Agent
 * sessions via the Anthropic API. Falls back to a helpful error
 * when no API key is configured.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ClawName,
  AgentConfig,
  EnvironmentConfig,
  Session,
  AgentEvent,
  AgentEventType,
} from "./types.js";

export type {
  ClawName,
  AgentConfig,
  EnvironmentConfig,
  Session,
  AgentEvent,
  AgentEventType,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VALID_CLAWS: ReadonlySet<ClawName> = new Set([
  "media-claw",
  "forge-claw",
  "herald-claw",
  "scout-claw",
  "scribe-claw",
]);

const DEFAULT_BASE_URL = "https://api.anthropic.com";

/**
 * Load a Claw agent definition from its JSON file.
 *
 * @param name - One of the five Claw agent names
 * @returns Parsed AgentConfig
 * @throws If the name is invalid or the file cannot be read
 */
export function loadAgent(name: ClawName): AgentConfig {
  if (!VALID_CLAWS.has(name)) {
    throw new Error(
      `Unknown Claw agent "${name}". Valid names: ${[...VALID_CLAWS].join(", ")}`,
    );
  }

  const filePath = resolve(__dirname, `${name}.json`);
  const raw = readFileSync(filePath, "utf-8");
  const config: AgentConfig = JSON.parse(raw) as AgentConfig;

  return config;
}

/**
 * Resolve environment variable placeholders in MCP server URLs.
 *
 * Replaces `${VAR_NAME}` tokens with values from the env map
 * or from `process.env`.
 */
function resolveEnvVars(
  config: AgentConfig,
  env?: Record<string, string>,
): AgentConfig {
  if (!config.mcp_servers?.length) return config;

  const resolved = {
    ...config,
    mcp_servers: config.mcp_servers.map((server) => {
      const url = server.url.replace(/\$\{(\w+)\}/g, (_match, key: string) => {
        const value = env?.[key] ?? process.env[key];
        if (!value) {
          throw new Error(
            `Missing environment variable "${key}" required by MCP server "${server.name}" in agent "${config.name}"`,
          );
        }
        return value;
      });
      return { ...server, url };
    }),
  };

  return resolved;
}

/**
 * Create a Managed Agent session for the given Claw.
 *
 * Detects `ANTHROPIC_API_KEY` in the environment config. If present,
 * calls the Managed Agents API to create an agent definition and
 * start a session. If absent, throws with guidance on the free tier.
 *
 * @param agent - Agent configuration (from `loadAgent`)
 * @param env - Environment configuration with API key
 * @returns A Session handle for streaming events
 */
export async function createSession(
  agent: AgentConfig,
  env: EnvironmentConfig,
): Promise<Session> {
  if (!env.apiKey) {
    throw new Error(
      [
        "ANTHROPIC_API_KEY is not set.",
        "",
        "To use Managed Agent sessions, set your API key:",
        "  export ANTHROPIC_API_KEY=sk-ant-...",
        "",
        "For the free tier, use Claude Code local subagents instead:",
        "  /ao publish --local",
        "",
        "Learn more: https://docs.anthropic.com/en/docs/agents",
      ].join("\n"),
    );
  }

  const resolvedAgent = resolveEnvVars(agent, env.env);
  const baseUrl = env.baseUrl ?? DEFAULT_BASE_URL;

  // Step 1: Create the agent definition
  const agentResponse = await fetch(`${baseUrl}/v1/agents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.apiKey,
      "anthropic-version": "2024-01-01",
    },
    body: JSON.stringify({
      name: resolvedAgent.name,
      model: resolvedAgent.model,
      system: resolvedAgent.system,
      tools: resolvedAgent.tools,
      mcp_servers: resolvedAgent.mcp_servers ?? [],
    }),
  });

  if (!agentResponse.ok) {
    const body = await agentResponse.text();
    throw new Error(
      `Failed to create agent "${resolvedAgent.name}": ${agentResponse.status} ${body}`,
    );
  }

  const agentData = (await agentResponse.json()) as { id: string };

  // Step 2: Create a session for the agent
  const sessionResponse = await fetch(`${baseUrl}/v1/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.apiKey,
      "anthropic-version": "2024-01-01",
    },
    body: JSON.stringify({
      agent_id: agentData.id,
    }),
  });

  if (!sessionResponse.ok) {
    const body = await sessionResponse.text();
    throw new Error(
      `Failed to create session for "${resolvedAgent.name}": ${sessionResponse.status} ${body}`,
    );
  }

  const sessionData = (await sessionResponse.json()) as { id: string };

  const clawName = agent.name.replace("arcanea-", "") as ClawName;

  return {
    sessionId: sessionData.id,
    agentId: agentData.id,
    clawName,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Stream events from an active Managed Agent session via SSE.
 *
 * Yields `AgentEvent` objects as they arrive. The stream ends
 * when the server sends a `message_stop` event or closes the
 * connection.
 *
 * @param sessionId - Active session ID from `createSession`
 * @param options - Optional base URL and API key overrides
 */
export async function* streamEvents(
  sessionId: string,
  options?: { apiKey?: string; baseUrl?: string },
): AsyncIterable<AgentEvent> {
  const apiKey = options?.apiKey ?? process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY required for streaming events");
  }

  const baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;

  const response = await fetch(`${baseUrl}/v1/sessions/${sessionId}/events`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2024-01-01",
      Accept: "text/event-stream",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to stream session "${sessionId}": ${response.status} ${body}`,
    );
  }

  if (!response.body) {
    throw new Error("Response body is null — streaming not supported");
  }

  const decoder = new TextDecoder();
  const reader = response.body.getReader();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      let currentEventType: string | null = null;

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEventType = line.slice(7).trim();
        } else if (line.startsWith("data: ") && currentEventType) {
          const dataStr = line.slice(6);
          try {
            const data = JSON.parse(dataStr) as Record<string, unknown>;
            const event: AgentEvent = {
              type: currentEventType as AgentEventType,
              data,
              timestamp: new Date().toISOString(),
            };
            yield event;

            if (currentEventType === "message_stop") {
              return;
            }
          } catch {
            // Skip malformed JSON lines
          }
          currentEventType = null;
        } else if (line === "") {
          currentEventType = null;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
