"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { analytics } from "@/lib/analytics/events";

type PromptKind = "positive" | "negative";

interface PromptActionsProps {
  slug: string;
  prompt: string;
  negativePrompt: string;
  rightsTier: string;
  generationPolicy: string;
}

export function PromptActions({
  slug,
  prompt,
  negativePrompt,
  rightsTier,
  generationPolicy,
}: PromptActionsProps) {
  const [copied, setCopied] = useState<PromptKind | null>(null);

  async function copyPrompt(kind: PromptKind, value: string) {
    if (!value.trim()) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1600);
      analytics.atlasCreaturePromptCopy({
        slug,
        promptKind: kind,
        rightsTier,
        generationPolicy,
      });
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => void copyPrompt("positive", prompt)}
        className="inline-flex items-center gap-2 rounded-lg bg-atlantean-teal px-4 py-2 text-sm font-semibold text-cosmic-void transition hover:bg-atlantean-aqua"
      >
        {copied === "positive" ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        Copy prompt
      </button>
      <button
        type="button"
        onClick={() => void copyPrompt("negative", negativePrompt)}
        className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/65 transition hover:border-atlantean-teal/30 hover:text-atlantean-aqua"
      >
        {copied === "negative" ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        Copy negative
      </button>
      <a
        href={`/api/atlas/creatures/${slug}/generate-prompt`}
        className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] px-4 py-2 text-sm text-white/45 transition hover:border-white/[0.14] hover:text-white/70"
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        Prompt JSON
      </a>
    </div>
  );
}
