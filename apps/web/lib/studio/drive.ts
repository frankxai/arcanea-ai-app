/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Google Drive Connector
 *
 * Approach: **Supabase Auth Google provider with drive.readonly scope**.
 *
 * Why this over raw OAuth or third-party integration platforms (Nango/Merge):
 *   - Users already sign in with Supabase — zero new auth surface
 *   - Supabase returns provider_token for the current session
 *   - drive.readonly is a single scope addition, no client-secret handling
 *   - No tokens hit our DB unless we explicitly persist them for background sync
 *
 * Flow:
 *   1. Client calls supabase.auth.signInWithOAuth({
 *        provider: 'google',
 *        options: { scopes: 'https://www.googleapis.com/auth/drive.readonly' }
 *      })
 *   2. Google redirects back with provider_token set on the session
 *   3. Our server-side routes call fetchWithDriveToken(request, url) to hit
 *      Drive API v3 on the user's behalf
 *   4. For background/refresh, we store encrypted tokens in user_oauth_tokens
 *      (added in 20260417 migration) — not implemented until the basic flow works
 *
 * Scopes:
 *   - drive.readonly — full read-only access
 *   - drive.file — only files the app created/opened (more restrictive, ideal
 *     later but drive.readonly is simpler for ingestion MVP)
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';
export const GOOGLE_DRIVE_BASE = 'https://www.googleapis.com/drive/v3';
export const GOOGLE_DOCS_EXPORT_BASE = 'https://docs.googleapis.com/v1/documents';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
  size?: string;
}

export interface DriveListResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

/**
 * List files in the user's Drive. Defaults to Google Docs only, ordered by
 * most recently modified.
 */
export async function listDriveFiles(
  accessToken: string,
  opts: {
    pageToken?: string;
    pageSize?: number;
    query?: string;
    mimeTypes?: string[];
  } = {},
): Promise<DriveListResponse> {
  const pageSize = Math.min(opts.pageSize ?? 25, 100);
  const mimeFilter = (opts.mimeTypes ?? ['application/vnd.google-apps.document'])
    .map((m) => `mimeType = '${m}'`)
    .join(' or ');

  const qParts = [`(${mimeFilter})`, `trashed = false`];
  if (opts.query) {
    qParts.push(`name contains '${opts.query.replace(/'/g, "\\'")}'`);
  }

  const params = new URLSearchParams({
    pageSize: String(pageSize),
    orderBy: 'modifiedTime desc',
    fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, webViewLink, iconLink, size)',
    q: qParts.join(' and '),
  });
  if (opts.pageToken) params.set('pageToken', opts.pageToken);

  const res = await fetch(`${GOOGLE_DRIVE_BASE}/files?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Drive list failed: ${res.status} ${body.slice(0, 200)}`);
  }

  return (await res.json()) as DriveListResponse;
}

/**
 * Export a Google Doc as markdown-flavored text.
 * Drive API supports export as text/plain; we request that and leave
 * formatting clean for the Studio classifier.
 *
 * For non-Google-Doc files (PDF, Word, etc.) we'd download the binary
 * and extract — not implemented yet; ingest API returns 422 in that case.
 */
export async function fetchDriveDocAsText(
  accessToken: string,
  fileId: string,
  mimeType: string,
): Promise<{ title: string; content: string }> {
  if (mimeType === 'application/vnd.google-apps.document') {
    // Google Docs native — use export endpoint, prefer markdown if available
    const exportMime = 'text/plain';
    const exportUrl = `${GOOGLE_DRIVE_BASE}/files/${fileId}/export?mimeType=${encodeURIComponent(exportMime)}`;
    const metaUrl = `${GOOGLE_DRIVE_BASE}/files/${fileId}?fields=id,name,mimeType`;

    const [metaRes, textRes] = await Promise.all([
      fetch(metaUrl, { headers: { Authorization: `Bearer ${accessToken}` } }),
      fetch(exportUrl, { headers: { Authorization: `Bearer ${accessToken}` } }),
    ]);

    if (!metaRes.ok) {
      throw new Error(`Drive meta failed: ${metaRes.status}`);
    }
    if (!textRes.ok) {
      throw new Error(`Drive export failed: ${textRes.status}`);
    }

    const meta = (await metaRes.json()) as DriveFile;
    const text = await textRes.text();
    return { title: meta.name, content: text };
  }

  if (
    mimeType === 'text/plain' ||
    mimeType === 'text/markdown' ||
    mimeType === 'text/x-markdown'
  ) {
    const metaUrl = `${GOOGLE_DRIVE_BASE}/files/${fileId}?fields=id,name,mimeType`;
    const contentUrl = `${GOOGLE_DRIVE_BASE}/files/${fileId}?alt=media`;

    const [metaRes, textRes] = await Promise.all([
      fetch(metaUrl, { headers: { Authorization: `Bearer ${accessToken}` } }),
      fetch(contentUrl, { headers: { Authorization: `Bearer ${accessToken}` } }),
    ]);
    if (!metaRes.ok) throw new Error(`meta: ${metaRes.status}`);
    if (!textRes.ok) throw new Error(`content: ${textRes.status}`);

    const meta = (await metaRes.json()) as DriveFile;
    const text = await textRes.text();
    return { title: meta.name, content: text };
  }

  throw new Error(`Unsupported mimeType for text extraction: ${mimeType}`);
}

/**
 * Pull provider_token from the current Supabase session.
 *
 * Supabase stores the Google OAuth access token on the session after the user
 * signs in with signInWithOAuth({ provider: 'google', scopes: DRIVE }).
 *
 * Server-side, we read the session — provider_token is on session.provider_token.
 *
 * NOTE: If the user's original sign-in did NOT request drive.readonly, they'll
 * need to sign in again with the expanded scope. /api/studio/drive/connect
 * returns a 412 in that case with instructions.
 */
export async function getDriveAccessToken(
  supabase: SupabaseClient,
): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  // Supabase exposes provider_token only during the live session after OAuth
  const token = (data.session as { provider_token?: string } | null)?.provider_token;
  return token ?? null;
}
