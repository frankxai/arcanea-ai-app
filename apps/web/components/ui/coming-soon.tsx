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

  const handleSubscribe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: `coming-soon:${title}` }),
      });
    } catch {
      // Still show success
    } finally {
      setSubscribed(true);
      setEmail("");
      setSubmitting(false);
    }
  }, [email, submitting, title]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      {icon && (
        <div className="mb-6 text-[#00bcd4]/60">{icon}</div>
      )}

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#00bcd4] mb-6">
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
            <p className="text-sm text-[#00bcd4]">
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
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 focus:border-[#00bcd4]/30 transition-colors"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-lg bg-[#00bcd4]/12 border border-[#00bcd4]/20 text-sm font-medium text-[#00bcd4] hover:bg-[#00bcd4]/20 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {submitting ? "..." : "Notify Me"}
              </button>
            </form>
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
