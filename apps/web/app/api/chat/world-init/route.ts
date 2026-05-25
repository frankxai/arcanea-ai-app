/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * World Character Chat Initialization API
 *
 * POST { characterId, worldSlug }
 * Returns { systemPrompt, characterName, worldName, characterPortrait }
 *
 * Called by the chat page when ?character=&world= query params are present.
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildCharacterSystemPrompt } from '@/lib/worlds/character-prompt';

export const runtime = 'edge';

interface WorldInitRequest {
  characterId: string;
  worldSlug: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: WorldInitRequest = await req.json();
    const { characterId, worldSlug } = body;

    if (!characterId || !worldSlug) {
      return NextResponse.json(
        { error: 'characterId and worldSlug are required' },
        { status: 400 },
      );
    }

    const result = await buildCharacterSystemPrompt(characterId, worldSlug);

    return NextResponse.json(result);
  } catch (error) {
    console.error('World init error:', error);
    const message = error instanceof Error ? error.message : 'Failed to initialize character';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
