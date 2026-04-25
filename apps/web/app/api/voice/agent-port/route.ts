/**
 * Agent port bridge.
 *
 * Reads ~/.arcanea/agent-port to discover which port the local agent
 * actually bound to (might be 7777, but could be 7778+ if 7777 was busy).
 *
 * Local dev only. Returns the chosen port or 404.
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const host = req.headers.get('host') || '';
  if (!(host.startsWith('localhost') || host.startsWith('127.0.0.1'))) {
    return NextResponse.json({ error: 'local-only' }, { status: 404 });
  }
  const portPath = join(homedir(), '.arcanea', 'agent-port');
  if (!existsSync(portPath)) {
    return NextResponse.json({ port: 7777, source: 'default' });
  }
  try {
    const raw = readFileSync(portPath, 'utf8').trim();
    const port = parseInt(raw, 10);
    if (isNaN(port) || port < 1024 || port > 65535) {
      return NextResponse.json({ port: 7777, source: 'default-fallback' });
    }
    return NextResponse.json({ port, source: 'file' });
  } catch {
    return NextResponse.json({ port: 7777, source: 'default-fallback' });
  }
}
