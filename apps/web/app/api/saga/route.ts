/**
 * Public Saga API — released books only.
 *
 * Books are default-deny. Only ids present in the public release registry
 * allowlist are loaded, so an unreleased manuscript is never read from disk on
 * this route rather than being read and then filtered out.
 */

import { NextResponse } from 'next/server';
import { getSagaBook } from '@/lib/saga/loader';
import type { SagaBook } from '@/lib/saga/loader';
import {
  PUBLIC_RELEASE_REGISTRY,
  internalErrorPayload,
} from '@/lib/saga/public-release-registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const loaded = await Promise.all(
      PUBLIC_RELEASE_REGISTRY.publicBookIds.map((id) => getSagaBook(id)),
    );
    const books = loaded.filter((book): book is SagaBook => book !== null);

    return NextResponse.json({
      success: true,
      data: { books, releases: PUBLIC_RELEASE_REGISTRY.releases },
      meta: {
        policy: PUBLIC_RELEASE_REGISTRY.policy,
        registryVersion: PUBLIC_RELEASE_REGISTRY.schemaVersion,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[saga GET] Error loading released books:', error);
    return NextResponse.json(internalErrorPayload(), { status: 500 });
  }
}
