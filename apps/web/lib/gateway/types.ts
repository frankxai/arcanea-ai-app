/**
 * Arcanea Intelligence Gateway — Type Definitions
 *
 * OpenAI-compatible API types for the curated AI gateway.
 * BYOK (Bring Your Own Key) architecture — users provide their own provider keys.
 */

// ─── Provider Registry ───────────────────────────────────────────────

export type ProviderId =
  | 'anthropic'
  | 'openai'
  | 'google'
  | 'xai'
  | 'groq'
  | 'cerebras'
  | 'sambanova'
  | 'replicate'
  | 'together'
  | 'deepseek'
  | 'moonshot'
  | 'mistral'
  | 'openrouter';

export interface ProviderConfig {
  id: ProviderId;
  name: string;
  baseUrl: string;
  authHeader: string;
  envKey: string;
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsVision: boolean;
  format: 'openai' | 'anthropic' | 'google';
}

// ─── Model Catalog ───────────────────────────────────────────────────

export type ModelCategory =
  | 'reasoning'
  | 'creative'
  | 'fast'
  | 'code'
  | 'vision'
  | 'image-gen'
  | 'video-gen'
  | 'audio'
  | 'embedding';

export type ModelTier = 'frontier' | 'performance' | 'speed' | 'free';

export interface CuratedModel {
  id: string;                      // Arcanea model ID (e.g., 'arcanea-opus')
  name: string;                    // Display name
  description: string;             // What it's best at
  provider: ProviderId;            // Backend provider
  providerModelId: string;         // Provider's model ID
  category: ModelCategory[];       // What it excels at
  tier: ModelTier;                 // Pricing/quality tier
  contextWindow: number;           // Max context tokens
  maxOutput: number;               // Max output tokens
  inputPrice: number;              // Per million input tokens (USD)
  outputPrice: number;             // Per million output tokens (USD)
  tokensPerSecond?: number;        // Output speed
  supportsVision: boolean;
  supportsTools: boolean;
  supportsStreaming: boolean;
  supportsImageOutput?: boolean;
  supportsVideoOutput?: boolean;
  supportsAudioOutput?: boolean;
  releaseDate?: string;            // When this model was released
  curatorNote: string;             // Why Arcanea selected this model
}

// ─── OpenAI-Compatible Request/Response ──────────────────────────────

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stop?: string | string[];
  tools?: Tool[];
  tool_choice?: 'auto' | 'none' | 'required' | { type: 'function'; function: { name: string } };
  response_format?: { type: 'text' | 'json_object' | 'json_schema'; json_schema?: unknown };
  seed?: number;
  user?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | ContentPart[];
  name?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface ContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string; detail?: 'auto' | 'low' | 'high' };
}

export interface Tool {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage: UsageInfo;
  system_fingerprint?: string;
}

export interface ChatCompletionChoice {
  index: number;
  message: {
    role: 'assistant';
    content: string | null;
    tool_calls?: ToolCall[];
  };
  finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter';
}

export interface UsageInfo {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// ─── Streaming ───────────────────────────────────────────────────────

export interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: StreamChoice[];
  usage?: UsageInfo;
}

export interface StreamChoice {
  index: number;
  delta: {
    role?: 'assistant';
    content?: string;
    tool_calls?: Partial<ToolCall>[];
  };
  finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | null;
}

// ─── Gateway Config ──────────────────────────────────────────────────

export interface GatewayConfig {
  /** Provider API keys (BYOK) — stored per-user */
  providerKeys: Partial<Record<ProviderId, string>>;
  /** Default provider to use when model doesn't specify */
  defaultProvider?: ProviderId;
  /** Enable smart routing (auto-select best model) */
  smartRouting?: boolean;
  /** Fallback chain order */
  fallbackProviders?: ProviderId[];
  /** Cache settings */
  cache?: {
    enabled: boolean;
    ttlSeconds: number;
    semanticEnabled: boolean;
  };
}

// ─── Models List Response ────────────────────────────────────────────

export interface ModelsListResponse {
  object: 'list';
  data: ModelObject[];
}

export interface ModelObject {
  id: string;
  object: 'model';
  created: number;
  owned_by: string;
  permission?: unknown[];
}

// ─── Image Generation ────────────────────────────────────────────────

export interface ImageGenerationRequest {
  model: string;
  prompt: string;
  n?: number;
  size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
  style?: 'natural' | 'vivid';
  response_format?: 'url' | 'b64_json';
}

export interface ImageGenerationResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
}
