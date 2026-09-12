"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PhArrowLeft, PhEye, PhEyeSlash, PhKey } from "@/lib/phosphor-icons";
import {
  parseProviderKeys,
  readProviderPreferences,
  saveProviderPreferences,
  type ProviderKeys,
} from "@/lib/ai/provider-preferences";

const PROVIDERS = [
  {
    id: "google",
    name: "Google Gemini",
    url: "https://ai.google.dev/gemini-api/docs/api-key",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    url: "https://console.anthropic.com/settings/keys",
  },
  { id: "openai", name: "OpenAI", url: "https://platform.openai.com/api-keys" },
  { id: "openrouter", name: "OpenRouter", url: "https://openrouter.ai/keys" },
  { id: "xai", name: "xAI Grok", url: "https://console.x.ai" },
  {
    id: "deepseek",
    name: "DeepSeek",
    url: "https://platform.deepseek.com/api_keys",
  },
  { id: "groq", name: "Groq", url: "https://console.groq.com/keys" },
  {
    id: "cerebras",
    name: "Cerebras",
    url: "https://cloud.cerebras.ai/platform",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    url: "https://console.mistral.ai/api-keys",
  },
  { id: "moonshot", name: "Moonshot", url: "https://platform.moonshot.ai" },
];
const SEARCH_PROVIDERS = [
  { id: "tavily", name: "Tavily", url: "https://tavily.com" },
  { id: "brave", name: "Brave Search", url: "https://brave.com/search/api/" },
];
const control =
  "min-h-11 rounded-xl border border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-deep)] px-4 py-3 text-sm text-[var(--arc-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]";

