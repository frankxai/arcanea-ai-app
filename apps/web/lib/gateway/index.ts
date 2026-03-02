/**
 * Arcanea Intelligence Gateway
 *
 * Curated AI model gateway with intelligent routing.
 * BYOK (Bring Your Own Key) architecture.
 *
 * Usage:
 *   POST /api/v1/chat/completions  — OpenAI-compatible chat
 *   GET  /api/v1/models            — Curated model catalog
 */

export { CURATED_MODELS, PROVIDERS, getModelById, getModelsByCategory, getTextModels, getImageModels, getVideoModels, resolveProviderModel } from './models';
export { classifyTask, selectModel, routeRequest } from './router';
export { dispatchToProvider, resolveApiKey, proxyToOpenAICompatible, proxyToAnthropic } from './providers';
export {
  createSSEResponse,
  proxySSEStream,
  adaptAnthropicStream,
  generateCompletionId,
  formatSSEChunk,
  formatSSEDone,
  sseHeaders,
} from './streaming';
export type {
  CuratedModel,
  ProviderId,
  ProviderConfig,
  GatewayConfig,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatMessage,
  ModelsListResponse,
  ModelObject,
} from './types';
