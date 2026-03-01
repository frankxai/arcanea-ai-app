import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '');

// Premium quality prompt enhancer — adds cinematic detail
function enhanceForPremium(prompt: string): string {
  return `Create a masterpiece: ${prompt}. Ultra-high resolution 4K quality, exceptional detail and texture, professional cinematic lighting with volumetric rays, rich color depth, sharp focus with subtle bokeh, photorealistic where appropriate with artistic flair. Award-winning composition.`;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, count = 2, quality = 'standard' } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured. Add it in Vercel project settings.' },
        { status: 503 }
      );
    }

    const isPremium = quality === 'premium';

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        // @ts-expect-error -- Gemini image gen uses responseModalities
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    // Generate images in parallel
    const imagePromises = Array.from({ length: Math.min(count, 4) }, async (_, i) => {
      let variation = count > 1
        ? `${prompt} (variation ${i + 1}, unique composition and style)`
        : prompt;

      // Premium mode: enhance prompt with quality directives
      if (isPremium) {
        variation = enhanceForPremium(variation);
      }

      try {
        const result = await model.generateContent(variation);
        const response = result.response;
        const parts = response.candidates?.[0]?.content?.parts || [];

        const images: { data: string; mimeType: string; text?: string }[] = [];

        for (const part of parts) {
          if (part.inlineData) {
            images.push({
              data: part.inlineData.data,
              mimeType: part.inlineData.mimeType || 'image/png',
            });
          }
        }

        const textPart = parts.find(p => p.text);

        return {
          id: `img_${Date.now()}_${i}`,
          images,
          text: textPart?.text || '',
          prompt: variation,
          quality,
          createdAt: new Date().toISOString(),
        };
      } catch (err) {
        console.error(`Generation ${i} failed:`, err);
        return null;
      }
    });

    const results = (await Promise.all(imagePromises)).filter(Boolean);

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'All image generations failed. Try a different prompt.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ results, quality });
  } catch (error) {
    console.error('Imagine API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    );
  }
}
