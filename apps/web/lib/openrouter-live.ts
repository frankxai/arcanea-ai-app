/**
 * OpenRouter Live Data Fetcher
 *
 * Fetches live model data from OpenRouter API for the /models page.
 * Used at build/revalidation time with ISR (1 hour).
 * Returns null on failure so the page falls back to static data.
 */

export interface LiveModel {
  id: string;
  name: string;
  provider: string;
  context_length: number;
  pricing_prompt_per_mtok: number;
  pricing_completion_per_mtok: number;
  is_free: boolean;
  max_completion: number;
  modality: string;
  description: string;
  created: number;
}

export interface LiveModelData {
  models: LiveModel[];
  meta: {
    total: number;
    free: number;
    providers: number;
    lastFetched: string;
  };
}

export async function fetchLiveModels(): Promise<LiveModelData | null> {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();

    const raw: Array<{
      id: string;
      name: string;
      context_length: number;
      pricing?: { prompt?: string; completion?: string };
      top_provider?: { max_completion_tokens?: number };
      architecture?: { modality?: string };
      description?: string;
      created?: number;
    }> = data?.data ?? [];

    if (!raw.length) return null;

    const models: LiveModel[] = raw.map((m) => {
      const promptPrice = parseFloat(m.pricing?.prompt ?? '0') * 1_000_000;
      const completionPrice =
        parseFloat(m.pricing?.completion ?? '0') * 1_000_000;
      const isFree = promptPrice === 0 && completionPrice === 0;
      const provider = m.id.split('/')[0] ?? 'unknown';

      return {
        id: m.id,
        name: m.name,
        provider,
        context_length: m.context_length ?? 0,
        pricing_prompt_per_mtok: Math.round(promptPrice * 100) / 100,
        pricing_completion_per_mtok: Math.round(completionPrice * 100) / 100,
        is_free: isFree,
        max_completion: m.top_provider?.max_completion_tokens ?? 0,
        modality: m.architecture?.modality ?? 'text',
        description: m.description ?? '',
        created: m.created ?? 0,
      };
    });

    const providers = new Set(models.map((m) => m.provider));

    return {
      models,
      meta: {
        total: models.length,
        free: models.filter((m) => m.is_free).length,
        providers: providers.size,
        lastFetched: new Date().toISOString(),
      },
    };
  } catch {
    return null;
  }
}
