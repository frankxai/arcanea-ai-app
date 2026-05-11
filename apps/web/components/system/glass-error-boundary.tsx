/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useEffect } from "react";
import { brand, semantic, glass } from "@arcanea/design-system";

// Shared GLASS-VARIANT route-segment error boundary. Use as default export of
// app/.../error.tsx whenever the route lives inside a glass-card layout
// (academy, dashboard sub-views, products, contribute, etc):
//
//   "use client";
//   export { GlassErrorBoundary as default } from "@/components/system/glass-error-boundary";
//
// Refactored from 9 identical copies that lived per-route. Single source of
// truth, brand-token-driven (semantic.error, brand.atlanteanTeal, glass.base).
//
// For the simpler minimal variant (no glass card, with Go-home link), use
// `MinimalErrorBoundary` from `./minimal-error-boundary` instead.
//
// For the most stripped-down variant (no card, single CTA), use
// `PageErrorBoundary` from `./page-error-boundary`.

export function GlassErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className={`${glass.base} rounded-2xl p-8 max-w-md w-full text-center`}>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            backgroundColor: semantic.errorSurface,
            border: `1px solid ${semantic.error}33`,
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke={semantic.error}
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-display font-semibold text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-white/50 mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{
            backgroundColor: `${brand.atlanteanTeal}1a`,
            border: `1px solid ${brand.atlanteanTeal}33`,
            color: brand.atlanteanTeal,
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = `${brand.atlanteanTeal}33`)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = `${brand.atlanteanTeal}1a`)
          }
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default GlassErrorBoundary;
