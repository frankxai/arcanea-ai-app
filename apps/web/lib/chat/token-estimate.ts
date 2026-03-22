/**
 * Lightweight token estimator for the chat input.
 * Uses a simple heuristic: ~4 characters per token (GPT-style).
 * This avoids importing heavy tokenizer libraries in the browser.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // Rough heuristic: average 4 chars per token for English text
  // Adjust for code (more tokens per char) and short words (fewer chars per token)
  const words = text.trim().split(/\s+/).length;
  const chars = text.length;
  // Blend word-based and char-based estimates
  return Math.ceil((words * 1.3 + chars / 4) / 2);
}

export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) return `~${tokens} tokens`;
  return `~${(tokens / 1000).toFixed(1)}K tokens`;
}
