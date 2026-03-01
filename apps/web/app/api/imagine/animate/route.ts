import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, prompt } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Try fal.ai first (best quality for image-to-video)
    if (process.env.FAL_KEY) {
      const { fal } = await import('@fal-ai/client');
      fal.config({ credentials: process.env.FAL_KEY });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (fal as any).subscribe('fal-ai/kling-video/v1/standard/image-to-video', {
        input: {
          prompt: prompt || 'Cinematic camera movement, slow dolly in, atmospheric lighting',
          image_url: imageUrl,
          duration: '5',
          aspect_ratio: '1:1',
        },
        logs: true,
      });

      const videoUrl = (result.data as { video?: { url?: string } })?.video?.url;

      if (videoUrl) {
        return NextResponse.json({ videoUrl, provider: 'fal-ai' });
      }
    }

    // Fallback: use Gemini to create a "motion-inspired" re-imagined version
    // This isn't true video, but it gives visual feedback while FAL_KEY isn't set
    if (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '');

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          // @ts-expect-error -- Gemini image gen uses responseModalities
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      const motionPrompt = `Based on this image, create a dramatically different angle or moment of the same scene: ${prompt || 'cinematic dramatic lighting, dynamic composition, motion blur'}. Make it feel like the next frame in an epic sequence.`;

      const result = await model.generateContent(motionPrompt);
      const parts = result.response.candidates?.[0]?.content?.parts || [];

      for (const part of parts) {
        if (part.inlineData) {
          return NextResponse.json({
            reimaginedImage: {
              data: part.inlineData.data,
              mimeType: part.inlineData.mimeType || 'image/png',
            },
            provider: 'gemini-reimagine',
            message: 'Re-imagined version (add FAL_KEY for true video animation)',
          });
        }
      }
    }

    return NextResponse.json(
      { error: 'Animation requires FAL_KEY for video, or GEMINI_API_KEY for re-imagination.' },
      { status: 503 }
    );
  } catch (error) {
    console.error('Animate API error:', error);
    const message = error instanceof Error ? error.message : 'Animation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
