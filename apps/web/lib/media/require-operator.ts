import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasMediaOperatorRole } from "./operator-role";

/**
 * Media catalog jobs use privileged credentials and can incur provider costs.
 * The operator role must be assigned through trusted Supabase Auth app_metadata;
 * user_metadata and request-supplied identities are never authorization sources.
 */
export async function requireMediaOperator(): Promise<NextResponse | null> {
  try {
    const client = await createClient();
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    if (!hasMediaOperatorRole(data.user)) {
      return NextResponse.json(
        { error: "Media operator access required." },
        { status: 403 },
      );
    }
    return null;
  } catch {
    return NextResponse.json(
      { error: "Media operator verification unavailable." },
      { status: 503 },
    );
  }
}
