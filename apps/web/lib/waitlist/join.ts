export type WaitlistInsert = (row: {
  email: string;
  source: string;
}) => Promise<{ error: { code?: string; message: string } | null }>;

export type JoinResult =
  | { status: 200; body: { success: true; message: string } }
  | { status: 400 | 503; body: { success: false; error: string } };

const UNIQUE_VIOLATION = "23505";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinWaitlist(
  rawEmail: unknown,
  insert: WaitlistInsert,
  source = "pricing_founding_circle",
  successMessage = "Welcome to the Founding Circle!",
): Promise<JoinResult> {
  const email =
    typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (!EMAIL.test(email) || email.length > 320) {
    return {
      status: 400,
      body: { success: false, error: "Please enter a valid email address." },
    };
  }

  const { error } = await insert({ email, source });
  // A repeat signup is already on the list; telling them so is the honest answer.
  if (error && error.code !== UNIQUE_VIOLATION) {
    console.error("Waitlist insert failed:", error.message);
    return {
      status: 503,
      body: {
        success: false,
        error:
          "We couldn't save your place just now. Please try again in a minute.",
      },
    };
  }

  return {
    status: 200,
    body: { success: true, message: successMessage },
  };
}
