'use client';

import React, { useState } from 'react';
import { PhX, PhCode, PhCopy, PhCheck, PhArrowsOut } from '@/lib/phosphor-icons';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Artifact {
  id: string;
  type: 'code' | 'html' | 'svg' | 'markdown';
  title: string;
  content: string;
  language?: string;
}

interface ArtifactsPanelProps {
  artifact: Artifact | null;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// ArtifactsPanel — side panel for rendered code / HTML / SVG artifacts
// ---------------------------------------------------------------------------

export function ArtifactsPanel({ artifact, onClose }: ArtifactsPanelProps) {
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  if (!artifact) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
    {/* Mobile backdrop */}
    <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} aria-hidden="true" />
    <div
      className={`${
        fullscreen
          ? 'fixed inset-0 z-50'
          : 'fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] md:relative md:inset-auto md:z-auto md:w-[480px] md:shrink-0'
      } flex flex-col border-l border-white/[0.06] bg-[#0c0c0e] transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <PhCode className="w-4 h-4 text-[#00bcd4]" />
          <span className="text-sm font-medium text-white/80">
            {artifact.title}
          </span>
          {artifact.language && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 font-mono">
              {artifact.language}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
            aria-label="Copy artifact content"
          >
            {copied ? (
              <PhCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <PhCopy className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
            aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            <PhArrowsOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
            aria-label="Close artifacts panel"
          >
            <PhX className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {artifact.type === 'html' || artifact.type === 'svg' ? (
          <iframe
            srcDoc={artifact.content}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts"
            title={artifact.title}
          />
        ) : (
          <pre className="p-4 text-[13px] font-mono text-white/80 leading-relaxed whitespace-pre-wrap overflow-x-auto">
            <code>{artifact.content}</code>
          </pre>
        )}
      </div>
    </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// detectArtifact — parse artifact markers from AI response text
// ---------------------------------------------------------------------------

export function detectArtifact(text: string): Artifact | null {
  // Check for explicit artifact markers: ```artifact:Title
  const artifactMatch = text.match(/```artifact:([^\n]+)\n([\s\S]*?)```/);
  if (artifactMatch) {
    return {
      id: Date.now().toString(),
      type: 'code',
      title: artifactMatch[1].trim(),
      content: artifactMatch[2].trim(),
    };
  }

  // Check for HTML artifacts (large HTML blocks, 200+ chars)
  const htmlMatch = text.match(/```html\n([\s\S]{200,}?)```/);
  if (htmlMatch) {
    return {
      id: Date.now().toString(),
      type: 'html',
      title: 'Interactive Preview',
      content: htmlMatch[1].trim(),
    };
  }

  // Check for SVG
  const svgMatch = text.match(/```svg\n([\s\S]*?)```/);
  if (svgMatch) {
    return {
      id: Date.now().toString(),
      type: 'svg',
      title: 'Visual',
      content: svgMatch[1].trim(),
    };
  }

  // Large code blocks (200+ chars) get artifact treatment
  const codeMatch = text.match(/```(\w+)\n([\s\S]{200,}?)```/);
  if (codeMatch) {
    return {
      id: Date.now().toString(),
      type: 'code',
      title: `${codeMatch[1].charAt(0).toUpperCase() + codeMatch[1].slice(1)} Code`,
      content: codeMatch[2].trim(),
      language: codeMatch[1],
    };
  }

  return null;
}
