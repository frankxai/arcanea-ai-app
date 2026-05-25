/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';
import { canAccess, getUpgradeMessage, type PricingTier, type FeatureGates } from '@/lib/features/feature-gates';

interface UpgradeGateProps {
  feature: keyof FeatureGates;
  tier: PricingTier;
  children: ReactNode;
  /** Optional fallback instead of the default upgrade prompt */
  fallback?: ReactNode;
}

/**
 * UpgradeGate -- wraps a feature with tier-based access control.
 *
 * If the user's tier grants access, renders children.
 * Otherwise, renders an upgrade prompt linking to /pricing.
 *
 * Usage:
 *   <UpgradeGate feature="imageGeneration" tier={userTier}>
 *     <ImageGenerator />
 *   </UpgradeGate>
 */
export function UpgradeGate({ feature, tier, children, fallback }: UpgradeGateProps) {
  if (canAccess(tier, feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const message = getUpgradeMessage(feature, tier);

  return (
    <div className="relative rounded-2xl border border-white/[0.06] bg-[var(--arc-cosmic-void)]/80 p-6 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10">
        <svg
          className="h-5 w-5 text-[var(--arc-brand-atlantean-teal)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z"
          />
        </svg>
      </div>

      <p className="mb-4 text-sm text-neutral-400">
        {message ?? 'This feature requires a higher plan.'}
      </p>

      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--arc-brand-atlantean-teal)] px-4 py-2 text-sm font-semibold text-[var(--arc-cosmic-void)] transition-all hover:shadow-[0_0_20px_rgba(0,188,212,0.4)]"
      >
        Upgrade
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
