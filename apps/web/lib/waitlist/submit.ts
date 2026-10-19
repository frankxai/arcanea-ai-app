export type WaitlistSubmission =
  { success: true } | { success: false; error: string; invalidEmail?: true };

const SAVE_ERROR = "We couldn't confirm your signup. Please try again.";
const EMAIL_ERROR = "Please enter a valid email address.";
const TIMEOUT_ERROR =
  "The request timed out. Your signup may have been saved; retrying is safe.";

export async function submitWaitlist(
  email: string,
  source: string,
  {
    request = fetch,
    timeoutMs = 10_000,
    endpoint = "/api/waitlist",
  }: {
    request?: typeof fetch;
    timeoutMs?: number;
    endpoint?: "/api/waitlist" | "/api/subscribe";
  } = {},
): Promise<WaitlistSubmission> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await request(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), source }),
      signal: controller.signal,
    });
    const result: unknown = await response.json();
    if (
      response.status === 400 &&
      result !== null &&
      typeof result === "object" &&
      "success" in result &&
      result.success === false &&
      "error" in result &&
      result.error === EMAIL_ERROR
    ) {
      return { success: false, error: EMAIL_ERROR, invalidEmail: true };
    }
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
