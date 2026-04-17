import { NextResponse } from 'next/server';

/**
 * Proxies Composio Agent Orchestrator's session list from the local daemon
 * (http://localhost:4200). The daemon is developer-machine-only — this route
 * is intended for the /ops/agents dashboard and returns a graceful empty
 * shape when the daemon isn't running.
 */

const AO_API = process.env.AO_API_URL ?? 'http://localhost:4200';
const TIMEOUT_MS = 1500;

export const dynamic = 'force-dynamic';

export async function GET() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${AO_API}/api/sessions`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timer);
    if (!res.ok) {
      return NextResponse.json({ ok: false, reason: `AO returned ${res.status}`, sessions: [] });
    }
    const sessions = await res.json();
    return NextResponse.json({ ok: true, sessions });
  } catch (err) {
    clearTimeout(timer);
    const reason = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json({ ok: false, reason, sessions: [] });
  }
}
