/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export type ElementType = 'fire' | 'water' | 'earth' | 'void' | 'celestial'

export interface Guardian {
  id: string
  name: string
  element: ElementType
  tagline: string
  avatarInitials: string
  color: string       // element CSS variable value
  glowColor: string   // hex for box-shadow glow
  greetingMessage: string
  conversationStarters: string[]
  suggestedPrompts: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface ChatSession {
  id: string
  guardianId: string
  title: string
  lastMessage: string
  timestamp: Date
  messages: ChatMessage[]
}

export type DateGroup = 'Today' | 'Yesterday' | 'This Week' | 'Older'
