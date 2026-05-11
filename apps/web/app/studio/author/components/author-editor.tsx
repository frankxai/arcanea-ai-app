/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { DocEditor, type DocEditorSavePayload } from '@/components/docs/doc-editor';
import type { JSONContent } from 'novel';

interface AuthorEditorProps {
  bookSlug: string;
  chapterSlug: string;
  initialHtml: string;
}

type SaveMode = 'draft' | 'published' | 'signin-required';

export function AuthorEditor({ bookSlug, chapterSlug, initialHtml }: AuthorEditorProps) {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [saveMode, setSaveMode] = useState<SaveMode>('published');
  const contentRef = useRef<{ text: string; json: JSONContent | null }>({ text: '', json: null });

  const handleSave = useCallback(async (payload: DocEditorSavePayload) => {
    setSaving(true);
    setWordCount(payload.word_count);
    contentRef.current = { text: payload.content_text, json: payload.content_json };

    try {
      const res = await fetch(`/api/author/${bookSlug}/chapters/${chapterSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: payload.content_text,
          contentJson: payload.content_json,
        }),
      });
      if (res.status === 401) {
        setSaveMode('signin-required');
        setDirty(false);
      } else if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveMode(data.source === 'draft' ? 'draft' : 'published');
        setLastSaved(new Date());
        setDirty(false);
      }
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setSaving(false);
    }
  }, [bookSlug, chapterSlug]);

  // Ctrl+S override
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (contentRef.current.text) {
          handleSave({
            content_json: contentRef.current.json ?? { type: 'doc', content: [] },
            content_text: contentRef.current.text,
            word_count: wordCount,
          });
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave, wordCount]);

  const signInRequired = saveMode === 'signin-required';

  return (
    <div className="relative">
      {signInRequired && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/15 text-[11px] text-amber-300/70 leading-relaxed">
          <strong className="text-amber-200">Sign in to save drafts.</strong> Your edits aren&apos;t persisted because you aren&apos;t authenticated.
          Drafts live in Supabase under your account and sync across devices. Sign in to enable autosave.
        </div>
      )}

      <DocEditor
        initialContent={initialHtml as unknown as JSONContent}
        onSave={(payload) => {
          setDirty(true);
          handleSave(payload);
        }}
        saveDelay={2000}
        placeholder="Start writing your chapter..."
      />

      {/* Status bar */}
      <div className="sticky bottom-0 flex items-center justify-between px-2 py-2 border-t border-white/[0.04] bg-[var(--arc-cosmic-void)]/90 backdrop-blur-sm text-[10px] text-white/25 z-10">
        <div className="flex items-center gap-4">
          <span>{wordCount.toLocaleString()} words</span>
          <span>{Math.max(1, Math.ceil(wordCount / 250))} min read</span>
        </div>
        <div className="flex items-center gap-3">
          {signInRequired && <span className="text-amber-400/60">Sign in to save</span>}
          {!signInRequired && dirty && !saving && <span className="text-amber-400/40">Unsaved</span>}
          {!signInRequired && saving && <span className="text-[var(--arc-brand-atlantean-teal)]/40">Saving...</span>}
          {!signInRequired && lastSaved && !saving && !dirty && (
            <span className={saveMode === 'draft' ? 'text-[var(--arc-brand-atlantean-teal)]/50' : 'text-emerald-400/40'}>
              {saveMode === 'draft' ? 'Draft saved' : 'Saved'} {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {!signInRequired && <span className="text-white/15">Ctrl+S</span>}
        </div>
      </div>
    </div>
  );
}
