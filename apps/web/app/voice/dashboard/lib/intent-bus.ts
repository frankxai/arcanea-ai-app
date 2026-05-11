/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Voice Dashboard — Intent Bus
 *
 * Every input modality (clap, voice, click, Cmd+K, hotkey) resolves to the
 * same Intent object, which routes through this dispatcher. The dashboard
 * becomes a multi-modal façade over one intent bus, not parallel pipelines.
 *
 * That's what makes it Jarvis-class instead of "voice tab + click tab."
 */

export type IntentTrigger = 'click' | 'clap' | 'voice' | 'palette' | 'hotkey';

export interface BaseIntent {
  id: string;
  trigger: IntentTrigger;
  ts: number;
  /** Free-text human description for the Logic Stream. */
  summary: string;
}

export interface SummonIntent extends BaseIntent {
  kind: 'summon';
  persona: string;
}

export interface WorkflowIntent extends BaseIntent {
  kind: 'workflow';
  workflowId: string;
}

export interface RuntimeIntent extends BaseIntent {
  kind: 'runtime';
  runtimeId: string;
  command: string;
}

export interface EmbedIntent extends BaseIntent {
  kind: 'embed';
  url: string;
  surface: 'youtube' | 'web' | 'docs';
  query?: string;
}

export interface ClapIntent extends BaseIntent {
  kind: 'clap';
}

export type Intent =
  | SummonIntent
  | WorkflowIntent
  | RuntimeIntent
  | EmbedIntent
  | ClapIntent;

/** Distributive Omit so union members keep their kind-specific fields. */
type DistributiveOmit<T, K extends keyof T | string> = T extends unknown
  ? Omit<T, Extract<keyof T, K>>
  : never;

export type EmittableIntent = DistributiveOmit<Intent, 'id' | 'ts'>;

export type IntentHandler = (intent: Intent) => void;

let nextId = 0;
const handlers: Set<IntentHandler> = new Set();

export function subscribe(handler: IntentHandler): () => void {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}

export function emit(intent: EmittableIntent): void {
  const full = { ...intent, id: `i${++nextId}`, ts: Date.now() } as Intent;
  for (const h of handlers) {
    try {
      h(full);
    } catch {}
  }
}

export function makeId(): string {
  return `i${++nextId}`;
}
