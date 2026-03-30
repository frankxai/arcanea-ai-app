/**
 * API Key Authentication for AgentDB Cloud
 *
 * Validates Bearer tokens with the `arc_` prefix format.
 * Extracts the agent ID associated with the key.
 *
 * Production: validate against Supabase `api_keys` table.
 * Current: in-memory validation for development.
 */

import { NextResponse } from 'next/server';

export interface AuthResult {
  valid: true;
  agentId: string;
  apiKey: string;
}

export interface AuthError {
  valid: false;
  response: NextResponse;
}

/** In-memory rate limit tracking per API key */
const rateLimits = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 120; // 120 requests per minute

/**
 * Known API keys for development. In production, these would live in
 * a Supabase `api_keys` table with columns:
 *   key_hash (text), agent_id (uuid), created_at, revoked_at, tier
 *
 * TODO: Replace with Supabase lookup when api_keys table is deployed.
 */
const DEV_KEYS: Record<string, string> = {
  arc_dev_test_key_001: 'agent-dev-001',
  arc_dev_test_key_002: 'agent-dev-002',
};

/**
 * Authenticate an incoming request via API key.
 *
 * Extracts the Bearer token from the Authorization header,
 * validates the `arc_` prefix, and resolves the agent ID.
 */
export function authenticateRequest(
  request: Request
): AuthResult | AuthError {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return {
      valid: false,
      response: NextResponse.json(
        { ok: false, error: 'Missing Authorization header' },
        { status: 401 }
      ),
    };
  }

  if (!authHeader.startsWith('Bearer ')) {
    return {
      valid: false,
      response: NextResponse.json(
        { ok: false, error: 'Authorization header must use Bearer scheme' },
        { status: 401 }
      ),
    };
  }

  const apiKey = authHeader.slice(7).trim();

  if (!apiKey.startsWith('arc_')) {
    return {
      valid: false,
      response: NextResponse.json(
        { ok: false, error: 'API key must start with arc_' },
        { status: 401 }
      ),
    };
  }

  // Resolve agent ID from key
  // TODO: Replace with Supabase query: SELECT agent_id FROM api_keys WHERE key_hash = hash(apiKey) AND revoked_at IS NULL
  const agentId = DEV_KEYS[apiKey];

  if (!agentId) {
    return {
      valid: false,
      response: NextResponse.json(
        { ok: false, error: 'Invalid or revoked API key' },
        { status: 401 }
      ),
    };
  }

  return { valid: true, agentId, apiKey };
}

/**
 * Check rate limit for an API key.
 * Returns rate limit headers and whether the request is allowed.
 */
export function checkRateLimit(apiKey: string): {
  allowed: boolean;
  headers: Record<string, string>;
} {
  const now = Date.now();
  let entry = rateLimits.get(apiKey);

  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimits.set(apiKey, entry);
  }

  entry.count++;

  const remaining = Math.max(0, RATE_LIMIT_MAX - entry.count);
  const resetEpoch = Math.ceil(entry.resetAt / 1000);

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(resetEpoch),
  };

  return {
    allowed: entry.count <= RATE_LIMIT_MAX,
    headers,
  };
}

/**
 * Combine auth + rate limit into a single guard.
 * Returns the auth result plus rate limit headers, or an error response.
 */
export function guardRequest(
  request: Request
): { auth: AuthResult; headers: Record<string, string> } | { error: NextResponse } {
  const authResult = authenticateRequest(request);

  if (!authResult.valid) {
    return { error: authResult.response };
  }

  const rateResult = checkRateLimit(authResult.apiKey);

  if (!rateResult.allowed) {
    return {
      error: NextResponse.json(
        { ok: false, error: 'Rate limit exceeded. Retry after reset.' },
        { status: 429, headers: rateResult.headers }
      ),
    };
  }

  return { auth: authResult, headers: rateResult.headers };
}
