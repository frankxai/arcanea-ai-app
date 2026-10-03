/**
 * Public Saga API — single released book.
 *
 * The allowlist check runs before the loader, so an unreleased or
 * traversal-shaped book id never reaches the filesystem.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSagaBook } from '@/lib/saga/loader';
import {
  isPublicBook,
  notPublicPayload,
  internalErrorPayload,
} from '@/lib/saga/public-release-registry';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  try {
    const { bookId } = await params;

    if (!isPublicBook(bookId)) {
      return NextResponse.json(notPublicPayload('book'), { status: 404 });
    }

    const book = await getSagaBook(bookId);
    if (!book) {
      return NextResponse.json(notPublicPayload('book'), { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { book },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[saga/bookId GET] Error:', error);
    return NextResponse.json(internalErrorPayload(), { status: 500 });
  }
}
