/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * localStorage-based chat persistence
 *
 * Keeps a bounded cache of acknowledged cloud copies, while retaining pinned
 * conversations and work that has no confirmed cloud copy.
 * Each session holds its messages, title, and timestamps.
 * When Supabase auth is configured, the persistence hook can
 * be upgraded to sync with the server — this module stays as
 * the offline / anonymous fallback.
 */

import {
  chatStorageKey,
  guestChatStorageScope,
  type ChatStorageScope,
} from "./storage-scope";
import { chatSnapshotContentKey } from "./cloud-snapshot";

const STORAGE_KEY = "arcanea_chat_sessions";
const ACTIVE_SESSION_KEY = "arcanea_active_chat_session";
const MAX_SESSIONS = 50;
const TITLE_MAX_LENGTH = 60;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Structured parts from AI SDK v6 — preserved for round-trip fidelity */
  parts?: Array<{ type: string; text?: string }>;
  createdAt?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  luminorId?: string | null;
  modelId?: string | null;
  projectId?: string | null;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
  cloudRevision?: string;
  cloudDirty?: boolean;
}

export interface ChatSessionSummary {
  id: string;
  title: string;
  messageCount: number;
  lastMessage: string | null;
  luminorId: string | null;
  projectId: string | null;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readSessions(scope: ChatStorageScope): ChatSession[] {
  if (typeof window === "undefined") return [];
  const key = chatStorageKey(STORAGE_KEY, scope);
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSessions(
  sessions: ChatSession[],
  scope: ChatStorageScope,
): boolean {
  if (typeof window === "undefined") return false;
  const key = chatStorageKey(STORAGE_KEY, scope);
  if (!key) return false;
  try {
    const encoded = JSON.stringify(sessions);
    localStorage.setItem(key, encoded);
    return localStorage.getItem(key) === encoded;
  } catch {
    return false;
  }
}

function normalizeSession(session: ChatSession): ChatSession {
  return {
    ...session,
    title: session.title || "New Chat",
    messages: Array.isArray(session.messages) ? session.messages : [],
    luminorId: session.luminorId ?? null,
    modelId: session.modelId ?? null,
    projectId: session.projectId ?? null,
  };
}

function canEvictFromCache(session: ChatSession): boolean {
  return (
    !session.pinned &&
    session.cloudDirty === false &&
    /^[0-9a-f]{64}$/.test(session.cloudRevision ?? "")
  );
}

function retainRecoverableSessions(sessions: ChatSession[]): ChatSession[] {
  const protectedCount = sessions.filter(
    (session) => !canEvictFromCache(session),
  ).length;
  let cacheSlots = Math.max(0, MAX_SESSIONS - protectedCount);
  return sessions.filter((session) => {
    if (!canEvictFromCache(session)) return true;
    if (cacheSlots === 0) return false;
    cacheSlots -= 1;
    return true;
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a human-readable title from the first user message.
 * Falls back to "New Chat" if no user message is found.
 */
export function generateSessionTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "New Chat";

  const text = firstUser.content || "";
  if (!text.trim()) return "New Chat";

  // Take the first line, truncate to TITLE_MAX_LENGTH
  const firstLine = text.split("\n")[0].trim();
  if (firstLine.length <= TITLE_MAX_LENGTH) return firstLine;
  return firstLine.slice(0, TITLE_MAX_LENGTH - 3) + "...";
}

/**
 * Save (create or update) a chat session.
 * Only evicts unpinned acknowledged cloud copies beyond the cache budget.
 */
export function saveChatSession(
  id: string,
  messages: ChatMessage[],
  opts?: {
    luminorId?: string | null;
    modelId?: string | null;
    projectId?: string | null;
    title?: string;
  },
  scope: ChatStorageScope = guestChatStorageScope,
): boolean {
  const sessions = readSessions(scope);
  const now = new Date().toISOString();

  const existingIdx = sessions.findIndex((s) => s.id === id);

  // Preserve a manually-set title: if the session already exists and its
  // current title differs from what generateSessionTitle would produce,
  // the user renamed it — keep the custom title unless an explicit override
  // is provided via opts.title.
  let title: string;
  if (opts?.title) {
    title = opts.title;
  } else if (existingIdx >= 0) {
    const existing = sessions[existingIdx];
    const autoTitle = generateSessionTitle(messages);
    const existingIsCustom =
      existing.title !== "New Chat" && existing.title !== autoTitle;
    title = existingIsCustom ? existing.title : autoTitle;
  } else {
    title = generateSessionTitle(messages);
  }

  const session: ChatSession = {
    id,
    title,
    messages,
    luminorId: opts?.luminorId ?? null,
    modelId: opts?.modelId ?? null,
    projectId:
      opts?.projectId ??
      (existingIdx >= 0 ? (sessions[existingIdx].projectId ?? null) : null),
    pinned: existingIdx >= 0 ? sessions[existingIdx].pinned : false,
    createdAt: existingIdx >= 0 ? sessions[existingIdx].createdAt : now,
    updatedAt: now,
    cloudRevision:
      existingIdx >= 0 ? sessions[existingIdx].cloudRevision : undefined,
    cloudDirty: true,
  };

  if (
    existingIdx >= 0 &&
    chatSnapshotContentKey(session) ===
      chatSnapshotContentKey(sessions[existingIdx])
  )
    session.cloudDirty = sessions[existingIdx].cloudDirty ?? true;

  if (existingIdx >= 0) {
    sessions[existingIdx] = session;
  } else {
    sessions.unshift(session);
  }

  // Sort by updatedAt descending so most recent is first
  sessions.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  // Pins and unacknowledged manuscripts must survive the cache budget. A real
  // browser quota failure returns false without claiming this save is durable.
  const pinned = sessions.filter((s) => s.pinned);
  const unpinned = sessions.filter((s) => !s.pinned);
  const trimmed = retainRecoverableSessions([...pinned, ...unpinned]);

  return writeSessions(trimmed, scope);
}

/**
 * Load a single chat session by ID.
 * Returns null if not found.
 */
export function loadChatSession(
  id: string,
  scope: ChatStorageScope = guestChatStorageScope,
): ChatSession | null {
  const sessions = readSessions(scope);
  return sessions.find((s) => s.id === id) ?? null;
}

export function getActiveChatSessionId(
  scope: ChatStorageScope = guestChatStorageScope,
): string | null {
  if (typeof window === "undefined") return null;
  const key = chatStorageKey(ACTIVE_SESSION_KEY, scope);
  if (!key) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setActiveChatSessionId(
  id: string | null,
  scope: ChatStorageScope = guestChatStorageScope,
): void {
  if (typeof window === "undefined") return;
  const key = chatStorageKey(ACTIVE_SESSION_KEY, scope);
  if (!key) return;
  try {
    if (id) {
      localStorage.setItem(key, id);
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore storage failures
  }
}

/**
 * List all saved sessions as summaries (no full message arrays).
 * Sorted by updatedAt descending.
 */
export function listChatSessions(
  scope: ChatStorageScope = guestChatStorageScope,
): ChatSessionSummary[] {
  const sessions = readSessions(scope);
  return sessions.map((s) => {
    const lastAssistant = [...s.messages]
      .reverse()
      .find((m) => m.role === "assistant");
    const lastContent = lastAssistant?.content || null;

    return {
      id: s.id,
      title: s.title,
      messageCount: s.messages.length,
      lastMessage: lastContent
        ? lastContent.length > 80
          ? lastContent.slice(0, 80) + "..."
          : lastContent
        : null,
      luminorId: s.luminorId ?? null,
      projectId: s.projectId ?? null,
      pinned: s.pinned || false,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  });
}

/**
 * Replace the entire session store with a normalized list.
 * Intended for canonical sync flows that merge local and cloud sessions first.
 */
export function replaceChatSessions(
  sessions: ChatSession[],
  scope: ChatStorageScope = guestChatStorageScope,
): void {
  const deduped = new Map<string, ChatSession>();

  for (const session of sessions) {
    deduped.set(session.id, normalizeSession(session));
  }

  const normalized = retainRecoverableSessions(
    Array.from(deduped.values()).sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    ),
  );

  writeSessions(normalized, scope);
}

/**
 * Merge incoming sessions into the local store, preferring the most recently
 * updated copy of each session.
 */
export function mergeChatSessions(
  incoming: ChatSession[],
  scope: ChatStorageScope = guestChatStorageScope,
): void {
  const merged = new Map<string, ChatSession>();

  for (const session of readSessions(scope)) {
    merged.set(session.id, normalizeSession(session));
  }

  for (const session of incoming) {
    const normalized = normalizeSession(session);
    const existing = merged.get(normalized.id);

    if (!existing) {
      merged.set(normalized.id, normalized);
      continue;
    }

    if (
      existing.cloudDirty &&
      chatSnapshotContentKey(existing) !== chatSnapshotContentKey(normalized)
    )
      continue;

    if (
      new Date(normalized.updatedAt).getTime() >=
      new Date(existing.updatedAt).getTime()
    ) {
      const next = {
        ...normalized,
        pinned: existing.pinned ?? false,
        messages: normalized.messages.length
          ? normalized.messages
          : existing.messages,
        projectId: normalized.projectId ?? existing.projectId ?? null,
      };
      // A metadata-only response is not an acknowledgement of messages or
      // project context retained from the device's complete copy.
      next.cloudDirty =
        normalized.cloudDirty !== false ||
        chatSnapshotContentKey(next) !== chatSnapshotContentKey(normalized);
      merged.set(normalized.id, next);
    }
  }

  replaceChatSessions(Array.from(merged.values()), scope);
}

/**
 * Search sessions by query — matches title or message content.
 * Returns summaries sorted by updatedAt descending.
 */
export function searchSessions(
  query: string,
  scope: ChatStorageScope = guestChatStorageScope,
): ChatSessionSummary[] {
  if (!query.trim()) return listChatSessions(scope);

  const lowerQuery = query.toLowerCase();
  const sessions = readSessions(scope);

  const matched = sessions.filter((s) => {
    // Match title
    if (s.title.toLowerCase().includes(lowerQuery)) return true;
    // Match message content
    return s.messages.some((m) => m.content.toLowerCase().includes(lowerQuery));
  });

  // Already sorted by updatedAt from readSessions/saveChatSession, but ensure it
  matched.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return matched.map((s) => {
    const lastAssistant = [...s.messages]
      .reverse()
      .find((m) => m.role === "assistant");
    const lastContent = lastAssistant?.content || null;

    return {
      id: s.id,
      title: s.title,
      messageCount: s.messages.length,
      lastMessage: lastContent
        ? lastContent.length > 80
          ? lastContent.slice(0, 80) + "..."
          : lastContent
        : null,
      luminorId: s.luminorId ?? null,
      projectId: s.projectId ?? null,
      pinned: s.pinned || false,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  });
}

/**
 * Rename a chat session by ID.
 */
export function renameChatSession(
  id: string,
  title: string,
  scope: ChatStorageScope = guestChatStorageScope,
): void {
  const sessions = readSessions(scope);
  const session = sessions.find((s) => s.id === id);
  if (!session) return;
  session.title = title;
  session.cloudDirty = true;
  session.updatedAt = new Date().toISOString();
  writeSessions(sessions, scope);
}

/**
 * Delete a chat session by ID.
 */
export function deleteChatSession(
  id: string,
  scope: ChatStorageScope = guestChatStorageScope,
): void {
  const sessions = readSessions(scope);
  writeSessions(
    sessions.filter((s) => s.id !== id),
    scope,
  );
}

/**
 * Toggle the pinned state of a chat session by ID.
 */
export function togglePinSession(
  id: string,
  scope: ChatStorageScope = guestChatStorageScope,
): void {
  const sessions = readSessions(scope);
  const session = sessions.find((s) => s.id === id);
  if (!session) return;
  session.pinned = !session.pinned;
  writeSessions(sessions, scope);
}

/**
 * Assign a chat session to a project or clear the assignment.
 */
export function assignSessionToProject(
  id: string,
  projectId: string | null,
  scope: ChatStorageScope = guestChatStorageScope,
): void {
  const sessions = readSessions(scope);
  const session = sessions.find((s) => s.id === id);
  if (!session) return;
  session.projectId = projectId;
  session.cloudDirty = true;
  session.updatedAt = new Date().toISOString();
  writeSessions(sessions, scope);
}

/**
 * Remove a deleted project from all sessions.
 */
export function clearProjectFromSessions(
  projectId: string,
  scope: ChatStorageScope = guestChatStorageScope,
): void {
  const sessions = readSessions(scope).map((session) =>
    session.projectId === projectId ? { ...session, projectId: null } : session,
  );
  writeSessions(sessions, scope);
}

/**
 * Generate a new unique session ID.
 */
export function newSessionId(): string {
  return crypto.randomUUID();
}

export function acknowledgeChatSnapshot(
  id: string,
  revision: string,
  savedContentKey: string,
  scope: ChatStorageScope,
): boolean {
  const sessions = readSessions(scope);
  const session = sessions.find((item) => item.id === id);
  // Late acknowledgements must not resurrect a deleted browser conversation.
  if (!session) return false;
  session.cloudRevision = revision;
  session.cloudDirty = chatSnapshotContentKey(session) !== savedContentKey;
  return writeSessions(sessions, scope);
}
