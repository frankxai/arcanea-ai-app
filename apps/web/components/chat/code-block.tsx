'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  children: string;
}

export default function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

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
    <div className="relative group rounded-xl overflow-hidden my-3 border border-white/[0.06]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-white/[0.06]">
        <span className="text-[11px] text-white/30 font-mono uppercase tracking-wider">
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
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

      <SyntaxHighlighter
        style={vscDarkPlus as Record<string, React.CSSProperties>}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '16px',
          background: '#111113',
          fontSize: '13px',
          lineHeight: '1.6',
        }}
        codeTagProps={{
          style: { fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)' },
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
