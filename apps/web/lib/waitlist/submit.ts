export type WaitlistSubmission =
  { success: true } | { success: false; error: string };

const SAVE_ERROR = "We couldn't confirm your signup. Please try again.";
const TIMEOUT_ERROR =
  "The request timed out. Your signup may have been saved; retrying is safe.";

export async function submitWaitlist(
  email: string,
  source: string,
  {
    request = fetch,
    timeoutMs = 10_000,
  }: { request?: typeof fetch; timeoutMs?: number } = {},
): Promise<WaitlistSubmission> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await request("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), source }),
      signal: controller.signal,
    });
    const result: unknown = await response.json();
    if (!response.ok) {
      return { success: false, error: SAVE_ERROR };
    }
    if (result === null || typeof result !== "object") {
      return { success: false, error: SAVE_ERROR };
    }
    if ("success" in result && result.success === true) {
      return { success: true };
    }
    return { success: false, error: SAVE_ERROR };
  } catch {
    return {
      success: false,
      error: controller.signal.aborted ? TIMEOUT_ERROR : SAVE_ERROR,
    };
  } finally {
    clearTimeout(timeout);
  }
}
