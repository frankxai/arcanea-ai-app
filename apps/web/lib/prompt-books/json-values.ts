// JSONB may reorder object keys; arrays still have meaningful editor order.
export function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, entry: unknown) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry))
      return entry;
    return Object.fromEntries(
      Object.entries(entry).sort(([left], [right]) =>
        left < right ? -1 : left > right ? 1 : 0,
      ),
    );
  });
}

export function sameJsonValue(left: unknown, right: unknown): boolean {
  return canonicalJson(left) === canonicalJson(right);
}
