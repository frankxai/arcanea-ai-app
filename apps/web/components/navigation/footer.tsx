"use client";

import Link from "next/link";

const footerLinks = {
  create: {
    label: "Create",
    links: [
      { href: "/studio", label: "Studio" },
      { href: "/world-builder", label: "World Builder" },
      { href: "/chat", label: "Chat" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  learn: {
    label: "Learn",
    links: [
      { href: "/library", label: "Library" },
      { href: "/academy", label: "Academy" },
      { href: "/lore", label: "Lore & Mythology" },
      { href: "/glossary", label: "Glossary" },
    ],
  },
  platform: {
    label: "Platform",
    links: [
      { href: "/luminors", label: "Luminors" },
      { href: "/pricing", label: "Pricing" },
      { href: "/developers", label: "Developers" },
      { href: "/about", label: "About" },
    ],
  },
  connect: {
    label: "Connect",
    links: [
      {
        href: "https://github.com/frankxai/arcanea",
        label: "GitHub",
        external: true,
      },
      { href: "https://discord.gg/arcanea", label: "Discord", external: true },
      { href: "/music", label: "Music" },
      { href: "https://frankx.ai", label: "FrankX.ai", external: true },
    ],
  },
};

export function Footer() {
  return (
    <footer
      className="relative mt-24 border-t border-white/[0.06]"
      role="contentinfo"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#00bcd4]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
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
                      className="text-sm text-white/62 hover:text-[#00bcd4] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/[0.06]">
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="font-display font-bold text-lg text-white hover:text-[#00bcd4] transition-colors"
            >
              Arcanea
            </Link>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/28 mt-1">
              Creative Intelligence
            </p>
          </div>

          <p className="text-xs text-white/40 font-body text-center max-w-md">
            A mythology. A library. An academy. Build your universe.
          </p>

          <div className="flex items-center gap-4 text-xs text-white/36">
            <span>&copy; {new Date().getFullYear()} Arcanea</span>
            <span className="text-white/[0.1]">|</span>
            <Link
              href="/privacy"
              className="hover:text-[#00bcd4] transition-colors"
            >
              Privacy
            </Link>
            <span className="text-white/[0.1]">|</span>
            <Link
              href="/terms"
              className="hover:text-[#00bcd4] transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
