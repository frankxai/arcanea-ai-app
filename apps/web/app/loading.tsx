/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { PhCircleNotch } from '@/lib/phosphor-icons';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      {/* Animated loader with cosmic glow */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse blur-2xl bg-atlantean-teal-aqua/30 rounded-full" />
        <PhCircleNotch className="relative w-16 h-16 text-atlantean-teal-aqua animate-spin" />
      </div>

      {/* Loading text with shimmer effect */}
      <p className="text-lg font-display text-neutral-400 animate-pulse">
        Weaving cosmic threads...
      </p>

      {/* Loading bar */}
      <div className="mt-8 w-64 h-1 bg-neutral-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-atlantean-teal-aqua via-cosmic-blue to-creation-prism-1 animate-shimmer" />
      </div>
    </div>
  );
}
