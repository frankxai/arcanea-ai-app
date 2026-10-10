/** A retry retains its request key across reloads without storing prompts or images. */
export async function requestImages(
  input: Record<string, unknown>,
): Promise<Response> {
  const body = JSON.stringify(input);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(body),
  );
  const fingerprint = Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  const slot = `arcanea:image-request:${fingerprint}`;
  let key: string | null = null;
  try {
    key = sessionStorage.getItem(slot);
  } catch {
    throw new Error(
      "Enable browser session storage to preserve generation retries.",
    );
  }
  key ??= crypto.randomUUID();
  try {
    sessionStorage.setItem(slot, key);
    if (sessionStorage.getItem(slot) !== key)
      throw new Error("Request key was not saved");
  } catch {
    throw new Error(
      "Enable browser session storage to preserve generation retries.",
    );
  }
  const response = await fetch("/api/imagine/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, requestKey: key }),
  });
  const failure = response.ok
    ? null
    : ((await response
        .clone()
        .json()
        .catch(() => null)) as { reason?: string } | null);
  if (response.ok || failure?.reason === "generation_failed") {
    try {
      if (sessionStorage.getItem(slot) === key) sessionStorage.removeItem(slot);
    } catch {
      /* Storage may be disabled. */
    }
  }
  return response;
}
