/**
 * Saga API — Documents by category
 *
 * GET /api/saga/docs/[category] — List documents in a category.
 * GET /api/saga/docs/[category]?slug=xxx — Get a single document with full content.
 *
 * Valid categories: worldbuilding, characters, legends, reference
 * Public endpoint, no auth required.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSagaDocuments, getSagaDocument } from '@/lib/saga/loader';
import type { SagaDocument } from '@/lib/saga/loader';

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
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // Single document mode
    if (slug) {
      const doc = await getSagaDocument(cat, slug);

      if (!doc) {
        return NextResponse.json(
          {
            success: false,
            error: { code: 'NOT_FOUND', message: `Document "${slug}" not found in ${category}` },
            meta: { timestamp: new Date().toISOString() },
          },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        data: { document: doc },
        meta: { timestamp: new Date().toISOString() },
      });
    }

    // List mode
    const documents = await getSagaDocuments(cat);

    return NextResponse.json({
      success: true,
      data: { documents, total: documents.length },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[saga/docs/category GET] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to load documents' },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 },
    );
  }
}
