/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * GET /api/studio/export
 *
 * "Keep your IP" — the sovereignty proof.
 *
 * Exports the current user's entire Studio vault as a JSON bundle:
 *   {
 *     version: 1,
 *     exported_at: ISO timestamp,
 *     user_id: uuid,
 *     count: number,
 *     documents: [
 *       {
 *         id,
 *         title,
 *         classification,
 *         source_type,
 *         source_uri,
 *         tags,
 *         word_count,
 *         created_at,
 *         updated_at,
 *         markdown_content   // <- the real body, portable to Obsidian/Notion
 *       }
 *     ]
 *   }
 *
 * The response Content-Disposition header sets a suggested filename so
 * browsers offer a download prompt. Everything needed to reconstruct the
 * vault elsewhere is in this single file. No vendor lock-in.
 *
 * Query params:
 *   classification — filter to one type (optional)
 *   world_id       — filter to one world (optional)
 *   format         — 'json' (default) or 'ndjson' (streamable line-delimited)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface ExportDoc {
  id: string;
  title: string;
  classification: string;
  classification_confidence: number;
  source_type: string;
  source_uri: string | null;
  world_id: string | null;
  tags: string[];
  word_count: number;
  created_at: string;
  updated_at: string;
  markdown_content: string;
}

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Sign in required to export your vault', 401);

  const { searchParams } = request.nextUrl;
  const classification = searchParams.get('classification');
  const worldId = searchParams.get('world_id');
  const format = searchParams.get('format') === 'ndjson' ? 'ndjson' : 'json';

  let query = supabase
    .from('ingested_documents')
    .select(
      'id, title, classification, classification_confidence, source_type, source_uri, world_id, tags, word_count, created_at, updated_at, markdown_content',
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    // Cap at 10K docs per export to avoid OOM; split across calls if larger
    .limit(10000);

  if (classification) query = query.eq('classification', classification);
  if (worldId) query = query.eq('world_id', worldId);

  const { data, error } = await query;
  if (error) {
    if (error.code === '42P01') {
      return err('Vault not migrated yet. Run: supabase db push', 503);
    }
    return err(error.message, 500);
  }

  const documents = (data as ExportDoc[] | null) ?? [];
  const now = new Date().toISOString();
  const filenameBase = `arcanea-vault-${now.slice(0, 10)}`;

  if (format === 'ndjson') {
    // Line-delimited JSON — one document per line, streamable, diff-friendly
    const lines = [
      JSON.stringify({
        __meta: true,
        version: 1,
        exported_at: now,
        user_id: user.id,
        count: documents.length,
        format: 'ndjson',
      }),
      ...documents.map((d) => JSON.stringify(d)),
    ];
    return new NextResponse(lines.join('\n') + '\n', {
      status: 200,
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filenameBase}.ndjson"`,
        'Cache-Control': 'no-store',
        'X-Arcanea-Export-Count': String(documents.length),
      },
    });
  }

  const body = {
    version: 1,
    exported_at: now,
    user_id: user.id,
    count: documents.length,
    source: 'arcanea.ai/api/studio/export',
    license: 'User-owned content. No rights retained by Arcanea. MIT-compatible bundle structure.',
    documents,
  };

  return new NextResponse(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filenameBase}.json"`,
      'Cache-Control': 'no-store',
      'X-Arcanea-Export-Count': String(documents.length),
    },
  });
}
