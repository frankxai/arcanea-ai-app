/** Accept root-relative application destinations, never another origin or scheme. */
export function safeAuthNextPath(next: string | null, fallback: string) {
  if (!next || next.length > 2048 || next !== next.trim()) return fallback;
  let decoded = next;
  try {
    // Reject encoded separators/control characters before a router or callback
    // can interpret them differently. Ordinary encoded search values still work.
    for (let pass = 0; pass < 4; pass++) {
      if (
        !decoded.startsWith("/") ||
        decoded.startsWith("//") ||
        /[\\\u0000-\u001f\u007f]/.test(decoded)
      )
        return fallback;
      const normalized = new URL(decoded, "https://arcanea.invalid");
      if (normalized.origin !== "https://arcanea.invalid") return fallback;
      const further = decodeURIComponent(decoded);
      if (further === decoded) return next;
      decoded = further;
    }
  } catch {
    return fallback;
  }
  return fallback;
}
