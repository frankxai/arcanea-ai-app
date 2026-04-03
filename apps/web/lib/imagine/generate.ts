/**
 * Core image generation logic — shared between the /api/imagine/generate
 * route and the chat tool-calling pipeline.
 *
 * Provider priority:
 *   1. Grok (xAI) — direct API, fast, great quality
 *   2. OpenRouter — routes to best available image model
 *   3. Gemini (Google) — direct API fallback
 *
 * Credit checking is NOT handled here — callers are responsible.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ImageProvider = 'grok' | 'openrouter' | 'gemini';

export interface ImageGenerationResult {
  images: Array<{
    url: string;
    revisedPrompt?: string;
  }>;
  provider: ImageProvider;
  model: string;
}

export interface ImageGenerationOptions {
  prompt: string;
  aspectRatio?: string;
  count?: number;
  /** Force a specific provider (bypasses fallback chain) */
  forceProvider?: ImageProvider;
  /** OpenRouter model override (default: best available) */
  openrouterModel?: string;
}

// ---------------------------------------------------------------------------
// OpenRouter image model catalog — best models, updated March 2026
// ---------------------------------------------------------------------------

export const OPENROUTER_IMAGE_MODELS = [
  {
    id: 'google/gemini-3-pro-image-preview',
    name: 'Gemini 3 Pro Image',
    label: 'Nano Banana Pro',
    tier: 'premium' as const,
    provider: 'Google',
  },
  {
    id: 'google/gemini-3.1-flash-image-preview',
    name: 'Gemini 3.1 Flash Image',
    label: 'Nano Banana 2',
    tier: 'fast' as const,
    provider: 'Google',
  },
  {
    id: 'black-forest-labs/flux.2-max',
    name: 'FLUX.2 Max',
    label: 'FLUX.2 Max',
    tier: 'premium' as const,
    provider: 'Black Forest Labs',
  },
  {
    id: 'black-forest-labs/flux.2-pro',
    name: 'FLUX.2 Pro',
    label: 'FLUX.2 Pro',
    tier: 'quality' as const,
    provider: 'Black Forest Labs',
  },
  {
    id: 'black-forest-labs/flux.2-flex',
    name: 'FLUX.2 Flex',
    label: 'FLUX.2 Flex',
    tier: 'fast' as const,
    provider: 'Black Forest Labs',
  },
  {
    id: 'black-forest-labs/flux.2-klein-4b',
    name: 'FLUX.2 Klein',
    label: 'FLUX.2 Klein',
    tier: 'fast' as const,
    provider: 'Black Forest Labs',
  },
  {
    id: 'openai/gpt-5-image',
    name: 'GPT-5 Image',
    label: 'GPT-5 Image',
    tier: 'premium' as const,
    provider: 'OpenAI',
  },
  {
    id: 'openai/gpt-5-image-mini',
    name: 'GPT-5 Image Mini',
    label: 'GPT-5 Image Mini',
    tier: 'fast' as const,
    provider: 'OpenAI',
  },
  {
    id: 'google/gemini-2.5-flash-image-preview',
    name: 'Gemini 2.5 Flash Image',
    label: 'Nano Banana',
    tier: 'fast' as const,
    provider: 'Google',
  },
] as const;

/** Default OpenRouter model — best balance of quality, speed, cost */
const DEFAULT_OPENROUTER_MODEL = 'google/gemini-3.1-flash-image-preview';

// ---------------------------------------------------------------------------
// Aspect ratio → pixel size mapping (for Grok direct API)
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
// Provider 1: Grok (xAI) — direct API
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
// Provider 2: OpenRouter — chat/completions with modalities: ["image"]
// Routes to Gemini 3 Pro, Flux, GPT-5 Image, etc.
// ---------------------------------------------------------------------------

interface OpenRouterChoice {
  message: {
    content?: string | null;
    images?: Array<{ image_url: { url: string } }>;
  };
}

interface OpenRouterImageResponse {
  choices: OpenRouterChoice[];
  model?: string;
}

