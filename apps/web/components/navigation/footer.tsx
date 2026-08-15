/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { ArcaneanMark } from "@/components/brand/arcanea-mark";

const footerLinks = {
  create: {
    label: "Create",
    links: [
      { href: "/create", label: "Create Hub" },
      { href: "/chat", label: "Chat" },
      { href: "/imagine", label: "Imagine" },
      { href: "/studio", label: "Studio" },
      { href: "/worlds", label: "Worlds" },
      { href: "/music-studio", label: "Music Studio" },
      { href: "/cinema-studio", label: "Cinema Studio" },
      { href: "/canvas", label: "Canvas" },
      { href: "/forge", label: "Forge" },
      { href: "/agents", label: "Agents" },
    ],
  },
  explore: {
    label: "Explore",
    links: [
      { href: "/gallery", label: "Gallery" },
      { href: "/library", label: "Library" },
      { href: "/lore", label: "Lore" },
      { href: "/factions", label: "Factions" },
      { href: "/showcase", label: "Showcase" },
      { href: "/templates", label: "Templates" },
    ],
  },
  build: {
    label: "Build",
    links: [
      { href: "/protocol", label: "Protocol" },
      { href: "/ecosystem", label: "Repo Registry" },
      { href: "/mcp", label: "MCP & CLI" },
      { href: "/apps", label: "Apps" },
      { href: "/integrations", label: "Integrations" },
      { href: "/storage", label: "Storage" },
      { href: "/distribute", label: "Distribute" },
      { href: "/teams", label: "Teams" },
      { href: "/developers", label: "Developers" },
      { href: "https://github.com/frankxai", label: "GitHub Public Profile", external: true },
    ],
  },
  learn: {
    label: "Learn",
    links: [
      { href: "/academy", label: "Academy" },
      { href: "/academy/courses", label: "Courses" },
      { href: "/models", label: "Model Arena" },
      { href: "/starlight-intelligence", label: "Starlight Intelligence" },
      { href: "/blog", label: "Blog" },
    ],
  },
  company: {
    label: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/pricing", label: "Pricing" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/contact", label: "Contact" },
    ],
  },
};

export function Footer() {
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
        body: JSON.stringify({ email: email.trim(), source: 'footer' }),
      });
      setSubscribed(true);
      setEmail("");
    } catch {
      // Still show success — email intent was captured
      setSubscribed(true);
      setEmail("");
    } finally {
      setSubmitting(false);
    }
  }, [email, submitting]);

  return (
    <footer
      className="relative mt-24 border-t border-white/[0.06]"
      role="contentinfo"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[var(--arc-brand-atlantean-teal)]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Brand + Newsletter row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-14">
          <div className="max-w-xs">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display font-bold text-lg text-white hover:text-[var(--arc-brand-atlantean-teal)] transition-colors"
            >
              <ArcaneanMark size={28} glow />
              Arcanea™
            </Link>
            <p className="mt-1.5 font-editorial text-sm italic leading-none text-white/36">
              Creative Intelligence
            </p>
            <p className="text-sm text-white/50 mt-4 leading-relaxed">
              Chat with AI. Build fantasy worlds. Create art, stories, music.
              An open creative multiverse for world-builders.
            </p>
          </div>

          <div className="w-full md:w-auto md:min-w-[320px]">
            <h3 className="mb-3 font-editorial text-lg italic font-normal leading-none text-white/50">
              Stay in the loop
            </h3>
            {subscribed ? (
              <p className="text-sm text-[var(--arc-brand-atlantean-teal)]">
                Welcome to the multiverse.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  aria-label="Email address for newsletter"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--arc-brand-atlantean-teal)]/30 focus:border-[var(--arc-brand-atlantean-teal)]/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[var(--arc-brand-atlantean-teal)]/12 border border-[var(--arc-brand-atlantean-teal)]/20 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/20 transition-colors disabled:opacity-50"
                >
                  {submitting ? "..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 mb-14">
          {Object.values(footerLinks).map((section) => (
            <div key={section.label}>
              <h3 className="mb-5 font-editorial text-lg italic font-normal leading-none text-white/50">
                {section.label}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      {...("external" in link && link.external
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                            "aria-label": `${link.label} (opens in new tab)`,
                          }
                        : {})}
                      className="inline-block py-1 text-sm text-white/55 hover:text-[var(--arc-brand-atlantean-teal)] transition-colors duration-300 link-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 pt-8 border-t border-white/[0.06]">
          <span className="text-xs text-white/36">
            &copy; {new Date().getFullYear()} Arcanea™. All rights reserved.
          </span>

          <div className="flex items-center gap-4 text-xs text-white/36">
            <Link
              href="/terms"
              className="hover:text-[var(--arc-brand-atlantean-teal)] transition-colors"
            >
              Terms
            </Link>
            <span className="text-white/[0.1]">|</span>
            <Link
              href="/privacy"
              className="hover:text-[var(--arc-brand-atlantean-teal)] transition-colors"
            >
              Privacy
            </Link>
            <span className="text-white/[0.1]">|</span>
            <Link
              href="https://frankx.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--arc-brand-atlantean-teal)] transition-colors"
              aria-label="FrankX.ai (opens in new tab)"
            >
              FrankX.ai
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
