'use client';

import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ExtraProps } from 'react-markdown';
import CodeBlock from './code-block';
import { ImageLightbox, type LightboxImage } from './image-lightbox';
import { ArrowsOut } from '@/lib/phosphor-icons';

interface ChatMarkdownProps {
  content: string;
  isStreaming?: boolean;
}

// ---------------------------------------------------------------------------
// Helper — extract all image URLs from markdown content for lightbox nav
// ---------------------------------------------------------------------------

const IMG_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;

function extractImages(content: string): LightboxImage[] {
  const results: LightboxImage[] = [];
  let match: RegExpExecArray | null;
  while ((match = IMG_REGEX.exec(content)) !== null) {
    results.push({ src: match[2], alt: match[1] || undefined });
  }
  return results;
}

// Typed markdown component props
type MdProps = { children?: React.ReactNode };
type MdCodeProps = React.ComponentProps<'code'> & ExtraProps;
type MdImgProps = React.ComponentProps<'img'> & ExtraProps;
type MdAnchorProps = React.ComponentProps<'a'> & ExtraProps;

export default function ChatMarkdown({ content, isStreaming }: ChatMarkdownProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Memoize image list so lightbox navigation works across all images in the message
  const allImages = useMemo(() => extractImages(content), [content]);

  // When a markdown <img> is clicked, find its index in the extracted list
  const openLightbox = (src: string) => {
    const idx = allImages.findIndex((img) => img.src === src);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  return (
    <div className={isStreaming ? 'streaming-text' : undefined}>
      <ReactMarkdown
        components={{
          // Code blocks with syntax highlighting + copy
          code({ className, children, ...props }: MdCodeProps) {
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

          // Clickable images that open lightbox
          img({ src, alt }: MdImgProps) {
            if (!src) return null;
            return (
              <button
                type="button"
                className="block max-w-[400px] w-full rounded-xl overflow-hidden border border-white/[0.06] cursor-pointer group/mdimg hover:shadow-[0_0_16px_rgba(0,188,212,0.1)] transition-all my-2 focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
                onClick={() => typeof src === 'string' && openLightbox(src)}
                aria-label={alt ? `View ${alt}` : 'Open image in lightbox'}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={src as string}
                    alt={alt || 'Image'}
                    className="w-full h-auto transition-transform duration-300 group-hover/mdimg:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/mdimg:bg-black/20 transition-colors flex items-center justify-center">
                    <ArrowsOut className="w-5 h-5 text-white/0 group-hover/mdimg:text-white/80 transition-colors" />
                  </div>
                </div>
              </button>
            );
          },

          // Links open in new tab
          a({ href, children }: MdAnchorProps) {
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
          blockquote({ children }: MdProps) {
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
          table({ children }: MdProps) {
            return (
              <div className="overflow-x-auto my-3 rounded-lg border border-white/[0.06]">
                <table className="w-full text-sm">{children}</table>
              </div>
            );
          },
          th({ children }: MdProps) {
            return (
              <th className="text-left px-3 py-2 bg-white/[0.04] text-white/60 font-medium text-xs uppercase tracking-wider border-b border-white/[0.06]">
                {children}
              </th>
            );
          },
          tr({ children, ...props }: MdProps & React.ComponentProps<'tr'>) {
            return (
              <tr className="even:bg-white/[0.02]" {...props}>
                {children}
              </tr>
            );
          },
          td({ children }: MdProps) {
            return (
              <td className="px-3 py-2 border-b border-white/[0.04] text-white/80">
                {children}
              </td>
            );
          },

          // Lists with better styling
          ul({ children }: MdProps) {
            return <ul className="list-disc list-outside ml-5 space-y-1.5 my-2.5">{children}</ul>;
          },
          ol({ children }: MdProps) {
            return <ol className="list-decimal list-outside ml-5 space-y-1.5 my-2.5">{children}</ol>;
          },
          li({ children }: MdProps) {
            return <li className="pl-1 leading-[1.7]">{children}</li>;
          },

          // Headings with anchors
          h1({ children }: MdProps) {
            return <h1 className="text-xl font-semibold text-white/95 mt-5 mb-2">{children}</h1>;
          },
          h2({ children }: MdProps) {
            return <h2 className="text-lg font-semibold text-white/95 mt-4 mb-2">{children}</h2>;
          },
          h3({ children }: MdProps) {
            return <h3 className="text-base font-semibold text-white/90 mt-3 mb-1.5">{children}</h3>;
          },

          // Paragraphs
          p({ children }: MdProps) {
            return <p className="my-2 leading-[1.7]">{children}</p>;
          },

          // Bold / emphasis
          strong({ children }: MdProps) {
            return <strong className="font-semibold text-white/95">{children}</strong>;
          },
          em({ children }: MdProps) {
            return <em className="italic text-white/70">{children}</em>;
          },
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Shared lightbox for all images in this markdown block */}
      {lightboxIndex !== null && allImages.length > 0 && (
        <ImageLightbox
          images={allImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
