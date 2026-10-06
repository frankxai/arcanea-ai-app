import {
  readStoredWorldDraft,
  storedWorldDraftSchema,
  worldDraftSchema,
  WORLD_DRAFT_KEY,
  WORLD_PREVIOUS_DRAFT_KEY,
} from "./draft";

export const MAX_DRAFT_CHARACTERS = 150000;
export const MAX_DRAFT_FILE_BYTES = MAX_DRAFT_CHARACTERS * 4;
export type PortableDraft = NonNullable<
  ReturnType<typeof readStoredWorldDraft>
>;
type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const conceptKey = "arcanea.world-concept";

// Refuse unfamiliar fields instead of silently stripping a creator's work.
function hasUnknownFields(input: unknown, normalized: unknown): boolean {
  if (!input || typeof input !== "object") return false;
  if (!normalized || typeof normalized !== "object") return true;
  return Object.entries(input).some(
    ([key, value]) =>
      !Object.prototype.hasOwnProperty.call(normalized, key) ||
      hasUnknownFields(value, (normalized as Record<string, unknown>)[key]),
  );
}

export function serializeDraft(input: PortableDraft): string {
  const parsed = storedWorldDraftSchema.safeParse(input);
  if (!parsed.success || hasUnknownFields(input, parsed.data))
    throw new Error("This draft contains invalid or unsupported fields.");
  const raw = JSON.stringify(parsed.data, null, 2);
  if (raw.length > MAX_DRAFT_CHARACTERS)
    throw new Error("This draft is too large for a restorable JSON copy.");
  return raw;
}

export function parseDraftFile(raw: string, newId: () => string) {
  if (raw.length > MAX_DRAFT_CHARACTERS)
    throw new Error("This draft file is too large.");
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("Choose a valid world draft JSON file.");
  }
  const envelope =
    value &&
    typeof value === "object" &&
    ["version", "world", "draft_id"].some((key) =>
      Object.prototype.hasOwnProperty.call(value, key),
    );
  if (envelope) {
    const parsed = storedWorldDraftSchema.safeParse(value);
    if (!parsed.success || hasUnknownFields(value, parsed.data))
      throw new Error("This draft version or its fields are not supported.");
    // Also enforce the limit after adding defaults and formatting.
    serializeDraft(parsed.data);
    return { draft: parsed.data, legacy: false };
  }
  const world = worldDraftSchema.safeParse(value);
  if (!world.success || hasUnknownFields(value, world.data))
    throw new Error("This file does not contain a supported world draft.");
  const draft: PortableDraft = {
    version: 1,
    description: (
      world.data.description ||
      world.data.tagline ||
      world.data.name
    ).slice(0, 500),
    draft_id: newId(),
    world: world.data,
  };
  serializeDraft(draft);
  return { draft, legacy: true };
}

export class DraftStorageError extends Error {
  constructor(public readonly rollbackFailed: boolean) {
    super(
      rollbackFailed
        ? "Import did not finish and browser recovery could not be restored. Your current draft is still on screen; export it before leaving."
        : "Import did not finish. Your current draft is unchanged. Check browser storage and try again.",
    );
  }
}

export function persistImportedDraft(
  storage: DraftStorage,
  incoming: PortableDraft,
  onScreen: PortableDraft | null,
) {
  const raw = serializeDraft(incoming);
  const keys = [WORLD_DRAFT_KEY, WORLD_PREVIOUS_DRAFT_KEY, conceptKey];
  let before: (string | null)[];
  try {
    before = keys.map((key) => storage.getItem(key));
  } catch {
    throw new DraftStorageError(false);
  }
  const current = onScreen || readStoredWorldDraft(before[0]);
  const displaced = current && serializeDraft(current) !== raw ? current : null;
  const changed: number[] = [];
  try {
    if (displaced) {
      storage.setItem(WORLD_PREVIOUS_DRAFT_KEY, serializeDraft(displaced));
      changed.push(1);
    }
    storage.setItem(WORLD_DRAFT_KEY, raw);
    changed.push(0);
    storage.removeItem(conceptKey);
    changed.push(2);
  } catch {
    let rollbackFailed = false;
    for (const index of changed.reverse()) {
      try {
        if (before[index] === null) storage.removeItem(keys[index]);
        else storage.setItem(keys[index], before[index]!);
      } catch {
        rollbackFailed = true;
      }
    }
    throw new DraftStorageError(rollbackFailed);
  }
  return displaced;
}
