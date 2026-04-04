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
