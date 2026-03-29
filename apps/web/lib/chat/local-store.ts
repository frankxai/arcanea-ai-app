/**
 * localStorage-based chat persistence
 *
 * Stores up to MAX_SESSIONS chat sessions in localStorage.
 * Each session holds its messages, title, and timestamps.
 * When Supabase auth is configured, the persistence hook can
 * be upgraded to sync with the server — this module stays as
 * the offline / anonymous fallback.
 */

const STORAGE_KEY = 'arcanea_chat_sessions';
const MAX_SESSIONS = 50;
const TITLE_MAX_LENGTH = 60;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
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

function readSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSessions(sessions: ChatSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // localStorage full or blocked — silently fail
  }
}

function normalizeSession(session: ChatSession): ChatSession {
  return {
    ...session,
    title: session.title || 'New Chat',
    messages: Array.isArray(session.messages) ? session.messages : [],
    luminorId: session.luminorId ?? null,
    modelId: session.modelId ?? null,
    projectId: session.projectId ?? null,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a human-readable title from the first user message.
 * Falls back to "New Chat" if no user message is found.
 */
export function generateSessionTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === 'user');
  if (!firstUser) return 'New Chat';

  const text = firstUser.content || '';
  if (!text.trim()) return 'New Chat';

  // Take the first line, truncate to TITLE_MAX_LENGTH
  const firstLine = text.split('\n')[0].trim();
  if (firstLine.length <= TITLE_MAX_LENGTH) return firstLine;
  return firstLine.slice(0, TITLE_MAX_LENGTH - 3) + '...';
}

/**
 * Save (create or update) a chat session.
 * Enforces MAX_SESSIONS limit with FIFO eviction.
 */
export function saveChatSession(
  id: string,
  messages: ChatMessage[],
  opts?: { luminorId?: string | null; modelId?: string | null; projectId?: string | null; title?: string }
): void {
  const sessions = readSessions();
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
    const existingIsCustom = existing.title !== 'New Chat' && existing.title !== autoTitle;
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
    projectId: opts?.projectId ?? (existingIdx >= 0 ? sessions[existingIdx].projectId ?? null : null),
    pinned: existingIdx >= 0 ? sessions[existingIdx].pinned : false,
    createdAt: existingIdx >= 0 ? sessions[existingIdx].createdAt : now,
    updatedAt: now,
  };

  if (existingIdx >= 0) {
    sessions[existingIdx] = session;
  } else {
    sessions.unshift(session);
  }

  // Sort by updatedAt descending so most recent is first
  sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // FIFO eviction — drop oldest beyond MAX_SESSIONS, but protect pinned sessions
  const pinned = sessions.filter((s) => s.pinned);
  const unpinned = sessions.filter((s) => !s.pinned);
  const trimmed = [...pinned, ...unpinned].slice(0, MAX_SESSIONS);

  writeSessions(trimmed);
}

/**
 * Load a single chat session by ID.
 * Returns null if not found.
 */
export function loadChatSession(id: string): ChatSession | null {
  const sessions = readSessions();
  return sessions.find((s) => s.id === id) ?? null;
}

/**
 * List all saved sessions as summaries (no full message arrays).
 * Sorted by updatedAt descending.
 */
export function listChatSessions(): ChatSessionSummary[] {
  const sessions = readSessions();
  return sessions.map((s) => {
    const lastAssistant = [...s.messages].reverse().find((m) => m.role === 'assistant');
    const lastContent = lastAssistant?.content || null;

    return {
      id: s.id,
      title: s.title,
      messageCount: s.messages.length,
      lastMessage: lastContent ? (lastContent.length > 80 ? lastContent.slice(0, 80) + '...' : lastContent) : null,
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
export function replaceChatSessions(sessions: ChatSession[]): void {
  const deduped = new Map<string, ChatSession>();

  for (const session of sessions) {
    deduped.set(session.id, normalizeSession(session));
  }

  const normalized = Array.from(deduped.values())
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, MAX_SESSIONS);

  writeSessions(normalized);
}

/**
 * Merge incoming sessions into the local store, preferring the most recently
 * updated copy of each session.
 */
export function mergeChatSessions(incoming: ChatSession[]): void {
  const merged = new Map<string, ChatSession>();

  for (const session of readSessions()) {
    merged.set(session.id, normalizeSession(session));
  }

  for (const session of incoming) {
    const normalized = normalizeSession(session);
    const existing = merged.get(normalized.id);

    if (!existing) {
      merged.set(normalized.id, normalized);
      continue;
    }

    if (new Date(normalized.updatedAt).getTime() >= new Date(existing.updatedAt).getTime()) {
      merged.set(normalized.id, {
        ...normalized,
        projectId: normalized.projectId ?? existing.projectId ?? null,
      });
    }
  }

  replaceChatSessions(Array.from(merged.values()));
}

/**
 * Search sessions by query — matches title or message content.
 * Returns summaries sorted by updatedAt descending.
 */
export function searchSessions(query: string): ChatSessionSummary[] {
  if (!query.trim()) return listChatSessions();

  const lowerQuery = query.toLowerCase();
  const sessions = readSessions();

  const matched = sessions.filter((s) => {
    // Match title
    if (s.title.toLowerCase().includes(lowerQuery)) return true;
    // Match message content
    return s.messages.some((m) => m.content.toLowerCase().includes(lowerQuery));
  });

  // Already sorted by updatedAt from readSessions/saveChatSession, but ensure it
  matched.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return matched.map((s) => {
    const lastAssistant = [...s.messages].reverse().find((m) => m.role === 'assistant');
    const lastContent = lastAssistant?.content || null;

    return {
      id: s.id,
      title: s.title,
      messageCount: s.messages.length,
      lastMessage: lastContent ? (lastContent.length > 80 ? lastContent.slice(0, 80) + '...' : lastContent) : null,
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
export function renameChatSession(id: string, title: string): void {
  const sessions = readSessions();
  const session = sessions.find((s) => s.id === id);
  if (!session) return;
  session.title = title;
  session.updatedAt = new Date().toISOString();
  writeSessions(sessions);
}

/**
 * Delete a chat session by ID.
 */
export function deleteChatSession(id: string): void {
  const sessions = readSessions();
  writeSessions(sessions.filter((s) => s.id !== id));
}

/**
 * Toggle the pinned state of a chat session by ID.
 */
export function togglePinSession(id: string): void {
  const sessions = readSessions();
  const session = sessions.find((s) => s.id === id);
  if (!session) return;
  session.pinned = !session.pinned;
  writeSessions(sessions);
}

/**
 * Assign a chat session to a project or clear the assignment.
 */
export function assignSessionToProject(id: string, projectId: string | null): void {
  const sessions = readSessions();
  const session = sessions.find((s) => s.id === id);
  if (!session) return;
  session.projectId = projectId;
  session.updatedAt = new Date().toISOString();
  writeSessions(sessions);
}

/**
 * Remove a deleted project from all sessions.
 */
export function clearProjectFromSessions(projectId: string): void {
  const sessions = readSessions().map((session) => (
    session.projectId === projectId
      ? { ...session, projectId: null }
      : session
  ));
  writeSessions(sessions);
}

/**
 * Generate a new unique session ID.
 */
export function newSessionId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
