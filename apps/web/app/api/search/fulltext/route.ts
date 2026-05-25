/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';

const searchSchema = z.object({
  q: z.string().min(1).max(500),
  mode: z.enum(['fulltext', 'fuzzy']).default('fulltext'),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  threshold: z.coerce.number().min(0).max(1).default(0.3),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = searchSchema.safeParse({
      q: searchParams.get('q'),
      mode: searchParams.get('mode') ?? 'fulltext',
      limit: searchParams.get('limit') ?? '20',
      offset: searchParams.get('offset') ?? '0',
      threshold: searchParams.get('threshold') ?? '0.3',
    });

    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid search parameters', 400, {
        errors: parsed.error.errors,
      });
    }

    const { q, mode, limit, offset, threshold } = parsed.data;
    const supabase = await createClient();

    if (mode === 'fuzzy') {
      const { data, error } = await supabase.rpc('fuzzy_search_creations', {
        search_query: q,
        similarity_threshold: threshold,
        result_limit: limit,
      });
      if (error) throw error;
      return successResponse({ results: data ?? [], query: q, mode });
    }

    // Full-text search
    const { data, error } = await supabase.rpc('search_creations', {
      search_query: q,
      result_limit: limit,
      result_offset: offset,
    });
    if (error) throw error;
    return successResponse({ results: data ?? [], query: q, mode });
  } catch (error) {
    return handleApiError(error);
  }
}
