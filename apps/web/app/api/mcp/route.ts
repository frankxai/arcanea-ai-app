import { type NextRequest, NextResponse } from "next/server";

import {
  canonicalSha256,
  createInMemoryPreviewAdmissionLimiter,
  createInMemoryPreviewAuthority,
  type WorldContextAuditSink,
} from "@arcanea/mcp-server/gateway";

import { authenticateWorldContextBearer } from "@/lib/mcp/world-context-auth";
import { createWorldContextMcpHttpHandler } from "@/lib/mcp/world-context-http";
import {
  PUBLIC_MCP_CORS_HEADERS,
  handlePublicMcpJsonRpc,
  publicMcpDiscovery,
} from "@/lib/mcp/public-http";
import { executePublicMcpTool } from "@/lib/mcp/public-tools";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

/** The public tools are pure generators; this only caps a single hammering client. */
const PUBLIC_MCP_RATE_LIMIT = { limit: 60, windowSeconds: 60 };
const PUBLIC_MCP_MAX_BODY_BYTES = 64 * 1024;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const previewAuthority = createInMemoryPreviewAuthority();
const previewAdmissionLimiter = createInMemoryPreviewAdmissionLimiter();
const audit: WorldContextAuditSink = {
  record(event) {
    const { authenticatedActorId, authenticatedTenantId, worldId, ...receipt } =
      event;
    console.info("[world-context-gateway]", {
      ...receipt,
      actorRef: canonicalSha256(authenticatedActorId),
      tenantRef: canonicalSha256(authenticatedTenantId),
      ...(worldId ? { worldRef: canonicalSha256(worldId) } : {}),
    });
  },
};

const handleWorldContextPost = createWorldContextMcpHttpHandler({
  getMode: () => process.env.ARCANEA_WORLD_CONTEXT_GATEWAY_MODE,
  authenticate: authenticateWorldContextBearer,
  admissionLimiter: previewAdmissionLimiter,
  authority: previewAuthority,
  audit,
});

function withCors(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(PUBLIC_MCP_CORS_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function OPTIONS(): Promise<NextResponse> {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  return withCors(
    NextResponse.json(publicMcpDiscovery(`${url.origin}/api/mcp`)),
  );
}

export async function POST(request: NextRequest): Promise<Response> {
  if (request.headers.get("authorization")) {
    return handleWorldContextPost(request);
  }

  const limit = rateLimit(
    `mcp-public:${rateLimitKey(request)}`,
    PUBLIC_MCP_RATE_LIMIT,
  );
  if (!limit.success) {
    const response = NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32000, message: "Rate limit exceeded." },
      },
      { status: 429 },
    );
    response.headers.set(
      "retry-after",
      String(Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000))),
    );
    return withCors(response);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "");
  if (Number.isFinite(declaredLength) && declaredLength > PUBLIC_MCP_MAX_BODY_BYTES) {
    return withCors(
      NextResponse.json(
        {
          jsonrpc: "2.0",
          id: null,
          error: { code: -32600, message: "Request body too large." },
        },
        { status: 413 },
      ),
    );
  }

  const raw = await request.text();
  if (raw.length > PUBLIC_MCP_MAX_BODY_BYTES) {
    return withCors(
      NextResponse.json(
        {
          jsonrpc: "2.0",
          id: null,
          error: { code: -32600, message: "Request body too large." },
        },
        { status: 413 },
      ),
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return withCors(
      NextResponse.json(
        {
          jsonrpc: "2.0",
          id: null,
          error: { code: -32700, message: "Parse error" },
        },
        { status: 400 },
      ),
    );
  }

  const { status, payload } = handlePublicMcpJsonRpc(body, executePublicMcpTool);
  if (payload === null) {
    return withCors(new NextResponse(null, { status }));
  }
  return withCors(NextResponse.json(payload, { status }));
}
