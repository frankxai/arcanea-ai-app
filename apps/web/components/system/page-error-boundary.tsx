"use client";

import { useEffect } from "react";
import { brand, semantic, cosmicBlueScale } from "@arcanea/design-system";

// Shared route-segment error boundary. Use as the default export of any
// app/.../error.tsx file:
//
//   "use client";
//   export { PageErrorBoundary as default } from "@/components/system/page-error-boundary";
//
// Refactored from the 86 identical copies that lived per-route. One source
// of truth, brand-token-driven (semantic.error, brand.cosmicBlue, etc).

export function PageErrorBoundary({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div
        className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: semantic.errorSurface }}
      >
        <svg
          className="h-8 w-8"
          fill="none"
          stroke={semantic.error}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold text-white">
        Something went wrong
      </h2>
      <p className="mb-6 max-w-md text-center text-sm text-gray-400">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors"
        style={{ backgroundColor: brand.cosmicBlue }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = cosmicBlueScale.hover)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brand.cosmicBlue)}
      >
        Try again
      </button>
    </div>
  );
}

export default PageErrorBoundary;
