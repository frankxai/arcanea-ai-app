"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { submitWaitlist } from "@/lib/waitlist/submit";
import {
  CANON_SOURCE_URL,
  READER_CLIENTS,
  READER_HEALTH_URL,
  READER_LIMITS,
  READER_TOOLS,
  READER_URL,
} from "@/lib/mcp/reader-catalog";

export function McpCommandCenter() {
  const emailId = useId();
  const statusId = `${emailId}-status`;
  const inputRef = useRef<HTMLInputElement>(null);
  const pending = useRef(false);
  const copyAttempt = useRef(0);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  async function copy(label: string, value: string) {
    const attempt = ++copyAttempt.current;
    setCopyStatus("");
    try {
      await navigator.clipboard.writeText(value);
      if (attempt === copyAttempt.current) setCopyStatus(`${label}: copied.`);
    } catch {
      if (attempt === copyAttempt.current)
        setCopyStatus(
          "Copy failed. Select and copy the visible address or configuration.",
        );
    }
  }

  async function join(event: FormEvent) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setStatus("saving");
    setError("");
    setInvalidEmail(false);
    const result = await submitWaitlist(email, "mcp_reader");
    pending.current = false;
    if (result.success) {
      setStatus("done");
    } else {
      setStatus("error");
      setError(result.error);
      setInvalidEmail(result.invalidEmail === true);
      if (result.invalidEmail) inputRef.current?.focus();
    }
  }

  return (
    <section className="relative overflow-hidden bg-[var(--arc-cosmic-void)] px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 px-4 py-2 text-sm text-[var(--arc-brand-atlantean-teal)]">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--arc-brand-atlantean-teal)]"
              aria-hidden="true"
            />
            Remote reader. No package or provider key.
          </p>
          <h1 className="mb-4 font-display text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
            Arcanea reader
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/55">
            Point Claude, Codex, or Cursor at one HTTPS address. The first call
            can fail a draft that invents an eleventh gate.
          </p>
        </header>

        <div className="mb-10 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <p className="mb-2 text-sm text-white/45">Reader address</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="flex-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm text-[var(--arc-brand-atlantean-teal)]">
              {READER_URL}
            </code>
            <button
              type="button"
              aria-label="Copy reader address"
              onClick={() => copy("Reader address", READER_URL)}
              className="focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)] rounded-xl border border-white/15 px-4 py-3 text-sm text-white/80 hover:bg-white/[0.04]"
            >
              Copy address
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/40">
            Health check:{" "}
            <a
              className="underline decoration-white/20 underline-offset-4"
              href={READER_HEALTH_URL}
            >
              /health
            </a>
            . Check current reader availability and scope there.
          </p>
        </div>

        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="mb-4 min-h-6 text-sm text-white/70"
        >
          {copyStatus}
        </p>

        <h2 className="mb-4 font-display text-2xl font-semibold text-white/90">
          Connect your client
        </h2>
        <div className="mb-12 grid gap-4 md:grid-cols-2">
          {READER_CLIENTS.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-white/90">
                  {item.name}
                </h3>
                <button
                  type="button"
                  aria-label={item.copyLabel}
                  onClick={() => copy(item.name, item.body)}
                  className="focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)] text-xs text-white/50 hover:text-white/80"
                >
                  Copy
                </button>
              </div>
              <p className="mb-3 text-xs text-white/35">{item.location}</p>
              <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed text-white/70">
                {item.body}
              </pre>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {item.note}
              </p>
              <a
                href={item.guide}
                className="mt-3 inline-block text-sm text-[var(--arc-brand-atlantean-teal)] underline underline-offset-4"
              >
                {item.name} setup guide
              </a>
            </article>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="mb-4 font-display text-2xl font-semibold text-white/90">
            Reader tools
          </h2>
          <ul className="grid gap-3">
            {READER_TOOLS.map((tool) => (
              <li
                key={tool.name}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-4"
              >
                <code className="text-sm text-[var(--arc-brand-atlantean-teal)]">
                  {tool.name}
                </code>
                <p className="mt-1 text-sm leading-relaxed text-white/50">
                  {tool.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-12 rounded-2xl border border-[var(--arc-brand-arcanean-gold)]/20 bg-[var(--arc-brand-arcanean-gold)]/5 p-6">
          <h2 className="mb-2 font-display text-xl font-semibold text-white/90">
            Coverage and canon source
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-white/55">
            {READER_LIMITS}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/55">
            Canon and lore live in the public app repository. The lore refusal
            on this endpoint does not change where canon is published. Studio
            access and content reuse terms remain separate decisions.
          </p>
          <a
            href={CANON_SOURCE_URL}
            className="mt-3 inline-block text-sm text-[var(--arc-brand-atlantean-teal)] underline underline-offset-4"
          >
            Read the canonical source
          </a>
        </div>

        <form
          onSubmit={join}
          aria-label="Studio waitlist"
          aria-busy={status === "saving"}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"
        >
          <h2 className="mb-2 font-display text-xl font-semibold text-white/90">
            Studio waitlist
          </h2>
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-white/50">
            Leave an email for Studio availability updates. The waitlist does
            not grant Studio access or reserve a price. No payment is collected
            here.
          </p>
          {status === "done" ? null : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor={emailId}>
                Email
              </label>
              <input
                id={emailId}
                ref={inputRef}
                name="email"
                maxLength={320}
                readOnly={status === "saving"}
                aria-describedby={statusId}
                aria-invalid={invalidEmail || undefined}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  if (pending.current) return;
                  setEmail(event.target.value);
                  setStatus("idle");
                  setError("");
                  setInvalidEmail(false);
                }}
                placeholder="you@studio.com"
                className="focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)] min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              />
              <button
                type="submit"
                disabled={status === "saving"}
                className="focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)] rounded-xl bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-60"
              >
                {status === "saving" ? "Saving" : "Join the list"}
              </button>
            </div>
          )}
          <p
            id={statusId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mt-3 min-h-6 text-sm text-white/70"
          >
            {status === "saving"
              ? "Saving your email…"
              : status === "error"
                ? error
                : status === "done"
                  ? "Your email is saved on the Studio list."
                  : ""}
          </p>
        </form>
      </div>
    </section>
  );
}
