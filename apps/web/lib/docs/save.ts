/** Acknowledgements bind the owner, parent, document, operation and revision. */
export const documentSaveLimit = 1_048_576;
export interface DocumentPatch {
  title?: string;
  doc_type?: string;
  status?: string;
  icon?: string | null;
  content_json?: Record<string, unknown>;
  content_text?: string;
  word_count?: number;
}
export interface DocumentOperation {
  expected_actor: string;
  operation_id: string;
  expected_revision: number;
  patch: DocumentPatch;
}
export interface DocumentReceipt {
  doc_id: string;
  project_id: string;
  user_id: string;
  operation_id: string;
  revision: number;
}
export class DocumentSaveError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}
const uuid =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
export function parseDocumentOperation(body: unknown): DocumentOperation {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new DocumentSaveError("Invalid document save.");
  const b = body as Record<string, unknown>;
  if (
    b.expected_revision === undefined ||
    b.operation_id === undefined ||
    b.expected_actor === undefined
  )
    throw new DocumentSaveError(
      "Reopen the document before saving; its revision is required.",
      428,
    );
  if (
    !Number.isSafeInteger(b.expected_revision) ||
    (b.expected_revision as number) < 0 ||
    (b.expected_revision as number) >= 2147483647 ||
    typeof b.operation_id !== "string" ||
    !uuid.test(b.operation_id) ||
    typeof b.expected_actor !== "string" ||
    !uuid.test(b.expected_actor)
  )
    throw new DocumentSaveError("Invalid save revision or operation.");
  const allowed = new Set([
    "expected_actor",
    "expected_revision",
    "operation_id",
    "title",
    "doc_type",
    "status",
    "icon",
    "content_json",
    "content_text",
    "word_count",
  ]);
  if (Object.keys(b).some((key) => !allowed.has(key)))
    throw new DocumentSaveError("Unsupported document field.");
  const patch: DocumentPatch = {};
  for (const key of [
    "title",
    "doc_type",
    "status",
    "icon",
    "content_json",
    "content_text",
    "word_count",
  ] as const)
    if (Object.hasOwn(b, key)) Object.assign(patch, { [key]: b[key] });
  if (!Object.keys(patch).length)
    throw new DocumentSaveError("No document changes supplied.");
  if (
    patch.title !== undefined &&
    (typeof patch.title !== "string" || patch.title.length > 500)
  )
    throw new DocumentSaveError("Use a title of at most 500 characters.");
  if (
    patch.doc_type !== undefined &&
    ![
      "note",
      "brief",
      "outline",
      "lore",
      "research",
      "prompt_book",
      "spec",
      "journal",
    ].includes(patch.doc_type)
  )
    throw new DocumentSaveError("Invalid document type.");
  if (
    patch.status !== undefined &&
    !["draft", "active", "archived", "published"].includes(patch.status)
  )
    throw new DocumentSaveError("Invalid document status.");
  if (
    patch.icon !== undefined &&
    patch.icon !== null &&
    (typeof patch.icon !== "string" || patch.icon.length > 100)
  )
    throw new DocumentSaveError("Invalid document icon.");
  if (
    patch.content_json !== undefined &&
    (!patch.content_json ||
      typeof patch.content_json !== "object" ||
      Array.isArray(patch.content_json))
  )
    throw new DocumentSaveError("Invalid document content.");
  if (
    patch.content_text !== undefined &&
    (typeof patch.content_text !== "string" ||
      patch.content_text.length > 200_000)
  )
    throw new DocumentSaveError("Document text exceeds the save limit.");
  if (
    patch.word_count !== undefined &&
    (!Number.isSafeInteger(patch.word_count) ||
      patch.word_count < 0 ||
      patch.word_count > 200_000)
  )
    throw new DocumentSaveError("Invalid word count.");
  return {
    expected_actor: b.expected_actor,
    operation_id: b.operation_id,
    expected_revision: b.expected_revision as number,
    patch,
  };
}
export async function readDocumentOperation(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new DocumentSaveError("Missing document save.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > documentSaveLimit) {
        await reader.cancel();
        throw new DocumentSaveError(
          "Document save exceeds 1 MiB. Download your draft.",
          413,
        );
      }
      chunks.push(next.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return parseDocumentOperation(
      JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)),
    );
  } catch (error) {
    if (error instanceof DocumentSaveError) throw error;
    throw new DocumentSaveError("Invalid document save.");
  } finally {
    reader.releaseLock();
  }
}
export function verifiedDocumentReceipt(
  value: unknown,
  scope: { user: string; project: string; doc: string },
  operation: DocumentOperation,
): DocumentReceipt {
  const r = value as Partial<DocumentReceipt> | null;
  if (
    !r ||
    operation.expected_actor !== scope.user ||
    r.user_id !== scope.user ||
    r.project_id !== scope.project ||
    r.doc_id !== scope.doc ||
    r.operation_id !== operation.operation_id ||
    r.revision !== operation.expected_revision + 1 ||
    !Number.isSafeInteger(r.revision)
  )
    throw new DocumentSaveError(
      "Saving was not confirmed. Retry this operation or download your draft.",
      503,
    );
  return r as DocumentReceipt;
}

/** Retain an uncertain operation and drain it before admitting a newer edit. */
export function createDocumentWriter(
  scope: { user: string; project: string; doc: string },
  initialRevision: number,
  send: (operation: DocumentOperation) => Promise<unknown>,
  newId: () => string = () => crypto.randomUUID(),
  restoredPending?: DocumentOperation,
) {
  if (
    !Number.isSafeInteger(initialRevision) ||
    initialRevision < 0 ||
    initialRevision >= 2147483647
  )
    throw new DocumentSaveError(
      "Reopen a supported saved revision before editing.",
    );
  let revision = initialRevision;
  let pending = restoredPending
    ? parseDocumentOperation({
        expected_actor: restoredPending.expected_actor,
        operation_id: restoredPending.operation_id,
        expected_revision: restoredPending.expected_revision,
        ...restoredPending.patch,
      })
    : undefined;
  if (
    pending &&
    (pending.expected_actor !== scope.user ||
      pending.expected_revision > initialRevision)
  )
    throw new DocumentSaveError(
      "Recovery copy does not match this account or revision.",
    );
  let draining: Promise<void> | undefined;
  async function commit(operation: DocumentOperation) {
    const receipt = verifiedDocumentReceipt(
      await send(operation),
      scope,
      operation,
    );
    // A replay can acknowledge an older edit after another tab has saved.
    // Keep the pending operation until the creator resolves that conflict.
    if (receipt.revision < revision)
      throw new DocumentSaveError(
        "The saved document changed. Download your draft and reopen it.",
        409,
      );
    revision = receipt.revision;
    pending = undefined;
  }
  function save(patch: DocumentPatch): Promise<void> {
    if (draining)
      return Promise.reject(
        new DocumentSaveError("A document save is already in progress.", 409),
      );
    const copy = JSON.parse(JSON.stringify(patch)) as DocumentPatch;
    draining = Promise.resolve()
      .then(async () => {
        const prior = pending;
        if (prior) {
          await commit(prior);
          if (JSON.stringify(prior.patch) === JSON.stringify(copy)) return;
        }
        pending = {
          expected_actor: scope.user,
          operation_id: newId(),
          expected_revision: revision,
          patch: copy,
        };
        await commit(pending);
      })
      .finally(() => {
        draining = undefined;
      });
    return draining;
  }
  return {
    save,
    revision: () => revision,
    pending: () => (pending ? structuredClone(pending) : undefined),
  };
}
