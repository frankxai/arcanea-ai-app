/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { DocType, DocStatus } from "./types";
import { createDraftSession } from "@/lib/author/draft-session";
import {
  createDocumentWriter,
  parseDocumentOperation,
  DocumentSaveError,
  documentSaveLimit,
  type DocumentPatch,
  type DocumentOperation,
} from "./save";

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
  user_id?: string;
  project_id?: string;
  save_revision?: number;
}

interface DocEnvelope {
  data?: {
    doc?: DocApiRecord;
  };
  doc?: DocApiRecord;
}

export function extractDocFromEnvelope(
  payload: DocEnvelope | null | undefined,
): DocApiRecord | null {
  return payload?.data?.doc ?? payload?.doc ?? null;
}

export type DocumentScope = { user: string; project: string; doc: string };
type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export interface DocumentBackup {
  version: 1;
  scope: DocumentScope;
  revision: number;
  value: DocumentPatch;
  pending?: DocumentOperation;
}
export function documentBackupKey(scope: DocumentScope) {
  return `arcanea-document-draft:v1:${encodeURIComponent(scope.user)}:${encodeURIComponent(scope.project)}:${encodeURIComponent(scope.doc)}`;
}
function validPatch(
  scope: DocumentScope,
  revision: number,
  patch: DocumentPatch,
) {
  return parseDocumentOperation({
    ...patch,
    expected_actor: scope.user,
    expected_revision: revision,
    operation_id: "00000000-0000-4000-8000-000000000001",
  }).patch;
}
export function readDocumentBackup(
  storage: DraftStorage,
  scope: DocumentScope,
): DocumentBackup | null {
  const raw = storage.getItem(documentBackupKey(scope));
  if (!raw) return null;
  try {
    if (new TextEncoder().encode(raw).byteLength > documentSaveLimit * 3)
      return null;
    const value = JSON.parse(raw) as DocumentBackup;
    if (
      value.version !== 1 ||
      value.scope?.user !== scope.user ||
      value.scope?.project !== scope.project ||
      value.scope?.doc !== scope.doc
    )
      return null;
    value.value = validPatch(scope, value.revision, value.value);
    if (value.pending) {
      value.pending = parseDocumentOperation({
        ...value.pending.patch,
        expected_actor: value.pending.expected_actor,
        expected_revision: value.pending.expected_revision,
        operation_id: value.pending.operation_id,
      });
      if (
        value.pending.expected_actor !== scope.user ||
        value.pending.expected_revision !== value.revision
      )
        return null;
    }
    return value;
  } catch {
    return null;
  }
}

/** One mounted writer; backups contain the current draft and the uncertain operation. */
export function createDocumentDraft(
  scope: DocumentScope,
  revision: number,
  initial: DocumentPatch,
  send: (operation: DocumentOperation) => Promise<unknown>,
  storage: DraftStorage,
  isCurrent: () => boolean,
  recovery?: DocumentBackup | null,
) {
  let backupAvailable = true;
  let initializing = true;
  const writer = createDocumentWriter(
    scope,
    recovery?.revision ?? revision,
    async (operation) => {
      persist();
      if (!isCurrent())
        throw new DocumentSaveError(
          "The account changed. Sign in to the draft owner before retrying.",
          409,
        );
      const receipt = await send(operation);
      if (!isCurrent())
        throw new DocumentSaveError(
          "The account changed before saving was confirmed.",
          409,
        );
      return receipt;
    },
    undefined,
    recovery?.pending,
  );
  const session = createDraftSession<DocumentPatch>(
    async (patch) => {
      try {
        await writer.save(patch);
      } finally {
        persist();
      }
    },
    () => persist(),
  );
  function persist() {
    if (initializing) return;
    const snapshot = session.snapshot();
    if (!snapshot.value) return;
    try {
      if (!snapshot.dirty && !writer.pending())
        storage.removeItem(documentBackupKey(scope));
      else
        storage.setItem(
          documentBackupKey(scope),
          JSON.stringify({
            version: 1,
            scope,
            revision: writer.revision(),
            value: snapshot.value,
            pending: writer.pending(),
          } satisfies DocumentBackup),
        );
      backupAvailable = true;
    } catch {
      backupAvailable = false;
    }
  }
  session.load(initial);
  if (recovery) session.edit(recovery.value);
  initializing = false;
  if (recovery) persist();
  return {
    ...session,
    revision: writer.revision,
    pending: writer.pending,
    backupAvailable: () => backupAvailable,
  };
}
