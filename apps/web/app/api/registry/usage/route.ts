import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const UsageSchema = z.object({
  agent_id: z.string().min(1),
  deployment_id: z.string().uuid().optional(),
  platform_id: z.string().optional(),
  tokens_used: z.number().int().min(0).optional(),
  duration_ms: z.number().int().min(0).optional(),
  credits_consumed: z.number().int().min(0).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * POST /api/registry/usage
 * Record a usage event. Authenticated platforms/users can report invocations
 * to build the public attribution record.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = UsageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('usage_events')
    .insert({
      ...parsed.data,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: `Usage insert failed: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ data });
}
