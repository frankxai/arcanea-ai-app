"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FloatingOrbs, StatusBadge } from "@/components/premium";

interface IngestedDocument {
  id: string;
  title: string;
  markdown_content: string;
  jsonml_content: unknown;
  classification: string;
  classification_confidence: number;
  source_type: string;
  source_uri: string | null;
  world_id: string | null;
  tags: string[];
  word_count: number;
  token_estimate: number;
  created_at: string;
  updated_at: string;
}

interface RelatedDoc {
  id: string;
  title: string;
  classification: string;
  similarity: number;
  snippet: string;
}

const CLASSIFICATIONS = [
  'character',
  'location',
  'magic',
  'scene',
  'lore',
  'reference',
  'chapter',
  'note',
] as const;

const CLASSIFICATION_COLOR: Record<string, string> = {
  character: "#ef4444",
  location: "#3b82f6",
  magic: "#ffd700",
  scene: "#7fffd4",
  lore: "#c084fc",
  reference: "#94a3b8",
  chapter: "#f472b6",
  note: "#34d399",
};

const SOURCE_LABEL: Record<string, string> = {
  paste: "Pasted",
  url: "URL",
  file: "File",
  drive: "Google Drive",
  obsidian: "Obsidian",
  syncthing: "Syncthing",
  github: "GitHub",
  notion: "Notion",
  chat: "Chat",
};

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

function renderMarkdown(text: string): string {
  // Minimal, dependency-free. We're not trying to be remark here —
  // enough to make the document readable (headings, bold, em, lists, code).
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^###### (.+)$/gm, '<h6 class="text-xs font-display font-semibold text-white/75 mt-5 mb-1">$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5 class="text-sm font-display font-semibold text-white/80 mt-5 mb-1">$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4 class="text-base font-display font-semibold text-white/85 mt-5 mb-2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-display font-semibold text-white/90 mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-display font-bold text-white/95 mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-display font-bold text-white mt-8 mb-4">$1</h1>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono text-[13px] text-[#7fffd4]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/(^|\W)\*([^*\n]+)\*(\W|$)/g, '$1<em class="text-white/80 italic">$2</em>$3')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc text-white/70 leading-relaxed">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal text-white/70 leading-relaxed">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-white/65 leading-relaxed my-3">')
    .replace(/^(?!<[hl])/gm, '');
}

