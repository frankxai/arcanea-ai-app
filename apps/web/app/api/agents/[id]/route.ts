/**
 * Agent Profile — Get / Update
 *
 * GET   /api/agents/:id  — Get agent profile by ID
 * PATCH /api/agents/:id  — Update agent profile
 *
 * @route /api/agents/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAgent, updateAgent } from '@/lib/agents/store';
import {
  isValidAgentType,
  isValidGate,
  isValidRank,
  type AgentProfileUpdate,
} from '@/lib/agents/types';

const RATE_HEADERS = {
  'X-RateLimit-Limit': '60',
  'X-RateLimit-Remaining': '59',
  'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60),
};

// ---------------------------------------------------------------------------
// GET — Fetch single agent by ID
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
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

    return NextResponse.json(
      { agent },
      { status: 200, headers: RATE_HEADERS },
    );
  } catch (err) {
    console.error('[GET /api/agents/[id]] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500, headers: RATE_HEADERS },
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH — Update agent profile
// ---------------------------------------------------------------------------

export async function PATCH(
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

    // Validate optional fields when provided
    if (body.type !== undefined && !isValidAgentType(body.type)) {
      return NextResponse.json(
        { error: 'Invalid field: type (claude | cursor | gemini | copilot | custom)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    if (body.gate !== undefined && !isValidGate(body.gate)) {
      return NextResponse.json(
        { error: 'Invalid field: gate (must be a valid Arcanean gate)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    if (body.rank !== undefined && !isValidRank(body.rank)) {
      return NextResponse.json(
        { error: 'Invalid field: rank (Apprentice | Mage | Master | Archmage | Luminor)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    if (body.skills !== undefined && !Array.isArray(body.skills)) {
      return NextResponse.json(
        { error: 'Invalid field: skills (must be an array of strings)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Invalid field: name (non-empty string required)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    const updates: AgentProfileUpdate = {};
    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.type !== undefined) updates.type = body.type;
    if (body.gate !== undefined) updates.gate = body.gate;
    if (body.rank !== undefined) updates.rank = body.rank;
    if (body.skills !== undefined) updates.skills = body.skills;
    if (body.metadata !== undefined) updates.metadata = body.metadata;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    const agent = await updateAgent(id, updates);

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404, headers: RATE_HEADERS },
      );
    }

    return NextResponse.json(
      { agent },
      { status: 200, headers: RATE_HEADERS },
    );
  } catch (err) {
    console.error('[PATCH /api/agents/[id]] Error:', err);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500, headers: RATE_HEADERS },
    );
  }
}
