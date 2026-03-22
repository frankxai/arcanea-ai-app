/**
 * Chat Service
 *
 * Handles Supabase persistence for chat sessions and messages.
 * Authenticated users get full persistence; anonymous users
 * get the file-based fallback via /api/chat/history.
 *
 * All queries use RLS — users can only access their own data.
 */

import { createClient } from '@/lib/supabase/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatSession {
  id: string;
  userId: string;
  luminorId: string | null;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface BondState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  relationshipStatus: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Derive bond state from the count of user turns in a conversation. */
function deriveBondState(userTurnCount: number): BondState {
  const level = Math.max(1, Math.min(10, Math.floor(userTurnCount / 10) + 1));
  const xp = userTurnCount * 10;
  const nextLevelTurns = level * 10;
  const xpToNextLevel =
    level >= 10 ? 0 : Math.max(0, (nextLevelTurns - userTurnCount) * 10);
  const relationshipStatus =
    level >= 8
      ? 'trusted_ally'
      : level >= 5
      ? 'companion'
      : level >= 3
      ? 'friend'
      : 'stranger';

  return { level, xp, xpToNextLevel, relationshipStatus };
}

// ---------------------------------------------------------------------------
// Session operations
// ---------------------------------------------------------------------------

/**
 * Find the most recent session for (userId, luminorId) or create one.
 * Returns the session id.
 */
export async function getOrCreateSession(
  userId: string,
  luminorId: string
): Promise<string> {
  const supabase = await createClient();

  // Look for the most recent session for this user + luminor
  const { data: existing, error: fetchError } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('luminor_id', luminorId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch chat session: ${fetchError.message}`);
  }

  if (existing) return existing.id;

  // Create a new session
  const { data: created, error: createError } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, luminor_id: luminorId })
    .select('id')
    .single();

  if (createError || !created) {
    throw new Error(
      `Failed to create chat session: ${createError?.message ?? 'unknown'}`
    );
  }

  return created.id;
}

/**
 * Get all sessions for a user, ordered most-recent first.
 */
export async function getUserSessions(
  userId: string,
  luminorId?: string
): Promise<ChatSession[]> {
  const supabase = await createClient();

  let query = supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (luminorId) {
    query = query.eq('luminor_id', luminorId);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch sessions: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    luminorId: row.luminor_id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

/**
 * Create a brand-new session (used when the user clicks "New Chat").
 */
export async function createSession(
  userId: string,
  luminorId: string
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, luminor_id: luminorId })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to create session: ${error?.message ?? 'unknown'}`
    );
  }

  return data.id;
}

/**
 * Update a session's title (generated from the first user message).
 */
export async function updateSessionTitle(
  sessionId: string,
  title: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('chat_sessions')
    .update({ title: title.slice(0, 120) })
    .eq('id', sessionId);

  if (error) throw new Error(`Failed to update session title: ${error.message}`);
}

/**
 * Delete a session and all its messages (cascade handles messages).
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw new Error(`Failed to delete session: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Message operations
// ---------------------------------------------------------------------------

/**
 * Retrieve messages for a session with optional cursor-based pagination.
 */
export async function getMessages(
  sessionId: string,
  opts: {
    limit?: number;
    beforeId?: string;
  } = {}
): Promise<{ messages: ChatMessage[]; hasMore: boolean }> {
  const supabase = await createClient();
  const limit = Math.max(1, Math.min(200, opts.limit ?? 50));

  let query = supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (opts.beforeId) {
    // Fetch the timestamp of the cursor message so we can page correctly
    const { data: cursor } = await supabase
      .from('chat_messages')
      .select('created_at')
      .eq('id', opts.beforeId)
      .maybeSingle();

    if (cursor) {
      query = query.lt('created_at', cursor.created_at);
    }
  }

  // Fetch one extra row to determine hasMore
  query = query.limit(limit + 1);

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch messages: ${error.message}`);

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  const messages = (hasMore ? rows.slice(0, limit) : rows).map((row) => ({
    id: row.id,
    sessionId: row.session_id,
    role: row.role as 'user' | 'assistant' | 'system',
    content: row.content,
    createdAt: row.created_at,
  }));

  return { messages, hasMore };
}

/**
 * Persist one or more messages to a session.
 * Deduplicates by id if the same message is sent twice.
 */
export async function addMessages(
  sessionId: string,
  messages: Array<{ id?: string; role: 'user' | 'assistant' | 'system'; content: string }>
): Promise<ChatMessage[]> {
  if (messages.length === 0) return [];

  const supabase = await createClient();

  const rows = messages.map((m) => ({
    ...(m.id ? { id: m.id } : {}),
    session_id: sessionId,
    role: m.role,
    content: m.content,
  }));

  const { data, error } = await supabase
    .from('chat_messages')
    .upsert(rows, { onConflict: 'id', ignoreDuplicates: true })
    .select();

  if (error) throw new Error(`Failed to insert messages: ${error.message}`);

  // Touch updated_at on the session
  await supabase
    .from('chat_sessions')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', sessionId);

  return (data ?? []).map((row) => ({
    id: row.id,
    sessionId: row.session_id,
    role: row.role as 'user' | 'assistant' | 'system',
    content: row.content,
    createdAt: row.created_at,
  }));
}

// ---------------------------------------------------------------------------
// Convenience: history endpoint shape
// ---------------------------------------------------------------------------

/**
 * Get paginated message history for a user + luminor pair.
 * Automatically finds or creates the session.
 * Returns the same shape the /api/chat/history route expects.
 */
export async function getChatHistory(
  userId: string,
  luminorId: string,
  opts: { limit?: number; beforeId?: string } = {}
): Promise<{
  sessionId: string;
  messages: ChatMessage[];
  bondState: BondState;
  hasMore: boolean;
}> {
  const sessionId = await getOrCreateSession(userId, luminorId);
  const { messages, hasMore } = await getMessages(sessionId, opts);

  // Count all user turns (not just this page) for accurate bond state
  const supabase = await createClient();
  const { count } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .eq('role', 'user');

  const bondState = deriveBondState(count ?? 0);

  return { sessionId, messages, bondState, hasMore };
}

/**
 * Persist messages from the /api/chat/history POST body.
 * Handles session creation automatically.
 */
export async function persistChatMessages(
  userId: string,
  luminorId: string,
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string }>
): Promise<{ sessionId: string; saved: number; bondState: BondState }> {
  const sessionId = await getOrCreateSession(userId, luminorId);

  const saved = await addMessages(sessionId, messages);

  const supabase = await createClient();
  const { count } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .eq('role', 'user');

  const bondState = deriveBondState(count ?? 0);

  // Set a title from the first user message if the session has no title
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('title')
    .eq('id', sessionId)
    .single();

  if (!session?.title) {
    const firstUserMsg = messages.find((m) => m.role === 'user');
    if (firstUserMsg) {
      const title = firstUserMsg.content.slice(0, 80);
      await updateSessionTitle(sessionId, title);
    }
  }

  return { sessionId, saved: saved.length, bondState };
}
