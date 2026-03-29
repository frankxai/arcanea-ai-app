'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ChatMarkdown = dynamic(() => import('@/components/chat/chat-markdown'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-4 bg-white/[0.04] rounded w-3/4" />,
});

interface ChapterReaderProps {
  bookId: string;
  bookTitle: string;
  chapterNumber: number;
  totalChapters: number;
  title: string;
  content: string;
  wordCount: number;
  readTime: number;
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}

export function ChapterReader({
  bookId, bookTitle, chapterNumber, totalChapters,
  title, content, wordCount, readTime, prev, next,
}: ChapterReaderProps) {
  const [progress, setProgress] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    const handler = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowLeft' && prev) window.location.href = `/books/${bookId}/${prev.id}`;
      if (e.key === 'ArrowRight' && next) window.location.href = `/books/${bookId}/${next.id}`;
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [bookId, prev, next]);

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    try {
      await fetch('/api/saga/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, chapterSlug: title.toLowerCase().replace(/\s+/g, '-'), content: noteText }),
      });
      setNoteText('');
      setShowNotes(false);
    } catch { /* silent */ }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50">
        <div className="h-full bg-[#00bcd4]/60 transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>
      <div className="max-w-[680px] mx-auto px-6 pt-8 pb-4">
        <Link href={`/books/${bookId}`} className="text-xs text-white/30 hover:text-white/50 transition-colors">&larr; {bookTitle}</Link>
        <div className="flex items-center justify-between mt-1 text-xs text-white/20">
          <span>Chapter {chapterNumber} of {totalChapters}</span>
          <span>{wordCount.toLocaleString()} words &middot; {readTime} min read</span>
        </div>
      </div>
      <header className="max-w-[680px] mx-auto px-6 pb-8 border-b border-white/[0.06]">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white/90 tracking-tight">{title}</h1>
      </header>
      <article className="max-w-[680px] mx-auto px-6 py-10">
        <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/80 prose-p:leading-[1.8] prose-p:mb-6 prose-headings:text-white/90 prose-headings:font-display prose-blockquote:border-l-[#00bcd4]/30 prose-blockquote:text-white/60 prose-strong:text-white/90 prose-em:text-white/70 prose-hr:border-white/[0.06]">
          <ChatMarkdown content={content} />
        </div>
      </article>
      <nav className="max-w-[680px] mx-auto px-6 py-8 border-t border-white/[0.06] flex justify-between gap-4">
        {prev ? <Link href={`/books/${bookId}/${prev.id}`} className="text-sm text-white/40 hover:text-white/60 transition-colors">&larr; {prev.title}</Link> : <span />}
        {next ? <Link href={`/books/${bookId}/${next.id}`} className="text-sm text-[#00bcd4]/60 hover:text-[#00bcd4] transition-colors text-right">{next.title} &rarr;</Link> : <span />}
      </nav>
      <div className="max-w-[680px] mx-auto px-6 pb-12">
        <button onClick={() => setShowNotes(!showNotes)} className="w-full py-3 text-sm text-white/30 hover:text-white/50 border border-white/[0.06] rounded-xl hover:bg-white/[0.02] transition-all">Leave a note about this chapter</button>
        {showNotes && (
          <div className="mt-3 space-y-3">
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Your thoughts, suggestions, corrections..." className="w-full h-24 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/70 placeholder-white/20 resize-none focus:border-[#00bcd4]/30 focus:outline-none" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowNotes(false)} className="px-3 py-1.5 text-xs text-white/30 hover:text-white/50">Cancel</button>
              <button onClick={handleSaveNote} className="px-3 py-1.5 text-xs bg-[#00bcd4]/10 text-[#00bcd4] rounded-lg hover:bg-[#00bcd4]/15 border border-[#00bcd4]/20">Save Note</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
