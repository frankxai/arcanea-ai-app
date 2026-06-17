/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
    also: ["/imagine", "/studio", "/forge", "/agents", "/worlds", "/games", "/music-studio", "/cinema-studio", "/canvas", "/voice", "/integrations", "/distribute"],
    mega: [
      {
        title: "Create",
        items: [
          { href: "/chat", label: "Chat", desc: "Talk with Luminors" },
          { href: "/imagine", label: "Imagine", desc: "Generate images" },
          { href: "/studio", label: "Studio", desc: "Write & compose" },
          { href: "/worlds", label: "Worlds", desc: "Build universes" },
          { href: "/games", label: "Games", desc: "Prompt to playable" },
          { href: "/music-studio", label: "Music", desc: "Artist worlds" },
          { href: "/cinema-studio", label: "Cinema", desc: "Trailers & scenes" },
          { href: "/canvas", label: "Canvas", desc: "Node workflows" },
        ],
      },
      {
        title: "Agents",
        items: [
          { href: "/agents", label: "Marketplace", desc: "Specialist agents" },
          { href: "/forge/companion", label: "Forge", desc: "Create your own" },
        ],
      },
      {
        title: "Ecosystem",
        items: [
          { href: "/create", label: "Create Hub", desc: "Start from a template" },
          { href: "/integrations", label: "Integrations", desc: "Connect your stack" },
          { href: "/distribute", label: "Distribute", desc: "Publish everywhere" },
        ],
      },
    ],
  },
  {
    href: "/gallery",
    label: "Explore",
    also: ["/discover", "/library", "/lore", "/living-lore", "/luminors", "/showcase", "/models", "/community-hub", "/creator-economy"],
    mega: [
      {
        title: "Discover",
        items: [
          { href: "/gallery", label: "Gallery", desc: "Community creations" },
          { href: "/discover/pages", label: "Pages", desc: "Published from conversations" },
          { href: "/worlds", label: "Worlds", desc: "Browse the multiverse" },
          { href: "/luminors", label: "Luminors", desc: "Meet the AI minds" },
          { href: "/models", label: "Model Arena", desc: "AI benchmarks" },
        ],
      },
      {
        title: "Lore",
        items: [
          { href: "/library", label: "Library", desc: "200K+ words of wisdom" },
          { href: "/lore/guardians", label: "Guardians", desc: "The Ten Gate-keepers" },
          { href: "/living-lore", label: "Chronicles", desc: "Interactive stories" },
          { href: "/glossary", label: "Glossary", desc: "Arcanean terminology" },
        ],
      },
      {
        title: "Community",
        items: [
          { href: "/community-hub", label: "Community Hub", desc: "Discord, Reddit, Whop" },
          { href: "/creator-economy", label: "Creator Economy", desc: "7 ways to earn" },
        ],
      },
    ],
  },
  {
    href: "/academy",
    label: "Learn",
    also: ["/academy/courses", "/academy/gates", "/academy/houses", "/quiz", "/skills", "/docs/mcp", "/ecosystem", "/protocol", "/apps", "/teams", "/storage"],
    mega: [
      {
        title: "Academy",
        items: [
          { href: "/academy", label: "Ten Gates", desc: "Creative progression" },
          { href: "/academy/courses", label: "Courses", desc: "Structured paths" },
          { href: "/quiz", label: "Origin Quiz", desc: "Discover your class" },
        ],
      },
      {
        title: "Build",
        items: [
          { href: "/mcp", label: "MCP & CLI", desc: "Claude, Codex, Cursor" },
          { href: "/docs/mcp", label: "MCP Docs", desc: "Developer toolkit" },
          { href: "/ecosystem", label: "Ecosystem", desc: "Open source repos" },
          { href: "/protocol", label: "Protocol", desc: "Open standards spec" },
          { href: "/apps", label: "Apps", desc: "Connector marketplace" },
          { href: "/teams", label: "Teams", desc: "How we build" },
          { href: "/storage", label: "Storage", desc: "Semantic memory" },
        ],
      },
    ],
  },
  { href: "/blog", label: "Blog", also: [] },
  { href: "/pricing", label: "Pricing", also: [] },
];

// ─── Mega Dropdown Component ─────────────────────────────────────────────────

