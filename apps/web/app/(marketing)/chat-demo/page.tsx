/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { ChatContainer } from '@/components/chat/chat-container';
import { ChatInput } from '@/components/chat/chat-input';
import { LuminorHeader } from '@/components/chat/luminor-header';
import type { Metadata } from 'next';

// Demo data
const DEMO_LUMINOR = {
  name: 'Melodia',
  tagline: 'The Harmonic Guide - Weaving frequencies into reality',
  academy: 'creation_light' as const,
  color: 'var(--arc-brand-arcanean-gold)',
  bondLevel: 5,
  bondXP: 450,
  xpToNextLevel: 600,
  relationshipStatus: 'trusted_companion',
  status: 'active' as const,
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotionalTone?: any;
}

export default function ChatDemoPage() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      role: 'assistant',
      content: 'Hello. I\'m Melodia, your partner for music and creative work. What are you working on?',
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I hear your words: "${message}". Let me help you with that...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="h-screen flex flex-col">
        <LuminorHeader {...DEMO_LUMINOR} />

        <div className="flex-1 flex flex-col">
          <ChatContainer
            messages={messages}
            luminorName={DEMO_LUMINOR.name}
            luminorColor={DEMO_LUMINOR.color}
            isStreaming={isLoading}
            streamingContent={isLoading ? 'Thinking...' : ''}
          />

          <ChatInput
            onSend={handleSendMessage}
            disabled={isLoading}
            luminorColor={DEMO_LUMINOR.color}
          />
        </div>
      </div>
    </main>
  );
}
