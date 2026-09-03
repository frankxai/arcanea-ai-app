/**
 * Public Saga API — single released chapter.
 *
 * This is the route that previously returned full chapter markdown to any
 * unauthenticated caller. The allowlist check runs before the loader, so the
 * manuscript of an unreleased book is never read from disk here.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSagaChapter } from '@/lib/saga/loader';
import {
  isPublicBook,
  notPublicPayload,
  internalErrorPayload,
} from '@/lib/saga/public-release-registry';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string; chapterSlug: string }> },
) {
  try {
    const { bookId, chapterSlug } = await params;

    if (!isPublicBook(bookId)) {
      return NextResponse.json(notPublicPayload('chapter'), { status: 404 });
    }

    const chapter = await getSagaChapter(bookId, chapterSlug);
    if (!chapter) {
      return NextResponse.json(notPublicPayload('chapter'), { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { chapter },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[saga/bookId/chapterSlug GET] Error:', error);
    return NextResponse.json(internalErrorPayload(), { status: 500 });
  }
}
