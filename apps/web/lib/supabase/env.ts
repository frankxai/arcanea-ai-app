/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */

export type PublicSupabaseBindingSource = "next-public" | "server";

export type PublicSupabaseBindingErrorCode =
  "SUPABASE_PUBLIC_BINDING_MISSING" | "SUPABASE_PUBLIC_BINDING_INVALID";

export class PublicSupabaseBindingError extends Error {
  constructor(readonly code: PublicSupabaseBindingErrorCode) {
    super(
      code === "SUPABASE_PUBLIC_BINDING_MISSING"
        ? "Public Supabase binding is missing."
        : "Public Supabase binding is invalid.",
    );
    this.name = "PublicSupabaseBindingError";
  }
}

function containsPlaceholder(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("placeholder") ||
    normalized.includes("example.") ||
    normalized.includes("your-")
  );
}

function isSupportedPublicApiKey(apiKey: string): boolean {
  if (apiKey.startsWith("sb_publishable_")) return true;
  if (apiKey.startsWith("sb_")) return false;

  const segments = apiKey.split(".");
  if (segments.length !== 3) return false;

  try {
    const encodedPayload = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = encodedPayload.padEnd(
      Math.ceil(encodedPayload.length / 4) * 4,
      "=",
    );
    const payload = JSON.parse(atob(paddedPayload)) as { role?: unknown };
    return payload.role === "anon";
  } catch {
    return false;
  }
}

/**
 * Strict runtime contract for public, RLS-protected Data API reads.
 *
 * A deployed route must use one complete publishable/anon pair or fail before
 * opening a network request. The service-role credential is never a fallback.
 */
export function getPublicSupabaseBinding() {
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publicKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();
  const serverUrl = process.env.SUPABASE_URL?.trim();
  const serverKey = (
    process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY
  )?.trim();

  let source: PublicSupabaseBindingSource;
  let url: string;
  let apiKey: string;

  if (publicUrl && publicKey) {
    source = "next-public";
    url = publicUrl;
    apiKey = publicKey;
  } else if (serverUrl && serverKey) {
    source = "server";
    url = serverUrl;
    apiKey = serverKey;
  } else {
    throw new PublicSupabaseBindingError("SUPABASE_PUBLIC_BINDING_MISSING");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new PublicSupabaseBindingError("SUPABASE_PUBLIC_BINDING_INVALID");
  }

  if (
    parsedUrl.protocol !== "https:" ||
    containsPlaceholder(parsedUrl.hostname) ||
    apiKey.length < 20 ||
    containsPlaceholder(apiKey) ||
    !isSupportedPublicApiKey(apiKey)
  ) {
    throw new PublicSupabaseBindingError("SUPABASE_PUBLIC_BINDING_INVALID");
  }

  return {
    url: parsedUrl.origin,
    apiKey,
    source,
  };
}

export function getSupabaseEnv() {
  // Vercel-Supabase integration may provision vars with or without the NEXT_PUBLIC_ prefix.
  // Try NEXT_PUBLIC_ first (works client-side + server-side), fall back to unprefixed (server-side only).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return {
      url: "https://example.supabase.co",
      anonKey: "preview-build-placeholder",
    };
  }

  return { url, anonKey };
}

export function getSupabaseServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for admin operations.",
    );
  }

  return key;
}
