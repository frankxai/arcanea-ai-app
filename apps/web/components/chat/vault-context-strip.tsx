"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import {
  brand,
  ambient,
  nodeTypeAccents,
  competitorAccent,
} from "@arcanea/design-system";

// ---------------------------------------------------------------------------
// VaultContextStrip — shows "related vault docs" above the chat input.
// Debounced semantic search fires on the most recent user message. Chips
// link to /studio/vault/[id] so the creator can inspect what the Luminor
// is drawing on.
//
// Lives above the ChatInputBar. Hides itself when there's nothing to show.
// Mirrors the same CLASSIFICATION_COLOR map shape as drop-zone.tsx —
// both share the eight content classifications.
// ---------------------------------------------------------------------------

interface VaultDoc {
  id: string;
  title: string;
  classification: string;
  source_type: string;
  similarity: number;
  snippet: string;
}

const CLASSIFICATION_COLOR: Record<string, string> = {
  character: nodeTypeAccents.character,
  location: nodeTypeAccents.location,
  magic: nodeTypeAccents.magic,
  scene: brand.aquamarine,
  lore: nodeTypeAccents.lore,
  reference: competitorAccent,
  chapter: ambient.pink,
  note: ambient.emerald,
};

export interface VaultContextStripProps {
  /** The most recent user message to seed the retrieval query */
  latestUserMessage: string | null;
  /** Hide completely (e.g. during streaming) */
  disabled?: boolean;
  className?: string;
}

export function VaultContextStrip({
  latestUserMessage,
  disabled = false,
  className = "",
}: VaultContextStripProps) {
  const [docs, setDocs] = useState<VaultDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [vaultEmpty, setVaultEmpty] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQuery = useRef<string>("");

  const runSearch = useCallback(async (query: string) => {
    if (!query || query.trim().length < 6) {
      setDocs([]);
      return;
    }
    if (query === lastQuery.current) return;
    lastQuery.current = query;
    setLoading(true);
    try {
      const res = await fetch("/api/studio/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, limit: 5 }),
      });
      if (res.status === 401) {
        // Not signed in — hide silently
        setDocs([]);
        return;
      }
      if (res.status === 503) {
        // Not migrated — hide silently
        setVaultEmpty(true);
        setDocs([]);
        return;
      }
      if (!res.ok) {
        setDocs([]);
        return;
      }
      const data = await res.json();
      const results = (data.results ?? []) as VaultDoc[];
      // Only show genuinely relevant matches (>65% similarity)
      setDocs(results.filter((r) => r.similarity >= 0.65).slice(0, 4));
    } catch {
      setDocs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (disabled || dismissed || !latestUserMessage) {
      setDocs([]);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void runSearch(latestUserMessage), 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [latestUserMessage, disabled, dismissed, runSearch]);

  if (disabled || dismissed || vaultEmpty) return null;
  if (docs.length === 0 && !loading) return null;

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`px-4 pt-2 pb-0 ${className}`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#7fffd4]/70 shrink-0">
            <span className="w-1 h-1 rounded-full bg-[#7fffd4]" />
            From your vault
          </span>

          <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
            {loading && docs.length === 0 && (
              <span className="text-[10px] font-mono text-white/25 animate-pulse">
                retrieving…
              </span>
            )}
            {docs.map((doc) => {
              const color = CLASSIFICATION_COLOR[doc.classification] ?? brand.aquamarine;
              return (
                <Link
                  key={doc.id}
                  href={`/studio/vault/${doc.id}`}
                  className="group inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono border transition-colors"
                  style={{
                    background: `${color}10`,
                    borderColor: `${color}25`,
                    color: `${color}dd`,
                  }}
                  title={doc.snippet}
                >
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: color }}
                  />
                  <span className="truncate max-w-[200px]">{doc.title}</span>
                  <span className="text-white/30 text-[9px]">
                    {Math.round(doc.similarity * 100)}%
                  </span>
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-[10px] font-mono text-white/30 hover:text-white/60 shrink-0"
            aria-label="Hide vault context strip"
            title="Hide for this session"
          >
            hide
          </button>
        </div>
      </m.div>
    </AnimatePresence>
  );
}
