/**
 * Agent Network — List / Register
 *
 * POST /api/agents  — Register a new agent profile
 * GET  /api/agents  — Search agents (?q=&gate=&rank=&type=&limit=&offset=)
 *
 * @route /api/agents
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAgent, searchAgents } from '@/lib/agents/store';
import {
  isValidAgentType,
  isValidGate,
  isValidRank,
  type AgentProfileCreate,
  type AgentSearchParams,
  type Gate,
  type Rank,
  type AgentType,
} from '@/lib/agents/types';

// ---------------------------------------------------------------------------
// Shared headers
// ---------------------------------------------------------------------------

const RATE_HEADERS = {
  'X-RateLimit-Limit': '60',
  'X-RateLimit-Remaining': '59',
  'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60),
};

// ---------------------------------------------------------------------------
// POST — Register a new agent
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid field: name (non-empty string required)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    if (!body.type || !isValidAgentType(body.type)) {
      return NextResponse.json(
        { error: 'Missing or invalid field: type (claude | cursor | gemini | copilot | custom)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    // Validate optional fields if provided
    if (body.gate && !isValidGate(body.gate)) {
      return NextResponse.json(
        { error: 'Invalid field: gate (must be a valid Arcanean gate)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    if (body.rank && !isValidRank(body.rank)) {
      return NextResponse.json(
        { error: 'Invalid field: rank (Apprentice | Mage | Master | Archmage | Luminor)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    if (body.skills && !Array.isArray(body.skills)) {
      return NextResponse.json(
        { error: 'Invalid field: skills (must be an array of strings)' },
        { status: 400, headers: RATE_HEADERS },
      );
    }

    const input: AgentProfileCreate = {
      name: body.name.trim(),
      type: body.type,
      gate: body.gate,
      rank: body.rank,
      skills: body.skills,
      metadata: body.metadata,
    };

    const profile = await createAgent(input);

    return NextResponse.json(
      { agent: profile },
      { status: 201, headers: RATE_HEADERS },
    );
  } catch (err) {
    console.error('[POST /api/agents] Error:', err);
    return NextResponse.json(
      { error: 'Failed to register agent' },
      { status: 500, headers: RATE_HEADERS },
    );
  }
}

// ---------------------------------------------------------------------------
// GET — Search / List agents
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const params: AgentSearchParams = {
      q: searchParams.get('q') ?? undefined,
      limit: searchParams.has('limit') ? Number(searchParams.get('limit')) : undefined,
      offset: searchParams.has('offset') ? Number(searchParams.get('offset')) : undefined,
    };

    const gateParam = searchParams.get('gate');
    if (gateParam) {
      if (!isValidGate(gateParam)) {
        return NextResponse.json(
          { error: `Invalid gate filter: ${gateParam}` },
          { status: 400, headers: RATE_HEADERS },
        );
      }
      params.gate = gateParam as Gate;
    }

    const rankParam = searchParams.get('rank');
    if (rankParam) {
      if (!isValidRank(rankParam)) {
        return NextResponse.json(
          { error: `Invalid rank filter: ${rankParam}` },
          { status: 400, headers: RATE_HEADERS },
        );
      }
      params.rank = rankParam as Rank;
    }

    const typeParam = searchParams.get('type');
    if (typeParam) {
      if (!isValidAgentType(typeParam)) {
        return NextResponse.json(
          { error: `Invalid type filter: ${typeParam}` },
          { status: 400, headers: RATE_HEADERS },
        );
      }
      params.type = typeParam as AgentType;
    }

    const agents = await searchAgents(params);

    return NextResponse.json(
      { agents, total: agents.length },
      { status: 200, headers: RATE_HEADERS },
    );
  } catch (err) {
    console.error('[GET /api/agents] Error:', err);
    return NextResponse.json(
      { error: 'Failed to search agents' },
      { status: 500, headers: RATE_HEADERS },
    );
  }
}
