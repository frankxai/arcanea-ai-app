/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Pages collection API.
 *
 *   GET  /api/pages          → list the signed-in user's pages
 *   POST /api/pages          → create a Page from a chat thread (AI-formatted)
 *
 * Writes go through the service-role client (RLS-bypassing), so ownership is
 * enforced explicitly against the authenticated Supabase user.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { pagesServiceClient, PAGES_TABLE } from '@/lib/pages/db';
import {
  formatThreadToPage,
  slugify,
  hasPageModel,
  type ThreadMessage,
} from '@/lib/pages/format';
import { rowToSummary, type PageRow } from '@/lib/pages/types';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

export const runtime = 'nodejs';
export const maxDuration = 60;

const CREATE_RATE_LIMIT = { maxRequests: 8, windowMs: 60_000 };

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = pagesServiceClient();
  const { data, error } = await db
    .from(PAGES_TABLE)
    .select('*')
    .eq('owner_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('[pages] list failed:', error.message);
    return NextResponse.json({ error: 'Failed to load pages' }, { status: 500 });
  }
  return NextResponse.json({ pages: (data as PageRow[]).map(rowToSummary) });
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(getClientIdentifier(req), CREATE_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)) } },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to publish a Page.' }, { status: 401 });

  if (!hasPageModel()) {
    return NextResponse.json(
      {
        error: 'Page generation is not connected on this deployment.',
        cta: 'byok',
        hint: 'Add a Google, Anthropic, or OpenAI key to enable Pages.',
      },
      { status: 503 },
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const messages: ThreadMessage[] = Array.isArray(body?.messages)
    ? body.messages
        .filter((m: any) => m && typeof m.content === 'string' && m.content.trim())
        .map((m: any) => ({ role: String(m.role || 'user'), content: m.content }))
    : [];

  if (messages.length === 0) {
    return NextResponse.json({ error: 'No conversation to publish.' }, { status: 400 });
  }

  const formatted = await formatThreadToPage(
    messages,
    typeof body?.title === 'string' ? body.title : undefined,
  );
  if (!formatted) {
    return NextResponse.json(
      { error: 'Could not generate a Page from this conversation.' },
      { status: 502 },
    );
  }

  const slug = slugify(formatted.title);
  const db = pagesServiceClient();
  const { error } = await db.from(PAGES_TABLE).insert({
    slug,
    owner_id: user.id,
    title: formatted.title,
    summary: formatted.summary,
    sections: formatted.sections,
    sources: formatted.sources,
    source_session_id: typeof body?.sessionId === 'string' ? body.sessionId : null,
    visibility: 'unlisted',
  });

  if (error) {
    console.error('[pages] insert failed:', error.message);
    return NextResponse.json({ error: 'Failed to save Page' }, { status: 500 });
  }

  return NextResponse.json({ slug, title: formatted.title }, { status: 201 });
}
