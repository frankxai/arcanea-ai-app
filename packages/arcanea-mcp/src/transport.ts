import http from "node:http";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { RUNTIME_INFO } from "./runtime-info.js";

export async function runStdio(server: McpServer): Promise<void> {
  await server.connect(new StdioServerTransport());
  console.error(`Arcanea MCP ${RUNTIME_INFO.version} running (stdio)`);
}

type Session = {
  server: McpServer;
  transport: StreamableHTTPServerTransport;
  touched: number;
};
export type RunningHttpServer = { url: string; close(): Promise<void> };
const MAX_BODY_BYTES = 1024 * 1024;
const MAX_SESSIONS = 32;
const SESSION_IDLE_MS = 30 * 60 * 1000;

function json(res: http.ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

async function readBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let bytes = 0;
    let finished = false;
    const fail = (error: Error) => {
      if (finished) return;
      finished = true;
      chunks.length = 0;
      reject(error);
    };
    req.on("data", (chunk: Buffer) => {
      if (finished) return;
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        // Continue draining without buffering so a chunked request receives a 413.
        fail(new RangeError("Request body exceeds 1 MiB."));
        return;
      }
      chunks.push(chunk);
    });
    req.once("error", fail);
    req.once("aborted", () => fail(new Error("Request aborted.")));
    req.once("end", () => {
      if (finished) return;
      try {
        const parsed: unknown = JSON.parse(
          Buffer.concat(chunks).toString("utf8"),
        );
        finished = true;
        resolve(parsed);
      } catch {
        fail(new Error("Invalid JSON body."));
      }
    });
  });
}

/** Local single-user transport. Session ids route clients; they are not authentication. */
export async function runHttp(
  createServer: () => McpServer,
  port: number,
): Promise<RunningHttpServer> {
  if (!Number.isInteger(port) || port < 0 || port > 65535)
    throw new Error("Invalid HTTP port.");
  const sessions = new Map<string, Session>();
  const pending = new Set<Session>();
  let closing = false;

  async function dispose(session: Session): Promise<void> {
    if (session.transport.sessionId)
      sessions.delete(session.transport.sessionId);
    pending.delete(session);
    await session.server.close();
  }

  const httpServer = http.createServer((req, res) => {
    void handle(req, res).catch(() => {
      if (!res.headersSent) json(res, 500, { error: "MCP request failed." });
      else res.end();
    });
  });
  httpServer.requestTimeout = 30_000;
  httpServer.headersTimeout = 10_000;

  async function handle(
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): Promise<void> {
    const address = httpServer.address();
    if (!address || typeof address === "string" || closing) {
      json(res, 503, { error: "Server is closing." });
      return;
    }
    const hosts = [`127.0.0.1:${address.port}`, `localhost:${address.port}`];
    const host = req.headers.host;
    const origin = req.headers.origin;
    if (
      !host ||
      !hosts.includes(host) ||
      (origin !== undefined && !hosts.some((h) => origin === `http://${h}`))
    ) {
      json(res, 403, {
        error: "Only local Host and Origin values are accepted.",
      });
      return;
    }
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
    }
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Accept, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID",
      });
      res.end();
      return;
    }
    const pathname = new URL(req.url ?? "/", `http://${host}`).pathname;
    if (req.method === "GET" && (pathname === "/" || pathname === "/health")) {
      json(res, 200, {
        ...RUNTIME_INFO,
        status: "ok",
        transport: "StreamableHTTP",
        sessions: sessions.size,
        discovery: "Use tools/list for the current tool inventory.",
      });
      return;
    }
    if (pathname !== "/mcp") {
      json(res, 404, { error: "Not found." });
      return;
    }
    if (!["POST", "GET", "DELETE"].includes(req.method ?? "")) {
      res.setHeader("Allow", "POST, GET, DELETE, OPTIONS");
      json(res, 405, { error: "Method not allowed." });
      return;
    }
    const sessionId = req.headers["mcp-session-id"];
    if (Array.isArray(sessionId) || sessionId === "") {
      json(res, 400, { error: "Invalid session header." });
      return;
    }
    let session = sessionId ? sessions.get(sessionId) : undefined;
    if (sessionId && !session) {
      json(res, 404, { error: "Unknown MCP session." });
      return;
    }
    if (session && Date.now() - session.touched > SESSION_IDLE_MS) {
      await dispose(session);
      json(res, 404, { error: "MCP session expired." });
      return;
    }
    if (req.method !== "POST") {
      if (!session) {
        json(res, 400, { error: "MCP session required." });
        return;
      }
      session.touched = Date.now();
      await session.transport.handleRequest(req, res);
      if (req.method === "DELETE") await dispose(session);
      return;
    }
    if (
      req.headers["content-type"]?.split(";")[0].trim() !== "application/json"
    ) {
      json(res, 415, { error: "Content-Type must be application/json." });
      return;
    }
    if (Number(req.headers["content-length"] ?? 0) > MAX_BODY_BYTES) {
      json(res, 413, { error: "Request body exceeds 1 MiB." });
      req.resume();
      return;
    }
    let body: unknown;
    try {
      body = await readBody(req);
    } catch (error) {
      if (!res.destroyed)
        json(res, error instanceof RangeError ? 413 : 400, {
          error:
            error instanceof RangeError ? error.message : "Invalid JSON body.",
        });
      return;
    }
    if (!session) {
      if (!isInitializeRequest(body)) {
        json(res, 400, { error: "Initialize a session first." });
        return;
      }
      if (sessions.size + pending.size >= MAX_SESSIONS) {
        json(res, 503, { error: "Local session limit reached." });
        return;
      }
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id) => {
          if (session) {
            pending.delete(session);
            sessions.set(id, session);
          }
        },
      });
      session = { server: createServer(), transport, touched: Date.now() };
      pending.add(session);
      try {
        await session.server.connect(transport);
      } catch (error) {
        pending.delete(session);
        await session.server.close();
        throw error;
      }
      const opened = session;
      res.once("close", () => {
        if (pending.has(opened)) void dispose(opened).catch(() => {});
      });
    }
    session.touched = Date.now();
    try {
      await session.transport.handleRequest(req, res, body);
    } catch (error) {
      await dispose(session);
      throw error;
    }
    if (pending.has(session)) await dispose(session);
  }

  const reap = setInterval(() => {
    for (const session of sessions.values()) {
      if (Date.now() - session.touched > SESSION_IDLE_MS)
        void dispose(session).catch(() => {});
    }
  }, 60_000);
  reap.unref();
  try {
    await new Promise<void>((resolve, reject) => {
      httpServer.once("error", reject);
      httpServer.listen(port, "127.0.0.1", () => {
        httpServer.off("error", reject);
        resolve();
      });
    });
  } catch (error) {
    clearInterval(reap);
    throw error;
  }
  const address = httpServer.address();
  if (!address || typeof address === "string")
    throw new Error("HTTP listener did not start.");
  const url = `http://127.0.0.1:${address.port}`;
  console.error(
    `Arcanea MCP ${RUNTIME_INFO.version} running at ${url}/mcp (local single-user mode)`,
  );
  return {
    url,
    async close() {
      closing = true;
      clearInterval(reap);
      const closed = new Promise<void>((resolve) =>
        httpServer.close(() => resolve()),
      );
      await Promise.allSettled(
        [...new Set([...sessions.values(), ...pending])].map(dispose),
      );
      httpServer.closeAllConnections();
      await closed;
    },
  };
}
