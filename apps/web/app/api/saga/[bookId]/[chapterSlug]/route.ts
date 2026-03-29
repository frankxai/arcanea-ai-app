/**
 * Saga API — Single chapter
 *
 * GET /api/saga/[bookId]/[chapterSlug] — Returns a chapter with full markdown content.
 * Public endpoint, no auth required.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSagaChapter } from '@/lib/saga/loader';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string; chapterSlug: string }> },
) {
  try {
    const { bookId, chapterSlug } = await params;
    const chapter = await getSagaChapter(bookId, chapterSlug);

    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Chapter "${chapterSlug}" not found in book "${bookId}"`,
          },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { chapter },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[saga/bookId/chapterSlug GET] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to load chapter' },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 },
    );
  }
}
