import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

// Grok Imagine API: model grok-imagine-image at api.x.ai/v1/images/generations
// Falls back to Gemini Flash on any Grok failure

interface GrokImageResponse {
  data: { url: string; revised_prompt?: string }[];
}

async function generateWithGrok(
  prompt: string,
  count: number,
  aspectRatio: string,
): Promise<{ images: { url: string; prompt: string }[]; provider: string }> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('NO_XAI_KEY');

  const n = Math.min(count, 10);

  const res = await fetch('https://api.x.ai/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-imagine-image',
      prompt,
      n,
      aspect_ratio: aspectRatio,
      response_format: 'url',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } })?.error?.message || `Grok API error ${res.status}`;
    throw new Error(msg);
  }

  const data = (await res.json()) as GrokImageResponse;

  return {
    images: data.data.map((img) => ({
      url: img.url,
      prompt: img.revised_prompt || prompt,
    })),
    provider: 'grok',
  };
}

async function generateWithGemini(
  prompt: string,
  count: number,
): Promise<{ images: { url?: string; data?: string; mimeType: string; prompt: string }[]; provider: string }> {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('NO_GEMINI_KEY');

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      // @ts-expect-error -- Gemini image gen uses responseModalities
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const promises = Array.from({ length: Math.min(count, 4) }, async (_, i) => {
    const variation = count > 1
      ? `${prompt} (variation ${i + 1}, unique composition and style)`
      : prompt;

    try {
      const result = await model.generateContent(variation);
      const parts = result.response.candidates?.[0]?.content?.parts || [];
      const images: { data: string; mimeType: string; prompt: string }[] = [];

      for (const part of parts) {
        if (part.inlineData) {
          images.push({
            data: part.inlineData.data,
            mimeType: part.inlineData.mimeType || 'image/png',
            prompt: variation,
          });
        }
      }
      return images;
    } catch {
      return [];
    }
  });

  const results = (await Promise.all(promises)).flat();

  return { images: results, provider: 'gemini' };
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, count = 4, aspectRatio = '1:1' } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Try Grok first, fall back to Gemini on any failure
    let grokError = '';
    try {
      const result = await generateWithGrok(prompt, count, aspectRatio);
      return NextResponse.json({
        images: result.images,
        provider: result.provider,
        prompt,
      });
    } catch (grokErr) {
      grokError = grokErr instanceof Error ? grokErr.message : 'Grok failed';
    }

    // Gemini fallback
    try {
      const result = await generateWithGemini(prompt, count);
      if (result.images.length === 0) {
        return NextResponse.json(
          { error: grokError || 'All image generations failed. Try a different prompt.' },
          { status: 500 },
        );
      }
      return NextResponse.json({
        images: result.images,
        provider: result.provider,
        prompt,
      });
    } catch (geminiErr) {
      const geminiMsg = geminiErr instanceof Error ? geminiErr.message : '';
      if (grokError === 'NO_XAI_KEY' && geminiMsg === 'NO_GEMINI_KEY') {
        return NextResponse.json(
          { error: 'No image generation API configured. Set XAI_API_KEY (recommended) or GEMINI_API_KEY in Vercel.' },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: grokError || geminiMsg || 'Image generation failed' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Imagine API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 },
    );
  }
}
