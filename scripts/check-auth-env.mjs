import { pathToFileURL } from "node:url";

/** Build-time configuration check, not a credential or authorization validator. */
export function validateAuthBuildEnvironment(env = process.env) {
  const required =
    env.VERCEL_ENV === "production" || env.CHECK_AUTH_ENV === "1";
  if (!required) return { required, errors: [] };

  const errors = [];
  const urlValue = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let url;
  if (!urlValue) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is required.");
  } else {
    try {
      url = new URL(urlValue);
      if (
        urlValue !== urlValue.trim() ||
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.pathname !== "/" ||
        url.search ||
        url.hash ||
        /^(example|your-project|placeholder)\./i.test(url.hostname)
      )
        throw new Error();
    } catch {
      errors.push(
        "NEXT_PUBLIC_SUPABASE_URL must be a real HTTPS project origin.",
      );
    }
  }
  if (!key) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is required.");
  } else {
    try {
      if (key !== key.trim()) throw new Error();
      if (!/^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(key)) {
        const parts = key.split(".");
        if (
          parts.length !== 3 ||
          parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))
        )
          throw new Error();
        const payload = JSON.parse(
          Buffer.from(parts[1], "base64url").toString("utf8"),
        );
        if (payload.role !== "anon") throw new Error();
        if (
          url?.hostname.endsWith(".supabase.co") &&
          payload.ref !== url.hostname.split(".")[0]
        )
          throw new Error();
      }
    } catch {
      errors.push(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY must be a public anon or publishable key for this project.",
      );
    }
  }
  return { required, errors };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const result = validateAuthBuildEnvironment();
  if (result.errors.length) {
    console.error(
      "Auth build configuration failed:\n" +
        result.errors.map((error) => `- ${error}`).join("\n"),
    );
    process.exitCode = 1;
  } else {
    console.log(
      result.required
        ? "Auth build configuration: passed (values withheld)."
        : "Auth build configuration: offline/preview; use CHECK_AUTH_ENV=1 to require sign-in.",
    );
  }
}
