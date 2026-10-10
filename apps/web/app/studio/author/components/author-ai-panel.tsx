"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { readProviderPreferences } from "@/lib/ai/provider-preferences";
import { validateCustomerKey } from "@/lib/gateway/credential-policy.mjs";

type ModelTier = "haiku" | "sonnet" | "opus";
interface AuthorAIPanelProps {
  bookSlug: string;
  currentChapter: string;
  getEditorText?: () => string;
  draftReady?: boolean;
}
class AuthorRecoveryError extends Error {}
const PROMPTS = [
  "Review this scene for pacing",
  "Check this dialogue against the supplied character notes",
  "Identify continuity questions in this chapter",
  "Suggest the next scene from the draft outline",
  "Show a sharper revision of one paragraph",
];
function messageText(msg: { parts?: Array<{ type: string; text?: string }> }) {
  return (
    msg.parts
      ?.filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("") || ""
  );
}
export function AuthorAIPanel({
  bookSlug,
  currentChapter,
  getEditorText,
  draftReady = true,
}: AuthorAIPanelProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef("");
  const sentRef = useRef("");
  const [model, setModel] = useState<ModelTier>("sonnet");
  const [recovery, setRecovery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/author-chat",
        headers: () => {
          try {
            const store = window.localStorage;
            const key =
              readProviderPreferences(store).keys.anthropic ||
              store.getItem("arcanea-author-api-key");
            if (!key) throw new Error();
            return { "x-anthropic-key": validateCustomerKey(key) };
          } catch {
            throw new AuthorRecoveryError(
              "Connect your Anthropic key in Settings → Providers, then retry this request.",
            );
          }
        },
        fetch: async (url, options) => {
          const response = await fetch(url, options);
          if (!response.ok) {
            await response.body?.cancel().catch(() => {});
            throw new AuthorRecoveryError(
              response.status === 401
                ? "Sign in and connect your Anthropic key in Settings → Providers, then retry. Your question is still here."
                : response.status === 429
                  ? "Too many requests. Wait a moment, then retry. Your question is still here."
                  : response.status === 400
                    ? "Use a supported model, a chapter draft of at most 32,000 characters and up to 40 text messages (64,000 characters total). Your question is still here."
                    : "Author request failed. Your chapter and question are still here; retry or check Settings → Providers.",
            );
          }
          return response;
        },
      }),
  );
  const { messages, sendMessage, status, stop, clearError } = useChat({
    transport,
    onError: (error) => {
      sendingRef.current = false;
      setRecovery(
        error instanceof AuthorRecoveryError
          ? error.message
          : "Author request failed. Your question is still here; retry.",
      );
    },
    onFinish: ({ isAbort, isError }) => {
      sendingRef.current = false;
      if (!isAbort && !isError && inputRef.current === sentRef.current) {
        inputRef.current = "";
        setInput("");
      }
    },
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(
    () => () => {
      void stop();
    },
    [stop],
  );
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);
  const submit = useCallback(() => {
    if (!draftReady || busy || sendingRef.current || !inputRef.current.trim())
      return;
    sendingRef.current = true;
    sentRef.current = inputRef.current;
    setRecovery("");
    clearError();
    void sendMessage(
      { text: sentRef.current.trim() },
      {
        body: {
          bookSlug,
          currentChapter,
          model,
          editorText: getEditorText?.(),
        },
      },
    ).catch(() => {
      sendingRef.current = false;
      setRecovery(
        "Author request failed. Your question is still here; retry or check Settings → Providers.",
      );
    });
  }, [
    clearError,
    sendMessage,
    bookSlug,
    currentChapter,
    model,
    getEditorText,
    draftReady,
    busy,
  ]);
  const control =
    "min-h-11 rounded-lg border border-white/15 px-3 text-sm text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40";
  return (
    <aside
      aria-label="Author companion"
      className="flex min-h-96 min-w-0 flex-col border-t border-white/10 lg:border-l lg:border-t-0"
    >
      <div className="border-b border-white/10 p-4">
        <h2 className="font-display text-base text-white/90">
          Author companion
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Feedback uses your current chapter draft and available curated book
          notes. Suggestions remain separate from your manuscript.
        </p>
        {!draftReady && (
          <p role="status" className="mt-2 text-sm text-white/70">
            Load your saved draft before requesting feedback.
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="text-sm text-white/70" htmlFor="author-model">
            Model
          </label>
          <select
            id="author-model"
            className={`${control} bg-[var(--arc-cosmic-void)]`}
            value={model}
            onChange={(event) => setModel(event.target.value as ModelTier)}
          >
            <option value="haiku">Haiku 4.5</option>
            <option value="sonnet">Sonnet 4.6</option>
            <option value="opus">Opus 4.6</option>
          </select>
          <Link
            href="/settings/providers"
            className={`${control} inline-flex items-center`}
          >
            Provider settings
          </Link>
        </div>
        <p className="mt-2 text-xs text-white/70">
          Uses your Anthropic key and provider billing.
        </p>
      </div>
      <div
        ref={scrollRef}
        className="max-h-[32rem] flex-1 space-y-4 overflow-y-auto p-4"
      >
        {!messages.length && (
          <div className="space-y-2">
            {PROMPTS.map((prompt) => (
              <button
                key={prompt}
                className={`${control} w-full py-2 text-left`}
                onClick={() => {
                  inputRef.current = prompt;
                  setInput(prompt);
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className="rounded-xl border border-white/10 p-3"
          >
            <p className="mb-1 text-xs text-white/70">
              {message.role === "user" ? "You" : "Companion"}
            </p>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white/80">
              {messageText(message)}
            </p>
          </div>
        ))}
        {busy && (
          <p role="status" className="text-sm text-white/70">
            Reading your supplied draft…
          </p>
        )}
      </div>
      {recovery && (
        <div
          role="alert"
          aria-label="Author feedback recovery"
          className="p-4 text-sm text-white/80"
        >
          <p>{recovery}</p>
          <Link
            className={`${control} mt-2 inline-flex items-center`}
            href="/settings/providers"
          >
            Provider settings
          </Link>
        </div>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="border-t border-white/10 p-4"
      >
        <label
          htmlFor="author-question"
          className="mb-2 block text-sm text-white/80"
        >
          Ask about this chapter
        </label>
        <textarea
          id="author-question"
          value={input}
          onChange={(event) => {
            inputRef.current = event.target.value;
            setInput(event.target.value);
          }}
          rows={3}
          className="w-full resize-y rounded-xl border border-white/15 bg-[var(--arc-cosmic-void)] p-3 text-base text-white/90 focus-visible:outline focus-visible:outline-2"
        />
        <div className="mt-2 flex gap-2">
          <button
            className={control}
            type="submit"
            disabled={!draftReady || busy || !input.trim()}
          >
            Ask companion
          </button>
          {busy && (
            <button
              className={control}
              type="button"
              onClick={() => {
                void stop();
                sendingRef.current = false;
                setRecovery(
                  "Request stopped. Your question and chapter are still here.",
                );
              }}
            >
              Stop feedback
            </button>
          )}
        </div>
      </form>
    </aside>
  );
}
