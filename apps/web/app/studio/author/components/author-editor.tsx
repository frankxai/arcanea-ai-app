'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface AuthorEditorProps {
  bookSlug: string;
  chapterSlug: string;
  initialContent: string;
}

export function AuthorEditor({
  bookSlug,
  chapterSlug,
  initialContent,
}: AuthorEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dirty, setDirty] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 250));

  const save = useCallback(
    async (text: string) => {
      setSaving(true);
      try {
        const res = await fetch(
          `/api/author/${bookSlug}/chapters/${chapterSlug}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: text }),
          },
        );
        if (res.ok) {
          setLastSaved(new Date());
          setDirty(false);
        }
      } catch (e) {
        console.error('Save failed:', e);
      } finally {
        setSaving(false);
      }
    },
    [bookSlug, chapterSlug],
  );

  // Auto-save with debounce
  const handleChange = useCallback(
    (value: string) => {
      setContent(value);
      setDirty(true);

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => save(value), 3000);
    },
    [save],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Ctrl+S manual save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        save(content);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [content, save]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  return (
    <div className="relative">
      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full min-h-[70vh] bg-transparent text-white/80 font-serif text-base leading-[1.8] resize-none focus:outline-none placeholder:text-white/15 selection:bg-[#00bcd4]/20"
        placeholder="Start writing..."
        spellCheck
      />

      {/* Footer status bar */}
      <div className="sticky bottom-0 flex items-center justify-between px-2 py-2 border-t border-white/[0.04] bg-[#09090b]/90 backdrop-blur-sm text-[10px] text-white/25">
        <div className="flex items-center gap-4">
          <span>{wordCount.toLocaleString()} words</span>
          <span>{readTime} min read</span>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-amber-400/40">Unsaved changes</span>}
          {saving && <span className="text-[#00bcd4]/40">Saving...</span>}
          {lastSaved && !saving && !dirty && (
            <span className="text-emerald-400/40">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <span className="text-white/15">Ctrl+S to save</span>
        </div>
      </div>
    </div>
  );
}
