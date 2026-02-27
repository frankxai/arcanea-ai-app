import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

type ChatRole = 'user' | 'assistant';

interface StoredMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

interface HistoryResponse {
  messages: StoredMessage[];
  bondState: {
    level: number;
    xp: number;
    xpToNextLevel: number;
    relationshipStatus: string;
  };
  hasMore: boolean;
}

interface HistoryStore {
  users: Record<string, Record<string, StoredMessage[]>>;
}

const HISTORY_PATH = path.join(process.cwd(), '.arcanea-runtime', 'chat-history.json');

async function readStore(): Promise<HistoryStore> {
  try {
    const raw = await fs.readFile(HISTORY_PATH, 'utf8');
    const parsed = JSON.parse(raw) as HistoryStore;
    if (!parsed.users) return { users: {} };
    return parsed;
  } catch {
    return { users: {} };
  }
}

async function writeStore(store: HistoryStore): Promise<void> {
  await fs.mkdir(path.dirname(HISTORY_PATH), { recursive: true });
  await fs.writeFile(HISTORY_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function deriveBondState(messages: StoredMessage[]): HistoryResponse['bondState'] {
  const creatorTurns = messages.filter((m) => m.role === 'user').length;
  const level = Math.max(1, Math.min(10, Math.floor(creatorTurns / 10) + 1));
  const xp = creatorTurns * 10;
  const nextLevelTurns = level * 10;
  const xpToNextLevel = level >= 10 ? 0 : Math.max(0, (nextLevelTurns - creatorTurns) * 10);
  const relationshipStatus =
    level >= 8 ? 'trusted_ally' :
    level >= 5 ? 'companion' :
    level >= 3 ? 'friend' :
    'stranger';

  return {
    level,
    xp,
    xpToNextLevel,
    relationshipStatus,
  };
}

async function resolveUserKey(req: NextRequest, fallback?: string | null): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) return user.id;
  } catch {
    // fall through to fallback
  }
  return fallback || 'guest';
}

function sanitizeMessages(input: unknown): StoredMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      const role = item?.role === 'assistant' ? 'assistant' : item?.role === 'user' ? 'user' : null;
      const content = typeof item?.content === 'string' ? item.content.trim() : '';
      if (!role || !content) return null;
      return {
        id: typeof item?.id === 'string' && item.id ? item.id : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role,
        content,
        timestamp: typeof item?.timestamp === 'string' && item.timestamp ? item.timestamp : new Date().toISOString(),
      } satisfies StoredMessage;
    })
    .filter((m): m is StoredMessage => Boolean(m));
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const luminorId = params.get('luminorId') || 'default';
  const requestedUserId = params.get('userId');
  const before = params.get('before');
  const limit = Math.max(1, Math.min(200, Number(params.get('limit') || 50)));

  const userKey = await resolveUserKey(req, requestedUserId);
  const store = await readStore();
  const allMessages = store.users[userKey]?.[luminorId] || [];

  let start = 0;
  let end = allMessages.length;
  if (before) {
    const beforeIndex = allMessages.findIndex((msg) => msg.id === before);
    end = beforeIndex >= 0 ? beforeIndex : allMessages.length;
    start = Math.max(0, end - limit);
  } else {
    start = Math.max(0, allMessages.length - limit);
  }

  const messages = allMessages.slice(start, end);
  const payload: HistoryResponse = {
    messages,
    bondState: deriveBondState(allMessages),
    hasMore: start > 0,
  };

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const luminorId = typeof body.luminorId === 'string' && body.luminorId ? body.luminorId : 'default';
    const requestedUserId = typeof body.userId === 'string' ? body.userId : null;
    const incoming = sanitizeMessages(body.messages);

    if (incoming.length === 0) {
      return NextResponse.json({ ok: true, saved: 0 });
    }

    const userKey = await resolveUserKey(req, requestedUserId);
    const store = await readStore();

    if (!store.users[userKey]) store.users[userKey] = {};
    if (!store.users[userKey][luminorId]) store.users[userKey][luminorId] = [];

    const existing = store.users[userKey][luminorId];
    const seen = new Set(existing.map((m) => m.id));
    for (const message of incoming) {
      if (!seen.has(message.id)) {
        existing.push(message);
        seen.add(message.id);
      }
    }

    existing.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    await writeStore(store);

    return NextResponse.json({
      ok: true,
      saved: incoming.length,
      total: existing.length,
      bondState: deriveBondState(existing),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to persist history' },
      { status: 500 }
    );
  }
}
