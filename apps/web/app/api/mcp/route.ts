import { type NextRequest, NextResponse } from "next/server";

import {
  canonicalSha256,
  createInMemoryPreviewAdmissionLimiter,
  createInMemoryPreviewAuthority,
  type WorldContextAuditSink,
} from "@arcanea/mcp-server/gateway";

import { authenticateWorldContextBearer } from "@/lib/mcp/world-context-auth";
import { createWorldContextMcpHttpHandler } from "@/lib/mcp/world-context-http";

/**
 * MCP World Context endpoint (Streamable HTTP, POST only).
 *
 * Clients must use https://www.arcanea.ai/api/mcp. The apex arcanea.ai
 * answers with a 308 redirect, and clients drop the Authorization header on
 * that cross-host redirect, so a request to the apex arrives unauthenticated.
 *
 * Auth: Authorization: Bearer <access token> on every request. The token must
 * be accepted by Supabase Auth and its `aud` must name this resource
 * (lib/mcp/world-context-auth.ts). Discovery: a 401 carries
 * WWW-Authenticate: Bearer resource_metadata="<origin>/.well-known/
 * oauth-protected-resource/api/mcp" (RFC 9728).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const previewAuthority = createInMemoryPreviewAuthority();
const previewAdmissionLimiter = createInMemoryPreviewAdmissionLimiter();
const audit: WorldContextAuditSink = {
  record(event) {
    // Receipts contain only authority references/hashes/counts; never token,
    // raw query, or creator payload.
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

const handlePost = createWorldContextMcpHttpHandler({
  getMode: () => process.env.ARCANEA_WORLD_CONTEXT_GATEWAY_MODE,
  authenticate: authenticateWorldContextBearer,
  admissionLimiter: previewAdmissionLimiter,
  authority: previewAuthority,
  audit,
});

export async function POST(request: NextRequest): Promise<Response> {
  return handlePost(request);
}

function methodNotAllowed(): NextResponse {
  return NextResponse.json(
    {
      error: { code: "method-not-allowed", message: "Only POST is supported." },
    },
    { status: 405, headers: { allow: "POST", "cache-control": "no-store" } },
  );
}

export async function GET(): Promise<NextResponse> {
  return methodNotAllowed();
}

export async function DELETE(): Promise<NextResponse> {
  return methodNotAllowed();
}

export async function OPTIONS(): Promise<NextResponse> {
  return methodNotAllowed();
}
