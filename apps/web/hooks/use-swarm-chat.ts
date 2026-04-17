'use client';

/**
 * useSwarmChat — consume the SSE stream from /api/chat/swarm.
 *
 * Exposes a typed snapshot of the swarm state the UI can render:
 *   - plan (what luminors were chosen, why)
 *   - contributions (per-luminor streaming text + tool calls + status)
 *   - synthesis (Lumina's merged response, also streaming)
 *   - isStreaming / error
 *
 * Start with `run(input)`. Abort with `stop()`.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Types (must mirror the server event union in /api/chat/swarm/route.ts)
// ---------------------------------------------------------------------------

export interface SwarmPlanLuminor {
  id: string;
  name: string;
  reason: string;
}

export interface SwarmPlan {
  mode: 'solo' | 'swarm';
  luminors: SwarmPlanLuminor[];
  rationale: string;
  source: 'llm' | 'heuristic' | 'fallback';
  planMs: number;
}

export interface SwarmToolCall {
  toolName: string;
  input: unknown;
  output?: unknown;
  completed: boolean;
}

export interface SwarmContribution {
  id: string;
  name: string;
  guardian: string;
  avatar?: string;
  text: string;
  toolCalls: SwarmToolCall[];
  status: 'thinking' | 'streaming' | 'done' | 'error';
  error?: string;
  tokensIn?: number;
  tokensOut?: number;
  durationMs?: number;
}

export interface SwarmState {
  plan: SwarmPlan | null;
  contributions: Record<string, SwarmContribution>;
  order: string[];
  synthesis: string;
  synthesisStarted: boolean;
  synthesisDone: boolean;
  isStreaming: boolean;
  totalMs?: number;
  totalTokens?: number;
  traceId?: string;
  error: string | null;
}

interface UseSwarmChatOptions {
  endpoint?: string;
  onDone?: (state: SwarmState) => void;
  onError?: (message: string) => void;
}

interface RunArgs {
  input: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxLuminors?: number;
  heuristicOnly?: boolean;
  force?: boolean;
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const INITIAL_STATE: SwarmState = {
  plan: null,
  contributions: {},
  order: [],
  synthesis: '',
  synthesisStarted: false,
  synthesisDone: false,
  isStreaming: false,
  error: null,
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSwarmChat(options: UseSwarmChatOptions = {}) {
  const endpoint = options.endpoint ?? '/api/chat/swarm';
  const [state, setState] = useState<SwarmState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState((prev) => ({ ...prev, isStreaming: false }));
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState(INITIAL_STATE);
  }, []);

  const run = useCallback(
    async ({ input, history, maxLuminors, heuristicOnly, force }: RunArgs) => {
      if (!input?.trim()) return;

      // Cancel any in-flight run
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setState({ ...INITIAL_STATE, isStreaming: true });

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
          body: JSON.stringify({ input, history, maxLuminors, heuristicOnly, force }),
          signal: ctrl.signal,
        });

        if (!res.ok || !res.body) {
          const text = await res.text().catch(() => '');
          const message = `Swarm request failed: ${res.status} ${text}`;
          setState((prev) => ({ ...prev, isStreaming: false, error: message }));
          optionsRef.current.onError?.(message);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE frames are separated by \n\n
          let boundary = buffer.indexOf('\n\n');
          while (boundary !== -1) {
            const frame = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);
            handleFrame(frame, setState);
            boundary = buffer.indexOf('\n\n');
          }
        }

        // Flush leftover buffer
        if (buffer.trim().length > 0) {
          handleFrame(buffer, setState);
        }

        setState((prev) => {
          optionsRef.current.onDone?.(prev);
          return { ...prev, isStreaming: false };
        });
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') {
          setState((prev) => ({ ...prev, isStreaming: false }));
          return;
        }
        const message = err instanceof Error ? err.message : 'Swarm error';
        setState((prev) => ({ ...prev, isStreaming: false, error: message }));
        optionsRef.current.onError?.(message);
      }
    },
    [endpoint],
  );

  return { state, run, stop, reset };
}

// ---------------------------------------------------------------------------
// Frame parsing
// ---------------------------------------------------------------------------

function handleFrame(frame: string, setState: React.Dispatch<React.SetStateAction<SwarmState>>) {
  const line = frame.split('\n').find((l) => l.startsWith('data:'));
  if (!line) return;
  const jsonText = line.slice(5).trim();
  if (!jsonText) return;

  let event: unknown;
  try {
    event = JSON.parse(jsonText);
  } catch {
    return;
  }
  if (typeof event !== 'object' || event === null) return;
  const e = event as { type?: string } & Record<string, unknown>;

  setState((prev) => reduce(prev, e));
}

function reduce(state: SwarmState, e: { type?: string } & Record<string, unknown>): SwarmState {
  switch (e.type) {
    case 'plan': {
      const plan = e.plan as SwarmPlan | undefined;
      if (!plan) return state;
      return {
        ...state,
        plan,
        order: plan.luminors.map((l) => l.id),
        contributions: Object.fromEntries(
          plan.luminors.map((l) => [
            l.id,
            {
              id: l.id,
              name: l.name,
              guardian: '',
              text: '',
              toolCalls: [],
              status: 'thinking' as const,
            },
          ]),
        ),
      };
    }
    case 'luminor_start': {
      const id = e.id as string;
      const prev = state.contributions[id];
      return {
        ...state,
        contributions: {
          ...state.contributions,
          [id]: {
            ...(prev ?? {
              id,
              name: (e.name as string) ?? id,
              guardian: '',
              text: '',
              toolCalls: [],
              status: 'thinking',
            }),
            id,
            name: (e.name as string) ?? prev?.name ?? id,
            guardian: (e.guardian as string) ?? prev?.guardian ?? '',
            avatar: (e.avatar as string) ?? prev?.avatar,
            status: 'streaming',
          },
        },
      };
    }
    case 'luminor_token': {
      const id = e.id as string;
      const prev = state.contributions[id];
      if (!prev) return state;
      return {
        ...state,
        contributions: {
          ...state.contributions,
          [id]: { ...prev, text: prev.text + ((e.delta as string) ?? ''), status: 'streaming' },
        },
      };
    }
    case 'luminor_tool': {
      const id = e.id as string;
      const prev = state.contributions[id];
      if (!prev) return state;
      return {
        ...state,
        contributions: {
          ...state.contributions,
          [id]: {
            ...prev,
            toolCalls: [
              ...prev.toolCalls,
              {
                toolName: (e.toolName as string) ?? 'unknown',
                input: e.input,
                completed: false,
              },
            ],
          },
        },
      };
    }
    case 'luminor_tool_result': {
      const id = e.id as string;
      const prev = state.contributions[id];
      if (!prev) return state;
      const name = (e.toolName as string) ?? 'unknown';
      const toolCalls = prev.toolCalls.map((t, i) =>
        !t.completed && t.toolName === name && i === prev.toolCalls.findIndex((tc) => !tc.completed && tc.toolName === name)
          ? { ...t, output: e.output, completed: true }
          : t,
      );
      return {
        ...state,
        contributions: { ...state.contributions, [id]: { ...prev, toolCalls } },
      };
    }
    case 'luminor_done': {
      const id = e.id as string;
      const prev = state.contributions[id];
      if (!prev) return state;
      return {
        ...state,
        contributions: {
          ...state.contributions,
          [id]: {
            ...prev,
            text: (e.text as string) ?? prev.text,
            tokensIn: (e.tokensIn as number) ?? prev.tokensIn,
            tokensOut: (e.tokensOut as number) ?? prev.tokensOut,
            durationMs: (e.durationMs as number) ?? prev.durationMs,
            status: 'done',
          },
        },
      };
    }
    case 'synthesis_start':
      return { ...state, synthesisStarted: true };
    case 'synthesis_token':
      return { ...state, synthesis: state.synthesis + ((e.delta as string) ?? '') };
    case 'done':
      return {
        ...state,
        synthesisDone: true,
        isStreaming: false,
        totalMs: (e.totalMs as number) ?? state.totalMs,
        totalTokens: (e.totalTokens as number) ?? state.totalTokens,
        traceId: (e.traceId as string) ?? state.traceId,
      };
    case 'error': {
      const message = (e.message as string) ?? 'Unknown error';
      const scope = e.scope as string | undefined;
      const luminorId = e.luminorId as string | undefined;
      if (scope === 'luminor' && luminorId && state.contributions[luminorId]) {
        return {
          ...state,
          contributions: {
            ...state.contributions,
            [luminorId]: {
              ...state.contributions[luminorId],
              status: 'error',
              error: message,
            },
          },
        };
      }
      return { ...state, error: message };
    }
    default:
      return state;
  }
}
