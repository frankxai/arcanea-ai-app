import Link from "next/link";
import {
  PhGithubLogo,
  PhChatCircleDots,
  PhBookOpen,
  PhGraduationCap,
  PhPalette,
  PhSparkle,
  PhCompass,
  PhUsers,
  PhMusicNotes,
  PhGlobe,
} from "@phosphor-icons/react";

const footerLinks = {
  create: {
    label: "Create",
    links: [
      { href: "/luminors", label: "Luminors", icon: PhSparkle },
      { href: "/studio", label: "Studio", icon: PhPalette },
      { href: "/academy", label: "Academy", icon: PhGraduationCap },
      { href: "/academy/gate-quiz", label: "Find Your Guardian" },
    ],
  },
  explore: {
    label: "Explore",
    links: [
      { href: "/library", label: "Library", icon: PhBookOpen },
      { href: "/lore", label: "Lore & Mythology", icon: PhCompass },
      { href: "/lore/guardians", label: "The Ten Guardians" },
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
      className="relative mt-24 border-t border-white/5"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {Object.values(footerLinks).map((section) => (
            <div key={section.label}>
              <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-text-muted mb-4">
                {section.label}
              </h3>
              <ul className="space-y-2.5">
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
                      className="text-sm text-text-secondary hover:text-crystal transition-colors"
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-crystal flex items-center justify-center text-white font-bold text-sm shadow-glow-sm">
              A
            </div>
            <span className="font-display font-bold text-lg text-text-primary">
              Arcanea
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-text-muted font-body italic text-center">
            &quot;Enter seeking, leave transformed, return whenever
            needed.&quot;
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-text-muted font-sans">
            <span>&copy; {new Date().getFullYear()} Arcanea</span>
            <span className="text-white/10">|</span>
            <span>MIT License</span>
            <span className="text-white/10">|</span>
            <Link
              href="https://frankx.ai"
              className="hover:text-crystal transition-colors"
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
