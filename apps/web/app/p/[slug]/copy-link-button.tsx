'use client';

import { useState } from 'react';

/** Copies the current page URL to the clipboard with brief feedback. */
export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white/90 hover:border-[var(--arc-brand-atlantean-teal)]/30 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/40 focus-visible:outline-none"
      aria-label="Copy link to this page"
    >
      {copied ? 'Link copied' : 'Copy link'}
    </button>
  );
}
