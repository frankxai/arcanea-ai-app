/**
 * Public Saga API — released reference documents only.
 *
 * Canon bibles, mystery ledgers, and development reference documents are
 * internal unless an approved release explicitly allowlists their slug. List
 * mode iterates the allowlist rather than the directory, so an unreleased
 * document is never read from disk on this route.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSagaDocument } from '@/lib/saga/loader';
import type { SagaDocument } from '@/lib/saga/loader';
import {
  PUBLIC_RELEASE_REGISTRY,
  isPublicDocument,
  notPublicPayload,
  internalErrorPayload,
} from '@/lib/saga/public-release-registry';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES = new Set<SagaDocument['category']>([
  'worldbuilding',
  'characters',
  'legends',
  'reference',
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> },
) {
  try {
    const { category } = await params;

    if (!VALID_CATEGORIES.has(category as SagaDocument['category'])) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: `Invalid category "${category}". Valid: ${[...VALID_CATEGORIES].join(', ')}`,
          },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 400 },
      );
    }

    const cat = category as SagaDocument['category'];
    const slug = new URL(request.url).searchParams.get('slug');

    if (slug) {
      if (!isPublicDocument(slug)) {
        return NextResponse.json(notPublicPayload('document'), { status: 404 });
      }

      const doc = await getSagaDocument(cat, slug);
      if (!doc) {
        return NextResponse.json(notPublicPayload('document'), { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: { document: doc },
        meta: { timestamp: new Date().toISOString() },
      });
    }

    const loaded = await Promise.all(
      PUBLIC_RELEASE_REGISTRY.publicDocumentSlugs.map((s) => getSagaDocument(cat, s)),
    );
    const documents = loaded.filter((doc): doc is SagaDocument => doc !== null);

    return NextResponse.json({
      success: true,
      data: { documents, total: documents.length },
      meta: {
        policy: PUBLIC_RELEASE_REGISTRY.policy,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[saga/docs/category GET] Error:', error);
    return NextResponse.json(internalErrorPayload(), { status: 500 });
  }
}
