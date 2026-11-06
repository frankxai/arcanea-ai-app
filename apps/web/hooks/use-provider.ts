/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getModelKey,
  readProviderPreferences,
  providerStorageNames,
  type ProviderActor,
} from "@/lib/ai/provider-preferences";
import { GATEWAY_MODELS } from "@/lib/gateway/catalog";
import { useAuth } from "@/lib/auth/context";

const PROVIDER_LABELS: Record<string, string> = {
  openrouter: "OpenRouter",
  google: "Google Gemini",
  anthropic: "Anthropic Claude",
  openai: "OpenAI",
  xai: "xAI Grok",
  deepseek: "DeepSeek",
  groq: "Groq",
  cerebras: "Cerebras",
  mistral: "Mistral AI",
  moonshot: "Moonshot",
};

const AUTO_PROVIDER_FALLBACK_ORDER = [
  "openrouter",
  "google",
  "anthropic",
  "openai",
  "groq",
  "cerebras",
  "xai",
  "deepseek",
  "mistral",
  "moonshot",
] as const;

// Gateway model ID → provider mapping for the chat API, derived from canonical GATEWAY_MODELS
export const MODEL_PROVIDERS: Record<string, string> = {
  "arcanea-auto": "gateway",
  ...Object.fromEntries(
    Object.entries(GATEWAY_MODELS).map(([id, meta]) => [id, meta.provider]),
  ),
};

export const MODEL_LABELS: Record<string, string> = {
  "arcanea-auto": "Auto",
  ...Object.fromEntries(
    Object.entries(GATEWAY_MODELS).map(([id, meta]) => [id, meta.label]),
  ),
  "arcanea-opus": "Claude Opus 4.6",
  "arcanea-sonnet": "Claude Sonnet 4.6",
  "arcanea-gemini-pro": "Gemini 3.1 Pro",
  "arcanea-gpt5": "GPT-5",
  "arcanea-deepseek-r1": "DeepSeek R1",
  "arcanea-grok": "Grok 4.2",
  "arcanea-gemini-flash": "Gemini Flash",
  "arcanea-haiku": "Haiku",
  "arcanea-deepseek": "DeepSeek V3",
  "arcanea-kimi": "Kimi K2.5",
  "arcanea-qwen": "Qwen 3",
  "arcanea-maverick": "Llama 4",
  "arcanea-mistral": "Mistral Large",
  "arcanea-bolt": "Bolt",
  "arcanea-thunder": "Thunder",
  "arcanea-lightning": "Lightning",
};

/**
 * Resolves the effective provider and API key for Auto / legacy mode.
 * Uses the preferred active provider when it has a key (or OpenRouter fallback),
 * and otherwise falls back to the first provider the user actually configured.
 */
export function resolveAutoProvider(
  keys: Record<string, string>,
  preferredProvider: string,
): { provider: string; clientApiKey: string | undefined } {
  const directKey = getModelKey(keys, preferredProvider);
  if (directKey) {
    return { provider: preferredProvider, clientApiKey: directKey };
  }
  for (const candidate of AUTO_PROVIDER_FALLBACK_ORDER) {
    const candidateKey = keys[candidate]?.trim();
    if (candidateKey) {
      return { provider: candidate, clientApiKey: candidateKey };
    }
  }
  return { provider: preferredProvider, clientApiKey: undefined };
}

/**
 * Checks whether a Gateway model ID has a configured BYOK key in the given key map.
 */
export function isGatewayModelConfigured(
  modelId: string,
  keys: Record<string, string>,
  activeProvider = "google",
): boolean {
  if (!modelId || modelId === "arcanea-auto") {
    return Boolean(resolveAutoProvider(keys, activeProvider).clientApiKey);
  }
  const provider = MODEL_PROVIDERS[modelId];
  if (!provider) return false;
  return Boolean(getModelKey(keys, provider));
}

export interface ProviderState {
  /** Legacy provider ID or 'gateway' for Gateway models */
  provider: string;
  /** Gateway model ID (e.g. 'arcanea-opus') — null for legacy mode */
  modelId: string | null;
  clientApiKey: string | undefined;
  label: string;
  /** Whether using Gateway model selection vs legacy provider mode */
  isGateway: boolean;
  /** Provider IDs that currently have a non-empty key saved for this actor */
  configuredProviders?: string[];
  /** Current actor's provider key map for readiness checks */
  keys?: Record<string, string>;
}

