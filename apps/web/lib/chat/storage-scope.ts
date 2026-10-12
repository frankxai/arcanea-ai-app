import type {
  createCredentialScope,
  ProviderActor,
} from "@/lib/ai/provider-preferences";

export interface ChatStorageScope {
  readonly actor: ProviderActor;
  readonly lifetime?: object;
  isCurrent(): boolean;
}

// Old callers may only access the new guest store. Unattributed legacy keys stay
// untouched: their contents may include work from more than one account.
export const guestChatStorageScope: ChatStorageScope = {
  actor: "guest",
  isCurrent: () => true,
};

export function createChatStorageScope(
  credentialScope: ReturnType<typeof createCredentialScope>,
  token = credentialScope.get(),
): ChatStorageScope {
  return Object.freeze({
    actor: token.actor,
    lifetime: token,
    isCurrent: () => credentialScope.isCurrent(token),
  });
}

export function chatStorageKey(
  base: string,
  scope: ChatStorageScope,
): string | null {
  if (!scope.isCurrent() || !scope.actor) return null;
  if (
    scope.actor !== "guest" &&
    !/^user:[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(scope.actor)
  )
    return null;
  return `${base}:v2:${encodeURIComponent(scope.actor)}`;
}

export function chatUserId(scope: ChatStorageScope): string | null {
  return chatStorageKey("actor", scope) && scope.actor?.startsWith("user:")
    ? scope.actor.slice(5)
    : null;
}
