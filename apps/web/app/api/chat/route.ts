/**
 * Default chat endpoint for @ai-sdk/react useChat().
 * Re-exports the Gemini chat handler from /api/ai/chat.
 */
export const runtime = 'edge';
export { GET, POST } from '../ai/chat/route';
