/** app_metadata is set by trusted Auth administration; user_metadata is editable. */
export function hasMediaOperatorRole(
  user: { app_metadata?: { role?: unknown } } | null | undefined,
): boolean {
  return user?.app_metadata?.role === "admin";
}
