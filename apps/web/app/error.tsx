"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div
      className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: "#09090b" }}
    >
      {/* Error icon */}
      <div className="relative mb-8">
        <div
          className="absolute inset-0 rounded-full blur-xl animate-pulse"
          style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
        />
        <div
          className="relative flex items-center justify-center rounded-full p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(0,188,212,0.08))",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <svg
            className="h-14 w-14"
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
      </div>

      {/* Heading */}
      <h1
        className="mb-4 text-center text-3xl font-bold tracking-tight md:text-4xl"
        style={{ color: "#00bcd4", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Something Went Wrong
      </h1>

      <p
        className="mb-2 max-w-md text-center text-base"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        An unexpected error occurred. You can try again or head back to the
        homepage.
      </p>

      {/* Error details */}
      {error.message && (
        <div
          className="mt-4 w-full max-w-lg rounded-lg p-4"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            className="mb-1 text-xs uppercase tracking-wider"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Error
          </p>
          <p
            className="break-all text-sm"
            style={{ color: "#ef4444", fontFamily: "monospace" }}
          >
            {error.message}
          </p>
          {error.digest && (
            <p
              className="mt-2 text-xs"
              style={{ color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}
            >
              ID: {error.digest}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: "rgba(0,188,212,0.12)",
            border: "1px solid rgba(0,188,212,0.4)",
            color: "#00bcd4",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0,188,212,0.2)";
            e.currentTarget.style.boxShadow =
              "0 0 20px rgba(0,188,212,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0,188,212,0.12)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Try Again
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          Go Home
        </Link>
      </div>

      {/* Suggestions */}
      <div className="mt-10 max-w-sm text-center">
        <p className="mb-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          If this keeps happening, try refreshing or clearing your browser
          cache.
        </p>
      </div>
    </div>
  );
}
