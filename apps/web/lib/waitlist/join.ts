export type WaitlistInsert = (row: {
  email: string;
  source: string;
}) => Promise<{ error: { code?: string; message: string } | null }>;

export type JoinResult =
  | { status: 200; body: { success: true; message: string } }
  | { status: 400 | 503; body: { success: false; error: string } };

const UNIQUE_VIOLATION = "23505";

// Linear checks rather than a regex: user input must not drive backtracking (CodeQL js/polynomial-redos).
function isPlausibleEmail(email: string): boolean {
  if (email.length > 320 || /\s/.test(email)) return false;
  const at = email.indexOf("@");
  if (at < 1 || at !== email.lastIndexOf("@")) return false;
  const domain = email.slice(at + 1);
  const dot = domain.lastIndexOf(".");
  return dot > 0 && dot < domain.length - 1;
}

export async function joinWaitlist(
  rawEmail: unknown,
  insert: WaitlistInsert,
  source = "pricing_founding_circle",
  successMessage = "Welcome to the Founding Circle!",
): Promise<JoinResult> {
  const email =
    typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (!isPlausibleEmail(email)) {
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
