import { cache } from 'react';
import { pagesServiceClient, PAGES_TABLE } from '@/lib/pages/db';
import type { PageRow } from '@/lib/pages/types';

/**
 * Fetch a Page row by slug, deduplicated per-request via React `cache` so
 * generateMetadata and the page component share a single DB read.
 */
export const getPageRow = cache(async (slug: string): Promise<PageRow | null> => {
  try {
    const db = pagesServiceClient();
    const { data } = await db.from(PAGES_TABLE).select('*').eq('slug', slug).maybeSingle();
    return (data as PageRow) ?? null;
  } catch {
    return null;
  }
});
