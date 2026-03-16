/**
 * Gateway Model Catalog — Maps arcanea-* IDs to provider + model.
 *
 * Edit this file to add new models. No API route changes needed.
 *
 * NOTE: This is the lightweight lookup used by the chat API route
 * (Vercel AI SDK path). The full CuratedModel catalog with pricing,
 * benchmarks, and metadata lives in ./models.ts (OpenAI-compatible
 * gateway path).
 */

export interface GatewayModel {
  provider: string;
  modelId: string;
  label: string;
}

export const GATEWAY_MODELS: Record<string, GatewayModel> = {
  'arcanea-opus':        { provider: 'anthropic',  modelId: 'claude-opus-4-6',           label: 'Opus 4.6' },
  'arcanea-sonnet':      { provider: 'anthropic',  modelId: 'claude-sonnet-4-6',         label: 'Sonnet 4.6' },
  'arcanea-haiku':       { provider: 'anthropic',  modelId: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5' },
  'arcanea-gpt5':        { provider: 'openai',     modelId: 'gpt-5.2-pro',               label: 'GPT-5.2 Pro' },
  'arcanea-gemini-pro':  { provider: 'google',     modelId: 'gemini-3.1-pro-preview',    label: 'Gemini 3.1 Pro' },
  'arcanea-gemini-flash':{ provider: 'google',     modelId: 'gemini-2.5-flash',          label: 'Gemini 2.5 Flash' },
  'arcanea-grok':        { provider: 'xai',        modelId: 'grok-4.20',                 label: 'Grok 4.2' },
  'arcanea-deepseek-r1': { provider: 'deepseek',   modelId: 'deepseek-reasoner',         label: 'DeepSeek R1' },
  'arcanea-deepseek':    { provider: 'deepseek',   modelId: 'deepseek-chat',             label: 'DeepSeek V3' },
  'arcanea-kimi':        { provider: 'moonshot',   modelId: 'kimi-k2.5',                 label: 'Kimi K2.5' },
  'arcanea-qwen':        { provider: 'cerebras',   modelId: 'qwen-3-235b-a22b-instruct-2507', label: 'Qwen 3' },
  'arcanea-maverick':    { provider: 'groq',       modelId: 'meta-llama/llama-4-maverick-17b-128e-instruct', label: 'Maverick' },
  'arcanea-mistral':     { provider: 'mistral',    modelId: 'mistral-large-2512',        label: 'Mistral Large' },
  'arcanea-bolt':        { provider: 'cerebras',   modelId: 'llama3.1-8b',               label: 'Bolt (2200 tok/s)' },
  'arcanea-thunder':     { provider: 'cerebras',   modelId: 'llama3.3-70b',              label: 'Thunder (450 tok/s)' },
  'arcanea-lightning':   { provider: 'groq',       modelId: 'llama-3.1-8b-instant',      label: 'Lightning (750 tok/s)' },
};

/** Extended providers — OpenAI-compatible APIs that need a custom base URL */
export const EXTENDED_PROVIDERS: Record<string, { envKeys: string[]; baseUrl: string }> = {
  xai:       { envKeys: ['XAI_API_KEY'],        baseUrl: 'https://api.x.ai/v1' },
  deepseek:  { envKeys: ['DEEPSEEK_API_KEY'],   baseUrl: 'https://api.deepseek.com/v1' },
  moonshot:  { envKeys: ['MOONSHOT_API_KEY'],    baseUrl: 'https://api.moonshot.ai/v1' },
  cerebras:  { envKeys: ['CEREBRAS_API_KEY'],    baseUrl: 'https://api.cerebras.ai/v1' },
  groq:      { envKeys: ['GROQ_API_KEY'],        baseUrl: 'https://api.groq.com/openai/v1' },
  mistral:   { envKeys: ['MISTRAL_API_KEY'],     baseUrl: 'https://api.mistral.ai/v1' },
};
