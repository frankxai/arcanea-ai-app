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
