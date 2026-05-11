/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * GET    /api/studio/documents/[id]   — fetch one doc (includes full markdown)
 * PATCH  /api/studio/documents/[id]   — update title/content/tags/classification
 * DELETE /api/studio/documents/[id]   — remove (same as /documents?id=)
 *
 * PATCH re-embeds the document if content, title, or classification changed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { embedStudioDocument, toPgVector } from '@/lib/studio/embed';
import { wordCount, estimateTokens } from '@/lib/studio/classify';

export const runtime = 'nodejs';
export const maxDuration = 30;

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

const VALID_CLASSIFICATIONS = new Set([
  'character',
  'location',
  'magic',
  'scene',
  'lore',
  'reference',
  'chapter',
  'note',
]);

interface PatchBody {
  title?: string;
  markdown_content?: string;
  classification?: string;
  tags?: string[];
  world_id?: string | null;
}

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  // Database type is out of sync with studio tables (ingested_documents) —
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Sign in required', 401);

  const { data, error } = await supabase
    .from('ingested_documents')
    .select(
      'id, title, markdown_content, jsonml_content, classification, classification_confidence, source_type, source_uri, world_id, tags, word_count, token_estimate, created_at, updated_at',
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return err(error.message, 500);
  if (!data) return err('Not found', 404);

  return NextResponse.json({ document: data });
}

// ---------------------------------------------------------------------------
// PATCH
// ---------------------------------------------------------------------------
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return err('Invalid JSON body', 400);
  }

  // Database type is out of sync with studio tables (ingested_documents) —
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Sign in required', 401);

  // Fetch current row to decide if re-embed is needed
  const { data: current, error: fetchError } = await supabase
    .from('ingested_documents')
    .select(
      'id, title, markdown_content, classification, tags, user_id',
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (fetchError) return err(fetchError.message, 500);
  if (!current) return err('Not found', 404);

  // Build update patch
  const patch: Record<string, unknown> = {};
  let contentChanged = false;
  let titleChanged = false;
  let classificationChanged = false;

  if (body.title !== undefined) {
    const t = body.title.trim();
    if (t.length < 2 || t.length > 180) {
      return err('title must be 2-180 characters', 400);
    }
    if (t !== current.title) {
      patch.title = t;
      titleChanged = true;
    }
  }

  if (body.markdown_content !== undefined) {
    if (typeof body.markdown_content !== 'string') {
      return err('markdown_content must be a string', 400);
    }
    if (body.markdown_content.length > 250_000) {
      return err('markdown_content exceeds 250K character limit', 413);
    }
    if (body.markdown_content !== current.markdown_content) {
      patch.markdown_content = body.markdown_content;
      patch.word_count = wordCount(body.markdown_content);
      patch.token_estimate = estimateTokens(body.markdown_content);
      contentChanged = true;
    }
  }

  if (body.classification !== undefined) {
    if (!VALID_CLASSIFICATIONS.has(body.classification)) {
      return err(`Invalid classification: ${body.classification}`, 400);
    }
    if (body.classification !== current.classification) {
      patch.classification = body.classification;
      patch.classification_confidence = 0.9; // user-chosen
      classificationChanged = true;
    }
  }

  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags)) return err('tags must be an array', 400);
    if (body.tags.length > 10) return err('max 10 tags', 400);
    patch.tags = body.tags.slice(0, 10).map((t) => String(t).slice(0, 32));
  }

  if (body.world_id !== undefined) {
    patch.world_id = body.world_id;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: true, unchanged: true });
  }

  // Re-embed if title/content/classification changed
  if (
    (contentChanged || titleChanged || classificationChanged) &&
    process.env.OPENAI_API_KEY
  ) {
    try {
      const embedding = await embedStudioDocument({
        title: (patch.title ?? current.title) as string,
        classification: (patch.classification ?? current.classification) as string,
        tags: ((patch.tags ?? current.tags) as string[]) ?? [],
        markdownContent: (patch.markdown_content ?? current.markdown_content) as string,
      });
      patch.embedding = toPgVector(embedding);
    } catch (e) {
      console.warn('[documents/[id]/PATCH] re-embed failed:', e);
      // Don't fail the update — stored row just keeps old embedding
    }
  }

  const { data, error: updateError } = await supabase
    .from('ingested_documents')
    .update(patch)
    .eq('id', id)
    .eq('user_id', user.id)
    .select(
      'id, title, classification, classification_confidence, tags, word_count, updated_at',
    )
    .single();

  if (updateError) return err(updateError.message, 500);

  return NextResponse.json({
    ok: true,
    document: data,
    reembedded: 'embedding' in patch,
  });
}

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  // Database type is out of sync with studio tables (ingested_documents) —
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Sign in required', 401);

  const { error } = await supabase
    .from('ingested_documents')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return err(error.message, 500);
  return NextResponse.json({ ok: true });
}
