export const CHAT_PROVIDER_IDS = [
  "openrouter",
  "google",
  "anthropic",
  "openai",
  "xai",
  "deepseek",
  "groq",
  "cerebras",
  "mistral",
  "moonshot",
] as const;
const KEY_IDS: readonly string[] = [...CHAT_PROVIDER_IDS, "tavily", "brave"];
type KeyStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type ProviderKeys = Record<string, string>;

export function parseProviderKeys(raw: string | null): ProviderKeys {
  try {
    const value: unknown = JSON.parse(raw || "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([id, key]) =>
            KEY_IDS.includes(id) && typeof key === "string" && key.trim(),
        )
        .map(([id, key]) => [id, (key as string).trim()]),
    );
  } catch {
    return {};
  }
}

export function readProviderPreferences(storage: Pick<KeyStore, "getItem">) {
  const active = storage.getItem("arcanea-active-provider") || "google";
  return {
    keys: parseProviderKeys(storage.getItem("arcanea-provider-keys")),
    activeId: CHAT_PROVIDER_IDS.includes(
      active as (typeof CHAT_PROVIDER_IDS)[number],
    )
      ? active
      : "google",
  };
}

export function getModelKey(
  keys: ProviderKeys,
  modelProvider: string,
): string | undefined {
  return Object.hasOwn(keys, modelProvider)
    ? keys[modelProvider] || undefined
    : undefined;
}

/** Preserve the last saved configuration if a browser storage write fails. */
export function saveProviderPreferences(
  storage: KeyStore,
  keys: ProviderKeys,
  activeId: string,
  expectedState?: string,
) {
  if (
    expectedState !== undefined &&
    JSON.stringify(readProviderPreferences(storage)) !== expectedState
  ) {
    throw new Error(
      "Settings changed in another tab. Reload saved settings before saving.",
    );
  }
  if (!(CHAT_PROVIDER_IDS as readonly string[]).includes(activeId))
    throw new Error("Choose an available provider.");
  const names = [
    "arcanea-provider-keys",
    "arcanea-active-provider",
    "arcanea-active-model",
  ];
  const previous = names.map((name) => storage.getItem(name));
  try {
    storage.setItem(
      names[0],
      JSON.stringify(parseProviderKeys(JSON.stringify(keys))),
    );
    storage.setItem(names[1], activeId);
    storage.removeItem(names[2]);
  } catch {
    for (let i = 0; i < names.length; i++) {
      try {
        if (previous[i] === null) storage.removeItem(names[i]);
        else storage.setItem(names[i], previous[i]!);
      } catch {
        /* Storage can remain unavailable. Never report success. */
      }
    }
    throw new Error(
      "Your browser could not save these settings. Allow site storage and try again.",
    );
  }
}
