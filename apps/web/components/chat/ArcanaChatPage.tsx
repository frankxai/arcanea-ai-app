'use client'

import { useCallback, useState } from 'react'
import type { ChatMessage, ChatSession, Guardian } from './types'
import { GUARDIANS, MOCK_SESSIONS } from './data'
import { Sidebar } from './Sidebar'
import { GuardianInfoBar } from './GuardianInfoBar'
import { MessageList } from './MessageList'
import { InputArea } from './InputArea'
import { EmptyState } from './EmptyState'
import { cn } from '@/lib/utils'

// Simulated AI response generator
const GUARDIAN_RESPONSES: Record<string, string[]> = {
  lyra: [
    "The stars have shown me the shape of your vision — vast and shimmering like the Veil Nebula at midnight. Let me weave the threads of fate into something worthy of the cosmos...",
    "Ah, you seek to give form to that which dwells between worlds. I can feel the potential radiating from your words like light through ancient crystal. Here is what the Celestial Archives reveal...",
    "The constellations whisper your story's true name. It carries the weight of a dying star and the promise of a new dawn. Let me illuminate the path forward...",
  ],
  kael: [
    "Ha! Now that is a worthy challenge! My forge-fires burn brighter hearing this. Stand back — this will require the full heat of my celestial anvil. Here comes something that will shake the very foundations of your world...",
    "You want conflict? REAL conflict? The kind that leaves scars on the soul and legends on the tongue? I've forged blades from harder steel than this. Watch closely...",
    "A warrior's tale demands truth — blood, sweat, and the beautiful agony of sacrifice. Your hero will emerge from this trial either broken or reborn. Let me show you which...",
  ],
  sevi: [
    "Still your mind and listen to the current beneath the surface. Your question carries more depth than even you realize — I can feel the undercurrents pulling at its edges. Let me show you what truly lies beneath...",
    "Water finds the truth that stone conceals. What you're asking speaks to something much older, much more profound. The answer flows through these hidden channels...",
    "Every story has a tide. It pulls one way in the sunlight, another in the dark. Your characters are swimming against a current they cannot see. Let me reveal the hidden depths...",
  ],
  omen: [
    "You dare ask this of me? Good. The ones who hesitate at the threshold are never worth my time. What you seek lives in the dark between words, where light fears to illuminate. Here — take this forbidden knowledge...",
    "The void has been listening to your question. It speaks back in riddles and shadows, as all true power does. What I give you now cannot be unlearned...",
    "Your imagination brushes against something ancient and hungry. I have walked those corridors of shadow for eons. Let me be your guide into the beautiful darkness...",
  ],
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

function getGuardianResponse(guardianId: string): string {
  const responses = GUARDIAN_RESPONSES[guardianId] ?? GUARDIAN_RESPONSES.lyra
  return responses[Math.floor(Math.random() * responses.length)]
}

export function ArcanaChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_SESSIONS)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentGuardian, setCurrentGuardian] = useState<Guardian>(GUARDIANS[0])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null
  const messages = activeSession?.messages ?? []

  // Create a brand-new chat session
  const handleNewChat = useCallback(() => {
    const guardian = GUARDIANS[Math.floor(Math.random() * GUARDIANS.length)]
    const newSession: ChatSession = {
      id: generateId(),
      guardianId: guardian.id,
      title: 'New Conversation',
      lastMessage: '',
      timestamp: new Date(),
      messages: [],
    }
    setSessions((prev) => [newSession, ...prev])
    setActiveSessionId(newSession.id)
    setCurrentGuardian(guardian)
    setInputValue('')
  }, [])

  // Select an existing session
  const handleSelectSession = useCallback(
    (id: string) => {
      setActiveSessionId(id)
      const session = sessions.find((s) => s.id === id)
      if (session) {
        const guardian = GUARDIANS.find((g) => g.id === session.guardianId) ?? GUARDIANS[0]
        setCurrentGuardian(guardian)
      }
      setInputValue('')
    },
    [sessions],
  )

  // Send a message
  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed || isTyping) return

    // Create the session on first message if none active
    let sessionId = activeSessionId
    if (!sessionId) {
      const guardian = currentGuardian
      const newSession: ChatSession = {
        id: generateId(),
        guardianId: guardian.id,
        title: trimmed.slice(0, 40) + (trimmed.length > 40 ? '...' : ''),
        lastMessage: trimmed,
        timestamp: new Date(),
        messages: [],
      }
      setSessions((prev) => [newSession, ...prev])
      sessionId = newSession.id
      setActiveSessionId(sessionId)
    }

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              title:
                s.messages.length === 0
                  ? trimmed.slice(0, 40) + (trimmed.length > 40 ? '...' : '')
                  : s.title,
              lastMessage: trimmed,
              timestamp: new Date(),
              messages: [...s.messages, userMsg],
            }
          : s,
      ),
    )
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    const delay = 1200 + Math.random() * 800
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: getGuardianResponse(currentGuardian.id),
        timestamp: new Date(),
        isStreaming: true,
      }
      setIsTyping(false)
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                lastMessage: aiMsg.content.slice(0, 80) + '...',
                messages: [...s.messages, aiMsg],
              }
            : s,
        ),
      )
    }, delay)
  }, [inputValue, activeSessionId, currentGuardian, isTyping])

  // Conversation starter selected from empty state
  const handleStarterSelect = useCallback(
    (prompt: string) => {
      setInputValue(prompt)
    },
    [],
  )

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0a0f 0%, #0d0a18 50%, #080810 100%)' }}
    >
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Main chat area */}
      <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Guardian header */}
        <GuardianInfoBar guardian={currentGuardian} />

        {/* Message area or empty state */}
        {messages.length === 0 && !isTyping ? (
          <EmptyState guardian={currentGuardian} onStarterSelect={handleStarterSelect} />
        ) : (
          <MessageList messages={messages} guardian={currentGuardian} isTyping={isTyping} />
        )}

        {/* Input */}
        <InputArea
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSend}
          guardian={currentGuardian}
          disabled={isTyping}
        />
      </main>

      {/* Ambient cosmic particles */}
      <CosmicParticles color={currentGuardian.glowColor} />
    </div>
  )
}

/** Lightweight ambient particle layer */
function CosmicParticles({ color }: { color: string }) {
  const particles = [
    { x: '8%', y: '15%', size: 1.5, delay: '0s', dur: '4s' },
    { x: '92%', y: '8%', size: 1, delay: '1.2s', dur: '6s' },
    { x: '75%', y: '55%', size: 2, delay: '0.8s', dur: '5s' },
    { x: '20%', y: '75%', size: 1, delay: '2s', dur: '7s' },
    { x: '60%', y: '20%', size: 1.5, delay: '3s', dur: '4.5s' },
    { x: '45%', y: '88%', size: 1, delay: '1.5s', dur: '6.5s' },
    { x: '85%', y: '70%', size: 2, delay: '0.3s', dur: '5.5s' },
    { x: '35%', y: '40%', size: 1, delay: '2.5s', dur: '8s' },
  ]

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-pulse"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: color,
            opacity: 0.25,
            animationDelay: p.delay,
            animationDuration: p.dur,
            filter: `blur(${p.size * 0.5}px)`,
          }}
        />
      ))}
    </div>
  )
}
