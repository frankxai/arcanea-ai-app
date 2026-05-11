/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { DocType, DocStatus } from './types';

export interface DocEditorContent {
  content_json: Record<string, unknown>;
  content_text: string;
  word_count: number;
}

export interface DocApiRecord {
  id: string;
  title: string;
  doc_type: DocType;
  status: DocStatus;
  icon: string | null;
  content: DocEditorContent | null;
}

interface DocEnvelope {
  data?: {
    doc?: DocApiRecord;
  };
  doc?: DocApiRecord;
}

export function extractDocFromEnvelope(payload: DocEnvelope | null | undefined): DocApiRecord | null {
  return payload?.data?.doc ?? payload?.doc ?? null;
}
