'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { GENERATION_STYLES } from '@/lib/ai/client'
import {
  Sparkles,
  FileText,
  Image,
  Video,
  Music,
  Clock,
  DollarSign,
} from 'lucide-react'

const tabConfig = [
  { id: 'text' as const, name: 'Text', icon: FileText },
  { id: 'image' as const, name: 'Image', icon: Image },
  { id: 'video' as const, name: 'Video', icon: Video },
  { id: 'audio' as const, name: 'Audio', icon: Music },
]

export default function ImagineInterface() {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'video' | 'audio'>('image')
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  interface GenerationHistoryItem {
    id: string
    type: 'text' | 'image' | 'video' | 'audio'
    prompt: string
    result: string
    timestamp: number
    provider: string
    usage?: {
      tokens?: number
      cost?: number
      generationTime?: number
    }
  }

  const [generationHistory, setGenerationHistory] = useState<GenerationHistoryItem[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    try {
      // Route to appropriate API endpoint based on active tab
      const endpoint = activeTab === 'text' ? '/api/chat' : '/api/imagine'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          activeTab === 'text'
            ? { message: prompt }
            : { prompt, style: selectedStyle, quality: 'standard' }
        ),
      })

      if (!res.ok) throw new Error(`Generation failed: ${res.status}`)

      let resultText = ''
      if (activeTab === 'text') {
        // Stream text response
        const reader = res.body?.getReader()
        const decoder = new TextDecoder()
        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value, { stream: true })
            for (const line of chunk.split('\n')) {
              if (line.startsWith('0:')) {
                try { resultText += JSON.parse(line.slice(2)) } catch {}
              }
            }
          }
        }
      } else {
        const data = await res.json()
        resultText = data.images?.[0]
          ? `data:${data.images[0].mimeType};base64,${data.images[0].data}`
          : data.text || 'Generation complete'
      }

      const newGeneration: GenerationHistoryItem = {
        id: Date.now().toString(),
        type: activeTab,
        prompt,
        provider: 'gemini',
        result: resultText,
        timestamp: Date.now(),
      }

      setGenerationHistory((prev) => [newGeneration, ...prev])
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getProviderOptions = () => {
    switch (activeTab) {
      case 'text':
        return [
          { id: 'claude', name: 'Claude 3.5 Sonnet', desc: 'Analytical & Creative' },
          { id: 'gpt', name: 'GPT-4 Turbo', desc: 'Versatile & Fast' },
          { id: 'gemini', name: 'Gemini Pro', desc: 'Multimodal' },
        ]
      case 'image':
        return [
          { id: 'dalle', name: 'DALL-E 3', desc: 'High Quality' },
          { id: 'midjourney', name: 'Midjourney', desc: 'Artistic Excellence' },
          { id: 'stable', name: 'Stable Diffusion', desc: 'Cost Effective' },
        ]
      case 'video':
        return [
          { id: 'runway', name: 'Runway Gen-2', desc: 'Premium Video' },
          { id: 'pika', name: 'Pika Labs', desc: 'Character Animation' },
        ]
      case 'audio':
        return [
          { id: 'suno', name: 'Suno AI', desc: 'Music Generation' },
          { id: 'elevenlabs', name: 'ElevenLabs', desc: 'Voice Synthesis' },
        ]
      default:
        return []
    }
  }

  const getStyleOptions = () => {
    return GENERATION_STYLES[activeTab] || []
  }

  const getTypeIcon = (type: string) => {
    const config = tabConfig.find((t) => t.id === type)
    return config?.icon || Sparkles
  }

  return (
    <div className="min-h-screen bg-cosmic-void">
      {/* Background */}
      <div className="fixed inset-0 bg-cosmic-mesh" />

      {/* Header */}
      <div className="relative glass-strong border-b border-white/5 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-display text-white mb-1">Imagine Studio</h1>
          <p className="text-text-muted text-sm font-sans">Multi-Modal Generation Suite</p>
        </div>
      </div>

      <div className="relative flex h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <div className="w-96 glass-strong border-r border-white/5 p-6 overflow-y-auto">
          {/* Tab selection */}
          <div className="mb-6">
            <h3 className="text-text-secondary font-sans font-medium text-sm mb-3">Generation Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {tabConfig.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-3 rounded-xl border transition-all font-sans ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-arcane-crystal/20 to-arcane-water/20 border-arcane-crystal/30 text-white'
                        : 'bg-white/[0.03] border-white/5 text-text-secondary hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-1" />
                    <div className="text-sm font-medium">{tab.name}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Provider selection */}
          <div className="mb-6">
            <h3 className="text-text-secondary font-sans font-medium text-sm mb-3">AI Provider</h3>
            <div className="space-y-2">
              {getProviderOptions().map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all font-sans ${
                    selectedProvider === provider.id
                      ? 'bg-arcane-crystal/10 border-arcane-crystal/20 text-arcane-crystal'
                      : 'bg-white/[0.03] border-white/5 text-text-secondary hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="font-medium text-sm">{provider.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">{provider.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Style selection */}
          {getStyleOptions().length > 0 && (
            <div className="mb-6">
              <h3 className="text-text-secondary font-sans font-medium text-sm mb-3">Style</h3>
              <div className="grid grid-cols-2 gap-2">
                {getStyleOptions().map((style: string) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`p-2 rounded-lg border text-xs transition-all font-sans ${
                      selectedStyle === style
                        ? 'bg-arcane-crystal/10 border-arcane-crystal/20 text-arcane-crystal'
                        : 'bg-white/[0.03] border-white/5 text-text-secondary hover:bg-white/[0.06]'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Prompt input */}
          <div className="mb-6">
            <h3 className="text-text-secondary font-sans font-medium text-sm mb-3">Prompt</h3>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
              className="min-h-[100px] bg-white/[0.03] border-white/10 focus:border-arcane-crystal/30 rounded-xl font-body text-white placeholder:text-text-disabled"
            />
          </div>

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-cosmic-void border-t-transparent rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </>
            )}
          </Button>

          {/* Usage stats */}
          {(
            <div className="mt-6 glow-card rounded-xl p-4">
              <h3 className="text-text-secondary font-sans font-medium text-sm mb-2">Session Stats</h3>
              <div className="space-y-1 text-sm font-sans">
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Cost:</span>
                  <span className="text-arcane-crystal">${(generationHistory.length * 0.04).toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Generations:</span>
                  <span className="text-arcane-crystal">{generationHistory.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Generation history grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generationHistory.map((gen) => {
                const TypeIcon = getTypeIcon(gen.type)
                return (
                  <div key={gen.id} className="glow-card rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="capitalize font-sans text-xs">
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {gen.type}
                      </Badge>
                      <Badge variant="crystal" className="font-sans text-xs">
                        {gen.provider}
                      </Badge>
                    </div>

                    <p className="text-text-secondary text-sm font-body line-clamp-2 mb-3">{gen.prompt}</p>

                    {/* Result display */}
                    <div className="bg-white/[0.03] rounded-xl p-4 min-h-[100px] flex items-center justify-center border border-white/5">
                      {gen.type === 'text' && (
                        <div className="text-text-secondary text-sm font-body">
                          {gen.result?.substring(0, 200)}...
                        </div>
                      )}
                      {gen.type === 'image' && (
                        <div className="w-full h-32 bg-cosmic-surface rounded-lg flex items-center justify-center">
                          <Image className="w-8 h-8 text-text-disabled" />
                        </div>
                      )}
                      {gen.type === 'video' && (
                        <div className="w-full h-32 bg-cosmic-surface rounded-lg flex items-center justify-center">
                          <Video className="w-8 h-8 text-text-disabled" />
                        </div>
                      )}
                      {gen.type === 'audio' && (
                        <div className="w-full h-32 bg-cosmic-surface rounded-lg flex items-center justify-center">
                          <Music className="w-8 h-8 text-text-disabled" />
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex justify-between items-center text-xs font-sans text-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(gen.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="flex items-center gap-1 text-arcane-crystal">
                        <DollarSign className="w-3 h-3" />
                        {gen.usage?.cost?.toFixed(4) ?? '0.0000'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Empty state */}
            {generationHistory.length === 0 && (
              <div className="text-center py-24">
                <Sparkles className="w-16 h-16 text-arcane-crystal/30 mx-auto mb-6" />
                <h3 className="text-fluid-2xl font-display text-white mb-3">Ready to Create</h3>
                <p className="text-text-secondary font-body mb-8 max-w-md mx-auto">
                  Start generating amazing content with Arcanea&apos;s multi-modal AI suite
                </p>
                <div className="flex justify-center gap-3">
                  <Badge variant="outline" className="font-sans">DALL-E 3</Badge>
                  <Badge variant="outline" className="font-sans">Midjourney</Badge>
                  <Badge variant="outline" className="font-sans">Runway</Badge>
                  <Badge variant="outline" className="font-sans">Suno AI</Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
