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
const KEY_IDS: readonly string[] = [
  ...CHAT_PROVIDER_IDS,
  "tavily",
  "brave",
  "elevenlabs",
];
type KeyStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type ProviderKeys = Record<string, string>;
export type ProviderActor = "guest" | `user:${string}` | null;

export function providerActor(
  userId: string | undefined,
  loading: boolean,
): ProviderActor {
  return loading ? null : userId ? `user:${userId}` : "guest";
}

/** Auth updates this before React renders; tokens also reject A → B → A results. */
export function createCredentialScope() {
  let snapshot: { actor: ProviderActor; revision: number } = {
    actor: null,
    revision: 0,
  };
  return {
    get: () => snapshot,
    set: (actor: ProviderActor) => {
      if (actor !== snapshot.actor)
        snapshot = { actor, revision: snapshot.revision + 1 };
    },
    isCurrent: (token: typeof snapshot) =>
      token === snapshot && token.actor !== null,
  };
}

export function providerStorageNames(actor: ProviderActor) {
  if (!actor) return null;
  const suffix = `:v2:${encodeURIComponent(actor)}`;
  return {
    keys: `arcanea-provider-keys${suffix}`,
    provider: `arcanea-active-provider${suffix}`,
    model: `arcanea-active-model${suffix}`,
  };
}

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

export function readProviderPreferences(
  storage: Pick<KeyStore, "getItem">,
  actor: ProviderActor,
) {
  const names = providerStorageNames(actor);
  if (!names) return { keys: {}, activeId: "google" };
  const active = storage.getItem(names.provider) || "google";
  return {
    keys: parseProviderKeys(storage.getItem(names.keys)),
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
  actor: ProviderActor,
  expectedState?: string,
) {
  const slots = providerStorageNames(actor);
  if (!slots)
    throw new Error(
      "Wait for your account to finish loading before saving settings.",
    );
  if (
    expectedState !== undefined &&
    JSON.stringify(readProviderPreferences(storage, actor)) !== expectedState
  ) {
    throw new Error(
      "Settings changed in another tab. Reload saved settings before saving.",
    );
  }
  if (!(CHAT_PROVIDER_IDS as readonly string[]).includes(activeId))
    throw new Error("Choose an available provider.");
  const names = [slots.keys, slots.provider, slots.model];
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