export function VaultDetailContent({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [doc, setDoc] = useState<IngestedDocument | null>(null);
  const [related, setRelated] = useState<RelatedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editClassification, setEditClassification] = useState<string>("reference");
  const [editTags, setEditTags] = useState("");
  const [saving, setSaving] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  const loadDoc = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/studio/documents/${documentId}`);
      if (res.status === 401) {
        setRequiresAuth(true);
        return;
      }
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      const document = data.document as IngestedDocument;
      setDoc(document);
      setEditTitle(document.title);
      setEditContent(document.markdown_content);
      setEditClassification(document.classification);
      setEditTags(document.tags.join(", "));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  const loadRelated = useCallback(async (d: IngestedDocument) => {
    try {
      const queryText = `${d.title}\n${d.markdown_content.slice(0, 300)}`;
      const res = await fetch('/api/studio/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, limit: 6 }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const results = (data.results ?? []).filter((r: RelatedDoc) => r.id !== d.id).slice(0, 5);
      setRelated(results);
    } catch {
      // best-effort — related is nice-to-have
    }
  }, []);

  useEffect(() => {
    void loadDoc();
  }, [loadDoc]);

  useEffect(() => {
    if (doc) void loadRelated(doc);
  }, [doc, loadRelated]);

  const handleSave = useCallback(async () => {
    if (!doc) return;
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {};
      if (editTitle !== doc.title) payload.title = editTitle;
      if (editContent !== doc.markdown_content) payload.markdown_content = editContent;
      if (editClassification !== doc.classification) payload.classification = editClassification;
      const newTags = editTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 10);
      if (JSON.stringify(newTags) !== JSON.stringify(doc.tags)) payload.tags = newTags;

      if (Object.keys(payload).length === 0) {
        setEditing(false);
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/studio/documents/${doc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      await loadDoc(); // refetch canonical state
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [doc, editTitle, editContent, editClassification, editTags, loadDoc]);

  const handleDelete = useCallback(async () => {
    if (!doc) return;
    if (!confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/studio/documents/${doc.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.push('/studio/vault');
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }, [doc, router]);

  // Keyboard shortcut: cmd/ctrl+S saves, Esc cancels
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!editing) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        void handleSave();
      } else if (e.key === 'Escape') {
        if (doc) {
          setEditTitle(doc.title);
          setEditContent(doc.markdown_content);
          setEditClassification(doc.classification);
          setEditTags(doc.tags.join(', '));
        }
        setEditing(false);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [editing, handleSave, doc]);

  if (requiresAuth) {
    return (
      <div className="relative min-h-screen bg-[#09090b] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-white mb-3">Sign in to view this document</h1>
          <p className="text-sm text-white/50 mb-5">Your vault is scoped to your account.</p>
          <Link href="/auth/login" className="inline-flex px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#00bcd4] text-[#09090b] text-sm font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="relative min-h-screen bg-[#09090b] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-white mb-3">Not found</h1>
          <p className="text-sm text-white/50 mb-5">This document doesn&apos;t exist in your vault.</p>
          <Link href="/studio/vault" className="inline-flex px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/70">
            Back to vault
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !doc) {
    return (
      <div className="relative min-h-screen bg-[#09090b] flex items-center justify-center">
        <p className="text-sm text-white/40 animate-pulse">Loading…</p>
      </div>
    );
  }

  const color = CLASSIFICATION_COLOR[doc.classification] ?? "#7fffd4";

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[#09090b]">
        <FloatingOrbs preset="aurora" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-24">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-[11px] font-mono text-white/30">
            <Link href="/studio" className="hover:text-white/60">Studio</Link>
            <span className="text-white/15">/</span>
            <Link href="/studio/vault" className="hover:text-white/60">Vault</Link>
            <span className="text-white/15">/</span>
            <span className="text-white/50 truncate max-w-xs">{doc.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            {/* Main column */}
            <div>
              {/* Header */}
              <header className="mb-8">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border"
                      style={{
                        background: `${color}12`,
                        borderColor: `${color}30`,
                        color,
                      }}
                    >
                      <span className="w-1 h-1 rounded-full" style={{ background: color }} />
                      {doc.classification}
                    </span>
                    <StatusBadge
                      level={doc.source_type === 'chat' ? 'live' : 'beta'}
                      note={SOURCE_LABEL[doc.source_type] ?? doc.source_type}
                      compact
                    />
                    <span className="text-[10px] font-mono text-white/30">
                      {Math.round(doc.classification_confidence * 100)}% confidence
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!editing && (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditing(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7fffd4]/10 border border-[#7fffd4]/25 text-[12px] font-medium text-[#7fffd4] hover:bg-[#7fffd4]/20"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-[12px] font-medium text-red-300 hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {editing && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            if (!doc) return;
                            setEditTitle(doc.title);
                            setEditContent(doc.markdown_content);
                            setEditClassification(doc.classification);
                            setEditTags(doc.tags.join(", "));
                            setEditing(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[12px] font-medium text-white/70 hover:bg-white/[0.08]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleSave()}
                          disabled={saving}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#7fffd4] to-[#00bcd4] text-[#09090b] text-[12px] font-semibold disabled:opacity-50"
                        >
                          {saving ? 'Saving…' : 'Save'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-3xl md:text-4xl font-display font-bold tracking-[-0.02em] bg-transparent border-b border-white/[0.12] pb-2 focus:outline-none focus:border-[#7fffd4]/50"
                  />
                ) : (
                  <h1 className="text-3xl md:text-4xl font-display font-bold tracking-[-0.02em] text-white">
                    {doc.title}
                  </h1>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-mono text-white/35">
                  <span>{doc.word_count.toLocaleString()} words</span>
                  <span className="text-white/15">·</span>
                  <span>~{doc.token_estimate.toLocaleString()} tokens</span>
                  <span className="text-white/15">·</span>
                  <span>updated {formatRelativeTime(doc.updated_at)}</span>
                  {doc.source_uri && (
                    <>
                      <span className="text-white/15">·</span>
                      <a
                        href={doc.source_uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white/70 underline decoration-white/15"
                      >
                        source ↗
                      </a>
                    </>
                  )}
                </div>
              </header>

              {/* Body */}
              {editing ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-white/30 mb-1.5">
                      Classification
                    </label>
                    <select
                      value={editClassification}
                      onChange={(e) => setEditClassification(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/85 focus:outline-none focus:border-[#7fffd4]/40"
                    >
                      {CLASSIFICATIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-white/30 mb-1.5">
                      Tags (comma-separated, max 10)
                    </label>
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="cyberpunk, detective, antihero"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/85 font-mono focus:outline-none focus:border-[#7fffd4]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-white/30 mb-1.5">
                      Markdown body
                    </label>
                    <textarea
                      ref={contentRef}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={28}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white/85 font-mono leading-relaxed focus:outline-none focus:border-[#7fffd4]/40 resize-y"
                    />
                    <p className="text-[10px] font-mono text-white/25 mt-1.5">
                      ⌘S to save · Esc to cancel · Re-embeds on content change
                    </p>
                  </div>
                </div>
              ) : (
                <article className="prose prose-invert max-w-none">
                  <div
                    className="text-white/65 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: `<p class="text-white/65 leading-relaxed my-3">${renderMarkdown(
                        doc.markdown_content,
                      )}</p>`,
                    }}
                  />
                </article>
              )}

              {doc.tags.length > 0 && !editing && (
                <div className="mt-10 pt-6 border-t border-white/[0.06]">
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/30 mb-3">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/[0.03] border border-white/[0.06] text-white/55"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-6 p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-[12px] text-red-300">
                  {error}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/30 mb-3">
                  Quick actions
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/chat?vaultDoc=${doc.id}`}
                    className="inline-flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[12px] text-white/70 hover:bg-white/[0.06] hover:border-white/[0.12]"
                  >
                    Discuss in chat
                    <span className="text-white/30">→</span>
                  </Link>
                  <a
                    href={`/api/studio/documents/${doc.id}`}
                    download={`${doc.title.replace(/[^a-z0-9-_]/gi, '_')}.json`}
                    className="inline-flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[12px] text-white/70 hover:bg-white/[0.06] hover:border-white/[0.12]"
                  >
                    Download JSON
                    <span className="text-white/30">↓</span>
                  </a>
                  {doc.source_uri && (
                    <a
                      href={doc.source_uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[12px] text-white/70 hover:bg-white/[0.06] hover:border-white/[0.12]"
                    >
                      Open source
                      <span className="text-white/30">↗</span>
                    </a>
                  )}
                </div>
              </div>

              {related.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/30 mb-3">
                    Related in your vault
                  </p>
                  <div className="space-y-2">
                    {related.map((r) => {
                      const c = CLASSIFICATION_COLOR[r.classification] ?? "#7fffd4";
                      return (
                        <Link
                          key={r.id}
                          href={`/studio/vault/${r.id}`}
                          className="block p-3 rounded-lg bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className="text-[9px] font-mono uppercase tracking-wider"
                              style={{ color: `${c}dd` }}
                            >
                              {r.classification}
                            </span>
                            <span className="text-[9px] font-mono text-white/25">
                              {Math.round(r.similarity * 100)}%
                            </span>
                          </div>
                          <p className="text-[13px] font-display font-semibold text-white/85 leading-tight mb-1 line-clamp-2">
                            {r.title}
                          </p>
                          <p className="text-[11px] text-white/40 line-clamp-2 leading-snug">
                            {r.snippet}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/30 mb-2">
                  Metadata
                </p>
                <dl className="text-[11px] space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <dt className="text-white/30">ID</dt>
                    <dd className="text-white/55 truncate max-w-[180px]">{doc.id.slice(0, 8)}…</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-white/30">Created</dt>
                    <dd className="text-white/55">{formatRelativeTime(doc.created_at)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-white/30">Source</dt>
                    <dd className="text-white/55">{SOURCE_LABEL[doc.source_type] ?? doc.source_type}</dd>
                  </div>
                  {doc.world_id && (
                    <div className="flex justify-between">
                      <dt className="text-white/30">World</dt>
                      <dd className="text-white/55 truncate max-w-[140px]">{doc.world_id.slice(0, 8)}…</dd>
                    </div>
                  )}
                </dl>
              </div>
            </aside>
          </div>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link
              href="/studio/vault"
              className="text-[12px] font-mono text-white/35 hover:text-white/60"
            >
              ← Back to vault
            </Link>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
}
