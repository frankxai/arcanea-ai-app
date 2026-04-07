/**
 * Status Endpoint — Detailed Service Health
 *
 * Checks connectivity to Supabase and presence of required API keys.
 * Public, no auth required. Used by monitoring dashboards.
 *
 * @route GET /api/status
 * @returns {Object} Per-service status with overall health
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database/types/supabase';

export const runtime = 'edge';

interface ServiceStatus {
  ok: boolean;
  latencyMs?: number;
  error?: string;
}

interface StatusResponse {
  healthy: boolean;
  timestamp: string;
  services: {
    supabase: ServiceStatus;
    stripe: ServiceStatus;
    googleAi: ServiceStatus;
    anthropic: ServiceStatus;
  };
}

export async function GET() {
  try {
    const stripe = checkEnvKey('STRIPE_SECRET_KEY');
    const googleAi = checkEnvKey('GOOGLE_AI_API_KEY', 'GOOGLE_GENERATIVE_AI_API_KEY');
    const anthropic = checkEnvKey('ANTHROPIC_API_KEY');
    const supabase = await checkSupabase();

    const result: StatusResponse = {
      healthy: supabase.ok && stripe.ok && googleAi.ok && anthropic.ok,
      timestamp: new Date().toISOString(),
      services: { supabase, stripe, googleAi, anthropic },
    };

    return NextResponse.json(result, {
      status: result.healthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Ping Supabase with a lightweight query and measure latency.
 */
async function checkSupabase(): Promise<ServiceStatus> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return { ok: false, error: 'missing env vars' };
  }

  try {
    const start = Date.now();
    const client = createClient<Database>(url, key);
    const { error } = await client.from('profiles').select('id').limit(1);
    const latencyMs = Date.now() - start;

    if (error) {
      return { ok: false, latencyMs, error: error.message };
    }
    return { ok: true, latencyMs };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'unknown error' };
  }
}

/**
 * Check whether one or more env var names are set (any match counts).
 * Never exposes the actual value.
 */
function checkEnvKey(...names: string[]): ServiceStatus {
  const found = names.some((n) => !!process.env[n]);
  return found
    ? { ok: true }
    : { ok: false, error: `missing env (${names.join(' | ')})` };
}
