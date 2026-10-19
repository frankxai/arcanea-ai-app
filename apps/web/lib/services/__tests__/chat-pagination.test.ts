import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

test("chat sessions route uses embedded PostgREST aggregate count and chat-service uses deterministic (created_at, id) tie-break", () => {
  const webRoot = path.resolve(import.meta.dirname, "../../..");
  const sessionsRoute = fs.readFileSync(
    path.join(webRoot, "app/api/chat/sessions/route.ts"),
    "utf8",
  );
  const chatService = fs.readFileSync(
    path.join(webRoot, "lib/services/chat-service.ts"),
    "utf8",
  );

  assert.match(sessionsRoute, /\.select\("\*, chat_messages\(count\)"\)/);
  assert.match(sessionsRoute, /extractSessionMessageCount\(session\)/);
  assert.doesNotMatch(sessionsRoute, /\.select\(['"]session_id['"]\)/);

  assert.match(chatService, /\.order\("created_at", \{ ascending: false \}\)/);
  assert.match(chatService, /\.order\("id", \{ ascending: false \}\)/);
  assert.match(chatService, /buildCursorDecayFilter\(cursor\)/);
  assert.match(chatService, /if \(cursorError\)/);
  assert.match(chatService, /if \(!cursor\) throw new Error/);
});
