/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Saga API — List all books
 *
 * GET /api/saga — Returns all saga books with metadata and chapter summaries.
 * Public endpoint, no auth required.
 */

import { NextResponse } from 'next/server';
import { getSagaBooks } from '@/lib/saga/loader';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const books = await getSagaBooks();

    return NextResponse.json({
      success: true,
      data: { books },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[saga GET] Error loading books:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to load saga books' },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 500 },
    );
  }
}
