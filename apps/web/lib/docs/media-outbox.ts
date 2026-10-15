import { prepareDocumentImage } from "./media-client";
import {
  DocumentMediaError,
  documentMediaId,
  documentMediaUrl,
  type DocumentMediaClaim,
  type DocumentMediaScope,
} from "./media";

export interface DocumentOriginal {
  file: File;
  claim: DocumentMediaClaim;
}
type StoredOriginal = DocumentOriginal & { version: 1 };
const databaseName = "arcanea-document-originals";
const storeName = "originals";
const timeout = 5000;

function requireCurrent(current: () => boolean) {
  if (!current())
    throw new DocumentMediaError(
      409,
      "The account or document changed. Reopen the original document to recover its image.",
    );
}
function key(scope: DocumentMediaScope) {
  return JSON.stringify([
    documentMediaId(scope.ownerId),
    documentMediaId(scope.projectId),
    documentMediaId(scope.docId),
  ]);
}
function unavailable() {
  return new DocumentMediaError(
    503,
    "Browser image recovery is unavailable. Download the original before closing this page.",
  );
}
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let expired = false;
    const timer = setTimeout(() => {
      expired = true;
      reject(unavailable());
    }, timeout);
    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open(databaseName, 1);
    } catch {
      clearTimeout(timer);
      reject(unavailable());
      return;
    }
    request.onupgradeneeded = () => {
      if (expired) {
        request.transaction?.abort();
        return;
      }
      if (!request.result.objectStoreNames.contains(storeName))
        request.result.createObjectStore(storeName);
    };
    request.onerror = request.onblocked = () => {
      expired = true;
      clearTimeout(timer);
      reject(unavailable());
    };
    request.onsuccess = () => {
      clearTimeout(timer);
      if (expired) {
        request.result.close();
        return;
      }
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
  });
}

