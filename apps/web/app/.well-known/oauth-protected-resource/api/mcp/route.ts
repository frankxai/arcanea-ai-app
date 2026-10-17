import { protectedResourceMetadataResponse } from "@/lib/mcp/protected-resource-metadata";

// RFC 9728 Protected Resource Metadata for /api/mcp (resource =
// <origin>/api/mcp, the audience tokens must be issued for). No secrets.
export const dynamic = "force-dynamic";

export function GET(request: Request): Response {
  return protectedResourceMetadataResponse(request, "mcp");
}
