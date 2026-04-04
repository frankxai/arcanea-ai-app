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
