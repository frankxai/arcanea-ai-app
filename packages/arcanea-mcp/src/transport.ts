/**
 * Transport factory for Arcanea MCP Server.
 * Supports stdio (default) and HTTP/SSE (cloud deployment) modes.
 *
 * Stdio mode: compatible with Claude Desktop, standard MCP clients.
 * HTTP mode:  compatible with Smithery, MCP.run, Docker, and browser-based clients.
 */

import http from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "node:crypto";

const SERVER_VERSION = "0.3.0";
const TOOL_COUNT = 31;

// -------------------------------------------------------------------------
// Stdio transport — default, backward compatible
// -------------------------------------------------------------------------

export async function runStdio(server: McpServer): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Arcanea MCP Server running (stdio)");
}

// -------------------------------------------------------------------------
// HTTP/SSE transport — cloud deployment
// -------------------------------------------------------------------------

function setCorsHeaders(res: http.ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Mcp-Session-Id");
}

export async function runHttp(server: McpServer, port: number): Promise<void> {
  // Session map: sessionId → transport instance (stateful mode)
  const sessions = new Map<string, StreamableHTTPServerTransport>();

  const httpServer = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url ?? "/", `http://localhost:${port}`);

    // ── Health check ──────────────────────────────────────────────────────
    if (url.pathname === "/health" && req.method === "GET") {
      const body = JSON.stringify({
        status: "ok",
        tools: TOOL_COUNT,
        version: SERVER_VERSION,
        transport: "http",
        sessions: sessions.size,
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(body);
      return;
    }

    // ── Info / root ───────────────────────────────────────────────────────
    if (url.pathname === "/" && req.method === "GET") {
      const body = JSON.stringify({
        name: "Arcanea MCP Server",
        version: SERVER_VERSION,
        description: "Worldbuilding toolkit, creative companion, and magic maker",
        transport: "StreamableHTTP",
        endpoints: {
          mcp: "/mcp",
          health: "/health",
        },
        tools: TOOL_COUNT,
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(body);
      return;
    }

    // ── MCP endpoint ──────────────────────────────────────────────────────
    if (url.pathname === "/mcp") {
      if (req.method === "POST") {
        // Collect request body before delegating to transport
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", async () => {
          let parsedBody: unknown;
          try {
            parsedBody = JSON.parse(Buffer.concat(chunks).toString("utf8"));
          } catch {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON body" }));
            return;
          }

          // Resolve or create the session transport
          const sessionId = req.headers["mcp-session-id"] as string | undefined;
          let transport: StreamableHTTPServerTransport;

          if (sessionId && sessions.has(sessionId)) {
            transport = sessions.get(sessionId)!;
          } else {
            // New session — create a stateful transport and connect the server
            transport = new StreamableHTTPServerTransport({
              sessionIdGenerator: () => randomUUID(),
            });
            await server.connect(transport);
            transport.onclose = () => {
              if (transport.sessionId) {
                sessions.delete(transport.sessionId);
              }
            };
            if (transport.sessionId) {
              sessions.set(transport.sessionId, transport);
            }
          }

          await transport.handleRequest(req, res, parsedBody);
        });
        return;
      }

      if (req.method === "GET") {
        // SSE stream for server-sent notifications
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        if (!sessionId || !sessions.has(sessionId)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing or unknown Mcp-Session-Id" }));
          return;
        }
        const transport = sessions.get(sessionId)!;
        await transport.handleRequest(req, res);
        return;
      }

      if (req.method === "DELETE") {
        // Client-initiated session termination
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        if (sessionId && sessions.has(sessionId)) {
          const transport = sessions.get(sessionId)!;
          await transport.close();
          sessions.delete(sessionId);
        }
        res.writeHead(200);
        res.end();
        return;
      }
    }

    // ── 404 fallback ──────────────────────────────────────────────────────
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  httpServer.listen(port, () => {
    console.error(`Arcanea MCP Server running (http) on port ${port}`);
    console.error(`  MCP endpoint: http://localhost:${port}/mcp`);
    console.error(`  Health check: http://localhost:${port}/health`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    httpServer.close(() => process.exit(0));
  });
  process.on("SIGINT", () => {
    httpServer.close(() => process.exit(0));
  });
}
