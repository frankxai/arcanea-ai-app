"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  X,
  Sparkles,
  Palette,
  BookOpen,
  GraduationCap,
  Info,
  Brain,
} from "@phosphor-icons/react";
import { UserNav } from "@/components/auth";

const navLinks = [
  { href: "/luminors", label: "Luminors", icon: Sparkles, primary: true },
  {
    href: "/luminor-intelligence",
    label: "Luminor Intelligence",
    icon: Brain,
    primary: true,
  },
  { href: "/studio", label: "Studio", icon: Palette },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/academy", label: "Academy", icon: GraduationCap },
  { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-cosmic-deep/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="navGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#7fffd4"/>
                      <stop offset="48%" stopColor="#a78bfa"/>
                      <stop offset="100%" stopColor="#9b59ff"/>
                    </linearGradient>
                    <radialGradient id="navGlow" cx="50%" cy="35%" r="55%">
                      <stop offset="0%" stopColor="#7fffd4" stopOpacity="0.14"/>
                      <stop offset="100%" stopColor="#7fffd4" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  <ellipse cx="20" cy="18" rx="16" ry="14" fill="url(#navGlow)"/>
                  <path
                    fillRule="evenodd"
                    d="M 4 37 L 4 18 Q 4 4 20 4 Q 36 4 36 18 L 36 37 L 30 37 L 30 19 Q 30 10 20 10 Q 10 10 10 19 L 10 37 Z"
                    fill="url(#navGrad)"
                  />
                  <rect x="4" y="24" width="32" height="4" rx="2" fill="url(#navGrad)"/>
                  <circle cx="20" cy="4" r="2.5" fill="#ffffff" opacity="0.75"/>
                </svg>
              </div>
              <span className="font-display text-xl font-semibold tracking-wide bg-gradient-to-r from-atlantean-teal-aqua to-creation-prism-purple bg-clip-text text-transparent">
                Arcanea
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    link.primary
                      ? "text-atlantean-teal-aqua hover:text-atlantean-teal-aqua/80 font-medium"
                      : "text-text-secondary hover:text-atlantean-teal-aqua"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <UserNav />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <List className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[73px] z-40 md:hidden"
          >
            <div className="bg-cosmic-deep/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
              <div className="px-6 py-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/5 ${
                        link.primary
                          ? "text-atlantean-teal-aqua hover:text-atlantean-teal-aqua/80 font-medium"
                          : "text-text-secondary hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="h-px bg-white/10 my-4" />

                {/* Auth buttons in mobile */}
                <div className="px-4 py-2">
                  <UserNav />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
