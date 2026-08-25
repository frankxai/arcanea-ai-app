import { createClient } from "@supabase/supabase-js";

import { GatewayError } from "@arcanea/mcp-server/gateway";

import type { Database } from "@/lib/database/types/supabase";

import type { AuthenticatedWorldContextSession } from "./world-context-http";
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

export async function authenticateWorldContextBearer(
  request: Request,
): Promise<AuthenticatedWorldContextSession | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("example.supabase.co")
  ) {
    throw new GatewayError("adapter-required");
  }

  const token = bearerToken(request);
  if (!token) return null;
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
  if (error || !user) return null;

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
