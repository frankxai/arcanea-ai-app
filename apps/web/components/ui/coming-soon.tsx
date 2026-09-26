/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  showSubscribe?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  features?: string[];
}

export function ComingSoonPage({
  title,
  description,
  icon,
  showSubscribe = true,
  ctaLabel = "Back to Create",
  ctaHref = "/chat",
  features,
}: ComingSoonPageProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: `coming-soon:${title}` }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSubscribed(true);
        setEmail("");
      } else {
        setError(data.error || "We couldn't save your email. Please try again.");
      }
    } catch {
      setError("We couldn't reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [email, submitting, title]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      {icon && (
        <div className="mb-6 text-[var(--arc-brand-atlantean-teal)]/60">{icon}</div>
      )}

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/20 text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--arc-brand-atlantean-teal)] mb-6">
        Coming Soon
      </div>

      <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
        {title}
      </h1>

      <p className="text-base text-white/50 max-w-md leading-relaxed mb-8">
        {description}
      </p>

      {features && features.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-lg">
          {features.map((f) => (
            <span
              key={f}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/60"
            >
              {f}
            </span>
          ))}
        </div>
      )}

      {showSubscribe && (
        <div className="w-full max-w-sm mb-8">
          {subscribed ? (
            <p className="text-sm text-[var(--arc-brand-atlantean-teal)]">
              You are on the list. We will notify you when this launches.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                aria-label="Email address for launch notification"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--arc-brand-atlantean-teal)]/30 focus:border-[var(--arc-brand-atlantean-teal)]/30 transition-colors"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-lg bg-[var(--arc-brand-atlantean-teal)]/12 border border-[var(--arc-brand-atlantean-teal)]/20 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/20 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {submitting ? "..." : "Notify Me"}
              </button>
            </form>
          )}
          {error && !subscribed && (
            <p role="alert" className="mt-2 text-sm text-white/60">
              {error}
            </p>
          )}
        </div>
      )}

      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.1] transition-all"
      >
        &larr; {ctaLabel}
      </Link>
    </div>
  );
}
