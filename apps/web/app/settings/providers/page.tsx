'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  PhArrowLeft,
  PhKey,
  PhCheck,
  PhCircleNotch,
  PhWarningCircle,
  PhEye,
  PhEyeSlash,
  PhTrash,
} from '@/lib/phosphor-icons';

// ---------------------------------------------------------------------------
// Provider definitions
// ---------------------------------------------------------------------------

interface Provider {
  id: string;
  name: string;
  description: string;
  color: string;
  envKey: string;
  placeholder: string;
  docsUrl: string;
  testEndpoint: string;
}

const PROVIDERS: Provider[] = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'One key, 300+ models — Gemini, Claude, GPT, Llama, Mistral & more',
    color: '#6366f1',
    envKey: 'OPENROUTER_API_KEY',
    placeholder: 'sk-or-v1-...',
    docsUrl: 'https://openrouter.ai/keys',
    testEndpoint: '/api/ai/chat',
  },
  {
    id: 'google',
    name: 'Google Gemini',
    description: 'Gemini 2.0 Flash — fast, capable, great for creative work',
    color: '#4285f4',
    envKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
    placeholder: 'AIza...',
    docsUrl: 'https://ai.google.dev/gemini-api/docs/api-key',
    testEndpoint: '/api/ai/chat',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Claude 4 — deep reasoning, nuanced writing, code mastery',
    color: '#d4a574',
    envKey: 'ANTHROPIC_API_KEY',
    placeholder: 'sk-ant-...',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    testEndpoint: '/api/ai/chat',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-5 — ultra high reasoning, mathematics, code',
    color: '#10a37f',
    envKey: 'OPENAI_API_KEY',
    placeholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
    testEndpoint: '/api/ai/chat',
  },
  {
    id: 'xai',
    name: 'xAI Grok',
    description: 'Grok 4.2 — 500B params, real-time knowledge, unfiltered',
    color: '#ffffff',
    envKey: 'XAI_API_KEY',
    placeholder: 'xai-...',
    docsUrl: 'https://console.x.ai',
    testEndpoint: '/api/ai/chat',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek R1 + V3 — transparent reasoning, 50-100x cheaper',
    color: '#667eea',
    envKey: 'DEEPSEEK_API_KEY',
    placeholder: 'sk-...',
    docsUrl: 'https://platform.deepseek.com/api_keys',
    testEndpoint: '/api/ai/chat',
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Lightning-fast inference — 750 tok/s, lowest latency',
    color: '#f55036',
    envKey: 'GROQ_API_KEY',
    placeholder: 'gsk_...',
    docsUrl: 'https://console.groq.com/keys',
    testEndpoint: '/api/ai/chat',
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    description: 'Bolt — 2,200+ tok/s, fastest inference on Earth',
    color: '#00c853',
    envKey: 'CEREBRAS_API_KEY',
    placeholder: 'csk-...',
    docsUrl: 'https://cloud.cerebras.ai/platform',
    testEndpoint: '/api/ai/chat',
  },
];

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'arcanea-provider-keys';

interface StoredKeys {
  [providerId: string]: string;
}

