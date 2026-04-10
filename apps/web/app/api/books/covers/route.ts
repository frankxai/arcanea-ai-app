/**
 * Book Covers API
 *
 * GET  /api/books/covers?slug=<book-slug>       — list all cover versions for a book
 * POST /api/books/covers                        — register a new cover (called after generation)
 * PATCH /api/books/covers                       — promote a version to active
 *
 * All write operations require authentication and author-of-book authorization (via RLS).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getBookCoverVersions,
  registerCover,
  setActiveCover,
  MODEL_COSTS_USD,
  type RegisterCoverInput,
} from '@/lib/books/cover-resolver';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/books/covers?slug=<book-slug>
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'slug parameter required' }, { status: 400 });
  }

  const covers = await getBookCoverVersions(slug);
  return NextResponse.json({ slug, covers });
}

// POST /api/books/covers — register a generated cover
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: Partial<RegisterCoverInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Validate required fields
  const required = ['bookSlug', 'storageTier', 'storagePath', 'publicUrl', 'modelId', 'modelTier', 'prompt'];
  for (const field of required) {
    if (!body[field as keyof RegisterCoverInput]) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  // Rate limit check: max 10 cover generations per user per 24h
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('book_covers')
    .select('id', { count: 'exact', head: true })
    .eq('generated_by', user.id)
    .gte('created_at', oneDayAgo);

  if ((count || 0) >= 10) {
    return NextResponse.json(
      { error: 'Rate limit exceeded: max 10 cover generations per 24h' },
      { status: 429 }
    );
  }

  // Calculate cost if not provided
  const cost = body.generationCostUsd ?? MODEL_COSTS_USD[body.modelTier!] ?? 0;

  const cover = await registerCover({
    ...body as RegisterCoverInput,
    generationCostUsd: cost,
    generatedByUserId: user.id,
  });

  if (!cover) {
    return NextResponse.json(
      { error: 'Failed to register cover — book not found or permission denied' },
      { status: 404 }
    );
  }

  return NextResponse.json({ cover }, { status: 201 });
}

// PATCH /api/books/covers — promote a version to active
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: { slug?: string; version?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.slug || !body.version) {
    return NextResponse.json({ error: 'slug and version required' }, { status: 400 });
  }

  // Check author authorization
  const { data: book } = await supabase
    .from('books')
    .select('id')
    .eq('slug', body.slug)
    .single();

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const { data: author } = await supabase
    .from('book_authors')
    .select('role')
    .eq('book_id', book.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!author) {
    return NextResponse.json({ error: 'Not authorized — must be a book author' }, { status: 403 });
  }

  const success = await setActiveCover(body.slug, body.version);

  if (!success) {
    return NextResponse.json({ error: 'Version not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, slug: body.slug, version: body.version });
}
