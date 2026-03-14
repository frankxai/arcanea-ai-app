import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Enhancement service not configured.' },
        { status: 503 }
      );
    }

    // Use Grok via OpenRouter for fast prompt enhancement
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://arcanea.ai',
        'X-Title': 'Arcanea Imagine',
      },
      body: JSON.stringify({
        model: 'x-ai/grok-2-1212',
        messages: [
          {
            role: 'system',
            content: `You are Arcanea's prompt architect. Use the SPARK.SHAPE.SHARPEN method:

SPARK — Find the one specific detail that makes this image unique. Not a description — a truth.
SHAPE — Add sensory atmosphere: what does this scene feel like, sound like, smell like? Use a palette (Forge=heat/ember/gold, Tide=cool/silver/echo, Root=earth/moss/weight, Drift=wind/ozone/pale, Void=silence/starfield/ink).
SHARPEN — Cut the defaults. No generic fantasy lighting. No symmetrical compositions unless earned. No "ethereal glow" or "majestic" or "hauntingly beautiful."

Add composition (camera angle, depth, framing), lighting (specific source and quality), atmosphere (weather, particles, time of day), and one unexpected texture detail. Keep the user's core vision but elevate it with specificity. Return ONLY the enhanced prompt, no explanations. Maximum 200 words.`,
          },
          {
            role: 'user',
            content: `Enhance this image prompt for maximum visual impact:\n\n"${prompt}"`,
          },
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: { message?: string } })?.error?.message || 'Enhancement failed');
    }

    const data = await res.json();
    const enhanced =
      (data as { choices?: { message?: { content?: string } }[] })?.choices?.[0]?.message?.content?.trim() || prompt;

    return NextResponse.json({ enhanced, original: prompt });
  } catch (error) {
    console.error('Enhance API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Enhancement failed' },
      { status: 500 }
    );
  }
}
