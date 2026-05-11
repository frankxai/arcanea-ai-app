/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ExtraProps } from 'react-markdown';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GrimoireViewerProps {
  content: string;
  worldName: string;
  tier: string;
  generatedAt: string;
}

interface TocEntry {
  id: string;
  level: number;
  text: string;
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type MdHeadingProps = React.ComponentProps<'h1'> &
  ExtraProps & { level: number };
type MdCodeProps = React.ComponentProps<'code'> & ExtraProps;
// React-markdown passes full HTMLAttributes + ExtraProps for each element —
// use PropsWithChildren<ExtraProps> so the component type is assignable to
// ElementType<ClassAttributes<HTMLxElement> & HTMLAttributes<HTMLxElement> & ExtraProps>.
type MdChildProps = React.PropsWithChildren<ExtraProps>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractToc(markdown: string): TocEntry[] {
  const lines = markdown.split('\n');
  const toc: TocEntry[] = [];
  for (const line of lines) {
    const match = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (match) {
      const text = match[2].replace(/[*_`]/g, '');
      toc.push({ id: slugify(text), level: match[1].length, text });
    }
  }
  return toc;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ---------------------------------------------------------------------------
// Copy section button
// ---------------------------------------------------------------------------

function CopySectionButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 focus:opacity-100 ml-3 inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs border border-[var(--arc-earth)]/30 bg-[var(--arc-earth)]/10 text-[var(--arc-earth)] hover:bg-[var(--arc-earth)]/20 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--arc-earth)]/60 print:hidden"
      aria-label={`Copy section`}
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Table of contents
// ---------------------------------------------------------------------------

interface TocPanelProps {
  entries: TocEntry[];
  activeId: string;
  onNavigate: (id: string) => void;
}

function TocPanel({ entries, activeId, onNavigate }: TocPanelProps) {
  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="flex flex-col gap-0.5">
      <p className="mb-3 text-[10px] uppercase tracking-widest text-[var(--arc-earth)]/60 font-medium">
        Contents
      </p>
      {entries.map((entry) => (
        <button
          key={entry.id}
          onClick={() => onNavigate(entry.id)}
          className={`
            text-left text-sm rounded px-2 py-1.5 transition-colors w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--arc-earth)]/60
            ${entry.level === 1 ? 'font-semibold' : entry.level === 2 ? 'pl-4 font-normal' : 'pl-6 font-normal text-xs'}
            ${
              activeId === entry.id
                ? 'text-[var(--arc-earth)] bg-[var(--arc-earth)]/10'
                : 'text-[var(--arc-earth)] hover:text-[var(--arc-earth)] hover:bg-[var(--arc-earth)]/5'
            }
          `}
          aria-current={activeId === entry.id ? 'location' : undefined}
        >
          {entry.text}
        </button>
      ))}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Mobile ToC menu
// ---------------------------------------------------------------------------

function MobileToc({
  entries,
  activeId,
  onNavigate,
}: TocPanelProps) {
  const [open, setOpen] = useState(false);

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <div className="relative lg:hidden print:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--arc-earth)]/30 bg-[var(--arc-text-primary)]/50 text-sm text-[var(--arc-earth)] hover:bg-[var(--arc-earth)]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-earth)]/60"
        aria-expanded={open}
        aria-controls="mobile-toc"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        Contents
      </button>
      {open && (
        <div
          id="mobile-toc"
          className="absolute top-full left-0 mt-1 z-20 w-72 max-h-80 overflow-y-auto rounded-xl border border-[var(--arc-earth)]/30 bg-[var(--arc-text-primary)] p-3 shadow-xl"
        >
          <TocPanel entries={entries} activeId={activeId} onNavigate={handleNavigate} />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Markdown heading with copy button + scroll anchor
// ---------------------------------------------------------------------------

function GrimoireHeading({
  level,
  children,
  ...props
}: MdHeadingProps) {
  const text =
    typeof children === 'string'
      ? children
      : Array.isArray(children)
      ? children
          .map((c) => (typeof c === 'string' ? c : ''))
          .join('')
      : '';
  const id = slugify(text);

  const Tag = `h${Math.min(level, 6)}` as HeadingTag;

  const sizeClass =
    level === 1
      ? 'text-2xl sm:text-3xl font-bold mt-10 mb-4 text-[var(--arc-earth)]'
      : level === 2
      ? 'text-xl sm:text-2xl font-semibold mt-8 mb-3 text-[var(--arc-earth)]'
      : 'text-lg font-semibold mt-6 mb-2 text-[var(--arc-earth)]';

  return (
    <Tag
      id={id}
      className={`group flex items-baseline gap-1 scroll-mt-24 ${sizeClass}`}
      {...props}
    >
      {level === 1 && (
        <span className="mr-1 text-[var(--arc-earth)]/60 select-none" aria-hidden="true">
          ✦
        </span>
      )}
      {children}
      <CopySectionButton text={text} />
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function GrimoireViewer({
  content,
  worldName,
  tier,
  generatedAt,
}: GrimoireViewerProps) {
  const toc = extractToc(content);
  const [activeId, setActiveId] = useState(toc[0]?.id ?? '');
  const contentRef = useRef<HTMLDivElement>(null);

  // Track active heading via IntersectionObserver
  useEffect(() => {
    if (!contentRef.current || toc.length === 0) return;
    const headings = contentRef.current.querySelectorAll<HTMLElement>(
      'h1[id], h2[id], h3[id]'
    );
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [content, toc.length]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  }, []);

  return (
    <div className="flex gap-8 lg:gap-12 items-start">
      {/* Sticky desktop ToC */}
      <aside
        className="hidden lg:block w-56 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto print:hidden"
        aria-label="Table of contents sidebar"
      >
        <TocPanel entries={toc} activeId={activeId} onNavigate={scrollTo} />
      </aside>

      {/* Grimoire content parchment */}
      <div className="flex-1 min-w-0">
        {/* Mobile ToC */}
        <div className="mb-6">
          <MobileToc entries={toc} activeId={activeId} onNavigate={scrollTo} />
        </div>

        {/* Parchment header */}
        <div className="mb-8 text-center border-b border-[var(--arc-earth)]/30 pb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--arc-earth)]/70 mb-2 font-medium">
            The Grimoire of
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--arc-cosmic-void)] mb-3 [font-family:var(--font-display),serif]">
            {worldName}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-[var(--arc-earth)]">
            <span>{tier} Edition</span>
            <span aria-hidden="true" className="text-[var(--arc-earth)]/40">
              ✦
            </span>
            <span>Forged {formatDate(generatedAt)}</span>
          </div>
          {/* Ornamental divider */}
          <div className="mt-6 flex items-center justify-center gap-3" aria-hidden="true">
            <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-[var(--arc-earth)]/40" />
            <span className="text-[var(--arc-earth)]/60 text-base">⚜</span>
            <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-[var(--arc-earth)]/40" />
          </div>
        </div>

        {/* Rendered markdown */}
        <div
          ref={contentRef}
          className="grimoire-prose max-w-none"
        >
          <ReactMarkdown
            components={{
              h1: (props: React.ComponentProps<'h1'> & ExtraProps) => <GrimoireHeading level={1} {...props} />,
              h2: (props: React.ComponentProps<'h2'> & ExtraProps) => <GrimoireHeading level={2} {...props} />,
              h3: (props: React.ComponentProps<'h3'> & ExtraProps) => <GrimoireHeading level={3} {...props} />,
              p: ({ children }: MdChildProps) => (
                <p className="mb-4 leading-relaxed text-[var(--arc-cosmic-void)] text-[15px] sm:text-base">
                  {children}
                </p>
              ),
              ul: ({ children }: MdChildProps) => (
                <ul className="mb-4 pl-5 space-y-1.5 list-none">
                  {children}
                </ul>
              ),
              ol: ({ children }: MdChildProps) => (
                <ol className="mb-4 pl-5 space-y-1.5 list-decimal text-[var(--arc-cosmic-void)]">
                  {children}
                </ol>
              ),
              li: ({ children }: MdChildProps) => (
                <li className="text-[var(--arc-cosmic-void)] text-[15px] sm:text-base flex items-start gap-2 before:content-['✦'] before:text-[var(--arc-earth)]/60 before:text-xs before:mt-1 before:shrink-0">
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }: MdChildProps) => (
                <strong className="font-semibold text-[var(--arc-cosmic-void)]">{children}</strong>
              ),
              em: ({ children }: MdChildProps) => (
                <em className="italic text-[var(--arc-earth)]">{children}</em>
              ),
              blockquote: ({ children }: MdChildProps) => (
                <blockquote className="my-6 pl-4 border-l-2 border-[var(--arc-earth)]/50 bg-[var(--arc-earth)]/5 py-2 pr-3 rounded-r-lg italic text-[var(--arc-earth)] text-sm">
                  {children}
                </blockquote>
              ),
              hr: () => (
                <div className="my-8 flex items-center justify-center gap-3" role="separator">
                  <div className="h-px flex-1 bg-[var(--arc-earth)]/25" />
                  <span className="text-[var(--arc-earth)]/50 text-sm">✦</span>
                  <div className="h-px flex-1 bg-[var(--arc-earth)]/25" />
                </div>
              ),
              code: ({ className, children, ...props }: MdCodeProps) => {
                const isBlock = /language-/.test(className ?? '');
                if (isBlock) {
                  return (
                    <pre className="my-4 overflow-x-auto rounded-lg bg-[var(--arc-text-primary)] p-4 text-sm font-mono text-[var(--arc-cosmic-void)] border border-[var(--arc-earth)]/20">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                }
                return (
                  <code
                    className="rounded px-1.5 py-0.5 bg-[var(--arc-earth)]/15 text-[var(--arc-earth)] font-mono text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              table: ({ children }: MdChildProps) => (
                <div className="my-6 overflow-x-auto rounded-xl border border-[var(--arc-earth)]/30">
                  <table className="w-full text-sm text-[var(--arc-cosmic-void)]">{children}</table>
                </div>
              ),
              thead: ({ children }: MdChildProps) => (
                <thead className="bg-[var(--arc-earth)]/15 text-[var(--arc-cosmic-void)] font-semibold">
                  {children}
                </thead>
              ),
              th: ({ children }: MdChildProps) => (
                <th className="px-4 py-3 text-left border-b border-[var(--arc-earth)]/30">
                  {children}
                </th>
              ),
              td: ({ children }: MdChildProps) => (
                <td className="px-4 py-3 border-b border-[var(--arc-earth)]/15">{children}</td>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Closing ornament */}
        <div className="mt-12 flex flex-col items-center gap-3 text-center" aria-hidden="true">
          <div className="flex items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--arc-earth)]/40" />
            <span className="text-[var(--arc-earth)]/70 text-lg">✦ ⚜ ✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--arc-earth)]/40" />
          </div>
          <p className="text-xs text-[var(--arc-earth)]/50 uppercase tracking-widest">
            End of Grimoire
          </p>
        </div>
      </div>

      {/* Print-only styles injected via a style tag approach */}
      <style
         
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .grimoire-prose { font-size: 11pt; line-height: 1.6; color: var(--arc-cosmic-void); }
              .grimoire-prose h1, .grimoire-prose h2, .grimoire-prose h3 { color: var(--arc-cosmic-void); page-break-after: avoid; }
              .grimoire-prose blockquote { border-left-color: var(--arc-earth); }
            }
          `,
        }}
      />
    </div>
  );
}
