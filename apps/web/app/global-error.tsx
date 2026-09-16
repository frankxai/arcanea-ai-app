"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical application error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <head>
        <title>Application Error | Arcanea</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#030712",
          color: "#f3f4f6",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "32rem",
            margin: "0 auto",
            padding: "2.5rem 1.5rem",
            textAlign: "center",
          }}
        >
          {/* Glowing error icon */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "4.5rem",
              height: "4.5rem",
              borderRadius: "9999px",
              background:
                "radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 70%)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              marginBottom: "1.5rem",
            }}
          >
            <svg
              style={{ width: "2rem", height: "2rem", color: "#ef4444" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>

          <h1
            style={{
              fontSize: "1.875rem",
              lineHeight: "2.25rem",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "#00bcd4",
              marginBottom: "0.75rem",
            }}
          >
            System Disruption
          </h1>

          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: "1.5rem",
              color: "rgba(255, 255, 255, 0.65)",
              marginBottom: "1.5rem",
            }}
          >
            A critical unexpected error occurred at the foundation level. You can
            attempt to revive the session or return to safety.
          </p>

          {error.message && (
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "0.5rem",
                padding: "0.875rem 1rem",
                textAlign: "left",
                marginBottom: "1.75rem",
                wordBreak: "break-all",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.35rem 0",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "rgba(255, 255, 255, 0.4)",
                }}
              >
                Diagnostic
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  color: "#ef4444",
                }}
              >
                {error.message}
              </p>
              {error.digest && (
                <p
                  style={{
                    margin: "0.5rem 0 0 0",
                    fontSize: "0.75rem",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    color: "rgba(255, 255, 255, 0.3)",
                  }}
                >
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.625rem 1.25rem",
                borderRadius: "0.5rem",
                backgroundColor: "rgba(0, 188, 212, 0.12)",
                border: "1px solid rgba(0, 188, 212, 0.4)",
                color: "#00bcd4",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Revive Session
            </button>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.625rem 1.25rem",
                borderRadius: "0.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
