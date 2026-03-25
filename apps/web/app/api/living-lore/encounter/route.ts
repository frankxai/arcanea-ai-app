/**
 * Living Lore Encounter API
 *
 * Multi-character AI conversation for interactive encounters.
 * Builds a composite system prompt from present crew members,
 * adds scene context, and streams responses with character attribution.
 */

import { NextRequest } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { CREW_SYSTEM_PROMPTS } from '@/lib/living-lore/crew-prompts';
import { CREW } from '@/lib/living-lore/crew-data';

export const runtime = 'edge';

function buildEncounterPrompt(presentCrew: string[], sceneContext: string): string {
  const characterBlocks = presentCrew
    .map((id) => {
      const member = CREW.find((c) => c.id === id);
      const prompt = CREW_SYSTEM_PROMPTS[id];
      if (!member || !prompt) return null;

      return `### ${member.name} (${member.species})
Element: ${member.element} | Guardian: ${member.guardianAffinity}
Voice: ${member.voice}
Personality: ${member.personality.join(', ')}`;
    })
    .filter(Boolean)
    .join('\n\n');

  return `You are the narrator of a Living Lore encounter in the world of Arcanea. You roleplay ALL of the following characters, switching between them naturally based on who would speak in each moment.

## Characters Present

${characterBlocks}

## Scene Context

${sceneContext}

## Rules

- Write in third-person narrative with dialogue
- Attribute speech clearly: use the character's name before their dialogue
- Each character must sound distinct — match their voice and personality exactly
- Reference Arcanea lore naturally: Gates, Guardians, Elements, the Academy
- Never break the fourth wall
- When the user speaks or acts, the characters react in-character
- Keep responses to 3-5 paragraphs unless the scene demands more
- Advance the scene with each response — don't just react, move the story forward
- End responses at natural pause points that invite the user to respond`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, presentCrew, sceneContext } = body;

    if (!messages || !presentCrew || !sceneContext) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: messages, presentCrew, sceneContext' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = buildEncounterPrompt(presentCrew, sceneContext);

    // Try Google first, fall back to Anthropic
    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    let model;
    if (googleKey) {
      const google = createGoogleGenerativeAI({ apiKey: googleKey });
      model = google('gemini-2.0-flash');
    } else if (anthropicKey) {
      const anthropic = createAnthropic({ apiKey: anthropicKey });
      model = anthropic('claude-sonnet-4-20250514');
    } else {
      return new Response(
        JSON.stringify({ error: 'No AI provider configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = streamText({
      model,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      temperature: 0.85,
      maxOutputTokens: 2048,
    });

    return result.toTextStreamResponse();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
