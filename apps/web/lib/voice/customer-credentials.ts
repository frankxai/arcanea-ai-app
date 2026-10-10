import { readProviderPreferences } from "@/lib/ai/provider-preferences";
import { validateCustomerKey } from "@/lib/gateway/credential-policy.mjs";

/** Read existing settings at request time; send only the two audio providers. */
export function voiceCredentialHeaders(
  storage?: Pick<Storage, "getItem">,
): Record<string, string> {
  let store: Pick<Storage, "getItem"> | undefined;
  try {
    store =
      storage ??
      (typeof window === "undefined" ? undefined : window.localStorage);
  } catch {
    return {};
  }
  if (!store) return {};
  try {
    const { keys } = readProviderPreferences(store);
    const headers: Record<string, string> = {};
    const groq = keys.groq || store.getItem("arcanea-voice-groq-key");
    if (groq) headers["x-groq-key"] = validateCustomerKey(groq);
    if (keys.openai) headers["x-openai-key"] = validateCustomerKey(keys.openai);
    return headers;
  } catch {
    throw new Error(
      "Your voice key settings could not be read. Check Settings → Providers.",
    );
  }
}

export async function voiceResponseMessage(
  response: Response,
): Promise<string> {
  if (response.status === 401)
    return "Connect your Groq or OpenAI key in Settings → Providers to use voice.";
  if (response.status === 400) {
    const payload: unknown = await response.json().catch(() => null);
    if (
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "string" &&
      payload.error.length <= 300
    )
      return payload.error;
  }
  return "Voice provider request failed. Try again or check your provider settings.";
}
