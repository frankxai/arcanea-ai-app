/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * POST /api/studio/ingest
 *
 * Universal Studio ingestion endpoint. Accepts:
 *   - text: raw markdown/plain text
 *   - url: a URL to fetch + extract (HTML → markdown)
 *   - file: multipart upload (stored in Supabase Storage)
 *
 * Pipeline:
 *   1. Normalize → markdown
 *   2. Classify via cheap LLM (character / location / magic / scene / ...)
 *   3. Embed with text-embedding-3-small
 *   4. Insert into ingested_documents with RLS enforced by user session
 *
 * Returns: { id, classification, confidence, title, tags, summary }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  classifyContent,
  estimateTokens,
  wordCount,
  type Classification,
} from '@/lib/studio/classify';
import {
  embedStudioDocument,
  toPgVector,
} from '@/lib/studio/embed';
import { linkToWorldGraph } from '@/lib/studio/world-link';

export const runtime = 'nodejs';
export const maxDuration = 30;

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

interface IngestTextBody {
  kind: 'text';
  content: string;
  title?: string;
  worldId?: string | null;
  tags?: string[];
  sourceUri?: string;
}

interface IngestUrlBody {
  kind: 'url';
  url: string;
  worldId?: string | null;
  tags?: string[];
}

type IngestBody = IngestTextBody | IngestUrlBody;

// ---------------------------------------------------------------------------
// URL → text extraction (minimal, no external deps)
// ---------------------------------------------------------------------------

// A signed-in user chooses this URL, so the server must not become a proxy
// into loopback, private, or link-local networks (SSRF). Literal IPs and
// internal hostnames are rejected; each redirect hop is re-checked.
// DNS names that resolve to private IPs are not caught here.
const MAX_REDIRECTS = 3;

function isPrivateHost(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')
    || host.endsWith('.internal') || !host.includes('.') && !host.includes(':')) {
    return true;
  }
  const v4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 168) || a >= 224;
  }
  if (host.includes(':')) {
    // IPv6 literal: loopback, unspecified, unique-local, link-local, v4-mapped.
    return host === '::1' || host === '::' || /^f[cd]/.test(host) || /^fe[89ab]/.test(host)
      || host.startsWith('::ffff:');
  }
  return false;
}

function assertPublicUrl(raw: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error('Invalid URL');
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('Only http(s) URLs can be ingested');
  }
  if (parsed.username || parsed.password || isPrivateHost(parsed.hostname)) {
    throw new Error('URL host is not allowed');
  }
  return parsed;
}

