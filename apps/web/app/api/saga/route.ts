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
