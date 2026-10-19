/** Database unavailability must not be mistaken for a missing or hidden world. */
export class WorldReadUnavailableError extends Error {
  constructor() {
    super("This world could not be loaded. Please try again.");
    this.name = "WorldReadUnavailableError";
  }
}

/** Log only a bounded provider code; never a database message, hint or row. */
export function worldReadFailure(error: unknown): { code: string } {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? error.code
      : undefined;
  return {
    code:
      typeof code === "string" && /^(?:[A-Z0-9]{5}|PGRST\d{3})$/.test(code)
        ? code
        : "unavailable",
  };
}

/** maybeSingle() returns null for zero visible rows and an error for failures. */
export function worldRootFromResult<T>(result: {
  data: T | null;
  error: unknown;
}): T | null {
  if (result.error) throw new WorldReadUnavailableError();
  return result.data;
}
