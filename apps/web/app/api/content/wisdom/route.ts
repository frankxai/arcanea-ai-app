/**
 * Library Wisdom Endpoint
 *
 * Returns a curated quote/passage from the Library of Arcanea
 * based on the current conversational situation. Used by the
 * chat API to inject Library context into system prompts.
 *
 * Node.js runtime (not edge) because the content loader uses fs/promises.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTextsForSituation } from '@/lib/content';
import type { Situation } from '@/lib/content/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_SITUATIONS: Situation[] = [
  'beginning', 'stuck', 'darkness', 'comparison', 'failure',
  'celebration', 'confusion', 'lost', 'collaboration', 'fear', 'scattered',
];

/** Map Guardian gates to Library situations */
const GATE_TO_SITUATION: Record<string, Situation> = {
  lyssandria: 'beginning',
  leyla: 'celebration',
  draconia: 'stuck',
  maylinn: 'fear',
  alera: 'confusion',
  lyria: 'lost',
  aiyami: 'collaboration',
  elara: 'scattered',
  ino: 'collaboration',
  shinkami: 'beginning',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const situationParam = searchParams.get('situation');
    const gateParam = searchParams.get('gate');

    // Resolve situation from param or gate mapping
    let situation: Situation = 'beginning';
    if (situationParam && VALID_SITUATIONS.includes(situationParam as Situation)) {
      situation = situationParam as Situation;
    } else if (gateParam && GATE_TO_SITUATION[gateParam]) {
      situation = GATE_TO_SITUATION[gateParam];
    }

    const texts = await getTextsForSituation(situation);

    if (!texts || texts.length === 0) {
      return NextResponse.json({ wisdom: null });
    }

    // Pick a text based on the current hour (stable within the hour, varies across)
    const idx = (new Date().getHours() * 13 + new Date().getDate()) % texts.length;
    const text = texts[idx];

    // Extract a meaningful passage (first 2-3 paragraphs, max ~200 words)
    const paragraphs = text.content
      .split(/\n\n+/)
      .filter((paragraph) => paragraph.trim().length > 20);
    let passage = '';
    let wordCount = 0;
    for (const p of paragraphs) {
      const cleaned = p.replace(/^#+\s+/, '').replace(/\*\*/g, '').trim();
      const words = cleaned.split(/\s+/).length;
      if (wordCount + words > 200) break;
      passage += (passage ? '\n\n' : '') + cleaned;
      wordCount += words;
    }

    if (!passage) {
      return NextResponse.json({ wisdom: null });
    }

    return NextResponse.json({
      wisdom: {
        title: text.frontmatter?.title || text.slug.replace(/-/g, ' '),
        collection: text.frontmatter?.collection,
        passage,
        situation,
      },
    });
  } catch (error) {
    console.error('[wisdom] Failed to load Library content:', error);
    return NextResponse.json({ wisdom: null });
  }
}
