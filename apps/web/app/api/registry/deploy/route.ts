import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const DeploySchema = z.object({
  agent_id: z.string().min(1),
  platform_id: z.string().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  api_keys_ref: z.record(z.string(), z.string()).optional(),
});

/**
 * POST /api/registry/deploy
 * Deploy an agent to a platform. Requires authenticated user (Supabase JWT).
 * Emits an attribution event (type='deploy', tip_amount=0).
 * Abundance mode — no revenue split, no payment.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = DeploySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 });
  }

  const { agent_id, platform_id, config, api_keys_ref } = parsed.data;

  // Auth via user cookie
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Admin client for writes (bypass RLS for service ops)
  const admin = createAdminClient();

  // Verify agent
  const { data: agent, error: agentError } = await admin
    .from('marketplace_agents')
    .select('id, title, creator_id, is_published, usage_count')
    .eq('id', agent_id)
    .maybeSingle();

  if (agentError || !agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }
  if (!agent.is_published) {
    return NextResponse.json({ error: 'Agent not published' }, { status: 403 });
  }

  // Create deployment
  const { data: deployment, error: deployError } = await admin
    .from('deployments')
    .insert({
      agent_id,
      deployer_id: user.id,
      platform_id: platform_id ?? null,
      config: config ?? {},
      api_keys_ref: api_keys_ref ?? {},
      status: 'active',
    })
    .select()
    .single();

  if (deployError) {
    return NextResponse.json({ error: `Deploy failed: ${deployError.message}` }, { status: 500 });
  }

  // Attribution event — pure reach, no money
  if (agent.creator_id) {
    await admin.from('attribution_events').insert({
      agent_id,
      creator_id: agent.creator_id,
      platform_id: platform_id ?? null,
      deployment_id: deployment.id,
      tip_amount: 0,
      event_type: 'deploy',
    });
  }

  // Increment usage count
  await admin
    .from('marketplace_agents')
    .update({ usage_count: (agent.usage_count ?? 0) + 1 })
    .eq('id', agent_id);

  return NextResponse.json({
    data: {
      deployed: true,
      deployment_id: deployment.id,
      agent_id,
      agent_title: agent.title,
      platform_id: platform_id ?? 'local',
      status: 'active',
    },
  });
}
