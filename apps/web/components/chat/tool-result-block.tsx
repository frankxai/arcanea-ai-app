'use client';

import React, { useState } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { InlineImage } from './inline-image';
import { ResearchProgress } from './research-progress';
import ChatMarkdown from './chat-markdown';
import {
  CaretRight,
  CaretDown,
  CircleNotch,
  Check,
  WarningCircle,
  ImageSquare,
  Wrench,
  MagnifyingGlass,
  Brain,
  BookOpen,
} from '@/lib/phosphor-icons';

const cardEnter = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ToolResultBlockProps {
  toolName: string;
  result: unknown;
  isLoading?: boolean;
}

// Tool display metadata
interface ToolMeta {
  icon: React.ReactNode;
  label: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getToolMeta(toolName: string): ToolMeta {
  const map: Record<string, ToolMeta> = {
    image_generate: {
      icon: <ImageSquare className="w-3.5 h-3.5" />,
      label: 'Image Generation',
    },
    generate_image: {
      icon: <ImageSquare className="w-3.5 h-3.5" />,
      label: 'Image Generation',
    },
    web_search: {
      icon: <MagnifyingGlass className="w-3.5 h-3.5" />,
      label: 'Web Search',
    },
    memory_store: {
      icon: <Brain className="w-3.5 h-3.5" />,
      label: 'Memory',
    },
    deep_research: {
      icon: <BookOpen className="w-3.5 h-3.5" />,
      label: 'Deep Research',
    },
    code_interpreter: {
      icon: <Wrench className="w-3.5 h-3.5" />,
      label: 'Code Interpreter',
    },
  };

  return (
    map[toolName] || {
      icon: <Wrench className="w-3.5 h-3.5" />,
      label: toolName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }
  );
}

// ---------------------------------------------------------------------------
// Web Search Results renderer
// ---------------------------------------------------------------------------

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function SearchResults({ result }: { result: { query: string; results: Array<{ title: string; url: string; content: string; score?: number }>; answer?: string; error?: string } }) {
  if (result.error) {
    return <p className="text-red-400 text-sm">{result.error}</p>;
  }

  return (
    <div className="space-y-2">
      {result.answer && (
        <div className="mb-3 pb-3 border-b border-white/[0.06] p-3 rounded-lg bg-[#00bcd4]/[0.04] border border-[#00bcd4]/10">
          <p className="text-sm text-white/80 leading-relaxed">{result.answer}</p>
        </div>
      )}
      {result.results.map((r, i) => {
        const domain = getDomain(r.url);
        return (
          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
            className="block p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.08] transition-all group">
            <div className="flex items-center gap-2 mb-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`} alt="" width={16} height={16} className="w-4 h-4 rounded-sm" loading="lazy" />
              <span className="text-xs text-white/30">{domain}</span>
            </div>
            <p className="text-sm text-[#00bcd4] group-hover:text-[#26cccc] font-medium line-clamp-1">{r.title}</p>
            <p className="text-xs text-white/40 mt-1 line-clamp-2">{r.content}</p>
          </a>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Memory Saved Indicator
// ---------------------------------------------------------------------------

function MemorySavedIndicator({ result }: { result: { content: string; category: string; saved?: boolean; error?: string } }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <Brain className="w-4 h-4 text-[#00bcd4]" />
      <span className="text-sm text-white/50">
        {result.saved !== false ? `Remembered: "${result.content.slice(0, 80)}${result.content.length > 80 ? '...' : ''}"` : result.error || 'Memory not saved'}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Deep Research Report renderer
// ---------------------------------------------------------------------------

interface ResearchReportResult {
  report: string;
  sources: Array<{ title: string; url: string; snippet?: string }>;
  subQueries?: string[];
  totalSearches?: number;
  error?: string;
}

function ResearchReport({ result }: { result: ResearchReportResult }) {
  const [showSources, setShowSources] = useState(false);

  if (result.error) {
    return (
      <div className="py-2">
        <p className="text-red-400 text-sm">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Report content rendered as markdown */}
      <div className="text-sm text-white/80">
        <ChatMarkdown content={result.report} />
      </div>

      {/* Sources section */}
      {result.sources.length > 0 && (
        <div>
          <button
            onClick={() => setShowSources(!showSources)}
            className="text-xs text-white/30 hover:text-white/50 transition-colors flex items-center gap-1"
          >
            {showSources ? '\u25be' : '\u25b8'} {result.sources.length} sources
          </button>
          {showSources && (
            <div className="mt-2 space-y-1.5">
              {result.sources.map((s, i) => {
                let domain = '';
                try {
                  domain = new URL(s.url).hostname.replace('www.', '');
                } catch { /* ignore */ }
                return (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-all text-xs group"
                  >
                    <span className="text-white/20 font-mono">[{i + 1}]</span>
                    <div className="min-w-0">
                      <p className="text-[#00bcd4]/80 group-hover:text-[#00bcd4] truncate">
                        {s.title}
                      </p>
                      <p className="text-white/20 truncate">{domain}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

function isSearchResult(
  toolName: string,
  result: unknown,
): result is { query: string; results: Array<{ title: string; url: string; content: string; score?: number }>; answer?: string; error?: string } {
  return toolName === 'web_search' && typeof result === 'object' && result !== null && 'results' in result && Array.isArray((result as Record<string, unknown>).results);
}

function isMemoryResult(
  toolName: string,
  result: unknown,
): result is { content: string; category: string; saved?: boolean; error?: string } {
  return toolName === 'memory_store' && typeof result === 'object' && result !== null && 'content' in result;
}

function isImageResult(
  toolName: string,
  result: unknown,
): result is {
  url?: string;
  src?: string;
  data?: string;
  revised_prompt?: string;
  revisedPrompt?: string;
  prompt?: string;
  images?: Array<{
    url?: string;
    src?: string;
    data?: string;
    revised_prompt?: string;
    revisedPrompt?: string;
    prompt?: string;
  }>;
} {
  return (
    (toolName === 'image_generate' || toolName === 'generate_image') &&
    typeof result === 'object' &&
    result !== null
  );
}

function isResearchResult(
  toolName: string,
  result: unknown,
): result is ResearchReportResult {
  return (
    toolName === 'deep_research' &&
    typeof result === 'object' &&
    result !== null &&
    'report' in result &&
    'sources' in result
  );
}

function isErrorResult(result: unknown): result is { error: string } {
  return typeof result === 'object' && result !== null && 'error' in result;
}

// ---------------------------------------------------------------------------
// ToolResultBlock
// ---------------------------------------------------------------------------

export function ToolResultBlock({
  toolName,
  result,
  isLoading = false,
}: ToolResultBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = getToolMeta(toolName);
  const hasError = !isLoading && isErrorResult(result);

  // Determine status
  const status = isLoading ? 'running' : hasError ? 'error' : 'complete';

  const statusBadge = {
    running: (
      <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-[#00bcd4]/10 text-[#00bcd4] border border-[#00bcd4]/20">
        <CircleNotch className="w-3 h-3 animate-spin" />
        Running
      </span>
    ),
    complete: (
      <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <Check className="w-3 h-3" />
        Complete
      </span>
    ),
    error: (
      <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
        <WarningCircle className="w-3 h-3" />
        Error
      </span>
    ),
  };

  // Loading state — simple spinner (with research progress for deep_research)
  if (isLoading && !result) {
    if (toolName === 'deep_research') {
      return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
            <span className="text-white/50">{meta.icon}</span>
            <span className="text-xs text-white/70 font-medium flex-1">{meta.label}</span>
            {statusBadge.running}
          </div>
          <div className="px-3">
            <ResearchProgress isLoading />
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <CircleNotch className="w-4 h-4 text-[#00bcd4] animate-spin" />
        <span className="text-xs text-white/50">
          {meta.label}...
        </span>
      </div>
    );
  }

  // Web search — render rich search results
  if (isSearchResult(toolName, result)) {
    return (
      <LazyMotion features={domAnimation}>
      <m.div variants={cardEnter} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
          <span className="text-white/50">{meta.icon}</span>
          <span className="text-xs text-white/70 font-medium flex-1">{meta.label}: {result.query}</span>
          {statusBadge[status]}
        </div>
        <div className="px-3 py-2">
          <SearchResults result={result} />
        </div>
      </m.div>
      </LazyMotion>
    );
  }

  // Deep research — render full report with sources
  if (isResearchResult(toolName, result)) {
    return (
      <LazyMotion features={domAnimation}>
      <m.div variants={cardEnter} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
          <span className="text-white/50">{meta.icon}</span>
          <span className="text-xs text-white/70 font-medium flex-1">
            {meta.label}
            {result.totalSearches ? ` \u00b7 ${result.totalSearches} searches` : ''}
          </span>
          {statusBadge[status]}
        </div>
        <div className="px-3 py-2">
          <ResearchReport result={result} />
        </div>
      </m.div>
      </LazyMotion>
    );
  }

  // Memory store — render compact indicator
  if (isMemoryResult(toolName, result)) {
    return <MemorySavedIndicator result={result} />;
  }

  // Image generation — render inline image directly
  if (isImageResult(toolName, result)) {
    const imgResult = result;
    const imageItems = Array.isArray(imgResult.images) && imgResult.images.length > 0
      ? imgResult.images
      : [imgResult];

    if (imageItems.length > 0) {
      return (
        <div className="my-2 space-y-3">
          {imageItems.map((image, index) => {
            const imgSrc =
              image.url ||
              image.src ||
              (image.data ? `data:image/png;base64,${image.data}` : '');

            if (!imgSrc) return null;

            return (
              <InlineImage
                key={`${toolName}-${index}`}
                src={imgSrc}
                revisedPrompt={image.revisedPrompt || image.revised_prompt}
                prompt={image.prompt}
              />
            );
          })}
        </div>
      );
    }
  }

  // Error state
  if (hasError) {
    return (
      <div className="px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/5">
        <div className="flex items-center gap-2">
          <span className="text-white/50">{meta.icon}</span>
          <span className="text-xs text-white/70 font-medium">{meta.label}</span>
          {statusBadge.error}
        </div>
        <p className="text-xs text-red-400 mt-1">
          {(result as { error: string }).error}
        </p>
      </div>
    );
  }

  // Generic collapsible result
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.15)]">
      {/* Header — clickable */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={expanded}
      >
        {expanded ? (
          <CaretDown className="w-3 h-3 text-white/30 hover:text-white/50 transition-colors" />
        ) : (
          <CaretRight className="w-3 h-3 text-white/30 hover:text-white/50 transition-colors" />
        )}
        <span className="text-white/50">{meta.icon}</span>
        <span className="text-xs text-white/70 font-medium flex-1">
          {meta.label}
        </span>
        {statusBadge[status]}
      </button>

      {/* Expanded content */}
      {expanded && result != null && (
        <div className="border-t border-white/[0.06] px-3 py-2 max-h-[300px] overflow-auto">
          <pre className="text-[11px] text-white/50 font-mono whitespace-pre-wrap break-all leading-relaxed bg-[#0a0a0f] rounded-lg p-2 overflow-x-auto">
            {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ToolResultBlock;
