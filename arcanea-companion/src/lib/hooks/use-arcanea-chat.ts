"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { CHARACTERS } from "@/lib/data/characters";

export function useArcaneaChat() {
    const [activeCharacter, setActiveCharacter] = useState(CHARACTERS.evi);

    const { messages, input, setInput, append, isLoading, stop } = useChat({
        api: "/api/chat",
        body: { characterId: activeCharacter.id },
        initialMessages: [
            {
                id: "greeting",
                role: "assistant",
                content: activeCharacter.greeting,
            },
        ],
    });

    const switchCharacter = (characterId: string) => {
        const newChar = CHARACTERS[characterId];
        if (newChar) {
            setActiveCharacter(newChar);
            // In a real app, we might clear messages or fetch history for that character
            // For now, we simulate a conversation switch
        }
    };

    return {
        messages,
        input,
        setInput,
        sendMessage: (content: string) => append({ role: "user", content }),
        isLoading,
        stop,
        activeCharacter,
        switchCharacter,
    };
}
