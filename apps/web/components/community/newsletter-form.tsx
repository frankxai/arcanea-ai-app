"use client";

import { type FormEvent, useState } from "react";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          program: "arcanea-newsletter",
          source: "community_footer",
          referrer: document.referrer || undefined,
          page_path: window.location.pathname + window.location.search,
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
      } | null;

      if (!response.ok || result?.success !== true) {
        throw new Error(result?.error ?? "Subscription could not be saved.");
      }

      form.reset();
      setStatus("success");
      setMessage("Subscription saved.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Subscription could not be saved.",
      );
    }
  }

  return (
    <form
      aria-label="Newsletter signup"
      aria-describedby={message ? "newsletter-status" : undefined}
      className="max-w-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Your email address"
          required
          disabled={status === "submitting"}
          className="flex-1 px-4 py-3 rounded-xl liquid-glass border border-white/[0.06] bg-white/[0.04] text-text-primary placeholder-text-muted font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/40 transition-colors disabled:opacity-60"
          aria-required="true"
          aria-invalid={status === "error"}
        />
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="newsletter-company">Company</label>
          <input
            id="newsletter-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm shadow-glow-brand hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(13,71,161,0.45)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/70 focus:ring-offset-2 focus:ring-offset-cosmic-void disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Saving…" : "Subscribe"}
        </button>
      </div>
      {message ? (
        <p
          id="newsletter-status"
          role={status === "error" ? "alert" : "status"}
          aria-live="polite"
          className="mt-3 text-sm text-text-muted"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
