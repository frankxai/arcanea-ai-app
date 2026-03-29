'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Lazy-load syntax highlighter (~280KB) — only rendered when code blocks appear
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => mod.Prism),
  { ssr: false, loading: () => null }
);

// ---------------------------------------------------------------------------
// Language metadata: display name, icon color, and a tiny SVG icon per lang
// ---------------------------------------------------------------------------
const LANG_META: Record<string, { label: string; color: string }> = {
  javascript:  { label: 'JavaScript',  color: '#f7df1e' },
  js:          { label: 'JavaScript',  color: '#f7df1e' },
  typescript:  { label: 'TypeScript',  color: '#3178c6' },
  ts:          { label: 'TypeScript',  color: '#3178c6' },
  tsx:         { label: 'TSX',         color: '#3178c6' },
  jsx:         { label: 'JSX',         color: '#f7df1e' },
  python:      { label: 'Python',      color: '#3776ab' },
  py:          { label: 'Python',      color: '#3776ab' },
  rust:        { label: 'Rust',        color: '#dea584' },
  go:          { label: 'Go',          color: '#00add8' },
  java:        { label: 'Java',        color: '#ed8b00' },
  c:           { label: 'C',           color: '#a8b9cc' },
  cpp:         { label: 'C++',         color: '#00599c' },
  csharp:      { label: 'C#',          color: '#239120' },
  cs:          { label: 'C#',          color: '#239120' },
  ruby:        { label: 'Ruby',        color: '#cc342d' },
  rb:          { label: 'Ruby',        color: '#cc342d' },
  php:         { label: 'PHP',         color: '#777bb4' },
  swift:       { label: 'Swift',       color: '#fa7343' },
  kotlin:      { label: 'Kotlin',      color: '#7f52ff' },
  html:        { label: 'HTML',        color: '#e34f26' },
  css:         { label: 'CSS',         color: '#1572b6' },
  scss:        { label: 'SCSS',        color: '#cf649a' },
  sass:        { label: 'Sass',        color: '#cf649a' },
  json:        { label: 'JSON',        color: '#292929' },
  yaml:        { label: 'YAML',        color: '#cb171e' },
  yml:         { label: 'YAML',        color: '#cb171e' },
  markdown:    { label: 'Markdown',    color: '#ffffff' },
  md:          { label: 'Markdown',    color: '#ffffff' },
  bash:        { label: 'Bash',        color: '#4eaa25' },
  sh:          { label: 'Shell',       color: '#4eaa25' },
  shell:       { label: 'Shell',       color: '#4eaa25' },
  zsh:         { label: 'Zsh',         color: '#4eaa25' },
  powershell:  { label: 'PowerShell',  color: '#5391fe' },
  sql:         { label: 'SQL',         color: '#e38c00' },
  graphql:     { label: 'GraphQL',     color: '#e535ab' },
  docker:      { label: 'Docker',      color: '#2496ed' },
  dockerfile:  { label: 'Dockerfile',  color: '#2496ed' },
  toml:        { label: 'TOML',        color: '#9c4121' },
  xml:         { label: 'XML',         color: '#0060ac' },
  lua:         { label: 'Lua',         color: '#000080' },
  r:           { label: 'R',           color: '#276dc3' },
  dart:        { label: 'Dart',        color: '#00b4ab' },
  elixir:      { label: 'Elixir',      color: '#6e4a7e' },
  haskell:     { label: 'Haskell',     color: '#5e5086' },
  scala:       { label: 'Scala',       color: '#dc322f' },
  text:        { label: 'Plain Text',  color: '#888888' },
  plaintext:   { label: 'Plain Text',  color: '#888888' },
};

function getLangMeta(lang: string) {
  const key = lang.toLowerCase().trim();
  return LANG_META[key] ?? { label: lang || 'Code', color: '#888888' };
}

// ---------------------------------------------------------------------------
// Custom style — loads lazily alongside SyntaxHighlighter
// ---------------------------------------------------------------------------
const CODE_BG = '#0d0d14';