async function fetchAsText(url: string): Promise<{ title: string; content: string }> {
  let target = assertPublicUrl(url);
  let resp: Response | undefined;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    resp = await fetch(target, {
      headers: {
        // Identify ourselves so sites don't 403 a headless fetch
        'User-Agent': 'ArcaneaStudioIngestor/1.0 (+https://arcanea.ai)',
        Accept: 'text/html,application/xhtml+xml,text/plain',
      },
      redirect: 'manual',
    });
    const location = resp.status >= 300 && resp.status < 400 ? resp.headers.get('location') : null;
    if (!location) break;
    if (hop === MAX_REDIRECTS) throw new Error('Too many redirects');
    target = assertPublicUrl(new URL(location, target).toString());
  }
  if (!resp) throw new Error('No response');

  if (!resp.ok) {
    throw new Error(`Fetch ${url} failed: ${resp.status}`);
  }

  const contentType = resp.headers.get('content-type') ?? '';

  if (contentType.includes('text/plain') || contentType.includes('markdown')) {
    const text = await resp.text();
    return {
      title: url,
      content: text,
    };
  }

  if (contentType.includes('text/html')) {
    const html = await resp.text();
    // Extract <title> if present
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch?.[1]?.trim() ?? url;

    // Strip scripts, styles, navs — then convert to plain text.
    // Minimal approach: no Turndown dependency, keep bundle lean.
    const stripped = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      // Convert headings to markdown
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return { title, content: stripped };
  }

  // Unknown content type — try text
  const text = await resp.text();
  return { title: url, content: text };
}

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  let body: IngestBody;
  try {
    body = (await request.json()) as IngestBody;
  } catch {
    return err('Invalid JSON body', 400);
  }

  // ── Auth ────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return err('Sign in required to ingest content', 401);
  }

  // ── Normalize input → (title, markdown, sourceType, sourceUri) ──
  let title: string;
  let markdown: string;
  let sourceType: 'paste' | 'url';
  let sourceUri: string | undefined;
  let worldId: string | null = null;
  const extraTags: string[] = [];

  if (body.kind === 'text') {
    if (!body.content || body.content.trim().length < 4) {
      return err('content must be at least 4 characters', 400);
    }
    if (body.content.length > 250_000) {
      return err('content exceeds 250K character limit', 413);
    }
    title = body.title?.trim() || 'Untitled';
    markdown = body.content;
    sourceType = 'paste';
    sourceUri = body.sourceUri;
    worldId = body.worldId ?? null;
    if (body.tags) extraTags.push(...body.tags);
  } else if (body.kind === 'url') {
    try {
      assertPublicUrl(body.url);
    } catch (e) {
      return err(e instanceof Error ? e.message : 'Invalid URL', 400);
    }
    try {
      const fetched = await fetchAsText(body.url);
      title = fetched.title;
      markdown = fetched.content;
      sourceType = 'url';
      sourceUri = body.url;
      worldId = body.worldId ?? null;
      if (body.tags) extraTags.push(...body.tags);
    } catch (e) {
      return err(`Failed to fetch URL: ${e instanceof Error ? e.message : 'unknown'}`, 502);
    }
  } else {
    return err('Unknown ingestion kind', 400);
  }

  if (markdown.trim().length < 4) {
    return err('Extracted content is empty', 422);
  }

  // ── Classify ────────────────────────────────────────────
  let classification: Classification;
  let confidence: number;
  let tags: string[];
  let summary: string;

  try {
    const classified = await classifyContent(markdown);
    classification = classified.classification;
    confidence = classified.confidence;
    tags = [...new Set([...extraTags, ...classified.suggested_tags])].slice(0, 10);
    summary = classified.summary;
    // Prefer LLM-suggested title only if user didn't provide one
    if (title === 'Untitled' && classified.suggested_title) {
      title = classified.suggested_title;
    }
  } catch (e) {
    console.warn('[studio/ingest] classification failed:', e);
    classification = 'reference';
    confidence = 0.2;
    tags = extraTags;
    summary = markdown.slice(0, 400);
  }

  // ── Embed (best-effort — row is still useful without embedding) ──
  let embedding: number[] | null = null;
  if (process.env.OPENAI_API_KEY) {
    try {
      embedding = await embedStudioDocument({
        title,
        classification,
        tags,
        markdownContent: markdown,
      });
    } catch (e) {
      console.warn('[studio/ingest] embedding failed, storing without vector:', e);
    }
  }

  // ── Insert ──────────────────────────────────────────────
  const row = {
    user_id: user.id,
    world_id: worldId,
    title,
    markdown_content: markdown,
    jsonml_content: { summary, sourceType },
    classification,
    classification_confidence: confidence,
    source_type: sourceType,
    source_uri: sourceUri ?? null,
    source_metadata: {},
    embedding: embedding ? toPgVector(embedding) : null,
    word_count: wordCount(markdown),
    token_estimate: estimateTokens(markdown),
    tags,
  };

  const { data, error } = await supabase
    .from('ingested_documents')
    .insert(row)
    .select('id, title, classification, classification_confidence, tags, created_at')
    .single();

  if (error) {
    console.error('[studio/ingest] insert error:', error);
    // Table may not exist yet — surface clearly
    if (error.code === '42P01') {
      return err(
        'ingested_documents table not yet migrated. Run: supabase db push',
        503,
      );
    }
    return err(`Database error: ${error.message}`, 500);
  }

  // Best-effort world graph linking — don't fail the ingest if it fails
  let worldLink: Awaited<ReturnType<typeof linkToWorldGraph>> | null = null;
  if (worldId && ['character', 'location', 'magic'].includes(classification)) {
    try {
      worldLink = await linkToWorldGraph(supabase, {
        worldId,
        userId: user.id,
        classification,
        title,
        markdownContent: markdown,
        tags,
        documentId: data.id,
      });
    } catch (e) {
      console.warn('[studio/ingest] world link failed:', e);
    }
  }

  return ok({
    id: data.id,
    title: data.title,
    classification: data.classification,
    confidence: data.classification_confidence,
    tags: data.tags,
    summary,
    created_at: data.created_at,
    embedded: embedding !== null,
    world_link: worldLink,
  });
}

// ---------------------------------------------------------------------------
// GET /api/studio/ingest — health check
// ---------------------------------------------------------------------------

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    methods: ['POST'],
    accepts: ['text', 'url'],
    requires_auth: true,
    requires_env: ['ANTHROPIC_API_KEY (classifier, falls back to heuristic)', 'OPENAI_API_KEY (embeddings, optional)'],
    migration: '20260417_studio_ingestion.sql',
  });
}
