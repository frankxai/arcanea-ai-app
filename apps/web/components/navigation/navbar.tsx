"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { UserNav } from "@/components/auth";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { SearchBar } from "@/components/search/search-bar";
import { ArcaneanMark } from "@/components/brand/arcanea-mark";

// ─── Mega Menu Data ──────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  desc?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavLink {
  href: string;
  label: string;
  also: string[];
  mega?: NavSection[];
}

const navLinks: NavLink[] = [
  {
    href: "/chat",
    label: "Create",
    also: ["/imagine", "/studio", "/forge", "/agents", "/worlds", "/voice"],
    mega: [
      {
        title: "Create",
        items: [
          { href: "/chat", label: "Chat", desc: "Talk with AI minds" },
          { href: "/imagine", label: "Imagine", desc: "Generate images" },
          { href: "/voice", label: "Voice", desc: "Speak, listen, create" },
          { href: "/studio", label: "Studio", desc: "Write stories & code" },
          { href: "/worlds", label: "Worlds", desc: "Build living universes" },
        ],
      },
      {
        title: "Agents",
        items: [
          { href: "/agents", label: "Marketplace", desc: "12 specialist agents" },
          { href: "/agents/hub", label: "Skill Tree", desc: "50 abilities, 10 Gates" },
          { href: "/forge/companion", label: "Forge", desc: "Create your own agent" },
        ],
      },
    ],
  },
  {
    href: "/gallery",
    label: "Explore",
    also: ["/discover", "/library", "/lore", "/living-lore", "/factions", "/luminors", "/worlds", "/showcase", "/changelog"],
    mega: [
      {
        title: "Discover",
        items: [
          { href: "/gallery", label: "Gallery", desc: "Community creations" },
          { href: "/worlds", label: "Worlds", desc: "Browse the multiverse" },
          { href: "/discover", label: "Trending", desc: "What creators are building" },
          { href: "/factions", label: "Factions", desc: "8 Origin Classes" },
        ],
      },
      {
        title: "Knowledge",
        items: [
          { href: "/library", label: "Library", desc: "200K+ words of wisdom" },
          { href: "/lore", label: "Lore", desc: "Mythology & cosmology" },
          { href: "/lore/guardians", label: "Guardians", desc: "The Ten Gate-keepers" },
          { href: "/living-lore", label: "Chronicles", desc: "Interactive stories" },
        ],
      },
      {
        title: "Ecosystem",
        items: [
          { href: "/showcase", label: "Showcase", desc: "Live engine demos" },
          { href: "/ecosystem", label: "Overview", desc: "27 repos, 43 packages" },
          { href: "/developers", label: "Developers", desc: "API & SDK docs" },
          { href: "/changelog", label: "Changelog", desc: "Latest updates" },
        ],
      },
    ],
  },
  {
    href: "/academy",
    label: "Learn",
    also: ["/academy/courses", "/academy/gates", "/academy/houses", "/academy/ranks"],
    mega: [
      {
        title: "Academy",
        items: [
          { href: "/academy", label: "Ten Gates", desc: "Creative progression system" },
          { href: "/academy/courses", label: "Courses", desc: "Structured learning paths" },
          { href: "/academy/houses", label: "Houses", desc: "Seven Academy Houses" },
          { href: "/quiz", label: "Origin Quiz", desc: "Discover your class" },
        ],
      },
    ],
  },
  {
    href: "/pricing",
    label: "Open Core",
    also: [],
  },
];

// ─── Mega Dropdown Component ─────────────────────────────────────────────────

function MegaDropdown({ sections, onClose }: { sections: NavSection[]; onClose: () => void }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-auto min-w-[480px]"
    >
      <div className="rounded-2xl liquid-glass-elevated border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className={`grid gap-0 divide-x divide-white/[0.06] p-1 ${
          sections.length === 1 ? "grid-cols-1" : sections.length === 2 ? "grid-cols-2" : "grid-cols-3"
        }`}>
          {sections.map((section) => (
            <div key={section.title} className="p-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-3 px-2">
                {section.title}
              </h3>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    {...(item.label.includes("↗") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group"
                  >
                    <span className="text-[13px] font-medium text-white/80 group-hover:text-[#00bcd4] transition-colors">
                      {item.label}
                    </span>
                    {item.desc && (
                      <span className="text-[11px] text-white/30 group-hover:text-white/40 transition-colors">
                        {item.desc}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </m.div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega on route change
  useEffect(() => { setOpenMega(null); setMobileMenuOpen(false); }, [pathname]);

  const handleEnter = (label: string) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setOpenMega(label);
  };

  const handleLeave = () => {
    megaTimeoutRef.current = setTimeout(() => setOpenMega(null), 150);
  };

  return (
    <LazyMotion features={domAnimation}>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "liquid-glass border-b border-white/[0.06] shadow-[0_8px_36px_rgba(0,0,0,0.32)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-base font-display font-semibold text-white/90 tracking-tight hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 rounded"
            >
              <ArcaneanMark size={22} />
              <span>Arcanea</span>
            </Link>

            {/* Desktop nav with mega dropdowns */}
            <div className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname?.startsWith(link.href + "/") ||
                  (link.also?.some(p => pathname === p || pathname?.startsWith(p + "/")) ?? false);
                const hasMega = !!link.mega;
                const isOpen = openMega === link.label;

                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => hasMega && handleEnter(link.label)}
                    onMouseLeave={handleLeave}
                  >
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      aria-expanded={hasMega ? isOpen : undefined}
                      className={`relative px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 flex items-center gap-1 ${
                        isActive
                          ? "text-[#00bcd4] bg-[#00bcd4]/10"
                          : "text-white/68 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className={isActive ? "" : "link-underline"}>
                        {link.label}
                      </span>
                      {hasMega && (
                        <svg width="10" height="10" viewBox="0 0 10 10" className={`opacity-40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                          <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        </svg>
                      )}
                      {isActive && (
                        <m.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[#00bcd4] to-[#1a237e] rounded-full"
                          transition={{ type: "spring", stiffness: 340, damping: 28 }}
                        />
                      )}
                    </Link>

                    <AnimatePresence>
                      {hasMega && isOpen && (
                        <MegaDropdown sections={link.mega!} onClose={() => setOpenMega(null)} />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <SearchBar compact />
              <NotificationBell />
              <UserNav />
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden px-3 py-1.5 text-xs tracking-wider uppercase text-white/85 border border-white/[0.12] rounded-lg hover:bg-white/[0.05] transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu — accordion-style with sections */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-[64px] z-40 md:hidden max-h-[80vh] overflow-y-auto"
          >
            <nav
              aria-label="Mobile navigation"
              className="mx-4 rounded-2xl liquid-glass-elevated border border-white/[0.08] overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {navLinks.map((link, i) => {
                  const isActive =
                    pathname === link.href ||
                    pathname?.startsWith(link.href + "/");
                  return (
                    <m.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? "text-[#00bcd4] bg-[#00bcd4]/10"
                            : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        {link.label}
                      </Link>
                      {/* Show sub-items on mobile */}
                      {link.mega && (
                        <div className="ml-4 mt-1 space-y-0.5">
                          {link.mega.flatMap(s => s.items).slice(0, 4).map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-4 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </m.div>
                  );
                })}

                <div className="h-px bg-white/[0.08] my-3" />

                <m.div
                  className="px-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.25 }}
                >
                  <NotificationBell />
                  <UserNav />
                </m.div>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/65 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
