import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { runHttp } from "../dist/transport.js";
import { RUNTIME_INFO } from "../dist/runtime-info.js";

const init = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "test", version: "1.0.0" },
  },
};
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json, text/event-stream",
};
const factory = () => {
  const server = new McpServer(RUNTIME_INFO);
  let count = 0;
  server.registerTool("increment", { inputSchema: {} }, async () => ({
    content: [{ type: "text", text: String(++count) }],
  }));
  return server;
};

test(
  "HTTP sessions use separate MCP servers and survive another client disconnecting",
  { timeout: 15000 },
  async (t) => {
    const running = await runHttp(factory, 0);
    t.after(() => running.close());
    const health = await fetch(`${running.url}/health`);
    assert.equal((await health.json()).version, RUNTIME_INFO.version);
    assert.equal(health.headers.get("access-control-allow-origin"), null);
    const clients = [];
    const transports = [];
    t.after(async () => {
      for (const client of clients) await client.close();
    });
    for (let index = 0; index < 2; index++) {
      const client = new Client({ name: `test-${index}`, version: "1.0.0" });
      const transport = new StreamableHTTPClientTransport(
        new URL(`${running.url}/mcp`),
      );
      clients.push(client);
      transports.push(transport);
      await client.connect(transport);
      assert.equal(client.getServerVersion().version, RUNTIME_INFO.version);
      assert.equal(
        (await client.callTool({ name: "increment", arguments: {} })).content[0]
          .text,
        "1",
      );
    }
    assert.notEqual(transports[0].sessionId, transports[1].sessionId);
    assert.equal(
      (await (await fetch(`${running.url}/health`)).json()).sessions,
      2,
    );
    await transports[0].terminateSession();
    assert.equal(
      (await clients[1].callTool({ name: "increment", arguments: {} }))
        .content[0].text,
      "2",
    );
    assert.equal(
      (await (await fetch(`${running.url}/health`)).json()).sessions,
      1,
    );
  },
);

test(
  "HTTP rejects cross-origin, malformed, oversized and unknown-session requests",
  { timeout: 15000 },
  async (t) => {
    const running = await runHttp(factory, 0);
    t.after(() => running.close());
    const cases = [
      [{ headers: { Origin: "https://untrusted.example" } }, 403],
      [
        {
          method: "POST",
          headers: { ...headers, "mcp-session-id": "unknown" },
          body: JSON.stringify(init),
        },
        404,
      ],
      [
        {
          method: "POST",
          headers: { ...headers, "mcp-session-id": "" },
          body: JSON.stringify(init),
        },
        400,
      ],
      [{ method: "POST", headers, body: "{" }, 400],
      [{ method: "POST", headers, body: "{}" }, 400],
      [
        {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: "{}",
        },
        415,
      ],
      [{ method: "POST", headers, body: "x".repeat(1024 * 1024 + 1) }, 413],
      [{ method: "GET" }, 400],
      [{ method: "PUT" }, 405],
    ];
    for (const [options, status] of cases) {
      const response = await fetch(`${running.url}/mcp`, options);
      assert.equal(
        response.status,
        status,
        JSON.stringify(options).slice(0, 250),
      );
      await response.text();
      assert.notEqual(response.headers.get("access-control-allow-origin"), "*");
    }
    // Node fetch rewrites Host; use the HTTP client to exercise the actual header.
    const foreignHost = await new Promise((resolve, reject) => {
      const request = http.get(
        `${running.url}/mcp`,
        { headers: { Host: "untrusted.example" } },
        (response) => {
          response.resume();
          response.on("end", () => resolve(response.statusCode));
        },
      );
      request.on("error", reject);
    });
    assert.equal(foreignHost, 403);
    const chunkedStatus = await new Promise((resolve, reject) => {
      const request = http.request(
        `${running.url}/mcp`,
        {
          method: "POST",
          headers: { ...headers, "Transfer-Encoding": "chunked" },
        },
        (response) => {
          response.resume();
          response.on("end", () => resolve(response.statusCode));
        },
      );
      request.on("error", reject);
      for (let index = 0; index < 17; index++)
        request.write(Buffer.alloc(65536, 120));
      request.end();
    });
    assert.equal(chunkedStatus, 413);
    const preflight = await fetch(`${running.url}/mcp`, {
      method: "OPTIONS",
      headers: { Origin: running.url },
    });
    assert.equal(preflight.status, 204);
    assert.equal(
      preflight.headers.get("access-control-allow-origin"),
      running.url,
    );
    assert.equal(
      (await (await fetch(`${running.url}/health`)).json()).sessions,
      0,
    );
  },
);

test(
  "failed initialization releases capacity and active sessions have a fixed ceiling",
  { timeout: 15000 },
  async (t) => {
    const running = await runHttp(factory, 0);
    t.after(() => running.close());
    for (let index = 0; index < 35; index++) {
      const response = await fetch(`${running.url}/mcp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(init),
      });
      assert.equal(response.status, 406);
      await response.text();
    }
    assert.equal(
      (await (await fetch(`${running.url}/health`)).json()).sessions,
      0,
    );
    for (let index = 0; index < 32; index++) {
      const response = await fetch(`${running.url}/mcp`, {
        method: "POST",
        headers,
        body: JSON.stringify(init),
      });
      assert.equal(response.status, 200);
      assert.ok(response.headers.get("mcp-session-id"));
      await response.text();
    }
    const full = await fetch(`${running.url}/mcp`, {
      method: "POST",
      headers,
      body: JSON.stringify(init),
    });
    assert.equal(full.status, 503);
    await full.text();
  },
);
