/**
 * Health Check Endpoint
 *
 * Returns the public health status of the Arcanea platform.
 * Fast, lightweight, no auth required.
 *
 * @route GET /api/health
 * @returns {Object} Platform status, version, feature flags, uptime info
 */

import { NextResponse } from 'next/server';

export const runtime = 'edge';

const startedAt = Date.now();

export async function GET() {
  const uptimeMs = Date.now() - startedAt;

  return NextResponse.json(
    {
      status: 'healthy',
      version: '1.8.0',
      timestamp: new Date().toISOString(),
      uptime: {
        ms: uptimeMs,
        human: formatUptime(uptimeMs),
      },
      features: {
        chat: true,
        imagine: true,
        library: true,
        credits: true,
        forge: false,
      },
      guardian: 'Shinkami',
      gate: 'Source',
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * HEAD request for simple uptime pings (load balancers, cron monitors).
 */
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
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
