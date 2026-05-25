/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
