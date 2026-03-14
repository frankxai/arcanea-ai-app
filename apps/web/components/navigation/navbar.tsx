"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LazyMotion, domMax, m, AnimatePresence } from "framer-motion";
import { UserNav } from "@/components/auth";

const navLinks = [
  { href: "/chat", label: "Create", also: ["/imagine", "/studio"] },
  { href: "/library", label: "Library", also: [] },
  { href: "/academy", label: "Academy", also: ["/academy/courses", "/academy/gates"] },
  { href: "/gallery", label: "Gallery", also: ["/discover", "/feed"] },
  { href: "/lore", label: "Lore", also: ["/lore/guardians", "/lore/gates"] },
  { href: "/pricing", label: "Pricing", also: [] },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <LazyMotion features={domMax}>
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
              className="text-base font-display font-semibold text-white/90 tracking-tight hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 rounded"
            >
              Arcanea
            </Link>

            <div className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname?.startsWith(link.href + "/") ||
                  (link.also?.some(p => pathname === p || pathname?.startsWith(p + "/")) ?? false);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 ${
                      isActive
                        ? "text-[#00bcd4] bg-[#00bcd4]/10"
                        : "text-white/68 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <m.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[#00bcd4] to-[#1a237e] rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 340,
                          damping: 28,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <UserNav />
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden px-3 py-1.5 text-xs tracking-wider uppercase text-white/85 border border-white/[0.12] rounded-lg hover:bg-white/[0.05] transition-colors"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[64px] z-40 md:hidden"
          >
            <nav
              aria-label="Mobile navigation"
              className="mx-4 rounded-2xl liquid-glass-elevated border border-white/[0.08] overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    pathname?.startsWith(link.href + "/");
                  return (
                    <Link
                      key={link.href}
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
                  );
                })}

                <div className="h-px bg-white/[0.08] my-3" />

                <div className="px-1">
                  <UserNav />
                </div>
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
