/**
 * POST /api/studio/drive/ingest
 *
 * Pull a Google Drive file into the user's Studio vault. Wraps the same
 * classify → embed → insert pipeline as /api/studio/ingest but sourced
 * from Drive instead of paste/URL.
 *
 * Body:
 *   { fileId: string, mimeType: string, worldId?: string, tags?: string[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  fetchDriveDocAsText,
  getDriveAccessToken,
} from '@/lib/studio/drive';
import {
  classifyContent,
  estimateTokens,
  wordCount,
  type Classification,
} from '@/lib/studio/classify';
import { embedStudioDocument, toPgVector } from '@/lib/studio/embed';

export const runtime = 'nodejs';
export const maxDuration = 45;

interface DriveIngestBody {
  fileId: string;
  mimeType: string;
  worldId?: string | null;
  tags?: string[];
}

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  let body: DriveIngestBody;
  try {
    body = (await request.json()) as DriveIngestBody;
  } catch {
    return err('Invalid JSON body', 400);
  }
  if (!body.fileId || !body.mimeType) {
    return err('fileId and mimeType required', 400);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Sign in required', 401);

  const token = await getDriveAccessToken(supabase);
  if (!token) {
    return NextResponse.json(
      {
        error: 'Google Drive not connected. Sign in with Google and grant drive.readonly.',
        connect: '/api/studio/drive/connect',
      },
      { status: 412 },
    );
  }

  // Fetch from Drive
  let title: string;
  let markdown: string;
  try {
    const fetched = await fetchDriveDocAsText(token, body.fileId, body.mimeType);
    title = fetched.title;
    markdown = fetched.content;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    if (msg.includes('401')) {
      return NextResponse.json(
        { error: 'Google token expired. Reconnect.', connect: '/api/studio/drive/connect' },
        { status: 412 },
      );
    }
    return err(`Drive fetch failed: ${msg}`, 502);
  }

  if (!markdown || markdown.trim().length < 4) {
    return err('Drive file is empty or unreadable', 422);
  }

  // Classify
  let classification: Classification = 'reference';
  let confidence = 0.3;
  let tags = body.tags ?? [];
  let summary = markdown.slice(0, 400);
  try {
    const classified = await classifyContent(markdown);
    classification = classified.classification;
    confidence = classified.confidence;
    tags = [...new Set([...tags, ...classified.suggested_tags])].slice(0, 10);
    summary = classified.summary;
    if (!title.trim() || title === body.fileId) {
      title = classified.suggested_title || title;
    }
  } catch (e) {
    console.warn('[drive/ingest] classification failed:', e);
  }

  // Embed
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
      console.warn('[drive/ingest] embed failed:', e);
    }
  }

  // Insert
  const { data, error } = await supabase
    .from('ingested_documents')
    .insert({
      user_id: user.id,
      world_id: body.worldId ?? null,
      title,
      markdown_content: markdown,
      jsonml_content: { summary, sourceType: 'drive' },
      classification,
      classification_confidence: confidence,
      source_type: 'drive',
      source_uri: `https://docs.google.com/document/d/${body.fileId}`,
      source_metadata: { fileId: body.fileId, mimeType: body.mimeType },
      embedding: embedding ? toPgVector(embedding) : null,
      word_count: wordCount(markdown),
      token_estimate: estimateTokens(markdown),
      tags,
    })
    .select('id, title, classification, classification_confidence, tags, created_at')
    .single();

  if (error) {
    console.error('[drive/ingest] insert error:', error);
    if (error.code === '42P01') {
      return err('ingested_documents not migrated. Run: supabase db push', 503);
    }
    return err(error.message, 500);
  }

  return NextResponse.json({
    id: data.id,
    title: data.title,
    classification: data.classification,
    confidence: data.classification_confidence,
    tags: data.tags,
    summary,
    source_uri: `https://docs.google.com/document/d/${body.fileId}`,
    embedded: embedding !== null,
  });
}