/**
 * Reads the active AI model/provider and client-side API keys from localStorage.
 * Supports both legacy provider mode (google/anthropic/openai/openrouter)
 * and Gateway model mode (arcanea-opus, arcanea-auto, etc.).
 */
export function readProviderFromStorage(actor: ProviderActor): ProviderState {
  const fallback: ProviderState = {
    provider: "google",
    modelId: null,
    clientApiKey: undefined,
    label: PROVIDER_LABELS.google,
    isGateway: false,
    configuredProviders: [],
    keys: {},
  };
  if (typeof window === "undefined" || !actor) return fallback;
  try {
    const names = providerStorageNames(actor)!;
    const modelId = localStorage.getItem(names.model);
    const { keys, activeId: provider } = readProviderPreferences(
      localStorage,
      actor,
    );
    const configuredProviders = Object.entries(keys)
      .filter(
        ([, value]) => typeof value === "string" && value.trim().length > 0,
      )
      .map(([id]) => id);

    if (modelId && MODEL_PROVIDERS[modelId]) {
      if (modelId === "arcanea-auto") {
        const resolved = resolveAutoProvider(keys, provider);
        return {
          provider: resolved.provider,
          modelId,
          clientApiKey: resolved.clientApiKey,
          label: MODEL_LABELS[modelId] || "Auto",
          isGateway: true,
          configuredProviders,
          keys,
        };
      }
      const modelProvider = MODEL_PROVIDERS[modelId];
      const clientApiKey = getModelKey(keys, modelProvider);
      const label = MODEL_LABELS[modelId] || modelId;
      return {
        provider: modelProvider,
        modelId,
        clientApiKey,
        label,
        isGateway: true,
        configuredProviders,
        keys,
      };
    } else {
      const resolved = resolveAutoProvider(keys, provider);
      const label =
        PROVIDER_LABELS[resolved.provider] || PROVIDER_LABELS.google;
      return {
        provider: resolved.provider,
        modelId: null,
        clientApiKey: resolved.clientApiKey,
        label,
        isGateway: false,
        configuredProviders,
        keys,
      };
    }
  } catch {
    return fallback;
  }
}

export function useProvider(): ProviderState {
  const { credentialScope } = useAuth();
  const token = credentialScope.get();
  const [snapshot, setSnapshot] = useState(() => ({
    token,
    state: readProviderFromStorage(token.actor),
  }));

  // Re-sync on storage events (e.g. settings page changes keys)
  useEffect(() => {
    function onStorage() {
      const current = credentialScope.get();
      setSnapshot({
        token: current,
        state: readProviderFromStorage(current.actor),
      });
    }
    onStorage();
    window.addEventListener("storage", onStorage);
    window.addEventListener("arcanea-model-change", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("arcanea-model-change", onStorage);
    };
  }, [credentialScope, token]);

  return snapshot.token === token
    ? snapshot.state
    : readProviderFromStorage(null);
}

/**
 * Set the active Gateway model (persists to localStorage).
 */
export function setActiveModel(modelId: string, actor: ProviderActor) {
  if (typeof window === "undefined") return false;
  const names = providerStorageNames(actor);
  if (!names) return false;
  try {
    localStorage.setItem(names.model, modelId);
  } catch {
    toast.error(
      "Your browser could not save the model. Allow site storage and try again.",
    );
    return false;
  }
  // Dispatch a storage event so other components can react
  window.dispatchEvent(new Event("arcanea-model-change"));
  return true;
}

/**
 * Hook for model selection with setter.
 */
export function useModelSelection() {
  const { credentialScope } = useAuth();
  const token = credentialScope.get();
  const providerState = useProvider();
  const setModelId = useCallback(
    (id: string) => {
      if (credentialScope.isCurrent(token)) setActiveModel(id, token.actor);
    },
    [credentialScope, token],
  );

  return {
    ...providerState,
    modelId: providerState.modelId || "arcanea-auto",
    setModelId,
  };
}