// Style loaded on demand, cached after first load
let cachedStyle: Record<string, React.CSSProperties> | null = null;
const stylePromise = typeof window !== 'undefined'
  ? import('react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus').then((mod) => {
      const base = (mod.default || mod) as Record<string, React.CSSProperties>;
      cachedStyle = {
        ...base,
        'pre[class*="language-"]': { ...base['pre[class*="language-"]'], background: CODE_BG, margin: 0 },
        'code[class*="language-"]': { ...base['code[class*="language-"]'], background: CODE_BG },
      };
      return cachedStyle;
    })
  : Promise.resolve(null);

function useHighlightStyle() {
  const [style, setStyle] = useState<Record<string, React.CSSProperties> | null>(cachedStyle);
  useEffect(() => {
    if (cachedStyle) { setStyle(cachedStyle); return; }
    stylePromise.then((s) => { if (s) setStyle(s); });
  }, []);
  return style;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 8.5L6.5 12L13 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LangDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
      style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
    />
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface CodeBlockProps {
  language: string;
  children: string;
  showLineNumbers?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CodeBlock({
  language,
  children,
  showLineNumbers: showLineNumbersProp,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const highlightStyle = useHighlightStyle();

  const code = children.replace(/\n$/, '');
  const lineCount = code.split('\n').length;

  // Show line numbers by default when > 5 lines, unless explicitly overridden
  const showLineNumbers = showLineNumbersProp ?? lineCount > 5;

  const meta = useMemo(() => getLangMeta(language), [language]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback for older browsers / insecure contexts
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="code-block-wrapper relative group rounded-xl overflow-hidden my-3 border border-white/[0.07] shadow-lg shadow-black/30">
      {/* ---- Header bar ---- */}
      <div
        className="flex items-center justify-between px-4 py-2 select-none"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #12121a 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Language badge */}
        <div className="flex items-center gap-2">
          <LangDot color={meta.color} />
          <span
            className="text-[11px] font-medium font-mono tracking-wide"
            style={{ color: `${meta.color}cc` }}
          >
            {meta.label}
          </span>
          <span className="text-[10px] text-white/20 font-mono">
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </span>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`
            flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium
            transition-all duration-200 cursor-pointer
            ${copied
              ? 'text-emerald-400 bg-emerald-400/10'
              : 'text-white/40 hover:text-[#00bcd4] hover:bg-white/[0.06]'
            }
          `}
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <CheckIcon />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* ---- Code body ---- */}
      <div className="code-block-body overflow-auto" style={{ maxHeight: '500px' }}>
        {!highlightStyle ? (
          <pre className="p-4 text-[13px] text-white/70 font-mono whitespace-pre-wrap leading-[1.65]" style={{ background: CODE_BG }}>
            <code>{code}</code>
          </pre>
        ) : (
        <SyntaxHighlighter
          style={highlightStyle}
          language={language || 'text'}
          PreTag="div"
          showLineNumbers={showLineNumbers}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            color: 'rgba(255,255,255,0.15)',
            fontSize: '12px',
            textAlign: 'right',
            userSelect: 'none',
            borderRight: '1px solid rgba(255,255,255,0.04)',
            marginRight: '1em',
          }}
          customStyle={{
            margin: 0,
            padding: showLineNumbers ? '14px 16px 14px 0' : '14px 16px',
            background: CODE_BG,
            fontSize: '13px',
            lineHeight: '1.65',
            overflow: 'auto',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'var(--font-mono, "JetBrains Mono", "Fira Code", "Cascadia Code", monospace)',
              fontVariantLigatures: 'common-ligatures',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
        )}
      </div>

      {/* ---- Inline styles for custom scrollbars ---- */}
      <style jsx>{`
        .code-block-body::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .code-block-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .code-block-body::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
        }
        .code-block-body::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .code-block-body::-webkit-scrollbar-corner {
          background: transparent;
        }
        /* Firefox */
        .code-block-body {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
        }
      `}</style>
    </div>
  );
}
