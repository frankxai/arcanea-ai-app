/**
 * MCP Bridge API — Call worldbuilding tools from the web app
 *
 * POST /api/worlds/mcp-bridge
 * GET  /api/worlds/mcp-bridge (tool discovery)
 */

import { NextRequest, NextResponse } from "next/server";

import {
  PUBLIC_MCP_TOOLS,
  PublicMcpToolError,
  executePublicMcpTool,
} from "@/lib/mcp/public-tools";

export async function POST(request: NextRequest) {
  try {
    const { tool, args } = await request.json();
    if (!tool) return NextResponse.json({ error: "Missing 'tool'" }, { status: 400 });

    const result = executePublicMcpTool(String(tool), args || {});
    return NextResponse.json({ success: true, tool, result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Tool execution failed";
    const status = error instanceof PublicMcpToolError ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET() {
  return NextResponse.json({
    tools: PUBLIC_MCP_TOOLS,
    count: PUBLIC_MCP_TOOLS.length,
    usage: 'POST { "tool": "generate_character", "args": { "primaryElement": "Fire" } }',
  });
}
