/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PhLightning, PhX, PhCheck, PhCircleNotch } from '@/lib/phosphor-icons';
import ChatMarkdown from './chat-markdown';

// ---------------------------------------------------------------------------
// Beam Mode — Send same prompt to multiple models, compare side-by-side
// Inspired by big-AGI's killer feature, adapted for Arcanea's MoE system
// ---------------------------------------------------------------------------

interface BeamModel {
  id: string;
  shortName: string;
  color: string;
}

const BEAM_MODELS: BeamModel[] = [
  { id: 'arcanea-gemini-flash', shortName: 'Flash', color: 'var(--arc-brand-atlantean-teal)' },
  { id: 'arcanea-sonnet', shortName: 'Sonnet', color: 'var(--arc-fire)' },
  { id: 'arcanea-gpt5', shortName: 'GPT-5', color: 'var(--arc-brand-atlantean-teal)' },
  { id: 'arcanea-grok', shortName: 'Grok', color: 'var(--arc-text-primary)' },
  { id: 'arcanea-deepseek', shortName: 'DeepSeek', color: 'var(--arc-void)' },
  { id: 'arcanea-opus', shortName: 'Opus', color: 'var(--arc-brand-atlantean-teal)' },
  { id: 'arcanea-gemini-pro', shortName: 'Gemini Pro', color: 'var(--arc-earth)' },
  { id: 'arcanea-haiku', shortName: 'Haiku', color: 'var(--arc-text-primary)' },
];

interface BeamResponse {
  modelId: string;
  shortName: string;
  color: string;
  text: string;
  status: 'pending' | 'streaming' | 'done' | 'error';
  error?: string;
}

interface BeamModeProps {
  prompt: string;
  provider?: string;
  clientApiKey?: string;
  focusHint?: string;
  onSelectResponse: (text: string, modelId: string) => void;
  onClose: () => void;
}

