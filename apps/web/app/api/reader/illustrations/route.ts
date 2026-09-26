import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 120;

const BOOK = 'the-light-she-could-not-see';
const MODEL = 'gpt-image-2';
const selectionSchema = z.object({
  requestId: z.string().uuid(),
  chapter: z.number().int().min(1).max(21),
  excerpt: z.string().trim().min(20).max(500),
});

type CreditRpc = {
  rpc: (name: string, args: Record<string, string | null>) => Promise<{
    data: string | null; error: { message: string } | null;
  }>;
};

function paragraphText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

async function chapterSource(chapter: number) {
  const file = chapter <= 12 ? 'THE_LIGHT_SHE_COULD_NOT_SEE.md' :
    chapter <= 17 ? 'THE_RIDER_CIRCLE.md' : 'THE_OPEN_ROAD.md';
  const raw = await readFile(join(process.cwd(), 'content/stories', BOOK, file), 'utf8');
  const sections = raw.split(/(?=^## \d{2} · )/m);
  const ordinal = String(chapter).padStart(2, '0');
  const section = sections.find((part) => part.startsWith(`## ${ordinal} · `));
  if (!section) throw new Error('Published chapter unavailable');
  return section;
}

async function auth() {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  return { client, user };
}

export async function GET() {
  const { client, user } = await auth();
  if (!user) return NextResponse.json({ error: 'Sign in to see your illustrations.' }, { status: 401 });

  const { data, error } = await client.from('creations')
    .select('id,title,content,metadata,created_at')
    .eq('user_id', user.id).eq('type', 'image').eq('visibility', 'private')
    .contains('metadata', { source: 'reader', book: BOOK })
    .order('created_at', { ascending: false }).limit(40);
  if (error) return NextResponse.json({ error: 'Could not load your illustrations.' }, { status: 503 });

  const illustrations = await Promise.all((data ?? []).map(async (item: {
    id: string; title: string; content: unknown; created_at: string;
  }) => {
    const content = item.content && typeof item.content === 'object' && !Array.isArray(item.content)
      ? item.content as Record<string, unknown> : {};
    const path = typeof content.storagePath === 'string' ? content.storagePath : '';
    const { data: signed } = path ? await client.storage.from('creations').createSignedUrl(path, 3600) : { data: null };
    return { id: item.id, title: item.title, excerpt: content.excerpt, chapter: content.chapter,
      imageUrl: signed?.signedUrl ?? null, createdAt: item.created_at };
  }));
  return NextResponse.json({ illustrations });
}

export async function POST(request: Request) {
  const { client, user } = await auth();
  if (!user) return NextResponse.json({ error: 'Sign in to illustrate this passage.' }, { status: 401 });
  const parsed = selectionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Select a passage of 20–500 characters.' }, { status: 400 });
  const { requestId, chapter, excerpt } = parsed.data;
  const source = await chapterSource(chapter);
  if (!paragraphText(source.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ').replace(/[*_`]/g, '')).includes(paragraphText(excerpt))) {
    return NextResponse.json({ error: 'Select text from this published chapter.' }, { status: 400 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Illustration is temporarily unavailable.' }, { status: 503 });
  }

  const admin = createAdminClient();
  const credits = admin as unknown as CreditRpc;
  const identity = { p_user_id: user.id, p_request_id: requestId };
  const reservation = await credits.rpc('reserve_reader_illustration', identity);
  if (reservation.error) return NextResponse.json({ error: 'Credit service unavailable.' }, { status: 503 });
  if (reservation.data === 'insufficient') {
    return NextResponse.json({ error: 'You need one illustration credit.' }, { status: 402 });
  }
  if (reservation.data !== 'reserved') {
    return NextResponse.json({ error: 'This illustration request was already submitted.' }, { status: 409 });
  }

  const storagePath = `${user.id}/reader/${requestId}.png`;
  let creationId: string | null = null;
  try {
    const prompt = [
      'Create one accomplished editorial illustration for the following exact passage of an Arcanea story.',
      'Preserve the people, place, actions, scale, and emotional point of view in the passage. Do not add characters or invented symbols.',
      'Cinematic natural light, tactile environment, deliberate composition, nuanced faces; no text, lettering, logos, frames, or game interface.',
      `Passage: ${excerpt}`,
    ].join('\n');
    const { image } = await generateImage({ model: openai.image(MODEL), prompt, size: '1536x1024' });
    const { error: uploadError } = await admin.storage.from('creations')
      .upload(storagePath, image.uint8Array, { contentType: image.mediaType || 'image/png', upsert: false });
    if (uploadError) throw uploadError;
    const { data: creation, error: insertError } = await client.from('creations').insert({
      user_id: user.id, title: `Chapter ${chapter} · Illustrated passage`, type: 'image',
      status: 'draft', visibility: 'private', ai_model: MODEL, ai_prompt: prompt,
      content: { excerpt, chapter, storagePath, book: BOOK },
      metadata: { source: 'reader', book: BOOK, requestId },
    }).select('id').single();
    if (insertError || !creation) throw insertError ?? new Error('Could not save illustration');
    creationId = creation.id;
    const { data: signed, error: signError } = await client.storage.from('creations').createSignedUrl(storagePath, 3600);
    if (signError) throw signError;
    const settled = await credits.rpc('settle_reader_illustration', { ...identity, p_creation_id: creation.id });
    if (settled.error || settled.data !== 'completed') throw settled.error ?? new Error('Could not complete illustration');
    return NextResponse.json({ id: creation.id, imageUrl: signed.signedUrl, chapter, excerpt }, { status: 201 });
  } catch (error) {
    console.error('[reader/illustrations] failed:', error);
    // A settlement can commit even when its network response is lost. The
    // durable ledger decides whether cleanup is allowed, never the exception.
    const refunded = await credits.rpc('settle_reader_illustration', { ...identity, p_creation_id: null });
    if (refunded.error) {
      console.error('[reader/illustrations] refund uncertain; reconciliation will resolve it:', refunded.error);
      return NextResponse.json({ error: 'We could not confirm the result. Check your illustrations shortly.' }, { status: 503 });
    }
    if (refunded.data === 'refunded') {
      if (creationId) await admin.from('creations').delete().eq('id', creationId).eq('user_id', user.id);
      await admin.storage.from('creations').remove([storagePath]);
      return NextResponse.json({ error: 'Illustration failed. Your credit was returned.' }, { status: 503 });
    }
    // A completed reservation owns the saved image, even if the response was lost.
    return NextResponse.json({ error: 'Your illustration may be ready. Check your illustrations.' }, { status: 503 });
  }
}
