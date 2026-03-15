/**
 * Arcanea Intelligence Gateway — Multi-Provider AI Streaming Client
 *
 * Dynamic model registry with 40+ curated models across 14+ providers.
 * OpenRouter as universal gateway (200+ models via one key).
 * Speed/Depth/Cost tier routing. Raw HTTPS streaming — zero SDK dependencies.
 *
 * Provider Tiers:
 *   SPEED:  Cerebras (2200 tok/s), Groq (750 tok/s), SambaNova (1000 tok/s)
 *   DEPTH:  Opus 4.6, GPT-5.2, Gemini 3.1 Pro, Grok 4.2, DeepSeek R1
 *   VALUE:  Gemini Flash (free tier), DeepSeek V3, Qwen 3, Mistral
 *   UNIVERSAL: OpenRouter (200+ models via one API key)
 */

import * as vscode from 'vscode';
import * as https from 'https';
import { createArcanea, buildGuardianPrompt, type RouterResult } from './intelligence';

export interface AiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface StreamChunk {
  text?: string;
  done?: boolean;
}

export interface StreamResult {
  stream: AsyncGenerator<StreamChunk>;
  router: RouterResult;
}

// ---------------------------------------------------------------------------
// Intelligence Gateway Model Catalog — 40+ curated models
// ---------------------------------------------------------------------------

export type ModelTier = 'speed' | 'balanced' | 'deep' | 'reasoning';

export interface GatewayModel {
  id: string;
  provider: string;
  modelId: string;
  label: string;
  tier: ModelTier;
  tokPerSec?: number;
  note?: string;
}

