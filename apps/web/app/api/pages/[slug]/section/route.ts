/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AI section revise — POST /api/pages/:slug/section
 *
 * Body: { sectionId: string, instruction: string }
 * Owner-only. Rewrites a single section's markdown per the instruction
 * (Perplexity "highlight + describe the change"), persists, and returns the new
 * markdown.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { pagesServiceClient, PAGES_TABLE } from '@/lib/pages/db';
import { reviseSectionMarkdown, hasPageModel } from '@/lib/pages/format';
import type { PageRow, PageSection } from '@/lib/pages/types';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

export const runtime = 'nodejs';
export const maxDuration = 45;

const REVISE_RATE_LIMIT = { maxRequests: 15, windowMs: 60_000 };

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const rl = checkRateLimit(getClientIdentifier(req), REVISE_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)) } },
    );
  }

  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!hasPageModel()) {
    return NextResponse.json(
      { error: 'AI editing is not connected on this deployment.', cta: 'byok' },
      { status: 503 },
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const sectionId = typeof body?.sectionId === 'string' ? body.sectionId : '';
  const instruction = typeof body?.instruction === 'string' ? body.instruction.trim() : '';
  if (!sectionId || !instruction) {
    return NextResponse.json({ error: 'sectionId and instruction are required' }, { status: 400 });
  }

  const db = pagesServiceClient();
  const { data, error } = await db
    .from(PAGES_TABLE)
    .select('owner_id, sections')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if ((data as any).owner_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const sections: PageSection[] = Array.isArray((data as PageRow).sections)
    ? (data as PageRow).sections
    : [];
  const target = sections.find((s) => s.id === sectionId);
  if (!target) return NextResponse.json({ error: 'Section not found' }, { status: 404 });

  const revised = await reviseSectionMarkdown(target.heading, target.markdown, instruction);
  if (!revised) {
    return NextResponse.json({ error: 'Could not revise the section.' }, { status: 502 });
  }

  const nextSections = sections.map((s) =>
    s.id === sectionId ? { ...s, markdown: revised } : s,
  );
  const { error: upErr } = await db
    .from(PAGES_TABLE)
    .update({ sections: nextSections })
    .eq('slug', slug);
  if (upErr) {
    console.error('[pages] section update failed:', upErr.message);
    return NextResponse.json({ error: 'Failed to save revision' }, { status: 500 });
  }

  return NextResponse.json({ markdown: revised });
}