/** Resolve writes only at transaction completion, never at request success. */
async function transaction<T>(
  scope: DocumentMediaScope,
  current: () => boolean,
  mode: IDBTransactionMode,
  operation: (
    value: unknown,
    store: IDBObjectStore,
    address: string,
    accept: (value: T) => void,
    fail: (error: Error) => void,
  ) => void,
): Promise<T> {
  requireCurrent(current);
  const address = key(scope);
  const database = await open();
  try {
    requireCurrent(current);
    return await new Promise<T>((resolve, reject) => {
      const tx = database.transaction(
        storeName,
        mode,
        mode === "readwrite" ? { durability: "strict" } : undefined,
      );
      let result: T;
      let accepted = false;
      let failure: Error | null = null;
      const timer = setTimeout(() => {
        failure = unavailable();
        try {
          tx.abort();
        } catch {
          reject(failure);
        }
      }, timeout);
      tx.oncomplete = () => {
        clearTimeout(timer);
        try {
          requireCurrent(current);
          if (!accepted) throw unavailable();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      tx.onabort = tx.onerror = () => {
        clearTimeout(timer);
        reject(failure ?? unavailable());
      };
      const fail = (error: Error) => {
        failure = error;
        tx.abort();
      };
      const request = tx.objectStore(storeName).get(address);
      request.onsuccess = () => {
        try {
          requireCurrent(current);
          // All operations use this exact scope key; no account-wide scans.
          operation(
            request.result,
            tx.objectStore(storeName),
            address,
            (value) => {
              result = value;
              accepted = true;
            },
            fail,
          );
        } catch (error) {
          fail(error instanceof Error ? error : unavailable());
        }
      };
    });
  } finally {
    database.close();
  }
}

async function verifyOriginal(
  value: unknown,
  scope: DocumentMediaScope,
  current: () => boolean,
): Promise<DocumentOriginal> {
  const stored = value as Partial<StoredOriginal> | null;
  if (
    !stored ||
    stored.version !== 1 ||
    !(stored.file instanceof Blob) ||
    !stored.claim ||
    typeof stored.claim.filename !== "string" ||
    stored.claim.filename.length > 255 ||
    stored.file.size !== stored.claim.byteSize ||
    stored.file.type !== stored.claim.mimeType
  )
    throw new DocumentMediaError(
      409,
      "The browser image recovery copy could not be verified. It has been kept unchanged.",
    );
  const file = new File([stored.file], stored.claim.filename, {
    type: stored.file.type,
  });
  const claim = await prepareDocumentImage(file, scope, current);
  if (
    claim.fingerprint !== stored.claim.fingerprint ||
    claim.assetId !== stored.claim.assetId ||
    claim.ownerId !== stored.claim.ownerId ||
    claim.projectId !== stored.claim.projectId ||
    claim.docId !== stored.claim.docId
  )
    throw new DocumentMediaError(
      409,
      "The browser image recovery copy does not match its original. It has been kept unchanged.",
    );
  return { file, claim };
}

export async function readDocumentOriginal(
  scope: DocumentMediaScope,
  current: () => boolean,
): Promise<DocumentOriginal | null> {
  const value = await transaction<unknown>(
    scope,
    current,
    "readonly",
    (value, _store, _address, accept) => accept(value),
  );
  return value === undefined ? null : verifyOriginal(value, scope, current);
}

/** One pending original per document. Never replace another tab's recovery copy. */
export async function retainDocumentOriginal(
  file: File,
  scope: DocumentMediaScope,
  current: () => boolean,
): Promise<DocumentOriginal> {
  const claim = await prepareDocumentImage(file, scope, current);
  const existing = await transaction<unknown>(
    scope,
    current,
    "readwrite",
    (raw, store, address, accept, fail) => {
      const value = raw as StoredOriginal | undefined;
      if (value !== undefined) {
        if (
          value?.version !== 1 ||
          value.claim?.fingerprint !== claim.fingerprint
        ) {
          fail(
            new DocumentMediaError(
              409,
              "Another image recovery copy is already kept for this document. Reopen it before adding a different image.",
            ),
          );
          return;
        }
        accept(value);
      } else {
        const record: StoredOriginal = { version: 1, file, claim };
        store.add(record, address);
        accept(record);
      }
    },
  );
  return verifyOriginal(existing, scope, current);
}

/** Bound rich content traversal; only an exact private image handle counts. */
export function documentContainsOriginal(
  content: unknown,
  url: string,
): boolean {
  const pending: Array<{ node: unknown; depth: number }> = [
    { node: content, depth: 0 },
  ];
  let count = 0;
  while (pending.length) {
    const { node, depth } = pending.pop()!;
    if (++count > 10000 || depth > 64) return false;
    if (!node || typeof node !== "object" || Array.isArray(node)) return false;
    const value = node as {
      type?: unknown;
      attrs?: { src?: unknown };
      content?: unknown;
    };
    if (value.type === "image" && value.attrs?.src === url) return true;
    if (value.content !== undefined) {
      if (!Array.isArray(value.content) || value.content.length > 10000)
        return false;
      for (const child of value.content)
        pending.push({ node: child, depth: depth + 1 });
    }
  }
  return false;
}

/** Caller supplies server-acknowledged content, never the unsaved editor draft. */
export async function acknowledgeDocumentOriginal(
  entry: DocumentOriginal,
  confirmedContent: unknown,
  current: () => boolean,
): Promise<boolean> {
  requireCurrent(current);
  if (
    !documentContainsOriginal(
      confirmedContent,
      documentMediaUrl(entry.claim, entry.claim.assetId),
    )
  )
    return false;
  return transaction<boolean>(
    entry.claim,
    current,
    "readwrite",
    (raw, store, address, accept, fail) => {
      const value = raw as StoredOriginal | undefined;
      if (value === undefined) {
        accept(true);
        return;
      }
      if (
        value.version !== 1 ||
        value.claim?.fingerprint !== entry.claim.fingerprint
      ) {
        fail(
          new DocumentMediaError(
            409,
            "The image recovery copy changed. It has been kept unchanged.",
          ),
        );
        return;
      }
      store.delete(address);
      accept(true);
    },
  );
}
