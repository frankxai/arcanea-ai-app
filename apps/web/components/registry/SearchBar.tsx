/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') ?? '');
  const [isPending, startTransition] = useTransition();

  // Debounced URL sync
  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set('q', value.trim());
      } else {
        params.delete('q');
      }
      startTransition(() => {
        router.replace(`/registry?${params.toString()}`, { scroll: false });
      });
    }, 250);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="relative">
          <svg
            aria-hidden
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search agents by name, capability, or domain"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3.5 pl-11 pr-12 font-sans text-sm text-white placeholder-white/30 outline-none backdrop-blur-sm transition-all duration-200 focus:border-[var(--arc-brand-atlantean-teal)]/40 focus:bg-white/[0.04] focus:ring-2 focus:ring-[var(--arc-brand-atlantean-teal)]/20"
          />
          {isPending && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-wider text-white/40"
            >
              searching
            </m.div>
          )}
        </div>
      </m.div>
    </LazyMotion>
  );
}
