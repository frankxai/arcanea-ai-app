import { NextResponse } from 'next/server';
import { getAgent, getAgentStats } from '@/lib/registry/queries';

/**
 * GET /api/registry/agents/[id]
 * Returns agent metadata + public reach stats.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agent = await getAgent(id);

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  const stats = await getAgentStats(id);

  return NextResponse.json({
    data: { agent, stats },
  });
}
