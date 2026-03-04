
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { CHARACTERS } from "@/lib/data/characters";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages, characterId = "evi" } = await req.json();
        const character = CHARACTERS[characterId] || CHARACTERS.evi;

        // Use environment variable if available, otherwise just use mock
        if (!process.env.ANTHROPIC_API_KEY) {
            // Mock Streaming Response for Demo without API Key
            const encoder = new TextEncoder();
            const customStream = new ReadableStream({
                async start(controller) {
                    const text = `[System: API Key missing. Simulating ${character.name} response...]\n\n${character.greeting} I see you're interested in: "${messages[messages.length - 1].content}". Let's explore that creative path together!`;
                    for (let i = 0; i < text.length; i++) {
                        controller.enqueue(encoder.encode(text[i]));
                        await new Promise(r => setTimeout(r, 20));
                    }
                    controller.close();
                }
            });
            return new Response(customStream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        }

        const result = streamText({
            model: anthropic("claude-3-5-sonnet-20241022"),
            system: character.systemPrompt,
            messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
            temperature: 0.85,
            maxTokens: 1024,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to process chat" }), { status: 500 });
    }
}
