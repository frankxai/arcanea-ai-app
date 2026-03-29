'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ChatMarkdown = dynamic(() => import('@/components/chat/chat-markdown'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-4 bg-white/[0.04] rounded w-3/4" />,
});

export interface TocHeading {
  level: 2 | 3;
  text: string;
  id: string;
}

interface DocReaderProps {
  title: string;
  category: string;
  content: string;
  wordCount: number;
  readTime: number;
  headings: TocHeading[];
}

export function SagaDocReader({ title, category, content, wordCount, readTime, headings }: DocReaderProps) {
  const [progress, setProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState('');

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
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveHeading(entry.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50">
        <div className="h-full bg-[#00bcd4]/60 transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="max-w-[900px] mx-auto px-6 pt-8 pb-4">
        <Link href="/books" className="text-xs text-white/30 hover:text-white/50 transition-colors">&larr; Back to Books</Link>
        <div className="mt-1 text-xs text-white/20">{category} &middot; {wordCount.toLocaleString()} words &middot; {readTime} min read</div>
      </div>

      <header className="max-w-[900px] mx-auto px-6 pb-8 border-b border-white/[0.06]">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white/90 tracking-tight">{title}</h1>
      </header>

      <div className="max-w-[900px] mx-auto flex gap-8 px-6">
        {/* ToC sidebar — desktop only */}
        {headings.length > 3 && (
          <aside className="hidden lg:block w-48 shrink-0 pt-10 sticky top-16 self-start max-h-[calc(100vh-80px)] overflow-y-auto">
            <nav className="space-y-1">
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className={`block text-[11px] transition-colors truncate ${
                    h.level === 3 ? 'pl-3' : ''
                  } ${activeHeading === h.id ? 'text-[#00bcd4]' : 'text-white/25 hover:text-white/40'}`}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </aside>
        )}

        {/* Content */}
        <article className="flex-1 py-10 min-w-0">
          <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/80 prose-p:leading-[1.8] prose-p:mb-6 prose-headings:text-white/90 prose-headings:font-display prose-blockquote:border-l-[#00bcd4]/30 prose-blockquote:text-white/60 prose-strong:text-white/90 prose-em:text-white/70 prose-hr:border-white/[0.06]">
            <ChatMarkdown content={content} />
          </div>
        </article>
      </div>
    </div>
  );
}
