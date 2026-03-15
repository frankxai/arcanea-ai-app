/**
 * Arcanea Intelligence Gateway — Provider Adapters
 *
 * Translates between Arcanea's unified OpenAI-compatible format
 * and each provider's native API format.
 *
 * Most providers (Groq, Cerebras, SambaNova, Together, xAI, DeepSeek,
 * Mistral, OpenRouter) are already OpenAI-compatible — they just need
 * the right base URL and auth header.
 *
 * Anthropic and Google have their own formats — adapters handle translation.
 */

import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatMessage,
  GatewayConfig,
  ProviderId,
  UsageInfo,
} from './types';
import { PROVIDERS } from './models';
import {
  proxySSEStream,
  adaptAnthropicStream,
  createSSEResponse,
  sseHeaders,
  generateCompletionId,
} from './streaming';

// ─── Provider Key Resolution ─────────────────────────────────────────

/**
 * Resolve a provider API key from:
 * 1. Request headers (X-Provider-Key) — direct BYOK
 * 2. Gateway config (stored user keys)
 * 3. Environment variables (server-managed keys)
 */
export function resolveApiKey(
  provider: ProviderId,
  request: Request,
  config: GatewayConfig,
): string | null {
  // 1. Request-level override (most explicit)
  const headerKey = request.headers.get('x-provider-key');
  if (headerKey) return headerKey;

  // 2. User's stored BYOK keys
  const configKey = config.providerKeys[provider];
  if (configKey) return configKey;

  // 3. Server environment (for Arcanea-managed keys, future)
  const providerConfig = PROVIDERS[provider];
  if (providerConfig) {
    const envKey = process.env[providerConfig.envKey];
    if (envKey) return envKey;
  }

  return null;
}

// ─── OpenAI-Compatible Proxy ─────────────────────────────────────────

/**
 * Forward request to any OpenAI-compatible provider.
 * This covers: Groq, Cerebras, SambaNova, Together, xAI, DeepSeek,
 * Moonshot, Mistral, OpenRouter, and OpenAI itself.
 */
export async function proxyToOpenAICompatible(
  providerBaseUrl: string,
  headers: Record<string, string>,
  body: ChatCompletionRequest,
  arcaneaModelId: string,
  streaming: boolean,
): Promise<Response> {
  const url = `${providerBaseUrl}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ...body,
      stream: streaming,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(
      JSON.stringify({
        error: {
          message: `Provider error: ${response.status} ${response.statusText}`,
          type: 'provider_error',
          code: response.status,
          details: errorText,
        },
      }),
      {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  if (streaming) {
    // Proxy the SSE stream, replacing model IDs
    const transformedStream = proxySSEStream(response, arcaneaModelId);
    return createSSEResponse(transformedStream);
  }

  // Non-streaming: parse, transform, return
  const data = await response.json() as ChatCompletionResponse;
  data.model = arcaneaModelId;

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ─── Anthropic Adapter ───────────────────────────────────────────────

/**
 * Translate OpenAI-format request to Anthropic's Messages API format,
 * then translate the response back.
 */
export async function proxyToAnthropic(
  apiKey: string,
  body: ChatCompletionRequest,
  arcaneaModelId: string,
  streaming: boolean,
): Promise<Response> {
  // Extract system message
  let systemPrompt: string | undefined;
  const messages: Array<{ role: 'user' | 'assistant'; content: string | unknown[] }> = [];

  for (const msg of body.messages) {
    if (msg.role === 'system') {
      systemPrompt = typeof msg.content === 'string' ? msg.content : '';
      continue;
    }

    if (msg.role === 'user' || msg.role === 'assistant') {
      if (typeof msg.content === 'string') {
        messages.push({ role: msg.role, content: msg.content });
      } else if (Array.isArray(msg.content)) {
        // Convert OpenAI content parts to Anthropic format
        const parts = msg.content.map((part) => {
          if (part.type === 'text') {
            return { type: 'text', text: part.text || '' };
          }
          if (part.type === 'image_url' && part.image_url) {
            return {
              type: 'image',
              source: {
                type: 'url',
                url: part.image_url.url,
              },
            };
          }
          return { type: 'text', text: '' };
        });
        messages.push({ role: msg.role, content: parts });
      }
    }
  }

  // Build Anthropic request body
  const anthropicBody: Record<string, unknown> = {
    model: body.model,
    messages,
    max_tokens: body.max_tokens || 4096,
    stream: streaming,
  };

  if (systemPrompt) anthropicBody.system = systemPrompt;
  if (body.temperature != null) anthropicBody.temperature = body.temperature;
  if (body.top_p != null) anthropicBody.top_p = body.top_p;
  if (body.stop) anthropicBody.stop_sequences = Array.isArray(body.stop) ? body.stop : [body.stop];

  // Tools translation
  if (body.tools) {
    anthropicBody.tools = body.tools.map((t) => ({
      name: t.function.name,
      description: t.function.description,
      input_schema: t.function.parameters,
    }));
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2024-10-22',
    },
    body: JSON.stringify(anthropicBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(
      JSON.stringify({
        error: {
          message: `Anthropic error: ${response.status}`,
          type: 'provider_error',
          code: response.status,
          details: errorText,
        },
      }),
      {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  if (streaming) {
    const transformedStream = adaptAnthropicStream(response, arcaneaModelId);
    return createSSEResponse(transformedStream);
  }

  // Non-streaming: translate Anthropic response to OpenAI format
  const data = await response.json() as Record<string, unknown>;

  const content = Array.isArray(data.content)
    ? (data.content as Array<{ type: string; text?: string }>)
        .filter((c) => c.type === 'text')
        .map((c) => c.text || '')
        .join('')
    : '';

  const usage = data.usage as Record<string, number> | undefined;

  const openaiResponse: ChatCompletionResponse = {
    id: generateCompletionId(),
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: arcaneaModelId,
    choices: [{
      index: 0,
      message: {
        role: 'assistant',
        content,
      },
      finish_reason: data.stop_reason === 'end_turn' ? 'stop' : 'stop',
    }],
    usage: {
      prompt_tokens: usage?.input_tokens || 0,
      completion_tokens: usage?.output_tokens || 0,
      total_tokens: (usage?.input_tokens || 0) + (usage?.output_tokens || 0),
    },
  };

  return new Response(JSON.stringify(openaiResponse), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ─── Unified Dispatch ────────────────────────────────────────────────

/**
 * Route a request to the appropriate provider with format translation.
 */
export async function dispatchToProvider(
  provider: ProviderId,
  providerModelId: string,
  apiKey: string,
  body: ChatCompletionRequest,
  arcaneaModelId: string,
  streaming: boolean,
): Promise<Response> {
  const providerConfig = PROVIDERS[provider];
  if (!providerConfig) {
    return new Response(
      JSON.stringify({ error: { message: `Unknown provider: ${provider}`, type: 'invalid_request_error' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Override the model ID with the provider's model ID
  const requestBody = { ...body, model: providerModelId };

  // Anthropic has its own format
  if (providerConfig.format === 'anthropic') {
    return proxyToAnthropic(apiKey, requestBody, arcaneaModelId, streaming);
  }

  // All other providers are OpenAI-compatible
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (providerConfig.authHeader === 'Authorization') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    headers[providerConfig.authHeader] = apiKey;
  }

  return proxyToOpenAICompatible(
    providerConfig.baseUrl,
    headers,
    requestBody,
    arcaneaModelId,
    streaming,
  );
}
