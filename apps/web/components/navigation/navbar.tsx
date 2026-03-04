"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from '@/lib/phosphor-icons';
import { UserNav } from "@/components/auth";
import navLogo from "@/assets/brand/arcanea-mark.jpg";

const navLinks = [
  { href: "/chat", label: "Create" },
  { href: "/library", label: "Library" },
  { href: "/academy", label: "Academy" },
  { href: "/discover", label: "Discover" },
  { href: "/community", label: "Community" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "liquid-glass border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/[0.06] group-hover:ring-[#00bcd4]/30 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,188,212,0.2)]">
                <Image
                  src={navLogo}
                  alt="Arcanea"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <span className="font-display text-lg font-semibold tracking-wide text-white group-hover:text-[#00bcd4] transition-colors duration-300">
                Arcanea
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-[#00bcd4] bg-[#00bcd4]/10"
                        : "text-text-secondary hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[#00bcd4] to-[#1a237e] rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}

              <div className="w-px h-6 bg-white/[0.06] mx-2" />

              <Link
                href="/chat"
                className="btn-glow ml-1 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#00897b] via-[#1565c0] to-[#00bcd4] text-white hover:shadow-[0_0_30px_rgba(0,188,212,0.3)] transition-all duration-300"
              >
                Start Creating
              </Link>

              <div className="ml-2">
                <UserNav />
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-white hover:bg-white/[0.06] rounded-xl transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[65px] z-40 md:hidden"
          >
            <nav aria-label="Mobile navigation">
              <div className="liquid-glass-elevated border-b border-white/[0.08] mx-4 rounded-2xl mt-2 overflow-hidden">
                <div className="p-4 space-y-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? "text-[#00bcd4] bg-[#00bcd4]/10"
                            : "text-text-secondary hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}

                  <div className="h-px bg-white/[0.06] my-3" />

                  <Link
                    href="/chat"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#00897b] via-[#1565c0] to-[#00bcd4] text-white"
                  >
                    Start Creating
                  </Link>

                  <div className="px-4 py-2">
                    <UserNav />
                  </div>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
