/** Turn an API error body into a safe string. Never returns "[object Object]". */
export function formatApiError(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") {
    return typeof data === "string" && data.trim() ? data : fallback;
  }
  const root = data as { error?: unknown; message?: unknown };
  const err = root.error;
  if (typeof err === "string" && err.trim()) return err;
  if (err && typeof err === "object") {
    const nested = err as { message?: unknown; error?: unknown };
    if (typeof nested.message === "string" && nested.message.trim())
      return nested.message;
    if (typeof nested.error === "string" && nested.error.trim())
      return nested.error;
  }
  if (typeof root.message === "string" && root.message.trim())
    return root.message;
  return fallback;
}

/** True when the response is a sign-in refusal, including nested error objects. */
export function isAuthFailure(status: number, data: unknown): boolean {
  if (status === 401) return true;
  if (!data || typeof data !== "object") return false;
  const err = (data as { error?: unknown }).error;
  if (typeof err === "string") {
    const lower = err.toLowerCase();
    return (
      lower.includes("sign in") ||
      lower.includes("unauthorized") ||
      lower.includes("authentication")
    );
  }
  if (err && typeof err === "object") {
    const nested = err as { code?: unknown; message?: unknown };
    if (nested.code === "UNAUTHORIZED") return true;
    if (typeof nested.message === "string") {
      const lower = nested.message.toLowerCase();
      return (
        lower.includes("authentication") ||
        lower.includes("unauthorized") ||
        lower.includes("sign in")
      );
    }
  }
  return false;
}

export const SIGN_IN_TO_GENERATE = "Sign in to generate.";
