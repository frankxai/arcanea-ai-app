import {
  WORLD_DRAFT_KEY,
  storedWorldDraftSchema,
  readStoredWorldDraft,
  saveWorldDraftSchema,
} from "@/lib/worlds/draft";
import {
  readWorldRequest,
  worldConversationSchema,
  worldGenerationRequestSchema,
  worldGenerationSchema,
} from "@/lib/worlds/generation";
import { z } from "zod";

const RECOVERY_LIMIT = 250000;

const handoffDraftSchema = storedWorldDraftSchema
  .extend({
    source: z
      .object({
        kind: z.literal("world-chat"),
        conversation: worldConversationSchema,
      })
      .strict(),
  })
  .strict();
const recoverySchema = z.discriminatedUnion("status", [
  z
    .object({
      version: z.literal(1),
      actor: z.string().uuid(),
      status: z.literal("idle"),
      source: worldConversationSchema.optional(),
    })
    .strict(),
  z
    .object({
      version: z.literal(1),
      actor: z.string().uuid(),
      status: z.literal("pending"),
      attempt_id: z.string().uuid(),
      request: worldGenerationRequestSchema,
    })
    .strict(),
  z
    .object({
      version: z.literal(1),
      actor: z.string().uuid(),
      status: z.literal("ready"),
      draft: handoffDraftSchema,
    })
    .strict(),
]);

type Conversation = Array<{ role: string; content: string }>;
type Draft = z.infer<typeof handoffDraftSchema>;
type StoragePort = Pick<Storage, "getItem" | "setItem">;
interface Snapshot {
  isCreating: boolean;
  draft: Draft | null;
  transferred: boolean;
  uncertain: boolean;
  error: string | null;
  source: z.infer<typeof worldConversationSchema> | null;
}
interface Ports {
  actor: string | null;
  isCurrent: () => boolean;
  storage: () => StoragePort;
  customerKey: () => string;
  fetch: typeof fetch;
}
function freeze<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

