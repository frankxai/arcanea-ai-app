/**
 * Arcanea AI SDK Provider
 *
 * Implements ProviderV3 for the Vercel AI SDK.
 * Since Arcanea Gateway exposes an OpenAI-compatible API,
 * we leverage @ai-sdk/openai-compatible for the heavy lifting.
 *
 * This means the entire provider is essentially configuration —
 * no custom streaming/parsing logic needed.
 */

import {
  createOpenAICompatible,
  type OpenAICompatibleProviderSettings,
} from '@ai-sdk/openai-compatible';
import type { ArcaneaModelId } from './arcanea-models';

// ─── Provider Settings ───────────────────────────────────────────────

export interface ArcaneaProviderSettings {
  /**
   * Base URL of the Arcanea Gateway.
   * @default 'https://arcanea.ai/api/v1'
   */
  baseURL?: string;

  /**
   * Arcanea API key (arc_xxx) or a provider-specific key.
   * Falls back to ARCANEA_API_KEY environment variable.
   */
  apiKey?: string;

  /**
   * Additional headers (e.g., BYOK provider keys).
   *
   * @example
   * ```typescript
   * headers: {
   *   'X-Anthropic-Key': 'sk-ant-xxx',
   *   'X-Groq-Key': 'gsk_xxx',
   *   'X-Cerebras-Key': 'csk_xxx',
   * }
   * ```
   */
  headers?: Record<string, string>;

  /**
   * Enable smart routing (auto model selection).
   * When true, model "arcanea-auto" uses AI to pick the best model.
   * @default true
   */
  smartRouting?: boolean;
}

// ─── Provider Type ───────────────────────────────────────────────────

export interface ArcaneaProvider {
  /**
   * Create an Arcanea language model.
   *
   * @param modelId - Arcanea model ID (e.g., 'arcanea-opus', 'arcanea-auto')
   * @returns A LanguageModelV3 instance
   *
   * @example
   * ```typescript
   * const model = arcanea('arcanea-sonnet');
   * const { text } = await generateText({ model, prompt: 'Hello' });
   * ```
   */
  (modelId: ArcaneaModelId): ReturnType<ReturnType<typeof createOpenAICompatible>>;

  /**
   * Create an Arcanea language model (explicit method).
   */
  languageModel(modelId: ArcaneaModelId): ReturnType<ReturnType<typeof createOpenAICompatible>>;

  /**
   * Create an Arcanea chat model (alias for languageModel).
   */
  chat(modelId: ArcaneaModelId): ReturnType<ReturnType<typeof createOpenAICompatible>>;
}

// ─── Provider Factory ────────────────────────────────────────────────

/**
 * Create an Arcanea provider instance.
 *
 * @param options - Provider configuration
 * @returns An Arcanea provider that can be used with the AI SDK
 *
 * @example Default (uses ARCANEA_API_KEY env var)
 * ```typescript
 * import { createArcanea } from '@arcanea/ai-provider';
 * const arcanea = createArcanea();
 * ```
 *
 * @example Custom configuration with BYOK
 * ```typescript
 * const arcanea = createArcanea({
 *   baseURL: 'https://arcanea.ai/api/v1',
 *   headers: {
 *     'X-Anthropic-Key': process.env.ANTHROPIC_API_KEY,
 *     'X-Groq-Key': process.env.GROQ_API_KEY,
 *   },
 * });
 * ```
 *
 * @example Self-hosted gateway
 * ```typescript
 * const arcanea = createArcanea({
 *   baseURL: 'http://localhost:3001/api/v1',
 * });
 * ```
 */
export function createArcanea(
  options: ArcaneaProviderSettings = {},
): ArcaneaProvider {
  const baseURL = options.baseURL || process.env.ARCANEA_BASE_URL || 'https://arcanea.ai/api/v1';
  const apiKey = options.apiKey || process.env.ARCANEA_API_KEY || 'arcanea-byok';

  // Build the OpenAI-compatible provider
  const provider = createOpenAICompatible({
    name: 'arcanea',
    baseURL,
    apiKey,
    headers: {
      'X-Arcanea-SDK': '@arcanea/ai-provider@0.1.0',
      ...options.headers,
    },
  });

  // Wrap the provider to expose our interface
  const arcaneaProvider = function (modelId: ArcaneaModelId) {
    return provider(modelId);
  } as ArcaneaProvider;

  arcaneaProvider.languageModel = (modelId: ArcaneaModelId) => provider(modelId);
  arcaneaProvider.chat = (modelId: ArcaneaModelId) => provider.chatModel(modelId);

  return arcaneaProvider;
}

// ─── Default Instance ────────────────────────────────────────────────

/**
 * Default Arcanea provider instance.
 * Uses ARCANEA_API_KEY and ARCANEA_BASE_URL environment variables.
 *
 * @example
 * ```typescript
 * import { arcanea } from '@arcanea/ai-provider';
 * import { generateText } from 'ai';
 *
 * const { text } = await generateText({
 *   model: arcanea('arcanea-opus'),
 *   prompt: 'What is the nature of creativity?',
 * });
 * ```
 */
export const arcanea = createArcanea();
