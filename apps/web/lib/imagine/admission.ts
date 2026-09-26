/** The credit endpoint must explicitly confirm admission before paid provider work. */
export function checkImageAdmission(
  status: number,
  body: unknown,
): { allowed: true } | { allowed: false; status: number; error: string } {
  if (
    status === 200 &&
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    body.success === true
  ) {
    return { allowed: true };
  }

  if (status === 401) {
    return { allowed: false, status, error: "Sign in to generate images" };
  }
  if (status === 402) {
    return { allowed: false, status, error: "Insufficient credits" };
  }
  if (status === 429) {
    return { allowed: false, status, error: "Too many requests" };
  }
  return {
    allowed: false,
    status: 503,
    error: "Credit admission is unavailable",
  };
}
