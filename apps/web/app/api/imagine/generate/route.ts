import { NextRequest, NextResponse } from 'next/server';
import { generateImages } from '@/lib/imagine/generate';
import type { ImagineGenerationResponse } from '@/lib/imagine/contracts';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const startedAt = new Date();
  try {
    const { prompt, count = 4, aspectRatio = '1:1' } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // ── Credit check: spend 1 credit per generation request ──────────────
    // Forward cookies so the spend endpoint can authenticate the user.
    // For public (unauthenticated) users, skip the credit check to keep
    // /imagine accessible without login.
    const cookieHeader = req.headers.get('cookie') ?? '';
    const spendRes = await fetch(new URL('/api/credits/spend', req.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieHeader,
      },
      body: JSON.stringify({ creationType: 'image' }),
    });

    if (!spendRes.ok && spendRes.status !== 401) {
      // Allow unauthenticated users through (401) — block only real failures
      const spendErr = await spendRes.json().catch(() => ({}));
      const status = spendRes.status === 402 ? 402 : spendRes.status;
      return NextResponse.json(
        {
          error: (spendErr as { error?: string }).error ?? 'Credit check failed',
          reason: (spendErr as { reason?: string }).reason ?? 'unknown',
        },
        { status },
      );
    }

    // Generate images via shared lib (Grok first, Gemini fallback)
    try {
      const result = await generateImages({ prompt, count, aspectRatio });
      const completedAt = new Date();

      // Map to the existing response shape for backwards compatibility.
      // Grok returns external URLs; Gemini returns base64 data URLs.
      // The shared lib normalises Gemini to data URLs, but the original
      // route also returned `data` + `mimeType` fields for Gemini.
      // We preserve both shapes so existing clients keep working.
      const images = result.images.map((img) => {
        if (result.provider === 'gemini' && img.url.startsWith('data:')) {
          // Parse the data URL back into the legacy Gemini shape
          const match = img.url.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            return {
              data: match[2],
              mimeType: match[1],
              prompt: img.revisedPrompt || prompt,
            };
          }
        }
        return {
          url: img.url,
          prompt: img.revisedPrompt || prompt,
        };
      });

      const response: ImagineGenerationResponse = {
        generationId: `gen_${startedAt.getTime()}`,
        status: 'completed',
        provider: result.provider,
        model: result.model,
        prompt,
        revisedPrompt: result.images[0]?.revisedPrompt,
        aspectRatio,
        assetUrls: result.images.map((img) => img.url),
        assets: result.images.map((img, index) => {
          const legacyImage = images[index];
          return {
            url: img.url,
            prompt: img.revisedPrompt || prompt,
            revisedPrompt: img.revisedPrompt,
            mimeType: 'mimeType' in legacyImage ? legacyImage.mimeType : undefined,
            data: 'data' in legacyImage ? legacyImage.data : undefined,
          };
        }),
        timing: {
          startedAt: startedAt.toISOString(),
          completedAt: completedAt.toISOString(),
          durationMs: completedAt.getTime() - startedAt.getTime(),
        },
        safety: {
          providerConfigured: true,
          fallbackUsed: result.provider === 'gemini',
        },
        saveState: {
          canSave: images.length > 0,
        },
        error: null,
        images: images.map((image) => ({
          ...image,
          revisedPrompt: image.prompt,
        })),
      };

      return NextResponse.json(response);
    } catch (genErr) {
      const msg = genErr instanceof Error ? genErr.message : 'Image generation failed';
      // Detect the "no provider configured" error for a 503 status
      if (msg.includes('No image generation API configured')) {
        return NextResponse.json({ error: msg }, { status: 503 });
      }
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  } catch (error) {
    console.error('Imagine API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 },
    );
  }
}
