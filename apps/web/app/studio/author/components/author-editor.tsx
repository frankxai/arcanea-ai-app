'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { DocEditor, type DocEditorSavePayload } from '@/components/docs/doc-editor';
import type { JSONContent } from 'novel';

interface AuthorEditorProps {
  bookSlug: string;
  chapterSlug: string;
  initialHtml: string;
}

export function AuthorEditor({ bookSlug, chapterSlug, initialHtml }: AuthorEditorProps) {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [dirty, setDirty] = useState(false);
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
      if (res.ok) {
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

  return (
    <div className="relative">
      <DocEditor
        initialContent={initialHtml as unknown as JSONContent}
        onSave={(payload) => {
          setDirty(true);
          handleSave(payload);
        }}
        saveDelay={3000}
        placeholder="Start writing your chapter..."
      />

      {/* Status bar */}
      <div className="sticky bottom-0 flex items-center justify-between px-2 py-2 border-t border-white/[0.04] bg-[#09090b]/90 backdrop-blur-sm text-[10px] text-white/25 z-10">
        <div className="flex items-center gap-4">
          <span>{wordCount.toLocaleString()} words</span>
          <span>{Math.max(1, Math.ceil(wordCount / 250))} min read</span>
        </div>
        <div className="flex items-center gap-3">
          {dirty && !saving && <span className="text-amber-400/40">Unsaved</span>}
          {saving && <span className="text-[#00bcd4]/40">Saving...</span>}
          {lastSaved && !saving && !dirty && (
            <span className="text-emerald-400/40">Saved {lastSaved.toLocaleTimeString()}</span>
          )}
          <span className="text-white/15">Ctrl+S</span>
        </div>
      </div>
    </div>
  );
}
