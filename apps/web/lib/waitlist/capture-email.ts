export type EmailInsert = (row: {
  email: string;
  source: string;
}) => Promise<{ error: { code?: string; message: string } | null }>;

export type CaptureResult =
  | { status: 200; body: { success: true; message: string } }
  | { status: 400 | 503; body: { success: false; error: string } };

const UNIQUE_VIOLATION = "23505";

// Linear checks rather than a regex: user input must not drive backtracking.
function isPlausibleEmail(email: string): boolean {
  if (email.length > 320 || /\s/.test(email)) return false;
  const at = email.indexOf("@");
  if (at < 1 || at !== email.lastIndexOf("@")) return false;
  const domain = email.slice(at + 1);
  const dot = domain.lastIndexOf(".");
  return dot > 0 && dot < domain.length - 1;
}

/**
 * Footer and coming-soon signups write public.subscribers, created by
 * supabase/migrations/20260926000001_waitlists.sql. A failed insert is a 503.
 * The product waitlist at /api/waitlist is a different store.
 */
export async function captureEmail(
  rawEmail: unknown,
  insert: EmailInsert,
  source = "footer",
  successMessage = "Welcome to the multiverse.",
): Promise<CaptureResult> {
  const email =
    typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (!isPlausibleEmail(email)) {
    return {
      status: 400,
      body: { success: false, error: "Please enter a valid email address." },
    };
  }

  const { error } = await insert({ email, source });
  if (error && error.code !== UNIQUE_VIOLATION) {
    console.error("Email capture insert failed:", error.message);
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
