// ============================================================
// Arcanea Kura — health check
// Used by the extension popup to verify the bridge endpoint is
// reachable before showing the "Send to Arcanea" button.
// ============================================================

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPPORTED_SCHEMA = '0.2.0';

export function GET(): NextResponse {
  return NextResponse.json(
    {
      ok: true,
      service: 'arcanea-kura-bridge',
      schemaVersion: SUPPORTED_SCHEMA,
      acceptsSchema: [SUPPORTED_SCHEMA],
      status: 'ready',
      message: 'Kura bridge is online. POST a capture to /api/kura/import.',
    },
    {
      headers: {
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
}
