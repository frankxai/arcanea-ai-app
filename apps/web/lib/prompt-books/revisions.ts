// PostgreSQL timestamps retain microseconds. Date.parse alone truncates them,
// so compare the entire server revision, including its fractional second.
function timestamp(value: string): bigint | null {
  const match =
    /^(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2})(?:\.(\d{1,9}))?(Z|[+-]\d{2}(?::?\d{2})?)$/i.exec(
      value,
    );
  if (!match) return null;
  const zone = match[3].toUpperCase().replace(/^([+-]\d{2})$/, "$1:00");
  const seconds = Date.parse(`${match[1].replace(" ", "T")}${zone}`);
  if (!Number.isFinite(seconds)) return null;
  return (
    BigInt(seconds) * BigInt(1_000_000) +
    BigInt((match[2] ?? "").padEnd(9, "0"))
  );
}

export function comparePromptRevisions(
  incoming: string,
  current: string,
): number | null {
  const left = timestamp(incoming);
  const right = timestamp(current);
  if (left === null || right === null) return null;
  return left < right ? -1 : left > right ? 1 : 0;
}
