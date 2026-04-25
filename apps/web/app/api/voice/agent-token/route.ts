/**
 * Agent token bridge.
 *
 * Reads ~/.arcanea/agent-token (mode 0600 — only Frank's user can read it
 * on POSIX) and returns it to the dashboard JS. Strictly limited to local
 * requests so a deployed Vercel build never serves it.
 *
 * Local dev only. In prod (arcanea.ai) this returns 404 because the token
 * file doesn't exist on Vercel's filesystem and shouldn't.
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isLocalRequest(req: NextRequest): boolean {
  const host = req.headers.get('host') || '';
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) return true;
  // x-forwarded-for from a reverse proxy isn't trusted here — only direct
  // hits to localhost matter for the local-dev token bridge.
  return false;
}

export async function GET(req: NextRequest) {
  if (!isLocalRequest(req)) {
    return NextResponse.json({ error: 'local-only' }, { status: 404 });
  }
  const tokenPath = join(homedir(), '.arcanea', 'agent-token');
  if (!existsSync(tokenPath)) {
    return NextResponse.json({ error: 'agent not running' }, { status: 404 });
  }
  try {
    const token = readFileSync(tokenPath, 'utf8').trim();
    if (!token || token.length < 32) {
      return NextResponse.json({ error: 'invalid token' }, { status: 500 });
    }
    return NextResponse.json({ token }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }
}
