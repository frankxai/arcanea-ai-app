/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import {
  FloatingOrbs,
  DropZone,
  SectionShell,
  SectionHeader,
  StatusBadge,
} from "@/components/premium";
import { createClient } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface IngestedDocument {
  id: string;
  title: string;
  classification: string;
  classification_confidence: number;
  source_type: string;
  source_uri: string | null;
  world_id: string | null;
  tags: string[];
  word_count: number;
  created_at: string;
  updated_at: string;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
}

interface SearchResult {
  id: string;
  title: string;
  classification: string;
  source_type: string;
  world_id: string | null;
  tags: string[];
  created_at: string;
  similarity: number;
  snippet: string;
}

const CLASSIFICATION_COLOR: Record<string, string> = {
  character: "var(--arc-fire)",
  location: "var(--arc-brand-cosmic-blue)",
  magic: "var(--arc-brand-arcanean-gold)",
  scene: "var(--arc-brand-atlantean-teal)",
  lore: "var(--arc-void)",
  reference: "var(--arc-void)",
  chapter: "var(--arc-void)",
  note: "var(--arc-wind)",
};

const SOURCE_LABEL: Record<string, string> = {
  paste: "Pasted",
  url: "URL",
  file: "File",
  drive: "Drive",
  obsidian: "Obsidian",
  syncthing: "Syncthing",
  github: "GitHub",
  notion: "Notion",
  chat: "Chat",
};

const CLASSIFICATIONS = [
  "all",
  "character",
  "location",
  "magic",
  "scene",
  "lore",
  "chapter",
  "reference",
  "note",
] as const;

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

