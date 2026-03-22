'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './code-block';

interface ChatMarkdownProps {
  content: string;
  isStreaming?: boolean;
}

export default function ChatMarkdown({ content, isStreaming }: ChatMarkdownProps) {
  return (
    <div className={isStreaming ? 'streaming-text' : undefined}>
    <ReactMarkdown
      components={{
        // Code blocks with syntax highlighting + copy
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');

          // Multi-line = fenced code block
          if (match || codeString.includes('\n')) {
            return (
              <CodeBlock language={match?.[1] || 'text'}>
                {codeString}
              </CodeBlock>
            );
          }

          // Inline code
          return (
            <code
              className="px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[#00bcd4] text-[13px] font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },

        // Links open in new tab
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00bcd4] hover:text-[#4dd0e1] underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          );
        },

        // Better blockquotes
        blockquote({ children }) {
          return (
            <blockquote className="border-l-2 border-[#00bcd4]/40 pl-4 my-3 text-white/60 italic bg-white/[0.02] py-1 rounded-r-md">
              {children}
            </blockquote>
          );
        },

        // Horizontal rules
        hr() {
          return <hr className="border-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent my-5" />;
        },

        // Tables
        table({ children }) {
          return (
            <div className="overflow-x-auto my-3 rounded-lg border border-white/[0.06]">
              <table className="w-full text-sm">{children}</table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="text-left px-3 py-2 bg-white/[0.04] text-white/60 font-medium text-xs uppercase tracking-wider border-b border-white/[0.06]">
              {children}
            </th>
          );
        },
        tr({ children, ...props }) {
          return (
            <tr className="even:bg-white/[0.02]" {...props}>
              {children}
            </tr>
          );
        },
        td({ children }) {
          return (
            <td className="px-3 py-2 border-b border-white/[0.04] text-white/80">
              {children}
            </td>
          );
        },

        // Lists with better styling
        ul({ children }) {
          return <ul className="list-disc list-outside ml-5 space-y-1.5 my-2.5">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal list-outside ml-5 space-y-1.5 my-2.5">{children}</ol>;
        },
        li({ children }) {
          return <li className="pl-1 leading-[1.7]">{children}</li>;
        },

        // Headings with anchors
        h1({ children }) {
          return <h1 className="text-xl font-semibold text-white/95 mt-5 mb-2">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-lg font-semibold text-white/95 mt-4 mb-2">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-base font-semibold text-white/90 mt-3 mb-1.5">{children}</h3>;
        },

        // Paragraphs
        p({ children }) {
          return <p className="my-2 leading-[1.7]">{children}</p>;
        },

        // Bold / emphasis
        strong({ children }) {
          return <strong className="font-semibold text-white/95">{children}</strong>;
        },
        em({ children }) {
          return <em className="italic text-white/70">{children}</em>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}