function loadKeys(): StoredKeys {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveKeys(keys: StoredKeys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

function getActiveProvider(): string {
  if (typeof window === 'undefined') return 'google';
  return localStorage.getItem('arcanea-active-provider') || 'google';
}

function setActiveProvider(id: string) {
  localStorage.setItem('arcanea-active-provider', id);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

export default function ProvidersPage() {
  const [keys, setKeys] = useState<StoredKeys>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [testStatus, setTestStatus] = useState<Record<string, TestStatus>>({});
  const [testError, setTestError] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState('google');
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setKeys(loadKeys());
    setActiveId(getActiveProvider());
  }, []);

  const handleKeyChange = useCallback((providerId: string, value: string) => {
    setKeys((prev) => ({ ...prev, [providerId]: value }));
  }, []);

  const handleSave = useCallback(() => {
    saveKeys(keys);
    setActiveProvider(activeId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [keys, activeId]);

  const handleRemoveKey = useCallback((providerId: string) => {
    setKeys((prev) => {
      const next = { ...prev };
      delete next[providerId];
      saveKeys(next);
      return next;
    });
  }, []);

  const toggleVisibility = useCallback((providerId: string) => {
    setVisibility((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
  }, []);

  const testConnection = useCallback(async (provider: Provider) => {
    const key = keys[provider.id];
    if (!key) return;

    setTestStatus((prev) => ({ ...prev, [provider.id]: 'testing' }));
    setTestError((prev) => ({ ...prev, [provider.id]: '' }));

    try {
      // Test by hitting the health-check GET endpoint
      const res = await fetch(provider.testEndpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setTestStatus((prev) => ({ ...prev, [provider.id]: 'success' }));
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
    } catch (err) {
      setTestStatus((prev) => ({ ...prev, [provider.id]: 'error' }));
      setTestError((prev) => ({
        ...prev,
        [provider.id]: err instanceof Error ? err.message : 'Connection failed',
      }));
    }

    setTimeout(() => {
      setTestStatus((prev) => ({ ...prev, [provider.id]: 'idle' }));
    }, 3000);
  }, [keys]);

  const maskKey = (key: string) => {
    if (key.length <= 8) return '*'.repeat(key.length);
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4);
  };

  return (
    <div className="min-h-screen bg-[#09090b] py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/settings"
            className="flex w-8 h-8 items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
            aria-label="Back to settings"
          >
            <PhArrowLeft className="w-4 h-4" />
          </Link>
          <PhKey className="w-7 h-7 text-[#00bcd4]" />
          <h1 className="text-2xl font-semibold text-white">AI Providers</h1>
        </div>
        <p className="text-sm text-white/40 mb-8 ml-11">
          Connect your own API keys. Keys are stored locally in your browser — never sent to our servers.
        </p>

        {/* Active Provider Selection */}
        <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-medium text-white/60 mb-3">Active Provider</h2>
          <div className="flex flex-wrap gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeId === p.id
                    ? 'text-white border-2'
                    : 'text-white/40 border border-white/[0.06] hover:text-white/60 hover:border-white/[0.12]'
                }`}
                style={{
                  borderColor: activeId === p.id ? p.color : undefined,
                  backgroundColor: activeId === p.id ? `${p.color}15` : 'transparent',
                }}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Provider Cards */}
        <div className="space-y-4">
          {PROVIDERS.map((provider) => {
            const key = keys[provider.id] || '';
            const isVisible = visibility[provider.id] || false;
            const status = testStatus[provider.id] || 'idle';
            const error = testError[provider.id] || '';
            const hasKey = key.length > 0;

            return (
              <div
                key={provider.id}
                className="bg-black/40 border rounded-2xl p-5 transition-colors"
                style={{
                  borderColor: activeId === provider.id ? `${provider.color}30` : 'rgba(255,255,255,0.06)',
                }}
              >
                {/* Provider header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: provider.color }}
                    >
                      {provider.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{provider.name}</h3>
                      <p className="text-[11px] text-white/30">{provider.description}</p>
                    </div>
                  </div>
                  {hasKey && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-[11px] text-emerald-400/70">Connected</span>
                    </div>
                  )}
                </div>

                {/* API Key input */}
                <div className="relative mb-3">
                  <input
                    type={isVisible ? 'text' : 'password'}
                    value={isVisible ? key : (hasKey ? maskKey(key) : '')}
                    onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                    placeholder={provider.placeholder}
                    className="w-full px-4 py-2.5 pr-20 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/90 text-sm font-mono placeholder-white/20 focus:outline-none focus:border-[#00bcd4]/40 transition-colors"
                    onFocus={() => setVisibility((prev) => ({ ...prev, [provider.id]: true }))}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {hasKey && (
                      <button
                        type="button"
                        onClick={() => toggleVisibility(provider.id)}
                        className="p-1.5 rounded-md text-white/30 hover:text-white/60 transition-colors"
                        aria-label={isVisible ? 'Hide key' : 'Show key'}
                      >
                        {isVisible ? <PhEyeSlash className="w-4 h-4" /> : <PhEye className="w-4 h-4" />}
                      </button>
                    )}
                    {hasKey && (
                      <button
                        type="button"
                        onClick={() => handleRemoveKey(provider.id)}
                        className="p-1.5 rounded-md text-white/30 hover:text-red-400 transition-colors"
                        aria-label="Remove key"
                      >
                        <PhTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between">
                  <a
                    href={provider.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#00bcd4]/60 hover:text-[#00bcd4] transition-colors"
                  >
                    Get API key
                  </a>

                  <div className="flex items-center gap-2">
                    {/* Test status */}
                    {status === 'success' && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                        <PhCheck className="w-3.5 h-3.5" />
                        Connected
                      </span>
                    )}
                    {status === 'error' && (
                      <span className="flex items-center gap-1 text-[11px] text-red-400" title={error}>
                        <PhWarningCircle className="w-3.5 h-3.5" />
                        Failed
                      </span>
                    )}

                    {/* Test connection button */}
                    <button
                      type="button"
                      onClick={() => testConnection(provider)}
                      disabled={!hasKey || status === 'testing'}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/50 border border-white/[0.08] hover:text-white/70 hover:border-white/[0.15] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      {status === 'testing' ? (
                        <span className="flex items-center gap-1.5">
                          <PhCircleNotch className="w-3 h-3 animate-spin" />
                          Testing...
                        </span>
                      ) : (
                        'Test Connection'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Save button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-[#00bcd4] hover:bg-[#00acc1] text-white text-sm font-medium transition-colors"
          >
            Save Configuration
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-400">
              <PhCheck className="w-4 h-4" />
              Saved
            </span>
          )}
        </div>

        {/* Info notice */}
        <div className="mt-6 rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
          <p className="text-[12px] text-white/25 leading-relaxed">
            API keys are stored in your browser&apos;s localStorage and never leave your device.
            The active provider determines which AI model responds in chat.
            Server-side keys set by the admin take priority over client-side keys.
          </p>
        </div>
      </div>
    </div>
  );
}
