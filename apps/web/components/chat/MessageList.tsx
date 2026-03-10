'use client'

import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, Guardian } from './types'
import { TypingIndicator } from './GuardianInfoBar'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: ChatMessage
  guardian: Guardian
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 9V2a1 1 0 011-1h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function SparkleIcon({ color }: { color?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M6.5 1L7.5 5.5H12L8 8l1.5 4-3-2.5L3.5 12 5 8 1 5.5h4.5z"
        stroke={color || 'currentColor'}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MessageBubble({ message, guardian }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)
  const [reacted, setReacted] = useState(false)
  const [showTools, setShowTools] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silently fail
    }
  }

  if (isUser) {
    return (
      <div
        className="flex justify-end gap-2 group animate-slide-up-fade"
        onMouseEnter={() => setShowTools(true)}
        onMouseLeave={() => setShowTools(false)}
      >
        {/* Action tools */}
        <div
          className={cn(
            'flex items-center gap-1 self-end mb-1 transition-opacity duration-200',
            showTools ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span className="text-[10px] text-muted-foreground">{formatTime(message.timestamp)}</span>
          <button
            onClick={handleCopy}
            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy message"
          >
            {copied ? (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 7l3.5 3.5 5.5-7" stroke="#00bcd4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <CopyIcon />
            )}
          </button>
        </div>

        {/* Bubble */}
        <div
          className="max-w-[72%] px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed text-foreground"
          style={{
            background: 'rgba(139,92,246,0.22)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(139,92,246,0.38)',
          }}
        >
          {message.content}
        </div>
      </div>
    )
  }

  // AI message
  return (
    <div
      className="flex items-end gap-3 group animate-slide-up-fade"
      onMouseEnter={() => setShowTools(true)}
      onMouseLeave={() => setShowTools(false)}
    >
      {/* Guardian avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mb-0.5"
        style={{
          background: `linear-gradient(135deg, ${guardian.glowColor}33, ${guardian.glowColor}55)`,
          border: `1.5px solid ${guardian.glowColor}60`,
          color: guardian.color,
        }}
      >
        <span className="font-serif">{guardian.avatarInitials}</span>
      </div>

      <div className="flex flex-col gap-1 max-w-[72%]">
        {/* Bubble */}
        <div
          className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed text-foreground/90"
          style={{
            background: 'rgba(10,10,20,0.65)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(139,92,246,0.15)',
          }}
        >
          {message.isStreaming ? (
            <StreamingText content={message.content} />
          ) : (
            message.content
          )}
        </div>

        {/* Action tools */}
        <div
          className={cn(
            'flex items-center gap-2 px-1 transition-opacity duration-200',
            showTools ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span className="text-[10px] text-muted-foreground">{formatTime(message.timestamp)}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy message"
          >
            {copied ? (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1.5 6l2.5 2.5 5-6" stroke="#00bcd4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <CopyIcon />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={() => setReacted(!reacted)}
            className={cn(
              'flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-colors',
              reacted ? 'text-[#ffd700]' : 'text-muted-foreground hover:text-foreground',
            )}
            aria-label="React with sparkle"
            aria-pressed={reacted}
          >
            <SparkleIcon color={reacted ? '#ffd700' : undefined} />
          </button>
        </div>
      </div>
    </div>
  )
}

function StreamingText({ content }: { content: string }) {
  const [displayed, setDisplayed] = useState('')
  const indexRef = useRef(0)

  useEffect(() => {
    indexRef.current = 0
    setDisplayed('')
    const interval = setInterval(() => {
      if (indexRef.current < content.length) {
        indexRef.current += 3 // speed: 3 chars per tick
        setDisplayed(content.slice(0, indexRef.current))
      } else {
        clearInterval(interval)
      }
    }, 16)
    return () => clearInterval(interval)
  }, [content])

  return (
    <span>
      {displayed}
      {displayed.length < content.length && (
        <span
          className="inline-block w-0.5 h-3.5 bg-primary/70 ml-0.5 align-middle animate-pulse"
          aria-hidden="true"
        />
      )}
    </span>
  )
}

interface MessageListProps {
  messages: ChatMessage[]
  guardian: Guardian
  isTyping: boolean
}

export function MessageList({ messages, guardian, isTyping }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} guardian={guardian} />
      ))}
      {isTyping && <TypingIndicator guardian={guardian} />}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  )
}
