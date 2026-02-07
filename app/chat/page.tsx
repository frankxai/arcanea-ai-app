'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { GUARDIANS as GUARDIAN_PERSONALITIES } from '@/lib/ai/client'
import {
  Send,
  Sparkles,
  Trash2,
  Download,
  Copy,
  Zap,
  Shield,
  Crown,
  Flame,
  Droplet,
  Mountain,
  Wind,
  Eye,
  FileText,
  UserPlus,
  MapPin,
  ImagePlus,
} from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant' | 'error'
  content: string
  timestamp: number
  id: string
  providerId?: string
  modelId?: string
  guardianInsight?: string
  usage?: {
    tokens?: number
    cost?: number
    generationTime?: number
  }
}

const elementIcons: Record<string, typeof Flame> = {
  fire: Flame,
  water: Droplet,
  earth: Mountain,
  wind: Wind,
  void: Eye,
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [activeModel, setActiveModel] = useState('claude')
  const [activeGuardian, setActiveGuardian] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
      id: Date.now().toString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsGenerating(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          guardianId: activeGuardian || undefined,
          model: activeModel,
        }),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      // Read the streaming response
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      const aiMessageId = Date.now().toString()
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        id: aiMessageId,
      }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          // Parse Vercel AI SDK data stream format
          for (const line of chunk.split('\n')) {
            if (line.startsWith('0:')) {
              try {
                const text = JSON.parse(line.slice(2))
                fullText += text
                setMessages((prev) => prev.map(m =>
                  m.id === aiMessageId ? { ...m, content: fullText } : m
                ))
              } catch { /* skip non-text chunks */ }
            }
          }
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      const errorMessage: ChatMessage = {
        role: 'error',
        content: `Error: ${message}`,
        timestamp: Date.now(),
        id: Date.now().toString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
      setInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => setMessages([])

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const exportChat = () => {
    const chatData = {
      messages,
      exportDate: new Date().toISOString(),
      models: { activeModel, activeGuardian },
    }
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `arcanea-chat-${Date.now()}.json`
    a.click()
  }

  const totalCost = messages
    .filter((msg) => msg.usage?.cost)
    .reduce((sum, msg) => sum + (msg.usage?.cost ?? 0), 0)

  return (
    <div className="flex h-screen bg-cosmic-void">
      {/* Sidebar */}
      <div className="w-80 glass-strong border-r border-arcane-crystal/10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-display text-white mb-1">Arcanea Chat</h2>
          <p className="text-text-muted text-sm font-sans">Multi-LLM Superagent Interface</p>

          {activeGuardian && GUARDIAN_PERSONALITIES[activeGuardian] && (
            <div className="mt-4 p-3 bg-arcane-fire/10 rounded-xl border border-arcane-fire/20">
              <div className="text-xs font-sans font-medium text-arcane-fire mb-1">
                {GUARDIAN_PERSONALITIES[activeGuardian]?.name} Active
              </div>
              <div className="text-xs text-text-muted font-body">
                {GUARDIAN_PERSONALITIES[activeGuardian]?.expertise[0]}
              </div>
            </div>
          )}
        </div>

        {/* Model + Guardian selection */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Model Selection */}
          <div>
            <h3 className="text-text-secondary font-sans font-medium text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI Model
            </h3>
            <div className="space-y-2">
              {[
                { id: 'claude', name: 'Claude 3.5 Sonnet', desc: 'Analytical reasoning' },
                { id: 'gpt', name: 'GPT-4 Turbo', desc: 'Creative versatility' },
                { id: 'gemini', name: 'Gemini Pro', desc: 'Multimodal excellence' },
              ].map((model) => (
                <button
                  key={model.id}
                  onClick={() => setActiveModel(model.id)}
                  aria-label={`Select ${model.name} model`}
                  aria-pressed={activeModel === model.id}
                  className={`w-full text-left p-3 rounded-xl border transition-all font-sans ${
                    activeModel === model.id
                      ? 'bg-gradient-to-r from-arcane-crystal/20 to-arcane-water/20 border-arcane-crystal/30 text-white'
                      : 'bg-white/[0.03] border-white/5 text-text-secondary hover:bg-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <div className="font-medium text-sm">{model.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">{model.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Guardian Selection */}
          <div>
            <h3 className="text-text-secondary font-sans font-medium text-sm mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Guardian AI
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveGuardian('')}
                className={`w-full text-left p-3 rounded-xl border transition-all font-sans ${
                  !activeGuardian
                    ? 'bg-arcane-crystal/10 border-arcane-crystal/20 text-arcane-crystal'
                    : 'bg-white/[0.03] border-white/5 text-text-secondary hover:bg-white/[0.06]'
                }`}
              >
                <div className="font-medium text-sm">Standard Chat</div>
                <div className="text-xs text-text-muted mt-0.5">Direct AI interaction</div>
              </button>

              {Object.entries(GUARDIAN_PERSONALITIES).map(([id, guardian]) => {
                const ElIcon = elementIcons[guardian.element] || Sparkles
                return (
                  <button
                    key={id}
                    onClick={() => setActiveGuardian(id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all font-sans ${
                      activeGuardian === id
                        ? 'bg-arcane-fire/10 border-arcane-fire/20 text-white'
                        : 'bg-white/[0.03] border-white/5 text-text-secondary hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ElIcon className="w-3.5 h-3.5" />
                      <span className="font-medium text-sm">{guardian.name}</span>
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">{guardian.frequency} Hz</div>
                    <div className="text-xs text-text-disabled mt-0.5">{guardian.expertise[0]}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Usage Stats */}
          {(
            <div className="glow-card rounded-xl p-4">
              <h3 className="text-text-secondary font-sans font-medium text-sm mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Session Stats
              </h3>
              <div className="space-y-2 text-sm font-sans">
                <div className="flex justify-between">
                  <span className="text-text-muted">Cost Used:</span>
                  <span className="text-arcane-crystal font-medium">${totalCost.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Messages:</span>
                  <span className="text-arcane-crystal font-medium">{messages.filter((m) => m.role !== 'error').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Providers:</span>
                  <span className="text-arcane-crystal font-medium">
                    {Array.from(new Set(messages.filter((m) => m.providerId).map((m) => m.providerId))).length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={clearChat} className="flex-1 text-text-muted hover:text-white">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button variant="ghost" size="sm" onClick={exportChat} className="flex-1 text-text-muted hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="glass-strong border-b border-white/5 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-display text-white">Arcanea Chat</h1>
              <p className="text-text-muted text-sm font-sans">Multi-LLM Superagent Interface</p>
            </div>
            <div className="flex items-center gap-3">
              {[
                { id: 'claude', label: 'Claude' },
                { id: 'gpt', label: 'GPT' },
                { id: 'gemini', label: 'Gemini' },
              ].map((m) => (
                <Badge
                  key={m.id}
                  variant={activeModel === m.id ? 'crystal' : 'outline'}
                  className="text-xs font-sans"
                >
                  {m.label} {activeModel === m.id ? 'Active' : 'Ready'}
                </Badge>
              ))}
              {activeGuardian && GUARDIAN_PERSONALITIES[activeGuardian] && (
                <Badge variant="fire" className="text-xs font-sans">
                  {GUARDIAN_PERSONALITIES[activeGuardian].name}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <Sparkles className="w-12 h-12 text-arcane-crystal mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-display text-white mb-2">
                  Welcome to Arcanea Chat
                </h3>
                <p className="text-text-secondary font-body">
                  Start a conversation with our AI models or activate a Guardian AI for specialized assistance.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-2xl p-4 relative group ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-arcane-crystal/20 to-arcane-water/20 border border-arcane-crystal/20 text-white'
                      : message.role === 'error'
                        ? 'bg-red-900/20 border border-red-500/20 text-red-300'
                        : 'glass text-text-secondary'
                  }`}
                >
                  {/* Copy action */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyMessage(message.content)}
                      className="h-6 w-6 text-text-muted hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>

                  {message.role === 'error' ? (
                    <div>
                      <div className="font-sans font-medium mb-1 text-sm">Generation Error</div>
                      <div className="text-sm font-body">{message.content}</div>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm font-body whitespace-pre-wrap">{message.content}</div>

                      {message.guardianInsight && (
                        <div className="mt-3 p-3 bg-arcane-fire/10 border-l-4 border-arcane-fire rounded-lg">
                          <div className="text-xs font-sans font-medium text-arcane-fire mb-1">
                            {GUARDIAN_PERSONALITIES[activeGuardian]?.name} Insight
                          </div>
                          <div className="text-sm text-text-secondary font-body">
                            {message.guardianInsight}
                          </div>
                        </div>
                      )}

                      {message.usage && message.usage.cost !== undefined && (
                        <div className="mt-2 text-xs text-text-muted font-sans flex justify-between items-center">
                          <span>Generated with {message.providerId}</span>
                          <span>Cost: ${message.usage.cost.toFixed(4)}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex justify-start">
                <div className="glass rounded-2xl p-4 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-arcane-crystal border-t-transparent rounded-full animate-spin" />
                    <span className="text-text-secondary font-sans text-sm">
                      {activeGuardian && GUARDIAN_PERSONALITIES[activeGuardian]
                        ? `${GUARDIAN_PERSONALITIES[activeGuardian].name} is crafting response...`
                        : 'AI is thinking...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-white/5 glass-strong p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  activeGuardian && GUARDIAN_PERSONALITIES[activeGuardian]
                    ? `Chat with ${GUARDIAN_PERSONALITIES[activeGuardian].name}...`
                    : 'Enter your prompt...'
                }
                aria-label="Chat message input"
                className="flex-1 min-h-[60px] resize-none bg-white/[0.03] border-white/10 focus:border-arcane-crystal/30 rounded-xl font-body text-white placeholder:text-text-disabled"
                disabled={isGenerating}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isGenerating}
                aria-label={isGenerating ? 'Generating response' : 'Send message'}
                size="lg"
                className="h-[60px] px-6"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-cosmic-void border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2 mt-3">
              {[
                { icon: FileText, label: 'Generate Story' },
                { icon: UserPlus, label: 'Create Character' },
                { icon: MapPin, label: 'Design Location' },
                { icon: ImagePlus, label: 'Add Image' },
              ].map((action) => (
                <Button key={action.label} variant="ghost" size="sm" className="text-text-muted hover:text-white font-sans text-xs">
                  <action.icon className="w-3.5 h-3.5 mr-1.5" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
