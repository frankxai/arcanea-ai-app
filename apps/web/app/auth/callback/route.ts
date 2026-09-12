/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureProfileForUser } from "@/lib/supabase/profile-bootstrap";
import { safeAuthNextPath } from "@/lib/auth/safe-next-path";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeAuthNextPath(requestUrl.searchParams.get("next"), "/");

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=missing_code", requestUrl.origin),
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await ensureProfileForUser(user);
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    console.error("Supabase auth callback exchange failed:", error.message);
  } catch (error) {
    console.error("Supabase auth callback unexpected error:", error);
  }

  return NextResponse.redirect(
    new URL("/auth/login?error=callback_failed", requestUrl.origin),
  );
}
