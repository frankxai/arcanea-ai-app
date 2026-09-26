import { randomUUID } from "node:crypto";

/** Opaque identities remain distinct when clocks repeat or move backwards. */
export function createRuntimeIdentifier(
  kind: "creation" | "task" | "session",
): string {
  return `${kind}-${randomUUID()}`;
}