export function BeamMode({ prompt, provider, clientApiKey, focusHint, onSelectResponse, onClose }: BeamModeProps) {
  const [selectedModels, setSelectedModels] = useState<string[]>([
    'arcanea-gemini-flash', 'arcanea-sonnet', 'arcanea-deepseek',
  ]);
  const [responses, setResponses] = useState<BeamResponse[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedText, setMergedText] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const abortRef = useRef<AbortController[]>([]);
  const mergeAbortRef = useRef<AbortController | null>(null);

  const toggleModel = useCallback((modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : prev.length < 4 ? [...prev, modelId] : prev
    );
  }, []);

  const runBeam = useCallback(async () => {
    if (selectedModels.length < 2) return;
    setIsRunning(true);

    // Initialize responses
    const initial: BeamResponse[] = selectedModels.map((id) => {
      const model = BEAM_MODELS.find((m) => m.id === id);
      return {
        modelId: id,
        shortName: model?.shortName || id,
        color: model?.color || 'var(--arc-text-primary)',
        text: '',
        status: 'pending',
      };
    });
    setResponses(initial);

    // Abort any previous requests
    abortRef.current.forEach((c) => c.abort());
    abortRef.current = [];

    // Fire parallel requests
    const promises = selectedModels.map(async (modelId, idx) => {
      const controller = new AbortController();
      abortRef.current.push(controller);

      try {
        setResponses((prev) => prev.map((r, i) => i === idx ? { ...r, status: 'streaming' } : r));

        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            gatewayModel: modelId,
            provider,
            clientApiKey,
            focusHint,
            maxTokens: 2048,
          }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => `HTTP ${res.status}`);
          throw new Error(errText || `HTTP ${res.status}`);
        }

        // Read streaming response
        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setResponses((prev) => prev.map((r, i) => i === idx ? { ...r, text: fullText } : r));
        }

        setResponses((prev) => prev.map((r, i) => i === idx ? { ...r, status: 'done', text: fullText } : r));
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setResponses((prev) => prev.map((r, i) => i === idx ? {
          ...r, status: 'error', error: (err as Error).message
        } : r));
      }
    });

    await Promise.allSettled(promises);
    setIsRunning(false);
  }, [selectedModels, prompt, provider, clientApiKey, focusHint]);

  // ---------------------------------------------------------------------------
  // Merge — synthesize best parts from all completed responses
  // ---------------------------------------------------------------------------
  const handleMerge = useCallback(async () => {
    const doneResponses = responses.filter((r) => r.status === 'done');
    if (doneResponses.length < 2) return;

    setIsMerging(true);
    setMergedText('');

    // Abort any previous merge
    mergeAbortRef.current?.abort();
    const controller = new AbortController();
    mergeAbortRef.current = controller;

    const mergePrompt = `You are a synthesis expert. Below are ${doneResponses.length} responses to the same prompt from different AI models. Analyze them and create a single response that takes the best parts from each — the most insightful points, the clearest explanations, the most creative ideas. Do not simply concatenate. Synthesize into a response better than any individual one.

PROMPT: "${prompt}"

${doneResponses.map((r, i) => `--- RESPONSE ${i + 1} (${r.shortName}) ---\n${r.text}`).join('\n\n')}

--- YOUR SYNTHESIS ---`;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [{ role: 'user', content: mergePrompt }],
          gatewayModel: 'arcanea-auto',
          maxTokens: 4096,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => `HTTP ${res.status}`);
        throw new Error(errText || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMergedText(fullText);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMergedText(`_Merge failed: ${(err as Error).message}_`);
      }
    } finally {
      setIsMerging(false);
    }
  }, [responses, prompt]);

  // ---------------------------------------------------------------------------
  // Compare — build structured comparison of key aspects
  // ---------------------------------------------------------------------------
  const compareRows = React.useMemo(() => {
    const doneResponses = responses.filter((r) => r.status === 'done');
    if (doneResponses.length < 2) return [];

    const aspects = ['Length', 'Key Strengths', 'Approach'];
    return aspects.map((aspect) => ({
      aspect,
      values: doneResponses.map((r) => {
        if (aspect === 'Length') {
          const words = r.text.split(/\s+/).length;
          return `${words} words`;
        }
        if (aspect === 'Key Strengths') {
          const hasCode = /```/.test(r.text);
          const hasList = /^[-*]\s/m.test(r.text);
          const hasHeadings = /^#+\s/m.test(r.text);
          const traits: string[] = [];
          if (hasCode) traits.push('Code examples');
          if (hasList) traits.push('Structured lists');
          if (hasHeadings) traits.push('Section headings');
          if (!traits.length) traits.push('Prose narrative');
          return traits.join(', ');
        }
        // Approach — first ~80 chars as a teaser
        const first = r.text.replace(/^#+\s.*\n/m, '').trim();
        return first.slice(0, 80) + (first.length > 80 ? '...' : '');
      }),
    }));
  }, [responses]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current.forEach((c) => c.abort());
      mergeAbortRef.current?.abort();
    };
  }, []);

  const allDone = responses.length > 0 && responses.every((r) => r.status === 'done' || r.status === 'error');

  return (
    <div className="fixed inset-0 z-50 bg-[var(--arc-cosmic-void)]/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <PhLightning className="w-5 h-5 text-[var(--arc-brand-arcanean-gold)] shrink-0" />
          <h2 className="text-base sm:text-lg font-semibold text-white whitespace-nowrap">Beam Mode</h2>
          <span className="hidden sm:inline text-sm text-white/40">Compare models side-by-side</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
          aria-label="Close beam mode"
        >
          <PhX className="w-5 h-5" />
        </button>
      </div>

      {/* Prompt display */}
      <div className="px-4 sm:px-6 py-3 border-b border-white/[0.04]">
        <p className="text-xs sm:text-sm text-white/60 truncate">{prompt}</p>
      </div>

      {/* Model selector (if not running) */}
      {!isRunning && responses.length === 0 && (
        <div className="px-4 sm:px-6 py-4 border-b border-white/[0.04]">
          <p className="text-xs text-white/30 mb-3">Select 2-4 models to compare (currently {selectedModels.length})</p>
          <div className="flex flex-wrap gap-2">
            {BEAM_MODELS.map((model) => {
              const isSelected = selectedModels.includes(model.id);
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => toggleModel(model.id)}
                  className={`px-3 py-2.5 sm:py-2 rounded-xl text-sm font-medium border transition-all min-h-[44px] sm:min-h-0 ${
                    isSelected
                      ? 'border-white/[0.15] bg-white/[0.06]'
                      : 'border-white/[0.04] hover:border-white/[0.1] opacity-50 hover:opacity-80'
                  }`}
                  style={{ color: isSelected ? model.color : 'rgba(255,255,255,0.4)' }}
                >
                  {model.shortName}
                </button>
              );
            })}
          </div>
          {/* Cost notice */}
          <p className="text-[11px] text-white/30 mt-2">
            Beam sends your prompt to {selectedModels.length} models in parallel.
            Each model counts as a separate API call against your usage.
          </p>
          <button
            onClick={runBeam}
            disabled={selectedModels.length < 2}
            className="mt-4 px-6 py-2.5 rounded-xl bg-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)] text-white text-sm font-medium
              disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Send to {selectedModels.length} Models
          </button>
        </div>
      )}

      {/* Response grid */}
      {responses.length > 0 && (
        <div className="flex-1 overflow-auto p-4">
          <div className={`grid gap-3 sm:gap-4 h-full ${
            responses.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
            responses.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}>
            {responses.map((resp) => (
              <div
                key={resp.modelId}
                className="flex flex-col rounded-xl border border-white/[0.06] bg-[var(--arc-cosmic-void)] overflow-hidden"
              >
                {/* Model header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04]">
                  <span className="text-sm font-medium" style={{ color: resp.color }}>
                    {resp.shortName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {resp.status === 'streaming' && (
                      <PhCircleNotch className="w-3.5 h-3.5 text-[var(--arc-brand-atlantean-teal)] animate-spin" />
                    )}
                    {resp.status === 'done' && (
                      <PhCheck className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    {resp.status === 'error' && (
                      <span className="text-[10px] text-red-400">{resp.error}</span>
                    )}
                  </div>
                </div>

                {/* Response content */}
                <div className="flex-1 overflow-y-auto px-4 py-3 text-[13px] leading-[1.7] text-white/80"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  {resp.text ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ChatMarkdown content={resp.text} />
                    </div>
                  ) : resp.status === 'pending' ? (
                    <span className="text-white/20">Waiting...</span>
                  ) : resp.status === 'streaming' ? (
                    <span className="text-white/30">Thinking...</span>
                  ) : null}
                </div>

                {/* Select button */}
                {resp.status === 'done' && allDone && (
                  <div className="px-4 py-2 border-t border-white/[0.04]">
                    <button
                      type="button"
                      onClick={() => onSelectResponse(resp.text, resp.modelId)}
                      className="w-full py-2 rounded-lg text-xs font-medium text-white/50
                        border border-white/[0.06] hover:border-white/[0.15] hover:text-white/80 hover:bg-white/[0.03] transition-all"
                    >
                      Use this response
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Merge & Compare Actions — shown when all responses are done */}
          {allDone && responses.filter((r) => r.status === 'done').length >= 2 && (
            <div className="px-4 py-3 border-t border-white/[0.06] flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleMerge}
                disabled={isMerging}
                className="px-5 py-2 rounded-xl text-sm font-medium transition-all
                  bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)]/20 to-[var(--arc-fire)]/20 border border-[var(--arc-brand-arcanean-gold)]/30
                  text-[var(--arc-brand-arcanean-gold)] hover:from-[var(--arc-brand-arcanean-gold)]/30 hover:to-[var(--arc-fire)]/30
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isMerging ? (
                  <span className="flex items-center gap-2">
                    <PhCircleNotch className="w-3.5 h-3.5 animate-spin" />
                    Synthesizing...
                  </span>
                ) : (
                  'Merge Best Parts'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowCompare((v) => !v)}
                className="px-5 py-2 rounded-xl text-sm font-medium transition-all
                  border border-white/[0.08] text-white/50
                  hover:border-white/[0.15] hover:text-white/80 hover:bg-white/[0.03]"
              >
                {showCompare ? 'Hide Compare' : 'Compare'}
              </button>
            </div>
          )}

          {/* Compare Table */}
          {showCompare && compareRows.length > 0 && (
            <div className="px-4 py-4 border-t border-white/[0.06] overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[400px]">
                <thead>
                  <tr>
                    <th className="text-left text-white/30 text-xs font-medium pb-2 pr-4">Aspect</th>
                    {responses.filter((r) => r.status === 'done').map((r) => (
                      <th key={r.modelId} className="text-left text-xs font-medium pb-2 pr-4" style={{ color: r.color }}>
                        {r.shortName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.aspect} className="border-t border-white/[0.04]">
                      <td className="py-2 pr-4 text-white/40 text-xs font-medium whitespace-nowrap">{row.aspect}</td>
                      {row.values.map((val, i) => (
                        <td key={i} className="py-2 pr-4 text-white/60 text-xs">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Merged Result */}
          {(mergedText || isMerging) && (
            <div className="px-4 py-4 border-t border-white/[0.06] bg-[var(--arc-cosmic-void)]">
              <div className="flex items-center gap-2 mb-3">
                <PhLightning className="w-4 h-4 text-[var(--arc-brand-arcanean-gold)]" />
                <span className="text-sm font-medium text-[var(--arc-brand-arcanean-gold)]">Synthesized Response</span>
                {isMerging && <PhCircleNotch className="w-3.5 h-3.5 text-[var(--arc-brand-arcanean-gold)] animate-spin" />}
              </div>
              <div className="prose prose-invert prose-sm max-w-none max-h-[40vh] overflow-y-auto"
                style={{ scrollbarWidth: 'thin' }}
              >
                <ChatMarkdown content={mergedText || 'Synthesizing...'} />
              </div>
              {!isMerging && mergedText && (
                <button
                  type="button"
                  onClick={() => onSelectResponse(mergedText, 'merged')}
                  className="mt-3 px-5 py-2 rounded-xl text-sm font-medium transition-all
                    bg-[var(--arc-brand-arcanean-gold)]/10 border border-[var(--arc-brand-arcanean-gold)]/20 text-[var(--arc-brand-arcanean-gold)]
                    hover:bg-[var(--arc-brand-arcanean-gold)]/20 hover:border-[var(--arc-brand-arcanean-gold)]/40"
                >
                  Use Merged Response
                </button>
              )}
              {!isMerging && mergedText && (
                <p className="text-[10px] text-white/20 mt-2">
                  Synthesized from {responses.filter(r => r.status === 'done').map(r => r.shortName).join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
