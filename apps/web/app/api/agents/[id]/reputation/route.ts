/**
 * Agent Reputation — Events & History
 *
 * POST /api/agents/:id/reputation  — Add a reputation event
 * GET  /api/agents/:id/reputation  — Get reputation history
 *
 * @route /api/agents/[id]/reputation
 */

import { NextRequest, NextResponse } from 'next/server';
import { addReputationEvent, getReputationHistory, getAgent } from '@/lib/agents/store';
import { isValidReputationEventType, type ReputationEventCreate } from '@/lib/agents/types';

const RATE_HEADERS = {
  'X-RateLimit-Limit': '60',
  'X-RateLimit-Remaining': '59',
  'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60),
};

// ---------------------------------------------------------------------------
// POST — Add reputation event
// ---------------------------------------------------------------------------

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || !id.startsWith('arc_')) {
      return NextResponse.json(
        { error: 'Invalid agent ID format (expected arc_XXXXXX)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.type || !isValidReputationEventType(body.type)) {
      return NextResponse.json(
        {
          error:
            'Invalid field: type (task_completed | skill_certified | review_positive | review_negative | gate_advanced | penalty)',
        },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    if (body.delta === undefined || typeof body.delta !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid field: delta (number required)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    if (!body.reason || typeof body.reason !== 'string' || body.reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid field: reason (non-empty string required)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    // Clamp delta to reasonable range
    const delta = Math.max(-50, Math.min(50, body.delta));

    const input: ReputationEventCreate = {
      type: body.type,
      delta,
      reason: body.reason.trim(),
    };

    const event = await addReputationEvent(id, input);

    if (!event) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404, headers: RATE_HEADERS },
      );
    }

    // Fetch updated agent to return current reputation
    const agent = await getAgent(id);

    return NextResponse.json(
      {
        event,
        currentReputation: agent?.reputation ?? 0,
        tasksCompleted: agent?.tasksCompleted ?? 0,
      },
      { status: 201, headers: RATE_HEADERS },
    );
  } catch (err) {
    console.error('[POST /api/agents/[id]/reputation] Error:', err);
    return NextResponse.json(
      { error: 'Failed to add reputation event' },
      { status: 500, headers: RATE_HEADERS },
    );
  }
}

// ---------------------------------------------------------------------------
// GET — Reputation history
// ---------------------------------------------------------------------------

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || !id.startsWith('arc_')) {
      return NextResponse.json(
        { error: 'Invalid agent ID format (expected arc_XXXXXX)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    const agent = await getAgent(id);
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404, headers: RATE_HEADERS },
      );
    }

    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? Math.min(Number(limitParam), 100) : 50;

    const events = await getReputationHistory(id, limit);

    return NextResponse.json(
      {
        agentId: id,
        currentReputation: agent.reputation,
        events,
        total: events.length,
      },
      { status: 200, headers: RATE_HEADERS },
    );
  } catch (err) {
    console.error('[GET /api/agents/[id]/reputation] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch reputation history' },
      { status: 500, headers: RATE_HEADERS },
    );
  }
}
