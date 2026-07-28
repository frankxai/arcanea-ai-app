/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, handleApiError, parsePaginationParams } from '@/lib/api-utils';

// `trending_creations` is a view whose `trending_score` is computed, so Postgres
// must materialise and sort the whole view on every request — it cannot use an
// index. Without a ceiling that runs to the platform limit. Cap the request and
// cache the result: trending is stale-tolerant. The durable fix is a materialised
// view + index on trending_score (the view definition is not currently checked in).
export const maxDuration = 15;
export const revalidate = 60;

// Leave enough headroom for cold start, response serialization, and the platform
// to flush the response before the 15-second function ceiling.
const QUERY_TIMEOUT_MS = 6000;

function emptyTrendingResponse(
  page: number,
  pageSize: number,
  reason?: 'trending-timeout'
) {
  const response = successResponse({ creations: [], page, pageSize });
  if (reason) response.headers.set('x-arcanea-degraded', reason);
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize } = parsePaginationParams(searchParams);
    const element = searchParams.get('element');
    const gate = searchParams.get('gate');

    const supabase = await createClient();
    const controller = new AbortController();

    // `abortSignal()` alone was not sufficient in production: the upstream
    // PostgREST request still reached Vercel's 15-second function ceiling. Race
    // it explicitly so this stale-tolerant endpoint always returns a bounded,
    // truthful fallback while the abort tears down the underlying request.
    let query = supabase
      .from('trending_creations')
      .select('*')
      .order('trending_score', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)
      .abortSignal(controller.signal);

    if (element) query = query.eq('element', element);
    if (gate) query = query.eq('gate', gate);

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<{ kind: 'timeout' }>((resolve) => {
      timeoutId = setTimeout(() => {
        // Resolve the bounded fallback before aborting so an AbortError cannot
        // win the race and be misreported as an internal server error.
        resolve({ kind: 'timeout' });
        controller.abort();
      }, QUERY_TIMEOUT_MS);
    });

    const queryResult = query.then(
      (result) => ({ kind: 'result' as const, result }),
      (error: unknown) => ({ kind: 'error' as const, error })
    );

    const outcome = await Promise.race([queryResult, timeout]);
    if (timeoutId) clearTimeout(timeoutId);

    if (outcome.kind === 'timeout') {
      console.warn(
        `[api/trending] query exceeded ${QUERY_TIMEOUT_MS}ms; returning empty fallback`
      );
      return emptyTrendingResponse(page, pageSize, 'trending-timeout');
    }

    if (outcome.kind === 'error') throw outcome.error;

    const { data, error } = outcome.result;

    // If the table/view doesn't exist, return empty rather than 500.
    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return emptyTrendingResponse(page, pageSize);
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
