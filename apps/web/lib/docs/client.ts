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
