/** Normalize an untrusted post-login destination to a same-origin path. */
export function getSafeNextPath(next: string | null): string {
  if (
    !next?.startsWith("/") ||
    next.startsWith("//") ||
    /[\\\u0000-\u0020\u007f]/.test(next)
  )
    return "/";
  try {
    const origin = "https://auth-return.invalid";
    const target = new URL(next, origin);
    if (
      target.origin !== origin ||
      target.pathname.startsWith("//") ||
      /%2f|%5c/i.test(target.pathname)
    )
      return "/";
    return target.pathname + target.search + target.hash;
  } catch {
    return "/";
  }
}

/** Supabase can fall back to Site URL when a requested callback is not allowed. */
export function getOAuthRecoveryPath(url: {
  pathname: string;
  searchParams: URLSearchParams;
}): string | null {
  const code = url.searchParams.get("code");
  if (url.pathname !== "/" || !code) return null;
  const params = new URLSearchParams({
    code,
    next: getSafeNextPath(url.searchParams.get("next") ?? "/dashboard"),
  });
  return `/auth/callback?${params.toString()}`;
}
