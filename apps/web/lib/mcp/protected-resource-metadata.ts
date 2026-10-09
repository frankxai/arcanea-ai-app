/**
 * OAuth 2.0 Protected Resource Metadata (RFC 9728) for the MCP endpoint.
 *
 * The MCP route accepts `Authorization: Bearer <Supabase access token>`; the
 * authorization server is the Supabase Auth issuer of this deployment. The
 * origin is taken from the request so previews advertise their own URL.
 * Nothing secret is read or returned: only the public Supabase project URL.
 */

export const MCP_RESOURCE_PATH = "/api/mcp";
export const PROTECTED_RESOURCE_METADATA_PATH =
  "/.well-known/oauth-protected-resource";
export const MCP_PROTECTED_RESOURCE_METADATA_PATH = `${PROTECTED_RESOURCE_METADATA_PATH}${MCP_RESOURCE_PATH}`;

export interface ProtectedResourceMetadata {
  resource: string;
  authorization_servers: string[];
  bearer_methods_supported: ["header"];
  resource_name: string;
}

/** The URL clients fetch to discover how to authenticate to /api/mcp. */
export function mcpResourceMetadataUrl(requestUrl: string | URL): string {
  return new URL(MCP_PROTECTED_RESOURCE_METADATA_PATH, requestUrl).href;
}

/** `WWW-Authenticate` value for a 401 from /api/mcp (RFC 9728 §5.1). */
export function mcpWwwAuthenticate(requestUrl: string | URL): string {
  // URL serialisation percent-encodes `"` and `\`, so the quoted-string is safe.
  return `Bearer resource_metadata="${mcpResourceMetadataUrl(requestUrl)}"`;
}

/** Supabase Auth issuer (`https://<project>.supabase.co/auth/v1`), or null. */
export function supabaseAuthIssuer(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const raw = (env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL)?.trim();
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (
    url.protocol !== "https:" ||
    host.includes("example.") ||
    host.includes("placeholder") ||
    host.includes("your-")
  ) {
    return null;
  }
  return `${url.origin}/auth/v1`;
}

export function buildMcpProtectedResourceMetadata(
  requestUrl: string | URL,
  env: Record<string, string | undefined> = process.env,
): ProtectedResourceMetadata | null {
  const issuer = supabaseAuthIssuer(env);
  if (!issuer) return null;
  return {
    resource: new URL(MCP_RESOURCE_PATH, requestUrl).href,
    authorization_servers: [issuer],
    bearer_methods_supported: ["header"],
    resource_name: "Arcanea World Context (preview)",
  };
}

/** GET handler shared by the root and the /api/mcp-suffixed metadata paths. */
export function protectedResourceMetadataResponse(
  request: Request,
  env: Record<string, string | undefined> = process.env,
): Response {
  const metadata = buildMcpProtectedResourceMetadata(request.url, env);
  if (!metadata) {
    return new Response(
      JSON.stringify({
        error: {
          code: "adapter-required",
          message: "Authorization server is not configured.",
        },
      }),
      {
        status: 503,
        headers: {
          "cache-control": "no-store",
          "content-type": "application/json; charset=utf-8",
          "x-content-type-options": "nosniff",
        },
      },
    );
  }
  return new Response(JSON.stringify(metadata), {
    status: 200,
    headers: {
      "cache-control": "public, max-age=3600",
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "x-content-type-options": "nosniff",
    },
  });
}
