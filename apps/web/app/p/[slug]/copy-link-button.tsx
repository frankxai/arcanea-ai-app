'use client';

import { useState } from 'react';
import { PhCheck, PhLink } from '@/lib/phosphor-icons';

/** Copies the current page URL to the clipboard with brief icon feedback. */
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
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/55 backdrop-blur-sm transition-colors hover:border-white/[0.16] hover:text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/40"
      aria-label="Copy link to this page"
    >
      {copied ? (
        <>
          <PhCheck className="h-3.5 w-3.5 text-[var(--arc-brand-atlantean-teal)]" weight="bold" />
          Copied
        </>
      ) : (
        <>
          <PhLink className="h-3.5 w-3.5" weight="duotone" />
          Copy link
        </>
      )}
    </button>
  );
}
