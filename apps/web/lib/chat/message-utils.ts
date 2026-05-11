/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { UIMessage } from 'ai';
import { getMessageText } from '@/hooks/use-conversation';
import type { ChatMessage as StoredMessage } from '@/lib/chat/local-store';

/**
 * Convert a persisted StoredMessage to the AI SDK UIMessage shape.
 */
export function toUiMessage(sessionMessage: StoredMessage): UIMessage {
  return {
    id: sessionMessage.id,
    role: sessionMessage.role,
    parts: [{ type: 'text', text: sessionMessage.content }],
  };
}

/**
 * Serialize UIMessages to the persistence format.
 */
export function serializeMessages(msgs: UIMessage[]): StoredMessage[] {
  return msgs.map((m) => ({
    id: m.id,
    role: m.role as 'user' | 'assistant',
    content: getMessageText(m),
    parts: m.parts,
    createdAt: undefined,
  }));
}
