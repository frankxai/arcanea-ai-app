import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const node = z.object({
  id: z.string().max(100), position: z.object({ x: z.number().finite(), y: z.number().finite() }),
  data: z.object({ label: z.string().max(1200) }).passthrough(),
}).passthrough();
const edge = z.object({ id: z.string().max(100), source: z.string().max(100), target: z.string().max(100) }).passthrough();
const graph = z.object({ nodes: z.array(node).max(300), edges: z.array(edge).max(500), revision: z.number().int().min(0) });

async function owner() {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  return { client, user };
}

export async function GET() {
  const { client, user } = await owner();
  if (!user) return NextResponse.json({ error: 'Sign in to open your canvas.' }, { status: 401 });
  const { data, error } = await client.from('personal_canvases' as 'creations')
    .select('nodes,edges,revision').eq('user_id', user.id).maybeSingle();
  if (error) return NextResponse.json({ error: 'Canvas could not be loaded.' }, { status: 503 });
  return NextResponse.json(data ?? { nodes: [], edges: [], revision: 0 });
}

export async function PUT(request: Request) {
  const { client, user } = await owner();
  if (!user) return NextResponse.json({ error: 'Sign in to save your canvas.' }, { status: 401 });
  const parsed = graph.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'The canvas has invalid or excessive data.' }, { status: 400 });
  const { nodes, edges, revision } = parsed.data;
  const storage = client as unknown as { from: (table: string) => {
    update: (value: Record<string, unknown>) => { eq: (column: string, value: string) => {
      eq: (column: string, value: number) => { select: (columns: string) => {
        maybeSingle: () => Promise<{ data: { revision: number } | null; error: { message: string } | null }>;
      } };
    } };
    insert: (value: Record<string, unknown>) => Promise<{ error: { code?: string; message: string } | null }>;
  } };
  const updated = await storage.from('personal_canvases').update({ nodes, edges, revision: revision + 1, updated_at: new Date().toISOString() })
    .eq('user_id', user.id).eq('revision', revision).select('revision').maybeSingle();
  if (updated.error) return NextResponse.json({ error: 'Canvas could not be saved.' }, { status: 503 });
  if (updated.data) return NextResponse.json({ revision: updated.data.revision });
  if (revision !== 0) return NextResponse.json({ error: 'Your canvas changed in another tab. Reload before saving.' }, { status: 409 });
  const inserted = await storage.from('personal_canvases').insert({ user_id: user.id, nodes, edges, revision: 1 });
  if (inserted.error) return NextResponse.json({ error: inserted.error.code === '23505' ? 'Canvas changed in another tab. Reload before saving.' : 'Canvas could not be saved.' }, { status: inserted.error.code === '23505' ? 409 : 503 });
  return NextResponse.json({ revision: 1 });
}
