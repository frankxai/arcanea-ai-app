/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * POST /api/studio/ingest/file
 *
 * Multipart file upload endpoint for Studio. Accepts PDF, DOCX, and
 * text-like files, extracts to markdown, then runs the same
 * classify → embed → insert pipeline as /api/studio/ingest.
 *
 * FormData fields:
 *   file         - the binary (required)
 *   worldId      - optional world uuid to attach
 *   title        - optional override title
 *   tags         - optional comma-separated tags
 *   classification - optional manual classification override
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  classifyContent,
  estimateTokens,
  wordCount,
  type Classification,
} from '@/lib/studio/classify';
import { embedStudioDocument, toPgVector } from '@/lib/studio/embed';
import { extractFile } from '@/lib/studio/extract';
import { linkToWorldGraph } from '@/lib/studio/world-link';

export const runtime = 'nodejs';
export const maxDuration = 60;

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

const VALID_CLASSIFICATIONS: Classification[] = [
  'character', 'location', 'magic', 'scene',
  'lore', 'reference', 'chapter', 'note',
];

export async function POST(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Sign in required', 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return err('multipart/form-data required', 400);
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return err('file field is required', 400);
  }
  if (file.size === 0) {
    return err('file is empty', 400);
  }

  const worldId = (form.get('worldId') as string | null) || null;
  const titleOverride = (form.get('title') as string | null)?.trim() || null;
  const tagsInput = (form.get('tags') as string | null) || '';
  const classificationOverride = (form.get('classification') as string | null) || null;

  const extraTags = tagsInput
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10);

  // Extract
  let extracted: Awaited<ReturnType<typeof extractFile>>;
  try {
    extracted = await extractFile({
      name: file.name,
      mimeType: file.type,
      bytes: await file.arrayBuffer(),
    });
  } catch (e) {
    return err(e instanceof Error ? e.message : 'Extraction failed', 422);
  }

  if (!extracted.text || extracted.text.trim().length < 4) {
    return err('Extracted text is empty — file may be image-only or corrupted', 422);
  }

  const markdown = extracted.text;

  // Classify (or honor override)
  let classification: Classification = 'reference';
  let confidence = 0.3;
  let tags: string[] = [...extraTags];
  let summary = markdown.slice(0, 400);
  let title = titleOverride ?? file.name.replace(/\.[a-z0-9]+$/i, '');

  if (
    classificationOverride &&
    VALID_CLASSIFICATIONS.includes(classificationOverride as Classification)
  ) {
    classification = classificationOverride as Classification;
    confidence = 0.95; // user-specified
  } else {
    try {
      const classified = await classifyContent(markdown);
      classification = classified.classification;
      confidence = classified.confidence;
      tags = [...new Set([...tags, ...classified.suggested_tags])].slice(0, 10);
      summary = classified.summary;
      if (!titleOverride && classified.suggested_title) {
        title = classified.suggested_title;
      }
    } catch (e) {
      console.warn('[studio/ingest/file] classification failed:', e);
    }
  }

  // Embed (best-effort)
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
      console.warn('[studio/ingest/file] embed failed:', e);
    }
  }

  // Insert
  const { data, error } = await supabase
    .from('ingested_documents')
    .insert({
      user_id: user.id,
      world_id: worldId,
      title,
      markdown_content: markdown,
      jsonml_content: {
        summary,
        sourceType: 'file',
        extractedPageCount: extracted.pageCount,
        extractionWarning: extracted.warning,
      },
      classification,
      classification_confidence: confidence,
      source_type: 'file',
      source_uri: null,
      source_metadata: {
        originalFilename: file.name,
        originalMimeType: file.type,
        originalSize: file.size,
      },
      embedding: embedding ? toPgVector(embedding) : null,
      word_count: wordCount(markdown),
      token_estimate: estimateTokens(markdown),
      tags,
    })
    .select('id, title, classification, classification_confidence, tags, created_at')
    .single();

  if (error) {
    if (error.code === '42P01') {
      return err('Not migrated yet. Run: supabase db push', 503);
    }
    return err(error.message, 500);
  }

  // World graph link (best-effort)
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
      console.warn('[studio/ingest/file] world link failed:', e);
    }
  }

  return NextResponse.json({
    id: data.id,
    title: data.title,
    classification: data.classification,
    confidence: data.classification_confidence,
    tags: data.tags,
    summary,
    created_at: data.created_at,
    embedded: embedding !== null,
    source: 'file',
    original_mime_type: file.type,
    extracted_page_count: extracted.pageCount,
    extraction_warning: extracted.warning,
    world_link: worldLink,
  });
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    methods: ['POST'],
    accepts: ['multipart/form-data'],
    fields: {
      file: 'binary — PDF, DOCX, text, or markdown',
      worldId: 'optional uuid',
      title: 'optional override',
      tags: 'optional comma-separated',
      classification: 'optional manual override',
    },
    extractors: ['unpdf (PDF)', 'mammoth (DOCX)', 'passthrough (text/md)'],
    max_file_size: '15 MB',
  });
}
