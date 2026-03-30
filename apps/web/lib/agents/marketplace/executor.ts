/**
 * Agent Execution Pipeline — Arcanea Agents Marketplace
 *
 * Builds the system prompt from a MarketplaceAgent spec + user context,
 * selects a model via the same gateway routing used in the chat API,
 * and returns a ReadableStream of the AI response.
 *
 * Follows the provider resolution pattern from apps/web/app/api/ai/chat/route.ts
 * exactly — no new dependencies, no new infrastructure.
 */

import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { GATEWAY_MODELS, EXTENDED_PROVIDERS } from '@/lib/gateway/catalog';
import type { MarketplaceAgent } from './types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExecuteAgentParams {
  agent: MarketplaceAgent;
  input: string;
  userId: string;
  userContext?: {
    name?: string;
    rank?: string;
    element?: string;
    gatesOpen?: number;
  };
}

// ---------------------------------------------------------------------------
// Model resolution (mirrors chat/route.ts gateway logic)
// ---------------------------------------------------------------------------

const PROVIDERS: Record<string, { envKeys: string[]; defaultModel: string }> = {
  google: {
    envKeys: ['GOOGLE_GENERATIVE_AI_API_KEY', 'GEMINI_API_KEY'],
    defaultModel: 'gemini-2.0-flash',
  },
  anthropic: {
    envKeys: ['ANTHROPIC_API_KEY'],
    defaultModel: 'claude-sonnet-4-20250514',
  },
  openai: {
    envKeys: ['OPENAI_API_KEY'],
    defaultModel: 'gpt-4o',
  },
};

function resolveEnvKey(envKeys: string[]): string | undefined {
  for (const key of envKeys) {
    if (process.env[key]) return process.env[key];
  }
  return undefined;
}

/**
 * Resolves and creates the AI model instance from a gateway model ID.
 * Falls back through the auto-priority list if the preferred model
 * has no available API key.
 */
function resolveModel(preferredGatewayId?: string) {
  const AUTO_PRIORITY = [
    'arcanea-gemini-flash',
    'arcanea-sonnet',
    'arcanea-gpt5',
    'arcanea-haiku',
    'arcanea-deepseek',
    'arcanea-bolt',
    'arcanea-lightning',
  ];

  const candidates = preferredGatewayId
    ? [preferredGatewayId, ...AUTO_PRIORITY.filter((id) => id !== preferredGatewayId)]
    : AUTO_PRIORITY;

  for (const gwId of candidates) {
    const gw = GATEWAY_MODELS[gwId];
    if (!gw) continue;

    const provider = gw.provider;
    const stdProvider = PROVIDERS[provider];
    const extProvider = EXTENDED_PROVIDERS[provider];

    const apiKey = stdProvider
      ? resolveEnvKey(stdProvider.envKeys)
      : extProvider
        ? resolveEnvKey(extProvider.envKeys)
        : undefined;

    if (!apiKey) continue;

    // Create model instance based on provider type
    if (provider === 'google') {
      const google = createGoogleGenerativeAI({ apiKey });
      return { model: google(gw.modelId), label: gw.label };
    }

    if (provider === 'anthropic') {
      const anthropic = createAnthropic({ apiKey });
      return { model: anthropic(gw.modelId), label: gw.label };
    }

    if (provider === 'openai') {
      const openai = createOpenAI({ apiKey });
      return { model: openai(gw.modelId), label: gw.label };
    }

    if (extProvider) {
      const openaiCompat = createOpenAI({ apiKey, baseURL: extProvider.baseUrl });
      return { model: openaiCompat(gw.modelId), label: gw.label };
    }
  }

  throw new Error(
    'No API key available for any configured provider. ' +
      'Set at least one of: ANTHROPIC_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, OPENAI_API_KEY.'
  );
}

// ---------------------------------------------------------------------------
// System prompt builder
// ---------------------------------------------------------------------------

function buildSystemPrompt(agent: MarketplaceAgent, userContext?: ExecuteAgentParams['userContext']): string {
  let prompt = agent.spec.systemPrompt;

  // Inject user context block when available
  if (userContext && (userContext.name || userContext.rank || userContext.element)) {
    const contextLines: string[] = ['[CREATOR CONTEXT]'];

    if (userContext.name) contextLines.push(`Creator: ${userContext.name}`);
    if (userContext.rank) {
      const gatesNote = userContext.gatesOpen !== undefined ? ` (${userContext.gatesOpen}/10 Gates open)` : '';
      contextLines.push(`Rank: ${userContext.rank}${gatesNote}`);
    }
    if (userContext.element) contextLines.push(`Element affinity: ${userContext.element}`);

    contextLines.push(
      'Adapt depth and vocabulary to this creator\'s level.',
      '[/CREATOR CONTEXT]',
      ''
    );

    prompt = contextLines.join('\n') + prompt;
  }

  return prompt;
}

// ---------------------------------------------------------------------------
// Main executor
// ---------------------------------------------------------------------------

/**
 * Executes a marketplace agent and returns a ReadableStream of the AI output.
 *
 * The caller is responsible for:
 * - Auth verification
 * - Credit balance check (use consumeCredits from ./credits.ts)
 * - Saving the task record to agent_tasks in Supabase
 *
 * This function only handles model selection and streaming.
 */
export async function executeAgent(params: ExecuteAgentParams): Promise<Response> {
  const { agent, input, userContext } = params;

  const { model, label } = resolveModel(agent.spec.preferredModel);
  const systemPrompt = buildSystemPrompt(agent, userContext);
  const temperature = agent.spec.temperature ?? 0.7;

  const result = streamText({
    model,
    system: systemPrompt,
    messages: [{ role: 'user', content: input }],
    temperature,
    maxOutputTokens: 8192,
  });

  return result.toTextStreamResponse({
    headers: {
      'x-arcanea-agent': agent.id,
      'x-arcanea-model': label,
    },
  });
}

/**
 * Non-streaming variant — awaits the full response and returns the text.
 * Useful for background tasks and server-side processing.
 */
export async function executeAgentSync(params: ExecuteAgentParams): Promise<string> {
  const { agent, input, userContext } = params;

  const { model } = resolveModel(agent.spec.preferredModel);
  const systemPrompt = buildSystemPrompt(agent, userContext);
  const temperature = agent.spec.temperature ?? 0.7;

  const result = streamText({
    model,
    system: systemPrompt,
    messages: [{ role: 'user', content: input }],
    temperature,
    maxOutputTokens: 8192,
  });

  return result.text;
}
