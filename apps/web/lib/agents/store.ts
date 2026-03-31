/**
 * Agent Store — In-Memory Fallback + Supabase Persistence
 *
 * Uses Supabase when configured, otherwise falls back to an in-memory Map.
 * This allows the agent network to function in local dev without a database.
 */

import type {
  AgentProfile,
  AgentProfileCreate,
  AgentProfileUpdate,
  AgentSearchParams,
  ReputationEvent,
  ReputationEventCreate,
} from './types';

// ---------------------------------------------------------------------------
// ID generation
// ---------------------------------------------------------------------------

function generateAgentId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `arc_${suffix}`;
}

function generateEventId(): string {
  return `rep_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// In-memory store (fallback when Supabase is unavailable)
// ---------------------------------------------------------------------------

const agents = new Map<string, AgentProfile>();
const reputationEvents = new Map<string, ReputationEvent[]>();

// ---------------------------------------------------------------------------
// Supabase availability check
// ---------------------------------------------------------------------------

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  return !!url && !url.includes('placeholder');
}

function getUntypedTableClient(supabase: unknown, table: 'agents' | 'reputation_events') {
  return (supabase as { from: (name: string) => any }).from(table);
}

// ---------------------------------------------------------------------------
// Agent CRUD
// ---------------------------------------------------------------------------

export async function createAgent(input: AgentProfileCreate): Promise<AgentProfile> {
  const now = new Date().toISOString();
  const profile: AgentProfile = {
    id: generateAgentId(),
    name: input.name,
    type: input.type,
    gate: input.gate ?? 'Foundation',
    rank: input.rank ?? 'Apprentice',
    skills: input.skills ?? [],
    reputation: 0,
    tasksCompleted: 0,
    createdAt: now,
    lastActive: now,
    metadata: input.metadata ?? {},
  };

  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      const { error } = await getUntypedTableClient(supabase, 'agents')
        .insert({
          id: profile.id,
          name: profile.name,
          type: profile.type,
          gate: profile.gate,
          rank: profile.rank,
          skills: profile.skills,
          reputation: profile.reputation,
          tasks_completed: profile.tasksCompleted,
          created_at: profile.createdAt,
          last_active: profile.lastActive,
          metadata: profile.metadata,
        });
      if (error) throw error;
      return profile;
    } catch (err) {
      console.warn('[agent-store] Supabase insert failed, falling back to memory:', err);
    }
  }

  agents.set(profile.id, profile);
  return profile;
}

export async function getAgent(id: string): Promise<AgentProfile | null> {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      const { data, error } = await getUntypedTableClient(supabase, 'agents')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) throw error ?? new Error('Not found');
      return mapRow(data);
    } catch {
      // fallback
    }
  }
  return agents.get(id) ?? null;
}

export async function updateAgent(
  id: string,
  updates: AgentProfileUpdate,
): Promise<AgentProfile | null> {
  const existing = await getAgent(id);
  if (!existing) return null;

  const updated: AgentProfile = {
    ...existing,
    ...updates,
    lastActive: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      const { error } = await getUntypedTableClient(supabase, 'agents')
        .update({
          name: updated.name,
          type: updated.type,
          gate: updated.gate,
          rank: updated.rank,
          skills: updated.skills,
          last_active: updated.lastActive,
          metadata: updated.metadata,
        })
        .eq('id', id);
      if (error) throw error;
      return updated;
    } catch (err) {
      console.warn('[agent-store] Supabase update failed, falling back to memory:', err);
    }
  }

  agents.set(id, updated);
  return updated;
}

export async function searchAgents(params: AgentSearchParams): Promise<AgentProfile[]> {
  const limit = Math.min(params.limit ?? 50, 100);
  const offset = params.offset ?? 0;

  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      let query = getUntypedTableClient(supabase, 'agents').select('*');

      if (params.q) {
        query = query.ilike('name', `%${params.q}%`);
      }
      if (params.gate) query = query.eq('gate', params.gate);
      if (params.rank) query = query.eq('rank', params.rank);
      if (params.type) query = query.eq('type', params.type);
      if (params.minReputation != null) {
        query = query.gte('reputation', params.minReputation);
      }
      if (params.skill) {
        query = query.contains('skills', [params.skill]);
      }

      const { data, error } = await query
        .order('reputation', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return (data ?? []).map(mapRow);
    } catch {
      // fallback
    }
  }

  // In-memory search
  let results = Array.from(agents.values());

  if (params.q) {
    const q = params.q.toLowerCase();
    results = results.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.skills.some((s) => s.toLowerCase().includes(q)),
    );
  }
  if (params.gate) results = results.filter((a) => a.gate === params.gate);
  if (params.rank) results = results.filter((a) => a.rank === params.rank);
  if (params.type) results = results.filter((a) => a.type === params.type);
  if (params.skill) results = results.filter((a) => a.skills.includes(params.skill!));
  if (params.minReputation != null) {
    results = results.filter((a) => a.reputation >= params.minReputation!);
  }

  results.sort((a, b) => b.reputation - a.reputation);
  return results.slice(offset, offset + limit);
}

// ---------------------------------------------------------------------------
// Reputation
// ---------------------------------------------------------------------------

export async function addReputationEvent(
  agentId: string,
  input: ReputationEventCreate,
): Promise<ReputationEvent | null> {
  const agent = await getAgent(agentId);
  if (!agent) return null;

  const event: ReputationEvent = {
    id: generateEventId(),
    agentId,
    type: input.type,
    delta: input.delta,
    reason: input.reason,
    createdAt: new Date().toISOString(),
  };

  // Compute new reputation (clamp 0-100)
  const newReputation = Math.max(0, Math.min(100, agent.reputation + input.delta));
  const newTasksCompleted =
    input.type === 'task_completed' ? agent.tasksCompleted + 1 : agent.tasksCompleted;

  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();

      const [insertResult, updateResult] = await Promise.all([
        getUntypedTableClient(supabase, 'reputation_events').insert({
          id: event.id,
          agent_id: agentId,
          type: event.type,
          delta: event.delta,
          reason: event.reason,
          created_at: event.createdAt,
        }),
        getUntypedTableClient(supabase, 'agents').update({
          reputation: newReputation,
          tasks_completed: newTasksCompleted,
          last_active: new Date().toISOString(),
        }).eq('id', agentId),
      ]);

      if (insertResult.error) throw insertResult.error;
      if (updateResult.error) throw updateResult.error;
      return event;
    } catch (err) {
      console.warn('[agent-store] Supabase reputation insert failed, falling back:', err);
    }
  }

  // In-memory fallback
  const events = reputationEvents.get(agentId) ?? [];
  events.push(event);
  reputationEvents.set(agentId, events);

  const existing = agents.get(agentId);
  if (existing) {
    existing.reputation = newReputation;
    existing.tasksCompleted = newTasksCompleted;
    existing.lastActive = new Date().toISOString();
  }

  return event;
}

export async function getReputationHistory(
  agentId: string,
  limit = 50,
): Promise<ReputationEvent[]> {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      const { data, error } = await getUntypedTableClient(supabase, 'reputation_events')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data ?? []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        agentId: row.agent_id as string,
        type: row.type as ReputationEvent['type'],
        delta: row.delta as number,
        reason: row.reason as string,
        createdAt: row.created_at as string,
      }));
    } catch {
      // fallback
    }
  }

  const events = reputationEvents.get(agentId) ?? [];
  return events.slice(-limit).reverse();
}

// ---------------------------------------------------------------------------
// Supabase row mapping helper
// ---------------------------------------------------------------------------

function mapRow(row: Record<string, unknown>): AgentProfile {
  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as AgentProfile['type'],
    gate: row.gate as AgentProfile['gate'],
    rank: row.rank as AgentProfile['rank'],
    skills: (row.skills as string[]) ?? [],
    reputation: (row.reputation as number) ?? 0,
    tasksCompleted: (row.tasks_completed as number) ?? 0,
    createdAt: row.created_at as string,
    lastActive: row.last_active as string,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
  };
}
