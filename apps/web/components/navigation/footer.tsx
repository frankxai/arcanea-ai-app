"use client";

import Link from "next/link";
import { useState } from "react";
import { ArcaneanMark } from "@/components/brand/arcanea-mark";

const footerLinks = {
  create: {
    label: "Create",
    links: [
      { href: "/chat", label: "Chat" },
      { href: "/imagine", label: "Imagine" },
      { href: "/studio", label: "Studio" },
      { href: "/agents", label: "Agents" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  explore: {
    label: "Explore",
    links: [
      { href: "/library", label: "Library" },
      { href: "/lore", label: "Lore" },
      { href: "/lore/guardians", label: "Guardians" },
      { href: "/factions", label: "Factions" },
      { href: "/discover", label: "Discover" },
    ],
  },
  learn: {
    label: "Learn",
    links: [
      { href: "/academy", label: "Academy" },
      { href: "/academy/courses", label: "Courses" },
      { href: "/models", label: "Model Arena" },
      { href: "/developers", label: "Developers" },
      { href: "https://github.com/frankxai", label: "GitHub", external: true },
    ],
  },
  company: {
    label: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/pricing", label: "Pricing" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/contact", label: "Contact" },
    ],
  },
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer
      className="relative mt-24 border-t border-white/[0.06]"
      role="contentinfo"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#00bcd4]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Brand + Newsletter row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-14">
          <div className="max-w-xs">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display font-bold text-lg text-white hover:text-[#00bcd4] transition-colors"
            >
              <ArcaneanMark size={28} glow />
              Arcanea
            </Link>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/28 mt-1.5">
              Creative Intelligence
            </p>
            <p className="text-sm text-white/50 mt-4 leading-relaxed">
              Chat with AI. Build fantasy worlds. Create art, stories, music.
              An open creative multiverse for world-builders.
            </p>
          </div>

          <div className="w-full md:w-auto md:min-w-[320px]">
            <h3 className="text-xs uppercase tracking-[0.22em] font-semibold text-white/36 mb-3">
              Stay in the loop
            </h3>
            {subscribed ? (
              <p className="text-sm text-[#00bcd4]">
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
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 focus:border-[#00bcd4]/30 transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00bcd4]/12 border border-[#00bcd4]/20 text-sm font-medium text-[#00bcd4] hover:bg-[#00bcd4]/20 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-14">
          {Object.values(footerLinks).map((section) => (
            <div key={section.label}>
              <h3 className="text-xs uppercase tracking-[0.22em] font-semibold text-white/36 mb-5">
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
                      className="text-sm text-white/55 hover:text-[#00bcd4] transition-colors duration-300 link-underline"
                    >
                      {link.label}
                      {"external" in link && link.external && (
                        <span className="inline-block ml-1 text-[10px] text-white/25" aria-hidden="true">&nearr;</span>
                      )}
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
            &copy; {new Date().getFullYear()} Arcanea. All rights reserved.
          </span>

          <div className="flex items-center gap-4 text-xs text-white/36">
            <Link
              href="/terms"
              className="hover:text-[#00bcd4] transition-colors"
            >
              Terms
            </Link>
            <span className="text-white/[0.1]">|</span>
            <Link
              href="/privacy"
              className="hover:text-[#00bcd4] transition-colors"
            >
              Privacy
            </Link>
            <span className="text-white/[0.1]">|</span>
            <Link
              href="https://frankx.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00bcd4] transition-colors"
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
