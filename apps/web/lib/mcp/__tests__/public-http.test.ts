import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { handlePublicMcpJsonRpc, publicMcpDiscovery } from "../public-http";
import { PUBLIC_MCP_TOOLS, PublicMcpToolError } from "../public-catalog";

function stubTool(name: string, args: Record<string, unknown> = {}) {
  if (name === "generate_name") {
    return { name: "Kaelith", args };
  }
  throw new PublicMcpToolError(`Unknown tool: ${name}`);
}

describe("public MCP HTTP", () => {
  it("discovers the live HTTP URL and 16 tools", () => {
    const discovery = publicMcpDiscovery("https://www.arcanea.ai/api/mcp");
    assert.equal(discovery.url, "https://www.arcanea.ai/api/mcp");
    assert.equal(discovery.transport, "streamable-http");
    assert.equal(discovery.tools.length, 16);
    assert.ok(discovery.install.claude.includes("claude mcp add --transport http"));
  });

  it("initializes without auth", () => {
    const { status, payload } = handlePublicMcpJsonRpc(
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "test", version: "0" },
        },
      },
      stubTool,
    );
    assert.equal(status, 200);
    const result = (
      payload as { result: { serverInfo: { name: string }; capabilities: { tools: unknown } } }
    ).result;
    assert.equal(result.serverInfo.name, "arcanea-public-mcp");
    assert.ok(result.capabilities.tools);
  });

  it("lists public tools", () => {
    const { status, payload } = handlePublicMcpJsonRpc(
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
      },
      stubTool,
    );
    assert.equal(status, 200);
    const tools = (payload as { result: { tools: { name: string }[] } }).result.tools;
    assert.equal(tools.length, PUBLIC_MCP_TOOLS.length);
    assert.ok(tools.some((tool) => tool.name === "generate_character"));
    assert.ok(tools.some((tool) => tool.name === "get_canon"));
  });

  it("rejects unknown methods with JSON-RPC -32601", () => {
    const { status, payload } = handlePublicMcpJsonRpc(
      {
        jsonrpc: "2.0",
        id: 3,
        method: "resources/list",
      },
      stubTool,
    );
    assert.equal(status, 200);
    assert.equal((payload as { error: { code: number } }).error.code, -32601);
  });

  it("treats initialized as a notification", () => {
    const { status, payload } = handlePublicMcpJsonRpc(
      {
        jsonrpc: "2.0",
        method: "notifications/initialized",
      },
      stubTool,
    );
    assert.equal(status, 202);
    assert.equal(payload, null);
  });

  it("calls a public tool without auth", () => {
    const { status, payload } = handlePublicMcpJsonRpc(
      {
        jsonrpc: "2.0",
        id: 4,
        method: "tools/call",
        params: { name: "generate_name", arguments: { origin: "luminari" } },
      },
      stubTool,
    );
    assert.equal(status, 200);
    const text = (payload as { result: { content: { text: string }[] } }).result.content[0].text;
    assert.match(text, /Kaelith/);
  });
});
