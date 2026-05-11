/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * GET /api/models/openrouter
 *
 * Fetches live model data from OpenRouter (free, no auth required),
 * transforms it into Arcanea's format, and enriches with workflow tags.
 *
 * Query params:
 *   ?free=true  — return only free models
 *
 * ISR: revalidates every hour (3600s).
 */

import { NextRequest, NextResponse } from 'next/server';
import { ARCANEAN_WORKFLOWS } from '@/lib/models-data';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

// ---------------------------------------------------------------------------
// ISR cache — revalidate every hour
// ---------------------------------------------------------------------------
export const revalidate = 3600;

// ---------------------------------------------------------------------------
// OpenRouter raw types
// ---------------------------------------------------------------------------

interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  architecture: {
    modality: string;
    input_modalities: string[];
    output_modalities: string[];
    tokenizer: string;
  };
  pricing: {
    prompt: string;
    completion: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number;
    is_moderated: boolean;
  };
  created: number;
  expiration_date?: string;
}

// ---------------------------------------------------------------------------
// Transformed output type
// ---------------------------------------------------------------------------

interface TransformedModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  maxOutput: number;
  pricing: {
    inputPerMillion: number;
    outputPerMillion: number;
    isFree: boolean;
  };
  sweBench: number | null;
  category: 'frontier' | 'open-source' | 'free-tier';
  modality: string;
  inputModalities: string[];
  outputModalities: string[];
  created: string;
  arcaneanWorkflow: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const OPENROUTER_API = 'https://openrouter.ai/api/v1/models';

const OPEN_SOURCE_PROVIDERS = new Set([
  'meta-llama',
  'deepseek',
  'mistralai',
  'qwen',
  'google',       // gemma variants
  'microsoft',    // phi variants
  'nous',
  'openchat',
  'teknium',
]);

const SWE_BENCH_RE = /(\d+\.?\d*)\s*(?:score\s+on|on)\s+SWE-bench/i;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractProvider(id: string): string {
  const slash = id.indexOf('/');
  if (slash === -1) return 'Unknown';
  const raw = id.slice(0, slash);
  // Title-case: "meta-llama" → "Meta Llama"
  return raw
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function categorize(pricing: OpenRouterModel['pricing'], providerId: string): TransformedModel['category'] {
  if (pricing.prompt === '0' && pricing.completion === '0') return 'free-tier';
  const provider = providerId.split('/')[0] ?? '';
  if (OPEN_SOURCE_PROVIDERS.has(provider)) return 'open-source';
  return 'frontier';
}

function parseSweScore(description: string): number | null {
  const match = SWE_BENCH_RE.exec(description);
  return match ? parseFloat(match[1]) : null;
}

/** Check if any Arcanean workflow references this OpenRouter model ID. */
function isArcaneanModel(openRouterId: string): boolean {
  // Match loosely: our IDs like "claude-sonnet-4" should match "anthropic/claude-sonnet-4"
  const shortId = openRouterId.includes('/') ? openRouterId.split('/')[1] : openRouterId;
  return ARCANEAN_WORKFLOWS.some(
    (w) =>
      w.model === shortId ||
      w.fallbackModels.includes(shortId) ||
      w.model === openRouterId ||
      w.fallbackModels.includes(openRouterId),
  );
}

function isExpired(model: OpenRouterModel): boolean {
  if (!model.expiration_date) return false;
  return new Date(model.expiration_date).getTime() < Date.now();
}

function transform(raw: OpenRouterModel): TransformedModel {
  const perTokenToPerMillion = (v: string) => parseFloat(v) * 1_000_000;

  return {
    id: raw.id,
    name: raw.name,
    provider: extractProvider(raw.id),
    description: raw.description,
    contextWindow: raw.context_length,
    maxOutput: raw.top_provider?.max_completion_tokens ?? 0,
    pricing: {
      inputPerMillion: perTokenToPerMillion(raw.pricing.prompt),
      outputPerMillion: perTokenToPerMillion(raw.pricing.completion),
      isFree: raw.pricing.prompt === '0' && raw.pricing.completion === '0',
    },
    sweBench: parseSweScore(raw.description),
    category: categorize(raw.pricing, raw.id),
    modality: raw.architecture?.modality ?? 'text',
    inputModalities: raw.architecture?.input_modalities ?? ['text'],
    outputModalities: raw.architecture?.output_modalities ?? ['text'],
    created: new Date(raw.created * 1000).toISOString(),
    arcaneanWorkflow: isArcaneanModel(raw.id),
  };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

const MODELS_RATE_LIMIT = { maxRequests: 20, windowMs: 60_000 };

export async function GET(request: NextRequest) {
  const rl = checkRateLimit(getClientIdentifier(request), MODELS_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const freeOnly = request.nextUrl.searchParams.get('free') === 'true';

  try {
    const res = await fetch(OPENROUTER_API, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    } as RequestInit);

    if (!res.ok) {
      return NextResponse.json(
        { error: 'OpenRouter API unavailable', fallback: true },
        { status: 503 },
      );
    }

    const json = (await res.json()) as { data: OpenRouterModel[] };
    const raw = json.data ?? [];

    let models = raw.filter((m) => !isExpired(m)).map(transform);

    if (freeOnly) {
      models = models.filter((m) => m.pricing.isFree);
    }

    const providers = new Set(models.map((m) => m.provider));

    return NextResponse.json({
      models,
      meta: {
        total: models.length,
        free: models.filter((m) => m.pricing.isFree).length,
        providers: providers.size,
        lastFetched: new Date().toISOString(),
        source: 'openrouter' as const,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'OpenRouter API unavailable', fallback: true },
      { status: 503 },
    );
  }
}
