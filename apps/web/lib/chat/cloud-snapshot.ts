export interface ChatSnapshotContent {
  title: string;
  luminorId?: string | null;
  modelId?: string | null;
  projectId?: string | null;
  messages: ReadonlyArray<{
    id: string;
    role: string;
    content: string;
    parts?: Array<{ type: string; text?: string }>;
  }>;
}

export function chatSnapshotContentKey(snapshot: ChatSnapshotContent): string {
  return JSON.stringify({
    title: snapshot.title,
    luminorId: snapshot.luminorId || "lumina",
    modelId: snapshot.modelId ?? null,
    projectId: snapshot.projectId ?? null,
    messages: snapshot.messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      parts: message.parts ?? [],
    })),
  });
}

export async function chatSnapshotCloudId(
  localId: string,
  userId: string,
): Promise<string> {
  if (/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(localId))
    return localId.toLowerCase();
  if (!localId || localId.length > 200) throw new Error("Invalid session ID");
  // Stable UUIDv8 mapping for already account-scoped old browser IDs.
  // This never reads or adopts the unattributed legacy browser store.
  const bytes = new Uint8Array(
    await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(`arcanea-chat-v1:${userId}:${localId}`),
    ),
  ).slice(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x80;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
