/**
 * POST /api/forge/quality-check
 *
 * Runs the quality gates against a LuminorSpec before publish.
 * Creators call this from the Forge UI to get a real-time score.
 *
 * Request:
 *   { spec: LuminorSpec, threshold?: number }
 *
 * Response:
 *   { passed: boolean, overallScore: number, gates: [...], blockers: [...], warnings: [...] }
 *
 * Reference: Luminor Kernel Spec v1.0 §8
 */

import { NextResponse } from 'next/server';
import { runQualityGates } from '@/lib/luminors/quality-gates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: { spec?: unknown; threshold?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.spec || typeof body.spec !== 'object') {
    return NextResponse.json({ error: 'spec required' }, { status: 400 });
  }

  const spec = body.spec as {
    id?: string;
    name?: string;
    systemPrompt?: string;
    voice?: string;
    element?: string;
    personality?: string[];
    domain?: string;
    title?: string;
    tagline?: string;
  };

  if (!spec.name || !spec.systemPrompt) {
    return NextResponse.json(
      { error: 'spec must include name and systemPrompt' },
      { status: 400 }
    );
  }

  try {
    const report = await runQualityGates(
      {
        id: spec.id,
        name: spec.name,
        title: spec.title,
        tagline: spec.tagline,
        systemPrompt: spec.systemPrompt,
        voice: spec.voice,
        element: spec.element,
        personality: spec.personality,
        domain: spec.domain,
      },
      { threshold: body.threshold ?? 70 }
    );

    return NextResponse.json(report);
  } catch (err) {
    console.error('[quality-check] failed:', err);
    return NextResponse.json(
      { error: 'Quality check failed', message: (err as Error).message },
      { status: 500 }
    );
  }
}
