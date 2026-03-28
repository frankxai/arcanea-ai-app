'use client';

import React, { useState } from 'react';
import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';

interface SyntaxHighlighterProps {
  children?: string;
  style?: Record<string, React.CSSProperties>;
  language?: string;
  showLineNumbers?: boolean;
  wrapLines?: boolean;
  wrapLongLines?: boolean;
  customStyle?: React.CSSProperties;
  codeTagProps?: React.HTMLAttributes<HTMLElement>;
  PreTag?: string | ComponentType;
  className?: string;
  [key: string]: unknown;
}

const SyntaxHighlighter = dynamic<SyntaxHighlighterProps>(
  () => import('react-syntax-highlighter/dist/esm/prism').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 bg-[#111113] text-[13px] font-mono text-white/60 animate-pulse">
        Loading...
      </div>
    ),
  },
);

const stylePromise = import('react-syntax-highlighter/dist/esm/styles/prism').then(
  (mod) => mod.vscDarkPlus,
);

interface CodeBlockProps {
  language: string;
  children: string;
}

export default function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<Record<string, React.CSSProperties> | null>(null);

  // Load style lazily on first render
  React.useEffect(() => {
    stylePromise.then((s) => setStyle(s as Record<string, React.CSSProperties>));
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = children;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group rounded-xl overflow-hidden my-3 border border-white/[0.06] shadow-lg shadow-black/20 max-w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-t-2 border-t-[#00bcd4]/30 border-b border-b-white/[0.06]">
        <span className="text-[11px] text-[#00bcd4]/60 font-mono uppercase tracking-wider select-none">
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-white/50 hover:text-[#00bcd4] hover:bg-white/[0.06] transition-all"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {style && (
        <SyntaxHighlighter
          style={style}
          language={language}
          PreTag="div"
          wrapLongLines={false}
          customStyle={{
            margin: 0,
            padding: '16px',
            background: '#111113',
            fontSize: '13px',
            lineHeight: '1.6',
            overflowX: 'auto',
            maxWidth: '100%',
          }}
          codeTagProps={{
            style: { fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' },
          }}
        >
          {children}
        </SyntaxHighlighter>
      )}

      {!style && (
        <pre className="p-4 bg-[#111113] text-[13px] leading-[1.6] overflow-x-auto max-w-full">
          <code style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' }} className="text-white/80">
            {children}
          </code>
        </pre>
      )}
    </div>
  );
}
