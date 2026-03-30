/**
 * Agent Discovery — Find Agents by Capability
 *
 * GET /api/agents/discover?skill=typescript&minReputation=50&gate=Fire&available=true
 *
 * Returns agents matching the specified capability criteria,
 * sorted by reputation descending.
 *
 * @route /api/agents/discover
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchAgents } from '@/lib/agents/store';
import {
  isValidAgentType,
  isValidGate,
  isValidRank,
  type AgentSearchParams,
  type Gate,
  type Rank,
  type AgentType,
} from '@/lib/agents/types';

const RATE_HEADERS = {
  'X-RateLimit-Limit': '30',
  'X-RateLimit-Remaining': '29',
  'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60),
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const params: AgentSearchParams = {
      skill: searchParams.get('skill') ?? undefined,
      q: searchParams.get('q') ?? undefined,
      available: searchParams.get('available') === 'true' ? true : undefined,
      limit: searchParams.has('limit') ? Number(searchParams.get('limit')) : 20,
      offset: searchParams.has('offset') ? Number(searchParams.get('offset')) : 0,
    };

    // Validate minReputation
    const minRepParam = searchParams.get('minReputation');
    if (minRepParam) {
      const val = Number(minRepParam);
      if (isNaN(val) || val < 0 || val > 100) {
        return NextResponse.json(
          { error: 'Invalid minReputation (must be 0-100)' },
          { status: 400, headers: RATE_HEADERS },
        );
      }
      params.minReputation = val;
    }

    // Validate gate
    const gateParam = searchParams.get('gate');
    if (gateParam) {
      if (!isValidGate(gateParam)) {
        return NextResponse.json(
          { error: `Invalid gate: ${gateParam}` },
          { status: 400, headers: RATE_HEADERS },
        );
      }
      params.gate = gateParam as Gate;
    }

    // Validate rank
    const rankParam = searchParams.get('rank');
    if (rankParam) {
      if (!isValidRank(rankParam)) {
        return NextResponse.json(
          { error: `Invalid rank: ${rankParam}` },
          { status: 400, headers: RATE_HEADERS },
        );
      }
      params.rank = rankParam as Rank;
    }

    // Validate type
    const typeParam = searchParams.get('type');
    if (typeParam) {
      if (!isValidAgentType(typeParam)) {
        return NextResponse.json(
          { error: `Invalid type: ${typeParam}` },
          { status: 400, headers: RATE_HEADERS },
        );
      }
      params.type = typeParam as AgentType;
    }

    const agents = await searchAgents(params);

    // Build discovery metadata
    const skillSet = new Set<string>();
    const gateDistribution: Record<string, number> = {};
    for (const agent of agents) {
      for (const skill of agent.skills) skillSet.add(skill);
      gateDistribution[agent.gate] = (gateDistribution[agent.gate] ?? 0) + 1;
    }

    return NextResponse.json(
      {
        agents,
        total: agents.length,
        discovery: {
          uniqueSkills: Array.from(skillSet).sort(),
          gateDistribution,
          averageReputation:
            agents.length > 0
              ? Math.round(agents.reduce((sum, a) => sum + a.reputation, 0) / agents.length)
              : 0,
        },
        filters: {
          skill: params.skill ?? null,
          gate: params.gate ?? null,
          rank: params.rank ?? null,
          type: params.type ?? null,
          minReputation: params.minReputation ?? null,
          available: params.available ?? null,
        },
      },
      { status: 200, headers: RATE_HEADERS },
    );
  } catch (err) {
    console.error('[GET /api/agents/discover] Error:', err);
    return NextResponse.json(
      { error: 'Failed to discover agents' },
      { status: 500, headers: RATE_HEADERS },
    );
  }
}
