/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { createClient } from "@/lib/supabase/client";
import type { ChatMessage, ChatSession } from "@/lib/chat/local-store";
import { acknowledgeChatSnapshot, loadChatSession } from "./local-store";
import { chatSnapshotCloudId, chatSnapshotContentKey } from "./cloud-snapshot";
import {
  chatUserId,
  guestChatStorageScope,
  type ChatStorageScope,
} from "./storage-scope";

export interface CloudSession {
  id: string;
  title: string | null;
  messages?: Record<string, unknown>[];
  chat_messages?: Record<string, unknown>[];
  luminor_id: string | null;
  model_id: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string;
  revision?: string;
  cloud_id?: string;
}

export type ChatCloudSaveStatus =
  "synced" | "conflict" | "unavailable" | "failed" | "retired";
export interface ChatCloudSaveResult {
  status: ChatCloudSaveStatus;
}
interface CloudSnapshotInput {
  id: string;
  title: string;
  messages: Record<string, unknown>[];
  luminorId: string | null;
  modelId: string | null;
  projectId?: string | null;
}
const cloudQueues = new Map<string, Promise<unknown>>();
const deletedSessions = new Set<string>();
const confirmedRevisions = new WeakMap<
  object,
  Map<string, { baseRevision: string | null; revision: string }>
>();

async function serializeCloudWork<T>(
  key: string,
  action: () => Promise<T>,
): Promise<T> {
  const previous = cloudQueues.get(key) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(action);
  cloudQueues.set(key, next);
  try {
    return await next;
  } finally {
    if (cloudQueues.get(key) === next) cloudQueues.delete(key);
  }
}

function normalizeCloudMessage(
  message: Record<string, unknown>,
): ChatMessage | null {
  if (typeof message.id !== "string") return null;
  if (message.role !== "user" && message.role !== "assistant") return null;

  const normalized: ChatMessage = {
    id: message.id,
    role: message.role,
    content: typeof message.content === "string" ? message.content : "",
  };

  if (typeof message.createdAt === "string") {
    normalized.createdAt = message.createdAt;
  }

  if (Array.isArray(message.parts)) {
    normalized.parts = message.parts
      .filter(
        (part): part is { type: string; text?: string } =>
          typeof part === "object" &&
          part !== null &&
          typeof (part as { type?: unknown }).type === "string" &&
          ((part as { text?: unknown }).text === undefined ||
            typeof (part as { text?: unknown }).text === "string"),
      )
      .map((part) => ({
        type: part.type,
        ...(part.text !== undefined ? { text: part.text } : {}),
      }));
  }

  return normalized;
}

export async function saveChatSnapshotToCloud(
  session: CloudSnapshotInput,
  scope: ChatStorageScope = guestChatStorageScope,
): Promise<ChatCloudSaveResult> {
  const userId = chatUserId(scope);
  if (!userId) return { status: "retired" };
  if (
    !Array.isArray(session.messages) ||
    session.messages.some(
      (message) =>
        !message ||
        typeof message.id !== "string" ||
        !message.id ||
        message.id.length > 200 ||
        (message.role !== "user" && message.role !== "assistant") ||
        typeof message.content !== "string" ||
        (message.parts !== undefined &&
          (!Array.isArray(message.parts) ||
            message.parts.some(
              (part) =>
                !part ||
                typeof part !== "object" ||
                typeof part.type !== "string" ||
                (part.text !== undefined && typeof part.text !== "string") ||
                Object.keys(part).some(
                  (key) => key !== "type" && key !== "text",
                ),
            ))),
    )
  )
    return { status: "failed" };
  const messages = session.messages.map(normalizeCloudMessage);
  if (
    messages.some((message) => message === null) ||
    messages.length > 1000 ||
    new Set(messages.map((message) => message?.id)).size !== messages.length ||
    new TextEncoder().encode(JSON.stringify(session)).length > 1024 * 1024
  )
    return { status: "failed" };
  // Capture immutable content at admission; queued work must not read a later
  // mutable message array and mislabel its acknowledgement.
  const snapshot = { ...session, messages: messages as ChatMessage[] };
  const contentKey = chatSnapshotContentKey(snapshot);
  const queueKey = `${userId}:${session.id}`;
  return serializeCloudWork<ChatCloudSaveResult>(queueKey, async () => {
    if (!scope.isCurrent() || deletedSessions.has(queueKey))
      return { status: "retired" };
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!scope.isCurrent() || user?.id !== userId)
        return { status: "retired" };
      const cloudId = await chatSnapshotCloudId(snapshot.id, userId);
      if (!scope.isCurrent() || deletedSessions.has(queueKey))
        return { status: "retired" };
      const localBase =
        loadChatSession(snapshot.id, scope)?.cloudRevision ?? null;
      const lifetime = scope.lifetime ?? scope;
      const checkpoint = confirmedRevisions.get(lifetime)?.get(snapshot.id);
      const expectedRevision =
        checkpoint?.baseRevision === localBase
          ? checkpoint.revision
          : localBase;
      const { data, error } = await supabase
        .rpc("save_chat_snapshot", {
          p_session_id: cloudId,
          p_client_session_id: snapshot.id,
          p_expected_user_id: userId,
          p_expected_revision: expectedRevision,
          p_title: snapshot.title,
          p_luminor_id: snapshot.luminorId || "lumina",
          p_model_id: snapshot.modelId,
          p_project_id: snapshot.projectId ?? null,
          p_messages: snapshot.messages,
        })
        .abortSignal(AbortSignal.timeout(20_000));
      if (!scope.isCurrent()) return { status: "retired" };
      if (error) {
        if (error.message === "chat_revision_conflict")
          return { status: "conflict" };
        if (["PGRST202", "42P01", "42703", "42883"].includes(error.code))
          return { status: "unavailable" };
        return { status: "failed" };
      }
      if (
        !data ||
        typeof data.revision !== "string" ||
        !/^[0-9a-f]{64}$/i.test(data.revision)
      )
        return { status: "failed" };
      let checkpoints = confirmedRevisions.get(lifetime);
      if (!checkpoints) {
        checkpoints = new Map();
        confirmedRevisions.set(lifetime, checkpoints);
      }
      checkpoints.set(snapshot.id, {
        baseRevision: localBase,
        revision: data.revision,
      });
      acknowledgeChatSnapshot(snapshot.id, data.revision, contentKey, scope);
      return { status: "synced" };
    } catch {
      return { status: "failed" };
    }
  });
}

