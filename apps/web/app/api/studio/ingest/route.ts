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

async function fetchAsText(url: string): Promise<{ title: string; content: string }> {
  const resp = await fetch(url, {
    headers: {
      // Identify ourselves so sites don't 403 a headless fetch
      'User-Agent': 'ArcaneaStudioIngestor/1.0 (+https://arcanea.ai)',
      Accept: 'text/html,application/xhtml+xml,text/plain',
    },
    redirect: 'follow',
  });

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
      new URL(body.url);
    } catch {
      return err('Invalid URL', 400);
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
