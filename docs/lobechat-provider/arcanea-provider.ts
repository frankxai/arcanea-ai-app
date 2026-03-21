/**
 * Arcanea model-bank provider card definition.
 *
 * This file goes in: packages/model-bank/src/modelProviders/arcanea.ts
 * It defines how Arcanea appears in the LobeChat provider settings UI.
 *
 * @see https://arcanea.ai/docs/api
 */

import type { ModelProviderCard } from '@/types/llm';

// ref: https://arcanea.ai/docs/api
// ref: https://arcanea.ai/docs/models
const Arcanea: ModelProviderCard = {
  chatModels: [],
  checkModel: 'arcanea-auto',
  description:
    'Arcanea is a curated AI gateway — 25 hand-picked models from 13 providers through one OpenAI-compatible endpoint. Each model is #1 at something specific. Smart routing, semantic caching, and BYOK pricing.',
  id: 'arcanea',
  modelList: { showModelFetcher: true },
  modelsUrl: 'https://arcanea.ai/docs/models',
  name: 'Arcanea',
  settings: {
    proxyUrl: {
      placeholder: 'https://arcanea.ai/api/v1',
    },
    sdkType: 'openai',
    showModelFetcher: true,
  },
  url: 'https://arcanea.ai',
};

export default Arcanea;
