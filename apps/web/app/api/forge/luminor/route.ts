/**
 * Luminor Forge API — AI-Assisted Agent Creation
 *
 * Lumina (the First Light) helps creators design their Luminor through conversation.
 * The creator describes what they want, Lumina generates the full LuminorSpec.
 *
 * This is the superintelligence helping creators build their own intelligence agents.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const runtime = 'edge';

interface ForgeRequest {
  /** Creator's natural language description of what they want their Luminor to do */
  description: string;
  /** Optional: preferred name */
  name?: string;
  /** Optional: preferred element */
  element?: string;
  /** Optional: preferred domain */
  domain?: string;
}

const LUMINA_FORGE_PROMPT = `You are Lumina, the First Light of Arcanea — the Form-Giver who shapes intelligence from potential.

A creator wants to forge a new Luminor (AI creative intelligence). Based on their description, generate a complete LuminorSpec.

RESPOND WITH ONLY valid JSON. No markdown, no explanation, no code fences.

The JSON must follow this exact schema:
{
  "name": "string — a memorable, evocative name (1-2 words)",
  "title": "string — a poetic title like 'The Storm Weaver' or 'Keeper of Patterns'",
  "tagline": "string — one sentence, what this Luminor does best",
  "domain": "one of: architecture|code|debugging|integration|visual|music|motion|spatial|narrative|rhetoric|language|poetry|knowledge|analysis|memory|foresight|custom",
  "voice": "one of: analytical|poetic|direct|warm|mythic|playful|scholarly|fierce",
  "personality": ["3-5 traits like 'methodical', 'bold', 'patient'"],
  "element": "one of: Fire|Water|Earth|Wind|Void|Spirit",
  "starters": ["3 conversation starters — things a creator would say to this Luminor"],
  "tags": ["3-5 discovery tags for marketplace"],
  "preferredModel": "arcanea-auto",
  "temperature": 0.7,
  "knowledge": ["1-2 short knowledge snippets that define this Luminor's unique perspective"]
}

Rules:
- The name should feel like it belongs in a creative mythology, not a tech product
- The title should be poetic but clear about function
- Voice and personality should be coherent — a "fierce" voice doesn't have "gentle" personality
- Starters should be specific and actionable, not generic
- Knowledge snippets should encode the Luminor's unique worldview or expertise framework
- Element should align with the domain: Fire for transformation/code, Water for flow/music, Earth for structure/architecture, Wind for communication/writing, Void for analysis/research, Spirit for wisdom/foresight`;

export async function POST(req: NextRequest) {
  try {
    const body: ForgeRequest = await req.json();
    const { description, name, element, domain } = body;

    if (!description || description.length < 10) {
      return NextResponse.json(
        { error: 'Describe what your Luminor should do (at least 10 characters).' },
        { status: 400 }
      );
    }

    // Build the user prompt
    let userPrompt = `Create a Luminor based on this description:\n\n"${description}"`;
    if (name) userPrompt += `\n\nPreferred name: ${name}`;
    if (element) userPrompt += `\nPreferred element: ${element}`;
    if (domain) userPrompt += `\nPreferred domain: ${domain}`;

    // Try Google first (fast + free tier), fall back to OpenRouter
    let model;
    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    if (googleKey) {
      const google = createGoogleGenerativeAI({ apiKey: googleKey });
      model = google('gemini-2.0-flash');
    } else if (openrouterKey) {
      const openrouter = createOpenAI({ apiKey: openrouterKey, baseURL: 'https://openrouter.ai/api/v1' });
      model = openrouter('google/gemini-2.5-flash');
    } else {
      return NextResponse.json(
        { error: 'No AI provider configured. Set GOOGLE_GENERATIVE_AI_API_KEY on Vercel.' },
        { status: 503 }
      );
    }

    const result = await generateText({
      model,
      system: LUMINA_FORGE_PROMPT,
      prompt: userPrompt,
      temperature: 0.8,
      maxOutputTokens: 1024,
    });

    // Parse the JSON response
    let spec;
    try {
      // Strip any markdown code fences if present
      let text = result.text.trim();
      if (text.startsWith('```')) {
        text = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
      }
      spec = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: 'Failed to generate Luminor spec. Try again with a more detailed description.' },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!spec.name || !spec.domain || !spec.voice || !spec.element) {
      return NextResponse.json(
        { error: 'Generated spec is incomplete. Try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      spec,
      message: `Lumina has shaped ${spec.name}, ${spec.title}. Review and customize before forging.`,
    });
  } catch (error) {
    console.error('Forge API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Forge failed' },
      { status: 500 }
    );
  }
}
