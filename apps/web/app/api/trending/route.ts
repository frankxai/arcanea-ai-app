/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest } from 'next/server';
import { successResponse, parsePaginationParams } from '@/lib/api-utils';

// The trending_creations view computes and sorts the full data set on every
// request. Production probes reached Vercel's function ceiling even when the
// request was raced against a local timeout, so the source is quarantined until
// it is replaced by a materialized view with an indexed trending_score.
//
// Keep the public response contract intact and make degraded state explicit.
// Returning an empty list is truthful; querying the known-bad source is not.
export const revalidate = 60;

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const { page, pageSize } = parsePaginationParams(searchParams);
  const response = successResponse({ creations: [], page, pageSize });

  response.headers.set('x-arcanea-degraded', 'trending-source-quarantined');
  return response;
}
