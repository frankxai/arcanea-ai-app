'use client';

import { createClient } from '@/lib/supabase/client';

export interface CloudSession {
  id: string;
  title: string | null;
  messages: Record<string, unknown>[];
  luminor_id: string | null;
  model_id: string | null;
  created_at: string;
  updated_at: string;
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
