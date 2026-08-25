import { type NextRequest, NextResponse } from "next/server";

import {
  canonicalSha256,
  createInMemoryPreviewAdmissionLimiter,
  createInMemoryPreviewAuthority,
  type WorldContextAuditSink,
} from "@arcanea/mcp-server/gateway";

import { authenticateWorldContextBearer } from "@/lib/mcp/world-context-auth";
import { createWorldContextMcpHttpHandler } from "@/lib/mcp/world-context-http";

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
