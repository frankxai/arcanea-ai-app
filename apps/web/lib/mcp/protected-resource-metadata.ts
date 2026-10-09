/**
 * OAuth 2.0 Protected Resource Metadata (RFC 9728) for the MCP endpoint.
 *
 * The MCP route accepts `Authorization: Bearer <Supabase access token>`; the
 * authorization server is the Supabase Auth issuer of this deployment.
 *
 * The canonical resource URL (what a token's `aud` must name) comes from
 * ARCANEA_MCP_RESOURCE_URL, else the production URL on Vercel production,
 * else the request origin (so previews advertise and accept themselves).
 * Nothing secret is read or returned: only the public Supabase project URL.
 */

export const MCP_RESOURCE_PATH = "/api/mcp";
export const PROTECTED_RESOURCE_METADATA_PATH =
  "/.well-known/oauth-protected-resource";
export const MCP_PROTECTED_RESOURCE_METADATA_PATH = `${PROTECTED_RESOURCE_METADATA_PATH}${MCP_RESOURCE_PATH}`;

export const PRODUCTION_MCP_RESOURCE_URL = "https://www.arcanea.ai/api/mcp";

type Env = Record<string, string | undefined>;

/** Canonical URL of the /api/mcp protected resource (RFC 8707 / RFC 9728). */
export function canonicalMcpResource(
  requestUrl: string | URL,
  env: Env = process.env,
): string {
  const configured = env.ARCANEA_MCP_RESOURCE_URL?.trim();
  if (configured) {
    let url: URL | null = null;
    try {
      url = new URL(configured);
    } catch {
      url = null;
    }
    if (!url || url.protocol !== "https:" || url.search || url.hash) {
      throw new Error("ARCANEA_MCP_RESOURCE_URL must be an https URL.");
    }
    return url.href;
  }
  if (env.VERCEL_ENV === "production") return PRODUCTION_MCP_RESOURCE_URL;
  return new URL(MCP_RESOURCE_PATH, requestUrl).href;
}

export interface ProtectedResourceMetadata {
  resource: string;
  authorization_servers: string[];
  bearer_methods_supported: ["header"];
  resource_name: string;
}

/** The URL clients fetch to discover how to authenticate to /api/mcp. */
export function mcpResourceMetadataUrl(
  requestUrl: string | URL,
  env: Env = process.env,
): string {
  return new URL(
    MCP_PROTECTED_RESOURCE_METADATA_PATH,
    canonicalMcpResource(requestUrl, env),
  ).href;
}

/**
 * `WWW-Authenticate` value for a 401 from /api/mcp (RFC 6750 §3, RFC 9728
 * §5.1). Pass `invalidToken` when a token was sent but rejected.
 */
export function mcpWwwAuthenticate(
  requestUrl: string | URL,
  options: { invalidToken?: boolean } = {},
  env: Env = process.env,
): string {
  // URL serialisation percent-encodes `"` and `\`, so the quoted-string is safe.
  const metadata = `resource_metadata="${mcpResourceMetadataUrl(requestUrl, env)}"`;
  return options.invalidToken
    ? `Bearer error="invalid_token", error_description="The access token is invalid or was not issued for this resource.", ${metadata}`
    : `Bearer ${metadata}`;
}

/** Supabase Auth issuer (`https://<project>.supabase.co/auth/v1`), or null. */
export function supabaseAuthIssuer(env: Env = process.env): string | null {
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

/**
 * RFC 9728 §3.3: the `resource` in a metadata document must match the URL it
 * was fetched from. The path-suffixed document describes `<origin>/api/mcp`
 * (the resource tokens must be issued for); the root document describes the
 * bare origin. The 401's resource_metadata points at the suffixed document.
 */
export function buildMcpProtectedResourceMetadata(
  requestUrl: string | URL,
  env: Env = process.env,
  scope: "mcp" | "root" = "mcp",
): ProtectedResourceMetadata | null {
  const issuer = supabaseAuthIssuer(env);
  if (!issuer) return null;
  const resource = canonicalMcpResource(requestUrl, env);
  return {
    resource: scope === "root" ? new URL(resource).origin : resource,
    authorization_servers: [issuer],
    bearer_methods_supported: ["header"],
    resource_name: "Arcanea World Context (preview)",
  };
}

/** GET handler shared by the root and the /api/mcp-suffixed metadata paths. */
export function protectedResourceMetadataResponse(
  request: Request,
  scope: "mcp" | "root" = "mcp",
  env: Env = process.env,
): Response {
  const metadata = buildMcpProtectedResourceMetadata(request.url, env, scope);
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
