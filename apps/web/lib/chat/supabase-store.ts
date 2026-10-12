/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { createClient } from "@/lib/supabase/client";
import type { ChatMessage, ChatSession } from "@/lib/chat/local-store";
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

/**
 * Save a chat session to Supabase (upsert).
 * Silently fails if not authenticated or table doesn't exist.
 */
export async function saveSessionToCloud(
  session: {
    id: string;
    title: string;
    messages: Record<string, unknown>[];
    luminorId: string | null;
    modelId: string | null;
    projectId?: string | null;
  },
  scope: ChatStorageScope = guestChatStorageScope,
): Promise<boolean> {
  const userId = chatUserId(scope);
  if (!userId) return false;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!scope.isCurrent() || user?.id !== userId) return false;

    const { error } = await supabase.from("chat_sessions").upsert(
      {
        id: session.id,
        user_id: userId,
        title: session.title,
        luminor_id: session.luminorId || "lumina",
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: "id" },
    );

    if (error) {
      // Table might not exist yet — silently fail
      if (error.code === "42P01") return false; // relation does not exist
      console.warn("[cloud-sync] Save failed:", error.message);
      return false;
    }
    return scope.isCurrent();
  } catch {
    return false;
  }
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
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(50);

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
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!scope.isCurrent() || user?.id !== userId) return false;
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", userId);
    return scope.isCurrent() && !error;
  } catch {
    return false;
  }
}

/**
 * Rename a chat session in Supabase.
 */
export async function renameCloudSession(
  sessionId: string,
  title: string,
  scope: ChatStorageScope = guestChatStorageScope,
): Promise<boolean> {
  const userId = chatUserId(scope);
  if (!userId) return false;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!scope.isCurrent() || user?.id !== userId) return false;
    const { error } = await supabase
      .from("chat_sessions")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", userId);
    return scope.isCurrent() && !error;
  } catch {
    return false;
  }
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
  };
}
