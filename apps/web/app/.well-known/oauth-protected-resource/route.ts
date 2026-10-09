import { protectedResourceMetadataResponse } from "@/lib/mcp/protected-resource-metadata";

// RFC 9728 Protected Resource Metadata for /api/mcp. Public, no secrets.
export const dynamic = "force-dynamic";

export function GET(request: Request): Response {
  return protectedResourceMetadataResponse(request);
}
