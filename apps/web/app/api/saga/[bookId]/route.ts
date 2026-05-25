/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Saga API — Single book
 *
 * GET /api/saga/[bookId] — Returns a single book with its chapter list.
 * Public endpoint, no auth required.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSagaBook } from '@/lib/saga/loader';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  try {
    const { bookId } = await params;
    const book = await getSagaBook(bookId);

    if (!book) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: `Book "${bookId}" not found` },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { book },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[saga/bookId GET] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to load book' },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 },
    );
  }
}
