/**
 * Command Center — Agents API
 *
 * GET /api/command/agents — List all agents from agent_registry
 *
 * Supports filtering by status, agent_type, and capability.
 * Uses the `agent_registry` Supabase table. All queries respect RLS.
 *
 * NOTE: Tables created by migration 20260317 — types will be generated
 * after `supabase gen types`. Until then we cast via `as any` to bypass
 * the generated Database type that doesn't yet include these tables.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { AgentStatus, AgentType } from '@/lib/command-center/types';

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_STATUSES: AgentStatus[] = ['online', 'busy', 'idle', 'offline', 'error'];
const VALID_TYPES: AgentType[] = [
  'arcanea-claw', 'claude-code', 'mobile-capture',
  'cloud-gemini', 'cloud-suno', 'cloud-dalle', 'cloud-flux',
];

// ---------------------------------------------------------------------------
// GET — List agents
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const status = searchParams.get('status') as AgentStatus | null;
  const agentType = searchParams.get('agent_type') as AgentType | null;
  const capability = searchParams.get('capability');

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 },
    );
  }
  if (agentType && !VALID_TYPES.includes(agentType)) {
    return NextResponse.json(
      { error: `Invalid agent_type. Must be one of: ${VALID_TYPES.join(', ')}` },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    let query = (supabase as any)
      .from('agent_registry' as never)
      .select('*')
      .order('registered_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (agentType) query = query.eq('agent_type', agentType);
    if (capability) query = query.contains('capabilities', [capability]);

    const { data, error } = await query;

    if (error) {
      console.error('[api/command/agents] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    console.error('[api/command/agents] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
