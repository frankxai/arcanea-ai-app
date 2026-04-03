import { NextRequest, NextResponse } from 'next/server';
import { generateImages } from '@/lib/imagine/generate';
import { applyStyle } from '@/lib/imagine/styles';
import type { ImagineGenerationResponse } from '@/lib/imagine/contracts';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const startedAt = new Date();
  try {
    const { prompt, count = 4, aspectRatio = '1:1', provider, model, style, enhance: shouldEnhance } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // ── Pipeline: raw prompt → APL enhance (optional) → Style wrap ──────
    let processedPrompt = prompt;

    if (shouldEnhance) {
      try {
        const enhanceRes = await fetch(new URL('/api/apl/enhance', req.url), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: processedPrompt, mode: 'image' }),
        });
        if (enhanceRes.ok) {
          const enhanceData = await enhanceRes.json();
          if (enhanceData.enhanced) {
            processedPrompt = enhanceData.enhanced;
          }
        }
      } catch {
        // Enhancement is optional — continue with original prompt
      }
    }

    const { prompt: styledPrompt } = applyStyle(processedPrompt, style || 'none');

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

    // Generate images via shared lib (Grok → OpenRouter → Gemini fallback)
    try {
      const result = await generateImages({
        prompt: styledPrompt,
        count,
        aspectRatio,
        forceProvider: provider || undefined,
        openrouterModel: model || undefined,
      });
      const completedAt = new Date();

      // Map to the existing response shape for backwards compatibility.
      // Grok returns external URLs; Gemini/OpenRouter return base64 data URLs.
      const images = result.images.map((img) => {
        if (img.url.startsWith('data:')) {
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
          fallbackUsed: result.provider !== 'openrouter',
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