function formatRelativeTime(iso: string): string {
  const ts = new Date(iso).getTime();
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ---------------------------------------------------------------------------
// Document Card
// ---------------------------------------------------------------------------

function DocumentCard({
  doc,
  index,
  onDelete,
}: {
  doc: IngestedDocument;
  index: number;
  onDelete: (id: string) => void;
}) {
  const color = CLASSIFICATION_COLOR[doc.classification] ?? "var(--arc-brand-atlantean-teal)";
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.04, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at 50% 0%, ${color}12, transparent 60%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider uppercase border"
            style={{
              background: `${color}12`,
              borderColor: `${color}30`,
              color,
            }}
          >
            <span className="w-1 h-1 rounded-full" style={{ background: color }} />
            {doc.classification}
          </span>
          <span className="text-[10px] font-mono text-white/25">
            {Math.round(doc.classification_confidence * 100)}%
          </span>
        </div>

        <h3 className="text-[15px] font-display font-semibold text-white/85 leading-snug mb-2 line-clamp-2">
          {doc.title}
        </h3>

        {doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {doc.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-white/45 bg-white/[0.025] border border-white/[0.05]"
              >
                {t}
              </span>
            ))}
            {doc.tags.length > 4 && (
              <span className="text-[10px] text-white/25 font-mono">+{doc.tags.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 text-[10px] font-mono text-white/35">
          <span>{SOURCE_LABEL[doc.source_type] ?? doc.source_type}</span>
          <span className="text-white/15">·</span>
          <span>{doc.word_count.toLocaleString()} words</span>
          <span className="text-white/15">·</span>
          <span>{formatRelativeTime(doc.created_at)}</span>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center gap-3 text-xs">
          {doc.source_uri && (
            <a
              href={doc.source_uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/70 font-mono"
            >
              source ↗
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete "${doc.title}"?`)) onDelete(doc.id);
            }}
            className="ml-auto text-white/30 hover:text-red-400 font-mono"
          >
            delete
          </button>
        </div>
      </div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Drive Picker
// ---------------------------------------------------------------------------

function DrivePicker({ onIngested }: { onIngested: () => void }) {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ingestingId, setIngestingId] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/studio/drive/list?pageSize=8");
      if (res.status === 412) {
        setConnected(false);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setFiles(data.files ?? []);
      setConnected(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkConnection();
  }, [checkConnection]);

  const handleConnect = useCallback(async () => {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/studio/vault`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/drive.readonly",
        redirectTo,
      },
    });
  }, []);

  const handleIngest = useCallback(
    async (file: DriveFile) => {
      setIngestingId(file.id);
      setError(null);
      try {
        const res = await fetch("/api/studio/drive/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId: file.id, mimeType: file.mimeType }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
        onIngested();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ingest failed");
      } finally {
        setIngestingId(null);
      }
    },
    [onIngested],
  );

  if (connected === null && loading) {
    return (
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <p className="text-sm text-white/45 animate-pulse">Checking Google Drive connection…</p>
      </div>
    );
  }

  if (connected === false) {
    return (
      <div className="relative p-6 rounded-2xl bg-white/[0.025] border border-white/[0.06] overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold shrink-0 bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/30 text-[var(--arc-brand-atlantean-teal)]">
            ▲
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base font-display font-semibold text-white">Connect Google Drive</h3>
              <StatusBadge level="beta" compact />
            </div>
            <p className="text-sm text-white/50 mb-3">
              Pull Google Docs straight into your Studio vault. Read-only scope (
              <code className="font-mono text-[11px] text-white/70">drive.readonly</code>) — we never modify your files.
            </p>
            <button
              type="button"
              onClick={handleConnect}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--arc-brand-atlantean-teal)]/12 border border-[var(--arc-brand-atlantean-teal)]/30 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/20"
            >
              Connect Google account
            </button>
            {error && (
              <p className="mt-3 text-[11px] font-mono text-red-300">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6 rounded-2xl bg-white/[0.025] border border-white/[0.06]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/30 text-[var(--arc-brand-atlantean-teal)]">▲</span>
          <h3 className="text-sm font-display font-semibold text-white">Google Drive</h3>
          <StatusBadge level="live" compact />
        </div>
        <button
          type="button"
          onClick={() => void checkConnection()}
          className="text-[11px] font-mono text-white/40 hover:text-white/70"
        >
          refresh
        </button>
      </div>
      {files.length === 0 ? (
        <p className="text-sm text-white/45">No Google Docs found.</p>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.10] transition-colors"
            >
              <span className="text-[var(--arc-brand-atlantean-teal)] font-mono text-sm">📄</span>
              <span className="flex-1 min-w-0 text-[13px] text-white/80 truncate">{file.name}</span>
              {file.modifiedTime && (
                <span className="text-[10px] font-mono text-white/30">
                  {formatRelativeTime(file.modifiedTime)}
                </span>
              )}
              <button
                type="button"
                onClick={() => void handleIngest(file)}
                disabled={ingestingId === file.id}
                className="text-[11px] font-medium px-2 py-1 rounded bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/25 text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/20 disabled:opacity-50"
              >
                {ingestingId === file.id ? "Ingesting…" : "Ingest"}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-3 text-[11px] font-mono text-red-300">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search bar
// ---------------------------------------------------------------------------

function SearchBar({ onResults }: { onResults: (results: SearchResult[] | null) => void }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(
    async (q: string) => {
      if (!q || q.length < 2) {
        onResults(null);
        return;
      }
      setSearching(true);
      try {
        const res = await fetch("/api/studio/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, limit: 12 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Search failed");
        onResults(data.results ?? []);
      } catch {
        onResults(null);
      } finally {
        setSearching(false);
      }
    },
    [onResults],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void runSearch(v), 400);
  };

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Semantic search — try 'characters like Kael' or 'underground locations'…"
        className="w-full px-4 py-3 pr-24 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/40"
      />
      {searching && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-[var(--arc-brand-atlantean-teal)]/60 animate-pulse">
          searching…
        </span>
      )}
      {!searching && query.length >= 2 && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-white/30">
          pgvector HNSW
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vault Content
// ---------------------------------------------------------------------------

export function VaultContent() {
  const [docs, setDocs] = useState<IngestedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<(typeof CLASSIFICATIONS)[number]>("all");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [requiresAuth, setRequiresAuth] = useState(false);

  const loadDocs = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const url = activeFilter === "all"
        ? "/api/studio/documents"
        : `/api/studio/documents?classification=${activeFilter}`;
      const res = await fetch(url);
      if (res.status === 401) {
        setRequiresAuth(true);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setDocs(data.documents ?? []);
      setRequiresAuth(false);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    void loadDocs();
  }, [loadDocs]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/studio/documents?id=${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setDocs((prev) => prev.filter((d) => d.id !== id));
      } catch (e) {
        setFetchError(e instanceof Error ? e.message : "Delete failed");
      }
    },
    [],
  );

  const classificationCounts = docs.reduce<Record<string, number>>((acc, d) => {
    acc[d.classification] = (acc[d.classification] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[var(--arc-cosmic-void)]">
        <FloatingOrbs preset="aurora" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
          {/* Hero */}
          <header className="mb-12">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30 mb-3">
                  Studio · Vault
                </p>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-4xl md:text-5xl font-display font-bold tracking-[-0.03em]">
                    <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent">
                      Your creator memory
                    </span>
                  </h1>
                  <StatusBadge level="beta" note="pgvector live" />
                </div>
                <p className="text-base text-white/45 max-w-2xl font-body leading-relaxed">
                  Every document you drop in is classified, stored as markdown + JSONML,
                  and embedded for semantic retrieval. Luminors can reference any of this
                  during chat. Export anytime — your vault is yours.
                </p>
              </div>
              {!requiresAuth && docs.length > 0 && (
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="/api/studio/export"
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/25 text-[12px] font-mono text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/20 transition-colors"
                    title="Download the entire vault as JSON"
                  >
                    <span>⇣</span> Export JSON
                  </a>
                  <a
                    href="/api/studio/export?format=ndjson"
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[12px] font-mono text-white/60 hover:bg-white/[0.08] transition-colors"
                    title="Line-delimited JSON — streamable, diff-friendly"
                  >
                    <span>⇣</span> ndjson
                  </a>
                </div>
              )}
            </div>
          </header>

          {requiresAuth ? (
            <div className="p-8 rounded-2xl bg-white/[0.025] border border-white/[0.06] text-center max-w-md mx-auto">
              <h2 className="text-xl font-display font-bold text-white mb-2">Sign in to open your vault</h2>
              <p className="text-sm text-white/50 mb-6">
                The vault is scoped to your account. Sign up to start ingesting.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] text-[var(--arc-cosmic-void)] text-sm font-semibold"
              >
                Sign up
              </Link>
              <Link
                href="/auth/login"
                className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70"
              >
                Sign in
              </Link>
            </div>
          ) : (
            <>
              {/* Ingest + Drive picker */}
              <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 mb-14">
                <DropZone />
                <DrivePicker onIngested={() => void loadDocs()} />
              </section>

              {/* Search */}
              <section className="mb-8">
                <SearchBar onResults={setSearchResults} />
              </section>

              {/* Results (semantic) OR filtered list */}
              {searchResults ? (
                <section>
                  <SectionHeader
                    label="Semantic results"
                    title={`${searchResults.length} matches`}
                    subtitle="Sorted by semantic similarity. Higher = closer to your query."
                    accent="teal"
                    align="left"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((r, i) => (
                      <m.div
                        key={r.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06]"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider"
                            style={{
                              background: `${CLASSIFICATION_COLOR[r.classification] ?? "var(--arc-brand-atlantean-teal)"}14`,
                              color: CLASSIFICATION_COLOR[r.classification] ?? "var(--arc-brand-atlantean-teal)",
                            }}
                          >
                            {r.classification}
                          </span>
                          <span className="text-[10px] font-mono text-white/30">
                            {(r.similarity * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-sm font-display font-semibold text-white/85 mb-2 line-clamp-2">
                          {r.title}
                        </p>
                        <p className="text-[12px] text-white/45 line-clamp-3 leading-relaxed">
                          {r.snippet}
                        </p>
                      </m.div>
                    ))}
                  </div>
                </section>
              ) : (
                <section>
                  {/* Filter pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {CLASSIFICATIONS.map((c) => {
                      const active = activeFilter === c;
                      const count = c === "all" ? docs.length : classificationCounts[c] ?? 0;
                      const color = CLASSIFICATION_COLOR[c] ?? "var(--arc-brand-atlantean-teal)";
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setActiveFilter(c)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase transition-all ${
                            active
                              ? "text-white"
                              : "text-white/50 hover:text-white/80"
                          }`}
                          style={{
                            background: active ? `${color}15` : "rgba(255,255,255,0.025)",
                            border: `1px solid ${active ? `${color}40` : "rgba(255,255,255,0.06)"}`,
                          }}
                        >
                          <span className="w-1 h-1 rounded-full" style={{ background: color }} />
                          {c}
                          <span className="text-white/30 tabular-nums">{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {loading ? (
                    <p className="text-sm text-white/40 animate-pulse">Loading vault…</p>
                  ) : docs.length === 0 ? (
                    <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
                      <p className="text-base text-white/55 mb-2">Your vault is empty</p>
                      <p className="text-sm text-white/35 max-w-md mx-auto">
                        Drop a markdown file, paste a URL, or connect Google Drive to start
                        building your semantic memory layer.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {docs.map((doc, i) => (
                        <DocumentCard
                          key={doc.id}
                          doc={doc}
                          index={i}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                  {fetchError && (
                    <p className="mt-4 text-[12px] font-mono text-red-300">{fetchError}</p>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </LazyMotion>
  );
}
