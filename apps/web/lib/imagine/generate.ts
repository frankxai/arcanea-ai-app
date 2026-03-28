/**
 * Core image generation logic — shared between the /api/imagine/generate
 * route and the chat tool-calling pipeline.
 *
 * Provider priority: Grok (xAI) first, Gemini fallback.
 * Credit checking is NOT handled here — callers are responsible.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImageGenerationResult {
  images: Array<{
    url: string;
    revisedPrompt?: string;
  }>;
  provider: 'grok' | 'gemini';
  model: string;
}

export interface ImageGenerationOptions {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  count?: number;
}

// ---------------------------------------------------------------------------
// Aspect ratio → pixel size mapping (shared across providers)
// ---------------------------------------------------------------------------

const ASPECT_RATIOS: Record<string, string> = {
  '1:1': '1024x1024',
  '16:9': '1792x1024',
  '9:16': '1024x1792',
  '4:3': '1024x768',
  '3:4': '768x1024',
  '3:2': '1536x1024',
  '2:3': '1024x1536',
};

// ---------------------------------------------------------------------------
// Grok (xAI) provider
// ---------------------------------------------------------------------------

interface GrokImageResponse {
  data: Array<{ url: string; revised_prompt?: string }>;
}

async function generateWithGrok(
  prompt: string,
  count: number,
  aspectRatio: string,
): Promise<ImageGenerationResult> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('NO_XAI_KEY');

  const size = ASPECT_RATIOS[aspectRatio] || '1024x1024';
  const n = Math.min(count, 10);

  const res = await fetch('https://api.x.ai/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-2-image',
      prompt,
      n,
      size,
      response_format: 'url',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      (err as { error?: { message?: string } })?.error?.message ||
      `Grok API error ${res.status}`;
    throw new Error(msg);
  }

  const data = (await res.json()) as GrokImageResponse;

  return {
    images: data.data.map((img) => ({
      url: img.url,
      revisedPrompt: img.revised_prompt || undefined,
    })),
    provider: 'grok',
    model: 'grok-2-image',
  };
}

// ---------------------------------------------------------------------------
// Gemini provider
// ---------------------------------------------------------------------------

async function generateWithGemini(
  prompt: string,
  count: number,
): Promise<ImageGenerationResult> {
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
    const variation =
      count > 1
        ? `${prompt} (variation ${i + 1}, unique composition and style)`
        : prompt;

    try {
      const result = await model.generateContent(variation);
      const parts = result.response.candidates?.[0]?.content?.parts || [];
      const images: Array<{ url: string; revisedPrompt?: string }> = [];

      for (const part of parts) {
        if (part.inlineData) {
          images.push({
            url: `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`,
            revisedPrompt: variation,
          });
        }
      }
      return images;
    } catch {
      return [];
    }
  });

  const results = (await Promise.all(promises)).flat();

  return {
    images: results,
    provider: 'gemini',
    model: 'gemini-2.0-flash-exp',
  };
}

// ---------------------------------------------------------------------------
// Public API — Grok first, Gemini fallback
// ---------------------------------------------------------------------------

/**
 * Generate images using the best available provider.
 * Tries Grok (xAI) first, falls back to Gemini if no XAI_API_KEY is set.
 *
 * @throws {Error} If no image provider is configured or generation fails.
 */
export async function generateImages(
  options: ImageGenerationOptions,
): Promise<ImageGenerationResult> {
  const { prompt, aspectRatio = '1:1', count = 1 } = options;

  // Try Grok first (primary provider)
  try {
    return await generateWithGrok(prompt, count, aspectRatio);
  } catch (grokErr) {
    const grokMsg = grokErr instanceof Error ? grokErr.message : '';

    // Only fall back if Grok key is missing — real API errors should surface
    if (grokMsg !== 'NO_XAI_KEY') {
      throw grokErr;
    }
  }

  // Gemini fallback
  try {
    const result = await generateWithGemini(prompt, count);
    if (result.images.length === 0) {
      throw new Error('All image generations failed. Try a different prompt.');
    }
    return result;
  } catch (geminiErr) {
    const geminiMsg = geminiErr instanceof Error ? geminiErr.message : '';
    if (geminiMsg === 'NO_GEMINI_KEY') {
      throw new Error(
        'No image generation API configured. Set XAI_API_KEY (recommended) or GEMINI_API_KEY in Vercel.',
      );
    }
    throw geminiErr;
  }
}
