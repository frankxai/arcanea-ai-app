import { createClient, isAuthRetryableFetchError } from "@supabase/supabase-js";

import { GatewayError } from "@arcanea/mcp-server/gateway";

import type { Database } from "@/lib/database/types/supabase";

import {
  canonicalMcpResource,
  supabaseAuthIssuer,
} from "./protected-resource-metadata";
import {
  WorldContextInvalidTokenError,
  type AuthenticatedWorldContextSession,
} from "./world-context-http";
import { createOwnerSourceWorldContextRepository } from "./world-context-repository";
import { createSupabaseWorldContextDataSource } from "./world-context-supabase";

const MAX_BEARER_TOKEN_CHARACTERS = 8192;

function bearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization) return null;
  const match = /^Bearer ([A-Za-z0-9._~+/=-]+)$/i.exec(authorization);
  if (
    !match ||
    match[1].length === 0 ||
    match[1].length > MAX_BEARER_TOKEN_CHARACTERS
  )
    return null;
  return match[1];
}

interface AccessTokenClaims {
  iss?: unknown;
  sub?: unknown;
  aud?: unknown;
}

/** Decode a JWT payload. Only call after Supabase has verified the token. */
function decodeJwtClaims(token: string): AccessTokenClaims | null {
  const segments = token.split(".");
  if (segments.length !== 3) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(segments[1], "base64url").toString("utf8"),
    ) as unknown;
    return typeof payload === "object" &&
      payload !== null &&
      !Array.isArray(payload)
      ? (payload as AccessTokenClaims)
      : null;
  } catch {
    return null;
  }
}

/** `aud` (string or array, RFC 7519 §4.1.3) names exactly this resource. */
export function audienceIncludes(aud: unknown, resource: string): boolean {
  if (typeof aud === "string") return aud === resource;
  return Array.isArray(aud) && aud.some((value) => value === resource);
}

/**
 * Bearer auth for /api/mcp. The token must (1) be accepted by Supabase Auth
 * (`getUser`, which checks signature, expiry and session), (2) come from this
 * project's issuer, and (3) be issued for this resource: its `aud` must equal
 * or contain the canonical /api/mcp URL. Plain Supabase session tokens carry
 * `aud: "authenticated"` and are therefore rejected.
 *
 * Returns null when no usable Bearer credential was sent; throws
 * WorldContextInvalidTokenError when one was sent but is not acceptable.
 */
export async function authenticateWorldContextBearer(
  request: Request,
): Promise<AuthenticatedWorldContextSession | null> {
  const token = bearerToken(request);
  if (!token) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const issuer = supabaseAuthIssuer({ NEXT_PUBLIC_SUPABASE_URL: supabaseUrl });
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    !issuer ||
    supabaseUrl.includes("example.supabase.co")
  ) {
    throw new GatewayError("adapter-required");
  }
  const resource = canonicalMcpResource(request.url);
  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);
  if (
    error &&
    (isAuthRetryableFetchError(error) || (error.status ?? 0) >= 500)
  ) {
    throw new GatewayError("adapter-required");
  }
  if (error || !user) throw new WorldContextInvalidTokenError("rejected");

  // getUser verified this exact token, so its claims can be trusted.
  const claims = decodeJwtClaims(token);
  if (!claims || claims.iss !== issuer || claims.sub !== user.id) {
    throw new WorldContextInvalidTokenError("claims");
  }
  if (!audienceIncludes(claims.aud, resource)) {
    throw new WorldContextInvalidTokenError("audience");
  }

  return {
    actor: {
      actorId: user.id,
      // Compatibility-only personal tenancy; no durable tenant table exists yet.
      tenantId: `personal:${user.id}`,
    },
    repository: createOwnerSourceWorldContextRepository(
      createSupabaseWorldContextDataSource(client),
    ),
  };
}