async function generateWithOpenRouter(
  prompt: string,
  count: number,
  aspectRatio: string,
  modelId?: string,
): Promise<ImageGenerationResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('NO_OPENROUTER_KEY');

  const model = modelId || DEFAULT_OPENROUTER_MODEL;
  const isFlux = model.includes('flux');
  const n = Math.min(count, isFlux ? 1 : 4);

  // OpenRouter uses chat/completions with modalities for image gen
  const images: Array<{ url: string; revisedPrompt?: string }> = [];

  const generateOne = async (variation: string) => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://arcanea.ai',
        'X-Title': 'Arcanea',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: variation }],
        modalities: isFlux ? ['image'] : ['image', 'text'],
        image_config: {
          aspect_ratio: aspectRatio,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg =
        (err as { error?: { message?: string } })?.error?.message ||
        `OpenRouter API error ${res.status}`;
      throw new Error(msg);
    }

    const data = (await res.json()) as OpenRouterImageResponse;
    const choice = data.choices?.[0];
    if (!choice) return;

    // Images can come as inline data URLs in content or in images array
    if (choice.message.images?.length) {
      for (const img of choice.message.images) {
        images.push({
          url: img.image_url.url,
          revisedPrompt: variation,
        });
      }
    } else if (choice.message.content) {
      // Some models return base64 data URLs inline in content
      const dataUrlMatch = choice.message.content.match(
        /data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,
      );
      if (dataUrlMatch) {
        for (const dataUrl of dataUrlMatch) {
          images.push({ url: dataUrl, revisedPrompt: variation });
        }
      }
    }
  };

  // Generate multiple variations in parallel
  const promises = Array.from({ length: n }, (_, i) => {
    const variation =
      n > 1
        ? `${prompt} (variation ${i + 1}, unique composition and style)`
        : prompt;
    return generateOne(variation).catch(() => {});
  });

  await Promise.all(promises);

  if (images.length === 0) {
    throw new Error('OpenRouter returned no images. Try a different prompt or model.');
  }

  return {
    images,
    provider: 'openrouter',
    model,
  };
}

// ---------------------------------------------------------------------------
// Provider 3: Gemini (Google) — direct API fallback
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
// Public API — Grok → OpenRouter → Gemini fallback chain
// ---------------------------------------------------------------------------

/**
 * Generate images using the best available provider.
 *
 * Fallback chain:
 *   1. Grok (xAI) — fastest, direct API
 *   2. OpenRouter — access to Gemini 3 Pro, Flux, GPT-5 Image
 *   3. Gemini (Google direct) — last resort
 *
 * @throws {Error} If no image provider is configured or generation fails.
 */
export async function generateImages(
  options: ImageGenerationOptions,
): Promise<ImageGenerationResult> {
  const { prompt, aspectRatio = '1:1', count = 1, forceProvider, openrouterModel } = options;

  // If a specific provider is forced, use only that one
  if (forceProvider === 'grok') return generateWithGrok(prompt, count, aspectRatio);
  if (forceProvider === 'openrouter') return generateWithOpenRouter(prompt, count, aspectRatio, openrouterModel);
  if (forceProvider === 'gemini') return generateWithGemini(prompt, count);

  // --- Fallback chain: OpenRouter → Grok → Gemini (any error = try next) ---
  const errors: string[] = [];

  if (process.env.OPENROUTER_API_KEY) {
    try {
      return await generateWithOpenRouter(prompt, count, aspectRatio, openrouterModel);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown';
      console.warn('[imagine] OpenRouter failed:', msg);
      errors.push(`OpenRouter: ${msg}`);
    }
  }

  if (process.env.XAI_API_KEY) {
    try {
      return await generateWithGrok(prompt, count, aspectRatio);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown';
      console.warn('[imagine] Grok failed:', msg);
      errors.push(`Grok: ${msg}`);
    }
  }

  if (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) {
    try {
      const result = await generateWithGemini(prompt, count);
      if (result.images.length > 0) return result;
      errors.push('Gemini: no images returned');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown';
      console.warn('[imagine] Gemini failed:', msg);
      errors.push(`Gemini: ${msg}`);
    }
  }

  if (errors.length === 0) {
    throw new Error('No image generation API configured. Set OPENROUTER_API_KEY, XAI_API_KEY, or GEMINI_API_KEY.');
  }
  throw new Error(`All image providers failed. ${errors.join(' | ')}`);
}
