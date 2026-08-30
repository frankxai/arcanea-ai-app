import { NextResponse } from "next/server";

import { publicMcpDiscovery } from "@/lib/mcp/public-http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    publicMcpDiscovery("https://www.arcanea.ai/api/mcp"),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "cache-control": "public, max-age=300",
      },
    },
  );
}
