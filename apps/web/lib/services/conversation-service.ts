/**
 * Conversation Service -- Persist chat sessions to Supabase
 *
 * Builds on the existing chat_sessions + chat_messages tables.
 * Provides a higher-level API for full conversation persistence
 * (session metadata + message history in a single payload).
 *
 * Required tables (already exist via chat-service.ts):
 *   chat_sessions  -- id, user_id, luminor_id, title, created_at, updated_at
 *   chat_messages  -- id, session_id, role, content, created_at
 */

import { createClient } from '@/lib/supabase/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConversationMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  modelId?: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  luminorId: string | null;
  modelId: string | null;
  messages: ConversationMessage[];
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  luminorId: string | null;
  messageCount: number;
  lastMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Title generation
// ---------------------------------------------------------------------------

/**
 * Auto-generate a title from the first user message.
 * Truncates to 80 chars and strips trailing incomplete words.
 */
export function generateTitle(
  messages: Array<{ role: string; content: string }>
): string {
  const firstUserMsg = messages.find((m) => m.role === 'user');
  if (!firstUserMsg) return 'New conversation';

  let title = firstUserMsg.content
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (title.length > 80) {
    title = title.slice(0, 80);
    const lastSpace = title.lastIndexOf(' ');
    if (lastSpace > 40) title = title.slice(0, lastSpace);
    title += '...';
  }

  return title || 'New conversation';
}

// ---------------------------------------------------------------------------
// Save conversation (create or update)
// ---------------------------------------------------------------------------

export async function saveConversation(
  userId: string,
  messages: ConversationMessage[],
  opts: {
    sessionId?: string;
    luminorId?: string;
    modelId?: string;
    title?: string;
  } = {}
): Promise<Conversation> {
  const supabase = await createClient();
  const luminorId = opts.luminorId || 'default';
  const title = opts.title || generateTitle(messages);
  const now = new Date().toISOString();

  let sessionId = opts.sessionId;

  // Upsert session
  if (sessionId) {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ title: title.slice(0, 120), updated_at: now })
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to update session: ${error.message}`);
  } else {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        luminor_id: luminorId,
        title: title.slice(0, 120),
      })
      .select('id')
      .single();

    if (error || !data) {
      throw new Error(`Failed to create session: ${error?.message ?? 'unknown'}`);
    }
    sessionId = data.id;
  }

  // Insert messages (dedup by id)
  if (messages.length > 0) {
    const rows = messages.map((m) => ({
      ...(m.id ? { id: m.id } : {}),
      session_id: sessionId!,
      role: m.role,
      content: m.content,
    }));

    const { error } = await supabase
      .from('chat_messages')
      .upsert(rows, { onConflict: 'id', ignoreDuplicates: true });

    if (error) throw new Error(`Failed to save messages: ${error.message}`);
  }

  return getConversation(sessionId!, userId);
}

// ---------------------------------------------------------------------------
// Get single conversation
// ---------------------------------------------------------------------------

export async function getConversation(
  id: string,
  userId: string
): Promise<Conversation> {
  const supabase = await createClient();

  const { data: session, error: sessionErr } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (sessionErr || !session) {
    throw new Error(sessionErr?.message ?? 'Conversation not found');
  }

  const { data: msgs, error: msgErr } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', id)
    .order('created_at', { ascending: true });

  if (msgErr) throw new Error(`Failed to fetch messages: ${msgErr.message}`);

  const messages: ConversationMessage[] = (msgs ?? []).map((m) => ({
    id: m.id,
    role: m.role as ConversationMessage['role'],
    content: m.content,
    timestamp: m.created_at,
  }));

  return {
    id: session.id,
    userId: session.user_id,
    title: session.title ?? 'New conversation',
    luminorId: session.luminor_id ?? null,
    modelId: null,
    messages,
    messageCount: messages.length,
    createdAt: session.created_at,
    updatedAt: session.updated_at,
  };
}

// ---------------------------------------------------------------------------
// List conversations
// ---------------------------------------------------------------------------

export async function listConversations(
  userId: string,
  opts: { limit?: number; offset?: number; luminorId?: string } = {}
): Promise<{ conversations: ConversationSummary[]; total: number }> {
  const supabase = await createClient();
  const limit = Math.max(1, Math.min(100, opts.limit ?? 20));
  const offset = Math.max(0, opts.offset ?? 0);

  let query = supabase
    .from('chat_sessions')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (opts.luminorId) {
    query = query.eq('luminor_id', opts.luminorId);
  }

  const { data: sessions, error, count } = await query;

  if (error) throw new Error(`Failed to list conversations: ${error.message}`);

  // Fetch last message + count for each session
  const summaries: ConversationSummary[] = [];

  for (const session of sessions ?? []) {
    const { data: lastMsg } = await supabase
      .from('chat_messages')
      .select('content')
      .eq('session_id', session.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { count: msgCount } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', session.id);

    summaries.push({
      id: session.id,
      title: session.title ?? 'New conversation',
      luminorId: session.luminor_id ?? null,
      messageCount: msgCount ?? 0,
      lastMessage: lastMsg?.content?.slice(0, 200) ?? null,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    });
  }

  return { conversations: summaries, total: count ?? 0 };
}

// ---------------------------------------------------------------------------
// Delete conversation
// ---------------------------------------------------------------------------

export async function deleteConversation(
  id: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();

  // Delete messages first (no cascade assumed)
  await supabase.from('chat_messages').delete().eq('session_id', id);

  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to delete conversation: ${error.message}`);
}
