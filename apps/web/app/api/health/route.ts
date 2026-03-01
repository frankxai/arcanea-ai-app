/**
 * Health Check Endpoint
 *
 * Returns the health status of the application and its dependencies.
 * Used by monitoring systems and CI/CD pipeline for verification.
 *
 * @route GET /api/health
 * @returns {Object} Health status object
 *
 * Status Codes:
 * - 200: All systems operational
 * - 503: Service unavailable (one or more checks failed)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database/types/supabase';

// NOTE: This route uses runtime = "edge" which is incompatible with @supabase/ssr
// (SSR client requires Node.js cookie APIs). We use createClient from @supabase/supabase-js
// directly here with anon key — no session cookies needed for a health check ping.
export const runtime = "edge";

interface HealthCheck {
  api: boolean;
  database: boolean;
  timestamp: string;
  version: string;
  environment: string;
  app: string;
}

/**
 * Main health check handler
 */
export async function GET() {
  let dbHealthy = false;
  let dbError: string | null = null;
  let urlPrefix: string | null = null;
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (url && key) {
      urlPrefix = url.substring(0, 30) + '...';
      const supabase = createClient<Database>(url, key);
      const { error } = await supabase.from('profiles').select('id').limit(1);
      dbHealthy = !error;
      if (error) dbError = `${error.code}: ${error.message}`;
    } else {
      dbError = 'missing env vars';
    }
  } catch (e) {
    dbHealthy = false;
    dbError = e instanceof Error ? e.message : String(e);
  }

  const health: HealthCheck = {
    api: true,
    database: dbHealthy,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    app: 'web',
  };

  // Diagnostic: show which env var names are present (not values)
  const envDiag: Record<string, boolean> = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  // Determine overall health
  const isHealthy = health.api && health.database;

  return NextResponse.json(
    { ...health, env: envDiag, dbError, urlPrefix },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * HEAD request for simple uptime checks
 */
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
