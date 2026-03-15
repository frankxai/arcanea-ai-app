/**
 * APL Analyze API — /api/apl/analyze
 *
 * Accepts a prompt, returns slop analysis, palette detection,
 * quality level, and improvement suggestions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { enhance } from '@/lib/apl';

export async function POST(req: NextRequest) {
  try {
    const { prompt, palette, secondaryPalette } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (prompt.length > 5000) {
      return NextResponse.json({ error: 'Prompt too long (max 5000 chars)' }, { status: 400 });
    }

    const result = enhance(prompt, { palette, secondaryPalette });

    return NextResponse.json({
      ...result,
      qualityPercent:
        result.qualityLevel === 'generic' ? 20 :
        result.qualityLevel === 'clear' ? 50 :
        result.qualityLevel === 'vivid' ? 80 :
        95,
    });
  } catch (error) {
    console.error('APL Analyze error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
