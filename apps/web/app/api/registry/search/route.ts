/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextResponse } from 'next/server';
import { searchAgents } from '@/lib/registry/queries';

/**
 * GET /api/registry/search
 * Public endpoint for agent discovery.
 *
 * Query params:
 *   q           — free-text search
 *   category    — filter by category
 *   capability  — filter by capability (repeatable)
 *   tag         — filter by tag (repeatable)
 *   limit       — max results (default 50, max 200)
 *   offset      — pagination offset
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get('q') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const capabilities = searchParams.getAll('capability');
  const tags = searchParams.getAll('tag');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);
  const offset = Math.max(parseInt(searchParams.get('offset') ?? '0', 10), 0);

  const agents = await searchAgents({
    query: q,
    category,
    capabilities: capabilities.length ? capabilities : undefined,
    tags: tags.length ? tags : undefined,
    limit,
    offset,
  });

  return NextResponse.json({
    data: agents,
    meta: { count: agents.length, limit, offset, query: { q, category, capabilities, tags } },
  });
}
