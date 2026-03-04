/**
 * Arcanea Intelligence Gateway — LobeChat Provider Integration
 *
 * Arcanea is a curated AI gateway offering 25 hand-picked models from 13 providers
 * through a single OpenAI-compatible endpoint. Each model is #1 at something specific.
 *
 * Base URL: https://arcanea.ai/api/v1
 * Auth: Bearer token (BYOK — user provides their own provider key)
 * Docs: https://arcanea.ai/docs/api
 *
 * @see https://github.com/lobehub/lobe-chat
 * @see packages/model-runtime/src/providers/arcanea/index.ts
 */

import type { ChatModelCard } from '@lobechat/types';
import { ModelProvider } from 'model-bank';

import type { OpenAICompatibleFactoryOptions } from '../../core/openaiCompatibleFactory';
import { createOpenAICompatibleRuntime } from '../../core/openaiCompatibleFactory';

export interface ArcaneaModelCard {
  context_length?: number;
  description?: string;
  id: string;
  max_output?: number;
  name?: string;
  pricing?: {
    completion?: string;
    prompt?: string;
  };
  supported_modalities?: {
    input?: string[];
    output?: string[];
  };
  supported_parameters?: string[];
}

export const params = {
  baseURL: 'https://arcanea.ai/api/v1',
  constructorOptions: {
    defaultHeaders: {
      'HTTP-Referer': 'https://lobehub.com',
      'X-Title': 'LobeHub',
    },
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_ARCANEA_CHAT_COMPLETION === '1',
  },
  models: async ({ client }) => {
    const { LOBE_DEFAULT_MODEL_LIST } = await import('model-bank');

    const visionKeywords = [
      'vision',
      'gemini',
      'gpt-4o',
      'gpt-5',
      'opus',
      'sonnet',
    ];

    const reasoningKeywords = [
      'deepseek',
      'thinker',
      'o1',
      'o3',
      'o4-mini',
      'gemini-2.5',
      'gemini-3',
      'gpt-5',
    ];

    const functionCallKeywords = [
      'opus',
      'sonnet',
      'gpt-4o',
      'gpt-5',
      'gemini',
      'llama-3',
      'llama-4',
      'command',
      'qwen',
      'deepseek-v3',
    ];

    let modelList: ArcaneaModelCard[] = [];

    try {
      const response = await fetch('https://arcanea.ai/api/v1/models');
      if (response.ok) {
        const data = await response.json();
        modelList = data['data'] || [];
      }
    } catch (error) {
      console.error('Failed to fetch Arcanea models:', error);
      return [];
    }

    if (modelList.length === 0) {
      return [];
    }

    return modelList
      .map((model) => {
        const knownModel = LOBE_DEFAULT_MODEL_LIST.find(
          (m) => model.id.toLowerCase() === m.id.toLowerCase(),
        );

        const inputModalities = model.supported_modalities?.input || [];
        const outputModalities = model.supported_modalities?.output || [];
        const supportedParams = model.supported_parameters || [];

        const hasVision =
          inputModalities.includes('image') ||
          visionKeywords.some((kw) => model.id.toLowerCase().includes(kw)) ||
          knownModel?.abilities?.vision ||
          false;

        const hasReasoning =
          supportedParams.includes('reasoning') ||
          reasoningKeywords.some((kw) => model.id.toLowerCase().includes(kw)) ||
          knownModel?.abilities?.reasoning ||
          false;

        const hasFunctionCall =
          supportedParams.includes('tools') ||
          functionCallKeywords.some((kw) => model.id.toLowerCase().includes(kw)) ||
          knownModel?.abilities?.functionCall ||
          false;

        const hasImageOutput =
          outputModalities.includes('image') ||
          model.id.includes('flux') ||
          model.id.includes('create');

        const displayName = model.name || model.id;

        return {
          contextWindowTokens: model.context_length || knownModel?.contextWindowTokens,
          description: model.description,
          displayName,
          enabled: knownModel?.enabled || false,
          functionCall: hasFunctionCall,
          id: model.id,
          ...(hasImageOutput && { abilities: { imageOutput: true } }),
          maxOutput: model.max_output || undefined,
          reasoning: hasReasoning,
          vision: hasVision,
        };
      })
      .filter(Boolean) as ChatModelCard[];
  },
  provider: ModelProvider.Arcanea ?? 'arcanea',
} satisfies OpenAICompatibleFactoryOptions;

export const LobeArcaneaAI = createOpenAICompatibleRuntime(params);