function MegaDropdown({ sections, onClose }: { sections: NavSection[]; onClose: () => void }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12, scale: 0.97, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 6, scale: 0.98, filter: 'blur(4px)' }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-auto ${sections.length >= 3 ? "min-w-[660px]" : "min-w-[480px]"}`}
    >
      <div className="rounded-2xl bg-[var(--arc-cosmic-void)]/80 backdrop-blur-2xl backdrop-saturate-150 border border-white/[0.08] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)_inset] overflow-hidden">
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
                    className="relative flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-all duration-200 group"
                  >
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 rounded-r-full bg-[var(--arc-brand-atlantean-teal)] group-hover:h-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    <span className="text-[13px] font-medium text-white/80 group-hover:text-[var(--arc-brand-atlantean-teal)] group-hover:translate-x-0.5 transition-all duration-200">
                      {item.label}
                    </span>
                    {item.desc && (
                      <span className="text-[11px] text-white/30 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all duration-200">
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
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
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

  // Lock body scroll while the mobile menu is open so the page behind doesn't
  // scroll under the sheet (a common "feels broken" report on mobile). Also
  // auto-close at the md breakpoint so the lock is released if the viewport
  // grows past mobile while the menu is open.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => { if (e.matches) setMobileMenuOpen(false); };
    mql.addEventListener("change", onChange);
    return () => {
      document.body.style.overflow = prev;
      mql.removeEventListener("change", onChange);
    };
  }, [mobileMenuOpen]);

  // Close the mobile menu on Escape for keyboard users.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

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
              className="flex items-center gap-2 text-base font-display font-semibold text-white/90 tracking-tight hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--arc-brand-atlantean-teal)]/30 rounded"
            >
              <ArcaneanMark size={22} />
              <span>Arcanea™</span>
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
                      className={`relative px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--arc-brand-atlantean-teal)]/30 flex items-center gap-1 ${
                        isActive
                          ? "text-[var(--arc-brand-atlantean-teal)] bg-[var(--arc-brand-atlantean-teal)]/10"
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
                          className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] rounded-full"
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
              className="md:hidden p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.06] border border-white/[0.10] transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M4 4L14 14M14 4L4 14" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 5h12M3 9h12M3 13h8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu — accordion-style with sections */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden={true}
            className="fixed inset-0 z-[45] md:hidden bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-[var(--nav-h,4rem)] z-[55] md:hidden max-h-[calc(100dvh_-_var(--nav-h,4rem))] overflow-y-auto pb-[env(safe-area-inset-bottom)]"
          >
            <nav
              aria-label="Mobile navigation"
              className="mx-4 rounded-2xl liquid-glass-elevated border border-white/[0.08] overflow-hidden"
            >
              <div className="p-3 space-y-0.5">
                {navLinks.map((link, i) => {
                  const isActive =
                    pathname === link.href ||
                    pathname?.startsWith(link.href + "/") ||
                    (link.also?.some(p => pathname === p || pathname?.startsWith(p + "/")) ?? false);
                  const hasMega = !!link.mega;
                  const isExpanded = mobileExpanded === link.label;

                  return (
                    <m.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                    >
                      <div className="flex items-center">
                        <Link
                          href={link.href}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex-1 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors min-h-[48px] flex items-center ${
                            isActive
                              ? "text-[var(--arc-brand-atlantean-teal)] bg-[var(--arc-brand-atlantean-teal)]/10"
                              : "text-white/70 active:text-white active:bg-white/[0.06]"
                          }`}
                        >
                          {link.label}
                        </Link>
                        {hasMega && (
                          <button
                            type="button"
                            onClick={() => setMobileExpanded(isExpanded ? null : link.label)}
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${link.label} submenu`}
                            className="p-3 rounded-xl text-white/40 active:bg-white/[0.06] min-w-[48px] min-h-[48px] flex items-center justify-center"
                          >
                            <svg width="12" height="12" viewBox="0 0 10 10" className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                              <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                            </svg>
                          </button>
                        )}
                      </div>
                      {/* Accordion sub-items */}
                      <AnimatePresence initial={false}>
                        {hasMega && isExpanded && (
                          <m.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pl-3 pb-2 space-y-0.5">
                              {link.mega!.map((section) => (
                                <div key={section.title}>
                                  <p className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-[0.15em] text-white/25 font-semibold">
                                    {section.title}
                                  </p>
                                  {section.items.map((item) => (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-white/50 active:text-white active:bg-white/[0.06] transition-colors min-h-[44px]"
                                    >
                                      <span>{item.label}</span>
                                      {item.desc && (
                                        <span className="text-[11px] text-white/20 ml-3 hidden xs:inline">{item.desc}</span>
                                      )}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </m.div>
                  );
                })}

                <div className="h-px bg-white/[0.08] my-3" />

                <m.div
                  className="flex items-center gap-3 px-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.25 }}
                >
                  <SearchBar compact />
                  <NotificationBell />
                  <UserNav />
                </m.div>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