export default function ProvidersPage() {
  const [keys, setKeys] = useState<ProviderKeys>({});
  const [activeId, setActiveId] = useState("google");
  const [savedState, setSavedState] = useState("");
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const preferences = readProviderPreferences(localStorage);
      setKeys(preferences.keys);
      setActiveId(preferences.activeId);
      setSavedState(JSON.stringify(preferences));
    } catch {
      setError(
        "This browser is blocking site storage. Allow storage to save a provider.",
      );
    }
    setReady(true);
  }, []);

  const selected =
    PROVIDERS.find((provider) => provider.id === activeId) || PROVIDERS[0];
  const current = JSON.stringify({
    keys: parseProviderKeys(JSON.stringify(keys)),
    activeId,
  });
  const dirty = current !== savedState;
  const savedKey = !dirty && Boolean(keys[activeId]?.trim());

  function reloadSavedSettings() {
    try {
      const preferences = readProviderPreferences(localStorage);
      setKeys(preferences.keys);
      setActiveId(preferences.activeId);
      setSavedState(JSON.stringify(preferences));
      setVisible({});
      setError("");
      setMessage("Loaded the settings saved in this browser.");
    } catch {
      setError(
        "Your browser is blocking site storage. Allow storage and try again.",
      );
    }
  }

  useEffect(() => {
    function sync(event: StorageEvent) {
      if (
        event.key &&
        ![
          "arcanea-provider-keys",
          "arcanea-active-provider",
          "arcanea-active-model",
        ].includes(event.key)
      )
        return;
      if (dirty) {
        setError(
          "Settings changed in another tab. Reload saved settings before saving.",
        );
        setMessage("");
      } else reloadSavedSettings();
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [dirty]);

  function changeKey(id: string, value: string) {
    setKeys((previous) => ({ ...previous, [id]: value }));
    setMessage("");
  }
  function save() {
    setError("");
    try {
      saveProviderPreferences(
        localStorage,
        keys,
        activeId,
        savedState || undefined,
      );
      const preferences = readProviderPreferences(localStorage);
      setKeys(preferences.keys);
      setSavedState(JSON.stringify(preferences));
      window.dispatchEvent(new Event("arcanea-model-change"));
      setMessage(
        "Saved in this browser. Provider access has not been verified.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Settings could not be saved. Try again.",
      );
    }
  }

  function keyField(provider: (typeof PROVIDERS)[number]) {
    const id = `provider-key-${provider.id}`;
    return (
      <div className="space-y-3" key={provider.id}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor={id} className="text-sm font-medium">
            {provider.name} API key
          </label>
          <a
            href={provider.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--arc-brand-atlantean-teal)] underline-offset-4 hover:underline"
          >
            Get a key
            <span className="sr-only">
              {" "}
              from {provider.name} (opens in a new tab)
            </span>
          </a>
        </div>
        <div className="flex gap-2">
          <input
            id={id}
            name={id}
            type={visible[provider.id] ? "text" : "password"}
            value={keys[provider.id] || ""}
            onChange={(event) => changeKey(provider.id, event.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Paste your API key"
            aria-describedby="provider-data-flow"
            disabled={!ready}
            className={`${control} min-w-0 flex-1 font-mono`}
          />
          <button
            type="button"
            disabled={!ready || !keys[provider.id]}
            aria-label={`${visible[provider.id] ? "Hide" : "Show"} ${provider.name} key`}
            aria-pressed={Boolean(visible[provider.id])}
            onClick={() =>
              setVisible((previous) => ({
                ...previous,
                [provider.id]: !previous[provider.id],
              }))
            }
            className={`${control} shrink-0 disabled:opacity-50`}
          >
            {visible[provider.id] ? (
              <PhEyeSlash className="size-4" aria-hidden="true" />
            ) : (
              <PhEye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {keys[provider.id] && (
          <button
            type="button"
            onClick={() => changeKey(provider.id, "")}
            className="min-h-11 text-sm text-[var(--arc-text-secondary)] underline underline-offset-4"
          >
            Remove {provider.name} key on save
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] px-5 pb-20 pt-24 text-[var(--arc-text-primary)] sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/settings"
          className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--arc-text-secondary)] hover:text-[var(--arc-text-primary)]"
        >
          <PhArrowLeft className="size-4" aria-hidden="true" />
          Settings
        </Link>
        <div className="mb-8">
          <PhKey
            className="mb-4 size-7 text-[var(--arc-brand-atlantean-teal)]"
            aria-hidden="true"
          />
          <h1 className="text-3xl font-semibold tracking-tight">
            Your AI connection
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[var(--arc-text-secondary)]">
            Choose a provider for chat. Bring your own key and pay that provider
            for your usage.
          </p>
        </div>
        <div
          id="provider-data-flow"
          className="mb-8 border-l-2 border-[var(--arc-brand-atlantean-teal)] pl-4 text-sm leading-relaxed text-[var(--arc-text-secondary)]"
        >
          <p>
            Saving keeps keys in this browser. When you send a request,
            Arcanea’s server receives your key and content and forwards them to
            the selected provider.
          </p>
          <p className="mt-2">
            Keys are not encrypted in browser storage. Use a personal device and
            remove keys before sharing it. Your provider’s data and billing
            terms apply.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="active-provider"
              className="block text-sm font-medium"
            >
              Chat provider
            </label>
            <select
              id="active-provider"
              value={activeId}
              disabled={!ready}
              onChange={(event) => {
                setActiveId(event.target.value);
                setMessage("");
                setVisible({});
              }}
              className={`${control} w-full`}
            >
              {PROVIDERS.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                  {keys[provider.id]?.trim() ? " · key entered" : ""}
                </option>
              ))}
            </select>
            <p className="text-sm text-[var(--arc-text-secondary)]">
              Saving makes this your default. You can choose a model from the
              same provider in chat.
            </p>
          </div>
          {keyField(selected)}
          <p className="text-sm text-[var(--arc-text-secondary)]">
            {!ready
              ? "Loading saved settings…"
              : dirty
                ? "Unsaved changes"
                : savedKey
                  ? "Key saved locally · access not verified"
                  : "No key saved for this provider"}
          </p>

          <details className="border-y border-[var(--arc-cosmic-border-bright)] py-4">
            <summary className="min-h-11 cursor-pointer py-2 text-sm font-medium">
              Optional web search
            </summary>
            <p className="mb-5 text-sm leading-relaxed text-[var(--arc-text-secondary)]">
              Search is separate from your chat provider. When enabled, search
              queries pass through Arcanea to the search service. If both keys
              are saved, Tavily takes priority.
            </p>
            <div className="space-y-6">{SEARCH_PROVIDERS.map(keyField)}</div>
          </details>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={!ready || !dirty}
              className="min-h-11 rounded-xl bg-[var(--arc-brand-atlantean-teal)] px-5 py-3 text-sm font-semibold text-[var(--arc-cosmic-void)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save connection
            </button>
            {savedKey && (
              <Link href="/chat" className={`${control} text-center`}>
                Open chat
              </Link>
            )}
          </div>
          <div
            aria-live="polite"
            role="status"
            className="text-sm text-[var(--arc-text-secondary)]"
          >
            {message}
          </div>
          {error && (
            <p role="alert" className="text-sm text-[var(--arc-text-primary)]">
              {error}
            </p>
          )}
          {error.includes("another tab") && (
            <button
              type="button"
              onClick={reloadSavedSettings}
              className={control}
            >
              Reload saved settings
            </button>
          )}
        </form>
        <p className="mt-6 text-sm leading-relaxed text-[var(--arc-text-secondary)]">
          Saving does not make an AI request. Sending a message may incur
          provider charges. A saved key is checked when you use it; saving alone
          does not confirm model access or available credit.
        </p>
        <p className="mt-6 text-sm text-[var(--arc-text-secondary)]">
          Prefer your existing tools?{" "}
          <Link
            href="/mcp"
            className="text-[var(--arc-brand-atlantean-teal)] underline underline-offset-4"
          >
            Explore Arcanea’s MCP tools
          </Link>
        </p>
      </div>
    </div>
  );
}