export async function saveSessionToCloud(
  session: CloudSnapshotInput,
  scope: ChatStorageScope = guestChatStorageScope,
): Promise<boolean> {
  return (await saveChatSnapshotToCloud(session, scope)).status === "synced";
}

/**
 * Load all chat sessions from Supabase for the current user.
 */
export async function loadCloudSessions(
  scope: ChatStorageScope = guestChatStorageScope,
): Promise<CloudSession[]> {
  const userId = chatUserId(scope);
  if (!userId) return [];
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!scope.isCurrent() || user?.id !== userId) return [];

    const { data, error } = await supabase
      .rpc("load_chat_snapshots", {
        p_expected_user_id: userId,
      })
      .abortSignal(AbortSignal.timeout(20_000));

    if (!scope.isCurrent() || error || !data) return [];
    return data as unknown as CloudSession[];
  } catch {
    return [];
  }
}

/**
 * Delete a chat session from Supabase.
 */
export async function deleteCloudSession(
  sessionId: string,
  scope: ChatStorageScope = guestChatStorageScope,
): Promise<boolean> {
  const userId = chatUserId(scope);
  if (!userId) return false;
  const queueKey = `${userId}:${sessionId}`;
  deletedSessions.add(queueKey);
  return serializeCloudWork(queueKey, async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!scope.isCurrent() || user?.id !== userId) return false;
      const cloudId = await chatSnapshotCloudId(sessionId, userId);
      if (!scope.isCurrent()) return false;
      const { error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", cloudId)
        .eq("user_id", userId);
      return scope.isCurrent() && !error;
    } catch {
      return false;
    }
  });
}

/**
 * Rename a chat session in Supabase.
 */
export async function renameCloudSession(
  sessionId: string,
  title: string,
  scope: ChatStorageScope = guestChatStorageScope,
): Promise<boolean> {
  const session = loadChatSession(sessionId, scope);
  if (!session) return false;
  return saveSessionToCloud(
    {
      ...session,
      title,
      messages: session.messages as unknown as Record<string, unknown>[],
      luminorId: session.luminorId ?? null,
      modelId: session.modelId ?? null,
    },
    scope,
  );
}

/**
 * Convert a Supabase cloud session to the local ChatSession shape.
 */
export function cloudSessionToLocalSession(cloud: CloudSession): ChatSession {
  return {
    id: cloud.id,
    title: cloud.title || "Untitled",
    messages: (Array.isArray(cloud.messages)
      ? cloud.messages
      : Array.isArray(cloud.chat_messages)
        ? cloud.chat_messages
        : []
    )
      .filter((message) => message && typeof message === "object")
      .map((message) =>
        normalizeCloudMessage({
          ...message,
          createdAt: message.createdAt ?? message.created_at,
        }),
      )
      .filter((message): message is ChatMessage => message !== null),
    luminorId: cloud.luminor_id ?? null,
    modelId: cloud.model_id ?? null,
    projectId: cloud.project_id ?? null,
    createdAt: cloud.created_at,
    updatedAt: cloud.updated_at,
    cloudRevision: cloud.revision,
    cloudDirty: false,
  };
}
