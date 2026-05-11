/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
  javascript:  { label: 'JavaScript',  color: 'var(--arc-brand-arcanean-gold)' },
  js:          { label: 'JavaScript',  color: 'var(--arc-brand-arcanean-gold)' },
  typescript:  { label: 'TypeScript',  color: 'var(--arc-brand-cosmic-blue)' },
  ts:          { label: 'TypeScript',  color: 'var(--arc-brand-cosmic-blue)' },
  tsx:         { label: 'TSX',         color: 'var(--arc-brand-cosmic-blue)' },
  jsx:         { label: 'JSX',         color: 'var(--arc-brand-arcanean-gold)' },
  python:      { label: 'Python',      color: 'var(--arc-brand-cosmic-blue)' },
  py:          { label: 'Python',      color: 'var(--arc-brand-cosmic-blue)' },
  rust:        { label: 'Rust',        color: 'var(--arc-fire)' },
  go:          { label: 'Go',          color: 'var(--arc-brand-atlantean-teal)' },
  java:        { label: 'Java',        color: 'var(--arc-fire)' },
  c:           { label: 'C',           color: 'var(--arc-text-primary)' },
  cpp:         { label: 'C++',         color: 'var(--arc-brand-cosmic-blue)' },
  csharp:      { label: 'C#',          color: 'var(--arc-earth)' },
  cs:          { label: 'C#',          color: 'var(--arc-earth)' },
  ruby:        { label: 'Ruby',        color: 'var(--arc-fire)' },
  rb:          { label: 'Ruby',        color: 'var(--arc-fire)' },
  php:         { label: 'PHP',         color: 'var(--arc-void)' },
  swift:       { label: 'Swift',       color: 'var(--arc-fire)' },
  kotlin:      { label: 'Kotlin',      color: 'var(--arc-void)' },
  html:        { label: 'HTML',        color: 'var(--arc-fire)' },
  css:         { label: 'CSS',         color: 'var(--arc-brand-cosmic-blue)' },
  scss:        { label: 'SCSS',        color: 'var(--arc-earth)' },
  sass:        { label: 'Sass',        color: 'var(--arc-earth)' },
  json:        { label: 'JSON',        color: 'var(--arc-cosmic-void)' },
  yaml:        { label: 'YAML',        color: 'var(--arc-fire)' },
  yml:         { label: 'YAML',        color: 'var(--arc-fire)' },
  markdown:    { label: 'Markdown',    color: 'var(--arc-text-primary)' },
  md:          { label: 'Markdown',    color: 'var(--arc-text-primary)' },
  bash:        { label: 'Bash',        color: 'var(--arc-earth)' },
  sh:          { label: 'Shell',       color: 'var(--arc-earth)' },
  shell:       { label: 'Shell',       color: 'var(--arc-earth)' },
  zsh:         { label: 'Zsh',         color: 'var(--arc-earth)' },
  powershell:  { label: 'PowerShell',  color: 'var(--arc-void)' },
  sql:         { label: 'SQL',         color: 'var(--arc-fire)' },
  graphql:     { label: 'GraphQL',     color: 'var(--arc-void)' },
  docker:      { label: 'Docker',      color: 'var(--arc-brand-atlantean-teal)' },
  dockerfile:  { label: 'Dockerfile',  color: 'var(--arc-brand-atlantean-teal)' },
  toml:        { label: 'TOML',        color: 'var(--arc-earth)' },
  xml:         { label: 'XML',         color: 'var(--arc-brand-cosmic-blue)' },
  lua:         { label: 'Lua',         color: 'var(--arc-brand-cosmic-blue)' },
  r:           { label: 'R',           color: 'var(--arc-brand-cosmic-blue)' },
  dart:        { label: 'Dart',        color: 'var(--arc-brand-atlantean-teal)' },
  elixir:      { label: 'Elixir',      color: 'var(--arc-earth)' },
  haskell:     { label: 'Haskell',     color: 'var(--arc-earth)' },
  scala:       { label: 'Scala',       color: 'var(--arc-fire)' },
  text:        { label: 'Plain Text',  color: 'var(--arc-earth)' },
  plaintext:   { label: 'Plain Text',  color: 'var(--arc-earth)' },
};

function getLangMeta(lang: string) {
  const key = lang.toLowerCase().trim();
  return LANG_META[key] ?? { label: lang || 'Code', color: 'var(--arc-earth)' };
}

// ---------------------------------------------------------------------------
// Custom style — loads lazily alongside SyntaxHighlighter
// ---------------------------------------------------------------------------
const CODE_BG = 'var(--arc-cosmic-void)';

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
          background: 'linear-gradient(135deg, var(--arc-cosmic-void) 0%, var(--arc-cosmic-void) 100%)',
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
              : 'text-white/40 hover:text-[var(--arc-brand-atlantean-teal)] hover:bg-white/[0.06]'
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
