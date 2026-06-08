/**
 * Perplexity-style Pages — shared types.
 *
 * A Page is a published, shareable article distilled from a chat thread:
 * an ordered set of markdown sections plus preserved source citations.
 */

export type PageVisibility = 'public' | 'unlisted' | 'private';

export interface PageSection {
  id: string;
  heading: string;
  markdown: string;
  imageUrl?: string | null;
}

export interface PageSource {
  title: string;
  url: string;
  domain: string;
}

/** Row shape as stored in Supabase (snake_case). */
export interface PageRow {
  id: string;
  slug: string;
  owner_id: string | null;
  title: string;
  summary: string | null;
  cover_image_url: string | null;
  sections: PageSection[];
  sources: PageSource[];
  source_session_id: string | null;
  visibility: PageVisibility;
  view_count: number;
  created_at: string;
  updated_at: string;
}

/** Client/SSR-facing shape (camelCase, no owner id leak by default). */
export interface PageView {
  slug: string;
  title: string;
  summary: string | null;
  coverImageUrl: string | null;
  sections: PageSection[];
  sources: PageSource[];
  visibility: PageVisibility;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
}

/** Compact shape for listing (Discover, "my pages"). */
export interface PageSummary {
  slug: string;
  title: string;
  summary: string | null;
  coverImageUrl: string | null;
  visibility: PageVisibility;
  viewCount: number;
  updatedAt: string;
}

/**
 * Only http(s) URLs are safe to store and render — blocks javascript:/data:/ftp:
 * URIs. Single source of truth, imported by both server (format, API routes) and
 * client (page-reader) since this module has no server-only dependencies.
 */
export function isHttpUrl(url: unknown): boolean {
  return typeof url === 'string' && /^https?:\/\//i.test(url);
}

export function rowToView(row: PageRow, isOwner: boolean): PageView {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    coverImageUrl: row.cover_image_url,
    sections: Array.isArray(row.sections) ? row.sections : [],
    sources: Array.isArray(row.sources) ? row.sources : [],
    visibility: row.visibility,
    viewCount: row.view_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isOwner,
  };
}

export function rowToSummary(row: PageRow): PageSummary {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    coverImageUrl: row.cover_image_url,
    visibility: row.visibility,
    viewCount: row.view_count ?? 0,
    updatedAt: row.updated_at,
  };
}
