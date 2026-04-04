/**
 * Transport factory for Arcanea MCP Server.
 * Supports stdio (default) and HTTP/SSE (cloud deployment) modes.
 *
 * Stdio mode: compatible with Claude Desktop, standard MCP clients.
 * HTTP mode:  compatible with Smithery, MCP.run, Docker, and browser-based clients.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export declare function runStdio(server: McpServer): Promise<void>;
export declare function runHttp(server: McpServer, port: number): Promise<void>;
//# sourceMappingURL=transport.d.ts.map