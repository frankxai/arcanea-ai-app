"use client";

import { useEffect } from "react";
import Link from "next/link";
import { brand, semantic } from "@arcanea/design-system";

// Shared MINIMAL-VARIANT route-segment error boundary. Use as default export
// of app/.../error.tsx for routes where the error should offer both a Try
// Again and a Go-Home escape hatch (top-level product surfaces: agents,
// challenges, creations, models, living-lore, etc):
//
//   "use client";
//   export { MinimalErrorBoundary as default } from "@/components/system/minimal-error-boundary";
//
// Refactored from 7 identical copies that lived per-route. The Go-home link
// goes to `/`, and the Try-Again CTA is aquamarine (brand.aquamarine) per
// the original spec.

export function MinimalErrorBoundary({
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
      <div className="text-center max-w-md">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-6"
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
        <h2 className="text-xl font-display font-semibold mb-2">
          Something went wrong
        </h2>
        <p className="text-text-muted text-sm mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-sm font-medium hover:bg-white/[0.1] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{
              backgroundColor: `${brand.aquamarine}1a`,
              border: `1px solid ${brand.aquamarine}33`,
              color: brand.aquamarine,
            }}
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MinimalErrorBoundary;
