/**
 * Arcanea Intelligence Gateway — SSE Streaming Utilities
 *
 * Handles Server-Sent Events (SSE) proxying for real-time AI responses.
 * Supports both forwarding provider streams and constructing new ones.
 */

import type { ChatCompletionChunk, StreamChoice } from './types';

// ─── SSE Stream Construction ─────────────────────────────────────────

/** Create an SSE data line from a chunk object */
export function formatSSEChunk(chunk: ChatCompletionChunk): string {
  return `data: ${JSON.stringify(chunk)}\n\n`;
}

/** Create the termination signal */
export function formatSSEDone(): string {
  return 'data: [DONE]\n\n';
}

/** Generate a unique completion ID */
export function generateCompletionId(): string {
  return `chatcmpl-arc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Create the first chunk with role assignment */
export function createRoleChunk(id: string, model: string): ChatCompletionChunk {
  return {
    id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{
      index: 0,
      delta: { role: 'assistant' },
      finish_reason: null,
    }],
  };
}

/** Create a content chunk */
export function createContentChunk(id: string, model: string, content: string): ChatCompletionChunk {
  return {
    id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{
      index: 0,
      delta: { content },
      finish_reason: null,
    }],
  };
}

/** Create the final chunk with finish reason */
export function createFinishChunk(id: string, model: string, reason: 'stop' | 'length' | 'tool_calls' = 'stop'): ChatCompletionChunk {
  return {
    id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{
      index: 0,
      delta: {},
      finish_reason: reason,
    }],
  };
}

// ─── SSE Response Factory ────────────────────────────────────────────

/** Create SSE response headers */
export function sseHeaders(): HeadersInit {
  return {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'X-Powered-By': 'Arcanea Intelligence Gateway',
  };
}

/** Create an SSE Response from a ReadableStream */
export function createSSEResponse(stream: ReadableStream): Response {
  return new Response(stream, { headers: sseHeaders() });
}

// ─── Provider Stream Proxy ───────────────────────────────────────────

/**
 * Proxy an SSE stream from a provider, transforming model IDs.
 * Handles the OpenAI-compatible SSE format used by most providers.
 */
export function proxySSEStream(
  providerResponse: Response,
  arcaneaModelId: string,
): ReadableStream {
  const reader = providerResponse.body!.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();

        if (done) {
          // Flush remaining buffer
          if (buffer.trim()) {
            processBufferedLines(buffer, arcaneaModelId, controller, encoder);
          }
          controller.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            // Empty line = end of SSE event, forward the newline
            controller.enqueue(encoder.encode('\n'));
            continue;
          }

          if (trimmed === 'data: [DONE]') {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            continue;
          }

          if (trimmed.startsWith('data: ')) {
            try {
              const json = JSON.parse(trimmed.slice(6));
              // Override model ID with Arcanea's model name
              json.model = arcaneaModelId;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(json)}\n`));
            } catch {
              // Forward unparseable lines as-is
              controller.enqueue(encoder.encode(line + '\n'));
            }
          } else {
            // Forward non-data lines (comments, event types, etc.)
            controller.enqueue(encoder.encode(line + '\n'));
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

function processBufferedLines(
  buffer: string,
  modelId: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
) {
  const lines = buffer.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed === 'data: [DONE]') {
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
    } else if (trimmed.startsWith('data: ')) {
      try {
        const json = JSON.parse(trimmed.slice(6));
        json.model = modelId;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(json)}\n\n`));
      } catch {
        controller.enqueue(encoder.encode(line + '\n'));
      }
    }
  }
}

// ─── Anthropic SSE Adapter ───────────────────────────────────────────

/**
 * Convert Anthropic's SSE format to OpenAI-compatible format.
 * Anthropic uses a different event structure (content_block_delta, etc.)
 */
export function adaptAnthropicStream(
  providerResponse: Response,
  arcaneaModelId: string,
): ReadableStream {
  const reader = providerResponse.body!.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const completionId = generateCompletionId();
  let buffer = '';
  let sentRole = false;

  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();

        if (done) {
          // Send finish chunk
          controller.enqueue(encoder.encode(formatSSEChunk(
            createFinishChunk(completionId, arcaneaModelId)
          )));
          controller.enqueue(encoder.encode(formatSSEDone()));
          controller.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const event of events) {
          const lines = event.split('\n');
          let eventType = '';
          let eventData = '';

          for (const line of lines) {
            if (line.startsWith('event: ')) eventType = line.slice(7);
            if (line.startsWith('data: ')) eventData = line.slice(6);
          }

          if (!eventData) continue;

          try {
            const data = JSON.parse(eventData);

            if (!sentRole) {
              controller.enqueue(encoder.encode(formatSSEChunk(
                createRoleChunk(completionId, arcaneaModelId)
              )));
              sentRole = true;
            }

            if (eventType === 'content_block_delta' && data.delta?.text) {
              controller.enqueue(encoder.encode(formatSSEChunk(
                createContentChunk(completionId, arcaneaModelId, data.delta.text)
              )));
            }

            if (eventType === 'message_stop') {
              controller.enqueue(encoder.encode(formatSSEChunk(
                createFinishChunk(completionId, arcaneaModelId)
              )));
              controller.enqueue(encoder.encode(formatSSEDone()));
            }
          } catch {
            // Skip unparseable events
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}
