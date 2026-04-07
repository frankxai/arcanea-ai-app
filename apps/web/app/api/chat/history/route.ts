/**
 * Chat History API Route
 *
 * GET  /api/chat/history?luminorId=&userId=&limit=&before=
 *   Returns paginated message history + bond state.
 *
 * POST /api/chat/history
 *   Body: { luminorId, userId, messages: [{id, role, content, timestamp}] }
 *   Persists messages and returns updated bond state.
 *
 * Strategy:
 *   - Authenticated users → Supabase (chat_sessions + chat_messages tables)
 *   - Anonymous / unconfigured → file-based fallback (.arcanea-runtime/chat-history.json)
 *
 * The file-based fallback ensures the chat UI always works even without
 * Supabase configuration or when the user is not logged in.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

type ChatRole = 'user' | 'assistant';

interface StoredMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

interface BondState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  relationshipStatus: string;
}

interface HistoryResponse {
  messages: StoredMessage[];
  bondState: BondState;
  hasMore: boolean;
  sessionId?: string;
}

// ---------------------------------------------------------------------------
// File-based fallback store
// ---------------------------------------------------------------------------

interface FileStore {
  users: Record<string, Record<string, StoredMessage[]>>;
}

const HISTORY_PATH = path.join(
  process.cwd(),
  '.arcanea-runtime',
  'chat-history.json'
);

async function readFileStore(): Promise<FileStore> {
  try {
    const raw = await fs.readFile(HISTORY_PATH, 'utf8');
    const parsed = JSON.parse(raw) as FileStore;
    return parsed.users ? parsed : { users: {} };
  } catch {
    return { users: {} };
  }
}

async function writeFileStore(store: FileStore): Promise<void> {
  await fs.mkdir(path.dirname(HISTORY_PATH), { recursive: true });
  await fs.writeFile(HISTORY_PATH, JSON.stringify(store, null, 2), 'utf8');
}

// ---------------------------------------------------------------------------
// Bond state helper
// ---------------------------------------------------------------------------

function deriveBondState(userTurnCount: number): BondState {
  const level = Math.max(1, Math.min(10, Math.floor(userTurnCount / 10) + 1));
  const xp = userTurnCount * 10;
  const nextLevelTurns = level * 10;
  const xpToNextLevel =
    level >= 10 ? 0 : Math.max(0, (nextLevelTurns - userTurnCount) * 10);
  const relationshipStatus =
    level >= 8
      ? 'trusted_ally'
      : level >= 5
      ? 'companion'
      : level >= 3
      ? 'friend'
      : 'stranger';

  return { level, xp, xpToNextLevel, relationshipStatus };
}

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

/**
 * Returns the authenticated Supabase user id, or null if not logged in
 * or Supabase is not configured.  Never throws.
 */
async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Input sanitisation
// ---------------------------------------------------------------------------

function sanitizeMessages(input: unknown): StoredMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      const role: ChatRole | null =
        item?.role === 'assistant'
          ? 'assistant'
          : item?.role === 'user'
          ? 'user'
          : null;
      const content =
        typeof item?.content === 'string' ? item.content.trim() : '';
      if (!role || !content) return null;
      return {
        id:
          typeof item?.id === 'string' && item.id
            ? item.id
            : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role,
        content,
        timestamp:
          typeof item?.timestamp === 'string' && item.timestamp
            ? item.timestamp
            : new Date().toISOString(),
      } satisfies StoredMessage;
    })
    .filter((m): m is StoredMessage => Boolean(m));
}

// ---------------------------------------------------------------------------
// GET — fetch history
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const luminorId = params.get('luminorId') || 'default';
    const requestedUserId = params.get('userId');
    const beforeId = params.get('before') ?? undefined;
    const limit = Math.max(1, Math.min(200, Number(params.get('limit') || 50)));

    const authUserId = await getAuthenticatedUserId();

    // --- Supabase path (authenticated users) ---
    if (authUserId) {
      try {
        const { getChatHistory } = await import(
          '@/lib/services/chat-service'
        );
        const result = await getChatHistory(authUserId, luminorId, {
          limit,
          beforeId,
        });

        const payload: HistoryResponse = {
          sessionId: result.sessionId,
          messages: result.messages.map((m) => ({
            id: m.id,
            role: m.role as ChatRole,
            content: m.content,
            timestamp: m.createdAt,
          })),
          bondState: result.bondState,
          hasMore: result.hasMore,
        };

        return NextResponse.json(payload, {
          headers: { 'Cache-Control': 'no-store' },
        });
      } catch (err) {
        console.error('[chat/history GET] Supabase error — falling back to file store:', err);
        // Fall through to file store
      }
    }

    // --- File-based fallback (anonymous or Supabase unavailable) ---
    const userKey = requestedUserId || 'guest';
    const store = await readFileStore();
    const allMessages = store.users[userKey]?.[luminorId] || [];

    let start = 0;
    let end = allMessages.length;

    if (beforeId) {
      const beforeIndex = allMessages.findIndex((msg) => msg.id === beforeId);
      end = beforeIndex >= 0 ? beforeIndex : allMessages.length;
      start = Math.max(0, end - limit);
    } else {
      start = Math.max(0, allMessages.length - limit);
    }

    const messages = allMessages.slice(start, end);
    const userTurns = allMessages.filter((m) => m.role === 'user').length;

    const payload: HistoryResponse = {
      messages,
      bondState: deriveBondState(userTurns),
      hasMore: start > 0,
    };

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST — persist messages
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const luminorId =
      typeof body.luminorId === 'string' && body.luminorId
        ? body.luminorId
        : 'default';
    const requestedUserId =
      typeof body.userId === 'string' ? body.userId : null;
    const incoming = sanitizeMessages(body.messages);

    if (incoming.length === 0) {
      return NextResponse.json({ ok: true, saved: 0 });
    }

    const authUserId = await getAuthenticatedUserId();

    // --- Supabase path (authenticated users) ---
    if (authUserId) {
      try {
        const { persistChatMessages } = await import(
          '@/lib/services/chat-service'
        );
        const result = await persistChatMessages(authUserId, luminorId, incoming);

        return NextResponse.json({
          ok: true,
          saved: result.saved,
          sessionId: result.sessionId,
          bondState: result.bondState,
        });
      } catch (err) {
        console.error('[chat/history POST] Supabase error — falling back to file store:', err);
        // Fall through to file store
      }
    }

    // --- File-based fallback ---
    const userKey = requestedUserId || 'guest';
    const store = await readFileStore();

    if (!store.users[userKey]) store.users[userKey] = {};
    if (!store.users[userKey][luminorId])
      store.users[userKey][luminorId] = [];

    const existing = store.users[userKey][luminorId];
    const seen = new Set(existing.map((m) => m.id));

    for (const message of incoming) {
      if (!seen.has(message.id)) {
        existing.push(message);
        seen.add(message.id);
      }
    }

    existing.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    await writeFileStore(store);

    const userTurns = existing.filter((m) => m.role === 'user').length;

    return NextResponse.json({
      ok: true,
      saved: incoming.length,
      total: existing.length,
      bondState: deriveBondState(userTurns),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to persist history',
      },
      { status: 500 }
    );
  }
}
