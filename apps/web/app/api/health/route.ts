/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Public readiness endpoint.
 *
 * Liveness and readiness are separate: the Edge route can be live while the
 * required public Supabase data plane is unavailable. GET and HEAD return 503
 * while degraded so monitors cannot mistake a partial deployment for healthy.
 */

import { NextResponse } from "next/server";
import {
  getPublicSupabaseBinding,
  PublicSupabaseBindingError,
} from "@/lib/supabase/env";

export const runtime = "edge";

const startedAt = Date.now();
const READINESS_TIMEOUT_MS = 2_500;

type ReadinessCheck = {
  ready: boolean;
  status: "ready" | "missing" | "invalid" | "unreachable";
  code?: string;
  latencyMs?: number;
};

async function checkPublicDataReadiness(): Promise<ReadinessCheck> {
  const started = performance.now();

  try {
    const { url, apiKey } = getPublicSupabaseBinding();
    const response = await fetch(
      `${url}/rest/v1/media_catalog?select=id&limit=1`,
      {
        headers: {
          apikey: apiKey,
        },
        signal: AbortSignal.timeout(READINESS_TIMEOUT_MS),
        cache: "no-store",
      },
    );
    const latencyMs = Math.round(performance.now() - started);

    return response.ok
      ? { ready: true, status: "ready", latencyMs }
      : {
          ready: false,
          status: "unreachable",
          code: "SUPABASE_PUBLIC_READ_UNAVAILABLE",
          latencyMs,
        };
  } catch (error) {
    if (error instanceof PublicSupabaseBindingError) {
      return {
        ready: false,
        status: error.code.endsWith("_MISSING") ? "missing" : "invalid",
        code: error.code,
      };
    }

    return {
      ready: false,
      status: "unreachable",
      code: "SUPABASE_PUBLIC_READ_UNAVAILABLE",
      latencyMs: Math.round(performance.now() - started),
    };
  }
}

export async function GET() {
  const uptimeMs = Date.now() - startedAt;
  const publicData = await checkPublicDataReadiness();

  return NextResponse.json(
    {
      status: publicData.ready ? "healthy" : "degraded",
      live: true,
      ready: publicData.ready,
      version: "1.8.0",
      timestamp: new Date().toISOString(),
      uptime: {
        ms: uptimeMs,
        human: formatUptime(uptimeMs),
      },
      checks: {
        publicData,
      },
      guardian: "Shinkami",
      gate: "Source",
      environment:
        process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    },
    {
      status: publicData.ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Type": "application/json",
        ...(publicData.ready ? {} : { "Retry-After": "30" }),
      },
    },
  );
}

export async function HEAD() {
  const publicData = await checkPublicDataReadiness();

  return new NextResponse(null, {
    status: publicData.ready ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
      "X-Arcanea-Readiness": publicData.status,
      ...(publicData.ready ? {} : { "Retry-After": "30" }),
    },
  });
}

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
