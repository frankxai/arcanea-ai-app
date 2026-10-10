/** Optional server-side enhancement. Call only inside admitted provider work. */
export async function enhanceImagePrompt(prompt: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return prompt;
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        signal: AbortSignal.timeout(10000),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "x-ai/grok-2-1212",
          max_tokens: 600,
          temperature: 0.85,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                'Rewrite the image prompt with specific composition, lighting and texture. Return JSON with an "enhanced" string under 2000 characters.',
            },
            { role: "user", content: prompt },
          ],
        }),
      },
    );
    if (!response.ok) return prompt;
    const data = (await response.json()) as {
      choices?: { message?: { content?: unknown } }[];
    };
    const text = data.choices?.[0]?.message?.content;
    if (typeof text !== "string" || text.length > 10000) return prompt;
    const enhanced: unknown = JSON.parse(text).enhanced;
    return typeof enhanced === "string" &&
      enhanced.trim() &&
      enhanced.length <= 2000
      ? enhanced
      : prompt;
  } catch {
    return prompt;
  }
}
