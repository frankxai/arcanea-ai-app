/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Smooth animated Chat/Imagine tab switcher.
 * Used on both /chat and /imagine pages for consistent navigation.
 */
export function ChatImagineTabs() {
  const pathname = usePathname();
  const isChat = pathname === '/chat' || pathname?.startsWith('/chat/');
  const isImagine = pathname === '/imagine';

  const tabs = [
    { href: '/chat', label: 'Chat', active: isChat },
    { href: '/imagine', label: 'Imagine', active: isImagine },
  ];

  return (
    <nav
      className="relative flex items-center gap-0.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
      role="tablist"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          role="tab"
          aria-selected={tab.active}
          className={cn(
            "relative z-10 px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 ease-out",
            tab.active
              ? "text-white"
              : "text-white/40 hover:text-white/60"
          )}
        >
          {tab.active && (
            <span
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/20 via-[var(--arc-brand-cosmic-blue)]/15 to-[var(--arc-brand-cosmic-blue)]/20 border border-[var(--arc-brand-atlantean-teal)]/20 shadow-[0_0_12px_rgba(0,188,212,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]"
              style={{
                animation: 'tabSlideIn 200ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          )}
          <span className="relative">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
