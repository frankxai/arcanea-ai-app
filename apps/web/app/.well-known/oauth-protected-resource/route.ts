import { protectedResourceMetadataResponse } from "@/lib/mcp/protected-resource-metadata";

// RFC 9728 Protected Resource Metadata for the origin (resource = <origin>).
// MCP clients should use the path-suffixed document for /api/mcp. No secrets.
export const dynamic = "force-dynamic";

export function GET(request: Request): Response {
  return protectedResourceMetadataResponse(request, "root");
}
