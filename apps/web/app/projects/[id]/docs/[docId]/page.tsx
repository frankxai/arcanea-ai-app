'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DocEditor, type DocEditorSavePayload } from '@/components/docs/doc-editor';
import { DOC_TYPE_LABELS, DOC_STATUS_LABELS, type DocType, type DocStatus } from '@/lib/docs/types';
import type { JSONContent } from 'novel';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DocData {
  id: string;
  title: string;
  doc_type: DocType;
  status: DocStatus;
  icon: string | null;
  content: {
    content_json: Record<string, unknown>;
    content_text: string;
    word_count: number;
  } | null;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DocEditorPage() {
  const params = useParams<{ id: string; docId: string }>();
  const router = useRouter();

  const [doc, setDoc] = useState<DocData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<DocType>('note');

  // Fetch doc on mount
  useEffect(() => {
    async function fetchDoc() {
      try {
        const res = await fetch(`/api/projects/${params.id}/docs/${params.docId}`);
        if (!res.ok) {
          router.push(`/projects/${params.id}/docs`);
          return;
        }
        const data = await res.json() as { data?: { doc?: DocData }; doc?: DocData };
        const docPayload = data.data?.doc ?? data.doc;
        if (!docPayload) {
          router.push(`/projects/${params.id}/docs`);
          return;
        }
        setDoc(docPayload);
        setTitle(docPayload.title);
        setDocType(docPayload.doc_type);
      } catch {
        router.push(`/projects/${params.id}/docs`);
      } finally {
        setLoading(false);
      }
    }
    void fetchDoc();
  }, [params.id, params.docId, router]);

  const handleSave = useCallback(
    async (payload: DocEditorSavePayload) => {
      setSaveState('saving');
      try {
        const res = await fetch(`/api/projects/${params.id}/docs/${params.docId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content_json: payload.content_json,
            content_text: payload.content_text,
            word_count: payload.word_count,
          }),
        });
        setSaveState(res.ok ? 'saved' : 'error');
        if (res.ok) {
          setTimeout(() => setSaveState('idle'), 2000);
        }
      } catch {
        setSaveState('error');
      }
    },
    [params.id, params.docId]
  );

  const handleTitleBlur = useCallback(async () => {
    if (!doc || title === doc.title) return;
    await fetch(`/api/projects/${params.id}/docs/${params.docId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setDoc((prev) => (prev ? { ...prev, title } : prev));
  }, [doc, title, params.id, params.docId]);

  const handleDocTypeChange = useCallback(
    async (newType: DocType) => {
      setDocType(newType);
      await fetch(`/api/projects/${params.id}/docs/${params.docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc_type: newType }),
      });
    },
    [params.id, params.docId]
  );

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    await fetch(`/api/projects/${params.id}/docs/${params.docId}`, { method: 'DELETE' });
    router.push(`/projects/${params.id}/docs`);
  }, [params.id, params.docId, router]);

  // ---------------------------------------------------------------------------
  // Render states
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-[#7fffd4] animate-spin" />
      </div>
    );
  }

  if (!doc) return null;

  const initialContent =
    doc.content?.content_json && Object.keys(doc.content.content_json).length > 0
      ? (doc.content.content_json as JSONContent)
      : undefined;

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] sticky top-0 z-20 bg-[#09090b]/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-sans min-w-0">
            <Link
              href={`/projects/${params.id}/docs`}
              className="text-white/30 hover:text-white/50 transition-colors flex-shrink-0"
            >
              Docs
            </Link>
            <span className="text-white/15 flex-shrink-0">/</span>
            <span className="text-white/50 truncate">{doc.title || 'Untitled'}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Doc type selector */}
            <select
              value={docType}
              onChange={(e) => void handleDocTypeChange(e.target.value as DocType)}
              className="h-7 rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/50 text-xs font-sans px-2 pr-6 cursor-pointer focus:outline-none focus:border-white/[0.15] appearance-none transition-colors"
            >
              {(Object.keys(DOC_TYPE_LABELS) as DocType[]).map((t) => (
                <option key={t} value={t} className="bg-[#0f0f17]">
                  {DOC_TYPE_LABELS[t]}
                </option>
              ))}
            </select>

            {/* Save indicator */}
            <span
              className={`text-[11px] font-sans transition-all ${
                saveState === 'saving'
                  ? 'text-white/30'
                  : saveState === 'saved'
                  ? 'text-[#7fffd4]/60'
                  : saveState === 'error'
                  ? 'text-red-400/60'
                  : 'text-white/15'
              }`}
            >
              {saveState === 'saving'
                ? 'Saving…'
                : saveState === 'saved'
                ? 'Saved'
                : saveState === 'error'
                ? 'Save failed'
                : 'Auto-save on'}
            </span>

            {/* Delete */}
            <button
              type="button"
              onClick={() => void handleDelete()}
              className="h-7 w-7 rounded-lg border border-white/[0.06] hover:border-red-500/30 hover:bg-red-500/10 text-white/20 hover:text-red-400 flex items-center justify-center transition-all text-xs"
              aria-label="Delete document"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Editor area */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Title input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => void handleTitleBlur()}
          placeholder="Untitled"
          className="w-full bg-transparent text-3xl font-semibold text-white placeholder-white/15 font-sans focus:outline-none mb-8 border-none resize-none"
        />

        {/* Novel editor */}
        <DocEditor
          initialContent={initialContent}
          onSave={handleSave}
          saveDelay={2000}
        />

        {/* Footer meta */}
        {doc.content && doc.content.word_count > 0 && (
          <div className="mt-10 pt-6 border-t border-white/[0.04] flex items-center gap-4 text-[11px] text-white/20 font-sans">
            <span>{doc.content.word_count.toLocaleString()} words</span>
            <span className="text-white/10">·</span>
            <span>{DOC_STATUS_LABELS[doc.status]}</span>
          </div>
        )}
      </div>
    </div>
  );
}
