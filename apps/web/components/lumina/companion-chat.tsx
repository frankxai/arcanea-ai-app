"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@arcanea/design-system/companion.module.css";
import { useProvider } from "@/hooks/use-provider";
import {
  getErrorMessage,
  type ChatErrorMessage,
} from "@/lib/chat/error-message";

const starters = [
  "Help me shape a character.",
  "Find the conflict in my scene.",
  "Give my world one surprising rule.",
];
function textOf(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function CompanionChat({ open }: { open: boolean }) {
  const provider = useProvider();
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/ai/chat" }),
    [],
  );
  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    transport,
  });
  const [draft, setDraft] = useState("");
  const [problem, setProblem] = useState<ChatErrorMessage | null>(null);
  const [stopped, setStopped] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const sending = useRef(false);
  const busy = status === "submitted" || status === "streaming";
  const recovery = problem ?? (error ? getErrorMessage(error) : null);

  useEffect(
    () => () => {
      void stop();
    },
    [stop],
  );
  useEffect(() => {
    if (open) input.current?.focus();
    else void stop();
  }, [open, stop]);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, status]);

  async function send() {
    const text = draft.trim();
    if (!text || busy || sending.current) return;
    if (!provider.clientApiKey?.trim()) {
      setProblem(getErrorMessage("Connect your provider key"));
      return;
    }
    sending.current = true;
    clearError();
    setProblem(null);
    setStopped(false);
    setDraft("");
    try {
      await sendMessage(
        { text },
        {
          body: {
            provider: provider.provider,
            clientApiKey: provider.clientApiKey,
            gatewayModel: provider.modelId ?? undefined,
          },
        },
      );
    } catch {
      // SDK errors normally arrive through `error`; retain safe recovery for thrown failures too.
      setProblem(getErrorMessage("Response interrupted"));
    } finally {
      sending.current = false;
    }
  }
  function stopResponse() {
    setStopped(true);
    void stop();
    input.current?.focus();
  }
  function recoverPrompt() {
    const last = [...messages]
      .reverse()
      .find((message) => message.role === "user");
    if (last) setDraft(textOf(last));
    clearError();
    setProblem(null);
    input.current?.focus();
  }

  return (
    <div className={styles.chat}>
      <div className={styles.provider}>
        <span>{provider.label} · Your provider key</span>
        <Link href="/settings/providers">Provider settings</Link>
      </div>
      <div
        ref={log}
        className={styles.messages}
        role="log"
        aria-label="Companion messages"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {messages.length === 0 && (
          <div className={styles.empty}>
            <p>What are you creating?</p>
            <p>
              Bring a sentence or a question. Your provider bills replies
              directly.
            </p>
            {starters.map((starter) => (
              <button
                type="button"
                key={starter}
                onClick={() => {
                  setDraft(starter);
                  input.current?.focus();
                }}
              >
                {starter}
              </button>
            ))}
          </div>
        )}
        {messages.map((message) => {
          const text = textOf(message);
          return text ? (
            <article
              key={message.id}
              className={
                message.role === "user" ? styles.user : styles.assistant
              }
            >
              <span className={styles.speaker}>
                {message.role === "user" ? "You" : "Arcanea"}
              </span>
              <p>{text}</p>
            </article>
          ) : null;
        })}
        {status === "submitted" && (
          <p role="status">Waiting for your provider…</p>
        )}
      </div>
      {recovery && (
        <div className={styles.recovery} role="alert">
          <strong>{recovery.title}</strong>
          <p>{recovery.action}</p>
          <div>
            <Link href="/settings/providers">Open provider settings</Link>
            {!draft.trim() &&
              messages.some((message) => message.role === "user") && (
                <button type="button" onClick={recoverPrompt}>
                  Edit last message
                </button>
              )}
          </div>
        </div>
      )}
      {stopped && (
        <p className={styles.notice} role="status">
          Response stopped. Your provider may charge for work already started.
        </p>
      )}
      <form
        className={styles.composer}
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <label htmlFor="companion-prompt">Your message</label>
        <textarea
          id="companion-prompt"
          ref={input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          maxLength={4000}
          placeholder="Ask about your next creation…"
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              void send();
            }
          }}
        />
        <div className={styles.actions}>
          <span>Enter to send · Shift + Enter for a new line</span>
          {busy ? (
            <button type="button" onClick={stopResponse}>
              Stop response
            </button>
          ) : (
            <button
              className={styles.send}
              type="submit"
              disabled={!draft.trim()}
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
