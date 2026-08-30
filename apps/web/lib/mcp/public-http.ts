import {
  PUBLIC_MCP_TOOLS,
  PUBLIC_MCP_TOOL_DEFINITIONS,
  PublicMcpToolError,
} from "./public-catalog";

export type PublicToolExecutor = (
  name: string,
  args?: Record<string, unknown>,
) => unknown;

export const PUBLIC_MCP_PROTOCOL_VERSION = "2024-11-05";
export const PUBLIC_MCP_SERVER_NAME = "arcanea-public-mcp";
export const PUBLIC_MCP_SERVER_VERSION = "1.0.0";

export const PUBLIC_MCP_CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, MCP-Protocol-Version, MCP-Session-Id",
  "Access-Control-Max-Age": "86400",
  "cache-control": "no-store",
};

type JsonRpcId = string | number | null;

interface JsonRpcRequest {
  jsonrpc?: unknown;
  id?: JsonRpcId;
  method?: unknown;
  params?: unknown;
}

export interface PublicMcpDiscovery {
  name: string;
  version: string;
  transport: "streamable-http";
  url: string;
  protocolVersion: string;
  auth: {
    publicTools: "none";
    worldContext: "bearer";
  };
  tools: readonly string[];
  install: {
    claude: string;
    cursor: { mcpServers: { arcanea: { url: string } } };
    skills: string;
    stdioNpm: string;
  };
}

export function publicMcpDiscovery(url: string): PublicMcpDiscovery {
  return {
    name: PUBLIC_MCP_SERVER_NAME,
    version: PUBLIC_MCP_SERVER_VERSION,
    transport: "streamable-http",
    url,
    protocolVersion: PUBLIC_MCP_PROTOCOL_VERSION,
    auth: {
      publicTools: "none",
      worldContext: "bearer",
    },
    tools: PUBLIC_MCP_TOOLS,
    install: {
      claude: `claude mcp add --transport http arcanea ${url}`,
      cursor: { mcpServers: { arcanea: { url } } },
      skills: "npx @arcanea/skills",
      stdioNpm:
        "npx @arcanea/mcp-server@0.7.0 still depends on workspace:*; use HTTP until a patched npm release.",
    },
  };
}

function rpcResult(id: JsonRpcId, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}

function rpcError(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function isJsonRpcRequest(value: unknown): value is JsonRpcRequest {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function handlePublicMcpJsonRpc(
  body: unknown,
  executeTool: PublicToolExecutor,
): {
  status: number;
  payload: unknown | null;
} {
  if (Array.isArray(body)) {
    return {
      status: 400,
      payload: rpcError(null, -32600, "JSON-RPC batch requests are not supported."),
    };
  }
  if (!isJsonRpcRequest(body) || body.jsonrpc !== "2.0" || typeof body.method !== "string") {
    return {
      status: 400,
      payload: rpcError(null, -32600, "Invalid JSON-RPC request."),
    };
  }

  const id = ("id" in body ? body.id : undefined) as JsonRpcId | undefined;
  const isNotification = id === undefined;
  const method = body.method;

  if (method === "notifications/initialized" || method === "notifications/cancelled") {
    return { status: 202, payload: null };
  }

  if (isNotification) {
    return { status: 202, payload: null };
  }

  const rpcId = id ?? null;

  if (method === "initialize") {
    return {
      status: 200,
      payload: rpcResult(rpcId, {
        protocolVersion: PUBLIC_MCP_PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: {
          name: PUBLIC_MCP_SERVER_NAME,
          version: PUBLIC_MCP_SERVER_VERSION,
        },
        instructions:
          "Public Arcanea worldbuilding tools. World-context queries still require a Bearer token on the same URL.",
      }),
    };
  }

  if (method === "ping" || method === "tools/list") {
    if (method === "ping") {
      return { status: 200, payload: rpcResult(rpcId, {}) };
    }
    return {
      status: 200,
      payload: rpcResult(rpcId, { tools: PUBLIC_MCP_TOOL_DEFINITIONS }),
    };
  }

  if (method === "tools/call") {
    const params = body.params;
    if (typeof params !== "object" || params === null || Array.isArray(params)) {
      return { status: 200, payload: rpcError(rpcId, -32602, "tools/call requires params.") };
    }
    const name = (params as { name?: unknown }).name;
    const args = (params as { arguments?: unknown }).arguments;
    if (typeof name !== "string") {
      return { status: 200, payload: rpcError(rpcId, -32602, "Tool name is required.") };
    }
    const record =
      typeof args === "object" && args !== null && !Array.isArray(args)
        ? (args as Record<string, unknown>)
        : {};
    try {
      const result = executeTool(name, record);
      return {
        status: 200,
        payload: rpcResult(rpcId, {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }),
      };
    } catch (error) {
      const message =
        error instanceof PublicMcpToolError
          ? error.message
          : "Tool execution failed.";
      return {
        status: 200,
        payload: rpcResult(rpcId, {
          isError: true,
          content: [{ type: "text", text: message }],
        }),
      };
    }
  }

  return {
    status: 200,
    payload: rpcError(rpcId, -32601, `Method not found: ${method}`),
  };
}
