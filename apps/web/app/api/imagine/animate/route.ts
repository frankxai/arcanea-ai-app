import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 120;

// Grok Imagine Video: async pattern — POST to start, GET to poll
// Model: grok-imagine-video, same XAI_API_KEY as image gen

const POLL_INTERVAL = 3000; // 3s between polls
const MAX_POLLS = 35;       // ~105s max wait

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface VideoStatus {
  status: 'pending' | 'done' | 'expired' | 'error';
  video?: { url: string; duration?: number };
  error?: string;
}

async function animateWithGrok(
  imageUrl: string,
  prompt: string,
): Promise<{ videoUrl: string; provider: string }> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('NO_XAI_KEY');

  // Step 1: Start video generation
  const startRes = await fetch('https://api.x.ai/v1/videos/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-imagine-video',
      prompt: prompt || 'Cinematic camera movement, slow dolly in, atmospheric lighting, subtle motion',
      image_url: imageUrl,
      duration: 5,
      aspect_ratio: '1:1',
      resolution: '720p',
    }),
  });

  if (!startRes.ok) {
    const err = await startRes.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } })?.error?.message || `Grok Video API error ${startRes.status}`);
  }

  const { request_id } = await startRes.json() as { request_id: string };

  if (!request_id) {
    throw new Error('No request_id returned from Grok Video API');
  }

  // Step 2: Poll for completion
  for (let i = 0; i < MAX_POLLS; i++) {
    await sleep(POLL_INTERVAL);

    const pollRes = await fetch(`https://api.x.ai/v1/videos/${request_id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!pollRes.ok) continue;

    const status = await pollRes.json() as VideoStatus;

    if (status.status === 'done' && status.video?.url) {
      return { videoUrl: status.video.url, provider: 'grok-video' };
    }

    if (status.status === 'expired' || status.status === 'error') {
      throw new Error(status.error || 'Video generation failed or expired');
    }
  }

  throw new Error('Video generation timed out — try again');
}

async function animateWithFal(imageUrl: string, prompt: string): Promise<{ videoUrl: string; provider: string }> {
  const { fal } = await import('@fal-ai/client');
  fal.config({ credentials: process.env.FAL_KEY! });

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
  if (!videoUrl) throw new Error('fal.ai returned no video');
  return { videoUrl, provider: 'fal-ai' };
}

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, prompt } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Priority 1: Grok Imagine Video (same API key as image gen)
    try {
      const result = await animateWithGrok(imageUrl, prompt);
      return NextResponse.json(result);
    } catch (grokErr) {
      const msg = grokErr instanceof Error ? grokErr.message : '';
      if (msg !== 'NO_XAI_KEY') {
        // Real Grok error — still try fallbacks
        console.error('Grok Video error:', msg);
      }
    }

    // Priority 2: fal.ai Kling Video
    if (process.env.FAL_KEY) {
      try {
        const result = await animateWithFal(imageUrl, prompt);
        return NextResponse.json(result);
      } catch (falErr) {
        console.error('fal.ai error:', falErr instanceof Error ? falErr.message : falErr);
      }
    }

    // Priority 3: Gemini re-imagine (not true video)
    const geminiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(geminiKey);

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
          });
        }
      }
    }

    return NextResponse.json(
      { error: 'No video/animation API configured. Set XAI_API_KEY (recommended), FAL_KEY, or GEMINI_API_KEY.' },
      { status: 503 },
    );
  } catch (error) {
    console.error('Animate API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Animation failed' },
      { status: 500 },
    );
  }
}
