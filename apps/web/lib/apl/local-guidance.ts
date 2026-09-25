/** Keep the creator's prompt intact and label deterministic APL suggestions. */
export function buildLocalGuidance(prompt: string, suggestions: string[]) {
  const guidance = suggestions.slice(0, 5);
  return {
    guidance,
    enhanced: guidance.length
      ? `${prompt.trim()}\n\nCreative direction (retain the creator's intent):\n${guidance.map((item) => `- ${item}`).join("\n")}`
      : prompt.trim(),
  };
}
