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
  { id: 'arcanea-gemini-flash', shortName: 'Flash', color: '#4285f4' },
  { id: 'arcanea-sonnet', shortName: 'Sonnet', color: '#d4a574' },
  { id: 'arcanea-gpt5', shortName: 'GPT-5', color: '#10a37f' },
  { id: 'arcanea-grok', shortName: 'Grok', color: '#fff' },
  { id: 'arcanea-deepseek', shortName: 'DeepSeek', color: '#667eea' },
  { id: 'arcanea-opus', shortName: 'Opus', color: '#00bcd4' },
  { id: 'arcanea-gemini-pro', shortName: 'Gemini Pro', color: '#34a853' },
  { id: 'arcanea-haiku', shortName: 'Haiku', color: '#e8b4a0' },
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
  const abortRef = useRef<AbortController[]>([]);

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
        color: model?.color || '#fff',
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
          const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(errData.error || `HTTP ${res.status}`);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => { abortRef.current.forEach((c) => c.abort()); };
  }, []);

  const allDone = responses.length > 0 && responses.every((r) => r.status === 'done' || r.status === 'error');

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <PhLightning className="w-5 h-5 text-[#ffd700]" />
          <h2 className="text-lg font-semibold text-white">Beam Mode</h2>
          <span className="text-sm text-white/40">Compare models side-by-side</span>
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
      <div className="px-6 py-3 border-b border-white/[0.04]">
        <p className="text-sm text-white/60 truncate">{prompt}</p>
      </div>

      {/* Model selector (if not running) */}
      {!isRunning && responses.length === 0 && (
        <div className="px-6 py-4 border-b border-white/[0.04]">
          <p className="text-xs text-white/30 mb-3">Select 2-4 models to compare (currently {selectedModels.length})</p>
          <div className="flex flex-wrap gap-2">
            {BEAM_MODELS.map((model) => {
              const isSelected = selectedModels.includes(model.id);
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => toggleModel(model.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
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
          <button
            onClick={runBeam}
            disabled={selectedModels.length < 2}
            className="mt-4 px-6 py-2.5 rounded-xl bg-[#00bcd4] hover:bg-[#00acc1] text-white text-sm font-medium
              disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Fire Beam ({selectedModels.length} models)
          </button>
        </div>
      )}

      {/* Response grid */}
      {responses.length > 0 && (
        <div className="flex-1 overflow-auto p-4">
          <div className={`grid gap-4 h-full ${
            responses.length === 2 ? 'grid-cols-2' :
            responses.length === 3 ? 'grid-cols-3' :
            'grid-cols-2 lg:grid-cols-4'
          }`}>
            {responses.map((resp) => (
              <div
                key={resp.modelId}
                className="flex flex-col rounded-xl border border-white/[0.06] bg-[#111113] overflow-hidden"
              >
                {/* Model header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04]">
                  <span className="text-sm font-medium" style={{ color: resp.color }}>
                    {resp.shortName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {resp.status === 'streaming' && (
                      <PhCircleNotch className="w-3.5 h-3.5 text-[#00bcd4] animate-spin" />
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
        </div>
      )}
    </div>
  );
}
