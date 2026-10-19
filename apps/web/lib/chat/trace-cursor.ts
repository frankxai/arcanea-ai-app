const ISO_TIMESTAMP_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ParsedTraceCursor =
  | { valid: true; kind: 'none' }
  | { valid: true; kind: 'legacy'; createdAt: string }
  | { valid: true; kind: 'composite'; createdAt: string; id: string; orFilter: string }
  | { valid: false; error: string };

export function isValidIsoTimestamp(value: string): boolean {
  if (!ISO_TIMESTAMP_RE.test(value)) return false;
  return !Number.isNaN(Date.parse(value));
}

export function isValidUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export function parseTraceCursor(cursor: string | null | undefined): ParsedTraceCursor {
  if (cursor === null || cursor === undefined || cursor === '') {
    return { valid: true, kind: 'none' };
  }

  const separatorIndex = cursor.indexOf('_');
  if (separatorIndex === -1) {
    if (!isValidIsoTimestamp(cursor)) {
      return { valid: false, error: 'Invalid cursor format' };
    }
    return { valid: true, kind: 'legacy', createdAt: cursor };
  }

  const createdAt = cursor.slice(0, separatorIndex);
  const id = cursor.slice(separatorIndex + 1);
  if (!isValidIsoTimestamp(createdAt) || !isValidUuid(id)) {
    return { valid: false, error: 'Invalid cursor format' };
  }

  return {
    valid: true,
    kind: 'composite',
    createdAt,
    id,
    orFilter: `created_at.lt.${createdAt},and(created_at.eq.${createdAt},id.lt.${id})`,
  };
}

export function formatNextTraceCursor<T extends { created_at: string; id: string }>(
  rows: readonly T[],
  limit: number,
): string | null {
  if (rows.length !== limit || rows.length === 0) return null;
  const last = rows[rows.length - 1];
  return `${last.created_at}_${last.id}`;
}
