/**
 * Book Cover Resolver
 *
 * Unified API for resolving book cover URLs across two storage tiers:
 * - 'git'      — static files in apps/web/public/images/books/ (Vercel CDN)
 * - 'supabase' — Supabase Storage book-covers bucket (Supabase CDN)
 *
 * Resolution order:
 * 1. Try DB (book_covers table, status='active')
 * 2. Fall back to hardcoded COVER_MAP for pre-migration books
 * 3. Fall back to slug convention /images/books/{slug}-cover.png
 */

import { createClient } from '@/lib/supabase/server';

// Fallback map for books without DB records yet (pre-Phase 2 deployment)
const LEGACY_COVER_MAP: Record<string, string> = {
  'forge-of-ruin': '/images/books/forge-of-ruin-cover-nb2.png',
  'tides-of-silence': '/images/books/tides-of-silence-cover-v2.png',
  'heart-of-pyrathis': '/images/books/heart-of-pyrathis-cover-v2.png',
};

export interface BookCover {
  id: string;
  bookId: string;
  version: number;
  url: string;
  storageTier: 'git' | 'supabase';
  modelId: string | null;
  modelTier: string | null;
  generatedAt: string;
  width: number | null;
  height: number | null;
}

/**
 * Resolve the active cover URL for a book slug.
 * Safe to call at build time — falls back gracefully if DB unavailable.
 */
export async function getBookCover(slug: string): Promise<string> {
  // Try DB first
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('book_covers')
      .select('public_url, storage_tier, status')
      .eq('status', 'active')
      .in(
        'book_id',
        // subselect books by slug
        (await supabase.from('books').select('id').eq('slug', slug)).data?.map((b: any) => b.id) || []
      )
      .maybeSingle();

    if (!error && data?.public_url) {
      return data.public_url;
    }
  } catch {
    // DB unavailable — fall through to static
  }

  // Legacy fallback
  if (LEGACY_COVER_MAP[slug]) {
    return LEGACY_COVER_MAP[slug];
  }

  // Convention fallback
  return `/images/books/${slug}-cover.png`;
}

/**
 * Get all cover versions for a book (for version history UI).
 */
export async function getBookCoverVersions(slug: string): Promise<BookCover[]> {
  try {
    const supabase = await createClient();

    const { data: book } = await supabase
      .from('books')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!book) return [];

    const { data: covers } = await supabase
      .from('book_covers')
      .select('id, book_id, version, public_url, storage_tier, model_id, model_tier, created_at, width, height')
      .eq('book_id', book.id)
      .order('version', { ascending: false });

    if (!covers) return [];

    return covers.map((c: any) => ({
      id: c.id,
      bookId: c.book_id,
      version: c.version,
      url: c.public_url,
      storageTier: c.storage_tier,
      modelId: c.model_id,
      modelTier: c.model_tier,
      generatedAt: c.created_at,
      width: c.width,
      height: c.height,
    }));
  } catch {
    return [];
  }
}

/**
 * Register a newly-generated cover in the database.
 * Called by the cover generation API after NB2 generation completes.
 */
export interface RegisterCoverInput {
  bookSlug: string;
  storageTier: 'git' | 'supabase';
  storagePath: string;
  publicUrl: string;
  modelId: string;
  modelTier: 'nb2' | 'nbpro' | 'imagen' | 'imagen-ultra' | 'human';
  prompt: string;
  generationParams?: Record<string, unknown>;
  generationCostUsd?: number;
  width?: number;
  height?: number;
  fileSizeBytes?: number;
  generatedByUserId?: string;
  autoActivate?: boolean;
}

export async function registerCover(input: RegisterCoverInput): Promise<BookCover | null> {
  const supabase = await createClient();

  const { data: book } = await supabase
    .from('books')
    .select('id')
    .eq('slug', input.bookSlug)
    .single();

  if (!book) return null;

  // Get next version number
  const { data: latest } = await supabase
    .from('book_covers')
    .select('version')
    .eq('book_id', book.id)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (latest?.version || 0) + 1;

  const { data: cover, error } = await supabase
    .from('book_covers')
    .insert({
      book_id: book.id,
      version: nextVersion,
      status: input.autoActivate ? 'active' : 'draft',
      storage_tier: input.storageTier,
      storage_path: input.storagePath,
      public_url: input.publicUrl,
      model_id: input.modelId,
      model_tier: input.modelTier,
      prompt: input.prompt,
      generation_params: input.generationParams || {},
      generation_cost_usd: input.generationCostUsd,
      width: input.width,
      height: input.height,
      file_size_bytes: input.fileSizeBytes,
      generated_by: input.generatedByUserId,
    })
    .select('id, book_id, version, public_url, storage_tier, model_id, model_tier, created_at, width, height')
    .single();

  if (error || !cover) return null;

  // If autoActivate, deactivate previous
  if (input.autoActivate) {
    await supabase.rpc('set_active_cover', {
      p_book_id: book.id,
      p_cover_id: cover.id,
    });
  }

  return {
    id: cover.id,
    bookId: cover.book_id,
    version: cover.version,
    url: cover.public_url,
    storageTier: cover.storage_tier,
    modelId: cover.model_id,
    modelTier: cover.model_tier,
    generatedAt: cover.created_at,
    width: cover.width,
    height: cover.height,
  };
}

/**
 * Promote a cover version to active status.
 */
export async function setActiveCover(bookSlug: string, version: number): Promise<boolean> {
  const supabase = await createClient();

  const { data: book } = await supabase
    .from('books')
    .select('id')
    .eq('slug', bookSlug)
    .single();

  if (!book) return false;

  const { data: cover } = await supabase
    .from('book_covers')
    .select('id')
    .eq('book_id', book.id)
    .eq('version', version)
    .single();

  if (!cover) return false;

  const { error } = await supabase.rpc('set_active_cover', {
    p_book_id: book.id,
    p_cover_id: cover.id,
  });

  return !error;
}

/**
 * Cost estimate by model tier (for rate limiting and budget tracking).
 */
export const MODEL_COSTS_USD: Record<string, number> = {
  nb2: 0.02,
  nbpro: 0.04,
  imagen: 0.04,
  'imagen-ultra': 0.06,
  'imagen-fast': 0.02,
  human: 0,
};
