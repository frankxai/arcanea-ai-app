"use client";

import Link from "next/link";

export default function GalleryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#09090b" }}
    >
      <div
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          style={{ color: "#ef4444" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <h2
        className="mb-2 text-xl font-bold"
        style={{ color: "#00bcd4", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Gallery Unavailable
      </h2>

      <p
        className="mb-1 max-w-sm text-center text-sm"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        Something went wrong loading the gallery.
      </p>

      {error.message && (
        <p
          className="mb-6 max-w-sm break-all text-center text-xs"
          style={{ color: "rgba(239,68,68,0.7)", fontFamily: "monospace" }}
        >
          {error.message}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
          style={{
            backgroundColor: "rgba(0,188,212,0.12)",
            border: "1px solid rgba(0,188,212,0.4)",
            color: "#00bcd4",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg px-5 py-2.5 text-sm font-semibold"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
