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
  createdAt: string;
  updatedAt: string;
}

export interface ChatSessionSummary {
  id: string;
  title: string;
  messageCount: number;
  lastMessage: string | null;
  luminorId: string | null;
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
  opts?: { luminorId?: string | null; modelId?: string | null; title?: string }
): void {
  const sessions = readSessions();
  const now = new Date().toISOString();

  const existingIdx = sessions.findIndex((s) => s.id === id);
  const title = opts?.title || generateSessionTitle(messages);

  const session: ChatSession = {
    id,
    title,
    messages,
    luminorId: opts?.luminorId ?? null,
    modelId: opts?.modelId ?? null,
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

  // FIFO eviction — drop oldest beyond MAX_SESSIONS
  const trimmed = sessions.slice(0, MAX_SESSIONS);

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
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  });
}

/**
 * Delete a chat session by ID.
 */
export function deleteChatSession(id: string): void {
  const sessions = readSessions();
  writeSessions(sessions.filter((s) => s.id !== id));
}

/**
 * Generate a new unique session ID.
 */
export function newSessionId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
