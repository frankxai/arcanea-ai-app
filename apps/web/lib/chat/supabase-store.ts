'use client';

import { createClient } from '@/lib/supabase/client';
import type { ChatMessage, ChatSession } from '@/lib/chat/local-store';

export interface CloudSession {
  id: string;
  title: string | null;
  messages: Record<string, unknown>[];
  luminor_id: string | null;
  model_id: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string;
}

function normalizeCloudMessage(message: Record<string, unknown>): ChatMessage | null {
  if (typeof message.id !== 'string') return null;
  if (message.role !== 'user' && message.role !== 'assistant') return null;

  const normalized: ChatMessage = {
    id: message.id,
    role: message.role,
    content: typeof message.content === 'string' ? message.content : '',
  };

  if (typeof message.createdAt === 'string') {
    normalized.createdAt = message.createdAt;
  }

  if (Array.isArray(message.parts)) {
    normalized.parts = message.parts
      .filter((part): part is { type: string; text?: string } =>
        typeof part === 'object' &&
        part !== null &&
        typeof (part as { type?: unknown }).type === 'string' &&
        (
          (part as { text?: unknown }).text === undefined ||
          typeof (part as { text?: unknown }).text === 'string'
        )
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
export async function saveSessionToCloud(session: {
  id: string;
  title: string;
  messages: Record<string, unknown>[];
  luminorId: string | null;
  modelId: string | null;
  projectId?: string | null;
}): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('chat_sessions')
      .upsert({
        id: session.id,
        user_id: user.id,
        title: session.title,
        messages: session.messages,
        luminor_id: session.luminorId ?? undefined,
        model_id: session.modelId,
        project_id: session.projectId ?? undefined,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      // Table might not exist yet — silently fail
      if (error.code === '42P01') return false; // relation does not exist
      console.warn('[cloud-sync] Save failed:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Load all chat sessions from Supabase for the current user.
 */
export async function loadCloudSessions(): Promise<CloudSession[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (error || !data) return [];
    return data as unknown as CloudSession[];
  } catch {
    return [];
  }
}

/**
 * Delete a chat session from Supabase.
 */
export async function deleteCloudSession(sessionId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('chat_sessions').delete().eq('id', sessionId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Rename a chat session in Supabase.
 */
export async function renameCloudSession(sessionId: string, title: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('chat_sessions')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', sessionId);
    return !error;
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
    title: cloud.title || 'Untitled',
    messages: cloud.messages
      .map(normalizeCloudMessage)
      .filter((message): message is ChatMessage => message !== null),
    luminorId: cloud.luminor_id,
    modelId: cloud.model_id,
    projectId: cloud.project_id,
    createdAt: cloud.created_at,
    updatedAt: cloud.updated_at,
  };
}
