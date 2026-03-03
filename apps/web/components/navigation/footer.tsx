'use client';

import Link from "next/link";
import Image from "next/image";
import {
  PhGithubLogo,
  PhChatCircleDots,
  PhBookOpen,
  PhCrown,
  PhPalette,
  PhCompass,
  PhUsers,
  PhMusicNotes,
  PhGlobe,
} from '@/lib/phosphor-icons';
import navLogo from "@/assets/brand/arcanea-mark.jpg";

const footerLinks = {
  create: {
    label: "Create",
    links: [
      { href: "/chat", label: "Chat", icon: PhChatCircleDots },
      { href: "/studio", label: "Studio", icon: PhPalette },
      { href: "/academy", label: "Academy", icon: PhCrown },
      { href: "/academy/gate-quiz", label: "Find Your Intelligence" },
    ],
  },
  explore: {
    label: "Explore",
    links: [
      { href: "/library", label: "Library", icon: PhBookOpen },
      { href: "/lore", label: "Lore & Mythology", icon: PhCompass },
      { href: "/luminors", label: "All Intelligences" },
      { href: "/records", label: "Records" },
    ],
  },
  community: {
    label: "Community",
    links: [
      { href: "/community", label: "Community Hub", icon: PhUsers },
      {
        href: "https://discord.gg/arcanea",
        label: "Discord",
        icon: PhChatCircleDots,
        external: true,
      },
      {
        href: "https://github.com/frankxai/arcanea",
        label: "GitHub",
        icon: PhGithubLogo,
        external: true,
      },
    ],
  },
  more: {
    label: "More",
    links: [
      { href: "/about", label: "About Arcanea" },
      { href: "/linktree", label: "All Links" },
      {
        href: "https://open.spotify.com/artist/arcanea",
        label: "Music",
        icon: PhMusicNotes,
        external: true,
      },
      {
        href: "https://frankx.ai",
        label: "FrankX.ai",
        icon: PhGlobe,
        external: true,
      },
    ],
  },
};

export function Footer() {
  return (
    <footer
      className="relative mt-24 border-t border-white/[0.06]"
      role="contentinfo"
    >
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#00bcd4]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {Object.values(footerLinks).map((section) => (
            <div key={section.label}>
              <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-text-muted mb-5">
                {section.label}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...("external" in link && link.external
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                            "aria-label": `${link.label} (opens in new tab)`,
                          }
                        : {})}
                      className="text-sm text-text-secondary hover:text-[#00bcd4] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/[0.06]">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/[0.08] group-hover:ring-[#00bcd4]/30 transition-all duration-300 shadow-[0_0_16px_rgba(0,188,212,0.10)]">
              <Image
                src={navLogo}
                alt="Arcanea"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display font-bold text-lg text-text-primary group-hover:text-[#00bcd4] transition-colors duration-300">
              Arcanea
            </span>
          </Link>

          {/* Tagline */}
          <p className="text-xs text-text-muted font-body italic text-center">
            &quot;Enter seeking, leave transformed, return whenever
            needed.&quot;
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-text-muted font-sans">
            <span>&copy; {new Date().getFullYear()} Arcanea</span>
            <span className="text-white/[0.08]">|</span>
            <Link href="/privacy" className="hover:text-[#00bcd4] transition-colors duration-300">Privacy</Link>
            <span className="text-white/[0.08]">|</span>
            <Link href="/terms" className="hover:text-[#00bcd4] transition-colors duration-300">Terms</Link>
            <span className="text-white/[0.08]">|</span>
            <Link
              href="https://frankx.ai"
              className="hover:text-[#00bcd4] transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FrankX.ai (opens in new tab)"
            >
              FrankX
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