export const GATEWAY_MODELS: GatewayModel[] = [
  // ── Anthropic ────────────────────────────────────────────────────────────
  { id: 'arcanea-opus',    provider: 'anthropic', modelId: 'claude-opus-4-6',           label: 'Opus 4.6',          tier: 'deep',      note: '1M context, deepest reasoning' },
  { id: 'arcanea-sonnet',  provider: 'anthropic', modelId: 'claude-sonnet-4-6',         label: 'Sonnet 4.6',        tier: 'balanced',   note: 'Best code + creative balance' },
  { id: 'arcanea-haiku',   provider: 'anthropic', modelId: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5',         tier: 'speed',      note: 'Fast + cheap' },

  // ── OpenAI ───────────────────────────────────────────────────────────────
  { id: 'arcanea-gpt5',       provider: 'openai', modelId: 'gpt-5.2-pro',       label: 'GPT-5.2 Pro',       tier: 'deep',      note: 'Ultra reasoning' },
  { id: 'arcanea-gpt4o',      provider: 'openai', modelId: 'gpt-4o',            label: 'GPT-4o',            tier: 'balanced' },
  { id: 'arcanea-gpt4o-mini', provider: 'openai', modelId: 'gpt-4o-mini',       label: 'GPT-4o Mini',       tier: 'speed' },
  { id: 'arcanea-o3',         provider: 'openai', modelId: 'o3',                label: 'o3',                tier: 'reasoning',  note: 'Chain of thought' },

  // ── Google ───────────────────────────────────────────────────────────────
  { id: 'arcanea-gemini-pro',   provider: 'google', modelId: 'gemini-3.1-pro-preview',  label: 'Gemini 3.1 Pro',    tier: 'deep' },
  { id: 'arcanea-gemini-flash', provider: 'google', modelId: 'gemini-2.5-flash',        label: 'Gemini 2.5 Flash',  tier: 'balanced',   note: 'Free tier available' },
  { id: 'arcanea-gemini-lite',  provider: 'google', modelId: 'gemini-2.0-flash-lite',   label: 'Gemini 2.0 Lite',   tier: 'speed' },

  // ── xAI ──────────────────────────────────────────────────────────────────
  { id: 'arcanea-grok',       provider: 'xai',       modelId: 'grok-4.20',         label: 'Grok 4.2 Heavy',    tier: 'deep',       note: 'Reasoning + humor' },
  { id: 'arcanea-grok-mini',  provider: 'xai',       modelId: 'grok-3-mini',       label: 'Grok 3 Mini',       tier: 'speed' },

  // ── DeepSeek ─────────────────────────────────────────────────────────────
  { id: 'arcanea-deepseek-r1', provider: 'deepseek', modelId: 'deepseek-reasoner', label: 'DeepSeek R1',       tier: 'reasoning',  note: 'Reasoning chain' },
  { id: 'arcanea-deepseek',    provider: 'deepseek', modelId: 'deepseek-chat',     label: 'DeepSeek V3',       tier: 'balanced',   note: 'Great code, low cost' },

  // ── Moonshot ─────────────────────────────────────────────────────────────
  { id: 'arcanea-kimi',    provider: 'moonshot',  modelId: 'kimi-k2.5',         label: 'Kimi K2.5',         tier: 'balanced',   note: 'Creative writing' },

  // ── Cerebras (SPEED KING — inference hardware) ───────────────────────────
  { id: 'arcanea-qwen',       provider: 'cerebras', modelId: 'qwen-3-235b',              label: 'Qwen 3 235B',       tier: 'balanced',  tokPerSec: 200 },
  { id: 'arcanea-bolt',       provider: 'cerebras', modelId: 'llama3.1-8b',               label: 'Bolt',              tier: 'speed',     tokPerSec: 2200, note: '2200 tok/s' },
  { id: 'arcanea-thunder',    provider: 'cerebras', modelId: 'llama3.3-70b',              label: 'Thunder',           tier: 'speed',     tokPerSec: 450,  note: '450 tok/s' },

  // ── Groq (SPEED — LPU inference) ─────────────────────────────────────────
  { id: 'arcanea-maverick',   provider: 'groq', modelId: 'meta-llama/llama-4-maverick-17b-128e-instruct', label: 'Maverick',  tier: 'balanced', tokPerSec: 300 },
  { id: 'arcanea-lightning',  provider: 'groq', modelId: 'llama-3.1-8b-instant',        label: 'Lightning',         tier: 'speed',     tokPerSec: 750, note: '750 tok/s' },
  { id: 'arcanea-scout',     provider: 'groq', modelId: 'meta-llama/llama-4-scout-17b-16e-instruct', label: 'Scout',     tier: 'speed',     tokPerSec: 500 },

  // ── SambaNova (SPEED — custom silicon) ───────────────────────────────────
  { id: 'arcanea-samba-llama', provider: 'sambanova', modelId: 'Meta-Llama-3.3-70B-Instruct', label: 'SambaNova 70B', tier: 'speed', tokPerSec: 1000, note: '1000 tok/s' },
  { id: 'arcanea-samba-405b',  provider: 'sambanova', modelId: 'Meta-Llama-3.1-405B-Instruct', label: 'SambaNova 405B', tier: 'balanced', tokPerSec: 130 },
  { id: 'arcanea-samba-qwen',  provider: 'sambanova', modelId: 'Qwen2.5-72B-Instruct', label: 'SambaNova Qwen 72B', tier: 'balanced', tokPerSec: 400 },

  // ── Together ─────────────────────────────────────────────────────────────
  { id: 'arcanea-together-llama', provider: 'together', modelId: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', label: 'Together 70B Turbo', tier: 'speed', tokPerSec: 300 },
  { id: 'arcanea-together-qwen',  provider: 'together', modelId: 'Qwen/Qwen2.5-72B-Instruct-Turbo', label: 'Together Qwen 72B', tier: 'balanced' },

  // ── Fireworks ────────────────────────────────────────────────────────────
  { id: 'arcanea-fireworks-llama', provider: 'fireworks', modelId: 'accounts/fireworks/models/llama-v3p3-70b-instruct', label: 'Fireworks 70B', tier: 'speed', tokPerSec: 250 },

  // ── Mistral ──────────────────────────────────────────────────────────────
  { id: 'arcanea-mistral',       provider: 'mistral', modelId: 'mistral-large-2512',   label: 'Mistral Large',     tier: 'balanced' },
  { id: 'arcanea-codestral',     provider: 'mistral', modelId: 'codestral-2501',       label: 'Codestral',         tier: 'balanced',   note: 'Code-specialized' },

  // ── OpenRouter (UNIVERSAL — 200+ models via one key) ─────────────────────
  { id: 'arcanea-or-auto',       provider: 'openrouter', modelId: 'openrouter/auto',   label: 'OpenRouter Auto',   tier: 'balanced',   note: 'Auto-routes to best model' },
  { id: 'arcanea-or-opus',       provider: 'openrouter', modelId: 'anthropic/claude-opus-4-6', label: 'OR: Opus',  tier: 'deep' },
  { id: 'arcanea-or-sonnet',     provider: 'openrouter', modelId: 'anthropic/claude-sonnet-4-6', label: 'OR: Sonnet', tier: 'balanced' },
  { id: 'arcanea-or-gpt5',       provider: 'openrouter', modelId: 'openai/gpt-5.2-pro', label: 'OR: GPT-5.2',     tier: 'deep' },
  { id: 'arcanea-or-gemini',     provider: 'openrouter', modelId: 'google/gemini-3.1-pro', label: 'OR: Gemini Pro', tier: 'deep' },
  { id: 'arcanea-or-grok',       provider: 'openrouter', modelId: 'x-ai/grok-4',        label: 'OR: Grok 4',       tier: 'deep' },
  { id: 'arcanea-or-deepseek',   provider: 'openrouter', modelId: 'deepseek/deepseek-r1', label: 'OR: DeepSeek R1', tier: 'reasoning' },
  { id: 'arcanea-or-free',       provider: 'openrouter', modelId: 'google/gemini-2.0-flash-exp:free', label: 'OR: Free Flash', tier: 'speed', note: 'Free' },
];

// Group by tier for UI
export const MODEL_TIERS: Record<ModelTier, GatewayModel[]> = {
  speed: GATEWAY_MODELS.filter(m => m.tier === 'speed'),
  balanced: GATEWAY_MODELS.filter(m => m.tier === 'balanced'),
  deep: GATEWAY_MODELS.filter(m => m.tier === 'deep'),
  reasoning: GATEWAY_MODELS.filter(m => m.tier === 'reasoning'),
};

// ---------------------------------------------------------------------------
// Provider endpoints — all OpenAI-compatible except Google & Anthropic
// ---------------------------------------------------------------------------

const PROVIDER_ENDPOINTS: Record<string, { hostname: string; path: string; authStyle: 'bearer' | 'x-api-key' | 'query' }> = {
  anthropic:  { hostname: 'api.anthropic.com',               path: '/v1/messages',                  authStyle: 'x-api-key' },
  openai:     { hostname: 'api.openai.com',                  path: '/v1/chat/completions',          authStyle: 'bearer' },
  google:     { hostname: 'generativelanguage.googleapis.com', path: '/v1beta/models',              authStyle: 'query' },
  xai:        { hostname: 'api.x.ai',                        path: '/v1/chat/completions',          authStyle: 'bearer' },
  deepseek:   { hostname: 'api.deepseek.com',                path: '/v1/chat/completions',          authStyle: 'bearer' },
  moonshot:   { hostname: 'api.moonshot.ai',                 path: '/v1/chat/completions',          authStyle: 'bearer' },
  cerebras:   { hostname: 'api.cerebras.ai',                 path: '/v1/chat/completions',          authStyle: 'bearer' },
  groq:       { hostname: 'api.groq.com',                    path: '/openai/v1/chat/completions',   authStyle: 'bearer' },
  sambanova:  { hostname: 'api.sambanova.ai',                path: '/v1/chat/completions',          authStyle: 'bearer' },
  together:   { hostname: 'api.together.xyz',                path: '/v1/chat/completions',          authStyle: 'bearer' },
  fireworks:  { hostname: 'api.fireworks.ai',                path: '/inference/v1/chat/completions', authStyle: 'bearer' },
  mistral:    { hostname: 'api.mistral.ai',                  path: '/v1/chat/completions',          authStyle: 'bearer' },
  openrouter: { hostname: 'openrouter.ai',                   path: '/api/v1/chat/completions',      authStyle: 'bearer' },
};

// Secret storage keys per provider
const SECRET_KEYS: Record<string, string> = {
  anthropic:  'arcanea.key.anthropic',
  openai:     'arcanea.key.openai',
  google:     'arcanea.key.google',
  xai:        'arcanea.key.xai',
  deepseek:   'arcanea.key.deepseek',
  moonshot:   'arcanea.key.moonshot',
  cerebras:   'arcanea.key.cerebras',
  groq:       'arcanea.key.groq',
  sambanova:  'arcanea.key.sambanova',
  together:   'arcanea.key.together',
  fireworks:  'arcanea.key.fireworks',
  mistral:    'arcanea.key.mistral',
  openrouter: 'arcanea.key.openrouter',
};

const LEGACY_SECRET_KEY = 'arcanea.apiKey';

// ---------------------------------------------------------------------------
// AiService
// ---------------------------------------------------------------------------

export class AiService {
  constructor(private readonly context: vscode.ExtensionContext) {}

  // ── Model Selection ───────────────────────────────────────────────────────

  getSelectedModelId(): string {
    const config = vscode.workspace.getConfiguration('arcanea');
    // Custom model overrides everything (OpenRouter universal gateway)
    const custom = config.get<string>('customModel');
    if (custom) return `arcanea-or-custom:${custom}`;
    return config.get<string>('gatewayModel') || 'arcanea-gemini-flash';
  }

  getSelectedModel(): GatewayModel | undefined {
    const id = this.getSelectedModelId();
    // Custom OpenRouter model IDs
    if (id.startsWith('arcanea-or-custom:')) {
      const modelId = id.slice('arcanea-or-custom:'.length);
      return { id, provider: 'openrouter', modelId, label: modelId.split('/').pop() || modelId, tier: 'balanced' };
    }
    return GATEWAY_MODELS.find(m => m.id === id);
  }

  getProvider(): string { return this.getSelectedModel()?.provider || 'google'; }
  getModel(): string { return this.getSelectedModel()?.modelId || 'gemini-2.5-flash'; }
  getLabel(): string { return this.getSelectedModel()?.label || 'Gemini 2.5 Flash'; }
  getTier(): ModelTier { return this.getSelectedModel()?.tier || 'balanced'; }

  // ── API Key Management ────────────────────────────────────────────────────

  async setApiKey(key: string, provider?: string): Promise<void> {
    if (provider && SECRET_KEYS[provider]) {
      await this.context.secrets.store(SECRET_KEYS[provider], key);
    }
    // Always store as legacy for backward compat
    await this.context.secrets.store(LEGACY_SECRET_KEY, key);
  }

  async hasApiKey(): Promise<boolean> {
    const model = this.getSelectedModel();
    if (model && SECRET_KEYS[model.provider]) {
      const k = await this.context.secrets.get(SECRET_KEYS[model.provider]);
      if (k) return true;
    }
    return !!(await this.context.secrets.get(LEGACY_SECRET_KEY));
  }

  private async getApiKey(): Promise<string> {
    const model = this.getSelectedModel();
    if (model && SECRET_KEYS[model.provider]) {
      const k = await this.context.secrets.get(SECRET_KEYS[model.provider]);
      if (k) return k;
    }
    const legacy = await this.context.secrets.get(LEGACY_SECRET_KEY);
    if (legacy) return legacy;
    throw new Error('No API key configured. Run "Arcanea: Set API Key".');
  }

  // ── Intelligence Stream ───────────────────────────────────────────────────

  async streamWithIntelligence(messages: AiMessage[], fileContext?: string, signal?: AbortSignal): Promise<StreamResult> {
    const lastMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
    const history = messages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));
    const { systemPrompt, router } = createArcanea(lastMsg, history, fileContext);
    return { stream: this.rawStream(messages, systemPrompt, signal), router };
  }

  async *streamWithGuardian(messages: AiMessage[], guardianId: string, fileContext?: string, signal?: AbortSignal): AsyncGenerator<StreamChunk> {
    yield* this.rawStream(messages, buildGuardianPrompt(guardianId, fileContext), signal);
  }

  async *stream(messages: AiMessage[], guardianId: string, fileContext?: string, signal?: AbortSignal): AsyncGenerator<StreamChunk> {
    const autoRoute = vscode.workspace.getConfiguration('arcanea').get<boolean>('autoRoute') !== false;
    if (autoRoute) {
      const r = await this.streamWithIntelligence(messages, fileContext, signal);
      yield* r.stream;
    } else {
      yield* this.streamWithGuardian(messages, guardianId, fileContext, signal);
    }
  }

  // ── Provider Routing ──────────────────────────────────────────────────────

  private async *rawStream(messages: AiMessage[], systemPrompt: string, signal?: AbortSignal): AsyncGenerator<StreamChunk> {
    const provider = this.getProvider();
    if (provider === 'google') {
      yield* this.streamGemini(messages, systemPrompt, signal);
    } else if (provider === 'anthropic') {
      yield* this.streamClaude(messages, systemPrompt, signal);
    } else {
      // ALL others are OpenAI-compatible: openai, xai, deepseek, moonshot,
      // cerebras, groq, sambanova, together, fireworks, mistral, openrouter
      yield* this.streamOpenAICompat(messages, systemPrompt, signal);
    }
  }

  // ── Google Gemini ─────────────────────────────────────────────────────────

  private async *streamGemini(messages: AiMessage[], systemPrompt: string, signal?: AbortSignal): AsyncGenerator<StreamChunk> {
    const key = await this.getApiKey();
    const model = this.getModel();
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const body = JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
    });
    yield* this.parseSSE(
      this.httpsStream({ hostname: 'generativelanguage.googleapis.com', path: `/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${key}`, method: 'POST', headers: { 'Content-Type': 'application/json' } }, body, signal),
      (p) => p?.candidates?.[0]?.content?.parts?.[0]?.text,
    );
  }

  // ── Anthropic Claude ──────────────────────────────────────────────────────

  private async *streamClaude(messages: AiMessage[], systemPrompt: string, signal?: AbortSignal): AsyncGenerator<StreamChunk> {
    const key = await this.getApiKey();
    const body = JSON.stringify({ model: this.getModel(), max_tokens: 8192, system: systemPrompt, messages: messages.map(m => ({ role: m.role, content: m.content })), stream: true });
    yield* this.parseSSE(
      this.httpsStream({ hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' } }, body, signal),
      (p) => p?.type === 'content_block_delta' ? p.delta?.text : undefined,
    );
  }

  // ── OpenAI-Compatible (all other providers) ───────────────────────────────

  private async *streamOpenAICompat(messages: AiMessage[], systemPrompt: string, signal?: AbortSignal): AsyncGenerator<StreamChunk> {
    const key = await this.getApiKey();
    const provider = this.getProvider();
    const ep = PROVIDER_ENDPOINTS[provider] || PROVIDER_ENDPOINTS.openai;
    const allMsgs = [{ role: 'system', content: systemPrompt }, ...messages.map(m => ({ role: m.role, content: m.content }))];
    const body = JSON.stringify({ model: this.getModel(), messages: allMsgs, stream: true, max_tokens: 8192 });
    const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` };
    // OpenRouter extra headers
    if (provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://arcanea.ai';
      headers['X-Title'] = 'Arcanea Realm';
    }
    yield* this.parseSSE(
      this.httpsStream({ hostname: ep.hostname, path: ep.path, method: 'POST', headers }, body, signal),
      (p) => p?.choices?.[0]?.delta?.content,
    );
  }

  // ── SSE Parser ────────────────────────────────────────────────────────────

  private async *parseSSE(raw: AsyncGenerator<string>, extractor: (p: any) => string | undefined): AsyncGenerator<StreamChunk> {
    let buf = '';
    for await (const chunk of raw) {
      buf += chunk;
      const lines = buf.split('\n');
      buf = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const json = line.slice(6).trim();
        if (!json || json === '[DONE]') continue;
        try { const t = extractor(JSON.parse(json)); if (t) yield { text: t }; } catch {}
      }
    }
  }

  // ── HTTPS Stream ──────────────────────────────────────────────────────────

  private async *httpsStream(opts: https.RequestOptions, body: string, signal?: AbortSignal): AsyncGenerator<string> {
    const res = await new Promise<import('http').IncomingMessage>((resolve, reject) => {
      const req = https.request(opts, resolve);
      req.on('error', reject);
      if (signal) signal.addEventListener('abort', () => req.destroy());
      req.write(body);
      req.end();
    });
    if (res.statusCode && res.statusCode >= 400) {
      let err = '';
      for await (const c of res) err += c;
      throw new Error(`API ${res.statusCode}: ${err.slice(0, 300)}`);
    }
    for await (const c of res) yield c.toString();
  }
}
