/** A one-use, tab-local handoff. This is not saved conversation history. */
export const ENTRY_DRAFT_KEY = "arcanea.chat-entry.v1";
export const ENTRY_DRAFT_MAX_CHARS = 4000;
export const ENTRY_DRAFT_TTL_MS = 10 * 60 * 1000;
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type Failure = "unavailable" | "expired" | "account" | "storage";
type DraftResult = { ok: true; text: string } | { ok: false; reason: Failure };

export function isCompositionKey(
  event: { isComposing?: boolean; keyCode?: number },
  composing = false,
): boolean {
  return composing || event.isComposing === true || event.keyCode === 229;
}

export function stageEntryDraft(
  storage: DraftStorage,
  text: string,
  owner: string | null,
  id: string,
  now = Date.now(),
): boolean {
  const trimmed = text.trim();
  if (!ID.test(id) || !trimmed || trimmed.length > ENTRY_DRAFT_MAX_CHARS)
    return false;
  try {
    const record = JSON.stringify({
      version: 1,
      id,
      owner,
      text: trimmed,
      expiresAt: now + ENTRY_DRAFT_TTL_MS,
    });
    storage.setItem(ENTRY_DRAFT_KEY, record);
    return storage.getItem(ENTRY_DRAFT_KEY) === record;
  } catch {
    return false;
  }
}

export function consumeEntryDraft(
  storage: DraftStorage,
  id: string,
  owner: string | null,
  now = Date.now(),
): DraftResult {
  if (!ID.test(id)) return { ok: false, reason: "unavailable" };
  try {
    const raw = storage.getItem(ENTRY_DRAFT_KEY);
    if (!raw) return { ok: false, reason: "unavailable" };
    let record;
    try {
      record = JSON.parse(raw);
    } catch {
      return { ok: false, reason: "unavailable" };
    }
    if (
      !record ||
      record.version !== 1 ||
      record.id !== id ||
      !(
        record.owner === null ||
        (typeof record.owner === "string" &&
          record.owner.length > 0 &&
          record.owner.length <= 128)
      ) ||
      typeof record.text !== "string" ||
      !record.text.trim() ||
      record.text.length > ENTRY_DRAFT_MAX_CHARS ||
      !Number.isSafeInteger(record.expiresAt) ||
      record.expiresAt > now + ENTRY_DRAFT_TTL_MS
    )
      return { ok: false, reason: "unavailable" };
    if (record.owner !== owner) return { ok: false, reason: "account" };
    if (record.expiresAt <= now) {
      storage.removeItem(ENTRY_DRAFT_KEY);
      return { ok: false, reason: "expired" };
    }
    storage.removeItem(ENTRY_DRAFT_KEY);
    if (storage.getItem(ENTRY_DRAFT_KEY) !== null)
      return { ok: false, reason: "storage" };
    return { ok: true, text: record.text.trim() };
  } catch {
    return { ok: false, reason: "storage" };
  }
}

export function entryDraftRecovery(reason: Failure): string {
  if (reason === "account")
    return "This draft belongs to another account. Switch back to that account in this tab, then reopen the draft link.";
  if (reason === "expired")
    return "This draft expired. Return home to prepare it again, or write a new message here.";
  if (reason === "storage")
    return "Your browser could not open the draft. Paste your original text here, or return home to start again.";
  return "This draft is no longer available in this tab. Return home to prepare it again, or write a new message here.";
}
