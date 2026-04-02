/**
 * Project Docs Types
 *
 * Mirrors the project_docs, project_doc_content, and project_doc_versions
 * database schema defined in supabase/migrations/20260402000001_project_docs.sql
 */

export type DocStatus = 'draft' | 'active' | 'archived' | 'published';

export type DocType =
  | 'note'
  | 'brief'
  | 'outline'
  | 'lore'
  | 'research'
  | 'prompt_book'
  | 'spec'
  | 'journal';

export type EditorType = 'human' | 'ai' | 'import' | 'agent';

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface ProjectDoc {
  id: string;
  workspace_id: string;
  project_id: string | null;
  user_id: string;
  title: string;
  slug: string | null;
  icon: string | null;
  cover_image_url: string | null;
  status: DocStatus;
  doc_type: DocType;
  source_thread_id: string | null;
  parent_doc_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  last_edited_at: string;
  last_ai_touched_at: string | null;
  metadata: Record<string, unknown>;
}

export interface ProjectDocContent {
  doc_id: string;
  content_json: Record<string, unknown>;
  content_text: string;
  word_count: number;
  outline_json: Record<string, unknown> | null;
  reading_time_minutes: number;
  updated_at: string;
}

export interface ProjectDocVersion {
  id: string;
  doc_id: string;
  version_number: number;
  editor_type: EditorType;
  author_user_id: string | null;
  content_json: Record<string, unknown> | null;
  content_text: string | null;
  change_summary: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Composite / response shapes
// ---------------------------------------------------------------------------

/** Doc row with word_count joined from project_doc_content */
export interface ProjectDocWithMeta extends ProjectDoc {
  word_count?: number;
}

/** Full doc including content body */
export interface ProjectDocFull extends ProjectDoc {
  content: ProjectDocContent | null;
}

// ---------------------------------------------------------------------------
// Label maps (UI display)
// ---------------------------------------------------------------------------

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  note: 'Note',
  brief: 'Brief',
  outline: 'Outline',
  lore: 'Lore',
  research: 'Research',
  prompt_book: 'Prompt Book',
  spec: 'Spec',
  journal: 'Journal',
};

export const DOC_STATUS_LABELS: Record<DocStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  archived: 'Archived',
  published: 'Published',
};
