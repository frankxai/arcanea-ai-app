/**
 * Public Saga API — release metadata only.
 *
 * Manuscripts and internal reference documents remain default-deny until a
 * release gate explicitly adds them to the public release registry.
 */

import { NextResponse } from 'next/server';
import { PUBLIC_RELEASE_REGISTRY } from '@/lib/saga/public-release-registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      books: [],
      releases: PUBLIC_RELEASE_REGISTRY.releases,
    },
    meta: {
      policy: PUBLIC_RELEASE_REGISTRY.policy,
      registryVersion: PUBLIC_RELEASE_REGISTRY.schemaVersion,
      timestamp: new Date().toISOString(),
    },
  });
}
