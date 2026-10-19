/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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

/**
 * True for Claude models whose API rejects non-default `temperature`,
 * `top_p` and `top_k` with a 400: Opus 4.7 / 4.8 and every Claude 5.x model
 * (including the 5.5 family the gateway routes to). Matches bare Anthropic IDs
 * and OpenRouter-style slugs such as "anthropic/claude-sonnet-5.5".
 */
export function claudeRejectsSamplingParams(modelId: string): boolean {
  return /claude-(?:opus-4[-.][78]|(?:opus|sonnet|haiku|fable|mythos)-5)(?![0-9])/.test(
    modelId,
  );
}

/** The only Messages API version Anthropic documents. */
export const ANTHROPIC_API_VERSION = "2023-06-01";

/** Beta header that gates `fallbacks: "default"` on the Messages API. */
export const CLAUDE_SERVER_FALLBACK_BETA = "server-side-fallback-2026-07-01";

/**
 * True for bare Claude API model IDs that accept server-side refusal
 * fallback (`fallbacks: "default"`). Haiku 5.5 has none; OpenRouter slugs
 * never reach the Claude API, so they never match.
 */
export function claudeSupportsServerFallback(modelId: string): boolean {
  return /^claude-(?:opus-5(?:-5)?|sonnet-5-5|fable-5-1)$/.test(modelId);
}

export const GATEWAY_MODELS: Record<string, GatewayModel> = {
  "arcanea-opus": {
    provider: "anthropic",
    modelId: "claude-opus-5-5",
    label: "Opus 5.5",
  },
  "arcanea-sonnet": {
    provider: "anthropic",
    modelId: "claude-sonnet-5-5",
    label: "Sonnet 5.5",
  },
  "arcanea-haiku": {
    provider: "anthropic",
    modelId: "claude-haiku-5-5",
    label: "Haiku 5.5",
  },
  "arcanea-gpt5": {
    provider: "openai",
    modelId: "gpt-5.2-pro",
    label: "GPT-5.2 Pro",
  },
  "arcanea-gemini-pro": {
    provider: "google",
    modelId: "gemini-3.1-pro-preview",
    label: "Gemini 3.1 Pro",
  },
  "arcanea-gemini-flash": {
    provider: "google",
    modelId: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
  },
  "arcanea-grok": { provider: "xai", modelId: "grok-4.20", label: "Grok 4.2" },
  "arcanea-deepseek-r1": {
    provider: "deepseek",
    modelId: "deepseek-reasoner",
    label: "DeepSeek R1",
  },
  "arcanea-deepseek": {
    provider: "deepseek",
    modelId: "deepseek-chat",
    label: "DeepSeek V3",
  },
  "arcanea-kimi": {
    provider: "moonshot",
    modelId: "kimi-k2.5",
    label: "Kimi K2.5",
  },
  "arcanea-qwen": {
    provider: "cerebras",
    modelId: "qwen-3-235b-a22b-instruct-2507",
    label: "Qwen 3",
  },
  "arcanea-maverick": {
    provider: "groq",
    modelId: "openai/gpt-oss-120b",
    label: "GPT OSS 120B",
  },
  "arcanea-mistral": {
    provider: "mistral",
    modelId: "mistral-large-2512",
    label: "Mistral Large",
  },
  "arcanea-bolt": {
    provider: "cerebras",
    modelId: "llama3.1-8b",
    label: "Bolt (2200 tok/s)",
  },
  "arcanea-thunder": {
    provider: "cerebras",
    modelId: "llama3.3-70b",
    label: "Thunder (450 tok/s)",
  },
  "arcanea-lightning": {
    provider: "groq",
    modelId: "openai/gpt-oss-20b",
    label: "GPT OSS 20B",
  },
};

/** Extended providers — OpenAI-compatible APIs that need a custom base URL */
export const EXTENDED_PROVIDERS: Record<
  string,
  { envKeys: string[]; baseUrl: string }
> = {
  xai: { envKeys: ["XAI_API_KEY"], baseUrl: "https://api.x.ai/v1" },
  deepseek: {
    envKeys: ["DEEPSEEK_API_KEY"],
    baseUrl: "https://api.deepseek.com/v1",
  },
  moonshot: {
    envKeys: ["MOONSHOT_API_KEY"],
    baseUrl: "https://api.moonshot.ai/v1",
  },
  cerebras: {
    envKeys: ["CEREBRAS_API_KEY"],
    baseUrl: "https://api.cerebras.ai/v1",
  },
  groq: {
    envKeys: ["GROQ_API_KEY"],
    baseUrl: "https://api.groq.com/openai/v1",
  },
  mistral: {
    envKeys: ["MISTRAL_API_KEY"],
    baseUrl: "https://api.mistral.ai/v1",
  },
};
