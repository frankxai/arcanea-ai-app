/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, handleApiError, parsePaginationParams } from '@/lib/api-utils';

// `trending_creations` is a view whose `trending_score` is computed, so Postgres
// must materialise and sort the whole view on every request — it cannot use an
// index. Without a ceiling that runs to the 300s platform limit. Cap the request
// so a slow query fails fast, and cache the result: trending is stale-tolerant.
// The durable fix is a materialised view + index on trending_score (needs a
// migration; the view definition is not currently checked into supabase/).
export const maxDuration = 15;
export const revalidate = 60;

const QUERY_TIMEOUT_MS = 8000;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize } = parsePaginationParams(searchParams);
    const element = searchParams.get('element');
    const gate = searchParams.get('gate');

    const supabase = await createClient();

    // trending_creations is a view that may not exist yet in all environments.
    // Gracefully return empty array instead of 500.
    let query = supabase
      .from('trending_creations')
      .select('*')
      .order('trending_score', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)
      .abortSignal(AbortSignal.timeout(QUERY_TIMEOUT_MS));

    if (element) query = query.eq('element', element);
    if (gate) query = query.eq('gate', gate);

    const { data, error } = await query;

    // If the table/view doesn't exist, return empty rather than 500
    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return successResponse({ creations: [], page, pageSize });
      }
      throw error;
    }

    return successResponse({
      creations: data ?? [],
      page,
      pageSize,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