/** One creator gesture, one inference. Transfer retries reuse the retained result. */
export function createWorldHandoffSession(ports: Ports) {
  let snapshot: Snapshot = Object.freeze({
    isCreating: false,
    draft: null,
    transferred: false,
    uncertain: false,
    error: null,
    source: null,
  });
  const listeners = new Set<() => void>();
  let controller: AbortController | null = null;
  let hydrated = false;
  let recoveryRaw: string | null = null;
  const publish = (patch: Partial<Snapshot>) => {
    snapshot = Object.freeze({ ...snapshot, ...patch });
    listeners.forEach((listener) => listener());
  };
  const current = () => {
    if (!ports.actor || !ports.isCurrent())
      throw new Error(
        "Sign in to the conversation's account before preparing a world draft.",
      );
    return ports.actor;
  };
  const occupied =
    "This tab already has a world draft. Open it and export or finish it before preparing another. Your conversation is still here.";
  const uncertainty =
    "Generation was not confirmed and may have used Google quota. Your conversation is still here. A new attempt needs your confirmation; it could use quota again.";
  const recoveryKey = (actor: string) =>
    `arcanea.world-chat-handoff.v1.${actor}`;
  const readRecovery = () => {
    const actor = current();
    const raw = ports.storage().getItem(recoveryKey(actor));
    if (raw === null) {
      current();
      return { raw, record: null };
    }
    if (raw.length > RECOVERY_LIMIT) throw new Error("Recovery is too large.");
    const record = recoverySchema.parse(JSON.parse(raw));
    if (
      record.actor !== actor ||
      (record.status === "pending" &&
        record.request.expected_actor !== actor) ||
      (record.status === "ready" &&
        !worldGenerationSchema.safeParse(record.draft.world).success)
    )
      throw new Error("Recovery account or draft could not be verified.");
    current();
    return { raw, record };
  };
  const writeRecovery = (record: z.infer<typeof recoverySchema>) => {
    const actor = current();
    const storage = ports.storage();
    const key = recoveryKey(actor);
    const raw = JSON.stringify(record);
    if (raw.length > RECOVERY_LIMIT) throw new Error("Recovery is too large.");
    const existing = storage.getItem(key);
    if (existing !== raw) {
      if (existing !== recoveryRaw)
        throw new Error("Recovery changed in another session.");
      current();
      storage.setItem(key, raw);
      if (storage.getItem(key) !== raw)
        throw new Error("Recovery storage was not confirmed.");
    }
    current();
    recoveryRaw = raw;
  };
  const restore = () => {
    if (hydrated || snapshot.isCreating || !ports.actor || !ports.isCurrent())
      return;
    try {
      const { raw, record } = readRecovery();
      recoveryRaw = raw;
      hydrated = true;
      if (record?.status === "pending")
        publish({
          uncertain: true,
          error: uncertainty,
          source: freeze(record.request.conversation ?? null),
        });
      if (record?.status === "idle" && record.source)
        publish({ source: freeze(record.source) });
      if (record?.status === "ready")
        publish({ draft: freeze(record.draft), error: null });
    } catch {
      if (ports.isCurrent())
        publish({
          uncertain: true,
          error:
            "World recovery could not be read. Keep this tab's data and open the existing world draft before continuing. No generation was started.",
        });
    }
  };
  const transfer = () => {
    if (!snapshot.draft) return false;
    try {
      const actor = current();
      const storage = ports.storage();
      const key = `${WORLD_DRAFT_KEY}.${actor}`;
      const raw = JSON.stringify(snapshot.draft);
      // Persist the completed result even when an existing editor draft blocks transfer.
      writeRecovery({
        version: 1,
        actor,
        status: "ready",
        draft: snapshot.draft,
      });
      if (raw.length > 150000)
        throw new Error(
          "This draft is too large for tab recovery. Download it before continuing.",
        );
      const existing = storage.getItem(key);
      if (
        existing !== null &&
        existing !== raw &&
        readStoredWorldDraft(existing)?.draft_id !== snapshot.draft.draft_id
      )
        throw new Error(occupied);
      // The creator can rewrite its working draft; retain the original source separately.
      const sourceKey = `arcanea.world-chat-source.v1.${actor}.${snapshot.draft.draft_id}`;
      const source = storage.getItem(sourceKey);
      if (source !== null && source !== raw)
        throw new Error(
          "The source recovery copy changed. Download this draft before continuing.",
        );
      current();
      storage.setItem(sourceKey, raw);
      if (storage.getItem(sourceKey) !== raw)
        throw new Error("Source storage was not confirmed.");
      current();
      // An editor may already contain newer edits of this same draft. Keep them.
      if (existing === null) storage.setItem(key, raw);
      if (storage.getItem(key) !== (existing ?? raw))
        throw new Error("Draft storage was not confirmed.");
      current();
      publish({ transferred: true, error: null });
      return true;
    } catch (error) {
      if (ports.isCurrent())
        publish({
          transferred: false,
          error:
            error instanceof Error && error.message === occupied
              ? occupied
              : "The draft is ready, but transfer was not confirmed. Download it or retry transfer; this will not generate again.",
        });
      return false;
    }
  };
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    snapshot: () => snapshot,
    restore,
    transfer,
    exportText() {
      current();
      return snapshot.draft
        ? JSON.stringify(snapshot.draft, null, 2)
        : snapshot.source
          ? JSON.stringify(
              {
                version: 1,
                source: { kind: "world-chat", conversation: snapshot.source },
              },
              null,
              2,
            )
          : null;
    },
    allowAnotherAttempt() {
      if (snapshot.isCreating || snapshot.draft) return;
      try {
        const actor = current();
        const { raw, record } = readRecovery();
        if (record && record.status !== "pending" && record.status !== "idle")
          throw new Error("A completed draft is available.");
        recoveryRaw = raw;
        const source =
          record?.status === "pending"
            ? record.request.conversation
            : record?.source;
        writeRecovery({
          version: 1,
          actor,
          status: "idle",
          ...(source ? { source } : {}),
        });
        hydrated = true;
        publish({ uncertain: false, error: null });
      } catch {
        if (ports.isCurrent())
          publish({
            error:
              "Recovery was not confirmed. Open the existing draft or preserve this tab's data before another attempt.",
          });
      }
    },
    startAnotherDraft() {
      if (snapshot.isCreating || !snapshot.draft) return false;
      try {
        const actor = current();
        const storage = ports.storage();
        if (storage.getItem(`${WORLD_DRAFT_KEY}.${actor}`) !== null)
          throw new Error(occupied);
        const raw = JSON.stringify(snapshot.draft);
        if (
          storage.getItem(
            `arcanea.world-chat-source.v1.${actor}.${snapshot.draft.draft_id}`,
          ) !== raw
        )
          throw new Error("The original draft has not been retained.");
        writeRecovery({ version: 1, actor, status: "idle" });
        publish({
          draft: null,
          transferred: false,
          uncertain: false,
          error: null,
          source: null,
        });
        return true;
      } catch {
        if (ports.isCurrent())
          publish({
            error:
              "Finish or export and clear the working draft in the world creator first. Its source recovery copy must remain available before starting another.",
          });
        return false;
      }
    },
    cancel() {
      controller?.abort();
    },
    async generate(messages: Conversation) {
      if (snapshot.isCreating || snapshot.uncertain) return;
      let dispatched = false;
      let active: AbortController | null = null;
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        const actor = current();
        restore();
        if (snapshot.uncertain) return;
        if (snapshot.draft) {
          transfer();
          return;
        }
        const selected = messages.length ? messages : (snapshot.source ?? []);
        const conversation = selected.filter((message) =>
          message.content.trim(),
        );
        const first = conversation.find((message) => message.role === "user");
        const parsed = worldGenerationRequestSchema.safeParse({
          description: first?.content.trim().slice(0, 500),
          conversation,
          expected_actor: actor,
        });
        if (!parsed.success)
          throw new Error(
            "Use up to 40 text turns and 24,000 characters. Your conversation is unchanged; export it before reducing the selected context.",
          );
        if (ports.storage().getItem(`${WORLD_DRAFT_KEY}.${actor}`) !== null)
          throw new Error(occupied);
        const key = ports.customerKey();
        if (!key)
          throw new Error(
            "Connect your Gemini key in Settings → Providers. Your conversation is still here.",
          );
        current();
        writeRecovery({
          version: 1,
          actor,
          status: "pending",
          attempt_id: crypto.randomUUID(),
          request: parsed.data,
        });
        active = new AbortController();
        controller = active;
        timer = setTimeout(() => active?.abort(), 55000);
        publish({
          isCreating: true,
          error: null,
          source: freeze(parsed.data.conversation ?? null),
        });
        dispatched = true;
        const response = await ports.fetch("/api/worlds/generate", {
          method: "POST",
          signal: active.signal,
          headers: { "Content-Type": "application/json", "x-google-key": key },
          body: JSON.stringify(parsed.data),
        });
        current();
        active.signal.throwIfAborted();
        if (!response.ok) {
          await response.body?.cancel().catch(() => {});
          if ([400, 401, 402, 403, 409, 413].includes(response.status)) {
            writeRecovery({
              version: 1,
              actor,
              status: "idle",
              source: parsed.data.conversation,
            });
            dispatched = false;
            throw new Error(
              response.status === 409
                ? "The account changed. Keep this conversation and return to its owner account."
                : response.status === 401
                  ? "Sign in to prepare this world draft. Your conversation is still here."
                  : response.status === 402
                    ? "Connect your Gemini key in Settings → Providers. Your conversation is still here."
                    : "This world request was refused. Check the selected context and Gemini key; your conversation is still here.",
            );
          }
          throw new Error("Generation was not confirmed.");
        }
        const raw = await readWorldRequest(
          {
            body: response.body,
            headers: response.headers,
            signal: active.signal,
          },
          150000,
        );
        const data: unknown = JSON.parse(raw);
        const validated = saveWorldDraftSchema.safeParse(data);
        if (
          !validated.success ||
          !data ||
          typeof data !== "object" ||
          !("saved" in data) ||
          data.saved !== false ||
          !("actor_id" in data) ||
          data.actor_id !== actor
        )
          throw new Error("The draft response could not be verified.");
        if (!worldGenerationSchema.safeParse(validated.data.world).success)
          throw new Error("The draft is incomplete.");
        current();
        active.signal.throwIfAborted();
        const draft = freeze({
          version: 1 as const,
          description: parsed.data.description,
          ...validated.data,
          source: {
            kind: "world-chat" as const,
            conversation: parsed.data.conversation!,
          },
        });
        publish({ draft, isCreating: false, uncertain: false });
        transfer();
      } catch (error) {
        if (ports.isCurrent())
          publish({
            isCreating: false,
            uncertain: dispatched,
            error: dispatched
              ? uncertainty
              : error instanceof Error
                ? error.message
                : "Tab storage is unavailable. Export your conversation before continuing.",
          });
      } finally {
        clearTimeout(timer);
        if (controller === active) controller = null;
      }
    },
  };
}
