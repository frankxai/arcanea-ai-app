/**
 * Admission rules for paid video generation (`/api/imagine/animate`).
 *
 * Video providers are the most expensive calls in Imagine, so the route must
 * refuse any request that is not signed in and backed by an explicit,
 * successful credit spend. These helpers are pure so they can be tested
 * without a network or a Supabase session.
 */

export type VideoAdmission =
  { allowed: true } | { allowed: false; status: number; error: string };

export const MAX_ANIMATION_PROMPT_LENGTH = 1000;
const MAX_IMAGE_URL_LENGTH = 2048;

/** Hosts this app always serves in production. */
const PRODUCTION_HOSTS = ["arcanea.ai", "www.arcanea.ai"];

/**
 * The credit spend is a same-app call that forwards the caller's cookies, so
 * it may only go to an origin this deployment is known to serve: the
 * production hosts or Vercel's own deployment, branch and production URLs.
 * A host taken from request headers alone is never trusted. Local http is
 * allowed only outside production.
 */
export function trustedSpendOrigin(
  requestOrigin: string,
  env: Record<string, string | undefined>,
): string | null {
  let url: URL;
  try {
    url = new URL(requestOrigin);
  } catch {
    return null;
  }
  const host = url.host.toLowerCase();
  const isLocal =
    env.NODE_ENV !== "production" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1");
  if (isLocal) return url.origin;
  if (url.protocol !== "https:") return null;
  const allowed = new Set(
    [
      ...PRODUCTION_HOSTS,
      env.VERCEL_URL,
      env.VERCEL_BRANCH_URL,
      env.VERCEL_PROJECT_PRODUCTION_URL,
    ]
      .filter((value): value is string => Boolean(value))
      .map((value) => value.toLowerCase()),
  );
  return allowed.has(host) ? url.origin : null;
}

/** Only https image URLs (Vercel Blob or a provider-hosted image) may reach a video provider. */
export function isHttpsImageUrl(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > MAX_IMAGE_URL_LENGTH
  ) {
    return false;
  }
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** Map a `/api/credits/spend` response to an admission decision. Fails closed. */
export function admissionFromSpend(
  status: number,
  body: unknown,
): VideoAdmission {
  if (
    status === 200 &&
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    (body as { success: unknown }).success === true
  ) {
    return { allowed: true };
  }
  if (status === 401)
    return { allowed: false, status: 401, error: "Sign in to animate images" };
  if (status === 402)
    return { allowed: false, status: 402, error: "Insufficient credits" };
  if (status === 429)
    return { allowed: false, status: 429, error: "Too many requests" };
  return {
    allowed: false,
    status: 503,
    error: "Credit admission is unavailable",
  };
}
