"use client";

import { useEffect, useRef, useState } from "react";

export function WorldArtBrief({
  brief,
  disabled,
  onError,
}: {
  brief: string;
  disabled: boolean;
  onError: (message: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      if (mounted.current) setCopied(true);
    } catch {
      if (mounted.current) {
        onError(
          "Your browser cannot copy the brief. Export the draft to keep its art prompt.",
        );
      }
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={copyBrief}
        className="min-h-11 px-5 py-3 rounded-lg border border-white/20 text-sm disabled:opacity-50"
      >
        {copied ? "Art brief copied" : "Copy art brief"}
      </button>
      <span className="sr-only" role="status">
        {copied ? "The complete art brief is on your clipboard." : ""}
      </span>
    </>
  );
}
