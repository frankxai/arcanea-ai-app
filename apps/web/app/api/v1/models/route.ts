/**
 * Arcanea Intelligence Gateway — Models API
 *
 * OpenAI-compatible endpoint: GET /api/v1/models
 *
 * Returns the curated model catalog.
 * This endpoint enables auto-discovery in LobeChat, Open WebUI,
 * and other tools that query /v1/models on connection.
 */

import { NextRequest, NextResponse } from 'next/server';
import { CURATED_MODELS, getTextModels, getImageModels, getVideoModels } from '@/lib/gateway/models';
import type { ModelsListResponse, ModelObject } from '@/lib/gateway/types';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const tier = searchParams.get('tier');

  let models = CURATED_MODELS;

  // Filter by category if specified
  if (category === 'text') models = getTextModels();
  else if (category === 'image') models = getImageModels();
  else if (category === 'video') models = getVideoModels();
  else if (category) {
    models = models.filter((m) => m.category.includes(category as any));
  }

  // Filter by tier if specified
  if (tier) {
    models = models.filter((m) => m.tier === tier);
  }

  // Standard OpenAI models list format
  const response: ModelsListResponse = {
    object: 'list',
    data: models.map((m): ModelObject => ({
      id: m.id,
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'arcanea',
      // Extended metadata (non-standard but useful)
      permission: [{
        allow_create_engine: false,
        allow_sampling: true,
        allow_logprobs: false,
        allow_search_indices: false,
        allow_view: true,
        allow_fine_tuning: false,
        organization: '*',
        group: null,
        is_blocking: false,
      }],
    })),
  };

  return NextResponse.json(response);
}

/**
 * Extended models endpoint with full Arcanea metadata.
 * POST /api/v1/models with body { extended: true }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.extended) {
      // Return full curated catalog with descriptions, pricing, etc.
      return NextResponse.json({
        object: 'list',
        data: CURATED_MODELS.map((m) => ({
          id: m.id,
          object: 'model',
          created: Math.floor(Date.now() / 1000),
          owned_by: 'arcanea',
          // Arcanea extensions
          arcanea: {
            name: m.name,
            description: m.description,
            provider: m.provider,
            providerModelId: m.providerModelId,
            category: m.category,
            tier: m.tier,
            contextWindow: m.contextWindow,
            maxOutput: m.maxOutput,
            pricing: {
              inputPerMillion: m.inputPrice,
              outputPerMillion: m.outputPrice,
              currency: 'USD',
            },
            capabilities: {
              vision: m.supportsVision,
              tools: m.supportsTools,
              streaming: m.supportsStreaming,
              imageOutput: m.supportsImageOutput || false,
              videoOutput: m.supportsVideoOutput || false,
              audioOutput: m.supportsAudioOutput || false,
            },
            speed: m.tokensPerSecond ? {
              tokensPerSecond: m.tokensPerSecond,
            } : undefined,
            curatorNote: m.curatorNote,
          },
        })),
        meta: {
          totalModels: CURATED_MODELS.length,
          categories: {
            text: getTextModels().length,
            image: getImageModels().length,
            video: getVideoModels().length,
          },
          gateway: 'Arcanea Intelligence Gateway v1.0',
        },
      });
    }

    // Default: standard OpenAI format
    return GET(req);
  } catch {
    return GET(req);
  }
}
